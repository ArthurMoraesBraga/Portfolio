    import { CANVAS_CONFIG } from '../config/CanvasConfig.js';

    const { locale, fusoHorario } = CANVAS_CONFIG;

    const fmtData = new Intl.DateTimeFormat(locale, {
    timeZone: fusoHorario, day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const fmtHora = new Intl.DateTimeFormat(locale, {
    timeZone: fusoHorario, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    });
    const fmtDiaCivil = new Intl.DateTimeFormat('en-CA', {
    timeZone: fusoHorario, year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const fmtNumero = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

    const DIA_MS = 86_400_000;

    function diaCivil(ms) {
    const [ano, mes, dia] = fmtDiaCivil.format(ms).split('-').map(Number);
    return Date.UTC(ano, mes - 1, dia) / DIA_MS;
    }

    export function formatarNumero(valor) {
    return typeof valor === 'number' && Number.isFinite(valor) ? fmtNumero.format(valor) : null;
    }

    export function formatarDataHora(iso) {
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return null;
    return `${fmtData.format(ms)} às ${fmtHora.format(ms)}`;
    }

    export function diasDesde(iso, agora) {
    const ms = Date.parse(iso);
    return Number.isNaN(ms) ? null : Math.floor((agora - ms) / DIA_MS);
    }

    export function descreverPrazo(iso, agora) {
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return null;
    const dif = diaCivil(ms) - diaCivil(agora);
    let relativo;
    if (dif === 0) relativo = 'hoje';
    else if (dif === 1) relativo = 'amanhã';
    else if (dif === -1) relativo = 'ontem';
    else if (dif > 1) relativo = `em ${dif} dias`;
    else relativo = `há ${Math.abs(dif)} dias`;
    return { texto: formatarDataHora(iso), relativo };
    }

    /** Nota indisponível nunca vira zero: sem nota publicada, devolve texto explícito. */
    export function formatarNota(nota, pontosPossiveis) {
    if (!nota?.publicada) return { publicada: false, texto: 'Não publicada' };
    const pontos = formatarNumero(nota.pontos);
    if (pontos !== null) {
        const total = formatarNumero(pontosPossiveis);
        return { publicada: true, texto: total !== null ? `${pontos} / ${total}` : pontos };
    }
    return { publicada: true, texto: nota.conceito ?? 'Publicada' };
    }

    export function formatarPontuacaoCanvas(notaCanvas) {
    const pontuacao = formatarNumero(notaCanvas?.pontuacao);
    const conceito = notaCanvas?.conceito ?? null;
    if (pontuacao !== null) return conceito ? `${pontuacao}% (${conceito})` : `${pontuacao}%`;
    return conceito;
    }

    /** Valida e normaliza o JSON para a página nunca quebrar com dados incompletos. */
    export function validarDados(bruto) {
    const vazio = { valido: false, atualizadoEm: null, turmas: [], atividades: [] };
    if (!bruto || typeof bruto !== 'object' || bruto.versao !== CANVAS_CONFIG.versaoEsperada) return vazio;
    if (Number.isNaN(Date.parse(bruto.atualizadoEm))) return vazio;

    const turmas = (Array.isArray(bruto.turmas) ? bruto.turmas : []).filter((t) => t && t.id);
    const ids = new Set(turmas.map((t) => t.id));
    const atividades = (Array.isArray(bruto.atividades) ? bruto.atividades : [])
        .filter((a) => a && a.id && ids.has(a.turmaId))
        .map((a) => ({
        ...a,
        entrega: a.entrega ?? 'nao_entregue',
        nota: a.nota ?? { publicada: false, pontos: null, conceito: null },
        }));

    return { valido: true, atualizadoEm: bruto.atualizadoEm, turmas, atividades };
    }

    /** O prazo é comparado com a data atual, mas a entrega reflete a última atualização. */
    export function calcularSituacao(atividade, agora) {
    if (atividade.entrega === 'dispensada') return 'dispensada';
    if (atividade.entrega === 'avaliada') return 'avaliada';
    if (atividade.entrega === 'entregue') return 'entregue';
    if (!atividade.entregaOnline) return 'sem_envio_online';
    const prazo = Date.parse(atividade.prazo);
    if (!Number.isNaN(prazo) && prazo < agora) return 'prazo_encerrado';
    return 'pendente';
    }

    export function filtrarPorTurma(lista, turmaId, chaveTurma = 'turmaId') {
    if (turmaId === CANVAS_CONFIG.filtroTodas) return lista;
    return lista.filter((item) => item[chaveTurma] === turmaId);
    }

    /** Abertas e sem prazo primeiro (mais próximas antes); encerradas depois (mais recentes antes). */
    export function ordenarAtividades(lista, agora) {
    const prazoMs = (a) => {
        const ms = Date.parse(a.prazo);
        return Number.isNaN(ms) ? null : ms;
    };
    const abertas = [];
    const encerradas = [];
    for (const a of lista) {
        const ms = prazoMs(a);
        (ms !== null && ms < agora ? encerradas : abertas).push(a);
    }
    abertas.sort((a, b) => (prazoMs(a) ?? Infinity) - (prazoMs(b) ?? Infinity));
    encerradas.sort((a, b) => prazoMs(b) - prazoMs(a));
    return [...abertas, ...encerradas];
    }

    export function resumirTurma(turma, atividades, agora) {
    const resumo = {
        total: 0, pendentes: 0, prazoEncerrado: 0, entregues: 0, avaliadas: 0, proxima: null,
    };
    for (const a of atividades) {
        if (a.turmaId !== turma.id) continue;
        resumo.total += 1;
        const situacao = calcularSituacao(a, agora);
        if (situacao === 'pendente') {
        resumo.pendentes += 1;
        const ms = Date.parse(a.prazo);
        const atual = resumo.proxima ? Date.parse(resumo.proxima.prazo) : Infinity;
        if (!Number.isNaN(ms) && ms < atual) resumo.proxima = a;
        } else if (situacao === 'prazo_encerrado') resumo.prazoEncerrado += 1;
        else if (situacao === 'entregue') resumo.entregues += 1;
        else if (situacao === 'avaliada') resumo.avaliadas += 1;
    }
    return resumo;
    }
    const SEM_PERIODO = 'Período não informado';

    export function rotuloPeriodo(turma) {
    const nome = turma.periodo?.trim();
    return !nome || /^default term$/i.test(nome) ? SEM_PERIODO : nome;
    }

    /** Agrupa turmas por período, do mais recente ao mais antigo. */
    export function agruparPorPeriodo(turmas) {
    const grupos = new Map();
    for (const turma of turmas) {
        const rotulo = rotuloPeriodo(turma);
        if (!grupos.has(rotulo)) grupos.set(rotulo, { rotulo, inicio: null, turmas: [] });
        const grupo = grupos.get(rotulo);
        grupo.turmas.push(turma);
        const ms = Date.parse(turma.periodoInicio);
        if (!Number.isNaN(ms) && (grupo.inicio === null || ms < grupo.inicio)) grupo.inicio = ms;
    }
    return [...grupos.values()].sort((a, b) => {
        if (a.rotulo === SEM_PERIODO) return 1;
        if (b.rotulo === SEM_PERIODO) return -1;
        if (a.inicio !== null && b.inicio !== null && a.inicio !== b.inicio) return b.inicio - a.inicio;
        return b.rotulo.localeCompare(a.rotulo, 'pt-BR', { numeric: true });
    });
    }