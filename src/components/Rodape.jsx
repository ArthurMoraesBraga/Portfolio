import { useTranslation } from 'react-i18next'
import { formatadorData } from '../utils/localizacao'
import './Rodape.css'

function Rodape({ nome }) {
    const { t } = useTranslation()
    // O ano segue o fuso America/Sao_Paulo, como os demais horários do site
    const ano = formatadorData({ year: 'numeric' }).format(new Date())

    return (
    <footer className="rodape">
        {t('rodape.texto', { ano, nome })}
    </footer>
    )
}

export default Rodape
