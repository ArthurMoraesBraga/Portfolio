import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SpotifyPlayer, { LinkSpotify } from '../components/SportfyPlayer'
import { musicas, playlist } from '../data/musicas'
import { interpretarSpotify } from '../utils/spotify'
import './Musicas.css'

const ID_PLAYLIST = 'playlist'
const doisDigitos = (n) => String(n).padStart(2, '0')

// Os links cadastrados não mudam durante a visita, então são interpretados uma vez só.
const lista = musicas.map((m) => ({ ...m, spotify: interpretarSpotify(m.link, 'track') }))
// A playlist só aparece se estiver cadastrada com um link válido.
const spotifyDaPlaylist = playlist ? interpretarSpotify(playlist.link, 'playlist') : null
const minhaPlaylist = spotifyDaPlaylist ? { ...playlist, spotify: spotifyDaPlaylist } : null

function Musicas() {
    const { t } = useTranslation()
    // A primeira música já vem selecionada. Carregar o player não toca nada.
    const [selecionado, setSelecionado] = useState(
        lista[0]?.id ?? (minhaPlaylist ? ID_PLAYLIST : null),
    )
    const playerRef = useRef(null)

    function selecionar(id) {
        setSelecionado(id)
        // Se o player estiver fora da tela, leva a pessoa até ele
        playerRef.current?.scrollIntoView({ block: 'nearest' })
    }

    const indice = lista.findIndex((m) => m.id === selecionado)
    let atual = null
    if (indice >= 0) {
        const m = lista[indice]
        atual = {
            chave: m.id,
            rotulo: doisDigitos(indice + 1),
            legenda: t('musicas.faixaDeTotal', { n: indice + 1, total: lista.length }),
            titulo: m.titulo,
            artista: m.artista,
            spotify: m.spotify,
            cor: m.cor,
        }
    } else if (selecionado === ID_PLAYLIST && minhaPlaylist) {
        atual = {
            chave: ID_PLAYLIST,
            rotulo: 'PL',
            legenda: t('musicas.playlist'),
            titulo: minhaPlaylist.titulo ?? t('musicas.minhaPlaylist'),
            artista: null,
            spotify: minhaPlaylist.spotify,
            cor: minhaPlaylist.cor,
        }
    }

    return (
        <article className="pagina container">
            <header className="pagina-topo">
                <p className="pagina-faixa">{t('comum.faixa', { numero: '04' })}</p>
                <h1 className="pagina-titulo" tabIndex={-1}>{t('musicas.titulo')}</h1>
            </header>

            {atual ? (
                <div ref={playerRef} className="musicas-player" style={{'--cor-fundo':atual.cor}}>
                    <SpotifyPlayer
                        key={atual.chave}
                        rotulo={atual.rotulo}
                        legenda={atual.legenda}
                        titulo={atual.titulo}
                        artista={atual.artista}
                        spotify={atual.spotify}
                    />
                    
                </div>
            ) : (
                <p className="player-aviso" role="status">
                    {t('musicas.montando')}
                </p>
            )}

            {lista.length > 0 && (
                <>
                    <h2 className="subtitulo musicas-subtitulo">{t('musicas.listaFaixas')}</h2>
                    <ol className="musicas-lista">
                        {lista.map((m, i) => (
                            <li
                                key={m.id}
                                className={`musica ${m.id === selecionado ? 'musica--atual' : ''}`}
                            >
                                <button
                                    type="button"
                                    className="musica-disco"
                                    onClick={() => selecionar(m.id)}
                                    aria-label={t('musicas.selecionar', { titulo: m.titulo, artista: m.artista })}
                                    aria-pressed={m.id === selecionado}
                                >
                                    <span>{doisDigitos(i + 1)}</span>
                                </button>
                                <div>
                                    <h3>{m.titulo}</h3>
                                    <p className="musica-artista">{m.artista}</p>
                                    <p className="musica-comentario">{t(`musicas.comentarios.${m.id}`)}</p>
                                    {m.spotify && <LinkSpotify url={m.spotify.url} titulo={m.titulo} />}
                                </div>
                            </li>
                        ))}
                    </ol>
                </>
            )}

            {minhaPlaylist && (
                <section aria-labelledby="titulo-playlist">
                    <h2 id="titulo-playlist" className="subtitulo musicas-subtitulo">
                        {t('musicas.tituloPlaylists')}
                    </h2>
                    <ul className="musicas-lista">
                        <li
                            className={`musica ${selecionado === ID_PLAYLIST ? 'musica--atual' : ''}`}
                        >
                            <button
                                type="button"
                                className="musica-disco"
                                onClick={() => selecionar(ID_PLAYLIST)}
                                aria-label={t('musicas.selecionarPlaylist', { titulo: minhaPlaylist.titulo ?? '' }).trim()}
                                aria-pressed={selecionado === ID_PLAYLIST}
                            >
                                <span>PL</span>
                            </button>
                            <div>
                                <h3>{minhaPlaylist.titulo ?? t('musicas.minhaPlaylist')}</h3>
                                <p className="musica-comentario">{t('musicas.comentarioPlaylist')}</p>
                                <LinkSpotify
                                    url={minhaPlaylist.spotify.url}
                                    titulo={minhaPlaylist.titulo}
                                />
                            </div>
                        </li>
                    </ul>
                </section>
            )}
        </article>
    )
}

export default Musicas