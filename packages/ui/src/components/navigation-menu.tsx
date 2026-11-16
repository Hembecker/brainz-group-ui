import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

/*
 * NavigationMenu — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/navigation-menu
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o NavigationMenu do Base UI. A raiz é um `<nav>`: dê um
 *   `aria-label` a ele (e um distinto a cada `<nav>` da página). O
 *   `NavigationMenuTrigger` é um `<button>` (abre o painel) e o
 *   `NavigationMenuLink` é um `<a>` (navega), por isso um link nunca vira
 *   gatilho. Para o `<a>` do seu roteador, use `render`:
 *   `<NavigationMenuLink render={<Link href="/docs" />}>`.
 * - Teclado: Tab entra no menu; Enter abre o painel; as setas (Esquerda e
 *   Direita, invertidas em RTL) movem entre os gatilhos e links da barra e Esc
 *   fecha o painel e devolve o foco ao gatilho. Com o painel aberto, Tab vai
 *   para o primeiro link dele e Baixo anda entre os links. O menu também abre
 *   ao passar o mouse.
 * - O painel vai para um portal no `body`: a classe `dark` e o `dir` do
 *   `<html>` chegam a ele, mas um `dir` posto num ancestral não. Para um menu
 *   RTL isolado, passe `dir` e `lang` ao `NavigationMenuContent` e
 *   `align="end"` ao `NavigationMenu`.
 * - Cores com opacidade do registro trocadas por papéis cheios: o estado
 *   aberto e o link ativo usam `bg-muted` (era `bg-muted/50`) e o contorno do
 *   painel (o `Popup`) usa `ring-border` (era `ring-foreground/5` e
 *   `dark:ring-foreground/10`).
 * - Link ativo: o Base UI marca o link da página atual (`active`) com
 *   `data-active=""` e `aria-current="page"`. O registro usava
 *   `data-[active=true]:`, que nunca casava; aqui é a variante `data-active:`
 *   do `shadcn/tailwind.css`.
 * - Anel de foco: o gatilho e o link da barra usam o anel sólido,
 *   desenhado por dentro (`ring-inset`), por causa da rolagem na barra (veja
 *   abaixo). Dentro do painel, o link usa o mesmo anel sólido, também por
 *   dentro (`ring-inset`, sem afastamento), para não ser cortado pela borda do
 *   painel: o destaque `muted` sozinho mediria ~1,1:1 sobre o `popover`,
 *   abaixo dos 3:1 de um indicador de foco. O registro tirava esse anel
 *   (`focus:ring-0` no `NavigationMenuContent`).
 * - Pendências do registro: as variantes
 *   `data-ending-style:data-activation-direction=left:…` do
 *   `NavigationMenuContent` não são seletores válidos do Tailwind (não geram
 *   nada) e ficaram como estão. O gatilho passou de `h-9` para `h-8`, a escala
 *   dos controles.
 * - Classes inertes do registro removidas (tire-as de novo depois de um
 *   `shadcn add`):
 *   - no `NavigationMenuContent`, as oito `data-[motion=…]` e
 *     `data-[motion^=…]` (slide e fade, físicas) e todas as
 *     `group-data-[viewport=false]/navigation-menu:*`: são atributos do Radix
 *     (`data-motion`, `data-viewport`), e o Base UI não emite nenhum deles, só
 *     o `data-activation-direction`;
 *   - no `Popup`, `data-[ending-style]:easing-[ease]` (não é utilitário do
 *     Tailwind) e `xs:w-(--popup-width)` (não há breakpoint `xs`; o
 *     `w-(--popup-width)` já está lá);
 *   - no `NavigationMenuIndicator`, `top-full` (o elemento não é posicionado).
 * - `NavigationMenuIndicator`: é o `NavigationMenu.Icon` do Base UI, um
 *   `<span aria-hidden>` decorativo que marca com `data-popup-open` o item
 *   cujo painel está aberto. Ele lê o estado do item, então precisa ficar
 *   dentro de um `NavigationMenuItem` (ao lado do gatilho ou dentro dele):
 *   fora de um item, como na árvore da página do shadcn (filho da raiz), o
 *   Base UI lança um erro. Não é o indicador de viewport do Radix. As classes
 *   `data-[state=hidden|visible]:…` do registro eram do Radix e viraram
 *   `opacity-0 transition-opacity data-popup-open:opacity-100`.
 * - Rolagem na barra (escolha do usuário): quando a lista da barra não cabe na largura,
 *   rola na horizontal dentro da própria barra, em vez de empurrar a página
 *   (a 320px, ou com zoom de 400%). A barra de rolagem fica escondida
 *   (`no-scrollbar`) e a dica de que há mais itens é o `scroll-fade-x` do
 *   shadcn: a borda que tem conteúdo escondido se dissolve, e some quando não
 *   há o que rolar. Nos navegadores sem animações guiadas pela rolagem, vale
 *   o fallback do shadcn, escolhido pelo usuário: as duas pontas ficam
 *   sempre esmaecidas, mesmo quando a barra cabe. Ele segue a direção da leitura em RTL. O
 *   `scroll-px-10` faz o item focado parar fora da zona do fade, e os itens
 *   não encolhem (`shrink-0`). Como o contêiner corta o que passa da borda,
 *   o anel de foco desses itens é desenhado por dentro (`ring-inset`, sem o
 *   afastamento de 2px). Por dentro, ele encosta no fundo do item: 4,7:1
 *   sobre `muted` e 5,2:1 sobre `background` no claro; 5,7:1 e 7,6:1 no
 *   escuro.
 */

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max min-w-0 flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

// Na barra que rola, o focus() do navegador não rola um item que já aparece
// em parte: ele ficava cortado na borda, dentro do fade. Isto traz o item
// focado para dentro, respeitando o `scroll-padding`. Só age quando a barra
// rola e o alvo está nela no DOM (o conteúdo dos portais fica de fora).
function revelarItemFocado(event: React.FocusEvent<HTMLElement>) {
  const barra = event.currentTarget
  const alvo = event.target
  if (alvo === barra || !barra.contains(alvo)) return
  if (barra.scrollWidth <= barra.clientWidth) return
  alvo.scrollIntoView({ block: "nearest", inline: "nearest" })
}

function NavigationMenuList({
  className,
  onFocus,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group no-scrollbar flex max-w-full min-w-0 flex-1 scroll-fade-x scroll-px-10 list-none items-center justify-center-safe gap-0 overflow-x-auto overflow-y-hidden *:shrink-0",
        className
      )}
      onFocus={(event) => {
        revelarItemFocado(event)
        onFocus?.(event)
      }}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-8 w-max items-center justify-center rounded-2xl px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted data-popup-open:hover:bg-muted data-open:bg-muted data-open:hover:bg-muted data-open:focus:bg-muted"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px ms-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-ending-style:data-activation-direction=left:translate-x-[50%] rtl:data-ending-style:data-activation-direction=left:-translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] rtl:data-ending-style:data-activation-direction=right:-translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] rtl:data-starting-style:data-activation-direction=left:-translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] rtl:data-starting-style:data-activation-direction=right:-translate-x-[50%] h-full w-auto p-1.5 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:start-0 data-[side=bottom]:before:end-0 data-[side=bottom]:before:top-[-10px]",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-border transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset in-data-[slot=navigation-menu-content]:w-full in-data-[slot=navigation-menu-content]:rounded-xl in-data-[slot=navigation-menu-content]:p-2 in-data-[slot=navigation-menu-content]:font-normal data-active:bg-muted data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "z-1 flex h-1.5 items-end justify-center overflow-hidden opacity-0 transition-opacity data-popup-open:opacity-100",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-ss-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
