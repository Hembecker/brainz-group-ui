# Big Brain UI

Tokens e componentes React da Big Brain (marca Brainz Group), num monorepo shadcn/ui. O projeto é independente dos produtos: nenhuma paleta de produto entra aqui.

O preset de referência do shadcn é o `b1avsYW9Y` (estilo `rhea`, mist + blue, raio small, Inter, RTL e cursor pointer). As cores são as da Brainz Group: neutros do tema mist, em `oklch`, e as cores de marca pela escala Primária. Não rode `shadcn apply`: ele sobrescreve os componentes e os tokens (veja o `CLAUDE.md`).

## Começar

No Windows (PowerShell), use `npm.cmd` e `npx.cmd`, porque a política de execução bloqueia os `.ps1`.

```bash
npm.cmd install
```

```bash
npm.cmd run storybook
```

O Storybook abre em http://localhost:6007. Na barra de ferramentas, o seletor **Marca** alterna entre Brainz Group e SESI, o seletor **Modo** alterna entre claro e escuro, e o seletor **Direção** alterna entre LTR e RTL.

Na raiz, os scripts rodam pelo Turbo em todos os workspaces:

| Script      | O que faz                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storybook` | Storybook em modo de desenvolvimento, na porta 6007                                                                                                            |
| `dev`       | `apps/web` e o Storybook juntos                                                                                                                                |
| `build`     | Build de `apps/web` e o Storybook estático (`apps/storybook/storybook-static/`)                                                                                |
| `typecheck` | `tsc --noEmit` em cada workspace                                                                                                                               |
| `lint`      | ESLint em cada workspace                                                                                                                                       |
| `format`    | Prettier em todo o repositório (menos o MDX), com a ordenação de classes do Tailwind; escreve nos arquivos                                                     |
| `test`      | Roda cada story como teste no Chromium (Vitest e Playwright), com o axe, três vezes: claro, escuro e RTL. Qualquer violação de acessibilidade reprova o teste. |

A marca SESI tem uma bateria à parte, fora do Turbo: `npm.cmd run test:sesi -w @workspace/storybook` roda as mesmas stories com o axe, com a marca SESI no claro e no escuro.

Na primeira vez, o Playwright precisa do Chromium. Se ele faltar, rode `npx.cmd playwright install chromium` (ou `npx` fora do PowerShell).

## Estrutura

```
brand/                         material da marca (paleta primária, logo)
packages/ui/                   @workspace/ui: componentes e tokens
  src/styles/globals.css       paleta --bb-*, papéis semânticos (claro e escuro) e Tailwind
  src/components/<nome>.tsx    componentes (estrutura plana, a do CLI do shadcn)
  src/blocks/                  templates Dashboard, Login e Cadastro, só com props
  src/brand/                   registro de marcas, logos e use-brand (useBrand, setBrand)
  src/hooks/                   hooks dos componentes (use-mobile, use-highlighted-code)
  src/lib/utils.ts             cn(): junta classes, e a última classe do Tailwind vence
apps/storybook/                @workspace/storybook: Storybook 10
  .storybook/                  configuração (marca, modo, direção, "Show code", axe)
  src/<nome>/                  stories (.stories.tsx) e página Docs (.mdx) de cada componente
  src/docs/                    páginas gerais (Introdução, Instalação, Temas, Tipografia…)
  src/blocks/                  páginas dos Blocks (visão geral, Dashboard, Login, Cadastro)
apps/web/                      demo dos blocos, com rotas por hash (#/, #/login, #/cadastro)
```

## Pilha

React 19.3.1, Vite 8, Tailwind 4, TypeScript 6, Turbo, `@base-ui/react`, class-variance-authority, lucide-react, `cn` e Storybook 10 (`@storybook/react-vite`, addon-docs com MDX, addon-a11y, addon-vitest). As versões ficam fixas em todos os `package.json`, e o `.npmrc` tem `save-exact=true`.

## Fontes da verdade

- **Estrutura e lógica:** cada componente segue a página dele no [shadcn/ui, versão Base UI](https://ui.shadcn.com/docs/components/base/button), com a mesma API e as mesmas seções de documentação. As cores e o contraste vêm dos nossos tokens.
- **Acessibilidade:** as regras do guia [shadcn/ui Accessibility](https://shadcnstudio.com/blog/making-your-website-accessible-with-shadcn-ui/). Cada página Docs tem uma seção **Acessibilidade** que aplica essas regras ao componente.

## Tokens

Ficam em `packages/ui/src/styles/globals.css`:

1. **Papéis semânticos** (`--primary`, `--foreground`, `--border`…). É o que os componentes usam. Os neutros têm os valores `oklch` do tema mist do shadcn; as cores de marca (primária, secundária, anel, link, gráficos) referenciam a paleta da marca. No Tailwind, eles viram classes como `bg-primary` e `text-foreground`. Todos os papéis do shadcn existem, e a Big Brain acrescenta os estados (`primary-hover`, `primary-pressed`, `secondary-hover`, `destructive-hover`), o `destructive-foreground`, o `link`, o `link-hover`, o `field` (fundo dos campos) e o `field-border` (borda dos campos, transparente na Brainz Group).
2. **Paleta da marca** (`--bb-primary-*` de 100 a 900, `--bb-ink`, `--bb-gradient`): os valores brutos. A ação primária usa a 600, e não a base 500, porque texto branco na 500 dá 3,5:1.

O modo escuro é ativado pela classe `.dark` num ancestral.

Os contrastes estão anotados no `globals.css`. Dois neutros do tema mist foram ajustados para passar nos mínimos de contraste (o texto suave do claro e a borda de campo) e estão marcados com **A11Y**.

### Provisório

Estes valores ainda não estão no material da marca e precisam ser confirmados:

- **Neutros:** os do tema mist do shadcn.
- **Vermelho de erro** (red 600 / red 400 do Tailwind).
- **Fonte:** Inter (`@fontsource-variable/inter`, a do preset).
- **Modo escuro inteiro.**
- **Cores de gráfico** (`--chart-*`): a escala Primária, uma faixa por modo.

## Componentes

A documentação completa de cada componente está na página Docs do Storybook.

```tsx
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { ButtonGroup, ButtonGroupSeparator } from "@workspace/ui/components/button-group"
import { Spinner } from "@workspace/ui/components/spinner"

<Button>Salvar</Button>
<Button variant="outline" size="sm"><PlusIcon data-icon="inline-start" aria-hidden="true" /> Novo</Button>
<Button size="icon" aria-label="Excluir fatura"><TrashIcon aria-hidden="true" /></Button>
<Button disabled><Spinner data-icon="inline-start" /> Salvando</Button>
<a href="/docs" className={buttonVariants()}>Ver documentação</a>

<ButtonGroup aria-label="Área de transferência">
  <Button variant="secondary">Copiar</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary">Colar</Button>
</ButtonGroup>
```

A biblioteca tem os 63 componentes do registro do shadcn (estilo `base-rhea`), instalados com `shadcn add --all` e revisados um a um: cores dos tokens da Big Brain (sem opacidade, exceto o véu de fundo dos diálogos, o outline do Button no escuro e a linha removida do CodeBlock), anel de foco sólido, textos fixos em português, contrastes anotados no comentário do topo de cada arquivo e uma página Docs com uma story por seção da página do shadcn.

- **Formulários:** Button, ButtonGroup, Input, InputGroup, InputOTP, Textarea, Label, Field, Checkbox, RadioGroup, Switch, Slider, Select, NativeSelect, Combobox, Toggle, ToggleGroup, Calendar e Questionnaire.
- **Sobreposições e menus:** Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Menubar, Command, NavigationMenu e Toast.
- **Exibição:** Card, Alert, Badge, Kbd, Avatar, AspectRatio, Skeleton, Spinner, Empty, Item, Table, Progress, Separator, ScrollArea, Resizable, Accordion, Collapsible, Tabs, Carousel e Chart.
- **Navegação e layout:** Breadcrumb, Pagination, Sidebar e Direction (o `DirectionProvider`).
- **Conversa e IA:** Message, MessageScroller, Bubble, Attachment, CodeBlock, Marker e Trace.

Pontos que valem para todos:

- **Escala:** controles com 32px (`h-8`) e cantos `rounded-2xl` (~13px), a escala do estilo rhea; o Button tem `xs` (24px), `sm` (28px), `default` (32px) e `lg` (36px).
- **Campos:** preenchidos, com o papel `field`; sem borda na Brainz Group, e com borda quando a marca define `--field-border` (o SESI define).
- **Ícones:** um ícone ao lado do rótulo leva `data-icon="inline-start"` ou `"inline-end"`; ícones decorativos levam `aria-hidden="true"`.
- **Links:** use `buttonVariants()` num `<a>` para um link com cara de botão.
- **Atributos:** cada parte expõe `data-slot`; os componentes com variantes expõem também `data-variant` e `data-size`.

Todos funcionam em RTL: paddings e cantos são lógicos e seguem o `dir` do ancestral.

### Adicionar um componente

Dentro de `packages/ui`, rode o CLI local do shadcn:

```bash
npx.cmd shadcn add <nome>
```

Depois, revise o componente (cores sem opacidade, anel de foco sólido, textos em português), fixe as versões que o CLI tiver escrito com `^` e crie as stories e a página MDX em `apps/storybook/src/<nome>/`, com o título "Em revisão/<Nome>" até a revisão terminar. As regras estão no `CLAUDE.md`.
