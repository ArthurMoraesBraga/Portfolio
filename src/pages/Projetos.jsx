import { useTranslation } from 'react-i18next'
import { projetos } from '../data/projetos'
import './Projetos.css'

// Linha do tempo: do projeto mais antigo ao mais recente.
// A ordenação é estável, então projetos do mesmo ano mantêm a ordem do arquivo de dados.
const ordenados = [...projetos].sort((a, b) => Number(a.ano) - Number(b.ano))

function Projetos() {
    const { t, i18n } = useTranslation()
    return (
    <article className="pagina container">
        <header className="pagina-topo">
        <p className="pagina-faixa">{t('comum.faixa', { numero: '02' })}</p>
        <h1 className="pagina-titulo" tabIndex={-1}>{t('projetos.titulo')}</h1>
        <p className="pagina-intro">
            {t('projetos.intro')}
        </p>
        </header>

        <ol className="projetos-lista">
        {ordenados.map((p, i) => (
            <li key={p.id} className="projeto">
            <div className="projeto-marco">
                <span className="projeto-ano">{p.ano}</span>
            </div>

            <div className="projeto-corpo">
                <div
                className="projeto-capa papel"
                style={{ '--cor-capa': p.cor }}
                role="img"
                aria-label={t('projetos.capaAria', { titulo: p.titulo })}
                >
                {p.imagem ? (
                    <img className="projeto-img" src={p.imagem} alt="" />
                ) : (
                    <span className="projeto-inicial">{p.titulo.charAt(0)}</span>
                )}
                <span className="projeto-faixa">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="projeto-info">
                <h2>{p.titulo}</h2>
                {p.reconhecimento && (
                <span className="tag">{t(`projetos.reconhecimentos.${p.reconhecimento}`)}</span>
                )}
                {p.status && (
                <span className="tag">{t(`projetos.status.${p.status}`)}</span>
                )}
                <p className="projeto-meta">{t(`projetos.tipo.${p.tipo}`)}</p>
                <p>{t(`projetos.itens.${p.id}.descricao`)}</p>

                {i18n.exists(`projetos.itens.${p.id}.contribuicao`) && (
                    <div className="projeto-contribuicao">
                    <strong>{t('projetos.contribuicao')}</strong>
                    <p>{t(`projetos.itens.${p.id}.contribuicao`)}</p>
                    </div>
                )}

                <ul className="projeto-tags" aria-label={t('projetos.tecnologias')}>
                    {p.tecnologias.map((t) => (
                    <li key={t}><span className="tag">{t}</span></li>
                    ))}
                </ul>

                {(p.repositorio || p.demo) && (
                    <ul className="projeto-links">
                    {p.repositorio && (
                        <li>
                        <a href={p.repositorio} target="_blank" rel="noreferrer">
                            {t('projetos.verGithub')}<span className="visualmente-oculto"> {t('comum.abreEmNovaAbaTitulo', { titulo: p.titulo })}</span>
                        </a>
                        </li>
                    )}
                    {p.demo && (
                        <li>
                        <a href={p.demo} target="_blank" rel="noreferrer">
                            {t('projetos.verDemo')}<span className="visualmente-oculto"> {t('comum.abreEmNovaAbaTitulo', { titulo: p.titulo })}</span>
                        </a>
                        </li>
                    )}
                    </ul>
                )}
                </div>
            </div>
            </li>
        ))}
        </ol>
    </article>
    )
}

export default Projetos
