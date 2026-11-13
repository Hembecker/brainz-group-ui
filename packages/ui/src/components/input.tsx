import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

/*
 * Input — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/input
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Input do Base UI, que repassa todas as props de um
 *   <input> (`type`, `disabled`, `required`, `aria-*`…). Não tem rótulo:
 *   use `Field` + `FieldLabel` (ou `Label`) com `htmlFor`/`id`. O placeholder
 *   nunca é o rótulo.
 * - Campo preenchido, sem borda, com o papel `field` (mist 200 no claro e 800
 *   no escuro), como no rhea. O limite do campo tem 1,25:1 no claro e 1,33:1
 *   no escuro, abaixo dos 3:1 de uma borda: escolha do usuário (veja os tokens).
 *   Placeholder em `muted-foreground` (5,9:1 e 6,1:1 sobre o `field`).
 * - Escala do estilo rhea: `h-8` (32px) e `rounded-2xl` (~13px). Paddings
 *   simétricos, então o campo funciona em RTL.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como
 *   no Button. Nunca o `ring/30` do preset.
 * - Inválido (`aria-invalid`): borda `destructive` cheia e o anel de foco passa
 *   a `destructive`. O registro usava `ring-destructive/20` e, no escuro,
 *   `border-destructive/50` e `ring-destructive/40`; foram trocados por papéis
 *   cheios. A borda tem 3,8:1 sobre o `field` no claro e 5,1:1 no escuro. O
 *   estado nunca vale só pela cor: ligue uma mensagem por `aria-describedby` e
 *   `aria-errormessage`.
 * - O texto digitado é sempre `text-foreground`. O `Field` inválido já só
 *   pinta o rótulo e o erro de vermelho; a classe fica como proteção, porque o
 *   vermelho sobre o `field` teria 3,8:1, abaixo dos 4,5:1 exigidos.
 * - Desabilitado: `disabled:opacity-50` e fora do Tab. Para mostrar um valor
 *   sem edição, use `readOnly`.
 * - Dentro de um InputGroup, o `InputGroupInput` reaproveita este componente.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-2xl border border-transparent bg-field px-2.5 py-1 text-base text-foreground transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
