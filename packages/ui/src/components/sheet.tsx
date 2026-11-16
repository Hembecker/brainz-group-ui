import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/button"
import { XIcon } from "lucide-react"

/*
 * Sheet — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/sheet
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Dialog do Base UI: modal, foco preso, resto da página
 *   inerte, Esc para fechar e foco devolvido ao gatilho. `SheetTrigger` e
 *   `SheetClose` recebem o elemento pela prop `render`, sem `div` envolvendo.
 * - Nome e descrição: o Base UI liga o `SheetTitle` e o `SheetDescription` ao
 *   popup. Todo sheet precisa dos dois.
 * - `side`: `top`, `right`, `bottom` ou `left`, como no shadcn. São lados
 *   FÍSICOS (não há `inline-start`/`inline-end`): em RTL, escolha o lado
 *   você mesmo. O portal vai para o `body`; num sheet RTL isolado passe `dir`
 *   e `lang` ao `SheetContent`.
 * - Animação: só `translate-x`/`translate-y` físicos. Foram removidas as
 *   variantes `rtl:` de `translate-x` do registro, que invertiam a direção da
 *   entrada em RTL (um sheet à esquerda entraria pela direita).
 * - Botão de fechar: `showCloseButton` (padrão `true`), com o ícone
 *   `aria-hidden` e o nome "Fechar" em texto `sr-only` (rótulo fixo, em
 *   português, como o "Carregando" do Spinner; para outro idioma, use
 *   `showCloseButton={false}` e um `SheetClose` próprio).
 * - Recuos: `SheetHeader` e `SheetFooter` têm `p-6`; o conteúdo do meio usa
 *   `px-6` para alinhar com eles.
 * - Véu de fundo: `bg-black/30` com desfoque, a única cor com opacidade aqui
 *   (exceção aceita para véus; não é texto, não tem contraste a cumprir).
 * - Borda do popup: `border-r`/`border-l` FÍSICAS (voltadas para a página), no lugar
 *   de `border-e`/`border-s` do registro, que em RTL iam para a borda da tela.
 *   Cor: o papel `border`. A sombra continua.
 * - Anel de foco: o popup não tem anel; os controles usam o deles. Região que
 *   rola precisa de `tabIndex={0}`, `role="region"` e nome (veja a MDX).
 */

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col bg-popover bg-clip-padding text-sm text-popover-foreground shadow-xl transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute end-4 top-4 bg-secondary"
                size="icon-sm"
              />
            }
          >
            <XIcon aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-6", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
