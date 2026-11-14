import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@workspace/ui/components/carousel"
import { DirectionProvider } from "@workspace/ui/components/direction"

/*
 * One story per section of carousel.mdx, in the order of the shadcn/ui page.
 * "Opções", "Eventos" and "Plugins" have no live preview on the shadcn page
 * either (they are code only), and `embla-carousel-autoplay` is not installed
 * here, so they live in the MDX as snippets.
 *
 * The previous/next buttons sit outside the carousel (`-start-12`), so every
 * example wraps it in a `px-12` (or `py-12`, vertical) box.
 * Each carousel gets its own `aria-label` (the Docs page renders every story
 * at once, and two regions with the same name would be ambiguous), and every
 * slide is named "1 de 5" by the component itself.
 */
const meta = {
  title: "Componentes/Carousel",
  component: Carousel,
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

const rtl = () => document.documentElement.dir === "rtl"

async function carrossel(canvasElement: HTMLElement, nome: string) {
  const regiao = await within(canvasElement).findByRole("region", {
    name: nome,
  })
  await expect(regiao).toHaveAttribute("aria-roledescription", "carousel")
  return regiao
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const regiao = await carrossel(canvasElement, "Destaques da semana")
    const canvas = within(regiao)

    // Five slides, each one named "n de 5" by the component.
    const slides = canvas.getAllByRole("group")
    await expect(slides).toHaveLength(5)
    await expect(slides[0]).toHaveAccessibleName("1 de 5")
    await expect(slides[4]).toHaveAccessibleName("5 de 5")
    await expect(slides[0]).toHaveAttribute("aria-roledescription", "slide")

    // At the first slide "Slide anterior" is disabled.
    const anterior = canvas.getByRole("button", { name: "Slide anterior" })
    const proximo = canvas.getByRole("button", { name: "Próximo slide" })
    await expect(anterior).toBeDisabled()
    await expect(proximo).toBeEnabled()

    // The button moves the carousel...
    await userEvent.click(proximo)
    await waitFor(() => expect(anterior).toBeEnabled())

    // ...and so does the keyboard. The arrows mirror in RTL (← advances).
    const voltar = rtl() ? "{ArrowRight}" : "{ArrowLeft}"
    const avancar = rtl() ? "{ArrowLeft}" : "{ArrowRight}"
    proximo.focus()
    await userEvent.keyboard(voltar)
    await waitFor(() => expect(anterior).toBeDisabled())
    await userEvent.keyboard(avancar)
    await waitFor(() => expect(anterior).toBeEnabled())
  },
  render: () => (
    <div className="mx-auto w-full max-w-sm px-12">
      <Carousel aria-label="Destaques da semana" className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export const Tamanho: Story = {
  name: "Tamanho",
  play: async ({ canvasElement }) => {
    const regiao = await carrossel(canvasElement, "Fotos do evento")
    const slides = within(regiao).getAllByRole("group")
    await expect(slides).toHaveLength(5)
    // basis-1/2 (1/3 on lg): more than one slide fits in view.
    const largura = regiao.getBoundingClientRect().width
    await expect(slides[0].getBoundingClientRect().width).toBeLessThan(
      largura * 0.6
    )
  },
  render: () => (
    <div className="mx-auto w-full max-w-md px-12">
      <Carousel
        aria-label="Fotos do evento"
        opts={{ align: "start" }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export const Espacamento: Story = {
  name: "Espaçamento",
  play: async ({ canvasElement }) => {
    const regiao = await carrossel(canvasElement, "Produtos em alta")
    await expect(within(regiao).getAllByRole("group")).toHaveLength(5)
  },
  render: () => (
    <div className="mx-auto w-full max-w-md px-12">
      <Carousel aria-label="Produtos em alta" className="w-full">
        <CarouselContent className="-ms-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 ps-1 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export const Orientacao: Story = {
  name: "Orientação",
  play: async ({ canvasElement }) => {
    const regiao = await carrossel(canvasElement, "Últimas notícias")
    const canvas = within(regiao)
    const anterior = canvas.getByRole("button", { name: "Slide anterior" })
    const proximo = canvas.getByRole("button", { name: "Próximo slide" })
    await expect(anterior).toBeDisabled()
    // Vertical: the buttons are stacked above and below the slides.
    await expect(proximo.getBoundingClientRect().top).toBeGreaterThan(
      anterior.getBoundingClientRect().top
    )
    await userEvent.click(proximo)
    await waitFor(() => expect(anterior).toBeEnabled())
  },
  render: () => (
    <div className="mx-auto w-full max-w-xs py-12">
      <Carousel
        aria-label="Últimas notícias"
        opts={{ align: "start" }}
        orientation="vertical"
        className="w-full"
      >
        <CarouselContent className="-mt-1 h-[270px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 pt-1">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

function CarouselComApi() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [atual, setAtual] = React.useState(0)
  const [total, setTotal] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    const atualizar = () => {
      setTotal(api.scrollSnapList().length)
      setAtual(api.selectedScrollSnap() + 1)
    }
    // Sincroniza o estado com a API do Embla (sistema externo) ao montar.
    atualizar()
    api.on("select", atualizar)
    api.on("reInit", atualizar)

    return () => {
      api.off("select", atualizar)
      api.off("reInit", atualizar)
    }
  }, [api])

  return (
    <div className="mx-auto w-full max-w-sm px-12">
      <Carousel
        setApi={setApi}
        aria-label="Passo a passo da integração"
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="m-px">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div
        role="status"
        className="py-2 text-center text-sm text-muted-foreground"
      >
        {total > 0 ? `Slide ${atual} de ${total}` : ""}
      </div>
    </div>
  )
}

export const Api: Story = {
  name: "API",
  parameters: {
    docs: {
      source: {
        code: `const [api, setApi] = React.useState<CarouselApi>()
const [atual, setAtual] = React.useState(0)
const [total, setTotal] = React.useState(0)

React.useEffect(() => {
  if (!api) {
    return
  }

  const atualizar = () => {
    setTotal(api.scrollSnapList().length)
    setAtual(api.selectedScrollSnap() + 1)
  }
  atualizar()
  api.on("select", atualizar)
  api.on("reInit", atualizar)

  return () => {
    api.off("select", atualizar)
    api.off("reInit", atualizar)
  }
}, [api])

<div className="mx-auto w-full max-w-sm px-12">
  <Carousel
    setApi={setApi}
    aria-label="Passo a passo da integração"
    className="w-full"
  >
    <CarouselContent>
      {Array.from({ length: 5 }).map((_, index) => (
        <CarouselItem key={index}>
          <Card className="m-px">
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
  <div role="status" className="py-2 text-center text-sm text-muted-foreground">
    {total > 0 ? \`Slide \${atual} de \${total}\` : ""}
  </div>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const estado = await canvas.findByRole("status")
    await waitFor(() => expect(estado).toHaveTextContent("Slide 1 de 5"))

    // The always-mounted live region follows the carousel.
    await userEvent.click(canvas.getByRole("button", { name: "Próximo slide" }))
    await waitFor(() => expect(estado).toHaveTextContent("Slide 2 de 5"))
  },
  render: () => <CarouselComApi />,
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const regiao = await carrossel(canvasElement, "معرض الصور")
    const canvas = within(regiao)
    await expect(canvas.getAllByRole("group")[0]).toHaveAccessibleName("١ من ٥")

    // In RTL the first slide sits at the right edge and "next" scrolls left.
    const primeiro = canvas.getAllByRole("group")[0].getBoundingClientRect()
    const area = regiao.getBoundingClientRect()
    await expect(area.right - primeiro.right).toBeLessThan(area.width * 0.1)

    const anterior = canvas.getByRole("button", { name: "الشريحة السابقة" })
    const proximo = canvas.getByRole("button", { name: "الشريحة التالية" })
    await expect(anterior).toBeDisabled()
    // "Previous" is at the start side (right) in RTL.
    await expect(anterior.getBoundingClientRect().left).toBeGreaterThan(
      proximo.getBoundingClientRect().left
    )
    await userEvent.click(proximo)
    await waitFor(() => expect(anterior).toBeEnabled())
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar" className="mx-auto w-full max-w-sm px-12">
        <Carousel
          dir="rtl"
          aria-label="معرض الصور"
          opts={{ direction: "rtl" }}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                aria-label={`${"١٢٣٤٥"[index]} من ٥`}
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {"١٢٣٤٥"[index]}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious aria-label="الشريحة السابقة" />
          <CarouselNext aria-label="الشريحة التالية" />
        </Carousel>
      </div>
    </DirectionProvider>
  ),
}
