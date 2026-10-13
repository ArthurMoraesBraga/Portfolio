import LanguageSwitcher from './LanguageSwitcher'

// Faixa fina no topo de todas as páginas, com o seletor de idioma.
// Fica num único lugar (App.jsx), então não há seletor duplicado em cada página.
function BarraIdioma() {
    return (
        <div className="barra-idioma">
            <div className="container barra-idioma-conteudo">
                <LanguageSwitcher />
            </div>
        </div>
    )
}

export default BarraIdioma
