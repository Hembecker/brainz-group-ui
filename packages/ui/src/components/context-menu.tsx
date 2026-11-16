"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { cn } from "cn"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

/*
 * ContextMenu — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/context-menu
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o ContextMenu do Base UI: abre com o botão direito (e com o
 *   toque longo) sobre o `ContextMenuTrigger`, na posição do ponteiro; as setas,
 *   Home, End e a digitação movem o destaque, e Esc fecha.
 * - Abertura pelo teclado: o menu abre com o evento `contextmenu` do navegador, e
 *   o teclado o dispara com Shift+F10 ou com a tecla de menu (Apps), no elemento
 *   que tem o foco. O `ContextMenuTrigger` é um `div` e não recebe foco sozinho:
 *   para quem usa só o teclado, passe `tabIndex={0}` a ele (ou ponha um controle
 *   focável dentro), com `role="group"` e um nome (`aria-label`). Sem isso o menu
 *   só abre com o mouse ou com o toque, e quem usa o teclado perde as ações. O
 *   menu também deve ter as mesmas ações em outro lugar visível (um botão "Mais
 *   ações", por exemplo), porque o botão direito não é descoberto por todos.
 * - Anel de foco do gatilho: o padrão (`focus-visible:ring-3 ring-ring ring-offset-2
 *   ring-offset-background`) só aparece quando o gatilho recebe foco (`tabIndex`).
 * - Todo `ContextMenuLabel` fica dentro de um `ContextMenuGroup` (o Base UI liga o
 *   rótulo ao grupo; fora dele não funciona).
 * - Destaque do item: `focus:bg-accent` com `focus:text-accent-foreground`, sem
 *   anel. Contrastes medidos: `accent-foreground` sobre `accent` 15,6:1 no claro e
 *   14,2:1 no escuro; `muted-foreground` (rótulos e atalhos) sobre `popover` 7,4:1
 *   no claro e 7,1:1 no escuro.
 * - Item destrutivo: `text-destructive` sobre `popover` (4,8:1 no claro, 6,0:1 no
 *   escuro). No destaque, o registro usava `bg-destructive/10` (e `/20` no
 *   escuro) com o texto `text-destructive`: sobre o `accent` o vermelho dá só
 *   4,3:1 no claro. Aqui o fundo é o `accent` cheio e o texto passa para
 *   `destructive-hover` (5,8:1 no claro e 7,7:1 no escuro).
 * - Cores com opacidade trocadas por papéis cheios: o contorno `ring-foreground/5`
 *   e `dark:ring-foreground/10` virou `ring-border`; o separador `bg-border/50`
 *   virou `bg-border`. A sombra continua.
 * - Itens com `min-h-7` e `rounded-xl`, conteúdo com `rounded-2xl` (escala rhea).
 *   Paddings e posição lógicos (`ps`/`pe`, `ms-auto`, `end-2`, `side="inline-end"`),
 *   para funcionar em RTL. O Base UI lê a direção do `DirectionProvider` para a
 *   posição dos submenus e para as setas do teclado.
 * - O conteúdo vai para um portal no `body`: a classe `dark` e o `dir` do `<html>`
 *   chegam a ele, mas um `dir` posto num ancestral do gatilho não.
 */

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn(
        "select-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "inline-end",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-border duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1 text-xs text-muted-foreground data-inset:ps-7",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/context-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-accent data-[variant=destructive]:focus:text-destructive-hover data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex min-h-7 cursor-default items-center rounded-xl px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto rtl:rotate-180" />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="shadow-lg"
      side="inline-end"
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute end-2">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioGroup({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute end-2">
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
