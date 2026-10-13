// Páginas do portfólio. A ordem das "faixas" define o menu, a coleção da página
// inicial e os botões de faixa anterior / próxima.
// `fundo` e `detalhe` colorem a capa de vinil de cada página.
// Os textos (título e descrição de cada página) ficam em src/locales, em rotas.<id>.
export const rotas = [
    { caminho: '/', id: 'inicio' },
    {
    caminho: '/sobre',
    id: 'sobre',
    faixa: '01',
    fundo: '#cdd9c5',
    detalhe: '#8fa287',
    },
    {
    caminho: '/projetos',
    id: 'projetos',
    faixa: '02',
    fundo: '#d6e5ec',
    detalhe: '#8fa9b6',
    },
    {
    caminho: '/certificados',
    id: 'certificados',
    faixa: '03',
    fundo: '#f3ecd8',
    detalhe: '#c9bd9a',
    },
    {
    caminho: '/musicas',
    id: 'musicas',
    faixa: '04',
    fundo: '#bfcfb6',
    detalhe: '#7d9273',
    },
    {
    caminho: '/canvas',
    id: 'canvas',
    faixa: '05',
    fundo: '#e3eef3',
    detalhe: '#a3bac6',
    },
    {
    caminho: '/GitHub',
    id: 'GitHub',
    faixa: '06',
    fundo: '#f3ecd8',
    detalhe: '#c9bd9a',
    },
    {
    caminho: '/contato',
    id: 'contato',
    faixa: '07',
    fundo: '#bfcfb6',
    detalhe: '#7d9273',
    },
]

export const inicio = rotas[0]
export const faixas = rotas.filter((r) => r.faixa)
