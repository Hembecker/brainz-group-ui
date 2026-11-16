"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"

/*
 * Combobox — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/combobox
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Combobox do Base UI: um campo de texto com `role=
 *   "combobox"` que filtra a lista (`listbox`, num portal) enquanto a pessoa
 *   digita. O foco fica no campo; as setas movem o destaque (`aria-activedescendant`),
 *   Enter escolhe e Esc fecha. `ComboboxEmpty` tem `role="status"` e
 *   `aria-live="polite"` (o Base UI o mantém montado): o "nenhum resultado" é
 *   anunciado sem tirar o foco. Com a lista aberta o Base UI marca o resto da
 *   página como `aria-hidden`, inclusive o rótulo: com `aria-describedby` no
 *   campo, ligue o rótulo também por `aria-labelledby` (veja a MDX).
 * - Nome acessível: o campo precisa de um rótulo persistente. Ligue um
 *   `FieldLabel` pelo `htmlFor` ao `id` do `ComboboxInput` (ou do
 *   `ComboboxChipsInput`, ou do `ComboboxTrigger` no modo popup). O placeholder
 *   nunca é o rótulo.
 * - Botões só com ícone ganharam nome fixo, em português (como o "Fechar" do
 *   Dialog): o gatilho do `ComboboxInput` é "Mostrar opções", o
 *   `ComboboxClear` é "Limpar seleção" e o `ComboboxChip` remove com "Remover
 *   <texto do chip>" (o nome junta o "Remover" ao texto do chip por
 *   `aria-labelledby`, por isso o conteúdo do chip fica num `span`). Esses
 *   três nomes são fixos: o `ComboboxInput` não repassa props à seta nem ao
 *   limpar, e o `ComboboxClear` não é exportado (como no shadcn). Para outro
 *   idioma, use `showTrigger={false}` / `showClear={false}` e ponha os seus
 *   botões nos filhos do `ComboboxInput`, num `InputGroupAddon`: um
 *   `ComboboxTrigger` com o seu `aria-label` e `tabIndex={-1}` e um
 *   `ComboboxPrimitive.Clear` com o seu `aria-label`; no chip, use
 *   `showRemove={false}` e o seu `ChipRemove`. O gatilho do modo popup não
 *   leva nome fixo: o nome vem do rótulo (um `ComboboxTrigger` avulso aceita
 *   `aria-label`).
 * - A seta, o limpar e o remover do chip têm `tabIndex={-1}`: o campo é a
 *   parada do teclado (como no combobox editável do WAI-ARIA) e, com a lista
 *   aberta, o Base UI marca esses botões como `aria-hidden`; focáveis, eles
 *   reprovariam no axe (`aria-hidden-focus`). Pelo teclado, apague o texto do
 *   campo para limpar; nos chips, ← (→ em RTL, com o `DirectionProvider`) no
 *   campo vazio foca o último chip e Delete o remove.
 * - Campo preenchido com o papel `field` e a borda `--field-border`, como o
 *   Input (o `ComboboxInput` usa o `InputGroup`): a borda é transparente na
 *   Brainz Group (claro e escuro) e no SESI escuro, e contornada no SESI
 *   claro (`#DFDFDF`, 1,33:1 no branco: escolha do usuário). `ComboboxChips` tem a mesma pele e
 *   altura mínima `h-8`, `rounded-2xl`.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo
 *   (`focus-within:` nos chips), como no Input. Nunca o `ring/30`.
 * - Inválido (`aria-invalid` no campo): borda `destructive` cheia e o anel de
 *   foco passa a `destructive`, como no Input (nos chips, por
 *   `has-aria-invalid:`). O registro usava `ring-destructive/20` e, no escuro,
 *   `border-destructive/50` e `ring-destructive/40`; foram trocados por papéis
 *   cheios. Ligue a mensagem por `aria-describedby` e `aria-errormessage`. No
 *   `ComboboxInput` a borda e o anel vêm do `InputGroup`.
 * - O texto digitado e o placeholder dos chips são `text-foreground` e
 *   `text-muted-foreground` (5,9:1 e 6,1:1 sobre o `field`): dentro de um
 *   `Field` com `data-invalid` o texto herdaria o vermelho do erro.
 * - Chip: `bg-secondary` com `text-secondary-foreground` (7,7:1 no claro e
 *   9,0:1 no escuro), no lugar de `bg-input dark:bg-input/60` do registro (no
 *   escuro o `input` é branco a 40%, sem contraste com o texto). O botão de
 *   remover não tem mais `opacity-50`, que apagava o ícone.
 * - Lista: fundo `popover`, contorno `ring-border` cheio, no lugar de
 *   `ring-foreground/5` e `dark:ring-foreground/10`. A sombra continua. No modo
 *   popup (campo de busca dentro da lista) saiu o `border-input/30` do campo.
 *   Item destacado com `data-highlighted:bg-accent`, sem anel.
 * - A lista vai para um portal no `body`: a classe `dark` e o `dir` do
 *   `<html>` chegam a ela, mas um `dir` posto num ancestral do campo não. Num
 *   exemplo RTL isolado, passe `dir` (e `lang`) ao `ComboboxContent`.
 * - Paddings, margens e cantos lógicos (`ps`/`pe`, `ms`, `end-2`), para
 *   funcionar em RTL.
 * - `useComboboxAnchor` devolve o `ref` que ancora a lista nos chips
 *   (`ComboboxContent anchor={…}`).
 */

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      aria-label="Limpar seleção"
      tabIndex={-1}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            aria-label="Mostrar opções"
            tabIndex={-1}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-lg ring-1 ring-border duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:bg-field *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-1 rounded-2xl border border-field-border bg-field bg-clip-padding px-2.5 py-1 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background has-aria-invalid:border-destructive has-aria-invalid:ring-destructive has-data-[slot=combobox-chip]:px-1",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  const id = React.useId()
  const textId = `${id}-text`
  const removeId = `${id}-remove`

  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-2xl bg-secondary px-1.5 text-xs font-medium whitespace-nowrap text-secondary-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0.5",
        className
      )}
      {...props}
    >
      <span id={textId}>{children}</span>
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          id={removeId}
          tabIndex={-1}
          aria-label="Remover"
          aria-labelledby={`${removeId} ${textId}`}
          className="-ms-0.5 size-4.5 aria-disabled:pointer-events-none"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "min-w-16 flex-1 text-foreground outline-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
