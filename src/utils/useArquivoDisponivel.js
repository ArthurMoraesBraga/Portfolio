import { useEffect, useState } from 'react'

// Confere se um arquivo (como o PDF do currículo) existe de verdade antes de mostrá-lo.
// Retorna 'verificando' | 'ok' | 'ausente'. Servidores de página única costumam responder
// 200 com o index.html quando o arquivo não existe, por isso o tipo da resposta também é conferido.
export function useArquivoDisponivel(url, tipoEsperado = 'pdf') {
    const [estado, setEstado] = useState({ url, situacao: 'verificando' })

    useEffect(() => {
        const controle = new AbortController()
        fetch(url, { method: 'HEAD', signal: controle.signal })
            .then((resposta) => {
                const tipo = resposta.headers.get('content-type') ?? ''
                setEstado({ url, situacao: resposta.ok && tipo.includes(tipoEsperado) ? 'ok' : 'ausente' })
            })
            .catch((erro) => {
                // Sem rede não dá para saber: tenta mostrar mesmo assim
                if (erro?.name !== 'AbortError') setEstado({ url, situacao: 'ok' })
            })
        return () => controle.abort()
    }, [url, tipoEsperado])

    // Se a URL mudou (troca de idioma), a verificação antiga não vale
    return estado.url === url ? estado.situacao : 'verificando'
}
