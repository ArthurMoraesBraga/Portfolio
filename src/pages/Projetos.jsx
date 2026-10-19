import { useTranslation } from 'react-i18next'
import { useEffect,useRef,useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import {publico} from '../utils/publico'
import { projetos } from '../data/projetos'
import './Projetos.css'

// Linha do tempo: do projeto mais antigo ao mais recente.
// A ordenação é estável, então projetos do mesmo ano mantêm a ordem do arquivo de dados.
const ordenados = [...projetos].sort((a, b) => Number(a.ano) - Number(b.ano))

// GIF ou imagem do funcionamento. Aparece inteiro, na proporção original.
// Sem arquivo cadastrado (ou se ele não carregar), nada é mostrado.
function Demonstracao({ arquivo, titulo }) {
    const { t } = useTranslation()
    const [falhou, setFalhou] = useState(false)

    if (!arquivo || falhou) return null

    return (
    <figure className="detalhes-demo">
        <img
        src={publico(arquivo)}
        alt={t('projetos.detalhes.demonstracaoAlt', { titulo })}
        onError={() => setFalhou(true)}
        />
    </figure>
    )
}

function DetalhesProjeto({ projeto, onFechar }) {
    const { t, i18n } = useTranslation()
    const dialogoRef = useRef(null)
    const corpoRef = useRef(null)
    const p = projeto
    const base = `projetos.itens.${p.id}`

    // Abre como janela modal: o navegador prende o foco dentro dela e trata a tecla Esc.
    useEffect(() => {
    const dialogo = dialogoRef.current
    if (dialogo && !dialogo.open) dialogo.showModal()
    }, [])

    // Impede a rolagem da página por trás, sem mudar a posição dela.
    useEffect(() => {
    const anterior = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
        document.documentElement.style.overflow = anterior
    }
    }, [])

    // Ao trocar de idioma, o conteúdo muda mas a leitura volta ao início
    useEffect(() => {
    corpoRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    }, [i18n.resolvedLanguage])

    function fechar() {
    dialogoRef.current?.close()
    }

    function clicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) fechar()
    }

    const temContribuicao = p.tipo === 'grupo' && i18n.exists(`${base}.contribuicao`)

    return createPortal(
    <dialog
        ref={dialogoRef}
        className="detalhes-dialogo"
        aria-labelledby="detalhes-titulo"
        onClose={onFechar}
        onClick={clicarNoFundo}
    >
        <div className="detalhes-janela">
        <header className="detalhes-topo">
            <div className="detalhes-cabecalho">
            <h2 id="detalhes-titulo">{p.titulo}</h2>
            <span className="tag">{t(`projetos.status.${p.status}`)}</span>
            </div>
            <button type="button" className="detalhes-fechar" onClick={fechar} autoFocus>
            <FiX aria-hidden="true" />
            {t('projetos.detalhes.fechar')}
            </button>
        </header>

        <div className="detalhes-corpo" ref={corpoRef} tabIndex={-1}>
            {p.status === 'em_desenvolvimento' && (
            <p className="detalhes-aviso" role="note">
                {t('projetos.detalhes.emConstrucao')}
            </p>
            )}

            <p className="projeto-meta">
            {t(`projetos.tipo.${p.tipo}`)} · {p.ano}
            </p>
            {p.reconhecimento && (
            <p className="detalhes-reconhecimento">
                <span className="tag">{t(`projetos.reconhecimentos.${p.reconhecimento}`)}</span>
            </p>
            )}

            <Demonstracao arquivo={p.demonstracao} titulo={p.titulo} />

            <section className="detalhes-secao" aria-labelledby="detalhes-descricao">
            <h3 id="detalhes-descricao">{t('projetos.detalhes.descricao')}</h3>
            <p>{t(`${base}.detalheDescricao`)}</p>
            </section>

            <section className="detalhes-secao" aria-labelledby="detalhes-problema">
            <h3 id="detalhes-problema">{t('projetos.detalhes.problema')}</h3>
            <p>{t(`${base}.problema`)}</p>
            </section>

            <section className="detalhes-secao" aria-labelledby="detalhes-objetivo">
            <h3 id="detalhes-objetivo">{t('projetos.detalhes.objetivo')}</h3>
            <p>{t(`${base}.objetivo`)}</p>
            </section>

            <section className="detalhes-secao" aria-labelledby="detalhes-tecnologias">
            <h3 id="detalhes-tecnologias">{t('projetos.tecnologias')}</h3>
            <ul className="projeto-tags">
                {p.tecnologias.map((tec) => (
                <li key={tec}><span className="tag">{tec}</span></li>
                ))}
            </ul>
            </section>

            {temContribuicao && (
            <section className="detalhes-secao" aria-labelledby="detalhes-contribuicao">
                <h3 id="detalhes-contribuicao">{t('projetos.contribuicao')}</h3>
                <div className="projeto-contribuicao">
                <p>{t(`${base}.contribuicao`)}</p>
                </div>
            </section>
            )}

            <section className="detalhes-secao" aria-labelledby="detalhes-links">
            <h3 id="detalhes-links">{t('projetos.detalhes.links')}</h3>
            {p.repositorio || p.demo ? (
                <ul className="detalhes-links">
                {p.repositorio && (
                    <li>
                    <a className="botao botao--primario" href={p.repositorio} target="_blank" rel="noreferrer">
                        {t('projetos.verGithub')}
                        <span className="visualmente-oculto"> {t('comum.abreEmNovaAbaTitulo', { titulo: p.titulo })}</span>
                    </a>
                    </li>
                )}
                {p.demo && (
                    <li>
                    <a className="botao botao--secundario" href={p.demo} target="_blank" rel="noreferrer">
                        {t('projetos.verDemo')}
                        <span className="visualmente-oculto"> {t('comum.abreEmNovaAbaTitulo', { titulo: p.titulo })}</span>
                    </a>
                    </li>
                )}
                </ul>
            ) : (
                <p className="projeto-meta">{t('projetos.detalhes.semLinks')}</p>
            )}
            {p.repositorio && !p.demo && (
                <p className="projeto-meta">{t('projetos.detalhes.semDemo')}</p>
            )}
            </section>
        </div>
        </div>
    </dialog>,
    document.body,
    )
}

function Projetos() {
    const { t, i18n } = useTranslation()
    const [abertoId, setAbertoId] = useState(null)
    // Guarda quem abriu a janela e a posição da página para devolvê-los ao fechar
    const origem = useRef({ elemento: null, rolagem: 0 })

    const aberto = projetos.find((p) => p.id === abertoId) ?? null

    function abrir(id, evento) {
    origem.current = {
        elemento: evento.currentTarget,
        rolagem: window.scrollY,
    }
    setAbertoId(id)
    }

    function fechar() {
    const { elemento, rolagem } = origem.current
    setAbertoId(null)
    // Depois de fechar, devolve o foco ao botão de origem e a página à mesma posição
    requestAnimationFrame(() => {
        elemento?.focus({ preventScroll: true })
        if (Math.abs(window.scrollY - rolagem) > 1) {
        window.scrollTo({ top: rolagem, behavior: 'instant' })
        }
    })
    }

    return (
    <article className="pagina container">
        <header className="pagina-topo">
        <p className="pagina-faixa">{t('comum.faixa', { numero: '02' })}</p>
        <h1 className="pagina-titulo projeto-titulo" tabIndex={-1}>
            <img src="/images/vscode.svg" alt="" className="projeto-imagem"></img>
            {t('projetos.titulo')}</h1>

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
                {/* A capa também abre os detalhes. Para teclado e leitor de tela,
                    o botão do título e o "Ver detalhes" já cumprem esse papel. */}
                <button
                type="button"
                className="projeto-capa papel"
                style={{ '--cor-capa': p.cor }}
                onClick={(e) => abrir(p.id, e)}
                tabIndex={-1}
                aria-hidden="true"
                >
                {p.capa ? (
                    <img className="projeto-img" src={publico(p.capa)} alt="" />
                ) : (
                    <span className="projeto-inicial">{p.titulo.charAt(0)}</span>
                )}
                <span className="projeto-faixa">{String(i + 1).padStart(2, '0')}</span>
                </button>

                <div className="projeto-info">
                <h2>
                    <button
                    type="button"
                    className="projeto-titulo-botao"
                    onClick={(e) => abrir(p.id, e)}
                    aria-haspopup="dialog"
                    >
                    {p.titulo}
                    </button>
                </h2>
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
                    {p.tecnologias.map((tec) => (
                    <li key={tec}><span className="tag">{tec}</span></li>
                    ))}
                </ul>

                <div className="projeto-acoes">
                    <button
                    type="button"
                    className="botao botao--primario projeto-detalhes-botao"
                    onClick={(e) => abrir(p.id, e)}
                    aria-haspopup="dialog"
                    >
                    {t('projetos.detalhes.ver')}
                    <span className="visualmente-oculto"> {t('projetos.detalhes.verDe', { titulo: p.titulo })}</span>
                    </button>

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
            </div>
            </li>
        ))}
        </ol>

        {aberto && <DetalhesProjeto key={aberto.id} projeto={aberto} onFechar={fechar} />}
    </article>
    )
}

export default Projetos