import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  ArrowUpRightIcon,
  BrainIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderSearchIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  GlobeIcon,
  LoaderCircleIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@workspace/ui/components/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@workspace/ui/components/trace"

/*
 * One story per section of trace.mdx, in the order of the shadcn/ui page. The
 * page has no RTL section, and its "Built with Trace" table links to AI
 * Elements patterns that do not exist here, so neither has a story.
 *
 * The shadcn demo, "Reasoning" and "Tool" examples stream a fake chat through
 * the AI SDK (`useChat`), which is not a dependency here. They are rebuilt
 * with plain local state: same rows, same open/closed logic, no streaming.
 *
 * Every Trace gets a name (`role="group"` + `aria-label`): the component is a
 * plain `div`, not a real list (see the comment at the top of trace.tsx).
 * Links point to the page itself (`#...`) or to public docs; nothing is loaded.
 *
 * A closed row is invisible to axe, so the stories with detail open it in
 * `render` (`defaultOpen`) or in `play`. `esperarAnimacoes` waits for the
 * height transition to end before axe runs. Dialog and Sheet are portaled, so
 * they are queried with `screen`.
 */
const meta = {
  title: "Componentes/Trace",
  component: Trace,
} satisfies Meta<typeof Trace>

export default meta
type Story = StoryObj<typeof meta>

// Waits for the transitions to end. The CodeBlock's scroll-driven fade
// (`animation-timeline: scroll()`) and the spinner/shimmer loops never finish,
// so only finite animations on the document timeline are awaited.
async function esperarAnimacoes() {
  await Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.timeline instanceof DocumentTimeline &&
          animation.effect?.getComputedTiming().iterations !== Infinity
      )
      .map((animation) => animation.finished)
  )
}

// Clicks a collapsible trigger and checks aria-expanded, the panel and the
// animation. `nome` is a regex because a running or failed line also carries
// a hidden status text after the title.
async function abrirLinha(canvasElement: HTMLElement, nome: RegExp) {
  const canvas = within(canvasElement)
  const gatilho = await canvas.findByRole("button", { name: nome })
  if (gatilho.getAttribute("aria-expanded") !== "true") {
    await userEvent.click(gatilho)
  }
  await waitFor(() => expect(gatilho).toHaveAttribute("aria-expanded", "true"))
  await esperarAnimacoes()
  return gatilho
}

async function abrirSobreposicao(
  canvasElement: HTMLElement,
  gatilho: RegExp,
  titulo: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const painel = await screen.findByRole("dialog", { name: titulo })
  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  )
  await esperarAnimacoes()
  await waitFor(() => expect(painel).toBeVisible())
  return painel
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pensamento = await canvas.findByRole("button", { name: /^Pensou/ })

    // Starts closed: a button with aria-expanded="false".
    await expect(pensamento).toHaveAttribute("aria-expanded", "false")
    await expect(
      canvas.queryByText(/Preciso conferir o que o último commit mudou/)
    ).toBeNull()

    // Keyboard: Tab reaches the first row; Enter opens and Space closes it.
    await userEvent.tab()
    await expect(pensamento).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(pensamento).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
    await expect(
      canvas.getByText(/Preciso conferir o que o último commit mudou/)
    ).toBeVisible()
    await userEvent.keyboard(" ")
    await expect(pensamento).toHaveAttribute("aria-expanded", "false")

    // Opens again and stays open, for axe.
    await userEvent.keyboard("{Enter}")
    await expect(pensamento).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
  },
  render: () => (
    <div className="w-full max-w-sm">
      <Trace role="group" aria-label="Etapas da investigação">
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <BrainIcon />
              </TraceIcon>
              <TraceTitle>Pensou</TraceTitle>
              <TraceDescription>5s</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent className="whitespace-pre-wrap">
            O CI instala com o lockfile congelado, então a instalação para
            quando o package.json e o pnpm-lock.yaml divergem. Preciso conferir
            o que o último commit mudou e reproduzir a instalação.
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>Executou git diff --stat HEAD~1</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {" package.json | 2 +-\n 1 file changed, 1 insertion(+)"}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <CircleAlertIcon />
              </TraceIcon>
              <TraceTitle>
                Falhou ao executar pnpm install --frozen-lockfile
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" className="text-destructive-hover">
              <CodeBlockContent wrap className="max-h-64">
                ERR_PNPM_OUTDATED_LOCKFILE o pnpm-lock.yaml não está atualizado
                em relação ao package.json
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <a
          href="https://pnpm.io/cli/install"
          target="_blank"
          rel="noreferrer"
        >
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>
              pnpm install | pnpm.io
              <span className="sr-only"> (abre em uma nova aba)</span>
            </TraceTitle>
            <TraceIcon>
              <ArrowUpRightIcon className="rtl:-scale-x-100" />
            </TraceIcon>
          </TraceLine>
        </a>
      </Trace>
    </div>
  ),
}

export const Linha: Story = {
  render: () => (
    <Trace
      role="group"
      aria-label="Etapa concluída"
      className="max-w-sm"
    >
      <TraceLine>
        <TraceIcon>
          <GitBranchIcon />
        </TraceIcon>
        <TraceTitle>Criou a branch fix/frozen-lockfile</TraceTitle>
      </TraceLine>
    </Trace>
  ),
}

export const Status: Story = {
  render: () => (
    <Trace
      role="group"
      aria-label="Estados das etapas"
      className="max-w-sm"
    >
      <TraceLine>
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Executou pnpm install</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <CircleAlertIcon />
        </TraceIcon>
        <TraceTitle>Falhou ao executar pnpm lint</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
        </TraceIcon>
        <TraceTitle>Executando pnpm build</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <CircleIcon />
        </TraceIcon>
        <TraceTitle>Executar pnpm test</TraceTitle>
      </TraceLine>
    </Trace>
  ),
}

export const Descricao: Story = {
  name: "Descrição",
  render: () => (
    <Trace
      role="group"
      aria-label="Etapas com detalhes"
      className="max-w-sm"
    >
      <TraceLine>
        <TraceIcon>
          <FilePenIcon />
        </TraceIcon>
        <TraceTitle>
          Editou components/settings/notification-preferences-form.tsx
        </TraceTitle>
        <TraceDescription className="font-mono">+48 −12</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Executou pnpm test</TraceTitle>
        <TraceDescription>14s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Pesquisou por useChat</TraceTitle>
        <TraceDescription>8 resultados</TraceDescription>
      </TraceLine>
    </Trace>
  ),
}

export const Recolhivel: Story = {
  name: "Recolhível",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Executou node --version",
    })

    // Starts closed; the panel is not rendered.
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByText(/v24\.18\.0/)).toBeNull()

    // Opens with the keyboard; the panel is the controlled element.
    await userEvent.tab()
    await expect(gatilho).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
    const painel = canvasElement.querySelector(
      `#${CSS.escape(gatilho.getAttribute("aria-controls") ?? "")}`
    )
    await expect(painel).not.toBeNull()
    await expect(canvas.getByText(/v24\.18\.0/)).toBeVisible()
  },
  render: () => (
    <div className="w-full max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Executou node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ node --version\nv24.18.0"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  ),
}

function EstadoAbertoExemplo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Executou node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ node --version\nv24.18.0"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible open={open} onOpenChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Executou pnpm --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ pnpm --version\n10.33.4"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        {open ? "Ocultar" : "Mostrar"} a saída do pnpm
      </Button>
    </div>
  )
}

export const EstadoAberto: Story = {
  name: "Estado aberto",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Executou node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ node --version\\nv24.18.0"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible open={open} onOpenChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Executou pnpm --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ pnpm --version\\n10.33.4"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        {open ? "Ocultar" : "Mostrar"} a saída do pnpm
      </Button>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primeira = canvas.getByRole("button", {
      name: "Executou node --version",
    })
    const segunda = canvas.getByRole("button", {
      name: "Executou pnpm --version",
    })

    // `defaultOpen` starts open; the controlled row starts closed.
    await expect(primeira).toHaveAttribute("aria-expanded", "true")
    await expect(segunda).toHaveAttribute("aria-expanded", "false")

    // The external button controls the second row.
    const botao = canvas.getByRole("button", {
      name: "Mostrar a saída do pnpm",
    })
    await userEvent.click(botao)
    await expect(segunda).toHaveAttribute("aria-expanded", "true")
    await expect(
      canvas.getByRole("button", { name: "Ocultar a saída do pnpm" })
    ).toBeVisible()
    await esperarAnimacoes()
  },
  render: () => <EstadoAbertoExemplo />,
}

export const Link: Story = {
  render: () => (
    <Trace role="group" aria-label="Fontes consultadas" className="max-w-sm">
      <a href="#link">
        <TraceLine>
          <TraceIcon>
            <FileTextIcon />
          </TraceIcon>
          <TraceTitle>Leu apps/v4/lib/docs.ts</TraceTitle>
          <TraceIcon>
            <ChevronRightIcon className="rtl:rotate-180" />
          </TraceIcon>
        </TraceLine>
      </a>
      <a
        href="https://docs.astro.build/en/install-and-setup/"
        target="_blank"
        rel="noreferrer"
      >
        <TraceLine>
          <TraceIcon>
            <GlobeIcon />
          </TraceIcon>
          <TraceTitle>
            Instalar o Astro | docs.astro.build
            <span className="sr-only"> (abre em uma nova aba)</span>
          </TraceTitle>
          <TraceIcon>
            <ArrowUpRightIcon className="rtl:-scale-x-100" />
          </TraceIcon>
        </TraceLine>
      </a>
    </Trace>
  ),
}

export const DialogoComTrace: Story = {
  name: "Dialog",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Pesquisou na web por chaves de cache",
    })
    const dialogo = await abrirSobreposicao(
      canvasElement,
      /^Pesquisou na web por chaves de cache/,
      "Pesquisou na web por chaves de cache"
    )

    // Esc closes it and gives the focus back to the trigger line.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())
    await expect(dialogo).not.toBeInTheDocument()

    // Opens again and stays open, for axe.
    await abrirSobreposicao(
      canvasElement,
      /^Pesquisou na web por chaves de cache/,
      "Pesquisou na web por chaves de cache"
    )
  },
  render: () => (
    <Trace role="group" aria-label="Pesquisas" className="max-w-sm">
      <Dialog>
        <DialogTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Pesquisou na web por chaves de cache</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon className="rtl:rotate-180" />
            </TraceIcon>
          </TraceLine>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pesquisou na web por chaves de cache</DialogTitle>
            <DialogDescription>
              Três resultados foram usados na resposta.
            </DialogDescription>
          </DialogHeader>
          <Trace role="group" aria-label="Resultados da pesquisa">
            <a
              href="https://nextjs.org/docs/app/guides/caching"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  Cache de saídas de build
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon className="rtl:-scale-x-100" />
                </TraceIcon>
              </TraceLine>
            </a>
            <a
              href="https://nextjs.org/docs/app/api-reference/components/image"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  Referência de otimização de imagens
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon className="rtl:-scale-x-100" />
                </TraceIcon>
              </TraceLine>
            </a>
            <a
              href="https://vercel.com/docs/deploy-hooks"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  Deploy hooks e chaves de cache
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon className="rtl:-scale-x-100" />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </DialogContent>
      </Dialog>
    </Trace>
  ),
}

export const PainelLateral: Story = {
  name: "Sheet",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Explorou 4 arquivos",
    })
    await abrirSobreposicao(
      canvasElement,
      /^Explorou 4 arquivos/,
      "Explorou 4 arquivos"
    )

    // Esc closes it and gives the focus back to the trigger line.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirSobreposicao(
      canvasElement,
      /^Explorou 4 arquivos/,
      "Explorou 4 arquivos"
    )
  },
  render: () => (
    <Trace role="group" aria-label="Exploração" className="max-w-sm">
      <Sheet>
        <SheetTrigger>
          <TraceLine>
            <TraceIcon>
              <FolderSearchIcon />
            </TraceIcon>
            <TraceTitle>Explorou 4 arquivos</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon className="rtl:rotate-180" />
            </TraceIcon>
          </TraceLine>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Explorou 4 arquivos</SheetTitle>
            <SheetDescription>
              Arquivos lidos ao preparar a resposta.
            </SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-2 px-6 font-mono text-xs">
            <li>apps/v4/lib/docs.ts</li>
            <li>apps/v4/lib/components.ts</li>
            <li>apps/v4/next.config.mjs</li>
            <li>apps/v4/package.json</li>
          </ul>
        </SheetContent>
      </Sheet>
    </Trace>
  ),
}

export const Grupo: Story = {
  render: () => (
    <Trace role="group" aria-label="Etapas seguidas" className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Pesquisou por minimumReleaseAge</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <FileTextIcon />
        </TraceIcon>
        <TraceTitle>Leu pnpm-workspace.yaml</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Executou pnpm install</TraceTitle>
      </TraceLine>
    </Trace>
  ),
}

export const Fontes: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Usou 3 fontes</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace role="group" aria-label="Fontes usadas">
            <a
              href="https://docs.astro.build/en/install-and-setup/"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  Instalar o Astro | docs.astro.build
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon className="rtl:-scale-x-100" />
                </TraceIcon>
              </TraceLine>
            </a>
            <a
              href="https://www.npmjs.com/package/create-astro"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  create-astro | npmjs.com
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon className="rtl:-scale-x-100" />
                </TraceIcon>
              </TraceLine>
            </a>
            <a
              href="https://pnpm.io/settings#minimumreleaseage"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  Configurações: minimumReleaseAge | pnpm.io
                  <span className="sr-only"> (abre em uma nova aba)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon className="rtl:-scale-x-100" />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  ),
}

export const CadeiaDePensamento: Story = {
  name: "Cadeia de pensamento",
  play: async ({ canvasElement }) => {
    // The inner rows are closed; open the first one and keep it open.
    await abrirLinha(canvasElement, /^Pesquisou pelo log de build do checkout/)
  },
  render: () => (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceTitle>Investigando o deploy lento</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace role="group" aria-label="Passos da investigação">
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <SearchIcon />
                  </TraceIcon>
                  <TraceTitle>Pesquisou pelo log de build do checkout</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">vercel.com</Badge>
                <Badge variant="secondary">github.com</Badge>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <a href="#passos">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Leu os últimos doze deploys</TraceTitle>
                <TraceIcon>
                  <ChevronRightIcon className="rtl:rotate-180" />
                </TraceIcon>
              </TraceLine>
            </a>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine status="running">
                  <TraceIcon>
                    <SearchIcon />
                  </TraceIcon>
                  <TraceTitle>Pesquisando a chave de cache</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    chave de cache otimização de imagens
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  ),
}

export const Commit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The commit row is open; open the diff of the first file in a Sheet.
    const gatilho = await canvas.findByRole("button", {
      name: /^Editou app\/login\/page\.tsx/,
    })
    await abrirSobreposicao(
      canvasElement,
      /^Editou app\/login\/page\.tsx/,
      "app/login/page.tsx"
    )

    // Esc closes it and gives the focus back to the file line.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirSobreposicao(
      canvasElement,
      /^Editou app\/login\/page\.tsx/,
      "app/login/page.tsx"
    )
  },
  render: () => (
    <Trace role="group" aria-label="Commits" className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>Fez o commit a1b2c3: Corrige o redirecionamento do login</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace role="group" aria-label="Arquivos do commit">
            <Sheet>
              <SheetTrigger>
                <TraceLine>
                  <TraceIcon>
                    <FilePenIcon />
                  </TraceIcon>
                  <TraceTitle>Editou app/login/page.tsx</TraceTitle>
                  <TraceDescription className="font-mono">
                    +2 −2
                  </TraceDescription>
                  <TraceIcon>
                    <ChevronRightIcon className="rtl:rotate-180" />
                  </TraceIcon>
                </TraceLine>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-mono">
                    app/login/page.tsx
                  </SheetTitle>
                  <SheetDescription>2 adições, 2 remoções</SheetDescription>
                </SheetHeader>
                <CodeBlock className="mx-6 mb-6 w-auto">
                  <CodeBlockContent>
                    <CodeBlockLine className="text-muted-foreground">
                      {"@@ -14,7 +14,7 @@ export default async function LoginPage({"}
                    </CodeBlockLine>
                    <CodeBlockLine>{"  const { next } = await searchParams"}</CodeBlockLine>
                    <CodeBlockLine variant="removed">
                      {"  const redirectTo ="}
                    </CodeBlockLine>
                    <CodeBlockLine variant="removed">
                      {'    next && next.startsWith("/") ? next : "/"'}
                    </CodeBlockLine>
                    <CodeBlockLine variant="added">
                      {"  const redirectTo = safeRedirect(next)"}
                    </CodeBlockLine>
                    <CodeBlockLine variant="added">{""}</CodeBlockLine>
                    <CodeBlockLine>
                      {"  return <LoginForm redirectTo={redirectTo} />"}
                    </CodeBlockLine>
                  </CodeBlockContent>
                </CodeBlock>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger>
                <TraceLine>
                  <TraceIcon>
                    <FilePlusIcon />
                  </TraceIcon>
                  <TraceTitle>Adicionou lib/auth/redirect.ts</TraceTitle>
                  <TraceDescription className="font-mono">
                    +7 −0
                  </TraceDescription>
                  <TraceIcon>
                    <ChevronRightIcon className="rtl:rotate-180" />
                  </TraceIcon>
                </TraceLine>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-mono">
                    lib/auth/redirect.ts
                  </SheetTitle>
                  <SheetDescription>7 adições, 0 remoções</SheetDescription>
                </SheetHeader>
                <CodeBlock className="mx-6 mb-6 w-auto">
                  <CodeBlockContent>
                    <CodeBlockLine variant="added">
                      {"export function safeRedirect(next: string | undefined) {"}
                    </CodeBlockLine>
                    <CodeBlockLine variant="added">
                      {'  if (!next || !next.startsWith("/") || next.startsWith("//")) {'}
                    </CodeBlockLine>
                    <CodeBlockLine variant="added">
                      {'    return "/"'}
                    </CodeBlockLine>
                    <CodeBlockLine variant="added">{"  }"}</CodeBlockLine>
                    <CodeBlockLine variant="added">{""}</CodeBlockLine>
                    <CodeBlockLine variant="added">{"  return next"}</CodeBlockLine>
                    <CodeBlockLine variant="added">{"}"}</CodeBlockLine>
                  </CodeBlockContent>
                </CodeBlock>
              </SheetContent>
            </Sheet>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  ),
}

export const TurnoCompleto: Story = {
  name: "Turno completo",
  render: () => (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceTitle>Trabalhou por 2m 4s, 1 comando falhou</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted className="flex flex-col gap-2">
          <Trace role="group" aria-label="Etapas do turno">
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <BrainIcon />
                  </TraceIcon>
                  <TraceTitle>Pensou</TraceTitle>
                  <TraceDescription>12s</TraceDescription>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="whitespace-pre-wrap">
                Preciso conferir quais gerenciadores de pacotes estão instalados
                antes de criar qualquer coisa.
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <TerminalIcon />
                  </TraceIcon>
                  <TraceTitle>Executou 2 comandos, 1 falhou</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent keepMounted>
                <Trace role="group" aria-label="Comandos executados">
                  <TraceLine>
                    <TraceIcon>
                      <TerminalIcon />
                    </TraceIcon>
                    <TraceTitle>Executou node --version</TraceTitle>
                  </TraceLine>
                  <TraceCollapsible defaultOpen>
                    <TraceCollapsibleTrigger>
                      <TraceLine status="error">
                        <TraceIcon>
                          <TerminalIcon />
                        </TraceIcon>
                        <TraceTitle>Falhou ao executar pnpm --version</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm" className="text-destructive-hover">
                        <CodeBlockContent wrap className="max-h-64">
                          comando não encontrado: pnpm
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p className="text-sm">
            O Node está instalado e o pnpm não. Lendo a configuração da
            documentação.
          </p>
          <Trace role="group" aria-label="Leituras">
            <a href="#turno">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Leu apps/v4/lib/docs.ts</TraceTitle>
                <TraceIcon>
                  <ChevronRightIcon className="rtl:rotate-180" />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  ),
}

function LinhaDeRaciocinio({
  texto,
  executando,
}: {
  texto: string
  executando: boolean
}) {
  const [open, setOpen] = React.useState<boolean>()

  const linha = (
    <TraceLine status={executando ? "running" : undefined}>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>{executando ? "Pensando" : "Pensou"}</TraceTitle>
    </TraceLine>
  )

  if (texto.length === 0) {
    return linha
  }

  return (
    <TraceCollapsible open={open ?? executando} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>{linha}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {texto}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export const Raciocinio: Story = {
  name: "Raciocínio",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

function LinhaDeRaciocinio({
  texto,
  executando,
}: {
  texto: string
  executando: boolean
}) {
  const [open, setOpen] = React.useState<boolean>()

  const linha = (
    <TraceLine status={executando ? "running" : undefined}>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>{executando ? "Pensando" : "Pensou"}</TraceTitle>
    </TraceLine>
  )

  if (texto.length === 0) {
    return linha
  }

  return (
    <TraceCollapsible open={open ?? executando} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>{linha}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {texto}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function Exemplo() {
  return (
    <Trace role="group" aria-label="Raciocínio" className="max-w-sm">
      <LinhaDeRaciocinio texto="" executando />
      <LinhaDeRaciocinio
        texto="O log mostra que a instalação e a compilação terminam em menos de um minuto."
        executando
      />
      <LinhaDeRaciocinio
        texto="A otimização de imagens leva quase quatro minutos e roda a cada deploy, porque a chave de cache inclui o hash do commit."
        executando={false}
      />
    </Trace>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Row with text and running: starts open (open ?? executando).
    const emAndamento = canvas.getByRole("button", { name: /^Pensando/ })
    await expect(emAndamento).toHaveAttribute("aria-expanded", "true")
    // The state is also text: the hidden label follows the title.
    await expect(emAndamento).toHaveAccessibleName("Pensando (em andamento)")

    // Row already done: starts closed; the reader's click wins.
    const concluida = canvas.getByRole("button", { name: "Pensou" })
    await expect(concluida).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(concluida)
    await expect(concluida).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
  },
  render: () => (
    <Trace role="group" aria-label="Raciocínio" className="max-w-sm">
      <LinhaDeRaciocinio texto="" executando />
      <LinhaDeRaciocinio
        texto="O log mostra que a instalação e a compilação terminam em menos de um minuto."
        executando
      />
      <LinhaDeRaciocinio
        texto="A otimização de imagens leva quase quatro minutos e roda a cada deploy, porque a chave de cache inclui o hash do commit."
        executando={false}
      />
    </Trace>
  ),
}

function LinhaDeFerramenta({
  comando,
  saida,
  estado,
}: {
  comando: string
  saida?: string
  estado: "executando" | "concluido" | "erro" | "negado"
}) {
  const linha = (
    <TraceLine
      status={
        estado === "executando"
          ? "running"
          : estado === "erro"
            ? "error"
            : undefined
      }
    >
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {estado === "executando"
          ? "Executando"
          : estado === "negado"
            ? "Negou"
            : estado === "erro"
              ? "Falhou ao executar"
              : "Executou"}{" "}
        {comando}
      </TraceTitle>
    </TraceLine>
  )

  // Sem saída (executando ou negado), a linha é só texto.
  if (estado === "executando" || estado === "negado") {
    return linha
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{linha}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-64">
            {saida}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export const Ferramentas: Story = {
  parameters: {
    docs: {
      source: {
        code: `function LinhaDeFerramenta({
  comando,
  saida,
  estado,
}: {
  comando: string
  saida?: string
  estado: "executando" | "concluido" | "erro" | "negado"
}) {
  const linha = (
    <TraceLine
      status={
        estado === "executando" ? "running" : estado === "erro" ? "error" : undefined
      }
    >
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {estado === "executando"
          ? "Executando"
          : estado === "negado"
            ? "Negou"
            : estado === "erro"
              ? "Falhou ao executar"
              : "Executou"}{" "}
        {comando}
      </TraceTitle>
    </TraceLine>
  )

  // Sem saída (executando ou negado), a linha é só texto.
  if (estado === "executando" || estado === "negado") {
    return linha
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{linha}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-64">
            {saida}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function Exemplo() {
  return (
    <Trace role="group" aria-label="Comandos executados" className="max-w-sm">
      <LinhaDeFerramenta comando="node --version" estado="concluido" saida="v24.18.0" />
      <LinhaDeFerramenta comando="npm --version" estado="concluido" saida="11.6.2" />
      <LinhaDeFerramenta comando="pnpm --version" estado="erro" saida="comando não encontrado: pnpm" />
      <LinhaDeFerramenta comando="pnpm install" estado="executando" />
      <LinhaDeFerramenta comando="rm -rf node_modules" estado="negado" />
    </Trace>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Failed row: the state is in the title and in the hidden label.
    const falhou = await canvas.findByRole("button", {
      name: "Falhou ao executar pnpm --version (com erro)",
    })
    await expect(falhou).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(falhou)
    await expect(falhou).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
    await expect(canvas.getByText("comando não encontrado: pnpm")).toBeVisible()

    // Rows with no output are plain text, not buttons.
    await expect(
      canvas.queryByRole("button", { name: /^Executando pnpm install/ })
    ).toBeNull()
    await expect(canvas.getByText(/Negou rm -rf node_modules/)).toBeVisible()
  },
  render: () => (
    <Trace role="group" aria-label="Comandos executados" className="max-w-sm">
      <LinhaDeFerramenta
        comando="node --version"
        estado="concluido"
        saida="v24.18.0"
      />
      <LinhaDeFerramenta
        comando="npm --version"
        estado="concluido"
        saida="11.6.2"
      />
      <LinhaDeFerramenta
        comando="pnpm --version"
        estado="erro"
        saida="comando não encontrado: pnpm"
      />
      <LinhaDeFerramenta comando="pnpm install" estado="executando" />
      <LinhaDeFerramenta comando="rm -rf node_modules" estado="negado" />
    </Trace>
  ),
}
