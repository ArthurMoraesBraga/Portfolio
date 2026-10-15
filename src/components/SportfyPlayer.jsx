import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Vinil from './Vinil'
const logoSpotify = 'images/logo_sportfy.svg'
import { alturaEmbed, carregarIframeApi } from '../utils/spotify'

// Link para abrir no Spotify, com o logo oficial (versão preta, fundo claro, 70px).
export function LinkSpotify({ url, titulo }) {
    const { t } = useTranslation()
    return (
        <a href={url} target="_blank" rel="noreferrer" className="spotify-link">
            <img src={logoSpotify} alt="" width="70" height="19" />
            <span>{t('spotify.abrir')}</span>
            <span className="visualmente-oculto"> {titulo ? t('comum.abreEmNovaAbaTitulo', { titulo }) : t('comum.abreEmNovaAbaParenteses')}</span>
        </a>
    )
}

// Player incorporado do Spotify ao lado do vinil.
// - Nada toca sozinho: a música só começa quando a pessoa aperta play no player.
// - O vinil gira conforme o evento "playback_update" da iFrame API oficial do Spotify
//   (isPaused / isBuffering). Se essa API não carregar, usa o player simples e o vinil
//   fica parado, porque não há como saber o estado real da reprodução.
// Use `key` ao trocar de música: cada escolha cria um player novo.
function SpotifyPlayer({ rotulo, legenda, titulo, artista, spotify }) {
    const { t } = useTranslation()
    const hospedeiro = useRef(null)
    const [api, setApi] = useState('carregando') // 'carregando' | 'pronta' | 'indisponivel'
    const [tocando, setTocando] = useState(false)

    useEffect(() => {
        if (!spotify) return
        const host = hospedeiro.current
        let ativo = true
        let controlador = null

        carregarIframeApi()
            .then((iframeApi) => {
                if (!ativo) return
                const alvo = document.createElement('div')
                host.replaceChildren(alvo)

                iframeApi.createController(
                    alvo,
                    { uri: spotify.uri, width: '100%', height: alturaEmbed(spotify.tipo) },
                    (ctrl) => {
                        if (!ativo) {
                            ctrl.destroy()
                            return
                        }
                        controlador = ctrl
                        ctrl.addListener('playback_update', (evento) => {
                            // Só conta como "tocando" quando o Spotify diz explicitamente que não está pausado
                            const dados = evento?.data
                            if (ativo) setTocando(dados?.isPaused === false && !dados.isBuffering)
                        })
                    },
                )
                setApi('pronta')
            })
            .catch(() => {
                if (ativo) setApi('indisponivel')
            })

        return () => {
            ativo = false
            controlador?.destroy()
            host.replaceChildren()
        }
    }, [spotify])

    let estado
    if (api === 'carregando') {
        estado = t('spotify.carregando')
    } else if (api === 'indisponivel') {
        estado = t('spotify.indisponivel')
    } else {
        estado = tocando ? t('spotify.tocando') : t('spotify.apertePlay')
    }

    return (
        <section className="player papel" aria-label={t('spotify.playerRotulo')}>
            <Vinil iniciais={rotulo} girando={tocando} />

            <div className="player-painel">
                <p className="player-faixa">{legenda}</p>
                <h2 className="player-titulo">{titulo}</h2>
                {artista && <p className="player-artista">{artista}</p>}

                {spotify ? (
                    <>
                        {api !== 'indisponivel' && (
                            <div
                                ref={hospedeiro}
                                className="player-embed"
                                style={{ minHeight: alturaEmbed(spotify.tipo) }}
                            />
                        )}
                        {api === 'indisponivel' && (
                            <iframe
                                className="player-embed"
                                src={spotify.embedUrl}
                                title={t('spotify.playerTitulo', { titulo })}
                                width="100%"
                                height={alturaEmbed(spotify.tipo)}
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        )}
                        <p className="player-estado">{estado}</p>
                        <LinkSpotify url={spotify.url} titulo={titulo} />
                    </>
                ) : (
                    <p className="player-aviso">{t('spotify.semPlayer')}</p>
                )}
            </div>
        </section>
    )
}

export default SpotifyPlayer