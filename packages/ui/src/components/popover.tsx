import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"

/*
 * Popover — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/popover
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Popover do Base UI: não modal, posicionado junto ao
 *   gatilho (`side`, `align`, `sideOffset`, `alignOffset`), fecha com Esc ou
 *   com um clique fora, e devolve o foco ao gatilho. `PopoverTrigger` recebe o
 *   elemento pela prop `render` (`render={<Button variant="outline" />}`),
 *   sem `div` envolvendo.
 * - Nome acessível: o Popup tem `role="dialog"`. Todo conteúdo precisa de nome:
 *   use `PopoverTitle` (o Base UI liga o `aria-labelledby` sozinho) ou, se não
 *   houver título visível, `aria-label` no `PopoverContent`. O mesmo vale para
 *   `PopoverDescription` e o `aria-describedby`.
 * - Contorno do popup: `ring-border` cheio, no lugar de `ring-foreground/5` e
 *   `dark:ring-foreground/10` do registro. A sombra continua.
 * - Portal: o conteúdo vai para um portal no `body`. A classe `dark` e o `dir`
 *   do `<html>` chegam a ele, mas um `dir` posto num ancestral do gatilho não:
 *   para um popover RTL isolado, passe `dir` (e `lang`) ao `PopoverContent`.
 * - Anel de foco: o Popup não tem anel (`outline-hidden`), porque o foco vai
 *   para o primeiro controle; os botões e campos usam o anel sólido deles.
 */

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 max-w-(--available-width) origin-(--transform-origin) flex-col gap-4 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-border outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("text-base font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
