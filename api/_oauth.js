// Autenticação OAuth usada apenas pelas funções do servidor.
// Nenhuma variável deste arquivo deve usar o prefixo VITE_.

export const WAKATIME_API = 'https://wakatime.com/api/v1'

const OAUTH_TOKEN_URL = 'https://wakatime.com/oauth/token'
const REFRESH_TIMEOUT_MS = 8_000

const limpar = (valor) => String(valor ?? '').trim()

let tokenRenovado
let renovacaoEmAndamento

export const temAccessToken = (env) =>
    Boolean(limpar(env.WAKATIME_ACCESS_TOKEN))

const tokenAtual = (env) =>
    tokenRenovado ?? limpar(env.WAKATIME_ACCESS_TOKEN)

const podeRenovar = (env) =>
    Boolean(
        limpar(env.WAKATIME_APP_ID)
        && limpar(env.WAKATIME_APP_SECRET)
        && limpar(env.WAKATIME_REFRESH_TOKEN),
    )

function interpretarToken(texto) {
    try {
        return JSON.parse(texto)
    } catch {
        return Object.fromEntries(new URLSearchParams(texto))
    }
}

function renovarToken(env) {
    if (renovacaoEmAndamento) return renovacaoEmAndamento

    renovacaoEmAndamento = (async () => {
        const resposta = await fetch(OAUTH_TOKEN_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: limpar(env.WAKATIME_APP_ID),
                client_secret: limpar(env.WAKATIME_APP_SECRET),
                grant_type: 'refresh_token',
                refresh_token: limpar(env.WAKATIME_REFRESH_TOKEN),
            }),
            signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
        })

        const texto = await resposta.text()
        if (!resposta.ok) {
            throw new Error(`WakaTime OAuth respondeu HTTP ${resposta.status}`)
        }

        const dados = interpretarToken(texto)
        if (!dados.access_token) {
            throw new Error('WakaTime OAuth respondeu sem access_token')
        }

        tokenRenovado = dados.access_token
        console.warn(
            'WakaTime: access token renovado apenas nesta instância. Atualize as variáveis da Vercel quando necessário.',
        )
    })().finally(() => {
        renovacaoEmAndamento = null
    })

    return renovacaoEmAndamento
}

export async function fetchWakaTime(
    caminho,
    env,
    { timeout = 10_000 } = {},
) {
    const requisitar = () =>
        fetch(`${WAKATIME_API}${caminho}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${tokenAtual(env)}`,
            },
            signal: AbortSignal.timeout(timeout),
        })

    const resposta = await requisitar()

    if (resposta.status === 401 && podeRenovar(env)) {
        try {
            await renovarToken(env)
        } catch (erro) {
            console.error('WakaTime OAuth:', erro?.message ?? erro)
            return resposta
        }

        return requisitar()
    }

    return resposta
}
