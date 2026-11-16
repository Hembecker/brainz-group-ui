import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/button"

/*
 * AlertDialog — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/alert-dialog
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o AlertDialog do Base UI: modal, com `role="alertdialog"`,
 *   foco preso, resto da página inerte e Esc para fechar, devolvendo o foco ao
 *   gatilho. Diferente do Dialog, clicar fora NÃO fecha: a pessoa precisa
 *   responder. `AlertDialogTrigger` recebe o elemento pela prop `render`.
 * - Foco inicial: o do Base UI (e do shadcn), no primeiro elemento focável do
 *   popup (aberto por toque, o próprio popup). Sem link no título nem na
 *   descrição, é o Cancelar, porque o `AlertDialogCancel` vem antes do
 *   `AlertDialogAction` no rodapé; com um link na descrição, é o link. Nos
 *   dois casos a ação destrutiva nunca é a padrão. Para outro alvo, passe
 *   `initialFocus` (do Popup do Base UI) ao `AlertDialogContent`.
 * - Nome e descrição: o Base UI liga o `AlertDialogTitle` e o
 *   `AlertDialogDescription` ao popup. O título diz a ação ("Excluir chat?").
 * - `AlertDialogAction` é um `Button` comum (aceita `variant="destructive"`);
 *   `AlertDialogCancel` é um `AlertDialogPrimitive.Close` renderizado como
 *   `Button` (padrão `outline`). Não há textos fixos: o idioma é o de quem usa.
 * - `AlertDialogMedia`: `bg-muted` cheio. Para o tom destrutivo, passe só
 *   `className="text-destructive"` (o `bg-destructive/10` do registro, com
 *   opacidade, ficou de fora).
 * - Véu de fundo: `bg-black/30` com desfoque, a única cor com opacidade aqui
 *   (exceção aceita para véus; não é texto, não tem contraste a cumprir).
 * - Contorno do popup: `ring-border` cheio, no lugar de `ring-foreground/5` e
 *   `dark:ring-foreground/10` do registro. A sombra continua.
 * - Raio do Card (`min(--radius-4xl, 24px)`), recuo de 24px e posição lógica
 *   (`start-1/2`, `rtl:translate-x-1/2`), para funcionar em RTL. O conteúdo vai
 *   para um portal no `body`: num diálogo RTL isolado, passe `dir` e `lang` ao
 *   `AlertDialogContent`.
 * - Anel de foco: o popup não tem anel (`outline-none`); os botões usam o anel
 *   sólido deles. Os links da descrição ganharam o anel sólido do projeto
 *   (3px, `ring`, afastado 2px pelo fundo, `rounded-sm`); o registro deixava
 *   o outline padrão do navegador.
 */

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed start-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-popover-foreground shadow-xl ring-1 ring-border duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-16 items-center justify-center rounded-full bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "font-heading text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:rounded-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:outline-none *:[a]:hover:text-foreground *:[a]:focus-visible:ring-3 *:[a]:focus-visible:ring-ring *:[a]:focus-visible:ring-offset-2 *:[a]:focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
