import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import pt from './locales/pt'
import en from './locales/en'
import { perfil } from './data/perfil'

// Sistema único de idiomas do portfólio: i18next + react-i18next.
// As traduções ficam pré-cadastradas em src/locales/pt.js e src/locales/en.js
// e os componentes só chamam t('chave'). Nada é traduzido em tempo real por serviço externo.

export const IDIOMAS = ['pt', 'en']
export const IDIOMA_PADRAO = 'pt'
export const CHAVE_IDIOMA = 'portfolio-idioma'

// Valor do atributo lang do <html> e locale usado nas datas e nos números
export const LANG_HTML = { pt: 'pt-BR', en: 'en' }
export const LOCALES = { pt: 'pt-BR', en: 'en-US' }

// Fuso usado em todos os horários exibidos, em qualquer idioma
export const FUSO_HORARIO = 'America/Sao_Paulo'

// Só aceita idiomas conhecidos (pt, pt-BR, en, en-US...) e devolve 'pt' ou 'en'
function normalizar(valor) {
    const base = String(valor ?? '').toLowerCase().slice(0, 2)
    return IDIOMAS.includes(base) ? base : null
}

// Lê a preferência salva. Se o localStorage estiver bloqueado (navegação privada,
// por exemplo), o site continua funcionando e só não lembra da escolha.
function lerIdiomaSalvo() {
    try {
        return normalizar(window.localStorage.getItem(CHAVE_IDIOMA))
    } catch {
        return null
    }
}

function salvarIdioma(idioma) {
    try {
        window.localStorage.setItem(CHAVE_IDIOMA, idioma)
    } catch {
        /* sem armazenamento: vale só para esta visita */
    }
}

// Primeira visita: português. Se já houver preferência salva, ela vale.
i18n.use(initReactI18next).init({
    resources: {
        pt: { translation: pt },
        en: { translation: en },
    },
    lng: lerIdiomaSalvo() ?? IDIOMA_PADRAO,
    fallbackLng: IDIOMA_PADRAO,
    supportedLngs: IDIOMAS,
    interpolation: { escapeValue: false }, // o React já escapa
    returnNull: false,
})

function aplicarIdiomaNoDocumento(idioma) {
    const chave = normalizar(idioma) ?? IDIOMA_PADRAO
    document.documentElement.lang = LANG_HTML[chave]
    document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', i18n.t('meta.descricao'))
}

aplicarIdiomaNoDocumento(i18n.language)
// Título da aba durante a abertura com o disco (depois, App.jsx cuida do título de cada página)
document.title = i18n.t('meta.tituloInicio', { nome: perfil.nome })

i18n.on('languageChanged', (idioma) => {
    salvarIdioma(normalizar(idioma) ?? IDIOMA_PADRAO)
    aplicarIdiomaNoDocumento(idioma)
})

// Se o idioma mudar em outra aba aberta do site, esta aba acompanha
window.addEventListener('storage', (evento) => {
    if (evento.key !== CHAVE_IDIOMA) return
    const novo = normalizar(evento.newValue)
    if (novo && novo !== normalizar(i18n.language)) i18n.changeLanguage(novo)
})

export default i18n
