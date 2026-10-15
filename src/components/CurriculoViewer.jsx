    import { useEffect, useRef, useState } from 'react'
    import { createPortal } from 'react-dom'
    import { useTranslation } from 'react-i18next'
    import { Document, Page, pdfjs } from 'react-pdf'
    import { FiX, FiDownload, FiFileText } from 'react-icons/fi'
    import { perfil } from '../data/perfil'

    import 'react-pdf/dist/Page/TextLayer.css'
    import './CurriculoViewer.css'

    // O Vite inclui o processador do PDF no próprio projeto.
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
    ).toString()

    function PaginasCurriculo({ url, textos }) {
    const containerRef = useRef(null)
    const [largura, setLargura] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)

    useEffect(() => {
        const elemento = containerRef.current

        if (!elemento) return

        const observador = new ResizeObserver(([entrada]) => {
        setLargura(Math.floor(entrada.contentRect.width))
        })

        observador.observe(elemento)

        return () => observador.disconnect()
    }, [])

    return (
        <div ref={containerRef} className="curriculo-paginas">
        {largura > 0 && (
            <Document
            file={url}
            onLoadSuccess={({ numPages }) => setTotalPaginas(numPages)}
            loading={
                <p className="curriculo-mensagem" role="status">
                {textos.carregando}
                </p>
            }
            error={
                <p className="curriculo-mensagem" role="alert">
                {textos.erro}
                </p>
            }
            >
            {Array.from({ length: totalPaginas }, (_, indice) => (
                <Page
                key={indice + 1}
                pageNumber={indice + 1}
                width={largura}
                renderTextLayer
                renderAnnotationLayer={false}
                loading={
                    <p className="curriculo-mensagem">
                    {textos.carregando}
                    </p>
                }
                />
            ))}
            </Document>
        )}
        </div>
    )
    }

    function CurriculoViewer({ url, situacao }) {
    const { t, i18n } = useTranslation()

    const dialogoRef = useRef(null)
    const [aberto, setAberto] = useState(false)

    const ingles = i18n.resolvedLanguage?.startsWith('en')

    const textos = {
        carregando: ingles
        ? 'Loading résumé...'
        : 'Carregando currículo...',
        erro: ingles
        ? 'Could not display the résumé. Use the download button.'
        : 'Não foi possível visualizar o currículo. Use o botão de baixar.',
    }

    useEffect(() => {
        if (!aberto) return

        const anterior = document.documentElement.style.overflow
        document.documentElement.style.overflow = 'hidden'

        return () => {
        document.documentElement.style.overflow = anterior
        }
    }, [aberto])

    function abrir() {
        const dialogo = dialogoRef.current

        if (!dialogo || dialogo.open) return

        dialogo.showModal()
        setAberto(true)
    }

    function fechar() {
        dialogoRef.current?.close()
    }

    function clicarNoFundo(evento) {
        if (evento.target === evento.currentTarget) {
        fechar()
        }
    }

    if (situacao === 'ausente') {
        return (
        <p className="curriculo-aviso">
            {t('sobre.curriculoIndisponivel')}
        </p>
        )
    }

    return (
        <>
        <div className="curriculo-acoes">
            <button
            type="button"
            className="botao botao--primario"
            onClick={abrir}
            aria-haspopup="dialog"
            >
            <FiFileText aria-hidden="true" />
            {t('sobre.verCurriculo')}
            </button>

            <a
            href={url}
            download={t('sobre.curriculoArquivo')}
            className="botao botao--secundario"
            >
            <FiDownload aria-hidden="true" />
            {t('sobre.baixarCurriculo')}
            </a>
        </div>

        {createPortal(
            <dialog
            ref={dialogoRef}
            className="curriculo-dialogo"
            aria-label={t('sobre.curriculoTitulo', {
                nome: perfil.nome,
            })}
            onClose={() => setAberto(false)}
            onClick={clicarNoFundo}
            >
            <div className="curriculo-janela">
                <header className="curriculo-topo">
                <h2>
                    {t('sobre.curriculoTitulo', {
                    nome: perfil.nome,
                    })}
                </h2>

                <button
                    type="button"
                    className="curriculo-fechar"
                    onClick={fechar}
                    autoFocus
                >
                    <FiX aria-hidden="true" />
                    {t('sobre.fecharCurriculo')}
                </button>
                </header>

                <div className="curriculo-corpo">
                {aberto && (
                    <PaginasCurriculo
                    key={url}
                    url={url}
                    textos={textos}
                    />
                )}
                </div>
            </div>
            </dialog>,
            document.body,
        )}
        </>
    )
    }

    export default CurriculoViewer