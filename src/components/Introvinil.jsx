import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { perfil } from '../data/perfil'
import './Introvinil.css'

function IntroVinil({ onFinish }) {
    const { t } = useTranslation()
    const [saindo, setSaindo] = useState(false)

    useEffect(() => {
    const iniciarSaida = setTimeout(() => {
        setSaindo(true)
    }, 3200)

    const finalizar = setTimeout(() => {
        onFinish()
    }, 4000)

    return () => {
        clearTimeout(iniciarSaida)
        clearTimeout(finalizar)
    }
    }, [onFinish])

    return (
    <div
        className={`intro-vinil ${saindo ? 'intro-vinil--saindo' : ''}`}
        role="status"
        aria-label={t('intro.abrindo', { nome: perfil.nome })}
    >
        <div className="intro-conteudo">
        <div className="vinil" aria-hidden="true">
            <div className="vinil-etiqueta">
            <span>{perfil.iniciais}</span>
            <div className="vinil-furo" />
            </div>
        </div>

        <p className="intro-nome">{perfil.nome}</p>
        <p className="intro-legenda">{t('perfil.lema')}</p>
        </div>

    </div>
    )
}

export default IntroVinil
