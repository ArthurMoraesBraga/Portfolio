
    /**
     * Atualiza src/data/canvasDados.json com dados do Canvas (visão de aluno).
     * Executado pelo predev. Nunca derruba o `npm run dev`: se algo falhar,
     * o JSON anterior é preservado e o processo termina com código 0.
     * O token só é usado aqui e nunca é gravado nem exibido.
     */
    import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
    import path from 'node:path';
    import { fileURLToPath } from 'node:url';

    const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const ARQUIVO_ENV = path.join(RAIZ, '.env');
    const ARQUIVO_SAIDA = path.join(RAIZ, 'src', 'data', 'canvasDados.json');

    const VERSAO_ESQUEMA = 1;
    const TIMEOUT_MS = 20_000;
    const TENTATIVAS = 3;
    const MAX_PAGINAS = 50;
    const SEM_ENVIO_ONLINE = new Set(['none', 'not_graded', 'on_paper']);

    let segredo = '';

    class ErroCanvas extends Error {
    constructor(mensagem, { status = null } = {}) {
        super(mensagem);
        this.name = 'ErroCanvas';
        this.status = status;
    }
    }

    const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const textoOuNulo = (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);
    const numeroOuNulo = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

    function sanitizar(erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    return segredo ? mensagem.split(segredo).join('[token]') : mensagem;
    }

    /* ---------- Configuração (.env) ---------- */

    async function lerEnv() {
    const valores = {};
    let texto;
    try {
        texto = await readFile(ARQUIVO_ENV, 'utf8');
    } catch (erro) {
        if (erro.code === 'ENOENT') return valores;
        throw new ErroCanvas('Não foi possível ler o arquivo .env.');
    }
    for (const linhaBruta of texto.split(/\r?\n/)) {
        const linha = linhaBruta.trim();
        if (!linha || linha.startsWith('#')) continue;
        const m = linha.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!m) continue;
        let valor = m[2].trim();
        const aspas = valor[0];
        if ((aspas === '"' || aspas === "'") && valor.length >= 2 && valor.endsWith(aspas)) {
        valor = valor.slice(1, -1);
        } else {
        valor = valor.replace(/\s+#.*$/, '');
        }
        valores[m[1]] = valor;
    }
    return valores;
    }

    function lerConfiguracao(env) {
    const pegar = (chave) => String(process.env[chave] ?? env[chave] ?? '').trim();
    const urlBruta = pegar('CANVAS_URL');
    const token = pegar('CANVAS_TOKEN');
    if (!urlBruta || !token) {
        throw new ErroCanvas('CANVAS_URL e CANVAS_TOKEN precisam estar definidos no .env.');
    }
    segredo = token;

    let origem;
    try {
        const url = new URL(urlBruta.includes('://') ? urlBruta : `https://${urlBruta}`);
        if (url.protocol !== 'https:') throw new Error('protocolo');
        origem = url.origin;
    } catch {
        throw new ErroCanvas('CANVAS_URL é inválida. Use o endereço https do seu Canvas.');
    }

    const idsTurmas = [...new Set(pegar('CANVAS_TURMAS').split(/[\s,;]+/).filter(Boolean))];
    if (idsTurmas.some((id) => !/^\d+$/.test(id))) {
        throw new ErroCanvas('CANVAS_TURMAS deve conter apenas IDs numéricos separados por vírgula.');
    }
    const incluirConcluidas = /^(1|true|sim)$/i.test(pegar('CANVAS_INCLUIR_CONCLUIDAS'));
    return { origem, token, idsTurmas, incluirConcluidas };
    }

    /* ---------- Requisições, paginação e erros ---------- */

    async function requisitar(url, ctx) {
    for (let tentativa = 1; ; tentativa += 1) {
        const espera = 1000 * 2 ** (tentativa - 1);
        let resposta;
        try {
        resposta = await fetch(url, {
            headers: { Authorization: `Bearer ${ctx.token}`, Accept: 'application/json' },
            redirect: 'manual', // nunca segue redirecionamentos com o token
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        } catch {
        if (tentativa >= TENTATIVAS) {
            throw new ErroCanvas('Falha de rede ou tempo esgotado ao acessar o Canvas.');
        }
        await esperar(espera);
        continue;
        }

        if (resposta.ok) {
        try {
            return { dados: await resposta.json(), link: resposta.headers.get('link') };
        } catch {
            throw new ErroCanvas('A resposta do Canvas não é um JSON válido.');
        }
        }

        const { status } = resposta;
        if (status === 401) {
        throw new ErroCanvas('O Canvas recusou o token (401). Verifique se ele é válido e não expirou.', { status });
        }
        const corpo = await resposta.text().catch(() => '');
        const limite = status === 429 || (status === 403 && /rate limit/i.test(corpo));
        if ((limite || status >= 500) && tentativa < TENTATIVAS) {
        const retryAfter = Number(resposta.headers.get('retry-after'));
        await esperar(retryAfter > 0 ? Math.min(retryAfter * 1000, 30_000) : espera);
        continue;
        }
        throw new ErroCanvas(`O Canvas respondeu com status ${status}.`, { status });
    }
    }

    function proximaPagina(cabecalhoLink, origem) {
    if (!cabecalhoLink) return null;
    for (const m of cabecalhoLink.matchAll(/<([^>]+)>\s*;\s*rel="([^"]+)"/g)) {
        if (m[2].split(/\s+/).includes('next')) {
        const url = new URL(m[1]);
        if (url.origin !== origem) {
            throw new ErroCanvas('Link de paginação aponta para outro domínio. Atualização interrompida.');
        }
        return url.toString();
        }
    }
    return null;
    }

    async function buscarTodas(caminho, parametros, ctx) {
    const inicial = new URL(`/api/v1${caminho}`, ctx.origem);
    for (const [chave, valor] of parametros) inicial.searchParams.append(chave, valor);

    const itens = [];
    let proxima = inicial.toString();
    for (let pagina = 1; proxima; pagina += 1) {
        if (pagina > MAX_PAGINAS) throw new ErroCanvas('Paginação excedeu o limite de segurança.');
        const { dados, link } = await requisitar(proxima, ctx);
        if (!Array.isArray(dados)) throw new ErroCanvas('Resposta inesperada do Canvas (lista esperada).');
        itens.push(...dados);
        proxima = proximaPagina(link, ctx.origem);
    }
    return itens;
    }

    /* ---------- Mapeamento: apenas campos necessários ---------- */

    function mapearTurma(curso) {
    const matricula = (curso.enrollments ?? []).find(
        (e) => e.type === 'student' || e.role === 'StudentEnrollment',
    );
    return {
        id: String(curso.id),
        nome: textoOuNulo(curso.name),
        codigo: textoOuNulo(curso.course_code),
        periodo: textoOuNulo(curso.term?.name),
        periodoInicio: textoOuNulo(curso.term?.start_at),
        // Pontuação parcial do Canvas (ignora o que ainda não foi avaliado).
        // Não usamos computed_final_score porque ele trata o não avaliado como zero.
        notaCanvas: {
        pontuacao: numeroOuNulo(matricula?.computed_current_score ?? matricula?.grades?.current_score),
        conceito: textoOuNulo(matricula?.computed_current_grade ?? matricula?.grades?.current_grade),
        },
        atividadesDisponiveis: true,
    };
    }

    function classificarEntrega(submissao) {
    if (!submissao) return 'nao_entregue';
    if (submissao.excused) return 'dispensada';
    if (submissao.workflow_state === 'graded') return 'avaliada';
    if (submissao.submitted_at || ['submitted', 'pending_review'].includes(submissao.workflow_state)) {
        return 'entregue';
    }
    return 'nao_entregue';
    }

    function mapearAtividade(a, turmaId) {
    const s = a.submission ?? null;
    const tipos = Array.isArray(a.submission_types) ? a.submission_types : [];
    const entrega = classificarEntrega(s);
    const avaliativa = a.grading_type !== 'not_graded';

    // Nota só é "publicada" quando o Canvas a devolve ao aluno. Ausente = null, nunca 0.
    const pontos = entrega === 'dispensada' ? null : numeroOuNulo(s?.score);
    const conceito =
        entrega === 'dispensada' || a.grading_type === 'points' ? null : textoOuNulo(s?.grade);

    return {
        id: String(a.id),
        turmaId,
        nome: textoOuNulo(a.name),
        prazo: textoOuNulo(a.due_at),
        pontos: numeroOuNulo(a.points_possible),
        avaliativa,
        entregaOnline: tipos.length > 0 && !tipos.every((t) => SEM_ENVIO_ONLINE.has(t)),
        entrega,
        entregueEm: textoOuNulo(s?.submitted_at),
        atrasada: Boolean(s?.late),
        nota: {
        publicada: avaliativa && (pontos !== null || conceito !== null),
        pontos,
        conceito,
        },
    };
    }

    /* ---------- Coleta ---------- */

    async function listarCursos(ctx, estado) {
    const parametros = [
        ['include[]', 'term'],
        ['include[]', 'total_scores'],
        ['enrollment_type', 'student'],
        ['per_page', '100'],
    ];
    if (estado) parametros.push(['enrollment_state', estado]);
    return buscarTodas('/courses', parametros, ctx);
    }

    async function buscarTurmas(ctx) {
    const modoIds = ctx.idsTurmas.length > 0;
    let brutos;
    if (modoIds) {
        // Com IDs explícitos, procura também entre as turmas concluídas.
        brutos = [...(await listarCursos(ctx, null)), ...(await listarCursos(ctx, 'completed'))];
    } else {
        brutos = await listarCursos(ctx, 'active');
        if (ctx.incluirConcluidas) brutos.push(...(await listarCursos(ctx, 'completed')));
    }

    const porId = new Map();
    for (const c of brutos) {
        if (c && c.id && c.name && !c.access_restricted_by_date) porId.set(String(c.id), c);
    }
    const cursos = [...porId.values()];

    if (!modoIds) return cursos;

    const ausentes = ctx.idsTurmas.filter((id) => !porId.has(id));
    if (ausentes.length) {
        throw new ErroCanvas(`Turma(s) de CANVAS_TURMAS não encontrada(s) nas suas matrículas: ${ausentes.join(', ')}.`);
    }
    return cursos.filter((c) => ctx.idsTurmas.includes(String(c.id)));
    }

    async function coletar(ctx) {
    const cursos = await buscarTurmas(ctx);
    const turmas = cursos.map(mapearTurma).sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR'));
    const atividades = [];

    for (const turma of turmas) {
        try {
        const brutas = await buscarTodas(
            `/courses/${turma.id}/assignments`,
            [['include[]', 'submission'], ['order_by', 'due_at'], ['per_page', '100']],
            ctx,
        );
        for (const a of brutas) {
            if (a && a.id && a.published !== false) atividades.push(mapearAtividade(a, turma.id));
        }
        } catch (erro) {
        if (erro instanceof ErroCanvas && (erro.status === 403 || erro.status === 404)) {
            turma.atividadesDisponiveis = false; // sem acesso a esta turma; as demais seguem
            continue;
        }
        throw erro;
        }
    }

    atividades.sort(
        (a, b) =>
        a.turmaId.localeCompare(b.turmaId) ||
        (a.prazo ?? '9999').localeCompare(b.prazo ?? '9999') ||
        a.id.localeCompare(b.id),
    );
    return { turmas, atividades };
    }

    /* ---------- Arquivo de saída ---------- */

    async function lerAnterior() {
    try {
        return JSON.parse(await readFile(ARQUIVO_SAIDA, 'utf8'));
    } catch {
        return null;
    }
    }

    async function gravarAtomicamente(objeto) {
    await mkdir(path.dirname(ARQUIVO_SAIDA), { recursive: true });
    const temporario = `${ARQUIVO_SAIDA}.tmp`;
    await writeFile(temporario, `${JSON.stringify(objeto, null, 2)}\n`, 'utf8');
    await rename(temporario, ARQUIVO_SAIDA);
    }

    async function garantirArquivoInicial() {
    try {
        await readFile(ARQUIVO_SAIDA, 'utf8');
    } catch (erro) {
        if (erro.code !== 'ENOENT') return;
        await gravarAtomicamente({
        versao: VERSAO_ESQUEMA,
        status: 'sem_dados',
        atualizadoEm: null,
        fonte: 'Canvas LMS (API oficial)',
        turmas: [],
        atividades: [],
        });
    }
    }

    async function main() {
    const ctx = lerConfiguracao(await lerEnv());
    const { turmas, atividades } = await coletar(ctx);

    const anterior = await lerAnterior();
    if (turmas.length === 0 && (anterior?.turmas?.length ?? 0) > 0) {
        throw new ErroCanvas(
        'O Canvas não retornou nenhuma turma. Para evitar apagar dados válidos, o JSON anterior foi mantido.',
        );
    }

    await gravarAtomicamente({
        versao: VERSAO_ESQUEMA,
        status: 'ok',
        atualizadoEm: new Date().toISOString(),
        fonte: 'Canvas LMS (API oficial)',
        turmas,
        atividades,
    });
    console.log(`[canvas] Atualizado: ${turmas.length} turma(s), ${atividades.length} atividade(s).`);
    }

    main()
    .catch(async (erro) => {
        console.warn(`[canvas] Atualização não concluída: ${sanitizar(erro)}`);
        console.warn('[canvas] O JSON anterior foi preservado.');
        await garantirArquivoInicial();
    })
    .finally(() => {
        process.exitCode = 0; // nunca bloqueia o npm run dev
    });