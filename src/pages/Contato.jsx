import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { contato } from '../data/contato'
import './Contato.css'
import { FaGithub,
    FaInstagram,
    FaLinkedin } from 'react-icons/fa'
import {
    FiUser,
    FiMail,
    FiMessageSquare,
    FiSend,
    } from 'react-icons/fi'
function Contato() {
    const { t } = useTranslation()
    const [status, setStatus] = useState('parado') // parado | enviando | sucesso | erro

    async function enviar(evento) {
    evento.preventDefault()
    const form = evento.currentTarget
    setStatus('enviando')

    try {
        const resposta = await fetch(contato.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
        })
        if (!resposta.ok) throw new Error('Falha no envio')
        form.reset()
        setStatus('sucesso')
    } catch {
        setStatus('erro')
    }
    }

    return (
    <article className="pagina container">
        <header className="pagina-topo">
        <p className="pagina-faixa">{t('comum.faixa', { numero: '07' })}</p>
        <h1 className="pagina-titulo" tabIndex={-1}>{t('contato.titulo')}</h1>
        <p className="pagina-intro">
            {t('contato.intro')}
        </p>
        </header>

        <div className="contato-grade">
        <section aria-labelledby="contato-redes-titulo">
            <h2 id="contato-redes-titulo" className="subtitulo">{t('contato.redes')}</h2>
            <p className="contato-email">
            <a href={`mailto:${contato.email}`}>{contato.email}</a>
            </p>
            <ul className="contato-redes">
            {contato.redes.map((r) => {
            const icones = {
            github: FaGithub,
            instagram: FaInstagram,
            linkedin: FaLinkedin,
            }
            const Icone = icones[r.nome.trim().toLowerCase()]
            return (
            <li key={r.nome}>
                <a
                    className="contato-rede"
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('contato.redeAria', { nome: r.nome })}
                    title={r.nome}
                >
                    {Icone ? <Icone aria-hidden="true" /> : r.nome}
                </a>
                </li>
                )
            })}
            </ul>
        </section>

        <form className="contato-form papel" onSubmit={enviar}>
            <h2 className="subtitulo">{t('contato.enviarMensagemTitulo')}</h2>

            <label htmlFor="nome" className="contato-label">
                <FiUser aria-hidden="true" />
                {t('contato.nome')}
                </label>
                <input
                id="nome"
                name="nome"
                type="text"
                required
                autoComplete="name"
                />

            <label htmlFor="email" className="contato-label">
                <FiMail aria-hidden="true" />
                {t('contato.email')}
            </label>
            <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
            />

            <label htmlFor="mensagem" className="contato-label">
                <FiMessageSquare aria-hidden="true" />
                {t('contato.mensagem')}
            </label>
            <textarea
                id="mensagem"
                name="mensagem"
                rows="5"
                required
            />

            <button
            type="submit"
            className="botao botao--primario contato-enviar"
            disabled={status === 'enviando'}
            >
                <FiSend aria-hidden="true" />
                {status === 'enviando' ? t('contato.enviando') : t('contato.enviar')}
            </button>

            <p className="contato-status" role="status">
            {status === 'sucesso' && t('contato.sucesso')}
            {status === 'erro' && t('contato.erro')}
            </p>
        </form>
        </div>
    </article>
    )
}

export default Contato
