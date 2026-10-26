// Vercel Function: GET /api/codando

import { handleCodando } from './_codando.js'

export default function handler(req, res) {
    return handleCodando(req, res, process.env)
}
