# Big Brain UI

Tokens e componentes React da Big Brain (marca Brainz Group), num monorepo shadcn/ui. O projeto é independente dos produtos: nenhuma paleta de produto entra aqui.

O preset de referência do shadcn é o `b1avsYW9Y` (estilo `rhea`, mist + blue, raio small, Inter, RTL e cursor pointer). Os tokens de cor são os do tema mist + blue, em `oklch`. Não rode `shadcn apply`: ele sobrescreve os componentes e os tokens (veja o `CLAUDE.md`).

## Começar

No Windows (PowerShell), use `npm.cmd` e `npx.cmd`, porque a política de execução bloqueia os `.ps1`.

```bash
npm.cmd install
```

```bash
npm.cmd run storybook
```

O Storybook abre em http://localhost:6007. Na barra de ferramentas, o seletor **Modo** alterna entre claro e escuro, e o seletor **Direção** alterna entre LTR e RTL.

Na raiz, os scripts rodam pelo Turbo em todos os workspaces:

| Script | O que faz |
| --- | --- |
| `storybook` | Storybook em modo de desenvolvimento, na porta 6007 |
| `dev` | `apps/web` e o Storybook juntos |
| `build` | Build de `apps/web` e o Storybook estático (`apps/storybook/storybook-static/`) |
| `typecheck` | `tsc --noEmit` em cada workspace |
| `lint` | ESLint em cada workspace |
| `test` | Roda cada story como teste no Chromium (Vitest e Playwright), com o axe, três vezes: claro, escuro e RTL. Qualquer violação de acessibilidade reprova o teste. |

Na primeira vez, o Playwright precisa do Chromium. Se ele faltar, rode `npx.cmd playwright install chromium` (ou `npx` fora do PowerShell).

## Estrutura

```
brand/                         material da marca (paleta primária, logo)
packages/ui/                   @workspace/ui: componentes e tokens
  src/styles/globals.css       paleta --bb-*, papéis semânticos (claro e escuro) e Tailwind
  src/components/<nome>.tsx    componentes (estrutura plana, a do CLI do shadcn)
  src/lib/utils.ts             cn(): junta classes, e a última classe do Tailwind vence
apps/storybook/                @workspace/storybook: Storybook 10
  .storybook/                  configuração (modo, direção, "Show code", axe)
  src/<nome>/                  stories (.stories.tsx) e página Docs (.mdx) de cada componente
apps/web/                      app de exemplo do template
```

## Pilha

React 19.3.1, Vite 8, Tailwind 4, TypeScript 6, Turbo, `@base-ui/react`, class-variance-authority, lucide-react, `cn` e Storybook 10 (`@storybook/react-vite`, addon-docs com MDX, addon-a11y, addon-vitest). As versões ficam fixas em todos os `package.json`, e o `.npmrc` tem `save-exact=true`.

## Fontes da verdade

- **Estrutura e lógica:** cada componente segue a página dele no [shadcn/ui, versão Base UI](https://ui.shadcn.com/docs/components/base/button), com a mesma API e as mesmas seções de documentação. As cores e o contraste vêm dos nossos tokens.
- **Acessibilidade:** as regras do guia [shadcn/ui Accessibility](https://shadcnstudio.com/blog/making-your-website-accessible-with-shadcn-ui/). Cada página Docs tem uma seção **Acessibilidade** que aplica essas regras ao componente.

## Tokens

Ficam em `packages/ui/src/styles/globals.css`:

1. **Papéis semânticos** (`--primary`, `--foreground`, `--border`…), com os valores `oklch` do tema mist + blue do shadcn. É o que os componentes usam. No Tailwind, eles viram classes como `bg-primary` e `text-foreground`. Todos os papéis do shadcn existem, e a Big Brain acrescenta os estados (`primary-hover`, `primary-pressed`, `secondary-hover`, `destructive-hover`), o `destructive-foreground` e o `link`.
2. **Paleta da marca** (`--bb-primary-*`, `--bb-ink`): fica só como referência. Nenhum papel a usa hoje.

O modo escuro é ativado pela classe `.dark` num ancestral.

Os contrastes estão anotados no `globals.css`. Alguns valores do tema ficam abaixo dos mínimos (o anel de foco no claro, por exemplo, tem 2,4:1) e estão marcados com **A11Y** para serem corrigidos.

### Provisório

Estes valores ainda não estão no material da marca e precisam ser confirmados:

- **Cores:** o tema mist + blue do shadcn, no lugar do azul da marca.
- **Vermelho de erro** (red 600 / red 400 do Tailwind).
- **Fonte:** Inter (`@fontsource-variable/inter`, a do preset).
- **Modo escuro inteiro.**
- **Cores de gráfico** (`--chart-*`): a escala blue do Tailwind.

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

- **Button:** construído sobre o Button do Base UI.
  - **Variantes:** `default`, `outline`, `secondary`, `ghost`, `destructive` e `link`.
  - **Tamanhos:** `xs` (24px), `sm` (32px), `default` (36px) e `lg` (40px), mais os quadrados `icon-*`. Raio de 7,2px (0.45rem).
  - **Ícones:** um ícone ao lado do rótulo leva `data-icon="inline-start"` ou `"inline-end"`.
  - **Carregamento:** coloque um `Spinner` dentro de um botão `disabled`. Com `focusableWhenDisabled`, o botão continua focável.
  - **Links:** use `buttonVariants()` num `<a>`.
  - **Atributos:** o elemento expõe `data-slot`, `data-variant` e `data-size`.
- **Spinner:** um indicador de carregamento com `role="status"` e o rótulo "Carregando". Fica parado com movimento reduzido.
- **ButtonGroup:** agrupa botões (`role="group"`) na horizontal ou na vertical. Tem também `ButtonGroupSeparator` e `ButtonGroupText`.
- **Card:** cabeçalho (`CardTitle`, `CardDescription`, `CardAction`), `CardContent` e `CardFooter`. Tem `size="sm"` e a variável `--card-spacing`. Raio de ~10px (`rounded-xl`). Coloque um heading dentro do `CardTitle`.

Todos funcionam em RTL: paddings e cantos são lógicos e seguem o `dir` do ancestral.

### Adicionar um componente

Dentro de `packages/ui`, rode o CLI local do shadcn:

```bash
npx.cmd shadcn add <nome>
```

Depois, troque as cores e os tamanhos do preset pelos tokens da Big Brain, fixe as versões que o CLI tiver escrito com `^` e crie as stories e a página MDX em `apps/storybook/src/<nome>/`. As regras estão no `CLAUDE.md`.
