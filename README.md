<div align="center">
  <h1>Arthur Moraes — Portfólio</h1>

  <p>
    Portfólio pessoal desenvolvido para apresentar minha trajetória,
    projetos, experiências, certificados e interesses em tecnologia.
  </p>

  <p>
    <a href="https://arthurmoraes.dev">Acessar o portfólio</a>
  </p>

  <img
    src="https://skillicons.dev/icons?i=react,vite,js,html,css,git,github,vercel"
    alt="React, Vite, JavaScript, HTML, CSS, Git, GitHub e Vercel"
  />
</div>

<hr />

<h2>Sobre o projeto</h2>

<p>
  Este projeto foi desenvolvido durante meu aprendizado de React.
  A proposta é reunir informações sobre minha formação em Engenharia
  de Software na PUC Minas e compartilhar minha evolução na área.
</p>

<p>
  A identidade visual tem inspiração na música e nos discos de vinil,
  com animação de introdução, cores suaves e navegação organizada em
  páginas. O conteúdo está disponível em português e inglês.
</p>

<h2>Como foi desenvolvido</h2>

<ul>
  <li>
    <strong>React:</strong> construção das páginas e dos componentes
    reutilizáveis, com hooks para controlar estados e interações.
  </li>
  <li>
    <strong>Vite:</strong> ambiente de desenvolvimento e geração
    da versão de produção.
  </li>
  <li>
    <strong>JavaScript e JSX:</strong> lógica da aplicação e
    definição da interface.
  </li>
  <li>
    <strong>CSS:</strong> estilização, animações e adaptação
    para diferentes tamanhos de tela.
  </li>
  <li>
    <strong>i18next e react-i18next:</strong> tradução da interface,
    mantendo o idioma selecionado durante a navegação.
  </li>
  <li>
    <strong>React Icons:</strong> ícones utilizados na interface.
  </li>
  <li>
    <strong>React-PDF:</strong> pré-visualização do currículo
    dentro do próprio site.
  </li>
  <li>
    <strong>Git e GitHub:</strong> versionamento e armazenamento
    do código.
  </li>
  <li>
    <strong>Vercel:</strong> hospedagem e publicação das atualizações
    enviadas ao repositório.
  </li>
</ul>

<h2>Conteúdo e funcionalidades</h2>

<ul>
  <li>Introdução animada com disco de vinil.</li>
  <li>Apresentação pessoal, formação e experiências.</li>
  <li>Projetos com tecnologias utilizadas e links para os repositórios.</li>
  <li>Certificados com opções de visualização.</li>
  <li>Pré-visualização e download do currículo.</li>
  <li>Seleção musical com player incorporado do Spotify.</li>
  <li>Estatísticas de atividade do GitHub.</li>
  <li>Estatísticas de tempo de programação do WakaTime.</li>
  <li>Informações acadêmicas do Canvas, com turmas e calendário de atividades.</li>
  <li>Formulário de contato integrado ao Formspree.</li>
  <li>Interface em português e inglês.</li>
  <li>Layout responsivo.</li>
</ul>

<h2>Organização do projeto</h2>

<ul>
  <li><code>src/components/</code> — componentes reutilizáveis da interface.</li>
  <li><code>src/pages/</code> — páginas e seus estilos.</li>
  <li><code>src/data/</code> — conteúdos e dados utilizados nas páginas.</li>
  <li><code>src/config/</code> — configurações das integrações.</li>
  <li><code>src/utils/</code> — funções auxiliares e tratamento de dados.</li>
  <li><code>scripts/</code> — scripts executados pelo Node.js, como a atualização dos dados do Canvas.</li>
  <li><code>public/</code> — arquivos públicos, como imagens, PDFs e dados gerados.</li>
  <li><code>src/App.jsx</code> — organização principal da aplicação.</li>
  <li><code>src/main.jsx</code> — inicialização do React.</li>
</ul>

<h2>Como executar localmente</h2>

<h3>1. Instale os requisitos</h3>

<ul>
  <li>
    <a href="https://nodejs.org/">Node.js</a>, em uma versão compatível
    com o Vite utilizado no projeto. O npm acompanha a instalação.
  </li>
  <li>
    <a href="https://git-scm.com/">Git</a>, para clonar o repositório.
  </li>
  <li>
    Um editor de código, como o
    <a href="https://code.visualstudio.com/">Visual Studio Code</a>.
  </li>
</ul>

<p>Após instalar, confira no terminal:</p>

<pre><code>node --version
npm --version
git --version</code></pre>

<h3>2. Clone o repositório</h3>

<pre><code>git clone https://github.com/ArthurMoraesBraga/Portfolio.git
cd Portfolio</code></pre>

<h3>3. Instale as dependências</h3>

<p>
  Execute o comando na pasta que contém o arquivo
  <code>package.json</code>:
</p>

<pre><code>npm install</code></pre>

<p>
  Esse comando instala as bibliotecas utilizadas pelo projeto.
  Não é necessário instalar React ou Vite separadamente.
</p>

<h3>4. Inicie o ambiente de desenvolvimento</h3>

<pre><code>npm run dev</code></pre>

<p>
  Abra no navegador o endereço informado pelo terminal.
  Ao salvar alterações no código, o ambiente de desenvolvimento
  atualiza a página.
</p>

<h3>5. Gere a versão de produção</h3>

<pre><code>npm run build</code></pre>

<p>
  Os arquivos prontos para publicação serão gerados na pasta
  <code>dist/</code>.
</p>

<p>Para testar essa versão localmente:</p>

<pre><code>npm run preview</code></pre>

<h2>Configuração das integrações</h2>

<p>
  Para reutilizar o portfólio com seus próprios dados, substitua
  as informações pessoais, os links e as configurações das integrações.
</p>

<ul>
  <li><strong>GitHub:</strong> configure o usuário usado nas consultas de atividade.</li>
  <li><strong>WakaTime:</strong> configure seus links de compartilhamento público.</li>
  <li><strong>Spotify:</strong> substitua os links das músicas e da playlist.</li>
  <li><strong>Formspree:</strong> configure o endereço de envio do seu formulário.</li>
  <li>
    <strong>Canvas:</strong> configure as variáveis de ambiente exigidas
    pelo script em um arquivo <code>.env</code> na raiz do projeto.
    Execute <code>node scripts/canvas.mjs</code> para atualizar
    o arquivo de dados consumido pela página.
  </li>
</ul>

<p>
  O arquivo <code>.env</code> não deve ser enviado ao GitHub.
  Tokens privados devem permanecer no ambiente de execução dos scripts,
  sem serem incluídos no código entregue ao navegador.
</p>

<h2>Publicação</h2>

<p>
  O portfólio está hospedado na Vercel, conectado ao repositório do GitHub,
  com domínio personalizado registrado na Name.com.
</p>

<p>
  Ao enviar alterações para a branch de produção, a Vercel executa
  o build e, caso ele seja concluído com sucesso, publica a nova versão.
</p>

<hr />

<div align="center">
  <p>Desenvolvido por <strong>Arthur Moraes Braga Araujo</strong>.</p>

  <a href="https://github.com/ArthurMoraesBraga">GitHub</a>
  |
  <a href="https://www.linkedin.com/in/arthur-moraes-4b00b8306/">LinkedIn</a>
  |
  <a href="https://arthurmoraes.dev">Portfólio</a>
</div>
