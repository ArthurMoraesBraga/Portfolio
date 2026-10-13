import { Component,
    useEffect,
    useMemo,
    useRef,
    useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
    FaCodeBranch,
    FaGithub,
    FaStar } from 'react-icons/fa'
import CONFIG from '../config/GithubConfig'
import {
    SECOES,
    SECAO_PADRAO,
    ORDEM_SEMANA,
    CORES_LINGUAGENS,
    COR_OUTRAS,
    METODOLOGIA,
} from '../data/github'
import {
    GitHubLimiteError,
    agruparOutras,
    commitsFonte,
    contagensFonte,
    contribuicoesFonte,
    perfilFonte,
    resumirLinguagens,
} from '../utils/GithubStats'
import './Github.css'

import Wakatime from '../components/Wakatime'
import { comoLista, formatadorData, formatadorNumero, paraPlural } from '../utils/localizacao'


const { USUARIO, URL_PERFIL, LIMITES } = CONFIG

/* =====================================================================
   Formatação (idioma escolhido; horários sempre no fuso de São Paulo)
   ===================================================================== */

// Os formatadores são buscados a cada chamada: assim, ao trocar PT/EN, a próxima
// renderização já usa o idioma novo. Datas "civis" (só o dia) usam UTC para não escorregar.
const fNumero = () => formatadorNumero()
const fPercentual = () => formatadorNumero({ maximumFractionDigits: 1 })
const fDiaMes = () => formatadorData({ day: 'numeric', month: 'short', timeZone: 'UTC' })
const fData = () => formatadorData({ day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const fMes = () => formatadorData({ month: 'short', timeZone: 'UTC' })
const fHoraMinuto = () => formatadorData({ hour: '2-digit', minute: '2-digit' })

const meioDia = (chave) => new Date(`${chave}T12:00:00Z`)
const numero = (valor) => fNumero().format(Math.round(valor))
const percentual = (valor) => `${fPercentual().format(valor)}%`
const diaMes = (chave) => (chave ? fDiaMes().format(meioDia(chave)).replace('.', '') : '')
const data = (chave) => (chave ? fData().format(meioDia(chave)).replaceAll('.', '') : '')
const mes = (chave) => fMes().format(meioDia(chave)).replace('.', '')
const hora = (h) => `${h}h`
const faixaHora = (h) => `${hora(h)}–${hora((h + 1) % 24)}`

// Quantidade com a unidade no singular ou no plural, vinda das traduções (github.unidades.*)
const plural = (t, unidade, n) => t(`github.unidades.${unidade}`, { count: paraPlural(n), n: numero(n) })

/* =====================================================================
   Busca de dados e estados (carregando, erro, limite)
   ===================================================================== */

// Cada fonte é buscada uma vez por visita (cache em githubStats.js): trocar de
// aba reaproveita o que já chegou, sem nova consulta.
function useFonte(fonte) {
    const [estado, setEstado] = useState(() => {
        const dados = fonte.peek()
        return dados ? { status: 'pronto', dados } : { status: 'carregando' }
    })
    const [tentativa, setTentativa] = useState(0)

    useEffect(() => {
        if (fonte.peek()) return undefined
        let ativo = true
        fonte
            .carregar()
            .then((dados) => ativo && setEstado({ status: 'pronto', dados }))
            .catch((erro) => {
                if (!ativo) return
                const limite = erro instanceof GitHubLimiteError
                setEstado({ status: limite ? 'limite' : 'erro', erro })
            })
        return () => {
            ativo = false
        }
    }, [fonte, tentativa])

    const tentarDeNovo = () => {
        setEstado({ status: 'carregando' })
        setTentativa((n) => n + 1)
    }
    return { ...estado, tentarDeNovo }
}

const quandoLibera = (erro) => (erro?.resetEm ? fHoraMinuto().format(erro.resetEm) : null)

function Estado({ estado }) {
    const { t } = useTranslation()
    const { status, erro, tentarDeNovo } = estado
    if (status === 'carregando') {
        return (
            <p className="gh-estado" role="status">
                {t('github.textos.carregando')}
            </p>
        )
    }
    const liberaAs = status === 'limite' ? quandoLibera(erro) : null
    return (
        <div className={`gh-estado gh-estado--${status} papel`} role="alert">
            <p>
                {status === 'limite' ? t('github.textos.limite') : t('github.textos.erro')}
                {liberaAs && ` ${t('github.estado.liberacao', { hora: liberaAs })}`}
            </p>
            <button type="button" className="botao botao--secundario" onClick={tentarDeNovo}>
                {t('github.textos.tentarDeNovo')}
            </button>
        </div>
    )
}

function Vazio({ children }) {
    const { t } = useTranslation()
    return (
        <p className="gh-vazio" role="status">
            {children ?? t('github.textos.vazio')}
        </p>
    )
}

function MensagemErro() {
    const { t } = useTranslation()
    return <p>{t('github.textos.erro')}</p>
}

// Se a API mandar algo num formato inesperado, o erro fica só na seção
class SecaoComErro extends Component {
    state = { falhou: false }
    static getDerivedStateFromError() {
        return { falhou: true }
    }
    componentDidCatch(erro) {
        console.error('GitHub:', erro)
    }
    render() {
        return this.state.falhou ? (
            <div className="gh-estado gh-estado--erro papel" role="alert">
                <MensagemErro />
            </div>
        ) : (
            this.props.children
        )
    }
}

/* =====================================================================
   Colunas (contribuições por ano, commits por hora)
   ===================================================================== */

// O maior valor fica destacado e com o número em cima. Passar o mouse, tocar ou
// usar ← → (com o gráfico focado) mostra o valor de cada coluna na linha de leitura.
// A tabela escondida leva os mesmos valores ao leitor de tela.
function Colunas({ itens, valor, leitura, eixo, topo, legenda, classe = '' }) {
    const [ativo, setAtivo] = useState(null)
    if (itens.length === 0) return null

    const valores = itens.map(valor)
    const maximo = Math.max(...valores, 0) || 1
    const pico = valores.indexOf(Math.max(...valores))
    const mostrado = ativo ?? pico

    const aoTeclar = (evento) => {
        const passo = { ArrowRight: 1, ArrowLeft: -1 }[evento.key]
        if (!passo) return
        evento.preventDefault()
        setAtivo((atual) => Math.min(itens.length - 1, Math.max(0, (atual ?? pico) + passo)))
    }

    return (
        <figure className={`gh-colunas ${classe}`}>
            <figcaption className="gh-leitura" aria-hidden="true">
                {leitura(itens[mostrado], mostrado)}
            </figcaption>
            <div
                className="gh-colunas-area"
                role="img"
                aria-label={legenda}
                tabIndex={0}
                onKeyDown={aoTeclar}
                onBlur={() => setAtivo(null)}
                onPointerLeave={() => setAtivo(null)}
                style={{ '--n': itens.length }}
            >
                {itens.map((item, indice) => (
                    <div
                        key={indice}
                        className={['gh-coluna', indice === pico && 'gh-coluna--pico', indice === ativo && 'gh-coluna--ativa']
                            .filter(Boolean)
                            .join(' ')}
                        style={{ '--h': `${(valores[indice] / maximo) * 100}%`, '--i': indice }}
                        onPointerEnter={() => setAtivo(indice)}
                        onPointerDown={() => setAtivo(indice)}
                    >
                        {indice === pico && valores[indice] > 0 && (
                            <span className="gh-coluna-topo">{topo(item)}</span>
                        )}
                        <span className="gh-coluna-barra" />
                    </div>
                ))}
            </div>
            <div className="gh-colunas-eixo" aria-hidden="true" style={{ '--n': itens.length }}>
                {itens.map((item, indice) => (
                    <span key={indice}>{eixo(item, indice)}</span>
                ))}
            </div>
            {/* A div é que fica escondida: um <table> ignora overflow e alargaria a página */}
            <div className="visualmente-oculto">
                <table>
                    <caption>{legenda}</caption>
                    <tbody>
                        {itens.map((item, indice) => (
                            <tr key={indice}>
                                <td>{leitura(item, indice)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </figure>
    )
}

/* =====================================================================
   Resumo: perfil + indicadores
   ===================================================================== */

function Perfil({ usuario }) {
    const { t } = useTranslation()
    const meta = [
        usuario.empresa,
        usuario.local,
        usuario.criadoEm && t('github.perfil.desde', { ano: usuario.criadoEm.slice(0, 4) }),
    ].filter(Boolean)

    return (
        <div className="gh-perfil papel">
            <img className="gh-avatar" src={`${usuario.avatar}${usuario.avatar.includes('?') ? '&' : '?'}s=160`} alt="" width="72" height="72" loading="lazy" />
            <div className="gh-perfil-texto">
                <p className="gh-perfil-nome">
                    {usuario.nome}{' '}
                    <a href={usuario.url} target="_blank" rel="noopener noreferrer">
                        <FaGithub aria-hidden="true" /> @{usuario.login}
                        <span className="visualmente-oculto"> {t('comum.abreEmNovaAbaParenteses')}</span>
                    </a>
                </p>
                {usuario.bio && <p className="gh-perfil-bio">{usuario.bio}</p>}
                {meta.length > 0 && (
                    <p className="gh-perfil-meta">
                        {meta.map((texto) => (
                            <span key={texto}>{texto}</span>
                        ))}
                    </p>
                )}
            </div>
        </div>
    )
}

function Indicador({ rotulo, estado, valor, nota }) {
    const { t } = useTranslation()
    const pronto = estado.status === 'pronto'
    return (
        <li className="gh-indicador papel">
            <span className="gh-indicador-rotulo">{rotulo}</span>
            <span className="gh-indicador-valor">
                {pronto ? valor(estado.dados) : estado.status === 'carregando' ? '…' : '—'}
            </span>
            <span className="gh-indicador-nota">
                {pronto ? nota(estado.dados) : estado.status === 'carregando' ? '\u00a0' : t('github.textos.indisponivel')}
            </span>
        </li>
    )
}

function Resumo() {
    const { t } = useTranslation()
    const perfil = useFonte(perfilFonte)
    const contribuicoes = useFonte(contribuicoesFonte)
    const commits = useFonte(commitsFonte)
    const contagens = useFonte(contagensFonte)
    const fontes = [
        ['perfil', perfil],
        ['contribuicoes', contribuicoes],
        ['commits', commits],
        ['contagens', contagens],
    ]
    const falhas = fontes.filter(([, e]) => e.status === 'erro' || e.status === 'limite')
    const limite = falhas.find(([, e]) => e.status === 'limite')?.[1]

    return (
        <>
            {perfil.status === 'pronto' && <Perfil usuario={perfil.dados.usuario} />}

            <ul className="gh-indicadores">
                <Indicador
                    rotulo={t('github.indicadores.repos.rotulo')}
                    estado={perfil}
                    valor={(p) => numero(p.repos.length)}
                    nota={(p) =>
                        p.forksIgnorados
                            ? t('github.indicadores.repos.notaForks', { count: paraPlural(p.forksIgnorados), n: numero(p.forksIgnorados) })
                            : t('github.indicadores.repos.notaSemForks')
                    }
                />
                <Indicador rotulo={t('github.indicadores.estrelas.rotulo')} estado={perfil} valor={(p) => numero(p.estrelas)} nota={() => t('github.indicadores.estrelas.nota')} />
                <Indicador rotulo={t('github.indicadores.forks.rotulo')} estado={perfil} valor={(p) => numero(p.forks)} nota={() => t('github.indicadores.forks.nota')} />
                <Indicador
                    rotulo={t('github.indicadores.seguidores.rotulo')}
                    estado={perfil}
                    valor={(p) => numero(p.usuario.seguidores)}
                    nota={(p) => t('github.indicadores.seguidores.nota', { n: numero(p.usuario.seguindo) })}
                />
                <Indicador
                    rotulo={t('github.indicadores.contribuicoes.rotulo')}
                    estado={contribuicoes}
                    valor={(c) => numero(c.janela.total)}
                    nota={(c) => t('comum.intervalo', { de: data(c.janela.inicio), ate: data(c.janela.fim) })}
                />
                <Indicador
                    rotulo={t('github.indicadores.commits.rotulo')}
                    estado={commits}
                    valor={(c) => numero(c.total)}
                    nota={(c) => t('comum.intervalo', { de: data(c.inicio), ate: data(c.fim) })}
                />
                <Indicador rotulo={t('github.indicadores.pullRequests.rotulo')} estado={contagens} valor={(c) => numero(c.pullRequests)} nota={() => t('github.indicadores.pullRequests.nota')} />
                <Indicador rotulo={t('github.indicadores.issues.rotulo')} estado={contagens} valor={(c) => numero(c.issues)} nota={() => t('github.indicadores.issues.nota')} />
                <Indicador
                    rotulo={t('github.indicadores.diasAtivos.rotulo')}
                    estado={contribuicoes}
                    valor={(c) => numero(c.janela.diasAtivos)}
                    nota={(c) => t('comum.intervalo', { de: data(c.janela.inicio), ate: data(c.hoje) })}
                />
                <Indicador
                    rotulo={t('github.indicadores.maiorSequencia.rotulo')}
                    estado={contribuicoes}
                    valor={(c) => plural(t, 'dia', c.maiorSequencia.tamanho)}
                    nota={(c) =>
                        c.maiorSequencia.tamanho
                            ? `${diaMes(c.maiorSequencia.inicio)} – ${data(c.maiorSequencia.fim)}`
                            : t('github.indicadores.maiorSequencia.semSequencia')
                    }
                />
            </ul>

            {falhas.length > 0 && (
                <div className="gh-aviso papel" role="status">
                    <p>
                        {t('github.aviso.falhas', { lista: falhas.map(([nome]) => t(`github.aviso.fontes.${nome}`)).join(', ') })}
                        {limite && quandoLibera(limite.erro) && ` ${t('github.aviso.limite', { hora: quandoLibera(limite.erro) })}`}
                    </p>
                    <button type="button" className="botao botao--secundario" onClick={() => falhas.forEach(([, e]) => e.tentarDeNovo())}>
                        {t('github.textos.tentarDeNovo')}
                    </button>
                </div>
            )}

            <p className="gh-nota">{t('github.textos.diferencaContribuicoes')}</p>
        </>
    )
}

/* =====================================================================
   Linguagens: disco com uma fatia por linguagem
   ===================================================================== */

// Disco de vinil: sulcos escuros, fatias coloridas no lugar da área gravada
// e a etiqueta no centro com o total de repositórios.
function DiscoLinguagens({ itens, total }) {
    const { t } = useTranslation()
    // Onde cada fatia começa: soma dos percentuais das anteriores
    const inicios = itens.map((_, indice) => itens.slice(0, indice).reduce((soma, i) => soma + i.percentual, 0))
    return (
        <svg className="gh-disco-svg" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="#171717" />
            {[90, 84, 78].map((r) => (
                <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#303030" strokeWidth="0.8" />
            ))}
            <g transform="rotate(-90 100 100)">
                {itens.map((item, indice) => {
                    const trecho = Math.max(item.percentual - 0.8, 0.3)
                    return (
                        <circle
                            key={item.nome}
                            cx="100"
                            cy="100"
                            r="62"
                            fill="none"
                            strokeWidth="26"
                            pathLength="100"
                            stroke={item.outras ? COR_OUTRAS : CORES_LINGUAGENS[indice % CORES_LINGUAGENS.length]}
                            strokeDasharray={`${trecho} ${100 - trecho}`}
                            strokeDashoffset={-inicios[indice]}
                        />
                    )
                })}
            </g>
            <circle cx="100" cy="100" r="30" fill="#a8b5a0" />
            <text x="100" y="94" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#263329">
                {total}
            </text>
            <text x="100" y="118" textAnchor="middle" fontFamily="sans-serif" fontSize="8" letterSpacing="1" fill="#263329">
                {t('github.linguagens.repos')}
            </text>
            <circle cx="100" cy="100" r="3" fill="#eee9df" />
        </svg>
    )
}

function LinguagensConteudo({ dados }) {
    const { t } = useTranslation()
    const resumo = useMemo(() => resumirLinguagens(dados.repos), [dados])
    const itens = useMemo(() => agruparOutras(resumo.itens), [resumo])

    if (resumo.total === 0) return <Vazio>{t('github.linguagens.nenhuma')}</Vazio>

    const total = plural(t, 'repositorioPublico', resumo.total)

    return (
        <>
            <p className="gh-resumo">
                {resumo.semLinguagem > 0 ? (
                    <Trans
                        i18nKey="github.linguagens.resumoComExcecao"
                        count={paraPlural(resumo.semLinguagem)}
                        values={{ total, n: numero(resumo.semLinguagem) }}
                        components={{ strong: <strong /> }}
                    />
                ) : (
                    <Trans i18nKey="github.linguagens.resumo" values={{ total }} components={{ strong: <strong /> }} />
                )}
            </p>

            <div className="gh-linguagens">
                <div className="gh-disco" role="img" aria-label={t('github.linguagens.discoAria', { n: itens.length })}>
                    <DiscoLinguagens itens={itens} total={resumo.total} />
                </div>

                <ul className="gh-legenda">
                    {itens.map((item, indice) => (
                        <li key={item.nome}>
                            <span
                                className="gh-legenda-cor"
                                style={{ background: item.outras ? COR_OUTRAS : CORES_LINGUAGENS[indice % CORES_LINGUAGENS.length] }}
                                aria-hidden="true"
                            />
                            <span className="gh-legenda-nome">{item.outras ? t('github.linguagens.outras', { n: item.quantidade }) : item.nome}</span>
                            <span className="gh-legenda-valor">
                                {plural(t, 'repositorio', item.valor)} · {percentual(item.percentual)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

function Linguagens() {
    return <Wakatime />
}
/* =====================================================================
Atividade: sequências, calendário e contribuições por ano
   ===================================================================== */

function Sequencias({ dados }) {
    const { t } = useTranslation()
    const { sequenciaAtual, maiorSequencia, janela, hoje } = dados
    const periodo = (sequencia) =>
        sequencia.tamanho
            ? `${diaMes(sequencia.inicio)} – ${sequencia.fim === hoje ? t('github.atividade.hoje') : data(sequencia.fim)}`
            : t('github.atividade.semSequencia')

    return (
        <div className="gh-sequencias">
            <div className="gh-sequencia papel">
                <span className="gh-sequencia-valor">{numero(janela.total)}</span>
                <span className="gh-sequencia-rotulo">{t('github.atividade.contribuicaoTotal')}</span>
                <span className="gh-sequencia-nota">
                    {t('comum.intervalo', { de: data(janela.inicio), ate: data(janela.fim) })}
                </span>
            </div>
            <div className="gh-sequencia papel">
                <span className="gh-sequencia-valor">{plural(t, 'dia', sequenciaAtual.tamanho)}</span>
                <span className="gh-sequencia-rotulo">{t('github.atividade.sequenciaAtual')}</span>
                <span className="gh-sequencia-nota">{periodo(sequenciaAtual)}</span>
            </div>
            <div className="gh-sequencia papel">
                <span className="gh-sequencia-valor">{plural(t, 'dia', maiorSequencia.tamanho)}</span>
                <span className="gh-sequencia-rotulo">{t('github.atividade.maiorSequenciaHistorico')}</span>
                <span className="gh-sequencia-nota">{periodo(maiorSequencia)}</span>
            </div>
        </div>
    )
}

// Cada bolinha é um dia (como um mini disco). Passar o mouse, tocar ou usar as
// setas (com o calendário focado) mostra o dia na linha de baixo.
function Calendario({ dados }) {
    const { t } = useTranslation()
    const diasCurtos = comoLista(t('comum.diasSemanaCurto', { returnObjects: true }))
    const semanas = dados.calendario.semanas
    const celulas = useMemo(() => semanas.flat(), [semanas])
    const [ativo, setAtivo] = useState(null)

    // Mês no topo da coluna em que ele começa (o rótulo some se ficar espremido)
    const meses = useMemo(() => {
        const inicios = []
        semanas.forEach((semana, indice) => {
            const dia = semana.find((c) => c.dentro) ?? semana[0]
            const chave = dia.data.slice(0, 7)
            const anterior = indice > 0 ? (semanas[indice - 1].find((c) => c.dentro) ?? semanas[indice - 1][0]).data.slice(0, 7) : null
            if (chave !== anterior) inicios.push({ indice, data: dia.data })
        })
        return inicios.filter((m, i) => !inicios[i + 1] || inicios[i + 1].indice - m.indice >= 3)
    }, [semanas])

    const dentro = celulas.filter((c) => c.dentro)
    const melhor = dentro.reduce((topo, c) => (c.quantidade > topo.quantidade ? c : topo), dentro[0])
    const descrever = (c) =>
        c.quantidade
            ? t('github.atividade.contribuicaoNoDia', { data: data(c.data), contribuicoes: plural(t, 'contribuicao', c.quantidade) })
            : t('github.atividade.nenhumaContribuicao', { data: data(c.data) })

    const aoTeclar = (evento) => {
        const passo = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[evento.key]
        if (!passo) return
        evento.preventDefault()
        setAtivo((atual) => {
            const base = atual ?? celulas.length - 1
            const proximo = base + passo
            return proximo < 0 || proximo >= celulas.length || !celulas[proximo].dentro ? base : proximo
        })
    }
    const escolher = (evento) => {
        const indice = evento.target.dataset?.indice
        if (indice !== undefined) setAtivo(Number(indice))
    }

    return (
        <figure className="gh-calendario">
            <p className="gh-resumo">
                <Trans
                    i18nKey="github.atividade.resumoCalendario"
                    values={{ total: plural(t, 'contribuicao', dados.janela.total), de: data(dados.janela.inicio), ate: data(dados.janela.fim) }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <div className="gh-calendario-rolagem">
                <div className="gh-calendario-quadro">
                    <div className="gh-calendario-meses" aria-hidden="true" style={{ '--semanas': semanas.length }}>
                        {meses.map((m) => (
                            <span key={m.data} style={{ gridColumn: `${m.indice + 1} / span 3` }}>
                                {mes(m.data)}
                            </span>
                        ))}
                    </div>
                    <div className="gh-calendario-dias" aria-hidden="true">
                        {[1, 3, 5].map((dia) => (
                            <span key={dia} style={{ gridRow: dia + 1 }}>
                                {diasCurtos[dia]}
                            </span>
                        ))}
                    </div>
                    <div
                        className="gh-calendario-grade"
                        role="img"
                        aria-label={`${t('github.atividade.calendarioAria', { de: data(dados.janela.inicio), ate: data(dados.janela.fim), total: plural(t, 'contribuicao', dados.janela.total) })} ${melhor?.quantidade ? t('github.atividade.diaMaisAtivoAria', { descricao: descrever(melhor) }) : ''}`.trim()}
                        tabIndex={0}
                        onKeyDown={aoTeclar}
                        onPointerOver={escolher}
                        onPointerDown={escolher}
                        onPointerLeave={() => setAtivo(null)}
                        onBlur={() => setAtivo(null)}
                    >
                        {celulas.map((celula, indice) => (
                            <span
                                key={celula.data}
                                className={['gh-celula', indice === ativo && 'gh-celula--ativa', !celula.dentro && 'gh-celula--fora']
                                    .filter(Boolean)
                                    .join(' ')}
                                data-nivel={celula.nivel}
                                data-indice={celula.dentro ? indice : undefined}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="gh-calendario-rodape">
                <figcaption className="gh-leitura" aria-hidden="true">
                    {ativo !== null ? descrever(celulas[ativo]) : melhor?.quantidade > 0 && t('github.atividade.diaMaisAtivo', { descricao: descrever(melhor) })}
                </figcaption>
                <span className="gh-calendario-legenda" aria-hidden="true">
                    {t('github.atividade.menos')}
                    {[0, 1, 2, 3, 4].map((nivel) => (
                        <span key={nivel} className="gh-celula" data-nivel={nivel} />
                    ))}
                    {t('github.atividade.mais')}
                </span>
            </div>
        </figure>
    )
}

function PorAno({ anos, hoje }) {
    const { t } = useTranslation()
    const anoAtual = Number(hoje.slice(0, 4))
    const leitura = (item) =>
        t(item.ano === anoAtual ? 'github.atividade.porAnoLeituraAtual' : 'github.atividade.porAnoLeitura', {
            ano: item.ano,
            contribuicoes: plural(t, 'contribuicao', item.total),
        })

    return (
        <div className="gh-bloco papel">
            <h3 className="gh-bloco-titulo">{t('github.atividade.porAnoTitulo')}</h3>
            {anos.length === 0 ? (
                <Vazio>{t('github.atividade.porAnoVazio')}</Vazio>
            ) : (
                <Colunas
                    classe="gh-colunas--anos"
                    itens={anos}
                    valor={(item) => item.total}
                    leitura={leitura}
                    eixo={(item) => item.ano}
                    topo={(item) => numero(item.total)}
                    legenda={t('github.atividade.porAnoLegenda')}
                />
            )}
        </div>
    )
}

function Atividade() {
    const { t } = useTranslation()
    const contribuicoes = useFonte(contribuicoesFonte)
    if (contribuicoes.status !== 'pronto') return <Estado estado={contribuicoes} />
    const { dados } = contribuicoes
    if (dados.total === 0) return <Vazio>{t('github.atividade.vazio')}</Vazio>

    return (
        <>
            <Sequencias dados={dados} />
            <Calendario dados={dados} />
            <PorAno anos={dados.anos} hoje={dados.hoje} />
            <p className="gh-nota">
                {t('github.atividade.fonte')} {t('github.textos.diferencaContribuicoes')}
            </p>
        </>
    )
}

/* =====================================================================
   Horários: commits por hora, dia da semana e período do dia
   ===================================================================== */

function HorariosConteudo({ dados }) {
    const { t } = useTranslation()
    const diasCurtos = comoLista(t('comum.diasSemanaCurto', { returnObjects: true }))
    const diasLongos = [0, 1, 2, 3, 4, 5, 6].map((i) => t(`github.dias.${i}.longo`))
    const { exato, total, analisados, horas, diasSemana, periodos, horaPico, repositorios } = dados
    if (horaPico === null) {
        return <Vazio>{t('github.horarios.nenhumCommit', { de: data(dados.inicio), ate: data(dados.fim) })}</Vazio>
    }

    const aprox = exato ? '' : '≈ '
    const maiorPeriodo = periodos.reduce((topo, p) => (p.estimativa > topo.estimativa ? p : topo), periodos[0])
    const maxDia = Math.max(...diasSemana.map((d) => d.estimativa)) || 1
    const diaPico = diasSemana.findIndex((d) => d.estimativa === maxDia)
    const leituraHora = (item, h) =>
        `${faixaHora(h)} · ${percentual(item.percentual)} · ${aprox}${plural(t, 'commit', item.estimativa)}`

    return (
        <>
            <p className="gh-resumo">
                <Trans
                    i18nKey="github.horarios.resumo"
                    values={{
                        hora: faixaHora(horaPico),
                        periodo: t(`github.periodos.${maiorPeriodo.chave}`).toLowerCase(),
                        percentual: percentual(maiorPeriodo.percentual),
                    }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <div className={`gh-amostra papel ${exato ? 'gh-amostra--exata' : ''}`} role="note">
                <p>
                    {t(exato ? 'github.horarios.amostraExata' : 'github.horarios.amostraParcial', {
                        commits: plural(t, 'commitPublico', total),
                        analisados: numero(analisados),
                        de: data(dados.inicio),
                        ate: data(dados.fim),
                    })}
                    {dados.incompleto && ` ${t('github.horarios.incompleto')}`}
                </p>
                <p>
                    {t('github.horarios.fuso')}
                </p>
            </div>

            <div className="gh-bloco papel">
                <h3 className="gh-bloco-titulo">{t('github.horarios.porHorarioTitulo')}</h3>
                <Colunas
                    classe="gh-colunas--horas"
                    itens={horas}
                    valor={(item) => item.percentual}
                    leitura={leituraHora}
                    eixo={(item, h) => (h % 3 === 0 ? hora(h) : '')}
                    topo={(item) => percentual(item.percentual)}
                    legenda={t('github.horarios.porHorarioLegenda')}
                />
            </div>

            <div className="gh-duo">
                <div className="gh-bloco papel">
                    <h3 className="gh-bloco-titulo">{t('github.horarios.porDiaTitulo')}</h3>
                    <ul className="gh-semana">
                        {ORDEM_SEMANA.map((dia, indice) => (
                            <li
                                key={dia}
                                className={dia === diaPico ? 'gh-dia gh-dia--pico' : 'gh-dia'}
                                style={{ '--rel': `${(diasSemana[dia].estimativa / maxDia) * 100}%`, '--i': indice }}
                            >
                                <span className="gh-dia-nome">
                                    <span aria-hidden="true">{diasCurtos[dia]}</span>
                                    <span className="visualmente-oculto">{diasLongos[dia]}</span>
                                </span>
                                <span className="gh-trilho" aria-hidden="true">
                                    <span className="gh-trilho-barra" />
                                </span>
                                <span className="gh-dia-valor">
                                    {aprox}
                                    {numero(diasSemana[dia].estimativa)}
                                    <span className="visualmente-oculto"> {t('github.horarios.commitsPercentual', { percentual: percentual(diasSemana[dia].percentual) })}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="gh-bloco papel">
                    <h3 className="gh-bloco-titulo">{t('github.horarios.porPeriodoTitulo')}</h3>
                    <ul className="gh-periodos">
                        {periodos.map((periodo, indice) => (
                            <li
                                key={periodo.chave}
                                className={periodo === maiorPeriodo ? 'gh-periodo gh-periodo--pico' : 'gh-periodo'}
                                style={{ '--rel': `${periodo.percentual}%`, '--i': indice }}
                            >
                                <span className="gh-periodo-nome">{t(`github.periodos.${periodo.chave}`)}</span>
                                <span className="gh-periodo-faixa">
                                    {hora(periodo.de)}–{hora((periodo.ate + 1) % 24)}
                                </span>
                                <span className="gh-periodo-valor">{percentual(periodo.percentual)}</span>
                                <span className="gh-trilho" aria-hidden="true">
                                    <span className="gh-trilho-barra" />
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <details className="gh-repos-analisados">
                <summary>{t('github.horarios.reposAnalisados', { n: numero(repositorios.length) })}</summary>
                <ul className="gh-tags">
                    {repositorios.map((repo) => (
                        <li key={repo.nome} className="tag">
                            {repo.nome} · {plural(t, 'commit', repo.commits)}
                        </li>
                    ))}
                </ul>
                <p className="gh-nota">{t('github.horarios.reposNota')}</p>
            </details>
        </>
    )
}

function Horarios() {
    const commits = useFonte(commitsFonte)
    if (commits.status !== 'pronto') return <Estado estado={commits} />
    return <HorariosConteudo dados={commits.dados} />
}

/* =====================================================================
   Repositórios: lista dos públicos, com estrelas e forks
   ===================================================================== */

function RepositoriosConteudo({ dados }) {
    const { t } = useTranslation()
    const [todos, setTodos] = useState(false)
    const ordenados = useMemo(
        () =>
            [...dados.repos].sort(
                (a, b) =>
                    b.estrelas - a.estrelas ||
                    (b.atualizadoEm ?? '').localeCompare(a.atualizadoEm ?? '') ||
                    a.nome.localeCompare(b.nome),
            ),
        [dados],
    )
    if (ordenados.length === 0) return <Vazio>{t('github.repositorios.vazio')}</Vazio>

    const visiveis = todos ? ordenados : ordenados.slice(0, LIMITES.reposExibidos)

    return (
        <>
            <p className="gh-resumo">
                <strong>{plural(t, 'repositorioPublicoProprio', ordenados.length)}</strong>{t('github.repositorios.ordem')}
                {dados.forksIgnorados > 0 && ` ${t('github.repositorios.forksFora', { count: paraPlural(dados.forksIgnorados), n: numero(dados.forksIgnorados) })}`}
                {dados.truncado && ` ${t('github.repositorios.truncado', { n: LIMITES.maxPaginasRepos * LIMITES.reposPorPagina })}`}
            </p>

            <ol className="gh-repos">
                {visiveis.map((repo) => (
                    <li key={repo.nome} className="gh-repo papel">
                        <div className="gh-repo-topo">
                            <a className="gh-repo-nome" href={repo.url} target="_blank" rel="noopener noreferrer">
                                {repo.nome}
                                <span className="visualmente-oculto"> {t('comum.abreEmNovaAbaParenteses')}</span>
                            </a>
                            <span className="gh-repo-meta">
                                <span>
                                    <FaStar aria-hidden="true" /> {numero(repo.estrelas)}
                                    <span className="visualmente-oculto"> {t('github.repositorios.estrelas')}</span>
                                </span>
                                <span>
                                    <FaCodeBranch aria-hidden="true" /> {numero(repo.forks)}
                                    <span className="visualmente-oculto"> {t('github.repositorios.forks')}</span>
                                </span>
                            </span>
                        </div>
                        {repo.descricao && <p className="gh-repo-descricao">{repo.descricao}</p>}
                        <p className="gh-repo-rodape">
                            {repo.linguagem && <span className="tag">{repo.linguagem}</span>}
                            {repo.arquivado && <span className="tag">{t('github.repositorios.arquivado')}</span>}
                            {repo.atualizadoEm && <span>{t('github.repositorios.atualizadoEm', { data: data(repo.atualizadoEm.slice(0, 10)) })}</span>}
                        </p>
                    </li>
                ))}
            </ol>

            {ordenados.length > LIMITES.reposExibidos && (
                <button type="button" className="botao botao--secundario gh-ver-mais" onClick={() => setTodos((v) => !v)} aria-expanded={todos}>
                    {todos ? t('github.repositorios.mostrarMenos') : t('github.repositorios.mostrarTodos', { n: ordenados.length })}
                </button>
            )}
        </>
    )
}

function Repositorios() {
    const perfil = useFonte(perfilFonte)
    if (perfil.status !== 'pronto') return <Estado estado={perfil} />
    return <RepositoriosConteudo dados={perfil.dados} />
}

/* =====================================================================
   Página: abas + conteúdo + como os dados são obtidos
   ===================================================================== */

const VISOES = {
    resumo: Resumo,
    linguagens: Linguagens,
    atividade: Atividade,
    horarios: Horarios,
    repositorios: Repositorios,
}

function Abas({ ativa, aoEscolher }) {
    const { t } = useTranslation()
    const refs = useRef({})

    const aoTeclar = (evento, indice) => {
        const destino = {
            ArrowRight: (indice + 1) % SECOES.length,
            ArrowLeft: (indice - 1 + SECOES.length) % SECOES.length,
            Home: 0,
            End: SECOES.length - 1,
        }[evento.key]
        if (destino === undefined) return
        evento.preventDefault()
        aoEscolher(SECOES[destino].id)
        refs.current[SECOES[destino].id]?.focus()
    }

    return (
        <div className="gh-abas" role="tablist" aria-label={t('github.secoes.rotulo')}>
            {SECOES.map((secao, indice) => (
                <button
                    key={secao.id}
                    ref={(el) => {
                        refs.current[secao.id] = el
                    }}
                    type="button"
                    role="tab"
                    id={`gh-aba-${secao.id}`}
                    aria-selected={ativa === secao.id}
                    aria-controls="gh-painel"
                    tabIndex={ativa === secao.id ? 0 : -1}
                    className={ativa === secao.id ? 'gh-aba gh-aba--ativa' : 'gh-aba'}
                    title={t(`github.secoes.${secao.id}.descricao`)}
                    onClick={() => aoEscolher(secao.id)}
                    onKeyDown={(evento) => aoTeclar(evento, indice)}
                >
                    {t(`github.secoes.${secao.id}.rotulo`)}
                </button>
            ))}
        </div>
    )
}

function Github() {
    const { t } = useTranslation()
    const [ativa, setAtiva] = useState(SECAO_PADRAO)
    const Visao = VISOES[ativa]
    const secao = SECOES.find((s) => s.id === ativa)

    return (
        <article className="pagina container github">
            <header className="pagina-topo">
                <p className="pagina-faixa">
                    {t('comum.faixa', { numero: '06' })}
                    </p>
                <h1 className="pagina-titulo github-titulo" tabIndex={-1}>
                    <img src="/images/gif-git.gif" alt="" className="github-gif">
                    </img>
                    {t('github.faixaTitulo')}
                </h1>
                <p className="pagina-intro">
                    {t('github.textos.intro')}{' '}
                    <a href={URL_PERFIL} target="_blank" rel="noopener noreferrer">
                        github.com/{USUARIO}
                        <span className="visualmente-oculto"> {t('comum.abreEmNovaAbaParenteses')}</span>
                    </a>
                </p>
            </header>

            <Abas ativa={ativa} aoEscolher={setAtiva} />

            <section id="gh-painel" role="tabpanel" aria-labelledby={`gh-aba-${ativa}`} className="gh-painel">
                <h2 className="subtitulo">{t(`github.secoes.${secao.id}.descricao`)}</h2>
                <SecaoComErro key={ativa}>
                    <Visao />
                </SecaoComErro>
            </section>

            <details className="gh-metodologia papel">
                <summary>{t('github.metodologia.titulo')}</summary>
                <dl>
                    {METODOLOGIA.map((id) => (
                        <div key={id}>
                            <dt>{t(`github.metodologia.itens.${id}.titulo`)}</dt>
                            <dd>{t(`github.metodologia.itens.${id}.texto`)}</dd>
                        </div>
                    ))}
                </dl>
            </details>
        </article>
    )
}

export default Github
