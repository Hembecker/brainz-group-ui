import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "cn"

/*
 * Avatar — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/avatar
 * As cores e o contraste são os da Big Brain.
 * - Construído sobre o Avatar do Base UI: `AvatarImage` só aparece quando a
 *   imagem carrega, e o `AvatarFallback` ocupa o lugar enquanto isso (ou se
 *   ela falhar). Composição: Avatar > AvatarImage, AvatarFallback e
 *   AvatarBadge; AvatarGroup > Avatar + AvatarGroupCount. Todas as partes
 *   expõem `data-slot`; o Avatar expõe também `data-size`.
 * - Tamanhos: sm 24px, default 32px e lg 40px, a mesma escala dos controles.
 *   O círculo (`rounded-full`) é do avatar, não do raio dos controles.
 * - Nome acessível: com foto, o `alt` do `AvatarImage` (vazio se o avatar é
 *   decorativo, como dentro de um botão que já tem nome). Só com iniciais, o
 *   `Avatar` leva `role="img"` e `aria-label` com o nome da pessoa (as letras
 *   do fallback viram parte da imagem). O selo é um ponto decorativo: o
 *   estado ("online") entra no mesmo `aria-label`, nunca só na cor.
 * - Sem cor com opacidade. Fallback: `muted-foreground` sobre `muted`, 6,6:1
 *   no claro. Selo: `primary` com o anel `ring-background`. Uma cor própria no
 *   selo (verde, vermelho) precisa de 3:1 contra o fundo nos dois modos.
 * - Contorno do avatar com `border-border` e `mix-blend`, só decorativo.
 * - Selo e grupo usam posições e margens lógicas (`end-0`, `-space-x`), então
 *   funcionam em RTL. O `AvatarGroupCount` é um <div>: para o leitor de tela,
 *   o "+3" precisa de um texto `sr-only` ao lado ("e mais 3 pessoas").
 */
function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
