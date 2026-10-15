import { useTranslation } from 'react-i18next'
import { perfil } from '../data/perfil'
import { experiencias } from '../data/experiencias'
import { interesses } from '../data/interesses'
import CurriculoViewer from '../components/CurriculoViewer'
import { publico } from '../utils/publico'
import { comoLista, idiomaAtual } from '../utils/localizacao'
import { useArquivoDisponivel } from '../utils/useArquivoDisponivel'
import './Sobre.css'

function Sobre() {
    const { t } = useTranslation()
    const paragrafos = comoLista(t('perfil.sobre', { returnObjects: true }))
    const urlCurriculo = publico(perfil.curriculo[idiomaAtual()])
    const situacaoCurriculo = useArquivoDisponivel(urlCurriculo)
    return (
    <article className="pagina container">
        <header className="pagina-topo">
        <p className="pagina-faixa">{t('comum.faixa', { numero: '01' })}</p>
        <h1 className="pagina-titulo" tabIndex={-1}>{t('sobre.titulo')}</h1>
        </header>

        <div className="sobre-grade">
        <aside className="sobre-lateral">
            <figure className="sobre-foto papel">
            <img
                src={perfil.foto}
                alt={t('perfil.fotoAlt')}
                width="1254"
                height="1254"
                decoding="async"
            />
            <figcaption>
                <strong>{perfil.nome}</strong>
                <span>{t('perfil.cargo')}</span>
            </figcaption>
            </figure>

        <CurriculoViewer url={urlCurriculo} situacao={situacaoCurriculo} />
        </aside>

        <div className="sobre-conteudo">
            <section aria-labelledby="sobre-trajetoria">
            <h2 id="sobre-trajetoria" className="subtitulo">{t('sobre.trajetoria')}</h2>
            <div className="sobre-texto">
                {paragrafos.map((p) => <p key={p}>{p}</p>)}
            </div>
            </section>

            <section aria-labelledby="sobre-formacao">
            <h2 id="sobre-formacao" className="subtitulo">{t('sobre.formacao')}</h2>
            <ul className="sobre-formacao">
                {perfil.formacao.map((f) => (
                <li key={f.id} className="papel">
                    <strong>{t(`perfil.formacao.${f.id}.curso`)}</strong>
                    <p>{f.instituicao}</p>
                    <p className="sobre-periodo">{t(`perfil.formacao.${f.id}.periodo`)}</p>
                </li>
                ))}
            </ul>
            </section>

            <section aria-labelledby="sobre-experiencias">
            <h2 id="sobre-experiencias" className="subtitulo">{t('sobre.experiencias')}</h2>
            <p className="sobre-nota">{t('sobre.experienciasNota')}</p>
            <ol className="exp-lista">
                {experiencias.map((e) => (
                <li key={e.id} className="exp-item">
                    <p className="exp-periodo">{t(`experiencias.${e.id}.periodo`)}</p>
                    <div>
                    <h3>{t(`experiencias.${e.id}.cargo`)}</h3>
                    <p className="exp-local">{e.local}</p>
                    <ul>
                        {comoLista(t(`experiencias.${e.id}.atividades`, { returnObjects: true })).map((a) => <li key={a}>{a}</li>)}
                    </ul>
                    <p className="exp-aprendizado"><strong>{t('sobre.aprendizado')}</strong> {t(`experiencias.${e.id}.aprendizados`)}</p>
                    </div>
                </li>
                ))}
            </ol>
            </section>

            <section aria-labelledby="sobre-interesses">
            <h2 id="sobre-interesses" className="subtitulo">{t('sobre.interesses')}</h2>
            <p className="sobre-nota">{t('sobre.interessesNota')}</p>
            <div className="interesses-grade">
                {interesses.map((i) => (
                <article key={i.id} className="interesse">
                    <h3>{t(`interesses.${i.id}.titulo`)}</h3>
                    <p>{t(`interesses.${i.id}.descricao`)}</p>
                </article>
                ))}
            </div>
            </section>

            <section aria-labelledby="sobre-objetivos">
            <h2 id="sobre-objetivos" className="subtitulo">{t('sobre.objetivos')}</h2>
            <div className="sobre-texto">
                <p>{t('perfil.objetivos')}</p>
            </div>
            </section>

        </div>
        </div>
    </article>
    )
}

export default Sobre
