import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { CODANDO_PATH, handleCodando } from './api/_codando.js'

function wakatimeApi(env) {
  const middleware = (req, res, next) => {
    const caminho = new URL(req.url, 'http://localhost').pathname
    if (caminho !== CODANDO_PATH) return next()

    Promise.resolve(handleCodando(req, res, env)).catch(next)
  }

  return {
    name: 'wakatime-api',
    configureServer(servidor) {
      servidor.middlewares.use(middleware)
    },
    configurePreviewServer(servidor) {
      servidor.middlewares.use(middleware)
    },
  }
}

// Em desenvolvimento, o Vite atende /api/codando. Na Vercel, a função em
// api/codando.js atende a mesma rota. As variáveis sem VITE_ ficam no servidor.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react(), wakatimeApi(env)],
  }
})
