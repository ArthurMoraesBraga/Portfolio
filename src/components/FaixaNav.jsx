import { useTranslation } from 'react-i18next'
import Link from '../router/Link'
import { useRota } from '../router/contexto'
import { faixas, inicio } from '../data/rotas'
import './FaixaNav.css'

// Atalhos para a faixa anterior e a próxima, no fim das páginas internas.
function FaixaNav() {
    const { t } = useTranslation()
    const { caminho } = useRota()
    const indice = faixas.findIndex((f) => f.caminho === caminho)
    if (indice === -1) return null

    const anterior = faixas[indice - 1]
    const proxima = faixas[indice + 1]

    return (
    <nav className="faixa-nav container" aria-label={t('faixaNav.rotulo')}>
        {anterior ? (
        <Link para={anterior.caminho} className="faixa-nav-link">
            <span className="faixa-nav-dica">{t('faixaNav.anterior')}</span>
            <span className="faixa-nav-nome">{anterior.faixa} — {t(`rotas.${anterior.id}.titulo`)}</span>
        </Link>
        ) : (
        <Link para={inicio.caminho} className="faixa-nav-link">
            <span className="faixa-nav-dica">{t('faixaNav.colecao')}</span>
            <span className="faixa-nav-nome">{t('faixaNav.inicio')}</span>
        </Link>
        )}

        {proxima ? (
        <Link para={proxima.caminho} className="faixa-nav-link faixa-nav-link--proxima">
            <span className="faixa-nav-dica">{t('faixaNav.proxima')}</span>
            <span className="faixa-nav-nome">{proxima.faixa} — {t(`rotas.${proxima.id}.titulo`)}</span>
        </Link>
        ) : (
        <Link para={inicio.caminho} className="faixa-nav-link faixa-nav-link--proxima">
            <span className="faixa-nav-dica">{t('faixaNav.fimAlbum')}</span>
            <span className="faixa-nav-nome">{t('faixaNav.voltarColecao')}</span>
        </Link>
        )}
    </nav>
    )
}

export default FaixaNav
