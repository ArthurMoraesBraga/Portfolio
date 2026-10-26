import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    fetchWakaTimeStats,
    formatDuration,
    formatDate,
    formatPercent,
} from '../utils/Wakatime'
import { paraPlural } from '../utils/localizacao'
import CodingNow from './CodingNow'
import {
    FaJsSquare,
    FaJava,
    FaPython,
    FaCss3Alt,
    FaHtml5,
    FaCode,
} from 'react-icons/fa'

const ICONES_LINGUAGENS = {
    JavaScript: FaJsSquare,
    Java: FaJava,
    Python: FaPython,
    CSS: FaCss3Alt,
    HTML: FaHtml5,
}
function Grafico({ titulo, itens }) {
    if (!itens?.length) return null

    return (
        <section className="waka-grafico papel">
            <h3>{titulo}</h3>

            <ul className="waka-barras">
                {itens.slice(0, 6).map((item) => (
                    <li key={item.name}>
                        <div className="waka-barra-topo">
                            <strong>{item.name}</strong>
                            <span>{formatPercent(item.percent)}</span>
                        </div>

                        <div className="waka-barra-trilho" aria-hidden="true">
                            <span
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, item.percent),
                                    )}%`,
                                }}
                            />
                        </div>

                        <small>{formatDuration(item.seconds)}</small>
                    </li>
                ))}
            </ul>
        </section>
    )
}
function LinguagensWaka({ itens }) {
    const { t } = useTranslation()
    if (!itens?.length) return null

    return (
        <section className="waka-linguagens">
            <h3 className="subtitulo">{t('wakatime.linguagensTitulo')}</h3>

            <p className="gh-nota">
                {t('wakatime.linguagensNota')}
            </p>

            <ul className="waka-aneis">
                {itens.map((item) => {
                    const Icone = ICONES_LINGUAGENS[item.name] ?? FaCode
                    const nome = item.name === 'Other'
                        ? t('wakatime.outras')
                        : item.name

                    return (
                        <li key={item.name} className="waka-anel-card papel">
                            <div className="waka-anel">
                                <svg
                                    viewBox="0 0 80 80"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="waka-anel-trilho"
                                        cx="40"
                                        cy="40"
                                        r="34"
                                    />

                                    <circle
                                        className="waka-anel-progresso"
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        pathLength="100"
                                        strokeDasharray={`${item.percent} 100`}
                                    />
                                </svg>

                                <Icone
                                    className="waka-anel-icone"
                                    aria-hidden="true"
                                />
                            </div>

                            <h4>{nome}</h4>
                            <span>{formatPercent(item.percent)}</span>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

function WakaTime() {
    const { t } = useTranslation()
    const [dados, setDados] = useState(null)
    const [erro, setErro] = useState(false)
    const [tentativa, setTentativa] = useState(0)

    useEffect(() => {
        let ativo = true

        fetchWakaTimeStats()
            .then((resultado) => {
                if (ativo) setDados(resultado)
            })
            .catch(() => {
                if (ativo) setErro(true)
            })

        return () => {
            ativo = false
        }
    }, [tentativa])

    function tentarNovamente() {
        setErro(false)
        setDados(null)
        setTentativa((valor) => valor + 1)
    }

    if (erro) {
        return (
            <section className="waka" aria-label={t('wakatime.rotulo')}>
                <CodingNow />

                <div className="gh-estado papel" role="alert">
                    <p>{t('wakatime.erro')}</p>

                    <button
                        type="button"
                        className="botao botao--secundario"
                        onClick={tentarNovamente}
                    >
                        {t('comum.tentarNovamente')}
                    </button>
                </div>
            </section>
        )
    }

    if (!dados) {
        return (
            <section className="waka" aria-label={t('wakatime.rotulo')}>
                <CodingNow />
                <p role="status">{t('wakatime.carregando')}</p>
            </section>
        )
    }

    return (
        <section className="waka" aria-label={t('wakatime.rotulo')}>
            <CodingNow />

            <p className="gh-resumo">
                {t('wakatime.resumo')}
            </p>

            <div className="waka-grade">
                <div className="waka-card papel">
                    <span className="waka-faixa">{t('wakatime.cards.tempo.faixa')}</span>
                    <h3>{t('wakatime.cards.tempo.titulo')}</h3>
                    <strong>{formatDuration(dados.totalSeconds)}</strong>
                    <p>{t('wakatime.cards.tempo.nota')}</p>
                </div>

                <div className="waka-card papel">
                    <span className="waka-faixa">{t('wakatime.cards.rotina.faixa')}</span>
                    <h3>{t('wakatime.cards.rotina.titulo')}</h3>
                    <strong>{formatDuration(dados.dailyAverage)}</strong>
                    <p>{t('wakatime.cards.rotina.nota')}</p>
                </div>

                {dados.bestDay && (
                    <div className="waka-card papel">
                        <span className="waka-faixa">{t('wakatime.cards.melhorDia.faixa')}</span>
                        <h3>{t('wakatime.cards.melhorDia.titulo')}</h3>
                        <strong>
                            {formatDuration(dados.bestDay.seconds)}
                        </strong>
                        <p>{formatDate(dados.bestDay.date)}</p>
                    </div>
                )}

                {dados.totalDays != null && (
                    <div className="waka-card papel">
                        <span className="waka-faixa">{t('wakatime.cards.historico.faixa')}</span>
                        <h3>{t('wakatime.cards.historico.titulo')}</h3>
                        <strong>{t('wakatime.cards.historico.dias', { count: paraPlural(dados.totalDays), n: dados.totalDays })}</strong>
                        <p>{t('wakatime.cards.historico.nota')}</p>
                    </div>
                )}
            </div>

            {dados.since && dados.until && (
                <p className="gh-nota">
                    {t('wakatime.periodo', { de: formatDate(dados.since), ate: formatDate(dados.until) })}
                </p>
            )}

            <LinguagensWaka itens={dados.languages} />

            <Grafico
                titulo={t('wakatime.editores')}
                itens={dados.editors}
            />
        </section>
    )
}

export default WakaTime