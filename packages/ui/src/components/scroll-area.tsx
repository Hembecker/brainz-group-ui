/*
 * ScrollArea — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/scroll-area
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o ScrollArea do Base UI. Quem rola, e portanto quem
 *   recebe foco (`tabIndex` 0 enquanto há o que rolar, para o teclado
 *   alcançar o conteúdo), é o Viewport; o Root é `role="presentation"`.
 * - A11Y: por isso `role`, `aria-label` e `aria-labelledby` dados ao
 *   `ScrollArea` são repassados ao Viewport, e não ao Root: é ali que a
 *   região focável precisa do nome (`role="region"` + `aria-label`). Os
 *   tipos das props não mudam; o resto das props continua no Root.
 * - Anel de foco do Viewport: sólido, 3px, no `ring`, afastado 2px pela cor
 *   do fundo (o Root não corta, não tem `overflow`).
 * - O polegar da barra é `bg-input`, para ter 3:1 como algo que se arrasta
 *   (4,6:1 no branco, 3,8:1 no escuro). O registro usava `bg-border` (~1,2:1).
 */
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "cn"

function ScrollArea({
  className,
  children,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-s data-vertical:border-s-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-input"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
