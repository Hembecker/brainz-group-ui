import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Button — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/button
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Button do Base UI: `render` troca o elemento,
 *   `nativeButton` diz se esse elemento é um <button> de verdade e
 *   `focusableWhenDisabled` mantém um botão desabilitado na ordem do Tab.
 * - Ícones ao lado do rótulo levam `data-icon="inline-start"` ou
 *   `"inline-end"`, que reduz o padding daquele lado. Paddings e cantos são
 *   lógicos (ps/pe, rounded-s/e), então o botão funciona em RTL.
 * - Carregamento é composição: `<Spinner data-icon="inline-start" />` num
 *   botão `disabled` (veja o Spinner). `data-disabled` também apaga o botão,
 *   para o caso `disabled focusableWhenDisabled`.
 * - Links: `buttonVariants()` num <a> comum, não `render={<a />}`, para o
 *   link manter o próprio papel.
 * - Escala do estilo rhea (escolha do usuário em 2026-11-13): raio
 *   `rounded-2xl` (--radius × 1,8, ~13px); alturas xs 24 / sm 28 / default 32
 *   / lg 36 e os quadrados `icon-*` (com `rounded-full` para um botão de
 *   ícone redondo).
 * - O preenchimento primário é `primary` (Primária 600 com branco, 5,2:1, nos
 *   dois modos). Destrutivo é sólido, não o `destructive/10` do
 *   preset: red 600 com branco (4,8:1); no escuro, red 400 com mist 950 (6,8:1).
 * - Outline no escuro, como no shadcn: borda `input` (branco a 40%, 3,8:1) e
 *   um preenchimento leve `bg-input/30`, para o botão se destacar do fundo. O
 *   texto sobre ele tem ~14:1. É a única cor com opacidade aqui.
 * - Um único anel de foco para todas as variantes: sólido, 3px, no `ring`,
 *   afastado 2px pela cor do fundo. Nunca o `ring/30` do preset. O `ring` é a
 *   Primária 600 no claro (5,2:1 no branco) e 400 no escuro (7,6:1 no fundo).
 *   No claro ele tem a mesma cor do preenchimento primário; no escuro, 2,0:1
 *   contra ele. Nos dois, o afastamento de 2px os separa.
 * - `data-variant` e `data-size` expõem a variante e o tamanho resolvidos,
 *   para testes e estilos de contexto (o ButtonGroup usa `data-variant`).
 * - Nunca coloque um elemento interativo dentro de um botão.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed",
        outline:
          "border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary-hover aria-expanded:bg-secondary-hover",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive-hover",
        link: "text-link underline-offset-4 hover:text-link-hover hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        lg: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, type ButtonProps }
