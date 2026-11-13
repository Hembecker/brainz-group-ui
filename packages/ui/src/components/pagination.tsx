import * as React from "react"
import { cn } from "cn"

import {
  buttonVariants,
  type ButtonProps,
} from "@workspace/ui/components/button"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

/*
 * Pagination — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/pagination
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - A raiz é um `<nav>` com `aria-label="Paginação"` (o registro usava
 *   "pagination"); troque pelo `aria-label` da prop se houver mais de uma
 *   paginação na página. Os itens ficam numa lista (`ul`).
 * - Textos fixos em português: "Anterior" e "Próxima" (prop `text`, para
 *   outro idioma), `aria-label` "Ir para a página anterior" e "Ir para a
 *   próxima página", e "Mais páginas" nas reticências. A página atual leva
 *   `aria-current="page"`. Um link só com número pode ganhar um nome mais
 *   claro por `aria-label` ("Ir para a página 3").
 * - `PaginationLink` é um `<a>` com `buttonVariants` (variante `outline` na
 *   página atual, `ghost` nas outras), não `<Button render={<a />}>` como no
 *   registro: o Button do Base UI põe `role="button"` e o link deixava de ser
 *   um link (veja o Button). Ganha `data-variant` e `data-size`, como o
 *   Button. Para o `<a>` do seu roteador, componha `buttonVariants` nele.
 * - Foco: o anel sólido de 3px do `buttonVariants`, afastado 2px pelo fundo.
 * - As setas de "Anterior" e "Próxima" levam `rtl:rotate-180`, e o espaçamento
 *   dos ícones é lógico (`ps`/`pe`, `data-icon`). O texto some abaixo de `sm`
 *   (fica só a seta), mas o `aria-label` mantém o nome.
 * - `PaginationEllipsis` NÃO é mais `aria-hidden` (era no registro, o que
 *   escondia também o texto `sr-only`): o ícone é decorativo e "Mais páginas"
 *   é lido. Nenhuma cor com opacidade.
 */

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  const variant = isActive ? "outline" : "ghost"
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  text = "Anterior",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Ir para a página anterior"
      size="default"
      className={cn("ps-1.5!", className)}
      {...props}
    >
      <ChevronLeftIcon aria-hidden="true" data-icon="inline-start" className="rtl:rotate-180" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Próxima",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Ir para a próxima página"
      size="default"
      className={cn("pe-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:rotate-180" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">Mais páginas</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
