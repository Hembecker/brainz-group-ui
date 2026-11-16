"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/button"
import { XIcon } from "lucide-react"

/*
 * Dialog — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/dialog
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Dialog do Base UI: modal, com o foco preso dentro do
 *   popup, o resto da página inerte, Esc para fechar e o foco devolvido ao
 *   gatilho. `DialogTrigger` e `DialogClose` recebem o elemento pela prop
 *   `render` (`render={<Button variant="outline" />}`), sem `div` envolvendo.
 * - O conteúdo vai para um portal no `body`: a classe `dark` e o `dir` do
 *   `<html>` chegam a ele, mas um `dir` posto num ancestral do gatilho não.
 *   Para um diálogo RTL isolado, passe `dir` (e `lang`) ao `DialogContent`.
 * - Nome acessível: o Popup recebe o nome do `DialogTitle` e a descrição do
 *   `DialogDescription` (o Base UI liga os dois sozinho). Todo diálogo precisa
 *   dos dois.
 * - Botão de fechar: `showCloseButton` (padrão `true`), com o ícone
 *   `aria-hidden` e o nome "Fechar" em texto `sr-only` (o rótulo é fixo, em
 *   português, como o "Carregando" do Spinner; para outro idioma, use
 *   `showCloseButton={false}` e um `DialogClose` próprio). O mesmo vale para
 *   `DialogFooter showCloseButton`.
 * - Véu de fundo: `bg-black/30` com desfoque, a única cor com opacidade aqui
 *   (exceção aceita para véus). O véu não é texto, então não tem contraste a
 *   cumprir; o popup (`popover`) é que destaca.
 * - Contorno do popup: `ring-border` cheio, no lugar de `ring-foreground/5` e
 *   `dark:ring-foreground/10` do registro. A sombra continua.
 * - Raio do Card (`min(--radius-4xl, 24px)`), recuo de 24px, paddings e
 *   posição lógicos (`start`/`end`, `rtl:translate-x-1/2`), para funcionar em
 *   RTL.
 * - Links na descrição: sublinhados, com o anel de foco do projeto (`ring-3
 *   ring-ring ring-offset-2 ring-offset-background`, `rounded-sm`) no lugar do
 *   outline do navegador, como no AlertDialog.
 * - Anel de foco: o Popup não tem anel (`outline-none`), porque o foco vai para
 *   o primeiro controle; os botões e campos usam o anel sólido deles.
 * - Conteúdo longo: limite a altura de uma região interna (`max-h-[50vh]
 *   overflow-y-auto`) e dê a ela `tabIndex={0}`, `role="region"` e um nome, para
 *   o teclado rolar (veja a MDX).
 */

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed start-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-border duration-100 outline-none sm:max-w-md rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
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
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Fechar
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:rounded-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:outline-none *:[a]:hover:text-foreground *:[a]:focus-visible:ring-3 *:[a]:focus-visible:ring-ring *:[a]:focus-visible:ring-offset-2 *:[a]:focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
