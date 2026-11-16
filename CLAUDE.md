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

O projeto antigo `C:\dev\Big Brain\design-system` (React 18, sem monorepo) foi apagado a pedido do usuário em 2026-11-15: o conteúdo foi para a Lixeira do Windows. O histórico dele continua na branch `legacy/design-system`.

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
  - `paleta-primaria.png`: Primária de 50 a 950, base 500 = `#4787F0`. Os tokens usam só de 100 a 900 (decisão do usuário em 2026-11-16, para seguir a estrutura do SESI, o principal cliente); o 50 e o 950 da imagem ficam de fora.
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
- `packages/ui/src/brand/` (`@workspace/ui/brand/*`): o registro de marcas (`brands.tsx`: nome, logo, símbolo, `illustrative`), o `BrainzLogo`/`BrainzMark` em SVG com `currentColor` e os passos da marca, o `SesiLogo`/`SesiMark` oficiais, um logo genérico de exemplo e o `use-brand.tsx` (`useBrandId`, `useBrand`, `setBrand`, observando o `data-brand` do `<html>`).
- `packages/ui/src/blocks/` (`@workspace/ui/blocks/*`): os templates `dashboard.tsx` (sidebar-08), `auth-layout.tsx`, `login.tsx` (login-02) e `signup.tsx` (signup-02), só com props (marca, navegação, conteúdo, imagem, `labels`), sem dados nem regra de negócio. Os arquivos que o `shadcn add` gerou foram portados e apagados; o `add` dos blocos sobrescreveu 13 primitivos e eles foram restaurados com `git checkout` (repita isso se rodar o `add` de um bloco de novo).
- `apps/storybook/src/docs/`: as páginas Introdução, Instalação, Componentes (visão geral), Componentes de IA (planejados marcados), Temas, Tipografia e Skills; `src/blocks/`: Blocks (visão geral, Dashboard, Login, Cadastro). A ordem da barra vem do `storySort` do `preview.tsx` com o `manager.ts` (`showRoots: false`). Os ids das páginas mantêm os acentos (`?path=/docs/introdução--docs`).
- `apps/web`: a demo usa os blocos com rotas por hash (`#/`, `#/login`, `#/cadastro`) e dados de exemplo em `src/data/`. O atalho de tema é Alt+Shift+D.
- `brand/`: o material da marca. O Storybook serve esta pasta na raiz (`staticDirs`), então os exemplos usam `src="brainz-group-logo.svg"`.

## Convenção de cada componente

- `packages/ui/src/components/<nome>.tsx`: o componente.
  - Começa com um comentário com o link da página do shadcn e as decisões tomadas.
  - Função comum: no React 19 o `ref` chega como prop, sem `forwardRef`.
  - Expõe `data-slot` e, quando tem variantes, os valores resolvidos (`data-variant`, `data-size`, `data-orientation`).
  - Paddings, margens e cantos lógicos (`ps`/`pe`, `ms`/`me`, `rounded-s`/`rounded-e`, `border-s`), para funcionar em RTL.
  - Nenhuma cor com opacidade (`bg-primary/80`, `bg-destructive/10`…) nos componentes revisados: os contrastes anotados nos tokens valem como estão. Exceção escolhida pelo usuário: o Button outline no escuro usa `dark:border-input dark:bg-input/30`, como no shadcn. Outras exceções anotadas: o véu `bg-black/30` de Dialog, AlertDialog, Sheet e Drawer a linha removida do CodeBlock (`bg-destructive/10`, sem papel cheio equivalente) e o brilho `shimmer` do título do Attachment enviando (faixa a 20%, decorativa; escolha do usuário em 2026-11-16).
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
  - Cobertura (painel de testes ou `vitest --coverage`): o `vite.config.ts` do Storybook mede `packages/ui/src` com `allowExternal: true`, porque a biblioteca fica fora da raiz do projeto; sem isso o relatório só mostrava o `preview.tsx`. Em 2026-11-15: 94,7% das instruções em 75 arquivos.
  - **Painel de testes do Storybook (2026-11-15):** com Interações, Cobertura e Acessibilidade ligados, a rodada inteira travava ou derrubava o servidor (`JavaScript heap out of memory`, 4 GB) perto do teste 200, embora os 544 passassem. A causa é o addon-vitest 10.6.7 (a versão mais nova): a cada 500 ms ele reenvia ao servidor o estado inteiro da rodada, com todos os relatórios do axe, duas vezes (`a11yReports` e `reports`). Correções:
    - `.storybook/a11y-reporter.ts`, ligado em `parameters.a11y.config.reporter`: relatório `v1` do axe com violações e "incomplete" inteiros, passes só com id, nome e link, e inaplicáveis vazios (eram 34 KB por story, quase tudo descrição de regra; ficaram ~7 KB). As regras e o resultado não mudam: uma `<img>` sem `alt` injetada continua dando `image-alt`;
    - `maxWorkers: 4` no projeto `storybook` do `vite.config.ts` (o padrão abria 11 páginas ao mesmo tempo);
    - não use o reporter `no-passes` do axe: ele tira o `incomplete` e a aba Accessibility quebra sem `passes`.
      Conferido: duas rodadas seguidas pelo painel, 544 passam, acessibilidade passa, cobertura 95%, servidor no máximo ~2 GB.
  - **CI** (2026-11-15, ainda não enviado): `.github/workflows/testes.yml` roda no GitHub Actions a cada push na `master` e a cada pull request: `npm ci`, o Chromium headless do Playwright, `typecheck`, `lint`, `test` (claro, escuro, RTL), `test:sesi` e `build`, no Node 26. As actions ficam fixas pelo SHA (checkout v7.0.1, setup-node v7.1.0). Não bloqueia o deploy do Vercel. Só passa a valer depois de um push; nunca rodou no GitHub.
  - **Desempenho do Storybook (2026-11-16):** uma investigação só de leitura (8 agentes, com verificação adversarial) mediu as trocas de story: Button ~0,6–0,8 s, Calendar ~1,9–2,2 s, Dashboard ~3,3–3,9 s. A causa principal é o manager: cada escrita na store re-renderiza o manager inteiro (~40–50 ms, porque o `ThemeProvider` recebe um tema novo a cada render), e o painel Interactions escreve 12–44 vezes por troca. Aplicado o único ganho sem custo: `server.warmup` das stories e MDX pelo `viteFinal` do `main.ts` (só no `storybook dev`, fora do Vitest), que tira ~0,6 s da primeira visita a cada arquivo. As trocas com custo (desligar o painel Interactions, axe manual na interface, plays pesados só nos testes, `delay: null` no userEvent) esperam o usuário (nota `decisoes-pendentes.md`);
  - **Formatação (2026-11-16, escolha do usuário):** `npm.cmd run format` e `format:check` rodam o Prettier em todo o repositório, menos o MDX (`.prettierignore`: o parser de MDX do Prettier é o do MDX 1 e pode quebrar as páginas MDX 3). O CI roda o `format:check` depois do lint. O `.gitattributes` (`* text=auto eol=lf`) deixa tudo em LF, como pede o `.prettierrc`, apesar do `core.autocrlf=true` do Windows. A formatação ficou num commit só dela, depois do commit das mudanças;
  - **Chromatic:** `@chromatic-com/storybook` 5.6.0 instalado com versão fixa e registrado no `main.ts` (painel "Visual tests"), sem `storybook add`. Ele só envia capturas ao chromatic.com depois de entrar com uma conta pelo painel; nenhuma conta foi configurada.
  - O item "Automatically document your components" do checklist do Storybook (tag `autodocs`) fica de fora de propósito: cada componente tem a própria MDX. Use "Skip".
  - `npm.cmd run test:sesi -w @workspace/storybook` roda a mesma bateria com a marca SESI no claro e no escuro (`--mode sesi` e `sesi-dark`). A barra do Storybook tem o seletor Marca, além de Modo e Direção.
- **Versões fixas**, sem `^`, `~` nem `latest`, em todos os `package.json`. O `.npmrc` tem `save-exact=true`. O `"@workspace/ui": "*"` é a referência do workspace e fica assim.
- O CLI do shadcn é o local (`packages/ui`, versão fixa). Depois de um `shadcn add`, confira se ele não voltou a escrever `^` no `package.json`.

## Tokens

- Ficam em `packages/ui/src/styles/globals.css`:
  - a camada de marca: as primitivas `--bb-primary-100` a `--bb-primary-900` (nove passos; sem 50 nem 950, decisão de 2026-11-16), `--bb-ink`, `--bb-gradient` e `--bb-font-sans` em `:root, :root[data-brand="brainz"]` e em um bloco `:root[data-brand="<id>"]` por marca. O `data-brand` fica no `<html>`, porque os papéis resolvem no `:root`;
  - **contrato de uma escala de marca** (o comentário do topo do `globals.css` lista todos): 600 com branco ≥4,5:1, 500 no branco ≥3:1, 400 na mist 950 e na 900 ≥3:1, 700 com branco ≥4,5:1, 300 na mist 950 ≥4,5:1, gráficos 500–900 no branco e 200–600 na mist 950 ≥3:1, e 800/100, 800/200, 100/900 e 100/800 ≥4,5:1 (o papel `secondary`); no escuro, a primária no card (mist 900) ≥3:1 com o texto dela ≥4,5:1. Marca nova só entra cumprindo o contrato; os componentes não mudam. Se a escala for oficial e não cumprir (o SESI), os passos ficam como a marca define e o bloco da marca sobrescreve os papéis que falham, apontando para passos que cumprem;
  - **marcas** (2026-11-15): `brainz` (padrão) e `sesi`. O SESI tem **uma cor só na interface, o verde** (correção do usuário em 2026-11-16): não tem tema secundário nem azul, porque o azul é de outra marca do Sistema Indústria (o azul do logo oficial fica só no logo). Desde 2026-11-16 o SESI usa os **tokens oficiais do SI Design System** (Figma abaixo): Primária 100–900 com os hex oficiais (500 = Pure `#52AE32`, 600 `#419128`, 700 `#356E21`; o 800 e o 900 oficiais são verde-azulados), neutros (`#262626`, `#646464`, `#DFDFDF`, `#F2F2F2`), vermelho Error 700/800 e Inter; o fundo da página é branco, como na Brainz (o Background/SESI/500 `#F9FFF9` do SI DS foi aplicado e removido a pedido do usuário em 2026-11-16). A escala oficial não cumpre o contrato (branco na 600 3,96:1; 500 no branco 2,82:1), então o bloco "SESI — papéis" do `globals.css` põe a ação primária e o link na 700 (hover 800) e os gráficos do claro em 600–900 + `#646464`; no claro (`:root[data-brand="sesi"]:not(.dark)`) também troca neutros, vermelho e campo. Decisões do usuário de 2026-11-16, mais fiéis ao SI DS: anel rosa, Highlights/600 `#CA588A` no claro (3,98:1 no fundo branco; o `#F673AD` oficial tem 2,6:1) e Highlights/300 `#FCC0DA` no escuro (12,9:1); borda do campo `#DFDFDF`, a oficial (1,33:1, aceita como o limite do campo da Brainz), com o campo branco; `--input` segue `#646464` (Button outline, Toggle, InputOTP); raio de 4px nos campos e nos botões (`--radius: 0.1389rem`), então o Card fica com ~5,8px; largura da borda inalterada. O SI DS não tem modo escuro: no escuro (`:root[data-brand="sesi"].dark` e `:root[data-brand="sesi"] .dark`, porque o preview do Storybook também põe `.dark` num wrapper) só a ação primária muda: a Pure (500) com texto mist 950 (7,0:1 de texto, 6,17:1 no card), porque a 700 com branco tem só 2,82:1 no card (Checkbox marcado, Switch ligado, dia do Calendar), achado do QA de 2026-11-16. Ficou de fora do SI DS: o branco na Pure (2,8:1), o rosa `#F673AD` (2,6:1) e as alturas de 40/56/80px (estrutura). Switch, Radio e Slider usam `rounded-full`, para a forma redonda não depender do raio da marca. Desde 2026-11-16 o logo e o símbolo também são os oficiais (`sesi-logo.tsx`, gerado dos componentes "Casa=SESI, Cor=Azul" `125:2168` e do favicon `11537:714` da página Marca do mesmo Figma, baixados pelo `download_assets` e conferidos por soma dos caminhos; os arquivos ficam em `brand/sesi-logo.svg` e `brand/sesi-simbolo.svg`), então o registro tem `illustrative: false` e a barra mostra só "SESI". O logo tem hex fixos: "SESI" em `#164194`, o ponto do "I" em `#52AE32` e a assinatura em `#575756`; no escuro vira a versão oficial Branco (`dark:fill-current`). O azul `#164194` existe só dentro do logo, como o `#305BA3` da Brainz: a interface do SESI continua com uma cor só. O símbolo é o favicon oficial (quadrado branco de cantos arredondados) e não muda no escuro. O `example-logo.tsx` fica como ponto de partida de uma marca nova. Não use branding da Adobe;
  - **o que uma marca pode mudar** (regra do usuário, 2026-11-16): só o visual, por tokens. Cores (inclusive o fundo do campo `--field`, a borda `--border`/`--input`, o anel e as superfícies), o raio (`--radius`), a fonte e, se a marca definir, larguras de borda e opacidades. Para isso o bloco da marca pode sobrescrever papéis semânticos, nos dois modos (`:root[data-brand="<id>"]:not(.dark)` no claro e `:root[data-brand="<id>"].dark, :root[data-brand="<id>"] .dark` no escuro: um `.dark` interno redeclara os papéis), com o contraste anotado. **Nunca** muda a estrutura: o markup e a API dos componentes, os tamanhos (campos e botões de 32px, a escala rhea), os espaçamentos, o layout e o comportamento de acessibilidade. Nenhum componente vira "componente do SESI": os componentes daqui só ficam com a aparência próxima da marca;
  - **fonte dos tokens do Sistema Indústria** (CNI, SESI, SENAI, IEL, Corporativo): o arquivo do Figma "❖ Design System Core (PetroSoft) – Atualização Geral – 26 Ago. 2025 (Copy)" (fileKey `i715SJzomHgaQvaWpfWip3`, enviado pelo usuário em 2026-11-16), lido pelo MCP do Figma: coleções `Biblioteca` (hex de `Colors/Brand/<marca>/100–900`, Neutral, Feedback, Highlights, Background e a escala numérica), `Colors` (apelidos Darkest…Lightest) e `Global Tokens` (raio, bordas, espaçamento, sombras, fonte); páginas Inputs e Buttons para o uso. Os valores batem com o texto do "SI Design System" no zeroheight (https://zeroheight.com/50e782a44, styleguide 77902), que só tem leitura pública (o MCP do zeroheight não está liberado; não tente contornar o acesso da API). O arquivo PENSE-SESI (`rVGgtpk3BhBYbn77KVndOp`) diverge no CNI (Pure `#0047B6`); vale o arquivo do SI DS. Nesse Figma há bibliotecas de outros clientes: use só as do SI DS;
  - papéis semânticos (`--primary`, `--foreground`…). É o que os componentes usam. Os neutros e o vermelho têm os `oklch` do tema mist escritos direto, como no shadcn; as cores de marca são `var(--bb-primary-*)`. Os componentes nunca usam a paleta direto.
- **Convenção do shadcn** (https://ui.shadcn.com/docs/theming):
  - cada superfície tem um par `<papel>` + `<papel>-foreground`, para o texto e os ícones sobre ela;
  - todos os tokens do tema padrão do shadcn existem aqui, com os mesmos nomes, no `:root`, no `.dark` e no `@theme inline`: `background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1` a `chart-5`, `sidebar-*` e `radius`, com a escala `radius-sm` a `radius-4xl`;
  - os tokens a mais da Big Brain seguem o "Adding New Tokens" do shadcn: valor no `:root` e no `.dark` e exposição no `@theme inline`. São `primary-hover`, `primary-pressed`, `secondary-hover`, `destructive-hover`, `destructive-foreground`, `link` e `link-hover`. Os estados de marca vêm da Primária (`primary-hover` 700 e `primary-pressed` 800 nos dois modos, porque a 500 com branco daria 3,5:1) e também o `secondary-hover` (Primária 200 no claro e 800 no escuro) e os do vermelho, do red do Tailwind. No escuro, `destructive-foreground` é a mist 950 (branco no red 400 daria 2,9:1) e `link` é a Primária 300 (10,2:1 no fundo);
  - `field-border` (2026-11-16): borda dos campos (`border-field-border` no Input, Textarea, Select, InputGroup, NativeSelect, Questionnaire e Combobox, no lugar do `border-transparent`). Transparente na Brainz Group nos dois modos, então nada muda nela; uma marca de campo contornado (SESI) troca só o valor. Foco (`border-ring`) e inválido (`border-destructive`) continuam por cima;
  - `field`: fundo dos campos, sem borda, como no rhea. Mist 200 no claro e mist 800 no escuro. A11Y: o limite do campo tem 1,25:1 no claro e 1,33:1 no escuro (1,17:1 num card), abaixo dos 3:1 de uma borda de campo: escolha do usuário. Placeholder 5,9:1 e 6,1:1. O registro usava `bg-input/50`;
  - só `border`, `input` e `sidebar-border` do escuro usam transparência (branco a 10% e 40%), como no shadcn. O Button outline no escuro usa `border-input` (40%, 3,8:1) e o preenchimento `bg-input/30`, como no tema padrão do shadcn, porque a borda a 10% ficava apagada (1,25:1).
- **`baseColor`:** `mist` nos dois `components.json`, igual à escala dos neutros. O CLI só usa esse campo no `init` e no `apply`.
- **Superfícies no escuro**, do fundo para cima: `background` na mist 950, depois `card`, `popover` e `sidebar` na 900, depois `muted`, `accent` e `sidebar-accent` na 800. No claro, o fundo e o card são brancos, e `muted` e `accent` ficam na mist 100.
- **Contrastes das cores de marca** (o axe só mede texto, então confira estes números à mão quando mudar algum valor):
  - `ring`: Primária 600 no claro desde 2026-11-16 (decisão do usuário: a 500 tinha só 2,81:1 no fundo do campo; agora 5,2:1 no branco, 4,2:1 no campo, 4,7:1 na muted; `sidebar-ring` 5,0:1 na sidebar) e 400 no escuro (7,6:1 no fundo, 6,7:1 no card). O anel tem a cor da primária no claro e só 2,0:1 contra ela no escuro; o afastamento de 2px pela cor do fundo os separa;
  - `secondary`: tom da própria Primária, 100 com texto 800 no claro (7,7:1; 6,3:1 no hover 200) e 900 com texto 100 no escuro (9,0:1; 7,7:1 no hover 800);
  - **cada marca tem uma cor só** (decisão do usuário em 2026-11-16): não existe escala Secundária. A de 2026-11-15 (`#305BA3` e passos derivados) foi uma leitura minha do pedido e saiu; o `#305BA3` fica só como fim do gradiente do logo da Brainz Group (no `--bb-gradient` e no `brainz-logo.tsx`);
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

- `.claude/launch.json` tem a configuração `big-brain-ui-storybook`, na porta **6007**, a única do Storybook. A 6006 não é mais usada (era a do projeto antigo).

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
  - a primeira rodada do vitest com cache frio pode falhar com "Vite unexpectedly reloaded" (otimização de dependências); rodar de novo resolve. O CI repete só a primeira rodada (claro) uma vez. Em 2026-11-16, duas rodadas com o cache frio (o do Vitest fica em `apps/storybook/node_modules/.cache/storybook/<versão>/<hash>/sb-vitest`, não no `.vite`) passaram, e o log `DEBUG=vite:deps` dizia "the scanner found every used dependency": sem recarga, então o `optimizeDeps.include` não foi preciso. A repetição do CI ficou como rede de segurança;
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
  - o `npm audit` aponta 17 avisos (2 baixos, 15 moderados), todos em ferramentas de desenvolvimento (ESLint, typescript-eslint, plugin do Storybook, CLI do shadcn), nenhum no que é publicado. O ESLint 10.15.0 corrige o dele; os demais esperam versões novas (o `npm audit fix --force` sugeria rebaixar o Storybook para a 8 e o shadcn para a 1). Nada foi mudado, a pedido do usuário;
  - o `./lib/*` do `exports` de `packages/ui` aponta para `.ts`, então o `highlighter.tsx` não é importável como `@workspace/ui/lib/highlighter` (o hook usa import relativo);
  - o afastamento do anel de foco usa a cor do fundo da página (`ring-offset-background`). Dentro de um card no escuro, ele é a mist 950 sobre um card 900, um pouco mais escuro que o card.
- **Fundação reutilizável (2026-11-15, sem commit):** blocos (Dashboard, Login, Cadastro), camada de marca com Brainz Group e SESI (cada um com uma cor só desde 2026-11-16) e as páginas Introdução, Instalação, Componentes, Componentes de IA, Blocks, Temas, Tipografia e Skills. Uma revisão adversarial (4 lentes, 2 votos por achado) confirmou 24 achados, todos corrigidos. Entre eles:
  - `apps/web` com `lang="pt-BR"`, foco no h1 depois de trocar de página e atalho de tema com modificadores;
  - Sidebar com `scroll-py-2` no `SidebarContent` (o anel não é cortado ao rolar), `label` no `SidebarTrigger` e `mobileTitle`/`mobileDescription` na `Sidebar`;
  - grupo do Dashboard que abre quando a página atual entra nele;
  - previews de Login e Cadastro em linha, seguindo Marca e Modo;
  - `typecheck` do `apps/web` com `-p tsconfig.app.json`;
  - o hover do link na `FieldDescription` passou para `text-link-hover` (a primária tinha 3,8:1 no escuro).
    Verificado: `typecheck`, `lint` e `build` limpos; 544 stories passam com axe no claro, no escuro, em RTL, no SESI e no SESI escuro; 178 links das MDX resolvem no `index.json`; barra lateral na ordem pedida.
- **Lacunas da fundação:**
  - SESI: cores, neutros, fonte, raio e logo oficiais (SI DS); o modo escuro é derivado. CNI, SENAI, IEL e Corporativo têm as escalas no mesmo Figma, mas não foram instalados (SENAI cumpre o contrato por passo; CNI, IEL e Corporativo precisariam sobrescrever papéis);
  - a story "Com imagem" do Login usa a `paleta-primaria.png` no lugar de uma imagem real;
  - não há papel semântico para o gradiente (`--bb-gradient` é primitiva);
  - Componentes de IA são só planejados;
  - o `build` do Storybook avisa de chunks grandes (só aviso);
  - leitor de tela não testado nos blocos;
  - o Dashboard não fecha o Sheet do celular ao navegar com um roteador de SPA (com `<a href>` a página recarrega): quem usa fecha com `setOpenMobile(false)`, como o `CloseMobileSidebarOnNavigate` do `apps/web` (documentado na MDX);
  - a story Demo do Dashboard mostra a grade neutra, sem h1 (o axe best-practice `page-has-heading-one`, fora da bateria de testes); a story "Com conteúdo" tem o h1.
- **QA de 2026-11-16 (sem commit):** 14 revisores só de leitura (componentes em 8 lotes, blocos/marca/web, páginas de docs, tokens e contraste, varredura das Docs a 320/640px, teclado nas Demos, tooling), cada achado conferido por 2 céticos independentes: 137 confirmados (7 altos), 10 divididos e 13 refutados. 129 foram corrigidos e 1 só documentado (o foco inicial do AlertDialog), por agentes agrupados por arquivo, com revisão do diff, e na sessão principal; 7 esperam o usuário (nota `decisoes-pendentes.md` da pasta compartilhada, com o relatório `relatorio-qa.md`). Entre as correções:
  - SESI escuro: primária na Pure (500) com texto mist 950 (a 700 tinha 2,82:1 no card);
  - ButtonGroup sem as regras `border-border` que apagavam a borda do campo no SESI e o vermelho do inválido;
  - ToggleGroup passa `orientation` ao Base UI; alvos de 20px da Sidebar com área de toque de 24px por pseudo-elemento; Sidebar `side="right"` em RTL sem cobrir a página (os lados explícitos continuam físicos);
  - `<html lang="pt-BR">` também nas páginas Docs sem story (o `preview.tsx` define no módulo e em `docs.lang`);
  - a 320px, a causa das páginas do DropdownMenu e do Questionnaire era o título h3 da API sem quebra (`QuestionnaireChoiceDescription`): o `docs.css` quebra os títulos da página em qualquer ponto; o fallback das tabelas cruas ficou `.sbdocs-content > table` e uma tabela que transborda vai num `ScrollTable` (região focável);
  - links dentro de descrições (AlertDialog, Alert, Accordion, Dialog, Marker, Empty, Field, Item) com o anel do projeto;
  - tooling: `engines.node` da raiz `^22.13.0 || ^24.0.0 || >=26.0.0` (a faixa que o Vitest 5, o ESLint 10 e o `cn` aceitam), `$TURBO_ROOT$/brand/**` nas entradas do build do Turbo, `packages/ui/tsconfig.lint.json` (sobra do template, sem uso) apagado, CI sem a variável de telemetria (o `main.ts` já desliga) e com a repetição da rodada clara;
  - depois das decisões do usuário (2026-11-16): `@turbo/gen` removido; o `tsconfig.json` da raiz (sobra do template, que nada estendia) apagado; `embla-carousel-autoplay` 8.6.0 instalado no Storybook para a story Plugins do Carousel (botão Pausar/Retomar antes dos slides, para no foco e no hover, começa parado com `prefers-reduced-motion`, `aria-live` off/polite, o `play` termina pausado); as 239 tabelas das MDX dentro do `ScrollTable`, que só vira região focável (role, nome e Tab) quando a tabela transborda; o Kbd dentro de um InputGroup usa `bg-muted` no claro e `bg-background` no escuro; o foco inicial do AlertDialog segue o shadcn (documentado).
  - axe (WCAG 2.2 AA e best-practice) nas 74 páginas Docs, Brainz e SESI, fora da bateria: nenhuma violação WCAG de verdade. O `target-size` dos botões de 20px da Sidebar é falso positivo (o axe mede a caixa, não o `::after` de 24px; conferido por clique a 1,5px fora, nos 4 lados). Os `landmark-*` e `heading-order` restantes vêm de várias stories inteiras numa página só (cada Dashboard tem o próprio `main`), não dos componentes. Nenhuma página rola na horizontal a 320 e 640px.
- Commitar só quando o usuário pedir. Cada push na `master` publica em produção no Vercel.
