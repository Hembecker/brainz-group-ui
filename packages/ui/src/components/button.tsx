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
 * - Raio de 7,2px (`rounded-lg` = --radius, 0.45rem); alturas xs 24 / sm 32 /
 *   default 36 / lg 40 e os quadrados `icon-*` (com `rounded-full` para um
 *   botão de ícone redondo).
 * - O preenchimento primário é `primary` (blue 700 com blue 50, 6,3:1; no
 *   escuro, blue 800, 8,1:1). Destrutivo é sólido, não o `destructive/10` do
 *   preset: red 600 com branco (4,8:1); no escuro, red 400 com mist 950 (6,8:1).
 * - Outline no escuro, como no shadcn: borda `input` (branco a 15%, 1,5:1) e
 *   um preenchimento leve `bg-input/30`, para o botão se destacar do fundo. O
 *   texto sobre ele continua com ~18:1. É a única cor com opacidade aqui.
 * - Um único anel de foco para todas as variantes: sólido, 3px, no `ring`,
 *   afastado 2px pela cor do fundo. Nunca o `ring/30` do preset. A11Y: com o
 *   tema atual, o `ring` do claro (mist 400) tem 2,4:1, abaixo de 3:1.
 * - `data-variant` e `data-size` expõem a variante e o tamanho resolvidos,
 *   para testes e estilos de contexto (o ButtonGroup usa `data-variant`).
 * - Nunca coloque um elemento interativo dentro de um botão.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
          "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        lg: "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pe-4 has-data-[icon=inline-start]:ps-4",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
