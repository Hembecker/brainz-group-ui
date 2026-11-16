import * as React from "react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { ChevronRightIcon } from "lucide-react"

/*
 * Trace: estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/trace
 * As cores, o contraste e os tamanhos são os da Big Brain. A página não tem
 * seção RTL nem Cursor.
 * - Composição: `Trace` (lista de linhas) > `TraceLine` (`TraceIcon`,
 *   `TraceTitle`, `TraceDescription`). Uma linha que expande é um
 *   `TraceCollapsible` com o `TraceLine` dentro do `TraceCollapsibleTrigger`
 *   (um `button` com `aria-expanded` e `aria-controls`, do Collapsible do Base
 *   UI) e o detalhe no `TraceCollapsibleContent`. Para navegar, envolva a
 *   linha num `<a>`; para abrir um Dialog ou Sheet, no gatilho dele.
 * - Semântica: o `Trace` não é uma lista de verdade (um `div`, sem
 *   `role="list"`), porque as linhas são `span`, `a`, `button` e `div` soltos,
 *   e o seletor que dá foco e forma a quem envolve uma linha só enxerga
 *   filhos diretos. Dê um nome ao grupo por `role="group"` e `aria-label`
 *   (veja a MDX). Uma lista real exigiria um `<li>` em volta de cada linha,
 *   o que muda a estrutura (e a API) do componente.
 * - O `TraceIcon` é `aria-hidden`: o nome da linha é o `TraceTitle`, escrito
 *   como frase ("Executou pnpm install").
 * - Estado em texto: `status` (`running`, `error`, `pending`) pinta e anima,
 *   mas cor e movimento não bastam, então o `TraceLine` acrescenta um texto
 *   `sr-only` com o estado ("em andamento", "com erro", "pendente") depois do
 *   conteúdo. O título deve dizer o estado também ("Executando", "Falhou ao
 *   executar"); o texto oculto cobre a linha pendente, cujo título é só a
 *   ação.
 * - O `TraceTitle` é `relative`: um texto `sr-only` dentro dele (o "(abre em
 *   uma nova aba)" da MDX) fica preso no corte do `truncate` e não empurra a
 *   página para os lados a 320px.
 * - Cores com opacidade do registro trocadas: a linha `pending` usava
 *   `opacity-60`, que derrubava o texto para ~3:1 (abaixo dos 4,5:1), e a
 *   descrição usava `text-muted-foreground/70`. Agora a linha pendente fica
 *   na cor padrão (`muted-foreground`: 7,4:1 no branco e 8,1:1 no fundo
 *   escuro) e se distingue pelo ícone e pelo texto; a descrição usa
 *   `muted-foreground` cheio. `error` usa `destructive` (4,8:1 no branco, 6,8:1
 *   no escuro) e o passar do mouse usa `foreground`.
 * - Brilho do `running`: o utilitário `shimmer` do shadcn varre o título com
 *   `currentColor` a 20% de opacidade, o que apagaria o texto por um instante
 *   (contraste perto de 1:1 sob a faixa). `--shimmer-color` agora é
 *   `foreground`: a faixa fica mais forte que o texto (`muted-foreground`,
 *   7,4:1 e 8,1:1) e o contraste nunca cai abaixo do da linha parada. O brilho
 *   para com `prefers-reduced-motion` (`motion-reduce:shimmer-none`). O axe não
 *   mede texto com `background-clip: text`, então esse número vale por
 *   construção, não por teste.
 * - Anel de foco do gatilho e de links/gatilhos dentro do `Trace`: sólido,
 *   3px, `ring`, afastado 2px pela cor do fundo. O detalhe aberto herda
 *   `muted-foreground`: um bloco com fundo próprio dentro dele (o `CodeBlock`)
 *   define a própria cor de texto.
 * - A seta do gatilho gira 90 graus quando abre e, em RTL, aponta para a
 *   esquerda quando fechada (`rtl:rotate-180`). A altura do painel anima por
 *   200ms; as bordas e os paddings são lógicos (`ms-`, `ps-`, `pe-`, `border-s`).
 */

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2 *:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:rounded-lg *:has-[>[data-slot=trace-line]]:text-start *:has-[>[data-slot=trace-line]]:outline-none *:has-[>[data-slot=trace-line]]:focus-visible:ring-3 *:has-[>[data-slot=trace-line]]:focus-visible:ring-ring *:has-[>[data-slot=trace-line]]:focus-visible:ring-offset-2 *:has-[>[data-slot=trace-line]]:focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

const traceStatusLabels = {
  running: "em andamento",
  error: "com erro",
  pending: "pendente",
} as const

function TraceLine({
  className,
  children,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending"
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "flex w-fit max-w-full min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-foreground data-[status=error]:text-destructive data-[status=error]:in-[a:hover,button:hover]:text-destructive data-[status=running]:*:data-[slot=trace-title]:shimmer data-[status=running]:*:data-[slot=trace-title]:[--shimmer-color:var(--foreground)]",
        className
      )}
      {...props}
    >
      {children}
      {status ? (
        <span data-slot="trace-line-status" className="sr-only">
          ({traceStatusLabels[status]})
        </span>
      ) : null}
    </span>
  )
}

function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [[data-slot=trace-title]~&]:-ms-1",
        className
      )}
      {...props}
    />
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn(
        "relative min-w-0 truncate motion-reduce:shimmer-none",
        className
      )}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn("shrink-0 text-muted-foreground tabular-nums", className)}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "open"> &
  (
    | { open?: undefined }
    | {
        open: boolean
        onOpenChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onOpenChange"]
        >
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-lg text-start text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background has-[[data-status=error]]:text-destructive",
        className
      )}
      {...props}
    >
      {children}
      <TraceIcon className="transition-transform group-aria-expanded/trace-collapsible-trigger:rotate-90 rtl:not-group-aria-expanded/trace-collapsible-trigger:rotate-180">
        <ChevronRightIcon />
      </TraceIcon>
    </CollapsibleTrigger>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className="h-(--collapsible-panel-height) min-w-0 overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "ms-[calc(--spacing(2)-1px)] mt-2 mb-1 min-w-0 border-s ps-4 pe-1 leading-relaxed wrap-break-word text-muted-foreground",
          className
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
