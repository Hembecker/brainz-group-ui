import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Marker — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/marker
 * As cores e o contraste são os da Big Brain.
 * - Composição: Marker > MarkerIcon + MarkerContent. O Marker é presentacional
 *   (um <div>); com `render` vira <a> ou <button>, e o nome vem do texto.
 *   Expõe `data-slot="marker"` e `data-variant`.
 * - Cores: não há cor com opacidade neste arquivo. O texto é
 *   `muted-foreground` (7,4:1 no branco e 8,1:1 no fundo escuro); o hover
 *   passa para `foreground`. As linhas do `separator` e do `border` usam
 *   `bg-border`/`border-border`, decorativas (o texto é que carrega o
 *   sentido).
 * - Foco (decisão da Big Brain, o registro não tem): quando o Marker é um
 *   <a> ou um <button>, o anel é o do projeto (`ring-3 ring-ring
 *   ring-offset-2 ring-offset-background`), sem outline do navegador.
 * - Link: o registro sublinha o Marker quando ele é um <a> (`[a]:underline`),
 *   então o link não depende só da cor. Os ícones (SVG) não recebem o sublinhado.
 * - Marcador de status: `role="status"` vai por conta de quem usa (veja a
 *   página Docs). O `shimmer` do texto não anima com movimento reduzido.
 * - Espaçamentos lógicos (`me`/`ms`, `text-start`): funciona em RTL.
 */
const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-start text-sm text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:me-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ms-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-2",
      },
    },
  }
)

function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
