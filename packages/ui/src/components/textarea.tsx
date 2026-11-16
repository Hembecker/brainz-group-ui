import * as React from "react"
import { cn } from "cn"

/*
 * Textarea — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/textarea
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - É um <textarea> nativo, que aceita todas as props dele (`rows`,
 *   `disabled`, `required`, `maxLength`, `aria-*`…). Não tem rótulo: use `Field` +
 *   `FieldLabel` (ou `Label`) com `htmlFor`/`id`. O placeholder nunca é o rótulo.
 * - Campo preenchido com o papel `field` (mist 200 no claro e 800 no escuro),
 *   como o Input; a borda é o token `--field-border` (`border-field-border`):
 *   transparente na Brainz Group nos dois modos (limite do campo de 1,25:1 no
 *   claro e 1,33:1 no escuro, abaixo dos 3:1 de uma borda: escolha do usuário,
 *   veja os tokens) e `#DFDFDF` no SESI claro (1,33:1 no branco do campo); no
 *   SESI escuro continua transparente.
 *   Placeholder em `muted-foreground` (5,9:1 e 6,1:1 sobre o `field` da Brainz).
 * - Escala do estilo rhea: `rounded-2xl` (~13px) e altura mínima de 64px
 *   (`min-h-16`). Cresce com o conteúdo (`field-sizing-content`) e não tem alça de
 *   redimensionar (`resize-none`). Paddings simétricos, então funciona em RTL.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como no
 *   Button. Nunca o `ring/30` do preset.
 * - Inválido (`aria-invalid`): borda e anel de foco `destructive` cheios. O
 *   registro usava `ring-destructive/20` e, no escuro, `border-destructive/50` e
 *   `ring-destructive/40`; foram trocados por papéis cheios (borda com 3,8:1 sobre
 *   o `field` no claro e 5,1:1 no escuro). O estado nunca vale só pela cor: ligue
 *   uma mensagem por `aria-describedby` e `aria-errormessage`.
 * - O texto digitado é sempre `text-foreground`. O `Field` inválido já só
 *   pinta o rótulo e o erro de vermelho; a classe fica como proteção, porque o
 *   vermelho sobre o `field` teria 3,8:1, abaixo dos 4,5:1 exigidos.
 * - Desabilitado: `disabled:opacity-50` e fora do Tab. Para mostrar um texto sem
 *   edição, use `readOnly`.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-2xl border border-field-border bg-field px-2.5 py-2 text-base text-foreground transition-[color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
