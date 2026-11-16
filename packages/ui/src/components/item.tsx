import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Separator } from "@workspace/ui/components/separator"

/*
 * Item — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/item
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Composição: ItemGroup > Item (ItemHeader, ItemMedia, ItemContent >
 *   ItemTitle + ItemDescription, ItemActions, ItemFooter) e ItemSeparator.
 *   Todas as partes expõem `data-slot`; o Item expõe também `data-variant` e
 *   `data-size`.
 * - Link ou ação: a prop `render` troca o `<div>` por outro elemento (useRender
 *   do Base UI). Use `<a href>` para navegar e `<button>` para executar algo;
 *   o foco fica no próprio elemento, e o hover (`[a]:hover:bg-muted`, herdado
 *   do registro) só existe para `<a>`: um `<button>` não muda de fundo no
 *   hover (pendência). Um Item inteiro como link ou botão tem o conteúdo todo
 *   como nome: mantenha título e descrição curtos.
 * - Variante `muted`: o registro usava `bg-muted/50`; virou o papel cheio
 *   `bg-muted` (mist 100 no claro e mist 800 no escuro). O texto fica com
 *   17,7:1 (claro) e 14,3:1 (escuro) em `foreground` e 6,6:1 e 6,1:1 na
 *   descrição (`muted-foreground`). Como `muted` e `accent` são a mesma cor, o
 *   hover (`bg-muted`) de um link `muted` não muda o fundo: o foco é que o
 *   distingue.
 * - Links na descrição: sublinhados em `muted-foreground`; o hover usa
 *   `text-link-hover` (na Brainz Group, Primária 800 no claro, 9,3:1, e 200
 *   no escuro, 13,3:1) no lugar do `text-primary` do registro (no escuro a
 *   Primária 600 dá 3,8:1 no fundo e ~2,9:1 no `muted`), como Field e Empty.
 * - O foco dos links na descrição usa o mesmo anel do projeto (`rounded-sm`), no
 *   lugar do outline do navegador.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como no
 *   Button. Não há anel translúcido.
 * - O ItemGroup tem `role="list"`: cada filho direto precisa de
 *   `role="listitem"`. Um Item que é link não pode receber esse papel (apagaria
 *   o papel de link): envolva-o num `<div role="listitem">`.
 * - O ItemSeparator é um `<div role="none">` com a linha decorativa
 *   (`aria-hidden`) dentro. Assim, dentro de um ItemGroup (`role="list"`), a
 *   lista só contém itens: um `role="separator"` ali reprovava no axe
 *   (`aria-required-children`), e `presentation` direto no Separator reprovava
 *   em `aria-allowed-attr` (o Base UI mantém o `aria-orientation`). O
 *   `className` vai para o contêiner, as demais props para a linha.
 * - O ItemMedia só tem as variantes `default`, `icon` e `image`. A página do
 *   shadcn cita `avatar`, mas o código e o exemplo dela usam o `default` com um
 *   Avatar dentro.
 * - Paddings lógicos e `text-start`: funciona em RTL.
 */
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <div
      role="none"
      data-slot="item-separator"
      className={cn("my-2", className)}
    >
      <Separator aria-hidden="true" orientation="horizontal" {...props} />
    </div>
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-2xl border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [a]:transition-colors [a]:hover:bg-muted",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted",
      },
      size: {
        default: "gap-3.5 px-4 py-3.5",
        sm: "gap-3.5 px-3.5 py-3",
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-xl group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 group-data-[size=xs]/item:rounded-lg [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0.5 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-start text-sm font-normal text-muted-foreground [&>a]:rounded-sm [&>a]:underline [&>a]:underline-offset-4 [&>a]:outline-none [&>a]:focus-visible:ring-3 [&>a]:focus-visible:ring-ring [&>a]:focus-visible:ring-offset-2 [&>a]:focus-visible:ring-offset-background [&>a:hover]:text-link-hover",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
