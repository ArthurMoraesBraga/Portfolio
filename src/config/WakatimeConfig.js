const WAKATIME_CONFIG = {
    CODING_NOW: {
        API_PATH: '/api/codando',
        TIMEZONE: 'America/Sao_Paulo',

        // Último heartbeat há até tantos minutos = "codando agora".
        ACTIVE_MINUTES: 10,

        // Pausa maior que isso encerra a sessão exibida no cartão.
        BREAK_MINUTES: 15,
        REFRESH_SECONDS: 60,

        // Só estes projetos aparecem pelo nome. Outros viram "projeto privado".
        // Dá para somar nomes pela variável WAKATIME_PUBLIC_PROJECTS.
        PUBLIC_PROJECTS: ['Portfolio'],
        SHOW_PRIVATE: true,
    },
}

export default WAKATIME_CONFIG
