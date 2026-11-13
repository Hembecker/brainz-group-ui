"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "cn"

/*
 * HoverCard — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/hover-card
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o PreviewCard do Base UI. O gatilho é um `<a>` (padrão do
 *   Base UI) e pode receber outro elemento pela prop `render`, sem `div`
 *   envolvendo. `delay` e `closeDelay` ficam no `HoverCardTrigger`.
 * - Abre por foco de teclado, não só pelo mouse (o Base UI ouve o foco do
 *   gatilho): Tab abre e Esc fecha. Mas o cartão é uma pré-visualização para
 *   quem enxerga e não recebe foco nem é lido como diálogo: o que importa não
 *   pode existir só nele. Veja a seção Acessibilidade da MDX.
 * - Contorno: `ring-border` cheio, no lugar de `ring-foreground/5` e
 *   `dark:ring-foreground/10` do registro. Fundo `popover` com texto
 *   `popover-foreground` (19,7:1 no claro e 16,7:1 no escuro) e
 *   `text-muted-foreground` para o texto secundário (7,4:1 no claro e 7,1:1 no
 *   escuro, sobre o `popover`).
 * - A sombra e as animações do registro continuam.
 * - O conteúdo vai para um portal no `body`: um `dir` posto num ancestral do
 *   gatilho não chega a ele. Em RTL isolado, passe `dir` (e `lang`) ao
 *   `HoverCardContent`.
 */

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "z-50 w-72 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-border outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
