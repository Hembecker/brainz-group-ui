import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

/*
 * Separator — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/separator
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Separator do Base UI: `role="separator"` e
 *   `aria-orientation` vêm dele, e `orientation` (horizontal ou vertical)
 *   também vira `data-orientation`. Um separador vertical precisa estar num
 *   contêiner flex com altura (`self-stretch`), senão ele não aparece.
 * - A linha usa `bg-border`, sem opacidade. É decorativa: não é um controle,
 *   então não precisa de 3:1.
 * - O ButtonGroup usa este componente (com outra cor, `bg-muted-foreground`,
 *   definida lá).
 */

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
