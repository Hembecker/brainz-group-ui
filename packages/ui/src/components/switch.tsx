"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

/*
 * Switch — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/switch
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Switch do Base UI (`role="switch"`, com entrada oculta
 *   para formulários). Não tem rótulo: use `FieldLabel` (ou `Label`) com
 *   `htmlFor` apontando para o `id` do Switch. Espaço alterna.
 * - Contraste não textual (WCAG 1.4.11, mínimo 3:1). O registro pintava o trilho
 *   desligado com `bg-input/90`; foi trocado pelo papel cheio `bg-input`:
 *   - desligado, claro: trilho `input` (mist 500) 4,6:1 no branco (com /90 seria
 *     3,8:1); polegar branco 4,6:1 sobre o trilho;
 *   - desligado, escuro: trilho `input` (branco a 40%) 3,8:1 no fundo e no card
 *     (com /90 seria 3,3:1 no fundo); polegar `foreground` 5,0:1 sobre o trilho
 *     no fundo e 4,4:1 no card;
 *   - ligado: trilho `primary` (600) 5,2:1 no branco, 3,8:1 no fundo escuro e
 *     3,4:1 no card escuro; polegar branco 5,2:1 sobre o trilho nos dois modos.
 *   O estado nunca depende só da cor: o polegar muda de lado (e, em RTL, de
 *   sentido) e o `role="switch"` expõe `aria-checked`.
 * - Dentro de um `FieldLabel` em cartão (choice card), o fundo do cartão é
 *   cheio (field.tsx): o trilho desligado tem 4,1:1 (claro) e 3,6:1 (escuro)
 *   sobre o cartão em hover, e o ligado 4,7:1 (claro, sobre `accent`) e
 *   3,4:1 (escuro, sobre `card`).
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como no
 *   Button. Dentro de um `FieldLabel` em cartão, o anel passa para o cartão.
 * - Inválido (`aria-invalid`): borda `destructive` cheia (também no desligado,
 *   por `data-unchecked:aria-invalid`) e o anel de foco passa a `destructive`.
 *   O registro usava `ring-destructive/20` e, no escuro, `border-destructive/50`
 *   e `ring-destructive/40`; foram trocados pelo papel cheio. Ligue também uma
 *   mensagem por `aria-describedby` e `aria-errormessage`.
 * - Desabilitado: `data-disabled:opacity-50` e fora do Tab.
 * - A área de toque passa do desenho por um `::after` (12px nas laterais e 8px
 *   em cima e embaixo).
 * - Tamanhos: `default` (20px de altura, 32px de largura) e `sm` (16px por
 *   24px), expostos em `data-size`. O raio é `rounded-2xl`, a escala do rhea.
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-2xl border-2 transition-all outline-none group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive data-[size=default]:h-5 data-[size=default]:w-8 data-[size=sm]:h-4 data-[size=sm]:w-6 data-checked:border-primary data-checked:bg-primary group-has-[:focus-visible]/field-label:data-checked:border-primary data-unchecked:border-transparent data-unchecked:bg-input data-unchecked:aria-invalid:border-destructive group-has-[:focus-visible]/field-label:data-unchecked:border-transparent data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-2xl bg-background shadow-sm ring-0 transition-transform not-dark:bg-clip-padding group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:translate-x-[calc(100%-4px)] rtl:data-checked:-translate-x-[calc(100%-4px)] dark:data-checked:bg-primary-foreground data-unchecked:translate-x-0 rtl:data-unchecked:-translate-x-0 dark:data-unchecked:bg-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
