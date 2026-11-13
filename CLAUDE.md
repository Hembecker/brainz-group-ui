# Big Brain UI

Design System da Big Brain (marca Brainz Group), num monorepo shadcn/ui (Vite, Turbo e npm workspaces). É um projeto **independente** dos produtos: nenhuma paleta de produto (Sync Flow S1/S3/S5 etc.) entra aqui.

Criado com `npx shadcn@latest init --preset b1auh2PSq --template vite --monorepo --rtl --pointer`. Do preset ficaram só o RTL, a fonte Inter e o cursor pointer. As cores neutras frias, o raio de 0.45rem e o anel de foco a 30% foram trocados pelos tokens da Big Brain.

**Preset de referência: `b1avsYW9Y`** (desde 2026-11-13): estilo `rhea`, cor base `mist`, tema `blue`, raio `small`, Inter e lucide. Dele foram adotados à mão:
- os neutros: a escala `mist` do Tailwind 4 virou a `--bb-neutral-*`, com cada papel no mesmo degrau;
- o raio `small`: `--radius: 0.45rem`.

O tema `blue` do preset não entrou. A primária dele é o azul-700 genérico do Tailwind (`#1447E6`), e o anel dele é cinza, com 2,4:1, abaixo de 3:1. A primária e o anel continuam com o azul da marca.

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
  - neutros (hoje a escala `mist`);
  - vermelho de erro;
  - fonte (Inter, a do preset);
  - modo escuro inteiro;
  - cores de gráfico (`--chart-*`).

## Ritmo e escopo
- O usuário quer estruturar **com calma**, um componente por vez. Não adicione componentes nem estrutura sem pedido.
- **Componentes existentes:** Button, Spinner, ButtonGroup e Card. Spinner e ButtonGroup foram pedidos para compor o Button, como nas páginas do shadcn. O Card foi adicionado em 2026-11-13 com `shadcn add card -c apps/web`.
- Quando o CLI trouxer um componente de dependência que não foi pedido (o `button-group` traz o `separator`), use o primitivo do Base UI direto e apague o arquivo extra. Registre a decisão no comentário do componente.
- **Fora do escopo por enquanto:**
  - o `DirectionProvider` (`shadcn add direction`): os três componentes só precisam das classes lógicas;
  - exemplos que usam Input, Label, Select, Dropdown, Popover, Badge, ToggleGroup, Item ou Empty. Quando a página do shadcn só tem exemplos assim, adapte a mesma estrutura só com os componentes que existem e diga isso na MDX (veja o Card).

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
  - Nenhuma cor com opacidade (`bg-primary/80`, `bg-destructive/10`…): os contrastes anotados nos tokens valem como estão.
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
- Ficam em `packages/ui/src/styles/globals.css`, em **duas camadas**:
  - paleta `--bb-*`, com os valores brutos;
  - papéis semânticos (`--primary`, `--foreground`…), que são o que os componentes usam.
- Todos os papéis do shadcn existem (`card`, `popover`, `muted`, `input`, `chart-*`, `sidebar-*`), mapeados para a paleta com o contraste anotado. A Big Brain acrescenta `primary-hover`, `primary-pressed`, `secondary-hover`, `destructive-hover`, `destructive-foreground`, `link` e `link-hover`.
- Uma classe de cor sem papel definido não gera nada e não dá erro. Mapeie para um papel existente ou crie o papel nos dois modos, com o contraste anotado, e registre a classe no `@theme inline`.
- **Modo escuro:** só a classe `.dark` num ancestral, a mesma do preset, do `ThemeProvider` de `apps/web` e da variante `dark:`. O `data-mode` do projeto antigo não existe mais.
- **Ação primária:** usa a Primária **600** (`#2568D8`), não a base 500. Texto branco na 500 dá 3,5:1, abaixo de 4,5:1. Confira de novo os números quando mudar algum valor.
- **Raio:** `--radius: 0.45rem` (7,2px), o raio `small` do preset, que é o `rounded-lg` do Button e do ButtonGroup. O Card usa `rounded-xl` (× 1,4, ~10px).

## Windows
- No PowerShell, use `npm.cmd` e `npx.cmd`, porque a política de execução bloqueia os `.ps1`.
- Não rode instaladores interativos, como `npm create storybook` ou `storybook add`.
- O npm 11 não roda o `postinstall` do esbuild (aviso `allow-scripts`). O esbuild funciona assim mesmo.
- O cache global do npm desta máquina está corrompido (`ENOENT … Invalid response body`). Nas instalações, use um cache privado com `$env:npm_config_cache = '<pasta temporária>'` antes do `npm.cmd`. Não rode `npm cache clean --force` sem perguntar ao usuário.

## Storybook pelo app
- `.claude/launch.json` tem a configuração `big-brain-ui-storybook`, na porta **6007**. A 6006 fica para o Storybook do projeto antigo.

## Estado (2026-11-13)
- **Commit na `master`:** `beb27a0` (template do shadcn).
- **Histórico do projeto antigo:** a branch `legacy/design-system` tem os 4 commits dele (`07e12db` a `9e46818`). É só arquivo: não faça merge dela na `master`.
- **Não commitado:** a migração inteira do projeto antigo (tokens, versões fixas, Storybook, os três componentes com stories e MDX, este arquivo e o README).
- **Decisões da migração:**
  - stories e MDX em `apps/storybook`, componentes planos em `packages/ui`;
  - `separator.tsx` do registro apagado, porque o ButtonGroup usa o `Separator` do Base UI;
  - o `ButtonGroupSeparator` usa `bg-input`, como o shadcn (no projeto antigo era `bg-border`);
  - `--input` é a neutra 500, para a borda de campo ter 3:1;
  - `card`, `popover` e `sidebar` vêm dos neutros, e `chart-*` da escala da Primária;
  - os testes rodam três vezes por `--mode`;
  - Card: `rounded-xl` (~10px, maior que os 7,2px dos controles, para cantos concêntricos), contorno `ring-border` em vez de `ring-foreground/5`, recuo de 20px (sm 16px), título com um heading dentro.
- **Verificado:**
  - `typecheck`, `lint` e `build` (web e Storybook estático) limpos;
  - `npm.cmd run test`: 35 stories passam com axe no claro, no escuro e em RTL;
  - no navegador: as três páginas Docs nos dois modos e em RTL, as alturas de 24/32/36/40px, o raio (7,2px desde a troca para o preset `b1avsYW9Y`), o anel sólido por Tab (inclusive no primário no escuro), o "Show code" só com o JSX e a Inter carregada;
  - console limpo.
- **Ainda em aberto:**
  - leitor de tela e zoom a 200% não foram conferidos;
  - o `typecheck` de `apps/web` não confere nada (`tsconfig.json` com `files: []`, herdado do template);
  - o `npm audit` aponta 18 avisos (2 baixos, 16 moderados);
  - no escuro, `--muted` e `--card` são a mesma neutra 800, então uma área `bg-muted` dentro de um card não se destaca (o Card só a separa com borda). Rever quando o modo escuro for definido;
  - não há remoto configurado.
- Commitar só quando o usuário pedir.
