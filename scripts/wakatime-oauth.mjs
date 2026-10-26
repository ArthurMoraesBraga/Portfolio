// Gera tokens OAuth de leitura para o WakaTime.
// Uso: npm run wakatime:oauth

import { randomBytes } from 'node:crypto'
import { execFile } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'

const env = {}

try {
    for (const linha of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
        const resultado = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
        if (resultado) {
            env[resultado[1]] = resultado[2].replace(/^["']|["']$/g, '')
        }
    }
} catch {
    console.error(
        'Não achei o .env.local. Copie .env.example para .env.local e preencha o App ID e o App Secret.',
    )
    process.exit(1)
}

const CLIENT_ID = env.WAKATIME_APP_ID
const CLIENT_SECRET = env.WAKATIME_APP_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
        'Preencha WAKATIME_APP_ID e WAKATIME_APP_SECRET no .env.local.',
    )
    process.exit(1)
}

const PORTA = 8787
const REDIRECT_URI = `http://localhost:${PORTA}/callback`
const SCOPE = 'read_heartbeats'
const state = randomBytes(16).toString('hex')

const enderecoAutorizacao = new URL('https://wakatime.com/oauth/authorize')
enderecoAutorizacao.search = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
}).toString()

function abrirNavegador(endereco) {
    const valor = endereco.toString()
    const configuracao = process.platform === 'win32'
        ? { comando: 'cmd', argumentos: ['/c', 'start', '', valor] }
        : process.platform === 'darwin'
            ? { comando: 'open', argumentos: [valor] }
            : { comando: 'xdg-open', argumentos: [valor] }

    execFile(
        configuracao.comando,
        configuracao.argumentos,
        (erro) => {
            if (erro) {
                console.warn(
                    'Não consegui abrir o navegador automaticamente. Use o endereço exibido no terminal.',
                )
            }
        },
    )
}

const servidor = createServer(async (req, res) => {
    const recebida = new URL(req.url, REDIRECT_URI)

    if (recebida.pathname !== '/callback') {
        res.writeHead(404).end()
        return
    }

    const finalizar = (status, mensagem) => {
        res.writeHead(status, {
            'Content-Type': 'text/plain; charset=utf-8',
        }).end(mensagem)
        servidor.close()
        servidor.closeAllConnections?.()
    }

    if (recebida.searchParams.get('state') !== state) {
        finalizar(400, 'State inválido. Rode o script novamente.')
        return
    }

    const code = recebida.searchParams.get('code')
    if (!code) {
        finalizar(
            400,
            `Autorização negada: ${recebida.searchParams.get('error') ?? 'sem code'}`,
        )
        return
    }

    try {
        const resposta = await fetch('https://wakatime.com/oauth/token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                code,
            }),
            signal: AbortSignal.timeout(10_000),
        })

        const texto = await resposta.text()
        if (!resposta.ok) {
            throw new Error(`WakaTime OAuth respondeu HTTP ${resposta.status}`)
        }

        let dados
        try {
            dados = JSON.parse(texto)
        } catch {
            dados = Object.fromEntries(new URLSearchParams(texto))
        }

        if (!dados.access_token || !dados.refresh_token) {
            throw new Error('A resposta não trouxe os dois tokens esperados.')
        }

        console.log('\nCole no .env.local e nas variáveis da Vercel:\n')
        console.log(`WAKATIME_ACCESS_TOKEN=${dados.access_token}`)
        console.log(`WAKATIME_REFRESH_TOKEN=${dados.refresh_token}`)
        console.log(
            `\nEscopo: ${dados.scope ?? '?'} | expira em: ${dados.expires_at ?? dados.expires_in ?? '?'}\n`,
        )

        finalizar(
            200,
            'Pronto! Os tokens estão no terminal. Pode fechar esta aba.',
        )
    } catch (erro) {
        console.error('Erro ao trocar o code pelo token:', erro.message)
        process.exitCode = 1
        finalizar(500, 'Ocorreu um erro. Consulte o terminal.')
    }
})

servidor.on('error', (erro) => {
    console.error(
        erro.code === 'EADDRINUSE'
            ? `A porta ${PORTA} está em uso. Feche o outro processo e tente novamente.`
            : erro.message,
    )
    process.exit(1)
})

servidor.listen(PORTA, () => {
    console.log(
        `Abrindo a autorização no navegador…\nSe não abrir, acesse:\n${enderecoAutorizacao}\n`,
    )
    abrirNavegador(enderecoAutorizacao)
})
