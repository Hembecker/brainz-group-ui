/*
 * Collapsible — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/collapsible
 * Sem estilo próprio: só repassa o Collapsible do Base UI e expõe `data-slot`.
 * - O gatilho recebe o elemento pela prop `render` (um Button, por exemplo) e
 *   expõe `aria-expanded` e `aria-controls`; o painel some do DOM acessível
 *   quando fechado. Enter e Espaço alternam.
 * - `data-panel-open` no gatilho serve para girar a seta
 *   (`group-data-panel-open/button:rotate-180` num Button); `data-open` e
 *   `data-closed` ficam na raiz e no painel.
 * - Um botão só com ícone precisa de nome (texto `sr-only` ou `aria-label`);
 *   a seta ou o ícone é decorativo (`aria-hidden`).
 */
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
