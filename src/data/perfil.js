const fotoPerfil = 'images/Imagem_minha_portfolio.png'

// Dados que não mudam com o idioma. Os textos (cargo, lema, trajetória, objetivos, cursos
// e períodos) ficam em src/locales, em perfil.*
export const perfil = {
    nome: 'Arthur Moraes',
    iniciais: 'AM',
    curriculo: '/curriculo.pdf',
    foto: fotoPerfil,

    // O id liga cada item aos textos de perfil.formacao.<id> nos arquivos de tradução.
    // A instituição é nome próprio e não é traduzida.
    formacao: [
        { id: 'senai', instituicao: 'SENAI' },
        { id: 'puc', instituicao: 'Pontifícia Universidade Católica de Minas Gerais' },
    ],
}
