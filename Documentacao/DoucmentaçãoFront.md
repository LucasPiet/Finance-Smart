Documentação Técnica: Finance Smart
Versão do Documento: 1.0.0 Tecnologias: React 18, TypeScript, Vite, CSS3 (Variables)

1. Visão Geral da Arquitetura
O projeto Finance Smart é uma Single Page Application (SPA) desenvolvida com foco em performance e experiência de usuário móvel (Mobile-First). A arquitetura utiliza React Router v6 para gerenciamento de rotas e Code Splitting (Lazy Loading) para otimizar o tempo de carregamento inicial.

Estrutura de Diretórios
src/components/layout: Componentes estruturais (HOCs) que definem o esqueleto das páginas.

src/components/UserMenu & AppMenu: Componentes de UI isolados para navegação e ações.

src/pages: Telas finais visualizadas pelo usuário.

src/router: Definição das rotas e proteção de acesso.

src/styles: Estilização global baseada em CSS Variables para consistência de design system.

2. Roteamento e Performance (AppRouter.tsx)
O arquivo AppRouter.tsx atua como o "controlador de tráfego" da aplicação.

Estratégias Utilizadas:
Lazy Loading (React.lazy): Os componentes das páginas não são carregados no bundle inicial. Eles são baixados sob demanda.

Suspense: Um componente de fallback (<Loading />) é exibido enquanto os chunks de JavaScript são baixados.

Nested Routes (Rotas Aninhadas): Utilizamos layouts persistentes (AppLayout, AuthLayout) que envolvem as rotas filhas renderizadas via <Outlet />.

Mapeamento de Rotas:

/ → Redirecionamento automático para /login.

/dashboard/* → Rotas protegidas (Layout Principal).

/novo-lancamento, /sobre-nos → Rotas de formulário/informação (Layout Secundário).

3. Layouts e Composição
Os layouts são componentes que persistem na tela durante a navegação entre rotas filhas.

3.1. AppLayout.tsx (Layout Principal)
Este é o componente mais complexo, responsável por orquestrar o estado global da dashboard.

Principais Funções e Lógica:

Gerenciamento de Data (useState, Intl.DateTimeFormat):

O estado currentDate armazena a data de referência da dashboard.

A data é formatada automaticamente para o padrão "Mês/Ano" (ex: Abril/2025) utilizando a API nativa do browser, garantindo internacionalização correta.

Navegação Temporal (handlePrevMonth, handleNextMonth):

Manipula o objeto Date do JavaScript para avançar ou retroceder meses, tratando automaticamente viradas de ano.

Calendário Nativo (dateInputRef):

Técnica: Utilizamos um input do tipo date invisível posicionado sobre o ícone de calendário.

Acionamento: O método showPicker() (ou .click() como fallback) é invocado via useRef para abrir o seletor de data nativo do sistema operacional (Android/iOS), oferecendo a melhor UX possível.

Outlet Context:

A data atual é passada para as rotas filhas (Receitas, Despesas) através do contexto do React Router, permitindo que as listas filtrem os dados baseados no mês selecionado no layout pai.

3.2. FormLayout.tsx
Layout focado em tarefas específicas. Remove a navegação inferior e adiciona um cabeçalho com botão "Voltar".

Função handleGoBack: Utiliza Maps(-1) para manipular a pilha de histórico do navegador, retornando o usuário exatamente para onde estava antes.

3.3. AuthLayout.tsx
Um container centralizado flexível (display: flex) projetado para telas de Login e Cadastro. Garante que o card de autenticação esteja sempre centralizado vertical e horizontalmente.

4. Componentes de UI
4.1. UserMenu.tsx e AppMenu.tsx
Componentes controlados que gerenciam menus flutuantes (Popovers).

Lógica de Estado:

Possuem um estado local isOpen (boolean).

Utilizam Renderização Condicional ({isOpen && ...}) para montar/desmontar o menu do DOM, economizando memória quando fechado.

Navegação Programática: Utilizam o hook useNavigate para redirecionar o usuário e fechar o menu simultaneamente após um clique.

Estilização:

UserMenu: Posicionado à esquerda (left: 0).

AppMenu: Posicionado à direita (right: 0, left: auto) para evitar overflow horizontal na tela.

5. Páginas (Features)
5.1. NovoLancamento.tsx
Formulário dinâmico para criação de transações.

Destaques Técnicos:

Estado de Tipo (type): Um estado controla se é 'expense' ou 'income'.

Theme Object: Um objeto theme computa as cores (vermelho/verde) e os labels (Data de vencimento vs. recebimento) em tempo de execução. Isso evita condicionais ternárias excessivas dentro do JSX (Clean Code).

Controlled Components: Os inputs (radio buttons, text) são gerenciados pelo React.

5.2. Login.tsx, Cadastro.tsx
Formulários de autenticação.

Utilizam e.preventDefault() no evento onSubmit para evitar o recarregamento padrão da página (comportamento SPA).

Simulam a autenticação e redirecionam o usuário para o /dashboard ou /login conforme o fluxo de sucesso.

5.3. Dashboard (Todos, Receitas, Despesas)
Componentes de visualização.

Atualmente renderizam mocks estáticos.

Estão preparados para receber o context do AppLayout contendo a data selecionada para realizar o fetch de dados reais no futuro.

6. Estilização e Design System (styless.css)
A estilização segue uma abordagem moderna e modular sem o uso de pré-processadores, aproveitando o poder do CSS nativo.

CSS Custom Properties (Variáveis)
Definidas no :root, criam uma única fonte de verdade para o design system:

--color-primary: Facilita a mudança de tema da marca (White Labeling).

--color-positive / --color-negative: Padronização semântica para finanças.

--spacing-*: Mantém o ritmo vertical e horizontal consistente.

Técnicas de Responsividade e UX
Mobile Constraints: O container .app-screen possui max-width: 480px e centralização automática, simulando uma experiência de aplicativo nativo mesmo em desktops.

Acessibilidade: Estilos de :focus personalizados utilizam outline-offset para garantir que a navegação por teclado seja visível e clara.

Z-Index Management: O AppMenu e UserMenu possuem z-index: 1000 para garantir sobreposição correta sobre o conteúdo scrollável e o rodapé.