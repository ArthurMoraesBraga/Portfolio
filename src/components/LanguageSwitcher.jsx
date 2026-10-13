import { useTranslation } from 'react-i18next'
import { FiGlobe } from 'react-icons/fi'
import { IDIOMAS } from '../i18n'
import './LanguageSwitcher.css'

// Seletor de idioma: [globo] PT / EN.
// - Dois botões de verdade, com aria-pressed no idioma ativo e foco visível.
// - A troca é feita pelo i18next: os componentes são renderizados de novo, sem recarregar
//   a página e sem perder o estado deles. A escolha vai para o localStorage (ver i18n.js).
function LanguageSwitcher() {
    const { t, i18n } = useTranslation()
    const ativo = String(i18n.resolvedLanguage ?? i18n.language).toLowerCase().startsWith('en') ? 'en' : 'pt'

    return (
        <div className="idioma" role="group" aria-label={t('idioma.grupo')}>
            <FiGlobe className="idioma-icone" aria-hidden="true" />
            {IDIOMAS.map((codigo, indice) => (
                <span key={codigo} className="idioma-item">
                    {indice > 0 && <span className="idioma-barra" aria-hidden="true">/</span>}
                    <button
                        type="button"
                        lang={codigo}
                        className={`idioma-botao${ativo === codigo ? ' idioma-botao--ativo' : ''}`}
                        aria-pressed={ativo === codigo}
                        aria-label={t(`idioma.${codigo}`)}
                        title={t(codigo === 'pt' ? 'idioma.trocarParaPt' : 'idioma.trocarParaEn')}
                        onClick={() => {
                            if (ativo !== codigo) i18n.changeLanguage(codigo)
                        }}
                    >
                        {codigo.toUpperCase()}
                    </button>
                </span>
            ))}
        </div>
    )
}

export default LanguageSwitcher
