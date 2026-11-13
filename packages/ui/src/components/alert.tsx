import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Alert — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/alert
 * As cores, o contraste e o raio são os da Big Brain.
 * - Composição: Alert > ícone, AlertTitle, AlertDescription e AlertAction.
 *   Todas as partes são <div> e expõem `data-slot`.
 * - O Alert estático NÃO é uma região viva: o registro fixava `role="alert"`
 *   em todo Alert, o que faz o leitor de tela interromper a fala para
 *   anunciar até um aviso comum, e ainda no carregamento da página. Aqui o
 *   `div` não tem papel nenhum. Passe `role="alert"` só para um erro crítico
 *   inserido na página depois do carregamento, e `role="status"` (ou uma
 *   região `aria-live="polite"` sempre montada) para os avisos comuns. As
 *   props vão por último, então `role` e `aria-live` sempre podem ser
 *   passados.
 * - Cores sem opacidade: o `text-destructive/90` da descrição destrutiva virou
 *   `text-destructive`. Contrastes, sobre o `card`: título e texto 19,7:1 no
 *   claro e 16,7:1 no escuro; descrição (`muted-foreground`) 7,4:1 e 7,1:1;
 *   destrutivo (título e descrição) red 600 4,8:1 no claro e red 400 6,0:1 no
 *   escuro. O contorno (`border`) é decorativo.
 * - Fundo `card` (o mesmo do Card). Cantos e recuos lógicos (`pe`, `end`,
 *   `text-start`): funciona em RTL. O `AlertAction` fica no canto do fim.
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl border px-4 py-3 text-start text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pe-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 end-3", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
