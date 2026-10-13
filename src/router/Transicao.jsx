import { useTranslation } from 'react-i18next'
import './Transicao.css'

// Cortina curta que se abre a partir do ponto clicado, com o nome da faixa de destino.
function Transicao({ fase, origem, rota }) {
    const { t } = useTranslation()
    return (
    <div
        className={`transicao transicao--${fase}`}
        style={{
        '--x': `${origem.x}%`,
        '--y': `${origem.y}%`,
        '--cor-transicao': rota?.fundo ?? 'var(--creme)', }}
        aria-hidden="true"
    >
        <div className="transicao-disco">
        <div className="transicao-rotulo">
            {rota?.faixa && <span className="transicao-faixa">{rota.faixa}</span>}
            <span className="transicao-titulo">{rota ? t(`rotas.${rota.id}.titulo`) : ''}</span>
        </div>
        </div>
    </div>
    )
}

export default Transicao
