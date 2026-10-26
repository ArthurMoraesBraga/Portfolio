import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FaClock,
    FaCode,
    FaCodeBranch,
    FaDesktop,
    FaFolderOpen,
    FaLock,
    FaSun,
} from 'react-icons/fa'
import WAKATIME_CONFIG from '../config/WakatimeConfig'
import { fetchCodingNow, formatDuration } from '../utils/Wakatime'
import { formatadorData, paraPlural } from '../utils/localizacao'

const REFRESH_MS = Math.max(
    15,
    WAKATIME_CONFIG.CODING_NOW.REFRESH_SECONDS,
) * 1000

function useCodingNow() {
    const [estado, setEstado] = useState({ status: 'loading' })

    useEffect(() => {
        let ativo = true
        let intervalo = null
        let controlador = null
        let indisponivel = false

        async function atualizar() {
            if (
                indisponivel
                || controlador
                || document.visibilityState === 'hidden'
            ) return

            controlador = new AbortController()
            const resultado = await fetchCodingNow({
                signal: controlador.signal,
            })
            controlador = null

            if (!ativo || resultado.status === 'aborted') return
            setEstado(resultado)

            if (resultado.status === 'unavailable') {
                indisponivel = true
                clearInterval(intervalo)
                intervalo = null
            }
        }

        function aoMudarVisibilidade() {
            if (document.visibilityState === 'visible') atualizar()
        }

        atualizar()
        intervalo = setInterval(atualizar, REFRESH_MS)
        document.addEventListener('visibilitychange', aoMudarVisibilidade)

        return () => {
            ativo = false
            controlador?.abort()
            if (intervalo) clearInterval(intervalo)
            document.removeEventListener(
                'visibilitychange',
                aoMudarVisibilidade,
            )
        }
    }, [])

    return estado
}

function useAgora() {
    const [agora, setAgora] = useState(() => Date.now())

    useEffect(() => {
        const intervalo = setInterval(() => setAgora(Date.now()), 30_000)
        return () => clearInterval(intervalo)
    }, [])

    return agora
}

function formatarHa(t, instante, agora) {
    const minutos = Math.max(0, Math.floor((agora - instante) / 60_000))

    if (minutos < 1) return t('wakatime.agora.recente')
    if (minutos < 60) {
        return t('wakatime.agora.minutos', {
            count: paraPlural(minutos),
            n: minutos,
        })
    }

    const horas = Math.floor(minutos / 60)
    if (horas < 24) {
        return t('wakatime.agora.horas', {
            count: paraPlural(horas),
            n: horas,
        })
    }

    const dias = Math.floor(horas / 24)
    return t('wakatime.agora.dias', {
        count: paraPlural(dias),
        n: dias,
    })
}

const formatarHora = (instante) =>
    formatadorData({ hour: '2-digit', minute: '2-digit' }).format(instante)

function CodingNow({ showProject = true }) {
    const { t } = useTranslation()
    const estado = useCodingNow()
    const agora = useAgora()

    // Sem rota, sem token ou durante uma falha, o cartão não aparece.
    if (estado.status !== 'ok') return null

    const { active, last, todaySeconds } = estado.data
    if (active && !last) return null

    const nomeado = Boolean(showProject && last?.isPublic && last.project)
    const nomeProjeto = nomeado
        ? last.project
        : t('wakatime.agora.projetoPrivado')

    if (!active) {
        return (
            <section
                className="waka-now waka-now--idle papel"
                aria-label={t('wakatime.agora.rotulo')}
                aria-live="polite"
                role="status"
            >
                <span className="waka-now-status">
                    <span className="waka-now-dot" aria-hidden="true" />
                    {t('wakatime.agora.parado')}
                </span>

                <span className="waka-now-idle-text">
                    {last ? (
                        <>
                            {t('wakatime.agora.ultimaAtividade', {
                                quando: formatarHa(t, last.at, agora),
                            })}{' '}
                            <strong>{nomeProjeto}</strong>
                            {last.language && ` · ${last.language}`}
                        </>
                    ) : (
                        t('wakatime.agora.nenhumaHoje')
                    )}
                    {todaySeconds >= 60
                        && ` · ${t('wakatime.agora.tempoHoje', {
                            tempo: formatDuration(todaySeconds),
                        })}`}
                </span>
            </section>
        )
    }

    const segundosSessao = Math.max(
        0,
        (last.at - last.sessionStart) / 1000,
    )

    return (
        <section
            className="waka-now waka-now--active papel"
            aria-label={t('wakatime.agora.rotulo')}
            aria-live="polite"
            role="status"
        >
            <div className="waka-now-head">
                <span className="waka-now-status">
                    <span className="waka-now-dot" aria-hidden="true" />
                    {t('wakatime.agora.codando')}
                </span>
                <span className="waka-now-ago">
                    {t('wakatime.agora.ultimoSinal', {
                        quando: formatarHa(t, last.at, agora),
                    })}
                </span>
            </div>

            <p className="waka-now-project">
                <span className="waka-now-name">
                    {nomeado
                        ? <FaFolderOpen aria-hidden="true" />
                        : <FaLock aria-hidden="true" />}
                    <strong title={nomeProjeto}>{nomeProjeto}</strong>
                </span>

                {nomeado && last.branch && (
                    <span className="waka-now-branch" title={last.branch}>
                        <FaCodeBranch aria-hidden="true" />
                        {last.branch}
                    </span>
                )}
            </p>

            <ul className="waka-now-meta">
                {last.language && (
                    <li>
                        <FaCode aria-hidden="true" />
                        {last.language}
                    </li>
                )}
                {last.editor && (
                    <li>
                        <FaDesktop aria-hidden="true" />
                        {last.editor}
                    </li>
                )}
                {segundosSessao >= 60 && (
                    <li>
                        <FaClock aria-hidden="true" />
                        {t('wakatime.agora.sessao', {
                            tempo: formatDuration(segundosSessao),
                            hora: formatarHora(last.sessionStart),
                        })}
                    </li>
                )}
                {last.projectTodaySeconds >= 60 && (
                    <li>
                        <FaSun aria-hidden="true" />
                        {t('wakatime.agora.tempoProjetoHoje', {
                            tempo: formatDuration(last.projectTodaySeconds),
                        })}
                    </li>
                )}
            </ul>
        </section>
    )
}

export default CodingNow
