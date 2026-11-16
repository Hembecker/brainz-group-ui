import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

/*
 * Radio Group — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/radio-group
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - `RadioGroup` (`role="radiogroup"`) e `RadioGroupItem` (`role="radio"`)
 *   sobre o Radio Group do Base UI. Setas movem e marcam a seleção; só o item
 *   marcado entra no Tab. O grupo precisa de nome: `FieldSet` + `FieldLegend`,
 *   `aria-labelledby` ou `aria-label`. Cada item precisa de rótulo
 *   (`FieldLabel htmlFor` ↔ `id`).
 * - Contraste não textual (mínimo 3:1 contra o fundo): o círculo desmarcado é
 *   preenchido com `bg-input`, cheio. O registro usava `bg-input/90`. `input`
 *   no claro (mist 500): 4,6:1 no branco, 4,2:1 na `muted` e 3,7:1 sobre o
 *   `field`. No escuro (branco a 40%): 3,8:1 no fundo, 3,8:1 no card e 3,6:1
 *   na `muted`. A borda é transparente: o preenchimento é o limite.
 * - Marcado: `bg-primary` (600) com o ponto `primary-foreground` (5,2:1). O
 *   círculo tem 5,2:1 no branco e 4,2:1 sobre o `field` no claro; no escuro
 *   tem 3,8:1 no fundo e 3,4:1 no card. O ponto é `size-2` e, no escuro,
 *   `size-2.5`, como no registro.
 * - Anel de foco sólido, 3px, no `ring` (5,2:1 no branco; 7,6:1 no fundo
 *   escuro), afastado 2px pela cor do fundo, como no Button. Dentro de um
 *   `FieldLabel` que envolve o `Field` (cartão de escolha), quem mostra o foco
 *   é o rótulo.
 * - Inválido (`aria-invalid`): borda `destructive` cheia (4,8:1 no branco no
 *   claro; 6,8:1 no fundo no escuro) e, no foco, o anel passa a `destructive`,
 *   como no Input. O registro usava `ring-3 ring-destructive/20` em repouso e,
 *   no escuro, `border-destructive/50` e `ring-destructive/40`; o anel
 *   permanente saiu e as cores viraram o papel cheio. Ligue uma mensagem de
 *   erro, porque a cor sozinha não basta.
 * - Desabilitado: `disabled:opacity-50`, fora do Tab (no grupo, `disabled`
 *   desabilita todos os itens).
 * - Cartão de escolha (`FieldLabel` do `field.tsx`): usa `bg-accent` no hover
 *   e marcado no claro, e `bg-card` (mist 900) marcado no escuro, inclusive
 *   com o mouse em cima. O círculo desmarcado tem 4,2:1 sobre a `accent` no
 *   claro e 3,6:1 no escuro; marcado (`primary`) tem 4,7:1 sobre a `accent`
 *   no claro e 3,4:1 sobre o `card` no escuro (Brainz). No SESI escuro a
 *   primária é a Pure 500 com ponto escuro: 6,17:1 sobre o `card`.
 * - Escala do estilo rhea: `size-4` e `rounded-full`, um círculo em qualquer
 *   marca (o `rounded-2xl` do rhea só era círculo com o raio grande da
 *   Brainz). O ponto usa `start-1/2` e `rtl:translate-x-1/2`, então fica centrado em RTL.
 */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-transparent bg-input outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute start-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground rtl:translate-x-1/2 dark:size-2.5" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
