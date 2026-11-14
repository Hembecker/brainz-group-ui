# Big Brain UI

Design System da Big Brain (marca Brainz Group), num monorepo shadcn/ui (Vite, Turbo e npm workspaces). É um projeto **independente** dos produtos: nenhuma paleta de produto (Sync Flow S1/S3/S5 etc.) entra aqui.

Criado com `npx shadcn@latest init --preset b1auh2PSq --template vite --monorepo --rtl --pointer`. Do preset ficaram só o RTL, a fonte Inter e o cursor pointer. As cores neutras frias, o raio de 0.45rem e o anel de foco a 30% foram trocados pelos tokens da Big Brain.

**Preset de referência: `b1avsYW9Y`** (desde 2026-11-13): estilo `rhea`, cor base `mist`, tema `blue`, raio `small`, Inter e lucide.

**Tokens atuais: o tema da Brainz Group** (2026-11-13). Os neutros são os `oklch` do tema mist do shadcn, como o usuário passou, com os ajustes de acessibilidade dele. As cores de marca (`primary`, `secondary`, `ring`, `link`, `chart-*`, `sidebar-primary`, `sidebar-ring` e os estados) referenciam a escala Primária da marca (`--bb-primary-*`), no lugar do azul do Tailwind do tema mist + blue (commits `f351923` e `13351d7`).

Presets anteriores, só registrados: `b1auh2PQm` (zinc, raio `default`) e `b1auhtCr2` (zinc, tema `blue`, raio `small`).

**Não rode `shadcn apply`.** Testado em 2026-11-13 com o `b1auh2PQm` (e desfeito):
- ele sobrescreve todos os componentes com o estilo do preset (anel `ring/30`, destrutivo `bg-destructive/10`, alturas e raios do preset, rótulo "Loading");
- recria o `separator.tsx`;
- troca o modo escuro pelas cores zinc e despeja as cores do claro numa linha do `globals.css`;
- duplica as dependências do `ui` no `apps/web`;
- 2 stories reprovaram no axe por contraste.

Para trocar de preset, só registre o código aqui e mude à mão o que valer a pena, mantendo os tokens e as regras de acessibilidade.

O projeto antigo `C:\dev\Big Brain\design-system` (React 18, sem monorepo) é **só referência**. Não altere nada nele.

## Fontes da verdade
- **Estrutura e lógica dos componentes: shadcn/ui, versão Base UI.**
  - Cada componente segue a página dele em `https://ui.shadcn.com/docs/components/base/<nome>`: a mesma API, a mesma composição e as mesmas seções de documentação.
  - Daqui saem a estrutura e o comportamento. As cores, o contraste e os tamanhos vêm dos tokens da Big Brain.
  - O código-fonte vem do CLI (`npx.cmd shadcn add <nome>` dentro de `packages/ui`). Para ler o código de um exemplo do site (por exemplo, a seção RTL), abra a página e clique em **View Code**. Não chute URLs do registro.
- **Acessibilidade: o artigo https://shadcnstudio.com/blog/making-your-website-accessible-with-shadcn-ui/.** As regras dele valem para todo componente:
  1. **Nome acessível:**
     - todo controle tem nome, e o nome é específico (ação e, quando ajudar, o alvo: "Excluir fatura");
     - um botão só com ícone recebe o nome por `aria-label` ou por texto `sr-only`;
     - o tooltip nunca é o único nome.
  2. **Ícones decorativos:** levam `aria-hidden="true"`. O lucide já aplica sozinho, mas nos exemplos ele fica explícito.
  3. **Foco visível:**
     - usa o token `--ring` e `focus-visible`, nunca `outline: none` sem substituto, nunca o `ring/30` do preset;
     - é conferido contra todo fundo vizinho, nos dois modos. O Button usa um afastamento de 2px pela cor do fundo, porque no escuro o anel tem a mesma cor do preenchimento primário.
  4. **Gatilhos de primitivos:**
     - recebem o elemento pela prop `render` (Base UI), sem um `div` envolvendo;
     - `<button>` serve para ação e `<a>` para navegação.
  5. **Formulários:**
     - o rótulo é persistente, nunca só o placeholder;
     - a descrição e o erro ficam ligados ao campo por `aria-describedby` e `aria-errormessage`;
     - o estado inválido aparece na tela (`data-invalid`) e para a tecnologia assistiva (`aria-invalid`).
  6. **Mudanças dinâmicas:**
     - a região `aria-live="polite"` fica sempre montada, e só o texto dela muda;
     - `assertive` só para erros críticos.
  7. **Testes:**
     - percorrer só com o teclado;
     - rodar o axe (addon-a11y) nos dois modos e em RTL (`npm.cmd run test` já faz os três);
     - usar um leitor de tela;
     - conferir o zoom a 200%.
- O **Sync Flow** (`C:\dev\Big Brain\Sync Flow`) é **só referência**. Pode ler a API, as decisões de acessibilidade e a documentação do pacote dele. Nunca copie as cores, nunca importe arquivos de lá e nunca altere aquele projeto daqui.
- **Marca** (em `brand/`, copiado de `Downloads\SVG` em 2026-11-13):
  - `paleta-primaria.png`: Primária de 50 a 950, base 500 = `#4787F0`.
  - `brainz-group-logo.svg`: azul `#4787F0`, tinta `#1D1D1B` e gradiente de `#4787F0` para `#305BA3`.
- Tudo marcado como **PROVISÓRIO** em `packages/ui/src/styles/globals.css` ainda precisa ser confirmado com a marca:
  - neutros (hoje os do tema mist do shadcn);
  - vermelho de erro;
  - fonte (Inter, a do preset);
  - modo escuro inteiro;
  - cores de gráfico (`--chart-*`).

## Ritmo e escopo
- **Biblioteca completa** (pedido do usuário em 2026-11-13): `shadcn add --all` instalou todos os componentes do registro (63 no total, estilo `base-rhea`), commit `0436c87`. Não adicione estrutura fora disso sem pedido.
- **Revisão:** os 63 componentes foram revisados e documentados em quatro ondas (2026-11-13) e estão em "Componentes/<Nome>". Um componente novo fica em "Em revisão/<Nome>" até ganhar as stories de todas as seções e a MDX completa. O briefing usado nas ondas (fontes, modelos, regras de story e de revisão) fica na nota compartilhada `brief-docs-componentes.md`.
- **Fontes de cada página:** `npx.cmd shadcn docs <nome>` confirma a página; a MDX da página está em `https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/v4/content/docs/components/base/<nome>.mdx` e cada exemplo em `…/apps/v4/examples/base/<exemplo>.tsx`.
- **Modelos:** Input (formulário) e Dialog (sobreposição: `play` que abre e espera as animações antes do axe, `dir`/`lang` no conteúdo do portal na story RTL).
- **Decisões do usuário para a biblioteca (2026-11-13):**
  - Button, Card, ButtonGroup e Spinner: o `add --all` sobrescreveu e as decisões foram reaplicadas;
  - escala do rhea em tudo: controles com 32px (`h-8`) e `rounded-2xl` (~13px); Card com `min(--radius-4xl, 24px)` (~19px);
  - campos (Input, Select, Textarea, InputGroup, NativeSelect, Combobox, InputOTP, Command, SidebarInput, Questionnaire) preenchidos sem borda, com o papel `field`;
  - anel de foco sólido corrigido em lote em todos (veja Convenção);
  - cores com opacidade do registro: revisadas componente a componente, na revisão de cada um.

## Estrutura
- `packages/ui` (`@workspace/ui`): os componentes e os tokens. O CLI e o `exports` do `package.json` mandam nesta pasta, então os componentes ficam **planos**, em `src/components/<nome>.tsx`, sem stories ao lado.
- `apps/storybook` (`@workspace/storybook`): o Storybook 10, com as stories e as páginas MDX de cada componente em `src/<nome>/`.
- `apps/web`: o app de exemplo do template.
- `brand/`: o material da marca. O Storybook serve esta pasta na raiz (`staticDirs`), então os exemplos usam `src="brainz-group-logo.svg"`.

## Convenção de cada componente
- `packages/ui/src/components/<nome>.tsx`: o componente.
  - Começa com um comentário com o link da página do shadcn e as decisões tomadas.
  - Função comum: no React 19 o `ref` chega como prop, sem `forwardRef`.
  - Expõe `data-slot` e, quando tem variantes, os valores resolvidos (`data-variant`, `data-size`, `data-orientation`).
  - Paddings, margens e cantos lógicos (`ps`/`pe`, `ms`/`me`, `rounded-s`/`rounded-e`, `border-s`), para funcionar em RTL.
  - Nenhuma cor com opacidade (`bg-primary/80`, `bg-destructive/10`…) nos componentes revisados: os contrastes anotados nos tokens valem como estão. Exceção escolhida pelo usuário: o Button outline no escuro usa `dark:border-input dark:bg-input/30`, como no shadcn. Outras exceções anotadas: o véu `bg-black/30` de Dialog, AlertDialog, Sheet e Drawer e a linha removida do CodeBlock (`bg-destructive/10`, sem papel cheio equivalente).
  - Anel de foco: `focus-visible:ring-3 ring-ring ring-offset-2 ring-offset-background` (o mesmo vale com `focus-within:` ou um seletor `has-[…]:`), nunca o `ring-ring/30` ou `/50` do registro. Itens de menu e de lista destacam com `focus:bg-accent`, sem anel.
- `apps/storybook/src/<nome>/<nome>.stories.tsx`: uma story por seção, na ordem da página do shadcn.
  - Cada story usa JSX literal, sem `args` e sem constantes, para o "Show code" dar um trecho que dá para copiar.
  - `render: () => (…)` é sempre a **última** propriedade da story, porque o `transform` do `.storybook/preview.tsx` extrai o snippet a partir dela.
  - Só a story `Playground` tem controles.
  - A story `Rtl` usa um `div` com `dir="rtl"` e `lang="ar"`, com os textos em árabe do exemplo do shadcn. Ícones de direção levam `rtl:rotate-180`.
- `apps/storybook/src/<nome>/<nome>.mdx`: a página Docs, com as seções do shadcn na mesma ordem e em português:
  1. título e descrição, com o exemplo principal;
  2. Instalação;
  3. Uso;
  4. **Acessibilidade**, com as regras do artigo aplicadas ao componente;
  5. as seções da página do shadcn, incluindo **Cursor** (Button) e **RTL**;
  6. Referência da API, em tabela Prop / Tipo / Padrão. A tabela é escrita como `<table>` em JSX, porque o MDX do Storybook não ativa as tabelas de pipe do GFM, que apareceriam como texto cru.
- Não há `autodocs` global: cada componente tem a própria MDX.
- Depois de um `shadcn add` que sobrescreva um componente, reaplique as decisões do comentário do topo.

## Pilha
- **Base:** React 19.3.1, Vite 8, Tailwind 4, TypeScript 6, Turbo e npm workspaces.
- **Componentes:** `@base-ui/react` 1.9.0, cva, lucide-react e `cn` (pacote do shadcn que substitui clsx + tailwind-merge).
- **Storybook 10:** `@storybook/react-vite`, addon-docs (MDX), addon-a11y e addon-vitest, com a telemetria desligada.
- **Testes:** `npm.cmd run test` usa Vitest 5 com Playwright e Chromium.
  - Cada story vira um teste, e o axe roda com `a11y.test: "error"`: qualquer violação reprova.
  - O teste roda três vezes: claro (`test:light`), escuro (`test:dark`, `--mode dark`) e RTL (`test:rtl`, `--mode rtl`). O `initialGlobals` do `preview.tsx` lê o `import.meta.env.MODE`.
- **Versões fixas**, sem `^`, `~` nem `latest`, em todos os `package.json`. O `.npmrc` tem `save-exact=true`. O `"@workspace/ui": "*"` é a referência do workspace e fica assim.
- O CLI do shadcn é o local (`packages/ui`, versão fixa). Depois de um `shadcn add`, confira se ele não voltou a escrever `^` no `package.json`.

## Tokens
- Ficam em `packages/ui/src/styles/globals.css`:
  - a paleta da marca (`--bb-primary-*`, `--bb-ink`, `--bb-gradient`), com os valores brutos;
  - papéis semânticos (`--primary`, `--foreground`…). É o que os componentes usam. Os neutros e o vermelho têm os `oklch` do tema mist escritos direto, como no shadcn; as cores de marca são `var(--bb-primary-*)`. Os componentes nunca usam a paleta direto.
- **Convenção do shadcn** (https://ui.shadcn.com/docs/theming):
  - cada superfície tem um par `<papel>` + `<papel>-foreground`, para o texto e os ícones sobre ela;
  - todos os tokens do tema padrão do shadcn existem aqui, com os mesmos nomes, no `:root`, no `.dark` e no `@theme inline`: `background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1` a `chart-5`, `sidebar-*` e `radius`, com a escala `radius-sm` a `radius-4xl`;
  - os tokens a mais da Big Brain seguem o "Adding New Tokens" do shadcn: valor no `:root` e no `.dark` e exposição no `@theme inline`. São `primary-hover`, `primary-pressed`, `secondary-hover`, `destructive-hover`, `destructive-foreground`, `link` e `link-hover`. Os estados de marca vêm da Primária (`primary-hover` 700 e `primary-pressed` 800 nos dois modos, porque a 500 com branco daria 3,5:1; `secondary-hover` 200 no claro e 800 no escuro) e os do vermelho, do red do Tailwind. No escuro, `destructive-foreground` é a mist 950 (branco no red 400 daria 2,9:1) e `link` é a Primária 300 (10,2:1 no fundo);
  - `field`: fundo dos campos, sem borda, como no rhea. Mist 200 no claro e mist 800 no escuro. A11Y: o limite do campo tem 1,25:1 no claro e 1,33:1 no escuro (1,17:1 num card), abaixo dos 3:1 de uma borda de campo: escolha do usuário. Placeholder 5,9:1 e 6,1:1. O registro usava `bg-input/50`;
  - só `border`, `input` e `sidebar-border` do escuro usam transparência (branco a 10% e 40%), como no shadcn. O Button outline no escuro usa `border-input` (40%, 3,8:1) e o preenchimento `bg-input/30`, como no tema padrão do shadcn, porque a borda a 10% ficava apagada (1,25:1).
- **`baseColor`:** `mist` nos dois `components.json`, igual à escala dos neutros. O CLI só usa esse campo no `init` e no `apply`.
- **Superfícies no escuro**, do fundo para cima: `background` na mist 950, depois `card`, `popover` e `sidebar` na 900, depois `muted`, `accent` e `sidebar-accent` na 800. No claro, o fundo e o card são brancos, e `muted` e `accent` ficam na mist 100.
- **Contrastes das cores de marca** (o axe só mede texto, então confira estes números à mão quando mudar algum valor):
  - `ring`: Primária 500 no claro (3,5:1 no branco; `sidebar-ring` 3,4:1 na sidebar) e 400 no escuro (7,6:1 no fundo, 6,7:1 no card). No escuro, o anel tem só 2,0:1 contra a primária 600; o afastamento de 2px pela cor do fundo os separa;
  - `secondary`: 100 com texto 800 no claro (7,7:1) e 900 com texto 100 no escuro (9,0:1);
  - `sidebar-primary`: 600 com branco nos dois modos (5,2:1);
  - gráficos com uma escala por modo: Primária 500 a 900 no claro (3,5 a 10,9:1 no branco) e 200 a 600 no escuro (13,3 a 3,8:1 no fundo).
- **Ajustes de acessibilidade nos neutros** (escolhidos pelo usuário em 2026-11-13, marcados com "A11Y" no `globals.css`):
  - `muted-foreground` do claro: mist 600 (7,4:1 no branco, 6,6:1 sobre `muted`), no lugar da mist 500 (4,1:1 sobre `muted`);
  - `input`: mist 500 no claro (4,6:1) e branco a 40% no escuro (3,8:1), no lugar da mist 200 (1,2:1) e de 15% (~1,5:1). O `border` decorativo continua suave.
- Uma classe de cor sem papel definido não gera nada e não dá erro. Mapeie para um papel existente ou crie o papel nos dois modos, com o contraste anotado, e registre a classe no `@theme inline`.
- **Modo escuro:** só a classe `.dark` num ancestral, a mesma do preset, do `ThemeProvider` de `apps/web` e da variante `dark:`. O `data-mode` do projeto antigo não existe mais.
- **Ação primária:** a Primária **600** (`#2568D8`) com texto branco (5,2:1), nos dois modos, e não a base 500 (branco na 500 dá 3,5:1). No escuro, o botão tem 3,8:1 contra o fundo. Confira de novo os números quando mudar algum valor.
- **Raio:** `--radius: 0.45rem` (7,2px), o raio `small` do preset. Os controles usam `rounded-2xl` (× 1,8, ~13px), como o estilo rhea; o Card usa `min(--radius-4xl, 24px)` (× 2,6, ~19px).

## Windows
- No PowerShell, use `npm.cmd` e `npx.cmd`, porque a política de execução bloqueia os `.ps1`.
- Não rode instaladores interativos, como `npm create storybook` ou `storybook add`.
- O npm 11 não roda o `postinstall` do esbuild (aviso `allow-scripts`). O esbuild funciona assim mesmo.
- O cache global do npm desta máquina está corrompido (`ENOENT … Invalid response body`). Nas instalações, use um cache privado com `$env:npm_config_cache = '<pasta temporária>'` antes do `npm.cmd`. Não rode `npm cache clean --force` sem perguntar ao usuário.

## Storybook pelo app
- `.claude/launch.json` tem a configuração `big-brain-ui-storybook`, na porta **6007**. A 6006 fica para o Storybook do projeto antigo.

## Estado (2026-11-13)
- **Commits na `master`:** `beb27a0` (template do shadcn), `421bc9e` (migração), `6710f95` (`vercel.json`), `c5d313c` (`.gitignore`), `f351923` (tema mist + blue), `a04e1bf` (estado) e `13351d7` (ajustes de acessibilidade), publicados. **Sem push** (o usuário escolheu só commitar): `bf3da8a` (tema da Brainz Group), `0436c87` (`add --all`), `477f6e0` (escala rhea, `field`, foco), `4a3c1d1` (modelos Input e Dialog), `ba6a149`, `ac66a3f`, `01a0331` e `95bf988` (as quatro ondas de revisão) e o commit de fechamento.
- **Remoto:** `origin` = https://github.com/Hembecker/big-brain-ui (privado). A branch `legacy/design-system` não foi enviada.
- **Vercel:** projeto `big-brain-ui` no time `hembecker-6729s-projects`, ligado ao GitHub. A branch de produção é a `master`. Publica o Storybook (`vercel.json`: `npm ci`, `turbo build --filter=@workspace/storybook`, saída `apps/storybook/storybook-static`) em https://big-brain-ui.vercel.app. O repositório é privado, mas o site é público. A pasta `.vercel` fica fora do git.
- **Histórico do projeto antigo:** a branch `legacy/design-system` tem os 4 commits dele (`07e12db` a `9e46818`). É só arquivo: não faça merge dela na `master`.
- **Decisões da migração:**
  - stories e MDX em `apps/storybook`, componentes planos em `packages/ui`;
  - o ButtonGroup usa o `Separator` do registro, com a cor trocada;
  - o `ButtonGroupSeparator` usa `bg-muted-foreground` (6,1:1 sobre o secundário no claro, 4,5:1 no escuro), e não o `bg-input` do shadcn, que com o input na mist 200 quase sumia entre botões secundários. No projeto antigo era `bg-border`;
  - os testes rodam três vezes por `--mode`;
  - Card: raio do rhea (~19px, maior que os ~13px dos controles, para cantos concêntricos), contorno `ring-border` em vez de `ring-foreground/5`, recuo de 20px (sm 16px), título com um heading dentro.
- **Verificado:**
  - `typecheck`, `lint` e `build` (web e Storybook estático) limpos;
  - `npm.cmd run test`: 521 stories passam com axe no claro, no escuro e em RTL;
  - o axe deixa de fora, globalmente, só os spans `[data-base-ui-focus-guard]` do Base UI (falso positivo de `aria-hidden-focus`); o preview envolve as stories num `DirectionProvider`;
  - a primeira rodada do vitest com cache frio pode falhar com "Vite unexpectedly reloaded" (otimização de dependências); rodar de novo resolve;
  - no navegador: as três páginas Docs nos dois modos e em RTL, as alturas de 24/28/32/36px e o raio de ~13px (escala rhea), o anel sólido por Tab (inclusive no primário no escuro), o "Show code" só com o JSX e a Inter carregada;
  - console limpo.
- **Decisões do usuário depois da revisão (2026-11-13):**
  - mantidos: Toggle ligado em `primary`; Badge destrutivo sólido; Progress com trilho contornado; Alert sem `role` padrão (quem usa passa `status` ou `alert`); botões de seta e de limpar do Combobox fora do Tab;
  - Tabs: a aba ativa no escuro volta a ter `dark:bg-input/30` (exceção, como o Button outline);
  - Sidebar: sem `side`, abre no início da linha (esquerda em LTR, direita em RTL, pelo `useDirection`); `left`/`right` explícitos continuam físicos. Sheet e Drawer seguem físicos;
  - pegada do Resizable e polegar do ScrollArea em `bg-input` (3:1); a linha de 1px do Resizable continua decorativa;
  - Calendar no escuro: as pontas do intervalo ganham borda de 2px na cor do fundo (3,8:1). A faixa não escurece porque `card` e `popover` são a mesma mist 900 no escuro e ela sumiria num Date Picker (o usuário tinha escolhido escurecer a faixa; a troca foi explicada);
  - ItemSeparator: contêiner `role="none"` com a linha `aria-hidden`, testado na story Grupo do Item;
  - InputOTP: o componente guarda o `defaultValue` e entrega só `value` à biblioteca;
  - os valores PROVISÓRIOS (neutros, vermelho, fonte, gráficos, modo escuro) esperam o material da marca: não mexa neles.
- **Zoom e reflow (2026-11-13):** as 63 páginas Docs foram abertas a 640px (zoom de 200%) e a 320px, e as Demos a 320px. A 640px nenhuma rola na horizontal. O `apps/storybook/.storybook/docs.css` faz o código em linha quebrar e as tabelas e blocos de código rolarem dentro de si; Tabs e Collapsible perderam as larguras fixas das stories, e o Popover ganhou `max-w-(--available-width)`.
- **Rolar na barra (escolha do usuário):** a lista horizontal das Tabs, o Menubar e a lista do NavigationMenu rolam na horizontal dentro da barra quando não cabem, com a barra de rolagem escondida (`no-scrollbar`) e o `scroll-fade-x` do shadcn como dica. Nos navegadores sem `animation-timeline: scroll()` vale o fallback do shadcn, escolha do usuário: as duas pontas sempre esmaecidas, mesmo quando a barra cabe; o fundo e a borda da barra se dissolvem junto (o usuário preferiu isso a um contêiner por fora). A story "Rolagem na barra" de cada um (largura limitada) percorre a barra pelo teclado e confere que o item focado fica inteiro e fora do fade; as setas do Base UI já rolam o item sozinhas, então o teste do NavigationMenu usa o Tab, que depende do `onFocus` (sem ele, o teste reprova). O anel de foco dos itens é `ring-inset`, o `scroll-px-10` e um `onFocus` com `scrollIntoView` trazem o item focado para fora do fade, e o sublinhado da `line` subiu para `-3px`. Conferido a 320px em LTR e RTL: nenhuma Demo rola a página. As animações do `scroll-fade` são guiadas pela rolagem e nunca terminam: um `play` que espera `document.getAnimations()` precisa filtrar `animation.timeline === document.timeline`, senão trava (as stories já filtram).
- **Ainda em aberto:**
  - leitor de tela: com o usuário, pelo roteiro `roteiro-leitor-de-tela.md` da nota compartilhada;
  - a 320px ainda rolam as páginas Docs do DropdownMenu (+17px) e do Questionnaire (+33px), por um elemento que a varredura não isolou;
  - o `npm audit` aponta 17 avisos (2 baixos, 15 moderados), todos em ferramentas de desenvolvimento (ESLint, typescript-eslint, plugin do Storybook, CLI do shadcn), nenhum no que é publicado. O ESLint 10.15.0 corrige o dele; os demais esperam versões novas (o `npm audit fix --force` sugeria rebaixar o Storybook para a 8 e o shadcn para a 1). Nada foi mudado, a pedido do usuário;
  - o `./lib/*` do `exports` de `packages/ui` aponta para `.ts`, então o `highlighter.tsx` não é importável como `@workspace/ui/lib/highlighter` (o hook usa import relativo);
  - o `typecheck` de `apps/web` não confere nada (`tsconfig.json` com `files: []`, herdado do template);
  - a Sidebar com `side` contrário à direção (`side="left"` em RTL) fica incoerente (documentado);
  - o afastamento do anel de foco usa a cor do fundo da página (`ring-offset-background`). Dentro de um card no escuro, ele é a mist 950 sobre um card 900, um pouco mais escuro que o card.
- Commitar só quando o usuário pedir. Cada push na `master` publica em produção no Vercel.
