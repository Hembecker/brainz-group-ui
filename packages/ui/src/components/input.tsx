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
 * - Preenchimento pelo papel `field` e borda pelo token `--field-border`
 *   (`border-field-border`), como no rhea. Na Brainz Group o campo é
 *   preenchido (mist 200 no claro e 800 no escuro) e a borda é transparente:
 *   o limite tem 1,25:1 no claro e 1,33:1 no escuro, abaixo dos 3:1 de uma
 *   borda, escolha do usuário (veja os tokens). No SESI claro o campo é branco
 *   com borda Neutral/300 (`#DFDFDF`, 1,33:1, escolha do usuário); o SESI escuro segue a Brainz.
 *   O foco (`border-ring`) e o inválido (`border-destructive`) ficam por cima.
 *   Placeholder em `muted-foreground` (na Brainz, 5,9:1 e 6,1:1 sobre o
 *   `field`).
 * - Escala do estilo rhea: `h-8` (32px) e `rounded-2xl` (~13px). Paddings
 *   simétricos, então o campo funciona em RTL.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como
 *   no Button. Nunca o `ring/30` do preset.
 * - Inválido (`aria-invalid`): borda `destructive` cheia e o anel de foco passa
 *   a `destructive`. O registro usava `ring-destructive/20` e, no escuro,
 *   `border-destructive/50` e `ring-destructive/40`; foram trocados por papéis
 *   cheios. Na Brainz, a borda tem 3,8:1 sobre o `field` no claro e 5,1:1 no
 *   escuro. O estado nunca vale só pela cor: ligue uma mensagem por
 *   `aria-describedby` e `aria-errormessage`.
 * - O texto digitado é sempre `text-foreground`. O `Field` inválido já só
 *   pinta o rótulo e o erro de vermelho; a classe fica como proteção, porque o
 *   vermelho sobre o `field` teria 3,8:1 na Brainz, abaixo dos 4,5:1 exigidos.
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
        "h-8 w-full min-w-0 rounded-2xl border border-field-border bg-field px-2.5 py-1 text-base text-foreground transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
