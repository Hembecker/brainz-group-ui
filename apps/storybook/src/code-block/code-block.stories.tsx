import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test"
import {
  ChevronDownIcon,
  DownloadIcon,
  FileCodeIcon,
  RotateCcwIcon,
  TerminalIcon,
  WrapTextIcon,
} from "lucide-react"

import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { Button } from "@workspace/ui/components/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"
import { DirectionProvider } from "@workspace/ui/components/direction"
import { Message, MessageContent } from "@workspace/ui/components/message"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@workspace/ui/components/trace"
import { useHighlightedCode } from "@workspace/ui/hooks/use-highlighted-code"

/*
 * One story per section of code-block.mdx, in the order of the shadcn/ui page.
 * Left out, with the reason:
 * - Typeset: needs the `typeset` utility of the shadcn registry, which this
 *   system does not have.
 * - Markdown: needs Streamdown and @ai-sdk/react, which are not installed here
 *   (the section is code only in the MDX).
 * - Server Rendering: code only, in the MDX (there is nothing to render).
 * The `Rtl` story uses the Arabic texts of the shadcn example.
 *
 * The highlighter loads Shiki and each language asynchronously, and axe runs
 * right after `play`. So the stories that highlight wait, in `play`, for the
 * colored tokens (`aguardarRealce`); without it axe would only see plain
 * text and the 4.5:1 requirement on the syntax colors would go unchecked.
 *
 * The stories that need a hook or state use a helper component in this file;
 * the helper's source is also in `parameters.docs.source.code`, so "Show code"
 * gives a snippet that can be pasted.
 *
 * A scrolling block is a focusable `pre` (it takes the keyboard). When it has
 * a title, the story names it: `role="region"` and `aria-labelledby`.
 */
const meta = {
  title: "Componentes/Code Block",
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

// Waits for the highlighter: `count` blocks with colored tokens.
async function aguardarRealce(canvasElement: HTMLElement, count = 1) {
  await waitFor(
    () =>
      expect(
        canvasElement.querySelectorAll(
          '[data-slot="code-block-content"]:has([data-slot="code-block-line-content"] > span)'
        ).length
      ).toBeGreaterThanOrEqual(count),
    { timeout: 10000 }
  )
}

function DemoBloco() {
  const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "Você é um assistente prestativo.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`
  const [wrap, setWrap] = React.useState(false)
  const lines = useHighlightedCode(code, "ts")

  function baixar() {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "route.ts"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-lg">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id="demo-titulo">
            <FileCodeIcon aria-hidden="true" />
            app/api/chat/route.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Quebrar linhas"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Baixar route.ts"
              onClick={baixar}
            >
              <DownloadIcon aria-hidden="true" />
            </Button>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          role="region"
          aria-labelledby="demo-titulo"
          wrap={wrap}
          lineNumbers
        >
          {lines.map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={index >= 5 && index <= 9 ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export const Demo: Story = {
  parameters: {
    docs: {
      source: {
        code: `function DemoBloco() {
  const code = \`import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "Você é um assistente prestativo.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}\`
  const [wrap, setWrap] = React.useState(false)
  const lines = useHighlightedCode(code, "ts")

  function baixar() {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "route.ts"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-lg">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id="demo-titulo">
            <FileCodeIcon aria-hidden="true" />
            app/api/chat/route.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Quebrar linhas"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Baixar route.ts"
              onClick={baixar}
            >
              <DownloadIcon aria-hidden="true" />
            </Button>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          role="region"
          aria-labelledby="demo-titulo"
          wrap={wrap}
          lineNumbers
        >
          {lines.map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={index >= 5 && index <= 9 ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await aguardarRealce(canvasElement)

    // Quebrar linhas: o botão anuncia o estado por aria-pressed.
    const quebrar = canvas.getByRole("button", { name: "Quebrar linhas" })
    await expect(quebrar).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(quebrar)
    await expect(quebrar).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(quebrar)

    // Copiar: o nome é em português e a região polite anuncia "Copiado".
    const copiar = canvas.getByRole("button", { name: "Copiar código" })
    const aviso = canvasElement.querySelector('[aria-live="polite"]')
    await expect(aviso?.textContent).toBe("")
    // O navegador de teste não dá permissão ao clipboard: o writeText é
    // trocado por um que resolve, e o teste confere o que foi copiado.
    const escrever = spyOn(navigator.clipboard, "writeText").mockResolvedValue(
      undefined
    )
    await userEvent.click(copiar)
    await waitFor(() => expect(aviso).toHaveTextContent("Copiado"))
    await expect(escrever).toHaveBeenCalledWith(
      expect.stringContaining("export async function POST")
    )
    await expect(copiar).toHaveAccessibleName("Copiar código")

    // O bloco é focável: o teclado chega a ele e o anel aparece no bloco.
    const bloco = canvas.getByRole("region", { name: "app/api/chat/route.ts" })
    bloco.focus()
    await expect(bloco).toHaveFocus()
    await expect(bloco).toHaveAttribute("tabindex", "0")
  },
  render: () => <DemoBloco />,
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent>{`$ pnpm build
> next build

 ✓ Compiled successfully in 4.2s
 ✓ Generating static pages (12/12)

Route (app)                Size  First Load JS
┌ ○ /                    1.9 kB         112 kB
├ ○ /_not-found           993 B         103 kB
└ ƒ /api/chat             141 B         102 kB`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

export const Cabecalho: Story = {
  name: "Cabeçalho",
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value="pnpm add ai @ai-sdk/react zod" />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{`$ pnpm add ai @ai-sdk/react zod
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

function AcoesBloco() {
  const output = `$ pnpm lint
apps/web/components/message-list.tsx
  18:22  error  'messages' is possibly 'undefined'  @typescript-eslint/no-unsafe-call
  42:7   warning  Missing dependency: 'scrollToBottom'  react-hooks/exhaustive-deps

✖ 2 problems (1 error, 1 warning)`
  const [wrap, setWrap] = React.useState(true)

  function baixar() {
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "lint.log"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Quebrar linhas"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Baixar lint.log"
              onClick={baixar}
            >
              <DownloadIcon aria-hidden="true" />
            </Button>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export const Acoes: Story = {
  name: "Ações",
  parameters: {
    docs: {
      source: {
        code: `function AcoesBloco() {
  const output = \`$ pnpm lint
apps/web/components/message-list.tsx
  18:22  error  'messages' is possibly 'undefined'  @typescript-eslint/no-unsafe-call
  42:7   warning  Missing dependency: 'scrollToBottom'  react-hooks/exhaustive-deps

✖ 2 problems (1 error, 1 warning)\`
  const [wrap, setWrap] = React.useState(true)

  function baixar() {
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "lint.log"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Quebrar linhas"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Baixar lint.log"
              onClick={baixar}
            >
              <DownloadIcon aria-hidden="true" />
            </Button>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  render: () => <AcoesBloco />,
}

export const AcoesFlutuantes: Story = {
  name: "Ações flutuantes",
  play: async ({ canvasElement }) => {
    // Sem passar o mouse: o foco por teclado também mostra a ação flutuante.
    const canvas = within(canvasElement)
    const copiar = canvas.getByRole("button", {
      name: "Copiar a saída do pnpm add",
    })
    await userEvent.tab()
    await expect(copiar).toHaveFocus()
    await waitFor(() =>
      expect(
        getComputedStyle(copiar.parentElement as HTMLElement).opacity
      ).toBe("1")
    )
  },
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockActions>
          <CodeBlockCopyButton
            value="pnpm add ai @ai-sdk/react zod"
            aria-label="Copiar a saída do pnpm add"
          />
        </CodeBlockActions>
        <CodeBlockContent>{`$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
dependencies:
+ @ai-sdk/react 3.0.12
+ ai 6.0.12
+ zod 4.1.12
Done in 2.8s using pnpm v10.18.0`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

export const NumerosDeLinha: Story = {
  name: "Números de linha",
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>{`{
  "name": "chat",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

function LinhaInicialBloco() {
  const code = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`
  const lines = useHighlightedCode(code, "tsx")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/dashboard/page.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers startLine={995}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export const LinhaInicial: Story = {
  name: "Linha inicial",
  parameters: {
    docs: {
      source: {
        code: `function LinhaInicialBloco() {
  const code = \`  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}\`
  const lines = useHighlightedCode(code, "tsx")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/dashboard/page.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers startLine={995}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
    // O contador do CSS começa em 994, para a primeira linha ser a 995.
    const bloco = canvasElement.querySelector(
      '[data-slot="code-block-content"]'
    ) as HTMLElement
    await expect(getComputedStyle(bloco).counterReset).toBe("line 994")
  },
  render: () => <LinhaInicialBloco />,
}

export const Quebra: Story = {
  name: "Quebra de linha",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockContent>{`Error: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens and the context window is 200,000 tokens. Remove some messages or summarize the conversation and try again.`}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock>
        <CodeBlockContent
          wrap
        >{`Error: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens and the context window is 200,000 tokens. Remove some messages or summarize the conversation and try again.`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

export const LinhasRealcadas: Story = {
  name: "Linhas realçadas",
  play: async ({ canvasElement }) => {
    // O número da linha realçada passa a foreground (muted-foreground sobre
    // o tom da linha daria só 4,4:1 no escuro): o axe não lê pseudo-elementos,
    // então o teste compara a cor computada.
    const linhas = canvasElement.querySelectorAll(
      '[data-slot="code-block-line"]'
    )
    const comum = getComputedStyle(linhas[0], "::before").color
    const realcada = getComputedStyle(linhas[2], "::before").color
    await expect(linhas[2]).toHaveAttribute("data-variant", "highlighted")
    await expect(realcada).not.toBe(comum)
  },
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          <CodeBlockLine>export default {"{"}</CodeBlockLine>
          <CodeBlockLine>{"  experimental: {"}</CodeBlockLine>
          <CodeBlockLine variant="highlighted">
            {"    reactCompiler: true,"}
          </CodeBlockLine>
          <CodeBlockLine variant="highlighted">
            {"    viewTransition: true,"}
          </CodeBlockLine>
          <CodeBlockLine>{"  },"}</CodeBlockLine>
          <CodeBlockLine>{"  images: {"}</CodeBlockLine>
          <CodeBlockLine>
            {
              '    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],'
            }
          </CodeBlockLine>
          <CodeBlockLine>{"  },"}</CodeBlockLine>
          <CodeBlockLine>{"}"}</CodeBlockLine>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

export const Diff: Story = {
  play: async ({ canvasElement }) => {
    // O marcador "+" usa foreground e o "−" usa destructive-hover (o axe não
    // lê pseudo-elementos, então o teste compara a cor computada).
    const linhas = canvasElement.querySelectorAll(
      '[data-slot="code-block-line"]'
    )
    const comum = getComputedStyle(linhas[0], "::after").color
    const adicionada = getComputedStyle(linhas[2], "::after").color
    const removida = getComputedStyle(linhas[1], "::after").color
    await expect(adicionada).not.toBe(comum)
    await expect(removida).not.toBe(comum)
    await expect(removida).not.toBe(adicionada)
  },
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={`export function Greeting({ name }: { name: string }) {
  return <p className="text-sm text-muted-foreground">
    Olá, {name}!
  </p>
}`}
              aria-label="Copiar o código novo de greeting.tsx"
            />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>
          <CodeBlockLine>
            {"export function Greeting({ name }: { name: string }) {"}
          </CodeBlockLine>
          <CodeBlockLine variant="removed">
            {"  return <p>Olá, {name}</p>"}
          </CodeBlockLine>
          <CodeBlockLine variant="added">
            {'  return <p className="text-sm text-muted-foreground">'}
          </CodeBlockLine>
          <CodeBlockLine variant="added">{"    Olá, {name}!"}</CodeBlockLine>
          <CodeBlockLine variant="added">{"  </p>"}</CodeBlockLine>
          <CodeBlockLine>{"}"}</CodeBlockLine>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

function AlturaBloco() {
  const logs = Array.from(
    { length: 40 },
    (_, index) =>
      `[${String(index + 1).padStart(2, "0")}] GET /api/chat 200 in ${12 + ((index * 7) % 40)}ms`
  ).join("\n")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id="altura-titulo">Logs</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={logs} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          role="region"
          aria-labelledby="altura-titulo"
          className="max-h-48 scroll-fade-y"
        >
          {logs}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export const Altura: Story = {
  parameters: {
    docs: {
      source: {
        code: `function AlturaBloco() {
  const logs = Array.from(
    { length: 40 },
    (_, index) =>
      \`[\${String(index + 1).padStart(2, "0")}] GET /api/chat 200 in \${12 + ((index * 7) % 40)}ms\`
  ).join("\\n")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id="altura-titulo">Logs</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={logs} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          role="region"
          aria-labelledby="altura-titulo"
          className="max-h-48 scroll-fade-y"
        >
          {logs}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // O bloco rola por dentro, então ele precisa receber o foco do teclado.
    const bloco = within(canvasElement).getByRole("region", { name: "Logs" })
    await expect(bloco.scrollHeight).toBeGreaterThan(bloco.clientHeight)
    await expect(bloco).toHaveAttribute("tabindex", "0")
    bloco.focus()
    await expect(bloco).toHaveFocus()
  },
  render: () => <AlturaBloco />,
}

function MostrarMaisBloco({ rolagem = false }: { rolagem?: boolean }) {
  const code = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Enviar</Button>
      </form>
    </div>
  )
}`
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(code, "tsx")
  const id = React.useId()

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id={`${id}-titulo`}>
            components/chat.tsx
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          role="region"
          aria-labelledby={`${id}-titulo`}
          lineNumbers
          className={
            expanded
              ? rolagem
                ? "max-h-96 scroll-fade-y"
                : undefined
              : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon
              aria-hidden="true"
              className="transition-transform in-aria-expanded:rotate-180"
            />
            {expanded ? "Mostrar menos" : "Mostrar mais"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}

export const MostrarMais: Story = {
  name: "Mostrar mais",
  parameters: {
    docs: {
      source: {
        code: `function MostrarMaisBloco({ rolagem = false }: { rolagem?: boolean }) {
  const code = \`"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Enviar</Button>
      </form>
    </div>
  )
}\`
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(code, "tsx")
  const id = React.useId()

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id={\`\${id}-titulo\`}>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          role="region"
          aria-labelledby={\`\${id}-titulo\`}
          lineNumbers
          className={
            expanded
              ? rolagem
                ? "max-h-96 scroll-fade-y"
                : undefined
              : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon
              aria-hidden="true"
              className="transition-transform in-aria-expanded:rotate-180"
            />
            {expanded ? "Mostrar menos" : "Mostrar mais"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
    const botao = within(canvasElement).getByRole("button", {
      name: "Mostrar mais",
    })
    const bloco = canvasElement.querySelector(
      '[data-slot="code-block-content"]'
    ) as HTMLElement
    await expect(botao).toHaveAttribute("aria-expanded", "false")
    await expect(botao).toHaveAttribute("aria-controls", bloco.id)
    const fechada = bloco.getBoundingClientRect().height
    await userEvent.click(botao)
    await expect(botao).toHaveAttribute("aria-expanded", "true")
    await expect(botao).toHaveAccessibleName("Mostrar menos")
    await expect(bloco.getBoundingClientRect().height).toBeGreaterThan(fechada)
    await userEvent.click(botao)
  },
  render: () => <MostrarMaisBloco />,
}

export const AlturaMaxima: Story = {
  name: "Altura máxima",
  parameters: {
    docs: {
      source: {
        code: `function MostrarMaisBloco({ rolagem = false }: { rolagem?: boolean }) {
  const code = \`"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Enviar</Button>
      </form>
    </div>
  )
}\`
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(code, "tsx")
  const id = React.useId()

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle id={\`\${id}-titulo\`}>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          role="region"
          aria-labelledby={\`\${id}-titulo\`}
          lineNumbers
          className={
            expanded
              ? rolagem
                ? "max-h-96 scroll-fade-y"
                : undefined
              : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon
              aria-hidden="true"
              className="transition-transform in-aria-expanded:rotate-180"
            />
            {expanded ? "Mostrar menos" : "Mostrar mais"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
    const botao = within(canvasElement).getByRole("button", {
      name: "Mostrar mais",
    })
    const bloco = canvasElement.querySelector(
      '[data-slot="code-block-content"]'
    ) as HTMLElement
    await userEvent.click(botao)
    // Aberto, o bloco continua limitado (max-h-96) e rola por dentro.
    await expect(bloco.getBoundingClientRect().height).toBeLessThanOrEqual(384)
  },
  render: () => <MostrarMaisBloco rolagem />,
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value="pnpm add ai @ai-sdk/react zod"
              aria-label="Copiar a saída do terminal (padrão)"
            />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{`$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value="pnpm add ai @ai-sdk/react zod"
              aria-label="Copiar a saída do terminal (pequeno)"
            />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{`$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

export const Destrutivo: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <CodeBlock variant="destructive">
        <CodeBlockHeader>
          <CodeBlockTitle>Erro</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value="TypeError: Cannot read properties of undefined (reading 'map')"
              aria-label="Copiar o erro"
            />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          wrap
        >{`TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)`}</CodeBlockContent>
      </CodeBlock>
    </div>
  ),
}

export const TraceExemplo: Story = {
  name: "Trace",
  render: () => (
    <div className="w-full max-w-md">
      <Trace role="group" aria-label="Comandos executados">
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <TerminalIcon aria-hidden="true" />
              </TraceIcon>
              <TraceTitle>Executou node --version</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent
                wrap
                role="region"
                aria-label="Saída de node --version"
                className="max-h-64"
              >{`$ node --version
v24.18.0`}</CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <TerminalIcon aria-hidden="true" />
              </TraceIcon>
              <TraceTitle>Falhou ao executar pnpm dev</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent
                wrap
                role="region"
                aria-label="Erro de pnpm dev"
                className="max-h-64"
              >{`$ pnpm dev
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1908:16)`}</CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  ),
}

function ArquivoComRealce({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent lineNumbers>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

function AbasBloco() {
  const files = [
    {
      id: "route",
      title: "app/api/chat/route.ts",
      language: "ts",
      code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`,
    },
    {
      id: "chat",
      title: "components/chat.tsx",
      language: "tsx",
      code: `"use client"

import { useChat } from "@ai-sdk/react"

export function Chat() {
  const { messages } = useChat()

  return <MessageList messages={messages} />
}`,
    },
    {
      id: "env",
      title: ".env.local",
      language: "bash",
      code: "AI_GATEWAY_API_KEY=sua-chave",
    },
  ]

  return (
    <Tabs defaultValue="route" className="w-full max-w-md">
      <TabsList aria-label="Arquivos do exemplo">
        {files.map((file) => (
          <TabsTrigger key={file.id} value={file.id}>
            {file.title.split("/").at(-1)}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map((file) => (
        <TabsContent key={file.id} value={file.id}>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>{file.title}</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton
                  value={file.code}
                  aria-label={`Copiar ${file.title}`}
                />
              </CodeBlockActions>
            </CodeBlockHeader>
            <ArquivoComRealce code={file.code} language={file.language} />
          </CodeBlock>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export const Abas: Story = {
  parameters: {
    docs: {
      source: {
        code: `function ArquivoComRealce({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent lineNumbers>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

function AbasBloco() {
  const files = [
    {
      id: "route",
      title: "app/api/chat/route.ts",
      language: "ts",
      code: \`import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}\`,
    },
    {
      id: "chat",
      title: "components/chat.tsx",
      language: "tsx",
      code: \`"use client"

import { useChat } from "@ai-sdk/react"

export function Chat() {
  const { messages } = useChat()

  return <MessageList messages={messages} />
}\`,
    },
    {
      id: "env",
      title: ".env.local",
      language: "bash",
      code: "AI_GATEWAY_API_KEY=sua-chave",
    },
  ]

  return (
    <Tabs defaultValue="route" className="w-full max-w-md">
      <TabsList aria-label="Arquivos do exemplo">
        {files.map((file) => (
          <TabsTrigger key={file.id} value={file.id}>
            {file.title.split("/").at(-1)}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map((file) => (
        <TabsContent key={file.id} value={file.id}>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>{file.title}</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton
                  value={file.code}
                  aria-label={\`Copiar \${file.title}\`}
                />
              </CodeBlockActions>
            </CodeBlockHeader>
            <ArquivoComRealce code={file.code} language={file.language} />
          </CodeBlock>
        </TabsContent>
      ))}
    </Tabs>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await aguardarRealce(canvasElement)
    // Troca de aba pelo teclado (seta move o foco, Enter ativa) e confere que
    // o outro arquivo aparece.
    const aba = canvas.getByRole("tab", { name: "route.ts" })
    aba.focus()
    // Em RTL a seta que avança é a da esquerda.
    await userEvent.keyboard(
      document.documentElement.dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}"
    )
    await expect(canvas.getByRole("tab", { name: "chat.tsx" })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() =>
      expect(canvas.getByRole("tab", { name: "chat.tsx" })).toHaveAttribute(
        "aria-selected",
        "true"
      )
    )
    await aguardarRealce(canvasElement)
    await expect(
      canvas.getByRole("button", { name: "Copiar components/chat.tsx" })
    ).toBeVisible()
  },
  render: () => <AbasBloco />,
}

function MensagemBloco() {
  const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Como eu faço o streaming de uma resposta?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3">
          <p>Crie um route handler que devolve o stream:</p>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>
              {lines.map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))}
            </CodeBlockContent>
          </CodeBlock>
          <p>O cliente lê o stream com o useChat.</p>
        </MessageContent>
      </Message>
    </div>
  )
}

export const Mensagem: Story = {
  parameters: {
    docs: {
      source: {
        code: `function MensagemBloco() {
  const code = \`import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}\`
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Como eu faço o streaming de uma resposta?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3">
          <p>Crie um route handler que devolve o stream:</p>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>
              {lines.map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))}
            </CodeBlockContent>
          </CodeBlock>
          <p>O cliente lê o stream com o useChat.</p>
        </MessageContent>
      </Message>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
  },
  render: () => <MensagemBloco />,
}

function RtlBloco() {
  const code = `pnpm add ai @ai-sdk/react zod
pnpm dev`
  const lines = useHighlightedCode(code, "bash")

  return (
    <DirectionProvider direction="rtl">
      <div
        dir="rtl"
        lang="ar"
        className="flex w-full max-w-md flex-col gap-3 text-sm"
      >
        <p>ثبّت الحزم، ثم شغّل خادم التطوير.</p>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <TerminalIcon aria-hidden="true" />
              الطرفية
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={code} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>
            {lines.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
        </CodeBlock>
      </div>
    </DirectionProvider>
  )
}

export const Rtl: Story = {
  name: "RTL",
  parameters: {
    docs: {
      source: {
        code: `function RtlBloco() {
  const code = \`pnpm add ai @ai-sdk/react zod
pnpm dev\`
  const lines = useHighlightedCode(code, "bash")

  return (
    <DirectionProvider direction="rtl">
      <div
        dir="rtl"
        lang="ar"
        className="flex w-full max-w-md flex-col gap-3 text-sm"
      >
        <p>ثبّت الحزم، ثم شغّل خادم التطوير.</p>
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <TerminalIcon aria-hidden="true" />
              الطرفية
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={code} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>
            {lines.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
        </CodeBlock>
      </div>
    </DirectionProvider>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
    // O código sempre lê da esquerda para a direita, mesmo numa página RTL.
    const bloco = canvasElement.querySelector(
      '[data-slot="code-block-content"]'
    ) as HTMLElement
    await expect(getComputedStyle(bloco).direction).toBe("ltr")
  },
  render: () => <RtlBloco />,
}

function RealceBloco() {
  const code = `{
  "location": "São Paulo",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["garoa", "vento"]
}`
  const lines = useHighlightedCode(code, "json")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Saída de getWeather</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export const RealceDeSintaxe: Story = {
  name: "Realce de sintaxe",
  parameters: {
    docs: {
      source: {
        code: `function RealceBloco() {
  const code = \`{
  "location": "São Paulo",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["garoa", "vento"]
}\`
  const lines = useHighlightedCode(code, "json")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Saída de getWeather</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
  },
  render: () => <RealceBloco />,
}

function Amostra({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

function LinguagensBloco() {
  const samples = [
    {
      language: "css",
      title: "app/globals.css",
      code: `@import "tailwindcss";

/* O raio padrão dos controles */
:root {
  --radius: 0.625rem;
}`,
    },
    {
      language: "python",
      title: "main.py",
      code: `# Devolve a saudação
def saudacao(nome: str) -> str:
    return f"Olá, {nome}!"`,
    },
    {
      language: "text",
      title: "notas.txt",
      code: "Uma linguagem que não está na lista aparece como texto simples.",
    },
  ]

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {samples.map((sample) => (
        <CodeBlock key={sample.language}>
          <CodeBlockHeader>
            <CodeBlockTitle>{sample.title}</CodeBlockTitle>
          </CodeBlockHeader>
          <Amostra code={sample.code} language={sample.language} />
        </CodeBlock>
      ))}
    </div>
  )
}

export const Linguagens: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Amostra({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

function LinguagensBloco() {
  const samples = [
    {
      language: "css",
      title: "app/globals.css",
      code: \`@import "tailwindcss";

/* O raio padrão dos controles */
:root {
  --radius: 0.625rem;
}\`,
    },
    {
      language: "python",
      title: "main.py",
      code: \`# Devolve a saudação
def saudacao(nome: str) -> str:
    return f"Olá, {nome}!"\`,
    },
    {
      language: "text",
      title: "notas.txt",
      code: "Uma linguagem que não está na lista aparece como texto simples.",
    },
  ]

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {samples.map((sample) => (
        <CodeBlock key={sample.language}>
          <CodeBlockHeader>
            <CodeBlockTitle>{sample.title}</CodeBlockTitle>
          </CodeBlockHeader>
          <Amostra code={sample.code} language={sample.language} />
        </CodeBlock>
      ))}
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // CSS e Python ganham cor; o texto simples fica sem cor.
    await aguardarRealce(canvasElement, 2)
  },
  render: () => <LinguagensBloco />,
}

function AnsiBloco() {
  const output = `$ pnpm test
\x1b[32m✓\x1b[39m src/format.test.ts \x1b[2m(4 tests)\x1b[22m
\x1b[32m✓\x1b[39m src/parse.test.ts \x1b[2m(7 tests)\x1b[22m
\x1b[31m✗\x1b[39m src/stream.test.ts \x1b[2m(3 tests | 1 failed)\x1b[22m

\x1b[31mAssertionError: expected 'hello' to be 'hello world'\x1b[39m

Tests  \x1b[31m1 failed\x1b[39m | \x1b[32m13 passed\x1b[39m (14)`
  const lines = useHighlightedCode(output, "ansi")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={output.replace(
                new RegExp(String.fromCharCode(27) + "\\[[\\d;]*m", "g"),
                ""
              )}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export const SaidaDoTerminal: Story = {
  name: "Saída do terminal",
  parameters: {
    docs: {
      source: {
        code: `function AnsiBloco() {
  const output = \`$ pnpm test
\\x1b[32m✓\\x1b[39m src/format.test.ts \\x1b[2m(4 tests)\\x1b[22m
\\x1b[32m✓\\x1b[39m src/parse.test.ts \\x1b[2m(7 tests)\\x1b[22m
\\x1b[31m✗\\x1b[39m src/stream.test.ts \\x1b[2m(3 tests | 1 failed)\\x1b[22m

\\x1b[31mAssertionError: expected 'hello' to be 'hello world'\\x1b[39m

Tests  \\x1b[31m1 failed\\x1b[39m | \\x1b[32m13 passed\\x1b[39m (14)\`
  const lines = useHighlightedCode(output, "ansi")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon aria-hidden="true" />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={output.replace(
                new RegExp(String.fromCharCode(27) + "\\\\[[\\\\d;]*m", "g"),
                ""
              )}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await aguardarRealce(canvasElement)
  },
  render: () => <AnsiBloco />,
}

function BlocoEmStreaming({
  block,
  code,
}: {
  block: {
    title?: string
    language: string
    code: string
    lineNumbers?: boolean
    diff?: boolean
  }
  code: string
}) {
  const rows = code.split("\n")
  // Uma linha de diff começa com +, - ou espaço. O marcador não é código.
  const source = block.diff ? rows.map((row) => row.slice(1)).join("\n") : code
  const lines = useHighlightedCode(source, block.language)

  return (
    <CodeBlock>
      {block.title && (
        <CodeBlockHeader>
          <CodeBlockTitle>{block.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={source}
              aria-label={`Copiar ${block.title}`}
              disabled={code.length < block.code.length}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
      )}
      <CodeBlockContent lineNumbers={block.lineNumbers}>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              block.diff
                ? rows[index]?.startsWith("+")
                  ? "added"
                  : rows[index]?.startsWith("-")
                    ? "removed"
                    : "default"
                : "default"
            }
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function StreamingBloco() {
  const blocks = [
    {
      title: "hooks/use-debounce.ts",
      language: "ts",
      lineNumbers: true,
      code: `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}`,
    },
    {
      language: "bash",
      code: "pnpm dlx shadcn@latest add code-block",
    },
    {
      title: "components/search.tsx",
      language: "tsx",
      lineNumbers: true,
      diff: true,
      code: ` export function Search() {
   const [query, setQuery] = React.useState("")
-  const results = useSearch(query)
+  const debounced = useDebounce(query, 300)
+  const results = useSearch(debounced)

   return <SearchResults results={results} />
 }`,
    },
  ]
  // Onde cada bloco começa no stream.
  const offsets = blocks.map((_, index) =>
    blocks
      .slice(0, index)
      .reduce((total, block) => total + block.code.length, 0)
  )
  const total = blocks.reduce((sum, block) => sum + block.code.length, 0)
  const [length, setLength] = React.useState(total)

  React.useEffect(() => {
    if (length >= total) {
      return
    }

    const timeout = setTimeout(() => setLength(length + 8), 16)
    return () => clearTimeout(timeout)
  }, [length, total])

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {blocks.map(
        (block, index) =>
          length > offsets[index] && (
            <BlocoEmStreaming
              key={block.code}
              block={block}
              code={block.code.slice(0, length - offsets[index])}
            />
          )
      )}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={length < total}
        onClick={() => setLength(0)}
      >
        <RotateCcwIcon aria-hidden="true" />
        Repetir
      </Button>
    </div>
  )
}

export const Streaming: Story = {
  parameters: {
    docs: {
      source: {
        code: `function BlocoEmStreaming({
  block,
  code,
}: {
  block: {
    title?: string
    language: string
    code: string
    lineNumbers?: boolean
    diff?: boolean
  }
  code: string
}) {
  const rows = code.split("\\n")
  // Uma linha de diff começa com +, - ou espaço. O marcador não é código.
  const source = block.diff ? rows.map((row) => row.slice(1)).join("\\n") : code
  const lines = useHighlightedCode(source, block.language)

  return (
    <CodeBlock>
      {block.title && (
        <CodeBlockHeader>
          <CodeBlockTitle>{block.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={source}
              aria-label={\`Copiar \${block.title}\`}
              disabled={code.length < block.code.length}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
      )}
      <CodeBlockContent lineNumbers={block.lineNumbers}>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              block.diff
                ? rows[index]?.startsWith("+")
                  ? "added"
                  : rows[index]?.startsWith("-")
                    ? "removed"
                    : "default"
                : "default"
            }
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function StreamingBloco() {
  const blocks = [
    {
      title: "hooks/use-debounce.ts",
      language: "ts",
      lineNumbers: true,
      code: \`export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}\`,
    },
    {
      language: "bash",
      code: "pnpm dlx shadcn@latest add code-block",
    },
    {
      title: "components/search.tsx",
      language: "tsx",
      lineNumbers: true,
      diff: true,
      code: \` export function Search() {
   const [query, setQuery] = React.useState("")
-  const results = useSearch(query)
+  const debounced = useDebounce(query, 300)
+  const results = useSearch(debounced)

   return <SearchResults results={results} />
 }\`,
    },
  ]
  // Onde cada bloco começa no stream.
  const offsets = blocks.map((_, index) =>
    blocks
      .slice(0, index)
      .reduce((total, block) => total + block.code.length, 0)
  )
  const total = blocks.reduce((sum, block) => sum + block.code.length, 0)
  const [length, setLength] = React.useState(total)

  React.useEffect(() => {
    if (length >= total) {
      return
    }

    const timeout = setTimeout(() => setLength(length + 8), 16)
    return () => clearTimeout(timeout)
  }, [length, total])

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {blocks.map(
        (block, index) =>
          length > offsets[index] && (
            <BlocoEmStreaming
              key={block.code}
              block={block}
              code={block.code.slice(0, length - offsets[index])}
            />
          )
      )}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={length < total}
        onClick={() => setLength(0)}
      >
        <RotateCcwIcon aria-hidden="true" />
        Repetir
      </Button>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await aguardarRealce(canvasElement, 3)
    // Repetir recomeça o stream e o botão volta quando ele termina.
    const repetir = canvas.getByRole("button", { name: "Repetir" })
    await userEvent.click(repetir)
    await expect(repetir).toBeDisabled()
    await waitFor(() => expect(repetir).toBeEnabled(), { timeout: 10000 })
    await aguardarRealce(canvasElement, 3)
  },
  render: () => <StreamingBloco />,
}
