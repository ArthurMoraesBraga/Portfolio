const fotoPerfil = 'images/Imagem_minha_portfolio.png'

// Dados que não mudam com o idioma. Os textos (cargo, lema, trajetória, objetivos, cursos
// e períodos) ficam em src/locales, em perfil.*
export const perfil = {
    nome: 'Arthur Moraes',
    iniciais: 'AM',
    // Arquivos em /public. Para ter um currículo em inglês, salve-o como curriculo-en.pdf
    // e troque o caminho de `en` abaixo.
    curriculo: { pt: 'Certificados/Curriculo.pdf', en: 'Certificados/Curriculo.pdf' },
    foto: fotoPerfil,

    // O id liga cada item aos textos de perfil.formacao.<id> nos arquivos de tradução.
    // A instituição é nome próprio e não é traduzida.
    formacao: [
        { id: 'senai', instituicao: 'SENAI' },
        { id: 'puc', instituicao: 'Pontifícia Universidade Católica de Minas Gerais' },
    ],
}
