"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"

/*
 * InputGroup — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/input-group
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Composição: `InputGroup` > `InputGroupInput` (ou `InputGroupTextarea`) +
 *   `InputGroupAddon` (ícone, texto, botão ou kbd) + `InputGroupButton` +
 *   `InputGroupText`. O addon vem DEPOIS do campo no DOM e o `align` o
 *   posiciona; assim o foco (e a leitura) começa pelo campo. Um controle de
 *   terceiros entra com `data-slot="input-group-control"`.
 * - O rótulo é do campo, não do grupo: `FieldLabel htmlFor` ↔ `id` do
 *   `InputGroupInput`. O texto do addon pode descrever o campo por
 *   `aria-describedby`; ícone decorativo leva `aria-hidden="true"` e botão só
 *   com ícone leva `aria-label`.
 * - O grupo desenha o campo, como o Input: papel `field` (mist 200 no claro e
 *   800 no escuro) e borda `border-field-border`. O controle interno fica
 *   transparente, sem borda nem anel. Na Brainz Group a borda é transparente
 *   e o limite do campo tem 1,25:1 no claro e 1,33:1 no escuro: escolha do
 *   usuário (veja os tokens). No SESI claro o campo é branco com borda
 *   `#DFDFDF` (1,33:1, escolha do usuário); no SESI escuro a borda é transparente.
 * - Anel de foco no GRUPO, via `has-[[data-slot=input-group-control]:focus-visible]`:
 *   sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como no Input.
 *   O controle interno zera também o `ring-offset` herdado do Input e do
 *   Textarea; sem isso ele pintaria um halo de 2px na cor do fundo dentro do
 *   grupo.
 * - Inválido (`aria-invalid` no controle): borda `destructive` cheia e, com o
 *   foco, o anel passa a `destructive`, como no Input. O registro usava
 *   `ring-3 ring-destructive/20` sempre ligado e, no escuro, `/40`; foram
 *   trocados por papéis cheios (borda com 3,8:1 sobre o `field` no claro e 5,1:1
 *   no escuro). Ligue uma mensagem por `aria-describedby` e `aria-errormessage`.
 * - O `kbd` dentro de um addon usa um fundo cheio no lugar do
 *   `bg-muted-foreground/10` do registro: `bg-muted` no claro (destaca a tecla
 *   também no campo branco do SESI) e `bg-background` no escuro (a `muted` é a
 *   mesma mist 800 do `field`). O texto do addon é `muted-foreground` (5,9:1 e
 *   6,1:1 sobre o `field`).
 * - Escala do estilo rhea: grupo `h-8` e `rounded-2xl`; `InputGroupButton`
 *   `xs` (24px), `sm`, `icon-xs` e `icon-sm`. Paddings e margens lógicos
 *   (`ps`/`pe`, `ms`/`me`), então o grupo funciona em RTL.
 * - O addon é `role="group"` e clicar nele (fora de um botão) foca o
 *   `<input>` do grupo. Não coloque um elemento interativo dentro de um botão.
 */

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-2xl border border-field-border bg-field transition-[color,box-shadow] duration-200 outline-none in-data-[slot=combobox-content]:focus-within:border-inherit has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:has-[[data-slot=input-group-control]:focus-visible]:border-destructive has-[[data-slot][aria-invalid=true]]:has-[[data-slot=input-group-control]:focus-visible]:ring-destructive has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=inline-start]]:[&>input]:ps-1.5",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-2xl **:data-[slot=kbd]:bg-muted **:data-[slot=kbd]:px-1.5 dark:**:data-[slot=kbd]:bg-background [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-2 has-[>button]:ms-[-0.3rem] has-[>kbd]:ms-[-0.15rem]",
        "inline-end":
          "order-last pe-2 has-[>button]:me-[-0.3rem] has-[>kbd]:me-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 rounded-2xl text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-xl px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs": "size-6 rounded-xl p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
