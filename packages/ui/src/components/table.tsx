import * as React from "react"
import { cn } from "cn"

/*
 * Table — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/table
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Composição: Table (um `<div>` com rolagem horizontal em volta do
 *   `<table>`) > TableCaption, TableHeader > TableRow > TableHead, TableBody >
 *   TableRow > TableCell e TableFooter. Todas as partes expõem `data-slot`.
 * - Nome acessível: a tabela precisa de um nome. O TableCaption (`<caption>`)
 *   é o jeito certo; sem legenda visível, use `aria-label` ou `aria-labelledby`
 *   na Table (as props vão para o `<table>`).
 * - Cabeçalhos: o TableHead passa a ter `scope="col"` por padrão (o registro
 *   não punha nenhum). Num cabeçalho de linha, dentro do TableBody, passe
 *   `scope="row"`. Um `scope` passado pelo uso vale sobre o padrão.
 * - Fundos com opacidade do registro viraram o papel cheio `muted` (mist 100 no
 *   claro e mist 800 no escuro): rodapé (`bg-muted/50`), hover da linha e linha
 *   com um menu aberto (`has-aria-expanded`). O texto do rodapé fica com 17,7:1
 *   (claro) e 14,3:1 (escuro). Como o hover e a linha selecionada
 *   (`data-[state=selected]`) agora têm a mesma cor, quem seleciona linhas deve
 *   mostrar isso também por outro meio (uma caixa marcada, um texto): a cor
 *   sozinha não basta (WCAG 1.4.1).
 * - Alinhamento: use `text-end` (não `text-right`) nas colunas numéricas, para
 *   funcionar em RTL. Cabeçalhos e células usam `text-start` e `pe-0` lógicos.
 * - O contêiner de rolagem não aceita props. Se a tabela puder rolar na
 *   horizontal, o teclado precisa de um jeito de rolá-la: veja a página Docs.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted has-aria-expanded:bg-muted data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({
  scope = "col",
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn(
        "h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
