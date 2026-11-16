import * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/button"
import { ArrowDownIcon } from "lucide-react"

/*
 * MessageScroller — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/message-scroller
 * O comportamento vem do pacote `@shadcn/react` (primitivo sem estilo,
 * https://ui.shadcn.com/docs/react/message-scroller); aqui ficam o estilo, as
 * cores e os tamanhos da Big Brain. Composição: MessageScrollerProvider >
 * MessageScroller > MessageScrollerViewport > MessageScrollerContent >
 * MessageScrollerItem, mais o MessageScrollerButton. Todas as partes expõem
 * `data-slot`; o botão expõe também `data-direction`, `data-variant` e
 * `data-size`. Os hooks `useMessageScroller`, `useMessageScrollerScrollable` e
 * `useMessageScrollerVisibility` são reexportados do primitivo.
 * - Teclado: o Viewport é a área rolável e vem do primitivo como
 *   `role="region"`, `aria-label` e `tabIndex={0}`, então Tab chega nele e as
 *   setas, PageUp/PageDown, Home e End rolam a conversa. Rolar assim também
 *   solta o "seguir a última mensagem" (`autoScroll`). O rótulo padrão do
 *   primitivo é "Messages"; aqui o padrão é "Mensagens" (texto fixo em
 *   português, como o "Carregando" do Spinner), e `aria-label` ou
 *   `aria-labelledby` continuam valendo para dar outro nome.
 * - Anel de foco do Viewport: sólido, 3px, no `ring`, para dentro
 *   (`ring-inset`), porque a raiz tem `overflow-hidden` e cortaria um anel de
 *   fora. O contraste é o do `ring` contra o fundo (5,2:1 no claro; no
 *   escuro, 7,6:1 no fundo e 6,7:1 num card).
 * - Anúncio: o `MessageScrollerContent` já é `role="log"` (aria-live
 *   `polite` implícito) com `aria-relevant="additions"`: uma linha nova é
 *   anunciada, mas o texto que cresce numa linha em streaming não é lido
 *   token a token. Não acrescente outro `aria-live`. Para o leitor esperar a
 *   resposta completa, passe `aria-busy` ao Content enquanto ela chega.
 * - Botão de rolar: é um `<button>` de verdade (o Button, por `render`) com o
 *   nome em texto `sr-only`, fixo em português ("Ir para o fim da conversa",
 *   "Ir para o início da conversa"), e o ícone `aria-hidden`. Sem nada para
 *   rolar naquela direção, o primitivo põe `inert` e `tabIndex={-1}`: não
 *   cria parada de foco à toa. O fundo é `background`, o texto `foreground` e
 *   o hover `muted`; o contorno `border` é decorativo (o ícone é que carrega
 *   o 3:1).
 * - Sem cor com opacidade. `scroll-fade-b` é uma máscara de rolagem (não é
 *   cor, e não anima); o único movimento é a transição de entrada e saída do
 *   botão (`transition-[translate,scale,opacity]`), que não muda a rolagem.
 * - Posições lógicas (`inset-s-1/2`, `rtl:translate-x-1/2`), para funcionar
 *   em RTL.
 */

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      aria-label="Mensagens"
      className={cn(
        "size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent data-pending-scroll:invisible",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col gap-8", className)}
      {...props}
    />
  )
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        className
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon aria-hidden="true" />
          <span className="sr-only">
            {direction === "end"
              ? "Ir para o fim da conversa"
              : "Ir para o início da conversa"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
