import { mergeProps } from "@base-ui/react/merge-props"
import { Separator } from "@workspace/ui/components/separator"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * ButtonGroup — estrutura do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/button-group
 * - `role="group"`: dê um nome com `aria-label` ou `aria-labelledby`.
 * - Junta os filhos diretos (qualquer elemento com `data-slot`): os cantos
 *   internos perdem o raio e a borda compartilhada some. Cantos e bordas são
 *   lógicos (rounded-s/e, border-s), então o grupo funciona em RTL. Grupos
 *   aninhados ganham um espaço entre eles.
 * - O filho focado sobe (`z-10`), para o anel de foco não ficar atrás do
 *   vizinho.
 * - Raio `rounded-2xl` (~13px), o mesmo do Button.
 * - O separador usa `bg-muted-foreground` (6,1:1 sobre o secundário no claro,
 *   4,5:1 no escuro), e não o `bg-input` do shadcn, que com o input na mist 200
 *   quase some entre botões secundários.
 * - O separador usa o componente `Separator` do registro, com a cor trocada.
 * - Só para ações. Botões que ligam e desligam um estado pedem um ToggleGroup.
 */
const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-border has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-border has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-ring has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-2xl [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[>[data-variant=outline]]:[&>input]:border-border has-[>[data-variant=outline]]:[&>input:focus-visible]:border-ring",
  {
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:rounded-e-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-2xl! [&>[data-slot]~[data-slot]]:rounded-s-none [&>[data-slot]~[data-slot]]:border-s-0",
        vertical:
          "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-2xl! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

type ButtonGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants>

function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation ?? "horizontal"}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

type ButtonGroupTextProps = useRender.ComponentProps<"div">

/** Texto dentro do grupo. Use `render` para trocar o elemento, por exemplo por um <label>. */
function ButtonGroupText({ className, render, ...props }: ButtonGroupTextProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-2xl border bg-muted px-2.5 text-sm font-medium text-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

type ButtonGroupSeparatorProps = React.ComponentProps<typeof Separator>

/** Divisória entre botões sem borda própria (todas as variantes menos outline). */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: ButtonGroupSeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative shrink-0 self-stretch bg-muted-foreground data-horizontal:mx-px data-horizontal:h-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto data-vertical:w-px",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
  type ButtonGroupProps,
  type ButtonGroupSeparatorProps,
  type ButtonGroupTextProps,
}
