import i18n, { FUSO_HORARIO, LOCALES } from '../i18n'

// Idioma atual ('pt' ou 'en') e o locale correspondente ('pt-BR' ou 'en-US').
// Funções chamadas durante a renderização leem o idioma na hora, então a troca
// de idioma reflete nas datas e nos números sem recarregar a página.
export function idiomaAtual() {
    return String(i18n.language ?? 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt'
}

export function localeAtual() {
    return LOCALES[idiomaAtual()]
}

// Os formatadores são criados uma vez por idioma e opções, porque criar um Intl.* custa caro.
const cacheDatas = new Map()
const cacheNumeros = new Map()

export function formatadorData(opcoes = {}) {
    const locale = localeAtual()
    const chave = `${locale}|${JSON.stringify(opcoes)}`
    if (!cacheDatas.has(chave)) {
        cacheDatas.set(chave, new Intl.DateTimeFormat(locale, { timeZone: FUSO_HORARIO, ...opcoes }))
    }
    return cacheDatas.get(chave)
}

export function formatadorNumero(opcoes = {}) {
    const locale = localeAtual()
    const chave = `${locale}|${JSON.stringify(opcoes)}`
    if (!cacheNumeros.has(chave)) {
        cacheNumeros.set(chave, new Intl.NumberFormat(locale, opcoes))
    }
    return cacheNumeros.get(chave)
}

// O i18next escolhe singular/plural pelo `count`. Aqui só o 1 é singular
// (0 e 2 ou mais usam o plural: "0 dias", "1 dia", "2 dias"), em português e em inglês.
export const paraPlural = (n) => (n === 1 ? 1 : 2)

// Garante que um texto que deveria ser uma lista (returnObjects) sempre vire array
export const comoLista = (valor) => (Array.isArray(valor) ? valor : [])
