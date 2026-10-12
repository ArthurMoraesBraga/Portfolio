    export const CANVAS_CONFIG = {
    versaoEsperada: 1,
    locale: 'pt-BR',
    fusoHorario: 'America/Sao_Paulo',
    diasParaAvisoDesatualizado: 7,
    filtroTodas: 'todas',
    };

    export const ABAS = [
    { id: 'turmas', rotulo: 'Turmas' },
    { id: 'atividades', rotulo: 'Atividades' },
    { id: 'notas', rotulo: 'Notas' },
    ];

    // O estado nunca depende só da cor: cada um tem ícone e texto.
    export const SITUACOES = {
    pendente: { rotulo: 'Pendente', icone: '○' },
    prazo_encerrado: { rotulo: 'Prazo encerrado sem entrega', icone: '!' },
    entregue: { rotulo: 'Entregue', icone: '✓' },
    avaliada: { rotulo: 'Avaliada', icone: '★' },
    dispensada: { rotulo: 'Dispensada', icone: '–' },
    sem_envio_online: { rotulo: 'Sem envio online', icone: '·' },
    };

    export const TEXTOS = {
    titulo: 'Canvas',
    subtitulo: 'Minhas turmas, atividades e notas no Canvas da PUC Minas.',
    avisoSga:
        'As notas desta página vêm do Canvas e podem ser parciais ou provisórias. O registro acadêmico oficial é o do SGA, que prevalece em caso de diferença.',
    semDados: 'Os dados do Canvas ainda não estão disponíveis.',
    semTurmas: 'Nenhuma turma encontrada para o filtro selecionado.',
    semAtividades: 'Nenhuma atividade encontrada para o filtro selecionado.',
    semNotas: 'Nenhuma nota publicada nesta turma até a última atualização.',
    semNotasNota:
        'Atividade sem nota publicada não significa nota zero: a nota apenas ainda não está disponível.',
    atividadesIndisponiveis: 'As atividades desta turma não estavam disponíveis na última atualização.',
    };