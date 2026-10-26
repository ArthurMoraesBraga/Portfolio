// English translations. Every key here must also exist in pt.js (and vice versa).
// To check that both files are aligned: node scripts/verificar-traducoes.mjs
//
// Conventions:
// - {{variable}} is filled in by t(); plurals use the _one / _other suffix and the {{n}} + count pair.
// - Proper names (people, projects, songs, artists, institutions, certificates and
//   course/discipline titles) live in src/data and are NOT translated.

const en = {
    meta: {
        descricao: 'Portfolio of Arthur Moraes, a Software Engineering student.',
        tituloInicio: '{{nome}} · Portfolio',
        tituloPagina: '{{pagina}} · {{nome}}',
    },

    idioma: {
        grupo: 'Language',
        pt: 'PT – Português',
        en: 'EN – English',
        trocarParaPt: 'Switch to Portuguese',
        trocarParaEn: 'Switch to English',
    },

    comum: {
        faixa: 'Track {{numero}}',
        abreEmNovaAba: 'opens in a new tab',
        abreEmNovaAbaTitulo: '({{titulo}}, opens in a new tab)',
        abreEmNovaAbaParenteses: '(opens in a new tab)',
        tentarNovamente: 'Try again',
        intervalo: '{{de}} to {{ate}}',
        diasSemanaCurto: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },

    app: {
        pularConteudo: 'Skip to content',
    },

    intro: {
        abrindo: "Opening {{nome}}'s portfolio",
    },

    rodape: {
        texto: '© {{ano}} {{nome}}. Made with React and lots of music.',
    },

    rotas: {
        inicio: { titulo: 'Home' },
        sobre: { titulo: 'About me', descricao: 'Background, education and goals' },
        projetos: { titulo: 'Projects', descricao: "A timeline of what I've built" },
        certificados: { titulo: 'Certificates', descricao: 'Courses and training' },
        musicas: { titulo: 'Music', descricao: 'My favorites, with play' },
        canvas: {
            titulo: 'Canvas',
            descricao: 'The place where my grades and school statistics live',
        },
        GitHub: { titulo: 'GitHub', descricao: 'My contributions on GitHub' },
        contato: { titulo: 'Contact', descricao: 'Social media and message' },
    },

    menu: {
        voltarInicio: 'Back to home',
        inicio: 'Home',
        faixas: 'Tracks',
        paginasPortfolio: 'Portfolio pages',
    },

    faixaNav: {
        rotulo: 'Previous and next track',
        anterior: '← Previous track',
        colecao: '← Collection',
        inicio: 'Home',
        proxima: 'Next track →',
        fimAlbum: 'End of the album →',
        voltarColecao: 'Back to the collection',
    },

    inicio: {
        escolhaFaixa: 'Pick a track',
        dica: 'Each cover leads to a page.',
    },

    perfil: {
        cargo: 'Software Engineering student',
        fotoAlt: 'Pixel art illustration',
        lema: 'Every project, a new track.',
        sobre: [
            "I'm Arthur Moraes Braga Araujo, I'm 18 years old and I'm in the 2nd term of the Software Engineering program at the Pontifícia Universidade Católica de Minas Gerais (Puc Minas). I've been interested in the field since I was 14, when I took part in a FLL robotics project at SESI ALVIMAR CARNEIRO DE REZENDE. On that occasion I was on the robotics team Harry Blocks and had my first contact with programming. I became interested in the field and have wanted to become a technology professional ever since. In addition, in 2023 I took a vocational course in Industrial Machinery Maintenance at SENAI, where I learned to work with industrial machines, learned to work in a group and also got deeper into technical research.",
            "Music is also part of my personal interests, and I wanted to bring that side into my portfolio. The vinyl record idea combines my taste in music with what I'm learning about web development, creating a space that presents both my projects and a bit of my personality. Building this portfolio in React is an opportunity to explore new tools and turn a creative idea into an interactive experience.",
        ],
        formacao: {
            senai: {
                curso: 'Industrial machinery maintenance',
                periodo: '2023 — 2024',
            },
            puc: {
                curso: 'Software Engineering',
                periodo: '2026 — present',
            },
        },
        objetivos:
            'My goal is to become a qualified cybersecurity professional, the area of technology that has sparked my interest the most. I want to deepen my knowledge of system protection, vulnerability analysis and the implementation of robust security solutions. At the same time, I have developed a strong affinity for the back end of web applications, especially using Java and Spring Boot, implementing scalable architectures and integrating systems with databases. My aim is to combine these two skill sets to build applications that are not only functional and efficient, but also secure by design, applying good secure development practices and contributing to a digital environment that is better protected against cyber threats.',
    },

    experiencias: {
        'exp-1': {
            cargo: 'FLL, robotics and programming',
            periodo: 'January/2022 - June/2023',
            atividades: [
                'I was the main programmer of my team, together with my teammate Rafael, responsible for programming the robot to carry out the FIRST LEGO League missions.',
            ],
            aprendizados:
                'I developed programming skills, logical reasoning and problem-solving, and also learned to work as a team to overcome the challenges of the missions.',
        },
        'exp-2': {
            cargo: 'Machinery maintenance',
            periodo: 'January/2023-December/2023',
            atividades: [
                'I carried out activities related to the maintenance of industrial machinery, putting into practice the knowledge I gained at SENAI.',
            ],
            aprendizados:
                'I expanded my technical knowledge of industrial maintenance and developed responsibility, organization and collaboration in a professional environment.',
        },
    },

    interesses: {
        ciberseguranca: {
            titulo: 'Cybersecurity',
            descricao:
                'It is the area of technology that has sparked my interest the most. I want to understand how to identify vulnerabilities and protect systems and information, building the knowledge I need to become a good cybersecurity professional.',
        },
        backend: {
            titulo: 'Backend Development',
            descricao:
                'I like understanding what happens behind the pages and how systems process information. I am interested in developing APIs, working with databases and building the logic that makes an application work.',
        },
        motociclismo: {
            titulo: 'Motorcycles and technology',
            descricao:
                'I also like motorcycles and I am curious about the technology in them. I see an opportunity to connect this interest with programming, exploring ideas for applications to keep track of maintenance and organize information about a motorcycle.',
        },
    },

    sobre: {
        titulo: 'About me',
        baixarCurriculo: 'Download résumé',
        curriculoTitulo: "{{nome}}'s résumé (PDF)",
        verCurriculo: 'View résumé',
        fecharCurriculo: 'Close',
        curriculoIndisponivel: "The résumé isn't available yet. Please check back soon.",
        curriculoArquivo: 'Resume-Arthur-Moraes.pdf',
        trajetoria: 'Background',
        formacao: 'Education',
        experiencias: 'Experience',
        experienciasNota: "My journey so far, with what I did and what I learned.",
        aprendizado: 'What I learned:',
        interesses: 'Areas of interest',
        interessesNota: 'What I want to explore and why it appeals to me.',
        objetivos: 'Professional goals',
    },

    projetos: {
        titulo: 'Projects',
        intro: 'List of projects developed throughout my journey.',
        capaAria: 'Cover of the project {{titulo}}',
        contribuicao: 'My contribution',
        tecnologias: 'Technologies',
        verGithub: 'View on GitHub',
        verDemo: 'View demo',
        detalhes: {
            ver: 'View details',
            verDe: 'of the project {{titulo}}',
            fechar: 'Close',
            demonstracaoAlt: 'Recording showing how {{titulo}} works',
            descricao: 'Description',
            problema: 'Problem',
            objetivo: 'Goal',
            links: 'Links',
            semLinks: 'No links available yet.',
            semDemo: 'The online demo is not available yet.',
            emConstrucao: 'This project is still under construction. The information below describes the proposal and may change until the final version.',
        },
        status: {
            concluido: 'Completed',
            em_desenvolvimento: 'In development',
        },
        tipo: {
            grupo: 'Group project',
        },
        reconhecimentos: {
            'wms-2026-1': 'Winner of We Make Software in the first term of the first semester of 2026.',
        },
        itens: {
            'estagi-on': {
                descricao:
                    'Estagi.ON is a web platform built to centralize and streamline internship recruiting, connecting university students and companies. The solution offers standardized academic profiles and a smart search system with filters by program, term and skills.',
                detalheDescricao:
                    'Estagi.ON is a web platform that connects university students and companies in internship recruiting. Students have standardized academic profiles, and the job search offers filters by program, term and skills. The job listing lets users search, filter, sort alphabetically, favorite opportunities and spot the newest ones.',
                problema:
                    'Internship recruiting needed to be centralized and faster, bringing students and companies closer together and making it easier to find opportunities that match each student’s program, term and skills.',
                objetivo:
                    'To centralize and streamline internship recruiting, connecting university students and companies through standardized academic profiles and a search with filters.',
                contribuicao:
                    'I built the job listing interface, with search, filters and alphabetical sorting. I implemented the favorites feature and the highlighting of new opportunities, and also contributed to the interactive prototyping and the project documentation.',
            },
            'meu-bolso': {
                descricao:
                    'MeuBolso is a web application built to help young people organize their personal finances. The platform lets users track expenses, manage wallets and set financial goals, encouraging more conscious decisions and a more secure financial future.',
                detalheDescricao:
                    'MeuBolso is a web application designed to help young people organize their personal finances. The idea is for the platform to let users track expenses, manage wallets and set financial goals.',
                problema:
                    'The difficulty behind the project is how young people organize their personal finances: they need a way to keep track of their spending and plan their goals.',
                objetivo:
                    'To help young people organize their finances, encouraging more conscious decisions and a more secure financial future.',
                contribuicao: "In charge of the application's front end.",
            },
        },
    },

    certificados: {
        titulo: 'Certificates',
        intro: 'Courses and experiences that complement my education.',
        abrirCertificado: 'Open certificate: {{nome}}',
        previa: 'Preview of the certificate: {{nome}}',
        abrirPdf: 'Open PDF',
    },

    musicas: {
        titulo: 'Music',
        faixaDeTotal: 'Track {{n}} of {{total}}',
        playlist: 'Playlist',
        minhaPlaylist: 'My playlist',
        montando: 'My music selection is being put together. Come back soon.',
        listaFaixas: 'Track list',
        selecionar: 'Select {{titulo}}, by {{artista}}',
        selecionarPlaylist: 'Select the playlist {{titulo}}',
        tituloPlaylists: 'My playlists',
        comentarios: {
            'musica-1': 'A song that inspires me to keep pursuing my goals, even in the face of difficulties.',
            'musica-2': 'I used to listen to this song as a child with my father; it means a lot to me.',
            'musica-3': 'My favorite song by my favorite artist.',
            'musica-4': 'The message of freedom and the laid-back energy the song brings.'
        },
        comentarioPlaylist: 'Best songs',
    },

    spotify: {
        abrir: 'Open in Spotify',
        playerRotulo: 'Spotify player',
        playerTitulo: 'Spotify player: {{titulo}}',
        carregando: 'Loading the Spotify player…',
        indisponivel:
            "The record doesn't follow the music because the Spotify control didn't load (an ad blocker may have prevented it). The player still works.",
        tocando: 'Now playing',
        apertePlay: 'Press play in the player to listen.',
        semPlayer: "This track doesn't have a player yet.",
    },

    contato: {
        titulo: 'Contact',
        intro: "Let's talk? Send me a message or find me on social media.",
        redes: 'Social media',
        enviarMensagemTitulo: 'Send a message',
        nome: 'Name',
        email: 'Email',
        mensagem: 'Message',
        enviando: 'Sending...',
        enviar: 'Send message',
        sucesso: 'Message sent. Thank you for reaching out!',
        erro: "Couldn't send the message. Try again or use the email on this page.",
        redeAria: '{{nome}} (opens in a new tab)',
    },

    canvas: {
        titulo: 'Canvas',
        textos: {
            subtitulo: 'My classes, assignments and grades on the PUC Minas Canvas.',
            avisoSga:
                'The grades on this page come from Canvas and may be partial or provisional. The official academic record is the one in SGA, which prevails in case of any difference.',
            semDados: "Canvas data isn't available yet.",
            semTurmas: 'No classes found for the selected filter.',
            semAtividades: 'No assignments found for the selected filter.',
            semNotas: 'No grades published for this class as of the last update.',
            semNotasNota:
                "An assignment without a published grade doesn't mean a zero: the grade just isn't available yet.",
            atividadesIndisponiveis: "This class's assignments weren't available as of the last update.",
        },
        abas: {
            rotulo: 'Canvas sections',
            turmas: 'Classes',
            atividades: 'Assignments',
            notas: 'Grades',
        },
        situacoes: {
            pendente: 'Pending',
            prazo_encerrado: 'Deadline passed without submission',
            entregue: 'Submitted',
            avaliada: 'Graded',
            dispensada: 'Excused',
            sem_envio_online: 'No online submission',
        },
        atualizacao: 'Last updated:',
        horarioBrasilia: '(Brasília time)',
        dataHora: '{{data}} at {{hora}}',
        prazo: {
            semPrazo: 'No due date',
            hoje: 'today',
            amanha: 'tomorrow',
            ontem: 'yesterday',
            emDias: 'in {{n}} days',
            haDias: '{{n}} days ago',
        },
        nota: {
            naoPublicada: 'Not published',
            publicada: 'Published',
        },
        periodoNaoInformado: 'Term not provided',
        semestre: {
            rotulo: 'Semester',
            nome: 'Semester {{n}}',
            materias_one: '{{n}} course',
            materias_other: '{{n}} courses',
        },
        turma: 'Class {{id}}',
        estatisticas: {
            atividades: 'Assignments',
            pendentes: 'Pending',
            entregues: 'Submitted',
            avaliadas: 'Graded',
        },
        prazoEncerradoSemEntrega: 'with the deadline passed without submission',
        proximoPrazo: 'Next deadline:',
        nenhumPendente: 'none pending',
        turmasReunidas: '{{n}} classes combined (theory and lab)',
        verAtividades: 'View assignments',
        verAtividadesDe: 'for {{nome}}',
        materiaAtividades: "Assignments from all of this course's classes in the selected semester.",
        notaAcumulada: 'Accumulated grade from assignments',
        semNotaPublicada: 'No grade published',
        pontosTotal: '{{obtidos}} / {{maximo}} points',
        pontos_one: '{{valor}} point',
        pontos_other: '{{valor}} points',
        atividadeSemTitulo: 'Untitled assignment',
        entregueEm: 'Submitted on {{quando}}',
        vale_one: 'Worth {{valor}} point',
        vale_other: 'Worth {{valor}} points',
        notaPontos_one: 'Grade: {{valor}} point',
        notaPontos_other: 'Grade: {{valor}} points',
        calendario: {
            atividadesNoMes_one: '{{n}} assignment this month · Brasília time',
            atividadesNoMes_other: '{{n}} assignments this month · Brasília time',
            mesAnterior: 'Previous month',
            proximoMes: 'Next month',
            hoje: 'Today',
            calendarioDe: 'Calendar for {{mes}}',
            diaAria_one: '{{data}}, {{n}} assignment',
            diaAria_other: '{{data}}, {{n}} assignments',
            atividadesDoDia: 'Assignments for the selected day',
            noDiaSelecionado_one: '{{n}} assignment on the selected day.',
            noDiaSelecionado_other: '{{n}} assignments on the selected day.',
            nenhumaNoDia: 'No assignments due on this day.',
            semPrazo: 'No due date ({{n}})',
        },
    },

    wakatime: {
        erro: "Couldn't load the WakaTime statistics.",
        carregando: 'Loading WakaTime data…',
        rotulo: 'WakaTime statistics',
        resumo: 'My coding time as recorded by WakaTime.',
        outras: 'Other',
        linguagensTitulo: 'Languages in my routine',
        linguagensNota: "Distribution of the time recorded in WakaTime's language sharing.",
        editores: 'Editors used',
        periodo: 'Period: {{de}} to {{ate}}.',
                agora: {
            rotulo: 'WakaTime coding status',
            codando: 'Coding now',
            parado: 'Idle now',
            ultimoSinal: 'last signal {{quando}}',
            ultimaAtividade: 'Last activity {{quando}} in',
            projetoPrivado: 'private project',
            nenhumaHoje: 'No editor activity today',
            tempoHoje: '{{tempo}} today',
            sessao: '{{tempo}} session (since {{hora}})',
            tempoProjetoHoje: '{{tempo}} today in this project',
            recente: 'just now',
            minutos_one: '{{n}} min ago',
            minutos_other: '{{n}} min ago',
            horas_one: '{{n}} hour ago',
            horas_other: '{{n}} hours ago',
            dias_one: '{{n}} day ago',
            dias_other: '{{n}} days ago',
        },
        cards: {
            tempo: {
                faixa: '01 · Time recorded',
                titulo: 'Coding hours',
                nota: 'Activity time recorded in the editor.',
            },
            rotina: {
                faixa: '02 · Routine',
                titulo: 'Daily average',
                nota: 'Average calculated by WakaTime.',
            },
            melhorDia: {
                faixa: '03 · Peak activity',
                titulo: 'Day with the most time',
            },
            historico: {
                faixa: '04 · History',
                titulo: 'Period tracked',
                dias_one: '{{n}} day',
                dias_other: '{{n}} days',
                nota: 'Includes days without activity.',
            },
        },
    },

    github: {
        faixaTitulo: 'GitHub',
        secoes: {
            rotulo: 'Statistics sections',
            resumo: { rotulo: 'Summary', descricao: 'Profile and overall numbers' },
            linguagens: {
                rotulo: 'Languages',
                descricao: 'Most used languages and WakaTime statistics',
            },
            atividade: { rotulo: 'Activity', descricao: 'Contributions over time' },
            horarios: { rotulo: 'Hours', descricao: 'When commits happen' },
            repositorios: { rotulo: 'Repositories', descricao: 'Public repositories' },
        },
        textos: {
            intro: 'Statistics built live from public GitHub data. Each section explains the period and the repositories analyzed.',
            carregando: 'Loading GitHub data…',
            erro: "Couldn't load this data right now. Check your connection and try again.",
            limite: "GitHub's request limit was reached for this browser. The data will load again after the reset time.",
            vazio: "There isn't enough public data for this chart yet.",
            tentarDeNovo: 'Try again',
            indisponivel: 'Unavailable right now',
            diferencaContribuicoes:
                "Contributions and commits are not the same thing. Contributions (the profile calendar) add up commits, pull requests, issues and code reviews. The commits counted on this page, on the other hand, are only the public ones, on the main branch, linked to your user.",
        },
        dias: {
            0: { curto: 'Sun', longo: 'Sunday' },
            1: { curto: 'Mon', longo: 'Monday' },
            2: { curto: 'Tue', longo: 'Tuesday' },
            3: { curto: 'Wed', longo: 'Wednesday' },
            4: { curto: 'Thu', longo: 'Thursday' },
            5: { curto: 'Fri', longo: 'Friday' },
            6: { curto: 'Sat', longo: 'Saturday' },
        },
        periodos: {
            madrugada: 'Early morning',
            manha: 'Morning',
            tarde: 'Afternoon',
            noite: 'Evening',
        },
        metodologia: {
            titulo: 'How this data is obtained and what its limits are',
            itens: {
                perfil: {
                    titulo: 'Profile, stars, forks and languages',
                    texto: "They come from GitHub's public API (user and repository list). Only your own public repositories are included; forks of other projects are left out. Each repository's language is the main one detected by GitHub: the chart counts repositories, not lines of code.",
                },
                commits: {
                    titulo: 'Commits by day of the week and time',
                    texto: 'The analysis looks at public commits from the creation of the account until today. Times are converted to America/Sao_Paulo.',
                },
                ausencias: {
                    titulo: "What doesn't show up",
                    texto: "Private repositories, commits outside the main branch, commits with an email not linked to the account, and visits to the profile or repositories, which the GitHub API doesn't provide. Without a token, GitHub allows 60 calls per hour and 10 searches per minute per connection; that's why results are kept for 30 minutes in this browser.",
                },
            },
        },
        estado: {
            liberacao: 'Expected reset: {{hora}} (Brasília time).',
        },
        aviso: {
            falhas: "Some data didn't load: {{lista}}.",
            limite: 'The request limit resets around {{hora}}.',
            fontes: {
                perfil: 'profile',
                contribuicoes: 'contributions',
                commits: 'commits',
                contagens: 'pull requests and issues',
            },
        },
        perfil: {
            desde: 'On GitHub since {{ano}}',
        },
        indicadores: {
            repos: {
                rotulo: 'Public repositories',
                notaSemForks: 'own, no forks',
                notaForks_one: 'own; {{n}} fork ignored',
                notaForks_other: 'own; {{n}} forks ignored',
            },
            estrelas: { rotulo: 'Stars', nota: 'received on your repositories' },
            forks: { rotulo: 'Forks received', nota: 'copies of your repositories' },
            seguidores: { rotulo: 'Followers', nota: 'following {{n}}' },
            contribuicoes: { rotulo: 'Contributions' },
            commits: { rotulo: 'Public commits' },
            pullRequests: { rotulo: 'Pull requests', nota: 'public, all time' },
            issues: { rotulo: 'Issues', nota: 'public, all time' },
            diasAtivos: { rotulo: 'Days with contributions' },
            maiorSequencia: { rotulo: 'Longest streak', semSequencia: 'no streak' },
        },
        unidades: {
            dia_one: '{{n}} day',
            dia_other: '{{n}} days',
            contribuicao_one: '{{n}} contribution',
            contribuicao_other: '{{n}} contributions',
            commit_one: '{{n}} commit',
            commit_other: '{{n}} commits',
            commitPublico_one: '{{n}} public commit',
            commitPublico_other: '{{n}} public commits',
            repositorio_one: '{{n}} repository',
            repositorio_other: '{{n}} repositories',
            repositorioPublico_one: '{{n}} public repository',
            repositorioPublico_other: '{{n}} public repositories',
            repositorioPublicoProprio_one: '{{n}} own public repository',
            repositorioPublicoProprio_other: '{{n}} own public repositories',
        },
        linguagens: {
            nenhuma: 'No public repository has a language detected by GitHub.',
            resumo: 'Main language of <strong>{{total}}</strong>. The chart counts repositories, not lines of code.',
            resumoComExcecao_one:
                'Main language of <strong>{{total}}</strong> ({{n}} repository was left out because it has no detected language). The chart counts repositories, not lines of code.',
            resumoComExcecao_other:
                'Main language of <strong>{{total}}</strong> ({{n}} repositories were left out because they have no detected language). The chart counts repositories, not lines of code.',
            discoAria: 'Record with {{n}} language slices, detailed in the list next to it.',
            outras: 'Other ({{n}})',
            repos: 'REPOS',
        },
        atividade: {
            vazio: 'There are no public contributions recorded on this profile yet.',
            contribuicaoTotal: 'Total contributions',
            sequenciaAtual: 'current streak',
            maiorSequenciaHistorico: 'longest streak (all time)',
            hoje: 'today',
            semSequencia: 'no streak',
            nenhumaContribuicao: '{{data}}: no contributions',
            contribuicaoNoDia: '{{data}}: {{contribuicoes}}',
            resumoCalendario: '<strong>{{total}}</strong> from {{de}} to {{ate}}. Includes commits, pull requests, issues and reviews.',
            calendarioAria: 'Contribution calendar from {{de}} to {{ate}}, with {{total}}.',
            diaMaisAtivoAria: 'Most active day: {{descricao}}.',
            diaMaisAtivo: 'Most active day: {{descricao}}',
            menos: 'less',
            mais: 'more',
            porAnoTitulo: 'Contributions per year',
            porAnoVazio: 'No contributions found in the profile history.',
            porAnoLegenda: 'Contributions per year',
            porAnoLeitura: '{{ano}} · {{contribuicoes}}',
            porAnoLeituraAtual: '{{ano}} · {{contribuicoes}} (so far)',
            fonte: 'Source: public profile calendar.',
        },
        horarios: {
            nenhumCommit: 'No public commits were found from {{de}} to {{ate}}.',
            resumo:
                'Hour with the most commits: <strong>{{hora}}</strong>, and the period of the day with the most commits is the <strong>{{periodo}}</strong> ({{percentual}}).',
            amostraExata: 'All {{commits}} from {{de}} to {{ate}} were analyzed.',
            amostraParcial:
                "{{analisados}} of the {{commits}} from {{de}} to {{ate}} were analyzed. GitHub's search returns at most 100 commits per page, so in quarters with more commits only the most recent ones are included. Each analyzed commit stands in for the rest of its quarter, and numbers marked with ≈ are estimates, not exact counts.",
            incompleto: 'GitHub warned that part of the results of this search came back incomplete.',
            fuso: 'Times are in the America/Sao_Paulo time zone.',
            porHorarioTitulo: 'Commits by time of day',
            porHorarioLegenda: 'Distribution of commits by time of day, in percent',
            porDiaTitulo: 'Commits by day of the week',
            commitsPercentual: 'commits, {{percentual}}',
            porPeriodoTitulo: 'Commits by period',
            reposAnalisados: 'Repositories with analyzed commits ({{n}})',
            reposNota: 'The per-repository count only considers the commits analyzed in the sample.',
        },
        repositorios: {
            vazio: 'No own public repositories found.',
            ordem: ', ordered by stars and, on ties, most recent first.',
            forksFora_one: '{{n}} fork of another project was left out.',
            forksFora_other: '{{n}} forks of other projects were left out.',
            truncado: 'Only the {{n}} most recent were read.',
            estrelas: 'stars',
            forks: 'forks',
            arquivado: 'archived',
            atualizadoEm: 'Updated on {{data}}',
            mostrarMenos: 'Show less',
            mostrarTodos: 'Show all ({{n}})',
        },
    },
}

export default en
