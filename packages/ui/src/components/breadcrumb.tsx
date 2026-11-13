import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "cn"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

/*
 * Breadcrumb — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/breadcrumb
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - A raiz é um `<nav>` com `aria-label="Trilha de navegação"` (o registro
 *   usava "breadcrumb"). Num app em outro idioma, ou com mais de uma trilha na
 *   página, troque pelo `aria-label` da prop. Os itens ficam numa lista
 *   ordenada (`ol`).
 * - `BreadcrumbLink` é um `<a>` (navegação); para o `<a>` do seu roteador, use
 *   `render`. `BreadcrumbPage` marca a página atual com `aria-current="page"`
 *   (e `role="link"` + `aria-disabled`, como no registro: é um link
 *   desabilitado, não um texto solto).
 * - O link ganhou o anel de foco sólido do projeto (3px, `ring`, afastado 2px
 *   pelo fundo); o registro deixava o outline padrão do navegador. Cores:
 *   links em `muted-foreground` (7,4:1 no claro) e a página atual em
 *   `foreground`. Nenhuma cor com opacidade.
 * - `BreadcrumbSeparator` é decorativo (`role="presentation"` +
 *   `aria-hidden`): o leitor de tela já sabe que é uma lista. A seta padrão
 *   leva `rtl:rotate-180`; um separador próprio (`children`) com ícone de
 *   direção deve levar a mesma classe.
 * - `BreadcrumbEllipsis` NÃO é mais `aria-hidden` (era no registro, o que
 *   escondia também o texto `sr-only`): o ícone é decorativo e o texto
 *   "Mais itens" é lido, porque os itens omitidos são informação. Quando as
 *   reticências ficam dentro de um botão que já tem nome (o menu dos itens
 *   omitidos), passe `aria-hidden="true"` a elas, para o nome não repetir.
 */

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Trilha de navegação"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon className="rtl:rotate-180" />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">Mais itens</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
