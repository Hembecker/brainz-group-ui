import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { buttonVariants } from "@workspace/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"

/*
 * One story per section of hover-card.mdx, in the order of the shadcn/ui page
 * (the "Basic" section is the same example as the Demo, so it has no story of
 * its own). The trigger is a real link (`<a>`, the Base UI default) styled
 * with `buttonVariants`, because the card previews what the link leads to.
 *
 * A closed card is invisible to axe, so every story has a `play` that opens
 * it first, by KEYBOARD (Tab to the trigger): the focus keeps the card open
 * while axe runs, and it proves that the card opens on focus, not only on
 * hover. `abrirPorTeclado` waits for the content (it is portaled to <body>,
 * so it is queried with `screen`) and for the enter animation to end (axe
 * would measure contrast mid-fade).
 */
const meta = {
  title: "Componentes/Hover Card",
  component: HoverCard,
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

async function abrirPorTeclado(
  canvasElement: HTMLElement,
  gatilho: string,
  texto: string
) {
  const link = await within(canvasElement).findByRole("link", { name: gatilho })
  for (let i = 0; i < 10 && document.activeElement !== link; i++) {
    await userEvent.tab()
  }
  await expect(link).toHaveFocus()
  // Stories that open several cards with the same text wait for the previous
  // one to finish closing (closeDelay), so only one match is left.
  const conteudo = await waitFor(
    () => {
      const achados = screen.getAllByText(texto)
      expect(achados).toHaveLength(1)
      return achados[0]
    },
    { timeout: 3000 }
  )
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(conteudo).toBeVisible())
  return { link, conteudo }
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const texto = "Soluções digitais criadas e mantidas pela Brainz Group."
    const link = await within(canvasElement).findByRole("link", {
      name: "@brainzgroup",
    })

    // Opens on hover and closes when the mouse leaves.
    await userEvent.hover(link)
    await waitFor(() => expect(screen.getByText(texto)).toBeVisible())
    await userEvent.unhover(link)
    await waitFor(() => expect(screen.queryByText(texto)).toBeNull())

    // Opens on keyboard focus too (Tab), and Esc closes it.
    await abrirPorTeclado(canvasElement, "@brainzgroup", texto)
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByText(texto)).toBeNull())

    // Leaves and comes back with the keyboard, and stays open for axe.
    link.blur()
    await abrirPorTeclado(canvasElement, "@brainzgroup", texto)
  },
  render: () => (
    <HoverCard>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        href="#brainzgroup"
        className={buttonVariants({ variant: "link" })}
      >
        @brainzgroup
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">@brainzgroup</div>
        <div>Soluções digitais criadas e mantidas pela Brainz Group.</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Desde dezembro de 2021
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const AtrasosDoGatilho: Story = {
  name: "Atrasos do gatilho",
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(canvasElement, "Passe o mouse", "Conteúdo do cartão")
  },
  render: () => (
    <HoverCard>
      <HoverCardTrigger
        delay={100}
        closeDelay={200}
        href="#atrasos"
        className={buttonVariants({ variant: "link" })}
      >
        Passe o mouse
      </HoverCardTrigger>
      <HoverCardContent>Conteúdo do cartão</HoverCardContent>
    </HoverCard>
  ),
}

export const Posicionamento: Story = {
  play: async ({ canvasElement }) => {
    const { conteudo } = await abrirPorTeclado(
      canvasElement,
      "Passe o mouse",
      "Conteúdo do cartão"
    )
    await expect(conteudo.closest("[data-side]")).toHaveAttribute(
      "data-side",
      "top"
    )
  },
  render: () => (
    <div className="pt-24">
      <HoverCard>
        <HoverCardTrigger
          href="#posicionamento"
          className={buttonVariants({ variant: "link" })}
        >
          Passe o mouse
        </HoverCardTrigger>
        <HoverCardContent side="top" align="start">
          Conteúdo do cartão
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}

export const Lados: Story = {
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(
      canvasElement,
      "esquerda",
      "Este cartão aparece no lado esquerdo do gatilho."
    )
    await abrirPorTeclado(
      canvasElement,
      "acima",
      "Este cartão aparece no lado de cima do gatilho."
    )
    await abrirPorTeclado(
      canvasElement,
      "abaixo",
      "Este cartão aparece no lado de baixo do gatilho."
    )
    await abrirPorTeclado(
      canvasElement,
      "direita",
      "Este cartão aparece no lado direito do gatilho."
    )
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-2 py-40">
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          href="#esquerda"
          className={buttonVariants({ variant: "outline" })}
        >
          esquerda
        </HoverCardTrigger>
        <HoverCardContent side="left">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Cartão de pré-visualização</h4>
            <p>Este cartão aparece no lado esquerdo do gatilho.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          href="#acima"
          className={buttonVariants({ variant: "outline" })}
        >
          acima
        </HoverCardTrigger>
        <HoverCardContent side="top">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Cartão de pré-visualização</h4>
            <p>Este cartão aparece no lado de cima do gatilho.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          href="#abaixo"
          className={buttonVariants({ variant: "outline" })}
        >
          abaixo
        </HoverCardTrigger>
        <HoverCardContent side="bottom">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Cartão de pré-visualização</h4>
            <p>Este cartão aparece no lado de baixo do gatilho.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          href="#direita"
          className={buttonVariants({ variant: "outline" })}
        >
          direita
        </HoverCardTrigger>
        <HoverCardContent side="right">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Cartão de pré-visualização</h4>
            <p>Este cartão aparece no lado direito do gatilho.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(canvasElement, "يسار", "سماعات لاسلكية")
    await abrirPorTeclado(canvasElement, "أعلى", "سماعات لاسلكية")
    await abrirPorTeclado(canvasElement, "بداية السطر", "سماعات لاسلكية")
    await abrirPorTeclado(canvasElement, "نهاية السطر", "سماعات لاسلكية")
  },
  render: () => (
    <div dir="rtl" lang="ar" className="grid gap-4 py-40">
      <div className="flex flex-wrap justify-center gap-2">
        <HoverCard>
          <HoverCardTrigger
            delay={10}
            closeDelay={100}
            href="#rtl-esquerda"
            className={buttonVariants({ variant: "outline" })}
          >
            يسار
          </HoverCardTrigger>
          <HoverCardContent
            side="left"
            className="flex w-64 flex-col gap-1"
            dir="rtl"
            lang="ar"
          >
            <div className="font-semibold">سماعات لاسلكية</div>
            <div className="text-sm text-muted-foreground">٩٩.٩٩ $</div>
          </HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger
            delay={10}
            closeDelay={100}
            href="#rtl-acima"
            className={buttonVariants({ variant: "outline" })}
          >
            أعلى
          </HoverCardTrigger>
          <HoverCardContent
            side="top"
            className="flex w-64 flex-col gap-1"
            dir="rtl"
            lang="ar"
          >
            <div className="font-semibold">سماعات لاسلكية</div>
            <div className="text-sm text-muted-foreground">٩٩.٩٩ $</div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <HoverCard>
          <HoverCardTrigger
            delay={10}
            closeDelay={100}
            href="#rtl-inicio"
            className={buttonVariants({ variant: "outline" })}
          >
            بداية السطر
          </HoverCardTrigger>
          <HoverCardContent
            side="inline-start"
            className="flex w-64 flex-col gap-1"
            dir="rtl"
            lang="ar"
          >
            <div className="font-semibold">سماعات لاسلكية</div>
            <div className="text-sm text-muted-foreground">٩٩.٩٩ $</div>
          </HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger
            delay={10}
            closeDelay={100}
            href="#rtl-fim"
            className={buttonVariants({ variant: "outline" })}
          >
            نهاية السطر
          </HoverCardTrigger>
          <HoverCardContent
            side="inline-end"
            className="flex w-64 flex-col gap-1"
            dir="rtl"
            lang="ar"
          >
            <div className="font-semibold">سماعات لاسلكية</div>
            <div className="text-sm text-muted-foreground">٩٩.٩٩ $</div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
}
