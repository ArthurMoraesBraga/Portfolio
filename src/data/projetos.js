const logoEstagiOn = 'images/Logo_estagiOn.png'
const LogoMeuBolso = 'images/Logo_meu_bolso.png'
// Título, tecnologias, links e cores são fixos. `status`, `tipo` e `reconhecimento` são códigos
// e, junto com a descrição e a contribuição, os textos ficam em src/locales, em projetos.*
export const projetos = [
    {
    id: 'estagi-on',
    titulo: 'Estagi.ON',
    status: 'concluido',
    ano: '2026',
    tipo: 'grupo',
    reconhecimento: 'wms-2026-1',
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'JSON Server'],
    cor: '#eaf4fc',
    capa: logoEstagiOn,
    demonstracao: '/images/estagi-on.gif',
    repositorio: 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0427200-estagi-on',
    demo: null,
    },
    {
    id: 'meu-bolso',
    titulo: 'Meu Bolso',
    status: 'em_desenvolvimento',
    ano: '2026',
    tipo: 'grupo',
    reconhecimento: null,
    tecnologias: ['React', 'Vite', 'CSS', 'JavaScript', 'Spring Boot', 'HTML'],
    cor: '#b8f3ab',
    capa: LogoMeuBolso,
    demonstracao: null,
    repositorio:'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti2-8183100-meu-bolso',
    demo: null,

    },

]
