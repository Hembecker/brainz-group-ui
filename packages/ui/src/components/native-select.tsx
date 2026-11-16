import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

/*
 * NativeSelect — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/native-select
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - É um <select> nativo (`appearance-none`) com um ícone de seta por cima, num
 *   wrapper `div`. Todas as props do <select> vão para o <select>; `className`
 *   vai para o wrapper. `size` é "sm" | "default" (a prop nativa `size` foi
 *   substituída). Para um seletor estilizado, use o `Select`. Não tem rótulo: use
 *   `Field` + `FieldLabel` (ou `Label`) com `htmlFor`/`id`.
 * - Campo com o papel `field` e a borda no papel `field-border`, como o Input.
 *   Na Brainz Group a borda é transparente nos dois modos, e o limite do campo
 *   tem 1,25:1 no claro e 1,33:1 no escuro, abaixo dos 3:1 de uma borda:
 *   escolha do usuário (veja os tokens). No SESI claro o campo é branco, com
 *   borda `#DFDFDF` (1,33:1 no branco, escolha do usuário); no SESI escuro a borda continua
 *   transparente. A seta é `muted-foreground` (Brainz Group: 5,9:1 e 6,1:1 sobre
 *   o `field`; SESI claro: 5,9:1 no campo branco) e leva `aria-hidden="true"`.
 * - Escala do estilo rhea: `h-8` (32px, `sm` com `h-7`) e `rounded-2xl` (~13px).
 *   Paddings e posição da seta lógicos (`ps`/`pe`, `end`), então funciona em RTL.
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como no
 *   Button. Nunca o `ring/30` do preset.
 * - Inválido (`aria-invalid`): borda e anel de foco `destructive` cheios. O
 *   registro usava `ring-destructive/20` e, no escuro, `border-destructive/50` e
 *   `ring-destructive/40`; foram trocados por papéis cheios (3,8:1 e 5,1:1
 *   sobre o `field` na Brainz Group; 4,7:1 no campo branco do SESI claro).
 *   Ligue uma mensagem por `aria-describedby` e `aria-errormessage`.
 * - O texto escolhido é sempre `text-foreground`: dentro de um `Field` com
 *   `data-invalid` ele herdaria o vermelho do erro (3,8:1 sobre o `field`).
 * - As opções usam `bg-[Canvas] text-[CanvasText]`, as cores do sistema, porque a
 *   lista aberta é desenhada pelo navegador.
 * - Desabilitado: o wrapper aplica `opacity-50` e o <select> sai do Tab.
 */
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-8 w-full min-w-0 appearance-none rounded-2xl border border-field-border bg-field py-1 ps-2.5 pe-8 text-sm text-foreground transition-[color,box-shadow] duration-200 outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-destructive data-[size=sm]:h-7"
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
