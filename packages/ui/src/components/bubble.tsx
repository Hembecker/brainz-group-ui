import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Bubble — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/bubble
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Composição: Bubble > BubbleContent e BubbleReactions; BubbleGroup agrupa
 *   balões seguidos do mesmo autor. Todas as partes expõem `data-slot`; o
 *   Bubble expõe `data-variant` e `data-align`, e o BubbleReactions,
 *   `data-align` e `data-side`. O Bubble é só a superfície: autor, avatar,
 *   horário e ações ficam no `Message`.
 * - `BubbleContent` recebe o elemento pela prop `render`: um balão clicável
 *   é um `<button>` (ação) ou um `<a>` (navegação) de verdade, com o nome
 *   vindo do próprio texto. Nesses dois casos ele ganha o anel de foco sólido
 *   (`ring-3 ring-ring`, afastado 2px pela cor do fundo) e o hover.
 * - Sem cor com opacidade (o registro usava `bg-primary/80`, `bg-destructive/10`,
 *   `dark:bg-destructive/20`, `dark:bg-input/30`, `dark:bg-muted/50`). Contrastes
 *   do texto no balão (claro / escuro) e no hover de `button`/`a`:
 *   - default: `primary` com branco, 5,2:1 / 5,2:1; hover `primary-hover`, 7,2:1;
 *   - secondary: `secondary-foreground` sobre `secondary`, 7,7:1 / 9,0:1; hover
 *     `secondary-hover`, 6,3:1 / 7,7:1;
 *   - muted: `foreground` sobre `muted`, 17,7:1 / 14,3:1;
 *   - tinted: `foreground` sobre um tom sólido derivado da `primary`
 *     (`oklch(from var(--primary) …)`, opaco), 15,7:1 / 13,2:1; hover 13,4:1 / 11,0:1;
 *   - outline: `foreground` sobre `background`, 19,7:1 / 19,0:1; contorno `border`
 *     decorativo (o balão não é um controle, salvo `button`/`a`); hover `muted`;
 *   - ghost: sem moldura, o texto herda; hover `muted`;
 *   - destructive: `destructive-hover` sobre `accent`, 5,8:1 / 7,7:1, com
 *     contorno `destructive`, para não depender só da cor do texto (o
 *     `destructive` puro dá 4,3:1 sobre `accent`).
 * - Hover do muted e do destructive em `button`/`a`: `color-mix` opaco entre a
 *   superfície e o `foreground` a 5% (muted 15,7:1 / 12,6:1; destructive
 *   5,1:1 / 6,8:1). Não há papel cheio acima de `muted`/`accent` (os dois têm o
 *   mesmo valor), e a regra é não criar token.
 * - As reações (`BubbleReactions`) usam `ring-card`, cor cheia. Emoji e texto
 *   solto precisam de `role="img"` e `aria-label` na fileira inteira; botões
 *   dentro dela precisam de nome.
 * - Alinhamento: `align="end"` usa `self-end`, que segue a direção (em RTL
 *   vai para a esquerda); `BubbleReactions` usa `start-3`/`end-3`.
 */

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary-hover",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-secondary-hover",
        muted:
          "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        destructive:
          "*:data-[slot=bubble-content]:border-destructive *:data-[slot=bubble-content]:bg-accent *:data-[slot=bubble-content]:text-destructive-hover [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--accent),var(--foreground)_5%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-3 py-2.5 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-start [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring [button,a]:focus-visible:ring-offset-2 [button,a]:focus-visible:ring-offset-background",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "start-3",
        end: "end-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
