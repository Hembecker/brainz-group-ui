/*
 * Accordion — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/accordion
 * As cores, o contraste e o raio são os da Big Brain.
 * - Construído sobre o Accordion do Base UI: o gatilho é um <button> dentro de
 *   um heading (`AccordionPrimitive.Header`), expõe `aria-expanded` e
 *   `aria-controls`, e o painel é uma região com nome (`aria-labelledby`).
 *   Enter e Espaço alternam. No Base UI 1.9 não há foco itinerante (mudança
 *   do APG): cada gatilho é uma parada do Tab, e não há setas, Home nem End.
 * - `value` e `defaultValue` são sempre listas; `multiple` deixa abrir vários.
 * - O heading do gatilho é um <h3>, o nível padrão do Base UI. Para ajustar à
 *   página, troque o nível com `render` no `AccordionPrimitive.Header`.
 * - Fundo do item aberto: `bg-muted`, o papel cheio no lugar do `bg-muted/50`
 *   do registro. Sobre `muted`, o texto (`foreground`) tem 17,7:1 no claro e
 *   14,3:1 no escuro, e o ícone (`muted-foreground`) 6,6:1 e 6,1:1.
 * - Foco: o registro usava `outline-none` sem substituto. Agora o gatilho tem o
 *   anel sólido de 3px no `ring`, mas por dentro (`ring-inset`, sem
 *   afastamento), porque a raiz tem `overflow-hidden` e cortaria um anel de
 *   fora. O `ring` tem 3,5:1 no branco e 3,2:1 sobre `muted` no claro; no
 *   escuro, 7,6:1 no fundo e 5,7:1 sobre `muted`.
 * - Item desabilitado: `data-disabled` apaga o gatilho em 50% (o Base UI marca o
 *   `<button>` com `disabled`, então ele sai da ordem do Tab); o estado não
 *   precisa cumprir contraste.
 * - A seta é decorativa (`aria-hidden`); o estado vem de `aria-expanded`. Duas
 *   setas alternam por `group-aria-expanded`, e o `ms-auto` do ícone é lógico
 *   (RTL).
 * - Abrir e fechar animam a altura com a variável do Base UI
 *   (`--accordion-panel-height`). O registro usava `animate-accordion-down/up`
 *   do tw-animate-css, que só lê as variáveis do Radix e de outras bibliotecas:
 *   aqui o painel abria sem transição. Sem animação com movimento reduzido.
 */
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "cn"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border",
        className
      )}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b data-open:bg-muted", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon aria-hidden="true" data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUpIcon aria-hidden="true" data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden px-4 text-sm transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-4 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
