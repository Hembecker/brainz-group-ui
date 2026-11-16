"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "cn"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

/*
 * Select — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/select
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Select do Base UI. O gatilho é um `<button
 *   role="combobox">` e a lista é um `listbox` num portal: o foco vai para a
 *   lista ao abrir, as setas, o type-ahead, Home/End e Enter funcionam, e Esc
 *   fecha e devolve o foco ao gatilho.
 * - Nome acessível: o gatilho precisa de um rótulo persistente. Ligue um
 *   `FieldLabel` (ou `Label`) pelo `htmlFor` ao `id` do `SelectTrigger`. O
 *   placeholder nunca é o rótulo: use um item com `value={null}` e o texto
 *   "Selecione…" e passe a lista em `items` ao `Select`, para o `SelectValue`
 *   mostrar o texto do item escolhido (e não o valor).
 * - Campo preenchido com o papel `field`, com a borda no papel `field-border`
 *   (transparente na Brainz Group; Neutral/300, `#DFDFDF`, 1,33:1 no branco, no SESI
 *   claro), como o Input; altura `h-8` (`h-7` no `sm`) e `rounded-2xl`, da
 *   escala rhea.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo
 *   (`ring-offset-background`), como no Button e no Input.
 * - Inválido (`aria-invalid`): borda `destructive` cheia e o anel de foco passa
 *   a `destructive`, igual ao Input. O registro usava `ring-destructive/20` e,
 *   no escuro, `border-destructive/50` e `ring-destructive/40`; foram trocados
 *   por papéis cheios. Ligue a mensagem por `aria-describedby` e
 *   `aria-errormessage`: o estado nunca vale só pela cor.
 * - O texto do gatilho é `text-foreground` (o placeholder continua em
 *   `muted-foreground`): dentro de um `Field` com `data-invalid` o texto
 *   herdaria o vermelho do erro, abaixo dos 4,5:1 sobre o `field`.
 * - Lista: fundo `popover`, contorno `ring-border` cheio, no lugar de
 *   `ring-foreground/5` e `dark:ring-foreground/10` do registro. A sombra
 *   continua. Item destacado com `focus:bg-accent`, sem anel.
 * - A lista vai para um portal no `body`: a classe `dark` e o `dir` do
 *   `<html>` chegam a ela, mas um `dir` posto num ancestral do gatilho não.
 *   Num exemplo RTL isolado, passe `dir` (e `lang`) ao `SelectTrigger` e ao
 *   `SelectContent`.
 * - Paddings, margens e cantos lógicos (`ps`/`pe`, `end-2`), para funcionar em
 *   RTL.
 * - Desabilitado: `disabled:opacity-50` e fora do Tab.
 */

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1.5 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-start", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-2xl border border-field-border bg-field px-3 py-2 text-sm whitespace-nowrap text-foreground transition-[color,box-shadow] duration-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl bg-popover text-popover-foreground shadow-lg ring-1 ring-border duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
