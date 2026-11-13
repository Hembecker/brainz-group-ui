import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Badge — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/badge
 * As cores, o contraste e o raio são os da Big Brain.
 * - Construído com `useRender` do Base UI: `render` troca o elemento (por
 *   exemplo `render={<a href="…" />}` para um badge que é link). Expõe
 *   `data-slot="badge"` e `data-variant`. Ícones e Spinner levam
 *   `data-icon="inline-start"` ou `"inline-end"`.
 * - Cores sem opacidade, todas com papéis cheios. Contrastes (texto sobre o
 *   fundo), claro e escuro:
 *   default `primary-foreground`/`primary` 5,2:1 e 5,2:1; secondary
 *   `secondary-foreground`/`secondary` 7,7:1 e 9,0:1; outline e ghost
 *   `foreground` sobre o fundo da página 19,7:1 e 19,0:1 (sobre um card,
 *   19,7:1 e 16,7:1).
 * - Destrutivo é sólido, como o Button: `destructive-foreground` sobre
 *   `destructive` 4,8:1 no claro (red 600 com branco) e 6,8:1 no escuro (red
 *   400 com mist 950). O `bg-destructive/10` do registro dava 4,0:1 no claro
 *   e reprovava.
 * - Hover (só quando o badge é um link, `[a]:hover:`): `primary-hover`
 *   (7,2:1), `secondary-hover` (6,3:1 e 7,7:1), `destructive-hover` (6,4:1 e
 *   10,3:1) e, no outline, `muted` com `muted-foreground` (6,6:1 e 6,1:1).
 *   O ghost reage ao hover mesmo sem ser link, como no registro: `muted`
 *   com `muted-foreground`, os mesmos 6,6:1 e 6,1:1.
 * - `link`: `text-link` (5,2:1 no claro e 10,2:1 no escuro) no lugar do
 *   `text-primary` do registro, que dava 3,8:1 no fundo escuro.
 * - `aria-invalid`: borda e anel `destructive`, como no Button. O anel de
 *   foco é sólido (`ring`), com afastamento de 2px pela cor do fundo.
 * - Paddings e ícones lógicos (`ps`/`pe`): funciona em RTL.
 */
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary-hover",
        destructive:
          "bg-destructive text-destructive-foreground [a]:hover:bg-destructive-hover",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        link: "text-link underline-offset-4 hover:text-link-hover hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
