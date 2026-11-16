import * as React from "react"
import { cn } from "cn"

/*
 * Message — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/message
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - É só layout, sem primitivo e sem comportamento: a linha de uma mensagem
 *   (avatar, conteúdo, cabeçalho e rodapé). Composição: Message >
 *   MessageAvatar e MessageContent > MessageHeader, Bubble e MessageFooter;
 *   MessageGroup empilha mensagens seguidas do mesmo autor. Todas as partes
 *   expõem `data-slot`; o Message expõe `data-align` (`start` ou `end`).
 * - Semântica: nenhuma parte tem papel. Quem monta a conversa dá a estrutura:
 *   uma lista com nome (`role="list"` + `role="listitem"` em cada Message) ou,
 *   numa conversa que cresce, o `MessageScrollerContent`, que já é
 *   `role="log"`. Cada mensagem precisa dizer quem escreveu: o `MessageHeader`
 *   com o nome, um `Avatar` com `role="img"` e `aria-label`, ou um texto
 *   `sr-only` ("Você:") dentro do balão. Status que muda ("Maria está
 *   digitando…") vai num `Marker role="status"`, fora da lista.
 * - Botões do `MessageFooter` (copiar, repetir, curtir) são só ícone: cada um
 *   precisa de `aria-label` específico, com o ícone `aria-hidden`.
 * - Sem cor com opacidade (o registro não tinha). `MessageHeader` e
 *   `MessageFooter` usam `muted-foreground` em `text-xs`: 7,4:1 no fundo e no
 *   card, 6,6:1 sobre `muted` (claro); 8,1:1 / 6,1:1 no escuro. O avatar usa
 *   `bg-muted`.
 * - Direção: o `align="end"` usa `flex-row-reverse` e o rodapé usa
 *   `justify-end`, que seguem o `dir`; os recuos são `px-*`, simétricos.
 * - Lado do cabeçalho: em `align="end"`, o `MessageContent` leva todo filho
 *   com `data-slot` ao fim (`self-end`), inclusive o `MessageHeader`. É o
 *   código do registro, mantido como está; o texto da API do shadcn diz que o
 *   cabeçalho fica no início, mas o código dele faz o mesmo que este. Para
 *   prendê-lo no início, troque a classe por
 *   `group-data-[align=end]/message:*:data-slot:not-data-[slot=message-header]:self-end`.
 */

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        className
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0",
        className
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className
      )}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}
