    import {
    FiBookOpen, FiClipboard, FiAward, FiCalendar, FiClock,
    FiCheckCircle, FiAlertCircle, FiMinusCircle, FiFileText, FiArrowRight, FiChevronLeft, FiChevronRight,
    } from 'react-icons/fi'

    const ABAS = ABAS_CONFIG.filter((aba) => ['turmas', 'atividades'].includes(aba.id))

    const ICONES_ABAS = { turmas: FiBookOpen, atividades: FiClipboard, notas: FiAward }
    const ICONES_SITUACOES = {
    pendente: FiClock,
    prazo_encerrado: FiAlertCircle,
    entregue: FiCheckCircle,
    avaliada: FiAward,
    dispensada: FiMinusCircle,
    sem_envio_online: FiFileText,
    }

        import { useId, useMemo, useRef, useState } from 'react'
        import dadosBrutos from '../data/canvasDados.json'
        import {
        ABAS as ABAS_CONFIG,
        CANVAS_CONFIG,
        SITUACOES,
        TEXTOS,
        } from '../config/CanvasConfig.js'
        import {
        calcularSituacao,
        descreverPrazo,
        diasDesde,
        filtrarPorTurma,
        formatarDataHora,
        formatarNumero,
        ordenarAtividades,
        resumirTurma,
        validarDados,
        } from '../utils/canvas.js'
        import './Canvas.css'

        function Situacao({ situacao }) {
        const info = SITUACOES[situacao] ?? SITUACOES.pendente
        const Icone = ICONES_SITUACOES[situacao] ?? FiClock

        return (
            <span className={`canvas-situacao canvas-situacao--${situacao}`}>
            <Icone className="canvas-icone" aria-hidden="true" />
            {' '}
            {info.rotulo}
            </span>
        )
        }

        function Prazo({ prazo, agora }) {
        const info = descreverPrazo(prazo, agora)

        if (!info) return <span>Sem prazo definido</span>

        return (
            <span>
            <time dateTime={prazo} className="canvas-mono">
                {info.texto}
            </time>
            {info.relativo && (
                <span className="canvas-suave"> · {info.relativo}</span>
            )}
            </span>
        )
        }

    // Organização exclusiva da biblioteca de turmas. Início do curso: 2026/1.
    const INICIO_CURSO = { ano: 2026, metade: 1 }

    function nomeDisciplina(turma) {
    return (turma.codigo || turma.nome || '')
        .replace(/^\(\d+\)\s*/, '')
        .split(/\s+-\s+Engenharia de Software/i)[0]
        .trim()
    }

    function chaveDisciplina(turma) {
    return nomeDisciplina(turma).normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/\s+/g, ' ')
    }

    function semestreDaTurma(turma) {
    const nome = chaveDisciplina(turma)
    if (/espaço da coordenação|espaco da coordenacao|^extensao em foco$/.test(nome)) return null
    // O período no nome identifica a oferta; o período genérico vem depois.
    const periodo = turma.nome?.match(/\b(20\d{2})\/([12])\b/)
        ?? turma.periodo?.match(/\b(20\d{2})\/([12])\b/)
    if (!periodo) return null
    const numero = (Number(periodo[1]) - INICIO_CURSO.ano) * 2
        + Number(periodo[2]) - INICIO_CURSO.metade + 1
    return numero >= 1 && numero <= 8 ? numero : null
    }

    function organizarBiblioteca(turmas, atividades) {
    const grupos = new Map()
    const outros = []
    // IDs confirmados no arquivo recebido. Não mistura ofertas de períodos diferentes.
    const preferidas = new Set(['260011', '259984', '290578', '290583', '259998', '294889'])
    const contagens = new Map()
    for (const atividade of atividades) {
        const id = String(atividade.turmaId)
        contagens.set(id, (contagens.get(id) ?? 0) + 1)
    }
    const prioridade = (turma) => [
        preferidas.has(String(turma.id)) ? 1 : 0,
        turma.notaCanvas?.pontuacao != null || turma.notaCanvas?.conceito != null ? 1 : 0,
        contagens.get(String(turma.id)) ?? 0,
    ]
    const melhor = (a, b) => {
        const pa = prioridade(a), pb = prioridade(b)
        for (let i = 0; i < pa.length; i += 1) {
        if (pa[i] !== pb[i]) return pa[i] > pb[i] ? a : b
        }
        return String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }) <= 0 ? a : b
    }
    for (const turma of turmas) {
        const semestre = semestreDaTurma(turma)
        if (semestre == null) {
        outros.push({ ...turma, idsTurmas: [String(turma.id)] })
        continue
        }
        if (!grupos.has(semestre)) grupos.set(semestre, new Map())
        const materias = grupos.get(semestre)
        const chave = chaveDisciplina(turma)
        if (!materias.has(chave)) {
        materias.set(chave, { ...turma, idsTurmas: [String(turma.id)] })
        } else {
        const anterior = materias.get(chave)
        const representante = melhor(anterior, turma)
        materias.set(chave, {
            ...representante,
            idsTurmas: [...anterior.idsTurmas, String(turma.id)],
            atividadesDisponiveis: anterior.atividadesDisponiveis !== false || turma.atividadesDisponiveis !== false,
        })
        }
    }
    const ordenar = (lista) => lista.sort((a, b) => nomeDisciplina(a).localeCompare(nomeDisciplina(b), 'pt-BR'))
    const resultado = [...grupos.entries()].sort(([a], [b]) => a - b).map(([numero, materias]) => ({
        id: String(numero),
        rotulo: `${numero}º semestre`,
        periodo: `${INICIO_CURSO.ano + Math.floor((numero - 1) / 2)}/${(numero - 1) % 2 + 1}`,
        turmas: ordenar([...materias.values()]),
    }))
    // Espaços institucionais não fazem parte da biblioteca de matérias.
    return resultado
    }

    // Soma de pontos publicados; não converte porcentagens nem presume nota final.
    function atividadesDaMateria(materia, atividades) {
    const ids = new Set(materia.idsTurmas)
    return atividades.filter((atividade) => ids.has(String(atividade.turmaId)))
    }

    function pontuacaoDaMateria(materia, atividades) {
    const lista = atividadesDaMateria(materia, atividades)
    const avaliativas = lista.filter((a) => a.avaliativa && a.entrega !== 'dispensada')
    const publicadas = avaliativas.filter((a) => a.nota?.publicada && Number.isFinite(a.nota.pontos))
    const obtidos = publicadas.reduce((total, a) => total + a.nota.pontos, 0)
    const distribuidos = avaliativas.reduce((total, a) => total + (Number.isFinite(a.pontos) ? a.pontos : 0), 0)
    const avaliados = publicadas.reduce((total, a) => total + (Number.isFinite(a.pontos) ? a.pontos : 0), 0)
    // Máximo informado pelo Arthur: as duas turmas de Modular distribuem 84 + 16.
    const maximo = chaveDisciplina(materia) === 'programacao modular' ? 100 : null
    return { obtidos, distribuidos, avaliados, publicadas: publicadas.length, maximo }
    }

    function NotaDaMateria({ materia, atividades }) {
    const nota = pontuacaoDaMateria(materia, atividades)
    return (
        <div className="canvas-nota-unificada">
        <span className="canvas-nota-rotulo canvas-suave"><FiAward className="canvas-icone" aria-hidden="true" /> Nota acumulada nas atividades</span>
        <strong className="canvas-mono">
            {nota.publicadas > 0 ? formatarNumero(nota.obtidos) : 'Sem nota publicada'}
            {nota.publicadas > 0 && (nota.maximo != null ? ` / ${nota.maximo} pontos` : ' pontos')}
        </strong>
        </div>
    )
    }

    const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const FUSO = CANVAS_CONFIG.fusoHorario || 'America/Sao_Paulo'
    const DATA_CIVIL = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit',
    })

    function diaNoFuso(valor) {
    const data = new Date(valor)
    if (!valor || Number.isNaN(data.getTime())) return null
    const partes = Object.fromEntries(DATA_CIVIL.formatToParts(data).map((p) => [p.type, p.value]))
    return `${partes.year}-${partes.month}-${partes.day}`
    }

    function dataCivil(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    }

    function DetalhesAtividades({ atividades, mapaTurmas, agora }) {
    return (
        <ul className="canvas-lista">
        {atividades.map((atividade) => (
            <li key={atividade.id}>
            <article className="papel canvas-cartao canvas-cartao--linha">
                <div>
                <h3>{atividade.nome ?? 'Atividade sem título'}</h3>
                <p className="canvas-suave">{nomeDisciplina(mapaTurmas.get(atividade.turmaId) ?? {})}</p>
                <p><FiClock className="canvas-icone" aria-hidden="true" />{' '}
                    <Prazo prazo={atividade.prazo} agora={agora} />
                </p>
                {atividade.entregueEm && <p className="canvas-suave">Entregue em {formatarDataHora(atividade.entregueEm)}</p>}
                </div>
                <div className="canvas-lateral">
                <Situacao situacao={calcularSituacao(atividade, agora)} />
                {atividade.avaliativa && formatarNumero(atividade.pontos) !== null && (
                    <span className="canvas-suave">Vale {formatarNumero(atividade.pontos)} pontos</span>
                )}
                {atividade.nota?.publicada && Number.isFinite(atividade.nota.pontos) && (
                    <span className="canvas-mono">Nota: {formatarNumero(atividade.nota.pontos)} pontos</span>
                )}
                </div>
            </article>
            </li>
        ))}
        </ul>
    )
    }

    function CalendarioAtividades({ atividades, mapaTurmas, agora }) {
    const hoje = diaNoFuso(agora)
    const [diaSelecionado, setDiaSelecionado] = useState(hoje)
    const [mesVisivel, setMesVisivel] = useState(hoje.slice(0, 7))
    const [ano, mesNumero] = mesVisivel.split('-').map(Number)
    const mes = mesNumero - 1
    const primeiroDia = new Date(Date.UTC(ano, mes, 1)).getUTCDay()
    const quantidade = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate()
    const totalCelulas = Math.ceil((primeiroDia + quantidade) / 7) * 7
    const porDia = new Map()
    const semPrazo = []
    for (const atividade of atividades) {
        const dia = diaNoFuso(atividade.prazo)
        if (!dia) { semPrazo.push(atividade); continue }
        if (!porDia.has(dia)) porDia.set(dia, [])
        porDia.get(dia).push(atividade)
    }
    for (const lista of porDia.values()) lista.sort((a, b) => Date.parse(a.prazo) - Date.parse(b.prazo))
    const atividadesDoDia = porDia.get(diaSelecionado) ?? []
    const tituloMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
        .format(new Date(Date.UTC(ano, mes, 1)))
    const tituloDia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
        .format(new Date(`${diaSelecionado}T12:00:00Z`))
    const totalMes = [...porDia.entries()].filter(([dia]) => dia.startsWith(mesVisivel))
        .reduce((soma, [, lista]) => soma + lista.length, 0)

    function mudarMes(direcao) {
        const data = new Date(Date.UTC(ano, mes + direcao, 1))
        const dia = dataCivil(data.getUTCFullYear(), data.getUTCMonth(), 1)
        setMesVisivel(dia.slice(0, 7))
        setDiaSelecionado(dia)
    }
    function irHoje() { setMesVisivel(hoje.slice(0, 7)); setDiaSelecionado(hoje) }

    return (
        <div className="canvas-calendario">
        <div className="canvas-cal-topo">
            <div>
            <h3><FiCalendar className="canvas-icone" aria-hidden="true" /> {tituloMes}</h3>
            <p className="canvas-suave">{totalMes} atividades neste mês · horários de Brasília</p>
            </div>
            <div className="canvas-cal-navegacao">
            <button type="button" onClick={() => mudarMes(-1)} aria-label="Mês anterior"><FiChevronLeft aria-hidden="true" /></button>
            <button type="button" onClick={irHoje}>Hoje</button>
            <button type="button" onClick={() => mudarMes(1)} aria-label="Próximo mês"><FiChevronRight aria-hidden="true" /></button>
            </div>
        </div>
        <div className="canvas-cal-grade" role="group" aria-label={`Calendário de ${tituloMes}`}>
            {DIAS_SEMANA.map((dia) => <span key={dia} className="canvas-cal-semana">{dia}</span>)}
            {Array.from({ length: totalCelulas }, (_, indice) => {
            const numero = indice - primeiroDia + 1
            if (numero < 1 || numero > quantidade) return <span key={`vazio-${indice}`} className="canvas-cal-vazio" aria-hidden="true" />
            const dia = dataCivil(ano, mes, numero)
            const lista = porDia.get(dia) ?? []
            return (
                <button
                key={dia} type="button"
                className={`canvas-cal-dia${dia === hoje ? ' canvas-cal-dia--hoje' : ''}${dia === diaSelecionado ? ' canvas-cal-dia--selecionado' : ''}`}
                onClick={() => setDiaSelecionado(dia)}
                aria-pressed={dia === diaSelecionado}
                aria-current={dia === hoje ? 'date' : undefined}
                aria-label={`${numero} de ${tituloMes}, ${lista.length} atividades`}
                >
                <span className="canvas-cal-numero">{numero}</span>
                <span className="canvas-cal-previas" aria-hidden="true">
                    {lista.slice(0, 2).map((a) => <span key={a.id} className={`canvas-cal-evento canvas-cal-evento--${calcularSituacao(a, agora)}`}>{a.nome}</span>)}
                    {lista.length > 2 && <span className="canvas-cal-mais">+{lista.length - 2}</span>}
                </span>
                {lista.length > 0 && <span className="canvas-cal-contagem" aria-hidden="true">{lista.length}</span>}
                </button>
            )
            })}
        </div>
        <section className="canvas-cal-detalhes" aria-label="Atividades do dia selecionado">
            <h3 className="subtitulo">{tituloDia}</h3>
            <p className="canvas-suave" role="status">{atividadesDoDia.length} atividades no dia selecionado.</p>
            {atividadesDoDia.length ? <DetalhesAtividades atividades={atividadesDoDia} mapaTurmas={mapaTurmas} agora={agora} />
            : <p className="canvas-vazio">Nenhuma atividade com prazo neste dia.</p>}
        </section>
        {semPrazo.length > 0 && (
            <details className="canvas-cal-sem-prazo">
            <summary>Sem prazo definido ({semPrazo.length})</summary>
            <DetalhesAtividades atividades={semPrazo} mapaTurmas={mapaTurmas} agora={agora} />
            </details>
        )}
        </div>
    )
    }

        export default function Canvas() {
        const dados = useMemo(() => validarDados(dadosBrutos), [])
        const [agora] = useState(() => Date.now())
        const idBase = useId()
        const refsAbas = useRef({})
        const [abaAtiva, setAbaAtiva] = useState(ABAS[0].id)
        const [turmaId, setTurmaId] = useState(CANVAS_CONFIG.filtroTodas)
        const [semestreEscolhido, setSemestreEscolhido] = useState(null)
        const [materiaAberta, setMateriaAberta] = useState(null)

        const turmas = (dados.turmas ?? []).filter((turma) => semestreDaTurma(turma) !== null)
        const idsAcademicos = new Set(turmas.map((turma) => String(turma.id)))
        const atividades = (dados.atividades ?? []).filter((a) => idsAcademicos.has(String(a.turmaId)))

        const biblioteca = organizarBiblioteca(turmas, atividades)
        const semestreAtual = biblioteca.filter((grupo) => grupo.id !== 'outros').at(-1)?.id
        const grupoSelecionado = biblioteca.find((grupo) => grupo.id === semestreEscolhido)
        ?? biblioteca.find((grupo) => grupo.id === semestreAtual)
        ?? biblioteca[0]
        const turmasBiblioteca = grupoSelecionado?.turmas ?? []

        const mapaTurmas = new Map(turmas.map((turma) => [turma.id, turma]))


        const atividadesFiltradas = ordenarAtividades(
            materiaAberta ? atividadesDaMateria(materiaAberta, atividades) : filtrarPorTurma(atividades, turmaId),
            agora,
        )



        const todas = turmaId === CANVAS_CONFIG.filtroTodas

        const nomeTurmaFiltro =
            turmas.find((turma) => String(turma.id) === String(turmaId))?.nome ?? ''

        function irParaAtividades(materia) {
            setMateriaAberta(materia)
            setTurmaId(String(materia.id))
            setAbaAtiva('atividades')
            refsAbas.current.atividades?.focus()
        }

        function aoTeclarAba(evento, indice) {
            const ultimo = ABAS.length - 1
            let destino = null

            if (evento.key === 'ArrowRight') {
            destino = indice === ultimo ? 0 : indice + 1
            } else if (evento.key === 'ArrowLeft') {
            destino = indice === 0 ? ultimo : indice - 1
            } else if (evento.key === 'Home') {
            destino = 0
            } else if (evento.key === 'End') {
            destino = ultimo
            }

            if (destino === null) return

            evento.preventDefault()

            const { id } = ABAS[destino]
            setAbaAtiva(id)
            refsAbas.current[id]?.focus()
        }

        if (!dados.valido) {
            return (
            <main className="pagina container canvas-pagina">
                <header className="pagina-topo canvas-cabecalho">
                <p className="pagina-faixa">06 Canvas</p>
                <h1 className="pagina-titulo">{TEXTOS.titulo}</h1>
                <p className="canvas-vazio" role="status">
                    {TEXTOS.semDados}
                </p>
                </header>
            </main>
            )
        }

        return (
            <main className="pagina container canvas-pagina">
            <header className="pagina-topo canvas-cabecalho">
                <p className="pagina-faixa">06 Canvas</p>
                <h1 className="pagina-titulo canvas-titulo">
                    <img src="/images/logo-canvas.svg" alt="" className="canvas-logo"></img>
                    {TEXTOS.titulo}
                </h1>
                <p className="pagina-intro">{TEXTOS.subtitulo}</p>

                <p className="canvas-atualizacao">
                Última atualização:{' '}
                <time dateTime={dados.atualizadoEm} className="canvas-mono">
                    {formatarDataHora(dados.atualizadoEm)}
                </time>
                {' '}
                <span className="canvas-suave">(horário de Brasília)</span>
                </p>


            </header>



            <div
                className="canvas-abas"
                role="tablist"
                aria-label="Seções do Canvas"
            >
                {ABAS.map((aba, indice) => {
                const ativa = aba.id === abaAtiva
                const IconeAba = ICONES_ABAS[aba.id] ?? FiBookOpen

                return (
                    <button
                    key={aba.id}
                    ref={(elemento) => {
                        refsAbas.current[aba.id] = elemento
                    }}
                    id={`${idBase}-aba-${aba.id}`}
                    type="button"
                    role="tab"
                    aria-selected={ativa}
                    aria-controls={`${idBase}-painel-${aba.id}`}
                    tabIndex={ativa ? 0 : -1}
                    className={`canvas-aba${ativa ? ' canvas-aba--ativa' : ''}`}
                    onClick={() => setAbaAtiva(aba.id)}
                    onKeyDown={(evento) => aoTeclarAba(evento, indice)}
                    >
                    <IconeAba className="canvas-icone canvas-icone-aba" aria-hidden="true" />
                    <span className="canvas-mono" aria-hidden="true">0{indice + 1}</span>
                    {' '}
                    {aba.rotulo}
                    </button>
                )
                })}
            </div>

            {/* Turmas */}
            <section
                role="tabpanel"
                id={`${idBase}-painel-turmas`}
                aria-labelledby={`${idBase}-aba-turmas`}
                hidden={abaAtiva !== 'turmas'}
                className="canvas-painel"
            >
                <h2 className="visualmente-oculto">Turmas</h2>

                {biblioteca.length > 0 && (
                <div className="canvas-biblioteca-controles">
                    <label htmlFor={`${idBase}-semestre`}><FiCalendar className="canvas-icone" aria-hidden="true" /> Semestre</label>
                    <select
                    id={`${idBase}-semestre`}
                    value={grupoSelecionado.id}
                    onChange={(evento) => setSemestreEscolhido(evento.target.value)}
                    >
                    {biblioteca.map((grupo) => (
                        <option key={grupo.id} value={grupo.id}>
                        {grupo.rotulo}{grupo.periodo ? ` · ${grupo.periodo}` : ''}
                        </option>
                    ))}
                    </select>
                    <p className="canvas-suave" role="status">
                    {turmasBiblioteca.length} {turmasBiblioteca.length === 1 ? 'matéria' : 'matérias '}
                    </p>
                </div>
                )}

                {turmasBiblioteca.length === 0 ? (
                <p className="canvas-vazio">{TEXTOS.semTurmas}</p>
                ) : (
                <ul className="canvas-grade">
                    {turmasBiblioteca.map((turma) => {
                    const daMateria = atividadesDaMateria(turma, atividades)
                    const resumo = resumirTurma(turma, daMateria.map((a) => ({ ...a, turmaId: turma.id })), agora)

                    return (
                        <li key={turma.id}>
                        <article className="papel canvas-cartao">
                            <h3>{nomeDisciplina(turma) || `Turma ${turma.id}`}</h3>

                            <p className="canvas-suave">
                            {[turma.codigo, turma.periodo]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>

                            {turma.atividadesDisponiveis === false ? (
                            <p className="canvas-suave">
                                {TEXTOS.atividadesIndisponiveis}
                            </p>
                            ) : (
                            <>
                                <dl className="canvas-estatisticas">
                                <div>
                                    <dt>Atividades</dt>
                                    <dd className="canvas-mono">{resumo.total}</dd>
                                </div>
                                <div>
                                    <dt>Pendentes</dt>
                                    <dd className="canvas-mono">{resumo.pendentes}</dd>
                                </div>
                                <div>
                                    <dt>Entregues</dt>
                                    <dd className="canvas-mono">{resumo.entregues}</dd>
                                </div>
                                <div>
                                    <dt>Avaliadas</dt>
                                    <dd className="canvas-mono">{resumo.avaliadas}</dd>
                                </div>
                                </dl>

                                {resumo.prazoEncerrado > 0 && (
                                <p className="canvas-suave">
                                    <span className="canvas-mono">
                                    {resumo.prazoEncerrado}
                                    </span>
                                    {' '}com prazo encerrado sem entrega
                                </p>
                                )}

                                <p>
                                <span className="canvas-suave">
                                    Próximo prazo:{' '}
                                </span>
                                {resumo.proxima ? (
                                    <Prazo prazo={resumo.proxima.prazo} agora={agora} />
                                ) : (
                                    'nenhum pendente'
                                )}
                                </p>
                            </>
                            )}

                            <NotaDaMateria materia={turma} atividades={atividades} />
                            {turma.idsTurmas.length > 1 && (
                            <p className="canvas-suave">{turma.idsTurmas.length} turmas reunidas (teoria e laboratório)</p>
                            )}

                            <button
                            type="button"
                            className="botao botao--secundario canvas-botao"
                            onClick={() => irParaAtividades(turma)}
                            >
                            Ver atividades
                            <FiArrowRight className="canvas-icone canvas-icone-seta" aria-hidden="true" />
                            <span className="visualmente-oculto">
                                {' '}de {turma.nome}
                            </span>
                            </button>
                        </article>
                        </li>
                    )
                    })}
                </ul>
                )}
            </section>

            {/* Atividades */}
            <section
                role="tabpanel"
                id={`${idBase}-painel-atividades`}
                aria-labelledby={`${idBase}-aba-atividades`}
                hidden={abaAtiva !== 'atividades'}
                className="canvas-painel"
            >
                <h2 className="visualmente-oculto">Atividades</h2>
            {materiaAberta && (
            <header className="papel canvas-cartao canvas-materia-aberta">
                <h3>{nomeDisciplina(materiaAberta)}</h3>
                <p className="canvas-suave">Atividades de todas as turmas desta matéria no semestre selecionado.</p>
                <NotaDaMateria materia={materiaAberta} atividades={atividades} />
            </header>
            )}

                <CalendarioAtividades
                atividades={atividadesFiltradas}
                mapaTurmas={mapaTurmas}
                agora={agora}
                />
            </section>

            </main>
        )
        }