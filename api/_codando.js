// Monta o estado público de "Codando agora" a partir dos heartbeats privados.
// O caminho do arquivo editado nunca é devolvido ao navegador.
// O "_" no nome impede a Vercel de transformar o arquivo em rota.

import WAKATIME_CONFIG from '../src/config/WakatimeConfig.js'
import { fetchWakaTime, temAccessToken } from './_oauth.js'

const { CODING_NOW } = WAKATIME_CONFIG

export const CODANDO_PATH = CODING_NOW.API_PATH

const USUARIO_ATUAL = '/users/current'
const TIMEOUT_MS = 8_000
const CACHE_MS = 60 * 1000
const CACHE_EDITORES_MS = 60 * 60 * 1000
const ATIVO_SEGUNDOS = CODING_NOW.ACTIVE_MINUTES * 60
const PAUSA_SEGUNDOS = CODING_NOW.BREAK_MINUTES * 60

function responder(res, status, corpo, cache = 'no-store') {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', cache)
    res.end(JSON.stringify(corpo))
}

const textoSeguro = (valor, limite = 120) => {
    const texto = String(valor ?? '').trim()
    return texto ? texto.slice(0, limite) : null
}

const chaveEditor = (valor) => String(valor ?? '')

const NOMES_EDITORES = {
    vscode: 'VS Code',
    cursor: 'Cursor',
    windsurf: 'Windsurf',
    vscodium: 'VSCodium',
    zed: 'Zed',
    vim: 'Vim',
    neovim: 'Neovim',
    emacs: 'Emacs',
    sublime: 'Sublime Text',
    intellij: 'IntelliJ IDEA',
    idea: 'IntelliJ IDEA',
    pycharm: 'PyCharm',
    webstorm: 'WebStorm',
    androidstudio: 'Android Studio',
    xcode: 'Xcode',
    eclipse: 'Eclipse',
    visualstudio: 'Visual Studio',
    jupyter: 'Jupyter',
}

function nomeEditor(valor) {
    const texto = textoSeguro(valor, 60)
    if (!texto) return null

    const chave = texto.toLowerCase().replace(/[\s_-]/g, '')
    return NOMES_EDITORES[chave]
        ?? texto.charAt(0).toUpperCase() + texto.slice(1)
}

function partesNoFuso(ms, opcoes) {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: CODING_NOW.TIMEZONE,
        ...opcoes,
    }).formatToParts(new Date(ms))

    return Object.fromEntries(
        partes
            .filter(({ type }) => type !== 'literal')
            .map(({ type, value }) => [type, value]),
    )
}

// "2026-10-26" no fuso da conta do WakaTime
function diaNoFuso(ms) {
    const { year, month, day } = partesNoFuso(ms, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    return `${year}-${month}-${day}`
}

function minutosDesdeMeiaNoite(ms) {
    const { hour, minute } = partesNoFuso(ms, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    })
    return Number(hour) * 60 + Number(minute)
}

// Lista do config + variável WAKATIME_PUBLIC_PROJECTS ("a, b, c")
function projetosPublicos(env) {
    const extras = String(env.WAKATIME_PUBLIC_PROJECTS ?? '')
        .split(',')
        .map((nome) => nome.trim())
        .filter(Boolean)

    return new Set(
        [...CODING_NOW.PUBLIC_PROJECTS, ...extras]
            .map((nome) => nome.toLocaleLowerCase('en-US')),
    )
}

async function chamarWakaTime(caminho, env) {
    const resposta = await fetchWakaTime(
        `${USUARIO_ATUAL}${caminho}`,
        env,
        { timeout: TIMEOUT_MS },
    )

    if (!resposta.ok) {
        const erro = new Error(`WakaTime respondeu HTTP ${resposta.status}`)
        erro.status = resposta.status
        throw erro
    }

    let json
    try {
        json = await resposta.json()
    } catch {
        const erro = new Error('WakaTime respondeu com JSON inválido')
        erro.status = 502
        throw erro
    }

    if (!Array.isArray(json?.data)) {
        const erro = new Error('WakaTime respondeu sem uma lista de dados')
        erro.status = 502
        throw erro
    }

    return json.data
}

// id do user agent → nome do editor. Muda pouco: 1 h de cache.
let editores = { salvoEm: 0, mapa: new Map() }

async function mapaDeEditores(env) {
    if (Date.now() - editores.salvoEm < CACHE_EDITORES_MS) {
        return editores.mapa
    }

    try {
        const lista = await chamarWakaTime('/user_agents', env)
        const mapa = new Map()

        for (const item of lista) {
            if (item?.id == null) continue
            mapa.set(chaveEditor(item.id), nomeEditor(item.editor))
        }

        editores = { salvoEm: Date.now(), mapa }
    } catch (erro) {
        // Falhar ao descobrir o editor não impede o restante do cartão.
        console.error('WakaTime (editores):', erro?.message ?? erro)
    }

    return editores.mapa
}

// Só heartbeats de arquivo contam. O caminho (entity) é descartado aqui.
function normalizarHeartbeat(item) {
    const tempo = Number(item?.time)
    if (item?.type !== 'file' || !Number.isFinite(tempo)) return null

    return {
        time: tempo,
        project: textoSeguro(item.project),
        branch: textoSeguro(item.branch, 100),
        language: textoSeguro(item.language, 60),
        userAgentId: item.user_agent_id,
    }
}

async function heartbeatsDoDia(dia, env) {
    const lista = await chamarWakaTime(
        `/heartbeats?date=${encodeURIComponent(dia)}`,
        env,
    )

    return lista
        .map(normalizarHeartbeat)
        .filter(Boolean)
        .sort((a, b) => a.time - b.time)
}

// Soma os intervalos menores que a pausa, como o WakaTime faz (aproximado)
function somarSegundos(heartbeats) {
    let total = 0

    for (let indice = 1; indice < heartbeats.length; indice += 1) {
        const intervalo = heartbeats[indice].time - heartbeats[indice - 1].time
        if (intervalo > 0 && intervalo < PAUSA_SEGUNDOS) total += intervalo
    }

    return Math.round(total)
}

// Volta do último heartbeat até achar uma pausa: ali começou a sessão
function inicioDaSessao(heartbeats) {
    let indice = heartbeats.length - 1

    while (
        indice > 0
        && heartbeats[indice].time - heartbeats[indice - 1].time
            < PAUSA_SEGUNDOS
    ) {
        indice -= 1
    }

    return heartbeats[indice].time
}

async function montarEstado(env) {
    const agora = Date.now()
    const hoje = diaNoFuso(agora)

    const [heartbeatsHoje, editorPorId] = await Promise.all([
        heartbeatsDoDia(hoje, env),
        mapaDeEditores(env),
    ])

    let heartbeats = heartbeatsHoje

    // Logo depois da meia-noite, a sessão pode ter começado ontem
    if (
        minutosDesdeMeiaNoite(agora)
        < CODING_NOW.BREAK_MINUTES + CODING_NOW.ACTIVE_MINUTES
    ) {
        const ontem = diaNoFuso(agora - 24 * 60 * 60 * 1000)
        heartbeats = [
            ...await heartbeatsDoDia(ontem, env),
            ...heartbeatsHoje,
        ]
    }

    const todaySeconds = somarSegundos(heartbeatsHoje)
    const ultimo = heartbeats.at(-1)

    if (!ultimo) return { active: false, todaySeconds, last: null }

    const permitidos = projetosPublicos(env)
    const nomeNormalizado = ultimo.project?.toLocaleLowerCase('en-US')
    const isPublic = Boolean(
        nomeNormalizado
        && (permitidos.has('*') || permitidos.has(nomeNormalizado)),
    )

    if (!isPublic && !CODING_NOW.SHOW_PRIVATE) {
        return { active: false, todaySeconds, last: null }
    }

    const projetoHoje = ultimo.project
        ? heartbeatsHoje.filter(({ project }) => project === ultimo.project)
        : []

    return {
        active: agora / 1000 - ultimo.time <= ATIVO_SEGUNDOS,
        todaySeconds,
        last: {
            isPublic,
            project: isPublic ? ultimo.project : null,
            branch: isPublic ? ultimo.branch : null,
            language: ultimo.language,
            editor: editorPorId.get(chaveEditor(ultimo.userAgentId)) ?? null,
            at: Math.round(ultimo.time * 1000),
            sessionStart: Math.round(inicioDaSessao(heartbeats) * 1000),
            projectTodaySeconds: somarSegundos(projetoHoje),
        },
    }
}

// Vários visitantes no mesmo minuto: uma chamada só ao WakaTime
let cache = { salvoEm: 0, dados: null, promessa: null }

async function obterEstado(env) {
    if (cache.dados && Date.now() - cache.salvoEm < CACHE_MS) {
        return cache.dados
    }

    if (!cache.promessa) {
        cache.promessa = montarEstado(env)
            .then((dados) => {
                cache = { salvoEm: Date.now(), dados, promessa: null }
                return dados
            })
            .catch((erro) => {
                cache.promessa = null
                throw erro
            })
    }

    return cache.promessa
}

export async function handleCodando(req, res, env = {}) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return responder(res, 405, {
            error: 'method_not_allowed',
            message: 'Use GET.',
        })
    }

    if (!temAccessToken(env)) {
        return responder(res, 503, {
            error: 'missing_token',
            message: 'Configure WAKATIME_ACCESS_TOKEN no servidor.',
        })
    }

    try {
        const dados = await obterEstado(env)
        return responder(
            res,
            200,
            dados,
            'public, max-age=0, s-maxage=60, stale-while-revalidate=60',
        )
    } catch (erro) {
        console.error('WakaTime (codando agora):', erro?.message ?? erro)

        if (erro?.status === 401) {
            return responder(res, 401, {
                error: 'invalid_token',
                message: 'Token OAuth do WakaTime inválido ou revogado.',
            })
        }

        if (erro?.status === 403) {
            return responder(res, 403, {
                error: 'forbidden',
                message: 'O token precisa do escopo read_heartbeats.',
            })
        }

        return responder(res, 502, {
            error: 'upstream_error',
            message: 'Não foi possível consultar o WakaTime agora.',
        })
    }
}
