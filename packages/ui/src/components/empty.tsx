import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Empty — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/empty
 * As cores, o contraste e o raio são os da Big Brain.
 * - Composição: Empty > EmptyHeader (EmptyMedia, EmptyTitle,
 *   EmptyDescription) e EmptyContent. Todas as partes são <div> (a
 *   `EmptyDescription` também, mesmo tipada como <p>) e expõem `data-slot`.
 *   O `EmptyMedia` expõe `data-slot="empty-icon"` (nome do registro) e
 *   `data-variant`. Mantidos como estão: mudar seria mudar a API.
 * - O `EmptyTitle` é um <div>: para entrar na estrutura de títulos da página,
 *   coloque um heading dentro dele (`<EmptyTitle><h3>…</h3></EmptyTitle>`).
 * - Sem cor com opacidade no componente. O quadrado do ícone é `muted` com
 *   `foreground` (16:1 no claro); a descrição é `muted-foreground` (7,4:1 no
 *   claro e 7,1:1 no escuro). Uma variante com fundo precisa de um papel
 *   cheio e de um quadrado de ícone que se distinga dele (o exemplo usa um
 *   gradiente de `muted` para `background`, não `bg-muted/30`).
 * - Escala rhea: `rounded-3xl` no contêiner e `rounded-xl` no ícone; não mexa.
 * - Links na descrição: sublinhados em `muted-foreground` (não dependem só da
 *   cor); o hover já usa `text-link-hover` (na Brainz, Primária 800 no claro,
 *   9,3:1, e Primária 200 no escuro, 13,3:1), no lugar do `text-primary` do
 *   registro (3,8:1 no escuro). O foco usa o anel do projeto (`ring-3 ring-ring
 *   ring-offset-2 ring-offset-background`, `rounded-sm`), sem o outline do
 *   navegador.
 * - Paddings e gaps lógicos e centralizados: funciona em RTL.
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-3xl border-dashed p-12 text-center text-balance",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-heading text-lg font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link-hover [&>a]:rounded-sm [&>a]:outline-none [&>a]:focus-visible:ring-3 [&>a]:focus-visible:ring-ring [&>a]:focus-visible:ring-offset-2 [&>a]:focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
