import * as React from "react"
import { createPortal } from "react-dom"
import { Command as CommandPrimitive, useCommandState } from "cmdk"
import { cn } from "cn"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@workspace/ui/components/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"

/*
 * Command — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/command
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o `cmdk` (não sobre o Base UI): um campo de busca
 *   (`role="combobox"`) e uma lista (`role="listbox"`) de itens
 *   (`role="option"`). O foco fica no campo; as setas movem o destaque
 *   (`aria-activedescendant`), Enter escolhe. `CommandDialog` põe o comando
 *   num `Dialog` (foco preso, Esc fecha, foco devolvido ao gatilho).
 * - Nome acessível: o campo de busca precisa de nome, e o placeholder nunca é
 *   o rótulo. Passe `label` ao `Command`: o cmdk o liga ao campo por um
 *   `<label>` invisível (`aria-labelledby`). Um `aria-label` no `CommandInput`
 *   NÃO funciona, porque o cmdk põe o `aria-labelledby` depois das props e ele
 *   vence. Sem `label`, o campo fica sem nome. A lista tem o nome padrão
 *   "Resultados" (o cmdk usa "Suggestions"); troque com a prop `label` no
 *   `CommandList`.
 * - Lista vazia anunciada: o `Command` mantém sempre montada uma região
 *   `role="status"` (`aria-live="polite"`, `sr-only`, `data-slot="command-status"`)
 *   FORA da lista, e o `CommandEmpty` joga o texto dele nela por um portal
 *   quando não há itens (o cmdk desmontaria o `CommandEmpty` com resultados,
 *   e uma região que nasce já com texto é anunciada de forma irregular). O
 *   texto visível continua dentro da lista, com `aria-hidden`, para não ser
 *   lido duas vezes. A região não pode ficar dentro do `listbox`: o axe
 *   reprova (`aria-required-children`).
 * - `CommandSeparator` é um `div` próprio (`role="presentation"`), não o
 *   Separator do cmdk: o do cmdk fixa `role="separator"`, que não é filho
 *   permitido de um `listbox` (axe `aria-required-children`). Ele repete o
 *   comportamento do cmdk (some enquanto há busca; `alwaysRender` mantém).
 * - Destaque do item: `data-[selected=true]` (o cmdk escreve
 *   `data-selected="false"` nos outros, então `data-selected:` pintaria todos)
 *   com os papéis `accent` e `accent-foreground` (15,6:1 no claro e 14,2:1 no
 *   escuro), como os itens de menu; no lugar de `muted`/`foreground` do
 *   registro. O destaque é um fundo, sem anel de foco. O atalho fica em
 *   `muted-foreground` (6,6:1 sobre o `accent` no claro, 6,1:1 no escuro) e
 *   vai a `accent-foreground` no item destacado.
 * - Campo de busca: o `InputGroup` desenha o fundo (`field`); o `cmdk` não
 *   tem `data-slot="input-group-control"`, então o anel de foco sólido do
 *   grupo é ligado aqui por `has-[[data-slot=command-input]:focus-visible]`
 *   (3px, `ring`, afastado 2px). Placeholder em `muted-foreground` e texto
 *   `foreground`; a lupa é decorativa (`aria-hidden`), sem `opacity-50`.
 * - Cores com opacidade do registro trocadas: separador `bg-border/50` por
 *   `bg-border` e lupa `opacity-50` por `muted-foreground` cheio.
 * - `CommandDialog`: título e descrição (`sr-only`) agora ficam DENTRO do
 *   `DialogContent` (o registro os punha fora, e o título invisível aparecia
 *   na página com o diálogo fechado), com padrão em português ("Paleta de
 *   comandos"). Passe `title` e `description` específicos. O resto vem do
 *   `Dialog` (véu `bg-black/30`, contorno `ring-border`).
 * - Escala do estilo rhea: campo `h-8`, itens `rounded-xl` (`rounded-2xl` no
 *   diálogo), paddings e margens lógicos, então funciona em RTL (passe `dir`
 *   ao `Command` e ao `CommandInput`).
 */

const CommandStatusContext = React.createContext<HTMLElement | null>(null)

function Command({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  const [status, setStatus] = React.useState<HTMLElement | null>(null)

  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-3xl bg-popover p-1 text-popover-foreground",
        className
      )}
      {...props}
    >
      <CommandStatusContext.Provider value={status}>
        {children}
      </CommandStatusContext.Provider>
      <div
        ref={setStatus}
        data-slot="command-status"
        role="status"
        aria-live="polite"
        className="sr-only"
      />
    </CommandPrimitive>
  )
}

function CommandDialog({
  title = "Paleta de comandos",
  description = "Procure um comando para executar...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-3xl! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-8! bg-field has-[[data-slot=command-input]:focus-visible]:border-ring has-[[data-slot=command-input]:focus-visible]:ring-3 has-[[data-slot=command-input]:focus-visible]:ring-ring has-[[data-slot=command-input]:focus-visible]:ring-offset-2 has-[[data-slot=command-input]:focus-visible]:ring-offset-background">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      label="Resultados"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const empty = useCommandState((state) => state.filtered.count === 0)
  const status = React.useContext(CommandStatusContext)

  return (
    <>
      {empty ? (
        <div
          data-slot="command-empty"
          aria-hidden="true"
          className={cn("py-6 text-center text-sm", className)}
          {...props}
        >
          {children}
        </div>
      ) : null}
      {status ? createPortal(empty ? children : null, status) : null}
    </>
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  alwaysRender,
  ...props
}: React.ComponentProps<"div"> & { alwaysRender?: boolean }) {
  const searching = useCommandState((state) => state.search !== "")

  if (searching && !alwaysRender) return null

  return (
    <div
      data-slot="command-separator"
      role="presentation"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-2xl data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[selected=true]:*:[svg]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon
        aria-hidden="true"
        className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground group-data-[selected=true]/command-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
