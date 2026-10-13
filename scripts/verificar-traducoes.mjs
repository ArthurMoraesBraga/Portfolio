// Confere se src/locales/pt.js e src/locales/en.js estão alinhados:
// mesmas chaves, mesmas variáveis {{...}} e listas com o mesmo tamanho.
// Uso: node scripts/verificar-traducoes.mjs
import pt from '../src/locales/pt.js'
import en from '../src/locales/en.js'

function achatar(objeto, prefixo = '', saida = new Map()) {
    for (const [chave, valor] of Object.entries(objeto)) {
        const caminho = prefixo ? `${prefixo}.${chave}` : chave
        if (Array.isArray(valor)) {
            saida.set(caminho, valor)
        } else if (valor && typeof valor === 'object') {
            achatar(valor, caminho, saida)
        } else {
            saida.set(caminho, valor)
        }
    }
    return saida
}

const variaveis = (texto) => [...String(texto).matchAll(/{{\s*([^}\s]+)\s*}}/g)].map((m) => m[1]).sort().join(',')
const tags = (texto) => [...String(texto).matchAll(/<\/?([a-z]+)>/g)].map((m) => m[0]).sort().join(',')

const a = achatar(pt)
const b = achatar(en)
const problemas = []

for (const chave of a.keys()) if (!b.has(chave)) problemas.push(`Falta em en.js: ${chave}`)
for (const chave of b.keys()) if (!a.has(chave)) problemas.push(`Falta em pt.js: ${chave}`)

for (const [chave, valorPt] of a) {
    if (!b.has(chave)) continue
    const valorEn = b.get(chave)
    if (Array.isArray(valorPt) !== Array.isArray(valorEn)) {
        problemas.push(`Tipos diferentes (lista x texto): ${chave}`)
        continue
    }
    const listaPt = Array.isArray(valorPt) ? valorPt : [valorPt]
    const listaEn = Array.isArray(valorEn) ? valorEn : [valorEn]
    if (listaPt.length !== listaEn.length) problemas.push(`Tamanhos de lista diferentes: ${chave}`)
    listaPt.forEach((textoPt, i) => {
        const textoEn = listaEn[i]
        if (typeof textoPt !== 'string' || typeof textoEn !== 'string') return
        if (textoPt.trim() === '' || textoEn.trim() === '') problemas.push(`Texto vazio: ${chave}`)
        if (variaveis(textoPt) !== variaveis(textoEn)) {
            problemas.push(`Variáveis {{...}} diferentes em ${chave}: [${variaveis(textoPt)}] x [${variaveis(textoEn)}]`)
        }
        if (tags(textoPt) !== tags(textoEn)) problemas.push(`Tags <...> diferentes em ${chave}`)
    })
}

if (problemas.length) {
    console.error(`\n${problemas.length} problema(s) nas traduções:\n- ${problemas.join('\n- ')}\n`)
    process.exit(1)
}
console.log(`Traduções alinhadas: ${a.size} chaves em pt e en.`)
