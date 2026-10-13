    export const CANVAS_CONFIG = {
    versaoEsperada: 1,
    locale: 'pt-BR',
    fusoHorario: 'America/Sao_Paulo',
    diasParaAvisoDesatualizado: 7,
    filtroTodas: 'todas',
    };

    // Os rótulos de abas e situações e os textos da página ficam em src/locales, em canvas.*
    export const ABAS = [
    { id: 'turmas' },
    { id: 'atividades' },
    { id: 'notas' },
    ];

    // O estado nunca depende só da cor: cada um tem ícone e texto.
    export const SITUACOES = {
    pendente: { icone: '○' },
    prazo_encerrado: { icone: '!' },
    entregue: { icone: '✓' },
    avaliada: { icone: '★' },
    dispensada: { icone: '–' },
    sem_envio_online: { icone: '·' },
    };
