    import { useId, useMemo, useRef, useState } from 'react'
    import dadosBrutos from '../data/canvasDados.json'
    import {
    ABAS,
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
    formatarNota,
    formatarNumero,
    formatarPontuacaoCanvas,
    ordenarAtividades,
    resumirTurma,
    validarDados,
    } from '../utils/canvas.js'
    import './Canvas.css'

    function Situacao({ situacao }) {
    const info = SITUACOES[situacao] ?? SITUACOES.pendente

    return (
        <span className={`canvas-situacao canvas-situacao--${situacao}`}>
        <span aria-hidden="true">{info.icone}</span>
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

    export default function Canvas() {
    const dados = useMemo(() => validarDados(dadosBrutos), [])
    const [agora] = useState(() => Date.now())
    const idBase = useId()
    const refsAbas = useRef({})
    const [abaAtiva, setAbaAtiva] = useState(ABAS[0].id)
    const [turmaId, setTurmaId] = useState(CANVAS_CONFIG.filtroTodas)

    const turmas = dados.turmas ?? []
    const atividades = dados.atividades ?? []

    const mapaTurmas = new Map(turmas.map((turma) => [turma.id, turma]))

    const turmasFiltradas = filtrarPorTurma(turmas, turmaId, 'id')

    const atividadesFiltradas = ordenarAtividades(
        filtrarPorTurma(atividades, turmaId),
        agora,
    )

    const diasAtraso = diasDesde(dados.atualizadoEm, agora)
    const desatualizado =
        diasAtraso !== null &&
        diasAtraso > CANVAS_CONFIG.diasParaAvisoDesatualizado

    const todas = turmaId === CANVAS_CONFIG.filtroTodas

    const nomeTurmaFiltro =
        turmas.find((turma) => String(turma.id) === String(turmaId))?.nome ?? ''

    function irParaAtividades(id) {
        setTurmaId(String(id))
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
            <h1 className="pagina-titulo">{TEXTOS.titulo}</h1>
            <p className="pagina-intro">{TEXTOS.subtitulo}</p>

            <p className="canvas-atualizacao">
            Última atualização:{' '}
            <time dateTime={dados.atualizadoEm} className="canvas-mono">
                {formatarDataHora(dados.atualizadoEm)}
            </time>
            {' '}
            <span className="canvas-suave">(horário de Brasília)</span>
            </p>

            <p className="canvas-aviso" role="note">
            {TEXTOS.avisoTempoReal}
            </p>

            {desatualizado && (
            <p className="canvas-aviso canvas-aviso--atencao" role="note">
                {TEXTOS.avisoDesatualizado.replace(
                '{dias}',
                String(CANVAS_CONFIG.diasParaAvisoDesatualizado),
                )}
            </p>
            )}
        </header>

        <div className="canvas-filtro">
            <label htmlFor={`${idBase}-turma`}>Filtrar por turma</label>

            <select
            id={`${idBase}-turma`}
            value={turmaId}
            onChange={(evento) => setTurmaId(evento.target.value)}
            >
            <option value={CANVAS_CONFIG.filtroTodas}>
                Todas as turmas
            </option>

            {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                {turma.nome ?? `Turma ${turma.id}`}
                </option>
            ))}
            </select>

            <p className="visualmente-oculto" role="status">
            {todas
                ? 'Exibindo todas as turmas.'
                : `Exibindo apenas a turma ${nomeTurmaFiltro}.`}
            </p>
        </div>

        <div
            className="canvas-abas"
            role="tablist"
            aria-label="Seções do Canvas"
        >
            {ABAS.map((aba, indice) => {
            const ativa = aba.id === abaAtiva

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
                <span className="canvas-mono" aria-hidden="true">
                    0{indice + 1}
                </span>
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

            {turmasFiltradas.length === 0 ? (
            <p className="canvas-vazio">{TEXTOS.semTurmas}</p>
            ) : (
            <ul className="canvas-grade">
                {turmasFiltradas.map((turma) => {
                const resumo = resumirTurma(turma, atividades, agora)
                const pontuacao = formatarPontuacaoCanvas(turma.notaCanvas)

                return (
                    <li key={turma.id}>
                    <article className="papel canvas-cartao">
                        <h3>{turma.nome ?? `Turma ${turma.id}`}</h3>

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

                        <p>
                        <span className="canvas-suave">
                            Pontuação parcial no Canvas:{' '}
                        </span>
                        <span className="canvas-mono">
                            {pontuacao ?? 'indisponível'}
                        </span>
                        </p>

                        <button
                        type="button"
                        className="botao botao--secundario canvas-botao"
                        onClick={() => irParaAtividades(turma.id)}
                        >
                        Ver atividades
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

            {atividadesFiltradas.length === 0 ? (
            <p className="canvas-vazio">{TEXTOS.semAtividades}</p>
            ) : (
            <ul className="canvas-lista">
                {atividadesFiltradas.map((atividade) => {
                const valor = formatarNumero(atividade.pontos)

                return (
                    <li key={atividade.id}>
                    <article className="papel canvas-cartao canvas-cartao--linha">
                        <div>
                        <h3>{atividade.nome ?? 'Atividade sem título'}</h3>

                        {todas && (
                            <p className="canvas-suave">
                            {mapaTurmas.get(atividade.turmaId)?.nome}
                            </p>
                        )}

                        <p>
                            <span className="canvas-suave">Prazo: </span>
                            <Prazo prazo={atividade.prazo} agora={agora} />
                        </p>

                        {atividade.entregueEm && (
                            <p className="canvas-suave">
                            Entregue em{' '}
                            <time
                                dateTime={atividade.entregueEm}
                                className="canvas-mono"
                            >
                                {formatarDataHora(atividade.entregueEm)}
                            </time>
                            {atividade.atrasada ? ' (com atraso)' : ''}
                            </p>
                        )}
                        </div>

                        <div className="canvas-lateral">
                        <Situacao
                            situacao={calcularSituacao(atividade, agora)}
                        />

                        {valor !== null && atividade.avaliativa && (
                            <span className="canvas-suave">
                            Vale <span className="canvas-mono">{valor}</span> pts
                            </span>
                        )}
                        </div>
                    </article>
                    </li>
                )
                })}
            </ul>
            )}
        </section>

        {/* Notas */}
        <section
            role="tabpanel"
            id={`${idBase}-painel-notas`}
            aria-labelledby={`${idBase}-aba-notas`}
            hidden={abaAtiva !== 'notas'}
            className="canvas-painel"
        >
            <h2 className="visualmente-oculto">Notas</h2>

            <p className="canvas-aviso" role="note">
            {TEXTOS.avisoSga}
            </p>

            {turmasFiltradas.length === 0 ? (
            <p className="canvas-vazio">{TEXTOS.semTurmas}</p>
            ) : (
            turmasFiltradas.map((turma) => {
                const daTurma = atividades.filter(
                (atividade) => atividade.turmaId === turma.id,
                )

                const publicadas = daTurma
                .filter(
                    (atividade) =>
                    atividade.nota?.publicada &&
                    atividade.entrega !== 'dispensada',
                )
                .sort(
                    (a, b) =>
                    (Date.parse(a.prazo) || 0) -
                    (Date.parse(b.prazo) || 0),
                )

                const semNota = daTurma.filter(
                (atividade) =>
                    atividade.avaliativa &&
                    !atividade.nota?.publicada &&
                    atividade.entrega !== 'dispensada',
                ).length

                const pontuacao = formatarPontuacaoCanvas(turma.notaCanvas)
                const idTitulo = `${idBase}-notas-${turma.id}`

                return (
                <section
                    key={turma.id}
                    className="papel canvas-cartao canvas-notas-turma"
                    aria-labelledby={idTitulo}
                >
                    <h3 id={idTitulo}>
                    {turma.nome ?? `Turma ${turma.id}`}
                    </h3>

                    <p>
                    <span className="canvas-suave">
                        Pontuação parcial no Canvas:{' '}
                    </span>
                    <span className="canvas-mono">
                        {pontuacao ?? 'indisponível'}
                    </span>
                    </p>

                    {publicadas.length === 0 ? (
                    <p className="canvas-vazio">{TEXTOS.semNotas}</p>
                    ) : (
                    <div
                        className="canvas-tabela-wrap"
                        role="region"
                        aria-label={`Notas de ${turma.nome}`}
                        tabIndex={0}
                    >
                        <table className="canvas-tabela">
                        <caption className="visualmente-oculto">
                            Notas publicadas em {turma.nome}
                        </caption>

                        <thead>
                            <tr>
                            <th scope="col">Atividade</th>
                            <th scope="col">Prazo</th>
                            <th scope="col">Nota</th>
                            </tr>
                        </thead>

                        <tbody>
                            {publicadas.map((atividade) => (
                            <tr key={atividade.id}>
                                <th scope="row">
                                {atividade.nome ?? 'Atividade sem título'}
                                </th>

                                <td>
                                {atividade.prazo ? (
                                    <time
                                    dateTime={atividade.prazo}
                                    className="canvas-mono"
                                    >
                                    {formatarDataHora(atividade.prazo)}
                                    </time>
                                ) : (
                                    '—'
                                )}
                                </td>

                                <td className="canvas-mono">
                                {formatarNota(
                                    atividade.nota,
                                    atividade.pontos,
                                ).texto}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    )}

                    {semNota > 0 && (
                    <p className="canvas-suave">
                        <span className="canvas-mono">{semNota}</span>
                        {' '}
                        {semNota === 1
                        ? 'atividade ainda sem nota publicada'
                        : 'atividades ainda sem nota publicada'}
                        . {TEXTOS.semNotasNota}
                    </p>
                    )}
                </section>
                )
            })
            )}
        </section>
        </main>
    )
    }