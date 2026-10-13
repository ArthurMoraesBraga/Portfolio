import { useTranslation } from 'react-i18next'
import Link from '../router/Link'
import { useRota } from '../router/contexto'
import './Capa.css'

// Capa de vinil que representa uma página. O disco sai da capa ao passar o mouse
// ou ao receber foco do teclado; no toque, o clique navega direto.
function Capa({ rota, indice }) {
    const { t } = useTranslation()
    const { fase, destino } = useRota()
    const escolhida = fase === 'cobrindo' && destino === rota.caminho

    return (
    <Link
        para={rota.caminho}
        className={`capa ${escolhida ? 'capa--escolhida' : ''}`}
        style={{
        '--capa-fundo': rota.fundo,
        '--capa-detalhe': rota.detalhe,
        '--atraso': `${indice * 70}ms`,
        }}
    >
        <span className="capa-disco" aria-hidden="true">
        <span className="capa-giro">
            <span className="capa-rotulo" />
        </span>
        </span>

        <span className="capa-arte papel">
        <span className="capa-aneis" aria-hidden="true" />
        <span className="capa-faixa">{rota.faixa}</span>
        <span className="capa-texto">
            <span className="capa-titulo">{t(`rotas.${rota.id}.titulo`)}</span>
            <span className="capa-descricao">{t(`rotas.${rota.id}.descricao`)}</span>
        </span>
        </span>
    </Link>
    )
}

export default Capa
