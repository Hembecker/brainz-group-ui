import { cn } from "cn"

/*
 * AspectRatio — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/aspect-ratio
 * É só layout, sem cor: nada a revisar em contraste nem em opacidade.
 * - Um <div> que reserva a proporção `ratio` (obrigatória, `16 / 9`) pela
 *   variável `--ratio` e pelo `aspect-(--ratio)` do Tailwind; é `relative`,
 *   então o filho entra com `absolute inset-0 size-full` (no Next, o `fill`
 *   do Image faz isso). Expõe `data-slot="aspect-ratio"`.
 * - O `style` de quem usa é mesclado, e o `--ratio` vem sempre da prop
 *   `ratio` (no registro, um `style` passado apagava a proporção).
 * - Não tem papel nem nome próprio: o nome está na imagem (`alt`) ou no
 *   conteúdo de dentro. Uma legenda visível vai num <figure> com
 *   <figcaption> em volta, não dentro do AspectRatio.
 * - Sem direção nem espaçamento: funciona igual em RTL.
 */
function AspectRatio({
  ratio,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          ...style,
          "--ratio": ratio,
        } as React.CSSProperties
      }
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

export { AspectRatio }
