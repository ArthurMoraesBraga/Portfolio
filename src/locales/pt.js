// Traduções em português (idioma padrão). Cada chave daqui precisa existir também em en.js.
// Para conferir se os dois arquivos estão alinhados: node scripts/verificar-traducoes.mjs
//
// Convenções:
// - {{variavel}} é preenchida pelo t(); plurais usam o sufixo _one / _other e o par {{n}} + count.
// - Nomes próprios (pessoas, projetos, músicas, artistas, instituições, certificados e
//   disciplinas) ficam nos arquivos de src/data e não são traduzidos.

const pt = {
    meta: {
        descricao: 'Portfólio de Arthur Moraes, estudante de Engenharia de Software.',
        tituloInicio: '{{nome}} · Portfólio',
        tituloPagina: '{{pagina}} · {{nome}}',
    },

    idioma: {
        grupo: 'Idioma',
        pt: 'PT – Português',
        en: 'EN – English',
        trocarParaPt: 'Mudar para português',
        trocarParaEn: 'Mudar para inglês',
    },

    comum: {
        faixa: 'Faixa {{numero}}',
        abreEmNovaAba: 'abre em nova aba',
        abreEmNovaAbaTitulo: '({{titulo}}, abre em nova aba)',
        abreEmNovaAbaParenteses: '(abre em nova aba)',
        tentarNovamente: 'Tentar novamente',
        intervalo: '{{de}} a {{ate}}',
        diasSemanaCurto: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    },

    app: {
        pularConteudo: 'Ir para o conteúdo',
    },

    intro: {
        abrindo: 'Abrindo o portfólio de {{nome}}',
    },

    rodape: {
        texto: '© {{ano}} {{nome}}. Feito com React e muita música.',
    },

    rotas: {
        inicio: { titulo: 'Início' },
        sobre: { titulo: 'Sobre mim', descricao: 'Trajetória, formação e objetivos' },
        projetos: { titulo: 'Projetos', descricao: 'Uma linha do tempo do que construí' },
        certificados: { titulo: 'Certificados', descricao: 'Cursos e formações' },
        musicas: { titulo: 'Músicas', descricao: 'Minhas favoritas, com play' },
        canvas: {
            titulo: 'Canvas',
            descricao: 'Espaço aonde fica minhas notas e estatisticas escolares',
        },
        GitHub: { titulo: 'GitHub', descricao: 'Minhas contribuições no gitHub' },
        contato: { titulo: 'Contato', descricao: 'Redes sociais e mensagem' },
    },

    menu: {
        voltarInicio: 'Voltar ao início',
        inicio: 'Início',
        faixas: 'Faixas',
        paginasPortfolio: 'Páginas do portfólio',
    },

    faixaNav: {
        rotulo: 'Faixa anterior e próxima',
        anterior: '← Faixa anterior',
        colecao: '← Coleção',
        inicio: 'Início',
        proxima: 'Próxima faixa →',
        fimAlbum: 'Fim do álbum →',
        voltarColecao: 'Voltar à coleção',
    },

    inicio: {
        escolhaFaixa: 'Escolha uma faixa',
        dica: 'Cada capa leva a uma página.',
    },

    perfil: {
        cargo: 'Estudante de Engenharia de Software',
        fotoAlt: 'Ilustração em pixel art',
        lema: 'Cada projeto, uma nova faixa.',
        sobre: [
            'Sou o Arthur Moraes Braga Araujo, tenho 18 anos e estou no 2° periodo do curso de Engenharia de Software na Pontifícia Universidade Católica de Minas Gerais (Puc Minas). Tenho interesse na área desde os meus 14 anos, quando participei de um projeto de robótica de FLL no SESI ALVIMAR CARNEIRO DE REZENDE, na ocasião participei da equipe de robótica Harry Blocks e tive meu primeiro contato com programação, me interessei na área e desde então almejo me tornar um profissional de tecnologia. Além disso no ano de 2023 fiz um curso profissionalizante de Manutenção de Máquinas Industriais no SENAI, onde aprendi a trabalhar com máquinas industriais, onde aprendi a trabalhar em grupo e também adentrei mais nas pesquisas técnicas.',
            'A música também faz parte dos meus interesses pessoais, e quis trazer esse lado para o meu portfólio. A ideia dos discos de vinil une meu gosto musical ao aprendizado de desenvolvimento web, criando um espaço que apresenta tanto meus projetos quanto um pouco da minha personalidade. Desenvolver esse portfólio em React é uma oportunidade de explorar novas ferramentas e transformar uma ideia criativa em uma experiência interativa.',
        ],
        formacao: {
            senai: {
                curso: 'Manutenção de máquinas industriais',
                periodo: '2023 — 2024',
            },
            puc: {
                curso: 'Engenharia de Software',
                periodo: '2026 — ',
            },
        },
        objetivos:
            'Meu objetivo é me tornar um profissional qualificado em cibersegurança, a área da tecnologia que mais despertou meu interesse. Busco aprofundar meus conhecimentos em proteção de sistemas, análise de vulnerabilidades e implementação de soluções de segurança robustas. Paralelamente, desenvolvi grande afinidade com o back-end de aplicações web, especialmente utilizando Java e Spring Boot, implementar arquiteturas escaláveis e integrar sistemas com bancos de dados. Minha meta é unir essas duas competências para desenvolver aplicações que sejam não apenas funcionais e eficientes, mas também seguras desde a concepção, aplicando boas práticas de desenvolvimento seguro e contribuindo para um ambiente digital mais protegido contra ameaças cibernéticas.',
    },

    experiencias: {
        'exp-1': {
            cargo: 'FLL, robótica e programação',
            periodo: 'Janeiro/2022 - Junho/2023',
            atividades: [
                'Era o programador principal da minha equipe juntamente com meu colega Rafael, responsável programação do robô para executar as missões da FIRST LEGO League.',
            ],
            aprendizados:
                'Desenvolvi habilidades de programação, raciocínio lógico e resolução de problemas, além de aprender a trabalhar em equipe para superar os desafios das missões.',
        },
        'exp-2': {
            cargo: 'Manutenção de máquinas',
            periodo: 'Janeiro/2023-Dezembro/2023',
            atividades: [
                'Realizei atividades relacionadas à manutenção de máquinas industriais, colocando em prática os conhecimentos adquiridos no SENAI.',
            ],
            aprendizados:
                'Ampliei meus conhecimentos técnicos em manutenção industrial e desenvolvi responsabilidade, organização e colaboração no ambiente profissional.',
        },
    },

    interesses: {
        ciberseguranca: {
            titulo: 'Cibersegurança',
            descricao:
                'É a área da tecnologia que mais despertou meu interesse. Quero compreender como identificar vulnerabilidades e proteger sistemas e informações, desenvolvendo os conhecimentos necessários para me tornar um bom profissional de cibersegurança.',
        },
        backend: {
            titulo: 'Desenvolvimento Backend',
            descricao:
                'Gosto de entender o que acontece por trás das páginas e como os sistemas processam informações. Tenho interesse em desenvolver APIs, trabalhar com bancos de dados e construir a lógica que faz uma aplicação funcionar.',
        },
        motociclismo: {
            titulo: 'Motos e tecnologia',
            descricao:
                'ambém gosto de motos e tenho curiosidade sobre a tecnologia presente nelas. Vejo uma oportunidade de conectar esse interesse à programação, explorando ideias de aplicações para acompanhar manutenções e organizar informações sobre uma moto.',
        },
    },

    sobre: {
        titulo: 'Sobre mim',
        baixarCurriculo: 'Baixar currículo',
        curriculoTitulo: 'Currículo de {{nome}} (PDF)',
        verCurriculo: 'Ver currículo',
        fecharCurriculo: 'Fechar',
        curriculoIndisponivel: 'O currículo ainda não está disponível. Volte em breve.',
        curriculoArquivo: 'Curriculo-Arthur-Moraes.pdf',
        trajetoria: 'Trajetória',
        formacao: 'Formação',
        experiencias: 'Experiências',
        experienciasNota: 'Minha trajetória até aqui, com o que fiz e o que aprendi.',
        aprendizado: 'Aprendizado:',
        interesses: 'Áreas de interesse',
        interessesNota: 'O que quero explorar e por que isso me atrai.',
        objetivos: 'Objetivos profissionais',
    },

    projetos: {
        titulo: 'Projetos',
        intro: 'Lista de projetos desenvolvidos ao longo da minha trajetória.',
        capaAria: 'Capa do projeto {{titulo}}',
        contribuicao: 'Minha contribuição',
        tecnologias: 'Tecnologias',
        verGithub: 'Ver no GitHub',
        verDemo: 'Ver demonstração',
        status: {
            concluido: 'Concluído',
            em_desenvolvimento: 'Em desenvolvimento',
        },
        tipo: {
            grupo: 'Em grupo',
        },
        reconhecimentos: {
            'wms-2026-1': 'Vencedor do We Make Software do primeiro semestre do primeiro periodo de 2026.',
        },
        itens: {
            'estagi-on': {
                descricao:
                    'O Estagi.ON é uma plataforma web desenvolvida para centralizar e otimizar o recrutamento de estágios, conectando estudantes universitários e empresas. A solução oferece perfis acadêmicos padronizados e um sistema de busca inteligente com filtros por curso, período e competências.',
                contribuicao:
                    'Desenvolvi a interface de listagem de vagas, com busca, filtros e ordenação alfabética. Implementei a funcionalidade de favoritos e a identificação de novas oportunidades, além de contribuir para a prototipação interativa e a documentação do projeto.',
            },
            'meu-bolso': {
                descricao:
                    'O MeuBolso é uma aplicação web desenvolvida para ajudar jovens a organizar suas finanças pessoais. A plataforma permite controlar gastos, gerenciar carteiras e estabelecer metas financeiras, incentivando decisões mais conscientes e um futuro financeiro mais seguro.',
                contribuicao: 'Responsável pelo front-end da aplicação.',
            },
        },
    },

    certificados: {
        titulo: 'Certificados',
        intro: 'Cursos e experiências que complementam minha formação.',
        abrirCertificado: 'Abrir certificado: {{nome}}',
        previa: 'Prévia do certificado: {{nome}}',
        abrirPdf: 'Abrir PDF',
    },

    musicas: {
        titulo: 'Músicas',
        faixaDeTotal: 'Faixa {{n}} de {{total}}',
        playlist: 'Playlist',
        minhaPlaylist: 'Minha playlist',
        montando: 'Minha seleção musical está sendo montada. Volte em breve.',
        listaFaixas: 'Lista de faixas',
        selecionar: 'Selecionar {{titulo}}, de {{artista}}',
        selecionarPlaylist: 'Selecionar a playlist {{titulo}}',
        tituloPlaylists: 'Minhas playlist',
        comentarios: {
            'musica-1':
                'Uma música que me inspira a continuar buscando meus objetivos, mesmo diante das dificuldades.',
            'musica-2': 'Escutava essa música quando era criança juntamente com meu pai, representa muito para mim',
            'musica-3': 'Minha música preferida do meu artista favorito.',
            'musica-4': 'Mensagem de liberdade e energia leve que a música tras'
        },
        comentarioPlaylist: 'Melhores musicas',
    },

    spotify: {
        abrir: 'Abrir no Spotify',
        playerRotulo: 'Player do Spotify',
        playerTitulo: 'Player do Spotify: {{titulo}}',
        carregando: 'Carregando o player do Spotify…',
        indisponivel:
            'O disco não acompanha a música porque o controle do Spotify não carregou (um bloqueador de anúncios pode ter impedido). O player continua funcionando.',
        tocando: 'Tocando agora',
        apertePlay: 'Aperte play no player para ouvir.',
        semPlayer: 'Esta faixa ainda não tem player.',
    },

    contato: {
        titulo: 'Contato',
        intro: 'Vamos conversar? Mande uma mensagem ou me encontre nas redes.',
        redes: 'Redes sociais',
        enviarMensagemTitulo: 'Envie uma mensagem',
        nome: 'Nome',
        email: 'E-mail',
        mensagem: 'Mensagem',
        enviando: 'Enviando...',
        enviar: 'Enviar mensagem',
        sucesso: 'Mensagem enviada. Obrigado pelo contato!',
        erro: 'Não foi possível enviar. Tente novamente ou use o e-mail desta página.',
        redeAria: '{{nome}} (abre em nova aba)',
    },

    canvas: {
        titulo: 'Canvas',
        textos: {
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
        },
        abas: {
            rotulo: 'Seções do Canvas',
            turmas: 'Turmas',
            atividades: 'Atividades',
            notas: 'Notas',
        },
        situacoes: {
            pendente: 'Pendente',
            prazo_encerrado: 'Prazo encerrado sem entrega',
            entregue: 'Entregue',
            avaliada: 'Avaliada',
            dispensada: 'Dispensada',
            sem_envio_online: 'Sem envio online',
        },
        atualizacao: 'Última atualização:',
        horarioBrasilia: '(horário de Brasília)',
        dataHora: '{{data}} às {{hora}}',
        prazo: {
            semPrazo: 'Sem prazo definido',
            hoje: 'hoje',
            amanha: 'amanhã',
            ontem: 'ontem',
            emDias: 'em {{n}} dias',
            haDias: 'há {{n}} dias',
        },
        nota: {
            naoPublicada: 'Não publicada',
            publicada: 'Publicada',
        },
        periodoNaoInformado: 'Período não informado',
        semestre: {
            rotulo: 'Semestre',
            nome: '{{n}}º semestre',
            materias_one: '{{n}} matéria',
            materias_other: '{{n}} matérias',
        },
        turma: 'Turma {{id}}',
        estatisticas: {
            atividades: 'Atividades',
            pendentes: 'Pendentes',
            entregues: 'Entregues',
            avaliadas: 'Avaliadas',
        },
        prazoEncerradoSemEntrega: 'com prazo encerrado sem entrega',
        proximoPrazo: 'Próximo prazo:',
        nenhumPendente: 'nenhum pendente',
        turmasReunidas: '{{n}} turmas reunidas (teoria e laboratório)',
        verAtividades: 'Ver atividades',
        verAtividadesDe: 'de {{nome}}',
        materiaAtividades: 'Atividades de todas as turmas desta matéria no semestre selecionado.',
        notaAcumulada: 'Nota acumulada nas atividades',
        semNotaPublicada: 'Sem nota publicada',
        pontosTotal: '{{obtidos}} / {{maximo}} pontos',
        pontos_one: '{{valor}} ponto',
        pontos_other: '{{valor}} pontos',
        atividadeSemTitulo: 'Atividade sem título',
        entregueEm: 'Entregue em {{quando}}',
        vale_one: 'Vale {{valor}} ponto',
        vale_other: 'Vale {{valor}} pontos',
        notaPontos_one: 'Nota: {{valor}} ponto',
        notaPontos_other: 'Nota: {{valor}} pontos',
        calendario: {
            atividadesNoMes_one: '{{n}} atividade neste mês · horários de Brasília',
            atividadesNoMes_other: '{{n}} atividades neste mês · horários de Brasília',
            mesAnterior: 'Mês anterior',
            proximoMes: 'Próximo mês',
            hoje: 'Hoje',
            calendarioDe: 'Calendário de {{mes}}',
            diaAria_one: '{{data}}, {{n}} atividade',
            diaAria_other: '{{data}}, {{n}} atividades',
            atividadesDoDia: 'Atividades do dia selecionado',
            noDiaSelecionado_one: '{{n}} atividade no dia selecionado.',
            noDiaSelecionado_other: '{{n}} atividades no dia selecionado.',
            nenhumaNoDia: 'Nenhuma atividade com prazo neste dia.',
            semPrazo: 'Sem prazo definido ({{n}})',
        },
    },

    wakatime: {
        erro: 'Não foi possível carregar as estatísticas do WakaTime.',
        carregando: 'Carregando dados do WakaTime…',
        rotulo: 'Estatísticas do WakaTime',
        resumo: 'Meu tempo de programação registrado pelo WakaTime.',
        outras: 'Outras',
        linguagensTitulo: 'Linguagens na minha rotina',
        linguagensNota: 'Distribuição do tempo registrado no compartilhamento de linguagens do WakaTime.',
        editores: 'Editores utilizados',
        periodo: 'Período: {{de}} a {{ate}}.',
        cards: {
            tempo: {
                faixa: '01 · Tempo registrado',
                titulo: 'Horas de programação',
                nota: 'Tempo de atividade registrado no editor.',
            },
            rotina: {
                faixa: '02 · Rotina',
                titulo: 'Média diária',
                nota: 'Média calculada pelo WakaTime.',
            },
            melhorDia: {
                faixa: '03 · Maior atividade',
                titulo: 'Dia com mais tempo',
            },
            historico: {
                faixa: '04 · Histórico',
                titulo: 'Período acompanhado',
                dias_one: '{{n}} dia',
                dias_other: '{{n}} dias',
                nota: 'Inclui dias sem atividade.',
            },
        },
    },

    github: {
        faixaTitulo: 'GitHub',
        secoes: {
            rotulo: 'Seções das estatísticas',
            resumo: { rotulo: 'Resumo', descricao: 'Perfil e números gerais' },
            linguagens: {
                rotulo: 'Linguagens',
                descricao: 'Linguagens mais usadas e estatísticas do wakatime',
            },
            atividade: { rotulo: 'Atividade', descricao: 'Contribuições ao longo do tempo' },
            horarios: { rotulo: 'Horários', descricao: 'Quando os commits acontecem' },
            repositorios: { rotulo: 'Repositórios', descricao: 'Repositórios públicos' },
        },
        textos: {
            intro: 'Estatísticas montadas ao vivo com dados públicos do GitHub. Cada seção explica o período e os repositórios analisados.',
            carregando: 'Carregando dados do GitHub…',
            erro: 'Não foi possível carregar estes dados agora. Verifique a conexão e tente de novo.',
            limite: 'O limite de consultas do GitHub foi atingido para este navegador. Os dados voltam a carregar depois do horário de liberação.',
            vazio: 'Ainda não há dados públicos suficientes para este gráfico.',
            tentarDeNovo: 'Tentar novamente',
            indisponivel: 'Indisponível agora',
            diferencaContribuicoes:
                'Contribuições e commits não são a mesma coisa. As contribuições (calendário do perfil) somam commits, pull requests, issues e revisões de código. Já os commits contados nesta página são só os públicos, na branch principal, ligados ao seu usuário.',
        },
        dias: {
            0: { curto: 'Dom', longo: 'domingo' },
            1: { curto: 'Seg', longo: 'segunda-feira' },
            2: { curto: 'Ter', longo: 'terça-feira' },
            3: { curto: 'Qua', longo: 'quarta-feira' },
            4: { curto: 'Qui', longo: 'quinta-feira' },
            5: { curto: 'Sex', longo: 'sexta-feira' },
            6: { curto: 'Sáb', longo: 'sábado' },
        },
        periodos: {
            madrugada: 'Madrugada',
            manha: 'Manhã',
            tarde: 'Tarde',
            noite: 'Noite',
        },
        metodologia: {
            titulo: 'Como estes dados são obtidos e quais são os limites',
            itens: {
                perfil: {
                    titulo: 'Perfil, estrelas, forks e linguagens',
                    texto: 'Vêm da API pública do GitHub (usuário e lista de repositórios). Só entram repositórios públicos próprios; forks de outros projetos ficam de fora. A linguagem de cada repositório é a principal detectada pelo GitHub: o gráfico conta repositórios, não linhas de código.',
                },
                commits: {
                    titulo: 'Commits por dia da semana e horário',
                    texto: 'A análise consulta commits públicos desde a criação da conta até hoje. Os horários são convertidos para America/Sao_Paulo.',
                },
                ausencias: {
                    titulo: 'O que não aparece',
                    texto: 'Repositórios privados, commits fora da branch principal, commits com e-mail não vinculado à conta e visitas ao perfil ou aos repositórios, que a API do GitHub não disponibiliza. Sem token, o GitHub permite 60 chamadas por hora e 10 buscas por minuto por conexão; por isso os resultados ficam guardados por 30 minutos neste navegador.',
                },
            },
        },
        estado: {
            liberacao: 'Liberação prevista: {{hora}} (horário de Brasília).',
        },
        aviso: {
            falhas: 'Alguns dados não carregaram: {{lista}}.',
            limite: 'O limite de consultas libera por volta de {{hora}}.',
            fontes: {
                perfil: 'perfil',
                contribuicoes: 'contribuições',
                commits: 'commits',
                contagens: 'pull requests e issues',
            },
        },
        perfil: {
            desde: 'No GitHub desde {{ano}}',
        },
        indicadores: {
            repos: {
                rotulo: 'Repositórios públicos',
                notaSemForks: 'próprios, sem forks',
                notaForks_one: 'próprios; {{n}} fork ignorado',
                notaForks_other: 'próprios; {{n}} forks ignorados',
            },
            estrelas: { rotulo: 'Estrelas', nota: 'recebidas nos seus repositórios' },
            forks: { rotulo: 'Forks recebidos', nota: 'cópias dos seus repositórios' },
            seguidores: { rotulo: 'Seguidores', nota: 'seguindo {{n}}' },
            contribuicoes: { rotulo: 'Contribuições' },
            commits: { rotulo: 'Commits públicos' },
            pullRequests: { rotulo: 'Pull requests', nota: 'públicos, desde sempre' },
            issues: { rotulo: 'Issues', nota: 'públicas, desde sempre' },
            diasAtivos: { rotulo: 'Dias com contribuição' },
            maiorSequencia: { rotulo: 'Maior sequência', semSequencia: 'sem sequência' },
        },
        unidades: {
            dia_one: '{{n}} dia',
            dia_other: '{{n}} dias',
            contribuicao_one: '{{n}} contribuição',
            contribuicao_other: '{{n}} contribuições',
            commit_one: '{{n}} commit',
            commit_other: '{{n}} commits',
            commitPublico_one: '{{n}} commit público',
            commitPublico_other: '{{n}} commits públicos',
            repositorio_one: '{{n}} repositório',
            repositorio_other: '{{n}} repositórios',
            repositorioPublico_one: '{{n}} repositório público',
            repositorioPublico_other: '{{n}} repositórios públicos',
            repositorioPublicoProprio_one: '{{n}} repositório público próprio',
            repositorioPublicoProprio_other: '{{n}} repositórios públicos próprios',
        },
        linguagens: {
            nenhuma: 'Nenhum repositório público tem linguagem detectada pelo GitHub.',
            resumo: 'Linguagem principal de <strong>{{total}}</strong>. O gráfico conta repositórios, não linhas de código.',
            resumoComExcecao_one:
                'Linguagem principal de <strong>{{total}}</strong> ({{n}} repositório ficou de fora por não ter linguagem detectada). O gráfico conta repositórios, não linhas de código.',
            resumoComExcecao_other:
                'Linguagem principal de <strong>{{total}}</strong> ({{n}} repositórios ficaram de fora por não ter linguagem detectada). O gráfico conta repositórios, não linhas de código.',
            discoAria: 'Disco com {{n}} fatias de linguagens, detalhadas na lista ao lado.',
            outras: 'Outras ({{n}})',
            repos: 'REPOS',
        },
        atividade: {
            vazio: 'Ainda não há contribuições públicas registradas neste perfil.',
            contribuicaoTotal: 'Contribuição total',
            sequenciaAtual: 'sequência atual',
            maiorSequenciaHistorico: 'maior sequência (histórico)',
            hoje: 'hoje',
            semSequencia: 'sem sequência',
            nenhumaContribuicao: '{{data}}: nenhuma contribuição',
            contribuicaoNoDia: '{{data}}: {{contribuicoes}}',
            resumoCalendario: '<strong>{{total}}</strong> de {{de}} a {{ate}}. Inclui commits, pull requests, issues e revisões.',
            calendarioAria: 'Calendário de contribuições de {{de}} a {{ate}}, com {{total}}.',
            diaMaisAtivoAria: 'Dia mais ativo: {{descricao}}.',
            diaMaisAtivo: 'Dia mais ativo: {{descricao}}',
            menos: 'menos',
            mais: 'mais',
            porAnoTitulo: 'Contribuições por ano',
            porAnoVazio: 'Nenhuma contribuição encontrada no histórico do perfil.',
            porAnoLegenda: 'Contribuições por ano',
            porAnoLeitura: '{{ano}} · {{contribuicoes}}',
            porAnoLeituraAtual: '{{ano}} · {{contribuicoes}} (até hoje)',
            fonte: 'Fonte: calendário público do perfil.',
        },
        horarios: {
            nenhumCommit: 'Nenhum commit público foi encontrado de {{de}} a {{ate}}.',
            resumo:
                'Horário com maior frequência de commits: <strong>{{hora}}</strong>, e o período com mais commits é a <strong>{{periodo}}</strong> ({{percentual}}).',
            amostraExata: 'Todos os {{commits}} de {{de}} a {{ate}} foram analisados.',
            amostraParcial:
                'Foram analisados {{analisados}} dos {{commits}} de {{de}} a {{ate}}. A busca do GitHub devolve no máximo 100 commits por página, então, nos trimestres com mais commits, só os mais recentes entram. Cada commit analisado representa os demais do trimestre, e os números com ≈ são estimativas, não contagens exatas.',
            incompleto: 'O GitHub avisou que parte dos resultados desta busca veio incompleta.',
            fuso: 'Horários no fuso America/Sao_Paulo.',
            porHorarioTitulo: 'Commits por horário do dia',
            porHorarioLegenda: 'Distribuição dos commits por horário do dia, em porcentagem',
            porDiaTitulo: 'Commits por dia da semana',
            commitsPercentual: 'commits, {{percentual}}',
            porPeriodoTitulo: 'Commits por período',
            reposAnalisados: 'Repositórios com commits analisados ({{n}})',
            reposNota: 'A contagem por repositório considera apenas os commits analisados na amostra.',
        },
        repositorios: {
            vazio: 'Nenhum repositório público próprio encontrado.',
            ordem: ', em ordem de estrelas e, no empate, do mais recente.',
            forksFora_one: '{{n}} fork de outro projeto ficou de fora.',
            forksFora_other: '{{n}} forks de outros projetos ficaram de fora.',
            truncado: 'Foram lidos só os {{n}} mais recentes.',
            estrelas: 'estrelas',
            forks: 'forks',
            arquivado: 'arquivado',
            atualizadoEm: 'Atualizado em {{data}}',
            mostrarMenos: 'Mostrar menos',
            mostrarTodos: 'Mostrar todos ({{n}})',
        },
    },
}

export default pt
