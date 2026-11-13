/*
 * Toggle — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/toggle
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Toggle do Base UI, que expõe o estado em
 *   `aria-pressed` (e `data-pressed`). O nome do toggle NÃO muda com o
 *   estado: quem lê o estado é o `aria-pressed`.
 * - Estado ligado (A11Y): o `bg-muted` do registro é igual ao do hover e dá
 *   ~1,1:1 sobre o fundo claro, então o ligado não se distinguia. Agora o
 *   ligado é preenchido: `primary` com `primary-foreground` (5,2:1 de texto
 *   nos dois modos; 5,2:1 contra o fundo claro e 3,8:1 contra o escuro, acima
 *   dos 3:1 de um indicador de estado). Hover do ligado: `primary-hover`
 *   (700). No outline a borda do ligado vira `primary`. O desligado continua
 *   transparente (hover `muted`). Sem token novo.
 * - Anel de foco: sólido, 3px, no `ring`, afastado 2px pela cor do fundo,
 *   como no Button. `aria-invalid` usa `ring-destructive` cheio, sem os
 *   `/20` e `/40` do registro.
 * - Escala rhea: `rounded-2xl`; alturas sm 28 / default 32 / lg 36.
 * - Toggle só com ícone precisa de `aria-label`. Com texto visível, não ponha
 *   `aria-label`: o nome deve ser o texto que aparece.
 */
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary-hover aria-pressed:hover:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-muted aria-pressed:border-primary",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        sm: "h-7 min-w-7 px-2.5 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
