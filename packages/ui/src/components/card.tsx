import * as React from "react"
import { cn } from "cn"

/*
 * Card — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/card
 * As cores, o contraste e o raio são os da Big Brain.
 * - Composição: Card > CardHeader (CardTitle, CardDescription, CardAction),
 *   CardContent e CardFooter. Todas as partes são <div> e expõem `data-slot`;
 *   o Card expõe também `data-size`.
 * - `size="sm"` reduz o espaçamento. A variável `--card-spacing` controla o
 *   espaço entre as partes e o recuo delas (padrão 20px, sm 16px).
 * - Raio do rhea: `min(--radius-4xl, 24px)` (--radius × 2,6, ~19px), maior
 *   que o dos controles (~13px), para os cantos ficarem concêntricos.
 * - Contorno `ring-border` e fundo `card`, em vez do `ring-foreground/5` do
 *   preset. O `border` vem do tema (mist 200 no claro, branco a 10% no
 *   escuro). O texto do card tem 19,7:1 no claro e 16,7:1 no escuro; a
 *   descrição, 7,4:1 e 7,1:1.
 * - Recuos e alinhamentos lógicos (px, justify-self-end): funciona em RTL.
 * - O CardTitle é um <div>. Para entrar na estrutura de títulos da página,
 *   coloque um heading dentro dele (veja a página Docs).
 */
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-[min(var(--radius-4xl),24px)] bg-card py-(--card-spacing) text-sm text-card-foreground shadow-sm ring-1 ring-border [--card-spacing:--spacing(5)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-[min(var(--radius-4xl),24px)] *:[img:last-child]:rounded-b-[min(var(--radius-4xl),24px)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-[min(var(--radius-4xl),24px)] px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-base font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-[min(var(--radius-4xl),24px)] px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
