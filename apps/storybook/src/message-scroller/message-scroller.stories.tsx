import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpIcon, RotateCwIcon } from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Marker, MarkerContent } from "@workspace/ui/components/marker"
import {
  Message,
  MessageContent,
  MessageHeader,
} from "@workspace/ui/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@workspace/ui/components/message-scroller"
import { Slider } from "@workspace/ui/components/slider"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

/*
 * One story per section of message-scroller.mdx, in the order of the
 * shadcn/ui page. The shadcn examples use the AI SDK (`useChat`), a fake chat
 * helper, a `MessageAnimated` component and Motion: none of them exist here,
 * so every story uses the small helpers below (a transcript in a Card, a
 * `useChatSimulado` hook that streams a scripted reply) and plain CSS for the
 * entrance animation (`animate-in` from tw-animate-css, off under
 * `prefers-reduced-motion`).
 * Because the stories need state and hooks, they render a helper component
 * and show the usage snippet of the section in "Show code" through
 * `parameters.docs.source.code`, which skips the `render` transform.
 * Differences from the shadcn examples:
 * - nothing starts on its own: the streaming only runs after "Enviar a
 *   mensagem" is pressed (a timer on mount would make axe measure the text
 *   mid-stream);
 * - each message says who wrote it with a `sr-only` "Você:"/"Assistente:",
 *   the reset and send buttons have specific names, and the group chat uses
 *   `MessageHeader` for the sender;
 * - the transcript outline of the Visibility section is a `nav` with buttons
 *   (`aria-current` on the current turn), always visible, instead of a hover
 *   card: it does not depend on hover.
 * Every `play` first waits for the scroller (`data-pending-scroll` keeps the
 * viewport invisible until it has the opening position, and axe would pass
 * on an invisible region). There is no `Rtl` story: the page has no RTL
 * section or example; `npm run test:rtl` still runs every story with
 * `dir="rtl"`.
 */
const meta = {
  title: "Componentes/Message Scroller",
  component: MessageScroller,
} satisfies Meta<typeof MessageScroller>

export default meta
type Story = StoryObj<typeof meta>

type Mensagem = { id: string; role: "user" | "assistant"; text: string }

const PARES = [
  {
    pergunta:
      "Estou montando um chat para o nosso app e a rolagem está me enlouquecendo. Toda vez que a IA responde em streaming, a conversa inteira pula.",
    resposta:
      "É o clássico problema de rolagem com streaming. Envolva a lista de mensagens no Message Scroller e ative o autoScroll: a área acompanha o fim enquanto o texto chega, e quem lê sempre vê o texto novo no lugar.\n\nO ponto importante: ele só rola sozinho enquanto a pessoa já está no fim. Quando ela sobe para ler algo anterior, o autoScroll recua e a posição dela é preservada. O streaming fica suave, sem brigar com a intenção de quem lê.",
  },
  {
    pergunta:
      "Certo, mas quando mando uma mensagem nova a tela ainda parece brusca, como se a conversa recarregasse do topo.",
    resposta:
      "O item da conversa resolve isso com a ancoragem de turnos. Marque com scrollAnchor o turno que deve parar perto do topo, em vez de ir direto para o fim do documento.\n\nEle também deixa uma pequena parte da troca anterior visível acima da âncora, para o contexto não se perder. A resposta começa à vista, sem o salto desorientador de um contêiner de rolagem comum.",
  },
  {
    pergunta:
      "E se a pessoa subiu para reler uma resposta antiga? Não quero puxá-la de volta para baixo.",
    resposta:
      "Não puxa. O autoScroll só roda quando a área já está no fim, então subir é uma escolha deliberada: o lugar dela na conversa fica parado, mesmo com texto novo chegando embaixo.\n\nQuando há conteúdo que ela ainda não viu, o botão de rolar aparece no fim da área. Um toque leva à mensagem mais nova e reativa o autoScroll. Fica quieto quando você está em dia e ajuda quando não está.",
  },
  {
    pergunta: "Última: isso funciona com tecnologia assistiva?",
    resposta:
      "O conteúdo da conversa já vem com role=log e aria-relevant=additions, então o leitor de tela anuncia as mensagens novas de forma educada.\n\nO botão de rolar é um botão de verdade, com um rótulo só para o leitor de tela, e sai da ordem do Tab quando você já está no fim: sem paradas de foco à toa.",
  },
]

const TODAS: Mensagem[] = PARES.flatMap((par, i) => [
  { id: `pergunta-${i}`, role: "user" as const, text: par.pergunta },
  { id: `resposta-${i}`, role: "assistant" as const, text: par.resposta },
])

const ATE_A_PRIMEIRA = TODAS.slice(0, 2)

/*
 * Plays a scripted conversation: "enviar" appends the next question, then
 * streams its answer in chunks. Nothing runs until "enviar" is called.
 */
function useChatSimulado(
  inicial: Mensagem[],
  roteiro: { pergunta: string; resposta: string }[]
) {
  const [mensagens, setMensagens] = React.useState(inicial)
  const [indice, setIndice] = React.useState(0)
  const [ocupado, setOcupado] = React.useState(false)
  const timers = React.useRef<number[]>([])
  const proximo = roteiro[indice]

  function limpar() {
    timers.current.forEach((id) => {
      window.clearTimeout(id)
      window.clearInterval(id)
    })
    timers.current = []
  }

  React.useEffect(() => limpar, [])

  function enviar() {
    if (!proximo || ocupado) return
    const idResposta = `resposta-nova-${indice}`
    setOcupado(true)
    setIndice((atual) => atual + 1)
    setMensagens((atual) => [
      ...atual,
      { id: `pergunta-nova-${indice}`, role: "user", text: proximo.pergunta },
    ])
    timers.current.push(
      window.setTimeout(() => {
        setMensagens((atual) => [
          ...atual,
          { id: idResposta, role: "assistant", text: "" },
        ])
        let tamanho = 0
        const intervalo = window.setInterval(() => {
          tamanho += 12
          const texto = proximo.resposta.slice(0, tamanho)
          setMensagens((atual) =>
            atual.map((m) => (m.id === idResposta ? { ...m, text: texto } : m))
          )
          if (tamanho >= proximo.resposta.length) {
            window.clearInterval(intervalo)
            setOcupado(false)
          }
        }, 25)
        timers.current.push(intervalo)
      }, 300)
    )
  }

  function reiniciar() {
    limpar()
    setMensagens(inicial)
    setIndice(0)
    setOcupado(false)
  }

  return { mensagens, ocupado, proximo, enviar, reiniciar }
}

function Quadro({
  titulo,
  descricao,
  acao,
  rodape,
  children,
}: {
  titulo: string
  descricao: string
  acao?: React.ReactNode
  rodape?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card className="mx-auto h-120 w-full max-w-sm gap-0">
      <CardHeader className="gap-1 border-b">
        <CardTitle>
          <h3>{titulo}</h3>
        </CardTitle>
        <CardDescription>{descricao}</CardDescription>
        {acao ? <CardAction>{acao}</CardAction> : null}
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        {children}
      </CardContent>
      {rodape ? (
        <CardFooter className="flex-wrap gap-2 border-t">{rodape}</CardFooter>
      ) : null}
    </Card>
  )
}

function BotaoReiniciar({
  rotulo,
  desabilitado,
  aoClicar,
}: {
  rotulo: string
  desabilitado?: boolean
  aoClicar: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={rotulo}
      disabled={desabilitado}
      onClick={aoClicar}
    >
      <RotateCwIcon aria-hidden="true" />
    </Button>
  )
}

function RodapeDeEnvio({
  texto,
  desabilitado,
  aoEnviar,
}: {
  texto?: string
  desabilitado: boolean
  aoEnviar: () => void
}) {
  return (
    <form
      className="w-full"
      onSubmit={(evento) => {
        evento.preventDefault()
        aoEnviar()
      }}
    >
      <div className="flex items-end gap-2 rounded-2xl bg-field p-2 ps-3">
        <p className="line-clamp-3 min-w-0 flex-1 py-1 text-sm">
          {texto ?? "Nenhuma mensagem na fila. Reinicie a conversa."}
        </p>
        <Button
          type="submit"
          size="icon"
          disabled={desabilitado}
          aria-label="Enviar a mensagem"
        >
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}

function Linha({
  mensagem,
  ancora = false,
  className,
}: {
  mensagem: Mensagem
  ancora?: boolean
  className?: string
}) {
  const usuario = mensagem.role === "user"
  return (
    <MessageScrollerItem
      messageId={mensagem.id}
      scrollAnchor={ancora}
      className={className}
    >
      <Message align={usuario ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={usuario ? "muted" : "ghost"}>
            <BubbleContent className="space-y-2">
              <span className="sr-only">
                {usuario ? "Você: " : "Assistente: "}
              </span>
              {mensagem.text.split("\n\n").map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}

function Transcricao({
  mensagens,
  ancora = (mensagem) => mensagem.role === "user",
  ocupado,
  fim,
  classeDaLinha,
}: {
  mensagens: Mensagem[]
  ancora?: (mensagem: Mensagem) => boolean
  ocupado?: boolean
  fim?: React.ReactNode
  classeDaLinha?: (mensagem: Mensagem) => string | undefined
}) {
  return (
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent
          aria-busy={ocupado}
          className="p-(--card-spacing)"
        >
          {mensagens.map((mensagem) => (
            <Linha
              key={mensagem.id}
              mensagem={mensagem}
              ancora={ancora(mensagem)}
              className={classeDaLinha?.(mensagem)}
            />
          ))}
          {fim}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  )
}

/*
 * Waits for the timed animations to end. Two kinds never end and are skipped:
 * endless ones, and the scroll-driven ones of `scroll-fade-b` (their timeline
 * is the scroller, not the clock, so they only finish at the end of the
 * scroll).
 */
async function esperarAnimacoes() {
  await Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.timeline === document.timeline &&
          animation.effect?.getComputedTiming().iterations !== Infinity
      )
      .map((animation) => animation.finished)
  )
}

async function esperarRolagem(canvasElement: HTMLElement) {
  const regiao = await within(canvasElement).findByRole("region", {
    name: "Mensagens",
  })
  await waitFor(() => expect(regiao).not.toHaveAttribute("data-pending-scroll"))
  await expect(regiao).toBeVisible()
  return regiao
}

/*
 * Complete snippets for "Show code" (`parameters.docs.source.code`): each
 * story renders a helper component with state, so the transform of
 * `render: () => (…)` would show only `<ComAlgo />`. These are written as
 * self-contained components (the data comes in as props) and are plain
 * strings: no backticks or interpolation inside the snippets.
 */
const CODIGO_IMPORTS = `import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { Message, MessageContent } from "@workspace/ui/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@workspace/ui/components/message-scroller"

type Mensagem = { id: string; role: "user" | "assistant"; text: string }`

const CODIGO_LINHA = `function Linha({
  message,
  anchor = false,
  className,
}: {
  message: Mensagem
  anchor?: boolean
  className?: string
}) {
  const isUser = message.role === "user"

  return (
    <MessageScrollerItem
      messageId={message.id}
      scrollAnchor={anchor}
      className={className}
    >
      <Message align={isUser ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={isUser ? "muted" : "ghost"}>
            <BubbleContent>
              <span className="sr-only">{isUser ? "Você: " : "Assistente: "}</span>
              {message.text}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}`

const CODIGO_DEMO = `${CODIGO_IMPORTS}

${CODIGO_LINHA}

// Ponha dentro de um contêiner com altura definida (o scroller preenche o pai).
export function Conversa({
  messages,
  busy,
}: {
  messages: Mensagem[]
  busy: boolean
}) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent aria-busy={busy} className="p-5">
            {messages.map((message) => (
              <Linha
                key={message.id}
                message={message}
                anchor={message.role === "user"}
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`

const CODIGO_ANCORAR = `${CODIGO_IMPORTS}

${CODIGO_LINHA}

// A linha marcada com scrollAnchor é a que a área trata como o começo do turno.
export function ConversaAncorada({
  messages,
  anchorRole,
}: {
  messages: Mensagem[]
  anchorRole: "user" | "assistant"
}) {
  return (
    <MessageScrollerProvider key={anchorRole}>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-5">
            {messages.map((message) => (
              <Linha
                key={message.id}
                message={message}
                anchor={message.role === anchorRole}
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`

const CODIGO_GRUPO = `import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { Marker, MarkerContent } from "@workspace/ui/components/marker"
import {
  Message,
  MessageContent,
  MessageHeader,
} from "@workspace/ui/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@workspace/ui/components/message-scroller"

type Item =
  | { id: string; tipo: "evento"; texto: string }
  | { id: string; tipo: "mensagem"; autor: string; texto: string }

// Um marcador também pode ser a âncora de um turno.
export function ConversaEmGrupo({
  items,
  currentUser,
}: {
  items: Item[]
  currentUser: string
}) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-5">
            {items.map((item) =>
              item.tipo === "evento" ? (
                <MessageScrollerItem key={item.id} scrollAnchor>
                  <Marker variant="separator">
                    <MarkerContent>{item.texto}</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              ) : (
                <MessageScrollerItem key={item.id} messageId={item.id}>
                  <Message align={item.autor === currentUser ? "end" : "start"}>
                    <MessageContent>
                      {item.autor === currentUser ? null : (
                        <MessageHeader>{item.autor}</MessageHeader>
                      )}
                      <Bubble
                        variant={item.autor === currentUser ? "muted" : "tinted"}
                      >
                        <BubbleContent>
                          {item.autor === currentUser ? (
                            <span className="sr-only">Você: </span>
                          ) : null}
                          {item.texto}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`

const CODIGO_CONTEXTO = `${CODIGO_IMPORTS}

${CODIGO_LINHA}

// Mantém "peek" pixels do turno anterior visíveis acima da linha recém-ancorada.
export function ConversaComContexto({
  messages,
  peek = 64,
}: {
  messages: Mensagem[]
  peek?: number
}) {
  return (
    <MessageScrollerProvider scrollMargin={24} scrollPreviousItemPeek={peek}>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-5">
            {messages.map((message) => (
              <Linha
                key={message.id}
                message={message}
                anchor={message.role === "user"}
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`

const CODIGO_STREAMING = `import { Marker, MarkerContent } from "@workspace/ui/components/marker"
${CODIGO_IMPORTS}

${CODIGO_LINHA}

// autoScroll segue o fim enquanto a resposta chega, e só enquanto a pessoa
// está no fim. A região de status fica sempre montada: só o texto muda.
export function ConversaEmStreaming({
  messages,
  busy,
}: {
  messages: Mensagem[]
  busy: boolean
}) {
  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent aria-busy={busy} className="p-5">
            {messages.map((message) => (
              <Linha
                key={message.id}
                message={message}
                anchor={message.role === "user"}
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
      <Marker role="status">
        <MarkerContent>{busy ? "Respondendo…" : "Resposta completa."}</MarkerContent>
      </Marker>
    </MessageScrollerProvider>
  )
}`

const CODIGO_ABERTURA = `${CODIGO_IMPORTS}

${CODIGO_LINHA}

// Abre a conversa salva no último turno ancorado, com a resposta embaixo.
export function ConversaSalva({ messages }: { messages: Mensagem[] }) {
  return (
    <MessageScrollerProvider defaultScrollPosition="last-anchor">
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-5">
            {messages.map((message) => (
              <Linha
                key={message.id}
                message={message}
                anchor={message.role === "user"}
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`

const CODIGO_HISTORICO = `import { Button } from "@workspace/ui/components/button"
import { Marker, MarkerContent } from "@workspace/ui/components/marker"
${CODIGO_IMPORTS}

${CODIGO_LINHA}

// O botão fica fora da área de rolagem. Ao carregar, as linhas antigas entram
// em cima e a linha que você lê continua no mesmo lugar (preserveScrollOnPrepend
// vem ligado). Use messageId estáveis.
export function ConversaComHistorico({
  messages,
  canLoadHistory,
  onLoadHistory,
}: {
  messages: Mensagem[]
  canLoadHistory: boolean
  onLoadHistory: () => void
}) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-5">
            {messages.map((message) => (
              <Linha key={message.id} message={message} />
            ))}
            <MessageScrollerItem>
              <Marker variant="separator">
                <MarkerContent>Fim da conversa</MarkerContent>
              </Marker>
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
      <Button type="button" disabled={!canLoadHistory} onClick={onLoadHistory}>
        {canLoadHistory ? "Carregar o histórico" : "Histórico carregado"}
      </Button>
    </MessageScrollerProvider>
  )
}`

const CODIGO_ANIMACAO = `${CODIGO_IMPORTS}

${CODIGO_LINHA}

// Anime só transform e opacity. Evite altura, margem e padding: eles brigam
// com o posicionamento do scroller. Mantenha messageId e scrollAnchor na linha.
export function ConversaAnimada({
  messages,
  newIds,
}: {
  messages: Mensagem[]
  newIds: string[]
}) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-5">
            {messages.map((message) => (
              <Linha
                key={message.id}
                message={message}
                anchor={message.role === "user"}
                className={
                  newIds.includes(message.id)
                    ? "animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none"
                    : undefined
                }
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`

const CODIGO_COMANDOS = `import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useMessageScroller } from "@workspace/ui/components/message-scroller"

type Mensagem = { id: string; role: "user" | "assistant"; text: string }

// Os hooks leem o MessageScrollerProvider: funcionam em qualquer componente
// dentro dele, inclusive fora do MessageScroller. Renderize este componente
// dentro do provider da conversa.
export function Comandos({ questions }: { questions: Mensagem[] }) {
  const { scrollToMessage, scrollToStart, scrollToEnd } = useMessageScroller()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="secondary" />}>
          Ir para…
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Perguntas</DropdownMenuLabel>
            {questions.map((question) => (
              <DropdownMenuItem
                key={question.id}
                onClick={() =>
                  scrollToMessage(question.id, {
                    align: "start",
                    behavior: "smooth",
                  })
                }
              >
                {question.text}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="button" variant="outline" onClick={() => scrollToStart()}>
        Ir para o início
      </Button>
      <Button type="button" variant="outline" onClick={() => scrollToEnd()}>
        Ir para o fim
      </Button>
    </>
  )
}`

const CODIGO_VISIBILIDADE = `import { Button } from "@workspace/ui/components/button"
import {
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@workspace/ui/components/message-scroller"

type Mensagem = { id: string; role: "user" | "assistant"; text: string }

// currentAnchorId: o turno ancorado atual (continua definido depois que a
// âncora sai da área). visibleMessageIds: o que está na tela, em ordem.
// Renderize dentro do MessageScrollerProvider da conversa.
export function ResumoDaConversa({ questions }: { questions: Mensagem[] }) {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

  return (
    <nav aria-label="Resumo da conversa">
      <ol className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <li key={question.id}>
            <Button
              type="button"
              size="sm"
              variant={currentAnchorId === question.id ? "default" : "outline"}
              aria-current={
                currentAnchorId === question.id ? "location" : undefined
              }
              onClick={() =>
                scrollToMessage(question.id, {
                  align: "start",
                  behavior: "smooth",
                })
              }
            >
              Pergunta {index + 1}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  )
}`

const CODIGO_ESTADO = `import { useMessageScrollerScrollable } from "@workspace/ui/components/message-scroller"

// start: dá para rolar para cima. end: dá para rolar para baixo.
// Renderize dentro do MessageScrollerProvider da conversa.
export function EstadoDaRolagem() {
  const { start, end } = useMessageScrollerScrollable()
  const estado =
    start && end
      ? "Você pode rolar nos dois sentidos."
      : end
        ? "Você está no topo. Só dá para rolar para baixo."
        : start
          ? "Você está no fim. Só dá para rolar para cima."
          : "Todas as mensagens cabem na área."

  return <p className="text-sm text-muted-foreground">{estado}</p>
}`

function ComChatDemo() {
  const { mensagens, ocupado, proximo, enviar, reiniciar } = useChatSimulado(
    ATE_A_PRIMEIRA,
    PARES.slice(1)
  )

  return (
    <MessageScrollerProvider>
      <Quadro
        titulo="Novo chat"
        descricao="Como posso ajudar você hoje?"
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar a conversa"
            desabilitado={ocupado}
            aoClicar={reiniciar}
          />
        }
        rodape={
          <RodapeDeEnvio
            texto={proximo?.pergunta}
            desabilitado={!proximo || ocupado}
            aoEnviar={enviar}
          />
        }
      >
        <Transcricao mensagens={mensagens} ocupado={ocupado} />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const regiao = await esperarRolagem(canvasElement)

    // Tab reaches the scroll region (a labelled region with tabIndex 0), and
    // the transcript inside it is a log that announces additions.
    for (let i = 0; i < 6 && document.activeElement !== regiao; i++) {
      await userEvent.tab()
    }
    await expect(regiao).toHaveFocus()
    // The sold focus ring (inset box-shadow) is drawn on the region.
    await expect(getComputedStyle(regiao).boxShadow).not.toBe("none")
    const log = within(regiao).getByRole("log")
    await expect(log).toHaveAttribute("aria-relevant", "additions")

    // Sending adds a row to the log; the reply streams in and ends the busy state.
    await userEvent.click(
      canvas.getByRole("button", { name: "Enviar a mensagem" })
    )
    await waitFor(() =>
      expect(log).toHaveTextContent(/Certo, mas quando mando uma mensagem nova/)
    )
    await waitFor(() => expect(log).not.toHaveAttribute("aria-busy", "true"), {
      timeout: 8000,
    })
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_DEMO } },
  },
  render: () => <ComChatDemo />,
}

const ROTEIRO_ANCORAGEM: Mensagem[] = [
  {
    id: "ancora-1-usuario",
    role: "user",
    text: "Pode mostrar como a ancoragem se comporta quando um novo pedido começa o turno?",
  },
  {
    id: "ancora-1-assistente",
    role: "assistant",
    text: "Primeiro entra o pedido da pessoa, depois a resposta do assistente. Com Usuário marcado, o pedido para perto do topo e a resposta aparece embaixo dele.",
  },
  {
    id: "ancora-2-usuario",
    role: "user",
    text: "O que muda quando a âncora são as mensagens do assistente?",
  },
  {
    id: "ancora-2-assistente",
    role: "assistant",
    text: "Agora cada resposta é a linha que o Message Scroller mantém à vista. É útil quando a resposta é o momento em que você quer que a pessoa pare depois de cada turno.",
  },
  {
    id: "ancora-3-usuario",
    role: "user",
    text: "Posso trocar o papel e continuar adicionando turnos?",
  },
  {
    id: "ancora-3-assistente",
    role: "assistant",
    text: "Pode. A próxima mensagem acrescentada com o papel escolhido vira a âncora, então dá para comparar as duas ancoragens sem reiniciar o exemplo.",
  },
]

function ComAncoragem() {
  const [papel, setPapel] = React.useState<"user" | "assistant">("user")
  const [indice, setIndice] = React.useState(0)
  const mensagens = ROTEIRO_ANCORAGEM.slice(0, indice)
  const proxima = ROTEIRO_ANCORAGEM[indice]

  return (
    <MessageScrollerProvider key={papel}>
      <Quadro
        titulo="Ancorar turnos"
        descricao="Escolha qual papel para perto da borda de cima."
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar os turnos ancorados"
            desabilitado={indice === 0}
            aoClicar={() => setIndice(0)}
          />
        }
        rodape={
          <>
            <ToggleGroup
              aria-label="Papel que ancora o turno"
              value={[papel]}
              onValueChange={(valor) => {
                const novo = valor[0]
                if (novo === "user" || novo === "assistant") {
                  setPapel(novo)
                  setIndice(0)
                }
              }}
            >
              <ToggleGroupItem value="user">Usuário</ToggleGroupItem>
              <ToggleGroupItem value="assistant">Assistente</ToggleGroupItem>
            </ToggleGroup>
            <Button
              type="button"
              size="icon"
              className="ms-auto"
              disabled={!proxima}
              aria-label="Enviar a próxima mensagem"
              onClick={() => setIndice((atual) => atual + 1)}
            >
              <ArrowUpIcon aria-hidden="true" />
            </Button>
          </>
        }
      >
        {mensagens.length === 0 ? (
          <p className="p-(--card-spacing) text-sm text-muted-foreground">
            Nenhuma mensagem ainda. Envie a primeira para ver o papel escolhido
            ancorar.
          </p>
        ) : (
          <Transcricao
            mensagens={mensagens}
            ancora={(mensagem) => mensagem.role === papel}
          />
        )}
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const AncorarTurnos: Story = {
  name: "Ancorar turnos",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Enviar a próxima mensagem" })
    )
    await userEvent.click(
      canvas.getByRole("button", { name: "Enviar a próxima mensagem" })
    )
    await esperarRolagem(canvasElement)
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_ANCORAR } },
  },
  render: () => <ComAncoragem />,
}

type ItemDeGrupo =
  | { id: string; tipo: "evento"; texto: string }
  | {
      id: string
      tipo: "mensagem"
      autor: string
      papel: "assistente" | "participante"
      texto: string
    }

const GRUPO_INICIAL: ItemDeGrupo[] = [
  {
    id: "grupo-1",
    tipo: "mensagem",
    autor: "Grace",
    papel: "participante",
    texto:
      "@Mary, a curva do astrófago continua batendo com a energia de Vênus. Você confere a minha conta?",
  },
  {
    id: "grupo-2",
    tipo: "mensagem",
    autor: "Mary (assistente)",
    papel: "assistente",
    texto:
      "Confirmado. A curva indica um microrganismo que colhe energia estelar e se reproduz perto de dióxido de carbono. Se o @Rocky concordar, é a pista que faltava.",
  },
  {
    id: "grupo-3",
    tipo: "mensagem",
    autor: "Grace",
    papel: "participante",
    texto: "chama o @Rocky",
  },
]

const GRUPO_ENTRADA: ItemDeGrupo = {
  id: "grupo-4",
  tipo: "evento",
  texto: "Rocky entrou no chat",
}

const GRUPO_RESPOSTA: ItemDeGrupo = {
  id: "grupo-5",
  tipo: "mensagem",
  autor: "Rocky",
  papel: "participante",
  texto:
    "Incrível. Astrófago come luz, faz calor, vai para dióxido de carbono. Rocky tem modelo de combustível. Grace é esperta.",
}

function ComChatEmGrupo() {
  const [etapa, setEtapa] = React.useState<"inicio" | "entrada" | "resposta">(
    "inicio"
  )
  const [reinicio, setReinicio] = React.useState(0)
  const itens =
    etapa === "resposta"
      ? [...GRUPO_INICIAL, GRUPO_ENTRADA, GRUPO_RESPOSTA]
      : etapa === "entrada"
        ? [...GRUPO_INICIAL, GRUPO_ENTRADA]
        : GRUPO_INICIAL

  return (
    <MessageScrollerProvider key={reinicio}>
      <Quadro
        titulo="Chat em grupo"
        descricao="Várias pessoas e um assistente. O marcador é a âncora do turno."
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar a conversa"
            desabilitado={etapa === "inicio"}
            aoClicar={() => {
              setEtapa("inicio")
              setReinicio((atual) => atual + 1)
            }}
          />
        }
        rodape={
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={etapa === "resposta"}
            onClick={() =>
              setEtapa((atual) => (atual === "inicio" ? "entrada" : "resposta"))
            }
          >
            {etapa === "inicio" ? "Adicionar o Rocky" : "Enviar como Rocky"}
          </Button>
        }
      >
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-(--card-spacing)">
              {itens.map((item) =>
                item.tipo === "evento" ? (
                  <MessageScrollerItem key={item.id} scrollAnchor>
                    <Marker variant="separator">
                      <MarkerContent>{item.texto}</MarkerContent>
                    </Marker>
                  </MessageScrollerItem>
                ) : (
                  <MessageScrollerItem
                    key={item.id}
                    messageId={item.id}
                    scrollAnchor={item.id === "grupo-3"}
                  >
                    <Message align={item.autor === "Grace" ? "end" : "start"}>
                      <MessageContent>
                        {item.autor === "Grace" ? null : (
                          <MessageHeader>{item.autor}</MessageHeader>
                        )}
                        <Bubble
                          variant={
                            item.autor === "Grace"
                              ? "muted"
                              : item.papel === "assistente"
                                ? "ghost"
                                : "tinted"
                          }
                        >
                          <BubbleContent>
                            {item.autor === "Grace" ? (
                              <span className="sr-only">Grace: </span>
                            ) : null}
                            {item.texto}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const ChatEmGrupo: Story = {
  name: "Chat em grupo",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const regiao = await esperarRolagem(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Adicionar o Rocky" })
    )
    // The marker is appended to the same scroller (it does not remount) and
    // becomes an anchor.
    const marcador = await canvas.findByText("Rocky entrou no chat")
    await expect(regiao.isConnected).toBe(true)
    await expect(
      marcador.closest("[data-slot=message-scroller-item]")
    ).toHaveAttribute("data-scroll-anchor", "true")
    await esperarRolagem(canvasElement)
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_GRUPO } },
  },
  render: () => <ComChatEmGrupo />,
}

function ComContextoAnterior() {
  const [trecho, setTrecho] = React.useState(64)
  const { mensagens, ocupado, proximo, enviar, reiniciar } = useChatSimulado(
    ATE_A_PRIMEIRA,
    PARES.slice(1)
  )

  return (
    <MessageScrollerProvider scrollMargin={24} scrollPreviousItemPeek={trecho}>
      <Quadro
        titulo="Manter o contexto à vista"
        descricao="Os turnos novos deixam parte da resposta anterior visível."
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar o exemplo de contexto"
            desabilitado={ocupado}
            aoClicar={() => {
              reiniciar()
              setTrecho(64)
            }}
          />
        }
        rodape={
          <div className="grid w-full gap-3">
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span id="contexto-trecho-rotulo">
                  Trecho da resposta anterior
                </span>
                <span className="text-muted-foreground">{trecho}px</span>
              </div>
              <Slider
                aria-labelledby="contexto-trecho-rotulo"
                value={[trecho]}
                min={0}
                max={160}
                step={8}
                onValueChange={(valor) =>
                  setTrecho(Array.isArray(valor) ? valor[0] : valor)
                }
              />
            </div>
            <RodapeDeEnvio
              texto={proximo?.pergunta}
              desabilitado={!proximo || ocupado}
              aoEnviar={enviar}
            />
          </div>
        }
      >
        <Transcricao mensagens={mensagens} ocupado={ocupado} />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const ContextoAnterior: Story = {
  name: "Contexto anterior",
  play: async ({ canvasElement }) => {
    await esperarRolagem(canvasElement)
    await expect(
      within(canvasElement).getByRole("slider", {
        name: "Trecho da resposta anterior",
      })
    ).toHaveValue("64")
  },
  parameters: {
    docs: { source: { code: CODIGO_CONTEXTO } },
  },
  render: () => <ComContextoAnterior />,
}

function ComStreaming() {
  const { mensagens, ocupado, proximo, enviar, reiniciar } = useChatSimulado(
    ATE_A_PRIMEIRA,
    PARES.slice(1)
  )

  return (
    <MessageScrollerProvider autoScroll>
      <Quadro
        titulo="Seguir o fim"
        descricao="Enquanto você está no fim, a resposta continua à vista."
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar o streaming"
            desabilitado={ocupado}
            aoClicar={reiniciar}
          />
        }
        rodape={
          <div className="grid w-full gap-2">
            <RodapeDeEnvio
              texto={proximo?.pergunta}
              desabilitado={!proximo || ocupado}
              aoEnviar={enviar}
            />
            <Marker role="status" className="justify-center text-xs">
              <MarkerContent>
                {ocupado ? "Respondendo…" : "Resposta completa."}
              </MarkerContent>
            </Marker>
          </div>
        }
      >
        <Transcricao mensagens={mensagens} ocupado={ocupado} />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const Streaming: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await esperarRolagem(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Enviar a mensagem" })
    )
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Respondendo…")
    )
    await waitFor(
      () =>
        expect(canvas.getByRole("status")).toHaveTextContent(
          "Resposta completa."
        ),
      { timeout: 8000 }
    )
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_STREAMING } },
  },
  render: () => <ComStreaming />,
}

function ComPosicaoDeAbertura() {
  const [posicao, setPosicao] = React.useState<"start" | "end" | "last-anchor">(
    "last-anchor"
  )

  return (
    <MessageScrollerProvider key={posicao} defaultScrollPosition={posicao}>
      <Quadro
        titulo="Abrir uma conversa salva"
        descricao="Escolha onde a conversa abre ao ser carregada."
        rodape={
          <ToggleGroup
            aria-label="Posição de abertura"
            value={[posicao]}
            onValueChange={(valor) => {
              const nova = valor[0]
              if (
                nova === "start" ||
                nova === "end" ||
                nova === "last-anchor"
              ) {
                setPosicao(nova)
              }
            }}
          >
            <ToggleGroupItem value="start">Início</ToggleGroupItem>
            <ToggleGroupItem value="last-anchor">Última âncora</ToggleGroupItem>
            <ToggleGroupItem value="end">Fim</ToggleGroupItem>
          </ToggleGroup>
        }
      >
        <Transcricao mensagens={TODAS} />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const PosicaoDeAbertura: Story = {
  name: "Posição de abertura",
  play: async ({ canvasElement }) => {
    await esperarRolagem(canvasElement)
    await expect(
      within(canvasElement).getByRole("button", { name: "Última âncora" })
    ).toHaveAttribute("aria-pressed", "true")
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_ABERTURA } },
  },
  render: () => <ComPosicaoDeAbertura />,
}

function ComHistorico() {
  const [visiveis, setVisiveis] = React.useState(2)
  const [reinicio, setReinicio] = React.useState(0)
  const mensagens = TODAS.slice(-visiveis)
  const podeCarregar = visiveis < TODAS.length

  return (
    <MessageScrollerProvider key={reinicio}>
      <Quadro
        titulo="Carregar o histórico"
        descricao="Mensagens antigas entram em cima sem mover o que você lê."
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar o histórico"
            desabilitado={visiveis === 2}
            aoClicar={() => {
              setVisiveis(2)
              setReinicio((atual) => atual + 1)
            }}
          />
        }
        rodape={
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={!podeCarregar}
            onClick={() => setVisiveis(TODAS.length)}
          >
            {podeCarregar ? "Carregar o histórico" : "Histórico carregado"}
          </Button>
        }
      >
        <Transcricao
          mensagens={mensagens}
          ancora={() => false}
          fim={
            <MessageScrollerItem>
              <Marker variant="separator">
                <MarkerContent>Fim da conversa</MarkerContent>
              </Marker>
            </MessageScrollerItem>
          }
        />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const CarregarHistorico: Story = {
  name: "Carregar o histórico",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await esperarRolagem(canvasElement)
    const linha = canvasElement.querySelector<HTMLElement>(
      "[data-message-id='resposta-3']"
    )
    if (!linha) throw new Error("linha visível não encontrada")
    // The baseline is read only once the viewport has settled at the end of
    // the conversation: on a busy machine the opening scroll can still be
    // running here, and the baseline would be a mid-scroll position.
    const viewport = canvasElement.querySelector<HTMLElement>(
      "[data-slot=message-scroller-viewport]"
    )
    if (!viewport) throw new Error("viewport não encontrado")
    let anterior = -1
    await waitFor(
      () => {
        const atual = linha.getBoundingClientRect().top
        const parado = atual === anterior
        anterior = atual
        expect(
          viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
        ).toBeLessThanOrEqual(2)
        expect(parado).toBe(true)
      },
      { timeout: 4000, interval: 100 }
    )
    const antes = linha.getBoundingClientRect().top
    await userEvent.click(
      canvas.getByRole("button", { name: "Carregar o histórico" })
    )
    await waitFor(() =>
      expect(canvas.getByRole("log")).toHaveTextContent(
        /Estou montando um chat/
      )
    )
    // The row the reader was looking at stays where it was (±2px).
    await waitFor(
      () =>
        expect(
          Math.abs(linha.getBoundingClientRect().top - antes)
        ).toBeLessThanOrEqual(2),
      // The anchor settles a few frames later on a busy machine.
      { timeout: 4000 }
    )
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_HISTORICO } },
  },
  render: () => <ComHistorico />,
}

function ComAnimacao() {
  const [quantidade, setQuantidade] = React.useState(2)
  const mensagens = TODAS.slice(0, quantidade)

  return (
    <MessageScrollerProvider>
      <Quadro
        titulo="Animar mensagens novas"
        descricao="A linha nova sobe do fim da área. Sem animação se você prefere menos movimento."
        acao={
          <BotaoReiniciar
            rotulo="Reiniciar as mensagens"
            desabilitado={quantidade === 2}
            aoClicar={() => setQuantidade(2)}
          />
        }
        rodape={
          <Button
            type="button"
            size="icon"
            className="ms-auto"
            disabled={quantidade >= TODAS.length}
            aria-label="Enviar a próxima mensagem"
            onClick={() => setQuantidade((atual) => atual + 2)}
          >
            <ArrowUpIcon aria-hidden="true" />
          </Button>
        }
      >
        <Transcricao
          mensagens={mensagens}
          classeDaLinha={(mensagem) =>
            TODAS.indexOf(mensagem) >= 2 && mensagem.role === "user"
              ? "animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none"
              : undefined
          }
        />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const Animacao: Story = {
  name: "Animação",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await esperarRolagem(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Enviar a próxima mensagem" })
    )
    await waitFor(() =>
      expect(canvas.getByRole("log")).toHaveTextContent(
        /Certo, mas quando mando/
      )
    )
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_ANIMACAO } },
  },
  render: () => <ComAnimacao />,
}

function MenuDeComandos() {
  const { scrollToMessage } = useMessageScroller()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button type="button" variant="secondary" />}
      >
        Ir para…
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Perguntas</DropdownMenuLabel>
          {TODAS.filter((mensagem) => mensagem.role === "user").map(
            (mensagem) => (
              <DropdownMenuItem
                key={mensagem.id}
                onClick={() =>
                  scrollToMessage(mensagem.id, {
                    align: "start",
                    behavior: "smooth",
                  })
                }
              >
                <span className="line-clamp-1 min-w-0">
                  {mensagem.text.length > 42
                    ? `${mensagem.text.slice(0, 39)}...`
                    : mensagem.text}
                </span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function BotoesDeInicioEFim() {
  const { scrollToStart, scrollToEnd } = useMessageScroller()

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => scrollToStart({ behavior: "smooth" })}
      >
        Ir para o início
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => scrollToEnd({ behavior: "smooth" })}
      >
        Ir para o fim
      </Button>
    </>
  )
}

function ComComandos() {
  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <Quadro
        titulo="Comandos"
        descricao="Controle a conversa de fora da lista."
        acao={<MenuDeComandos />}
        rodape={<BotoesDeInicioEFim />}
      >
        <Transcricao mensagens={TODAS} />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const Comandos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await esperarRolagem(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Ir para…" }))
    const menu = await screen.findByRole("menu")
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
    await expect(within(menu).getAllByRole("menuitem")).toHaveLength(4)
  },
  parameters: {
    docs: { source: { code: CODIGO_COMANDOS } },
  },
  render: () => <ComComandos />,
}

function ResumoDaConversa() {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()
  const perguntas = TODAS.filter((mensagem) => mensagem.role === "user")

  return (
    <nav aria-label="Resumo da conversa" className="w-full">
      <ol className="flex flex-wrap gap-2">
        {perguntas.map((mensagem, indice) => (
          <li key={mensagem.id}>
            <Button
              type="button"
              size="sm"
              variant={currentAnchorId === mensagem.id ? "default" : "outline"}
              aria-current={
                currentAnchorId === mensagem.id ? "location" : undefined
              }
              onClick={() =>
                scrollToMessage(mensagem.id, {
                  align: "start",
                  behavior: "smooth",
                })
              }
            >
              Pergunta {indice + 1}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function ComVisibilidade() {
  return (
    <MessageScrollerProvider scrollMargin={12}>
      <Quadro
        titulo="Resumo da conversa"
        descricao="Acompanhe o turno ancorado em que você está."
        rodape={<ResumoDaConversa />}
      >
        <Transcricao mensagens={TODAS} />
      </Quadro>
    </MessageScrollerProvider>
  )
}

export const Visibilidade: Story = {
  play: async ({ canvasElement }) => {
    await esperarRolagem(canvasElement)
    await expect(
      within(canvasElement).getByRole("navigation", {
        name: "Resumo da conversa",
      })
    ).toBeVisible()
    await esperarAnimacoes()
  },
  parameters: {
    docs: { source: { code: CODIGO_VISIBILIDADE } },
  },
  render: () => <ComVisibilidade />,
}

function EstadoDaRolagem() {
  const { start, end } = useMessageScrollerScrollable()
  const estado =
    start && end
      ? "Você pode rolar nos dois sentidos."
      : end
        ? "Você está no topo. Só dá para rolar para baixo."
        : start
          ? "Você está no fim. Só dá para rolar para cima."
          : "Todas as mensagens cabem na área."

  return (
    <CardFooter className="justify-center border-t text-center text-sm text-muted-foreground">
      {estado}
    </CardFooter>
  )
}

function ComEstadoDaRolagem() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <Card className="mx-auto h-120 w-full max-w-sm gap-0">
        <CardHeader className="gap-1 border-b">
          <CardTitle>
            <h3>Estado da rolagem</h3>
          </CardTitle>
          <CardDescription>
            Para onde dá para rolar, conforme a posição atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
          <Transcricao mensagens={TODAS} />
        </CardContent>
        <EstadoDaRolagem />
      </Card>
    </MessageScrollerProvider>
  )
}

export const EstadoDeRolagem: Story = {
  name: "Estado da rolagem",
  play: async ({ canvasElement }) => {
    const regiao = await esperarRolagem(canvasElement)
    // Opens at the start: there is more below, nothing above.
    await waitFor(() =>
      expect(
        within(canvasElement).getByText(
          "Você está no topo. Só dá para rolar para baixo."
        )
      ).toBeVisible()
    )
    await expect(regiao).toHaveAttribute("data-scrollable", "end")
  },
  parameters: {
    docs: { source: { code: CODIGO_ESTADO } },
  },
  render: () => <ComEstadoDaRolagem />,
}
