"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon, MinusIcon } from "lucide-react"

/*
 * Checkbox — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/checkbox
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Checkbox do Base UI (`role="checkbox"`, `data-checked`,
 *   `aria-checked`). Não tem rótulo: use `Field` + `FieldLabel htmlFor` (ou
 *   `Label`) ligado ao `id`. Sem rótulo visível, dê o nome por `aria-label`.
 * - Contraste não textual (mínimo 3:1 contra o fundo): a caixa desmarcada é
 *   preenchida com `bg-input`, cheio. O registro usava `bg-input/90`, que
 *   mexia nos números. `input` no claro (mist 500): 4,6:1 no branco, 4,2:1 na
 *   `muted` e 3,7:1 sobre o `field`. No escuro (branco a 40%): 3,8:1 no fundo,
 *   3,8:1 no card e 3,6:1 na `muted`. A borda é transparente: o preenchimento
 *   é que vale como limite.
 * - Marcada: `bg-primary` (600) com o ícone `primary-foreground` (5,2:1). A
 *   caixa tem 5,2:1 no branco e 4,2:1 sobre o `field` no claro; no escuro tem
 *   3,8:1 no fundo e 3,4:1 no card.
 * - Indeterminada (`indeterminate`, `aria-checked="mixed"`,
 *   `data-indeterminate`): o mesmo preenchimento da marcada (`primary` com
 *   `primary-foreground`, os mesmos números acima), com um traço
 *   (`MinusIcon`) no lugar da marca de seleção, para não parecer uma caixa
 *   marcada apagada. Inválida e indeterminada, a borda fica `primary`, como
 *   na marcada (`aria-checked:` só casa com `"true"`, por isso a regra
 *   própria).
 * - Anel de foco sólido, 3px, no `ring` (5,2:1 no branco; 7,6:1 no fundo
 *   escuro), afastado 2px pela cor do fundo, como no Button. Dentro de um
 *   `FieldLabel` que envolve o `Field` (cartão de escolha), quem mostra o foco
 *   é o rótulo (`group-has-[:focus-visible]/field-label`).
 * - Inválido (`aria-invalid`): borda `destructive` cheia (4,8:1 no branco no
 *   claro; 6,8:1 no fundo no escuro) e, no foco, o anel passa a `destructive`,
 *   como no Input. O registro usava `ring-3 ring-destructive/20` em repouso e,
 *   no escuro, `border-destructive/50` e `ring-destructive/40`; o anel
 *   permanente saiu e as cores viraram o papel cheio. Marcada e inválida ao
 *   mesmo tempo, a borda fica `primary`. O estado nunca vale só pela cor:
 *   ligue uma mensagem por `aria-describedby`/`aria-errormessage`.
 * - Desabilitado: `disabled:opacity-50`, fora do Tab.
 * - Cartão de escolha (`FieldLabel` do `field.tsx`, que usa `bg-accent` no
 *   hover e marcado no claro, e `bg-card` marcado no escuro, via
 *   `dark:has-data-checked:bg-card`): a caixa desmarcada tem 4,2:1 sobre a
 *   `accent` no claro e 3,6:1 no escuro; marcada (`primary`) tem 4,7:1 sobre
 *   a `accent` no claro e 3,4:1 sobre o `card` no escuro (sobre a `accent`
 *   mist 800 seria 2,9:1, por isso o `card`; valores da Brainz). No SESI escuro a
 *   primária é a Pure 500 com marca escura: 6,17:1 sobre o `card`.
 * - A área de toque passa de 16px: o `after:` estende o alvo em 12px nas
 *   laterais e 8px em cima e embaixo.
 * - Escala do estilo rhea: `size-4` e `rounded-[5px]`. Os ícones da marca de
 *   seleção e do traço são decorativos (`aria-hidden`).
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input transition-shadow outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-transparent after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive aria-invalid:aria-checked:border-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground group-has-[:focus-visible]/field-label:data-indeterminate:border-primary aria-invalid:data-indeterminate:border-primary dark:data-indeterminate:bg-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
          aria-hidden="true"
          className="in-data-indeterminate:hidden"
        />
        <MinusIcon
          aria-hidden="true"
          className="hidden in-data-indeterminate:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
