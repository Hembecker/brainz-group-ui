import * as React from "react"
import { cn } from "cn"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { Button } from "@workspace/ui/components/button"
import { useDirection } from "@workspace/ui/components/direction"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

/*
 * Carousel — estrutura e API do shadcn/ui (versão Base UI), sobre o Embla:
 * https://ui.shadcn.com/docs/components/base/carousel
 * As cores e os tamanhos são os da Big Brain (os botões são o Button).
 * - Semântica (padrão WAI-ARIA de carrossel): o contêiner é uma região com
 *   `aria-roledescription="carousel"` e precisa de nome (`aria-label` ou
 *   `aria-labelledby`, passado por quem usa: o componente não tem como saber).
 *   Cada `CarouselItem` é um grupo com `aria-roledescription="slide"` e nome
 *   automático "1 de 5": o `CarouselContent` passa a posição e o total pelo
 *   contexto (conta filhos diretos, arrays e Fragments; um item dentro de
 *   outro componente não é contado), e um `aria-label` próprio no item tem
 *   preferência.
 * - Textos fixos em português: "Slide anterior" e "Próximo slide" (sr-only).
 *   Os ícones levam `aria-hidden`.
 * - RTL: o Embla não lê o `dir` do DOM. Sem `opts.direction`, o Carousel usa
 *   a direção do DirectionProvider (padrão "ltr"); passe `opts.direction` para
 *   forçar. A seta de teclado também espelha em RTL (←/→ trocam de lado).
 *   Os ícones levam `rtl:rotate-180`, então não repita a classe nos botões
 *   (as duas se anulariam). No modo vertical o botão já gira 90°, e espelhar
 *   o ícone o apontaria para o lado errado: o espelhamento só vale no
 *   horizontal. No vertical o teclado continua com ← e → (como no shadcn).
 * - Sem reprodução automática por padrão. Se usar um plugin de autoplay, ofereça
 *   um botão de pausar (WCAG 2.2.2) e pare a rolagem ao focar ou passar o mouse.
 * - Sem cores com opacidade neste arquivo.
 */

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

// Posição e total do slide, para o nome automático "1 de 5".
const CarouselSlideContext = React.createContext<{
  index: number
  count: number
} | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const direction = useDirection()
  const [carouselRef, api] = useEmblaCarousel(
    {
      direction,
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Em RTL as setas espelham: ← avança e → volta.
      const rtl = (opts?.direction ?? direction) === "rtl"
      if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext, opts?.direction, direction]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    // Sincroniza o estado com a API do Embla (sistema externo) ao montar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("reInit", onSelect)
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

// Os itens podem vir em arrays e dentro de Fragments (<>…</>): achata os dois,
// para a contagem do nome "1 de 5" ser a dos slides de verdade.
function flattenSlides(children: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) &&
    child.type === React.Fragment
      ? flattenSlides(child.props.children)
      : [child]
  )
}

function CarouselContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()
  const slides = flattenSlides(children)

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      >
        {slides.map((slide, index) => (
          <CarouselSlideContext.Provider
            key={index}
            value={{ index, count: slides.length }}
          >
            {slide}
          </CarouselSlideContext.Provider>
        ))}
      </div>
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()
  const slide = React.useContext(CarouselSlideContext)

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={slide ? `${slide.index + 1} de ${slide.count}` : undefined}
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "ps-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-2xl",
        orientation === "horizontal"
          ? "inset-y-0 -start-12 my-auto"
          : "-top-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon
        aria-hidden="true"
        className={cn(orientation === "horizontal" && "rtl:rotate-180")}
      />
      <span className="sr-only">Slide anterior</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-2xl",
        orientation === "horizontal"
          ? "inset-y-0 -end-12 my-auto"
          : "-bottom-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon
        aria-hidden="true"
        className={cn(orientation === "horizontal" && "rtl:rotate-180")}
      />
      <span className="sr-only">Próximo slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
}
