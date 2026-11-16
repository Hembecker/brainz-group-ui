"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { cn } from "cn"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { CheckIcon } from "lucide-react"

/*
 * Menubar — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/menubar
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Menubar e o Menu do Base UI, e reaproveita as peças do
 *   `DropdownMenu` (que não se edita aqui). A barra é `role="menubar"` e cada
 *   gatilho um `menuitem` com `aria-haspopup`/`aria-expanded`. Teclado: Tab
 *   entra na barra, ←/→ (invertidos em RTL) trocam de menu, ↓/Enter abrem, ↑/↓
 *   percorrem os itens, Home/End vão ao primeiro/último, → abre um submenu, Esc
 *   fecha e devolve o foco ao gatilho. Escolher uma ação é com `<button>`
 *   (item de menu), nunca `<a>` para ação.
 * - Nome acessível: o texto do gatilho ("Arquivo") e o dos itens. Um item só
 *   com ícone precisa de `aria-label`; os ícones decorativos levam
 *   `aria-hidden="true"`. O atalho (`MenubarShortcut`) é texto visual: se
 *   ele importar para o leitor de tela, ponha `aria-keyshortcuts` no item.
 * - Foco do gatilho: o registro usava `outline-hidden` e só `hover`/
 *   `aria-expanded`, sem indicador de foco por teclado. Agora o gatilho usa o
 *   anel sólido (`focus-visible:ring-3 ring-ring`), desenhado por dentro
 *   (`ring-inset`) por causa da rolagem na barra (veja abaixo).
 * - Itens destacam com `focus:bg-accent focus:text-accent-foreground` (15,6:1
 *   no claro e 14,2:1 no escuro), sem anel, como no `DropdownMenu`.
 * - Item destrutivo em foco: o texto `destructive` sobre `accent` dava 4,3:1
 *   no claro, abaixo de 4,5:1; em foco o texto e o ícone vão a
 *   `destructive-hover` (5,8:1 no claro e 7,7:1 no escuro) e o fundo é
 *   `accent` cheio, no lugar de `destructive/10` e `destructive/20`.
 * - Cores com opacidade do registro trocadas por papéis cheios: contorno
 *   `ring-foreground/5` (e `dark:ring-foreground/10`) por `ring-border` e
 *   separador `bg-border/50` por `bg-border`. Sombra mantida.
 * - Escala do estilo rhea: barra `h-8` e `rounded-2xl`, itens `rounded-xl`.
 *   Paddings, margens e posições lógicos (`ps`/`pe`, `ms`, `start`), e a seta
 *   do submenu gira em RTL. Os menus vão para um portal no `body`: em RTL
 *   isolado, passe `dir` (e `lang`) ao `MenubarContent` e ao
 *   `MenubarSubContent`.
 * - O estado de itens de marcar e de escolher é do Base UI: `checked`/
 *   `defaultChecked` e `value`/`defaultValue` (o indicador ganha
 *   `aria-hidden`; o estado vai por `aria-checked`).
 * - Rolagem na barra (escolha do usuário): quando a barra não cabe na largura,
 *   rola na horizontal dentro da própria barra, em vez de empurrar a página
 *   (a 320px, ou com zoom de 400%). A barra de rolagem fica escondida
 *   (`no-scrollbar`) e a dica de que há mais itens é o `scroll-fade-x` do
 *   shadcn: a borda que tem conteúdo escondido se dissolve, e some quando não
 *   há o que rolar. Nos navegadores sem animações guiadas pela rolagem, vale
 *   o fallback do shadcn, escolhido pelo usuário: as duas pontas ficam
 *   sempre esmaecidas, mesmo quando a barra cabe. Ele segue a direção da leitura em RTL. O
 *   `scroll-px-10` faz o item focado parar fora da zona do fade, e os itens
 *   não encolhem (`shrink-0`). Como o contêiner corta o que passa da borda,
 *   o anel de foco desses itens é desenhado por dentro (`ring-inset`, sem o
 *   afastamento de 2px). Por dentro, ele encosta no fundo do item: 4,7:1
 *   sobre `muted` e 5,2:1 sobre `background` no claro; 5,7:1 e 7,6:1 no
 *   escuro.
 */

// Na barra que rola, o focus() do navegador não rola um item que já aparece
// em parte: ele ficava cortado na borda, dentro do fade. Isto traz o item
// focado para dentro, respeitando o `scroll-padding`. Só age quando a barra
// rola e o alvo está nela no DOM (o conteúdo dos portais fica de fora).
function revelarItemFocado(event: React.FocusEvent<HTMLElement>) {
  const barra = event.currentTarget
  const alvo = event.target
  if (alvo === barra || !barra.contains(alvo)) return
  if (barra.scrollWidth <= barra.clientWidth) return
  alvo.scrollIntoView({ block: "nearest", inline: "nearest" })
}

function Menubar({ className, onFocus, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-8 items-center rounded-2xl border p-[3px] max-w-full overflow-x-auto overflow-y-hidden no-scrollbar scroll-px-10 scroll-fade-x",
        className
      )}
      onFocus={(event) => {
        revelarItemFocado(event)
        onFocus?.(event)
      }}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        "flex shrink-0 items-center rounded-2xl px-1.5 py-[2px] text-sm font-medium outline-hidden select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset aria-expanded:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "min-w-36 rounded-2xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-border duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-border data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/menubar-item min-h-7 gap-2 rounded-xl px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:ps-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-accent data-[variant=destructive]:focus:text-destructive-hover dark:data-[variant=destructive]:focus:bg-accent data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive! data-[variant=destructive]:focus:*:[svg]:text-destructive-hover!",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-7 pe-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute start-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-7 pe-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute start-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1 text-sm text-muted-foreground data-inset:ps-7",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return (
    <DropdownMenuSeparator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuSubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "min-h-7 gap-2 rounded-xl px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-open:bg-accent data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return (
    <DropdownMenuSubContent
      data-slot="menubar-sub-content"
      className={cn(
        "min-w-32 rounded-2xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-border duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-border data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
