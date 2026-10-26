const WAKATIME_CONFIG = {
    CODING_NOW: {
        API_PATH: '/api/codando',
        TIMEZONE: 'America/Sao_Paulo',

        // Um heartbeat recente indica que o editor continua ativo.
        ACTIVE_MINUTES: 10,

        // Intervalos maiores encerram a sessão exibida no cartão.
        BREAK_MINUTES: 15,
        REFRESH_SECONDS: 60,

        // Só estes projetos aparecem pelo nome. Outros viram “projeto privado”.
        // Acrescente nomes sem alterar o código com WAKATIME_PUBLIC_PROJECTS.
        PUBLIC_PROJECTS: ['Portfolio'],
        SHOW_PRIVATE: true,
    },
}

export default WAKATIME_CONFIG
