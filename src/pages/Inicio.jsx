import { useTranslation } from 'react-i18next'
import Vinil from '../components/Vinil'
import Capa from '../components/Capa'
import { faixas } from '../data/rotas'
import { perfil } from '../data/perfil'
import './Inicio.css'

function Inicio() {
    const { t } = useTranslation()
    return (
    <div className="inicio">
        <section className="inicio-apresentacao">
        <div className="container inicio-conteudo">
            <div className="inicio-texto">
            <h1 className="inicio-nome" tabIndex={-1}>{perfil.nome}</h1>
            <p className="inicio-cargo">{t('perfil.cargo')}</p>
            <p className="inicio-lema">{t('perfil.lema')}</p>
            </div>
            <Vinil iniciais={perfil.iniciais} />
        </div>
        </section>

        <section className="inicio-colecao" aria-labelledby="titulo-colecao">
        <div className="container">
            <h2 id="titulo-colecao" className="inicio-colecao-titulo">{t('inicio.escolhaFaixa')}</h2>
            <p className="inicio-colecao-dica">
            {t('inicio.dica')}
            </p>

            <ul className="inicio-capas">
            {faixas.map((rota, i) => (
                <li key={rota.caminho}>
                <Capa rota={rota} indice={i} />
                </li>
            ))}
            </ul>
        </div>
        </section>
    </div>
    )
}

export default Inicio
