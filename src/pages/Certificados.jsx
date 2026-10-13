import { useTranslation } from 'react-i18next'
import { certificados } from '../data/certificados'
import './Certificados.css'

function Certificados() {
    const { t } = useTranslation()
    return (
        <article className="pagina container">
            <header className="pagina-topo">
                <p className="pagina-faixa">{t('comum.faixa', { numero: '03' })}</p>
                <h1 className="pagina-titulo" tabIndex={-1}>
                    {t('certificados.titulo')}
                </h1>
                <p className="pagina-intro">
                    {t('certificados.intro')}
                </p>
            </header>

            <ul className="cert-grade">
                {certificados.map((c) => (
                    <li key={c.id} className="cert-card papel">
                        <a
                            href={c.arquivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-previa"
                            aria-label={t('certificados.abrirCertificado', { nome: c.nome })}
                        >
                            <img
                                src={c.previa}
                                alt={t('certificados.previa', { nome: c.nome })}
                                loading="lazy"
                            />
                        </a>

                        <h2>{c.nome}</h2>
                        <p>{c.instituicao}</p>
                        <p className="cert-data">{c.data}</p>

                        <div className="cert-acoes">
                            <a
                                href={c.arquivo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="botao botao--primario"
                            >
                                {t('certificados.abrirPdf')}
                                <span className="visualmente-oculto">
                                    : {c.nome}
                                </span>
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </article>
    )
}

export default Certificados