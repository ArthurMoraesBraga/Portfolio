// Dados estáticos da página de estatísticas do GitHub: seções, ordem e cores.
// Rótulos, descrições e textos ficam em src/locales, em github.*

export const SECOES = [
    { id: 'resumo' },
    { id: 'linguagens' },
    { id: 'atividade' },
    { id: 'horarios' },
    { id: 'repositorios' },
]

export const SECAO_PADRAO = 'resumo'

// Índice 0 = domingo (mesma convenção de Date.getDay). Os nomes ficam em github.dias.<índice>
// Segunda primeiro, domingo no fim
export const ORDEM_SEMANA = [1, 2, 3, 4, 5, 6, 0]

// Períodos do dia (horas inicial e final, inclusive). Os nomes ficam em github.periodos.<chave>
export const PERIODOS_DIA = [
    { chave: 'madrugada', de: 0, ate: 5 },
    { chave: 'manha', de: 6, ate: 11 },
    { chave: 'tarde', de: 12, ate: 17 },
    { chave: 'noite', de: 18, ate: 23 },
]

// Cores suaves do portfólio, usadas nas fatias do disco de linguagens
export const CORES_LINGUAGENS = [
    '#8fa287',
    '#8fa9b6',
    '#c9bd9a',
    '#5d6e56',
    '#4d6571',
    '#b7c7a9',
    '#a3bac6',
    '#d9cfae',
]
export const COR_OUTRAS = '#b9b3a6'

// Itens da explicação exibida no final da página (títulos e textos em github.metodologia.itens.<id>)
export const METODOLOGIA = ['perfil', 'commits', 'ausencias']
