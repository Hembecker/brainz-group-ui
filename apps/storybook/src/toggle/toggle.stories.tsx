import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { BoldIcon, BookmarkIcon, ItalicIcon } from "lucide-react"

import { Toggle } from "@workspace/ui/components/toggle"

/*
 * One story per section of toggle.mdx, in the order of the shadcn/ui page.
 * A toggle with visible text is named by that text (no `aria-label`: the
 * name has to contain what is on screen, and it never changes with the
 * state, which `aria-pressed` carries). An icon-only toggle gets an
 * `aria-label`.
 */
const meta = {
  title: "Componentes/Toggle",
  component: Toggle,
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

/*
 * Colors go through a 1x1 canvas, which turns any CSS color (oklch included)
 * into sRGB, so the WCAG contrast can be measured from the real computed
 * styles in both modes.
 */
function paraRgb(cor: string): [number, number, number] {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = cor
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

function luminancia([r, g, b]: [number, number, number]) {
  const canal = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

function contraste(a: string, b: string) {
  const la = luminancia(paraRgb(a))
  const lb = luminancia(paraRgb(b))
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alternador = await canvas.findByRole("button", { name: "Favoritar" })

    // Keyboard: Tab reaches the toggle and Space/Enter flips `aria-pressed`.
    await userEvent.tab()
    await expect(alternador).toHaveFocus()
    await expect(alternador).toHaveAttribute("aria-pressed", "false")
    const fundoDesligado = getComputedStyle(alternador).backgroundColor
    await userEvent.keyboard(" ")
    await expect(alternador).toHaveAttribute("aria-pressed", "true")
    // Wait for the color transition to end before measuring.
    await waitFor(() => expect(alternador.getAnimations()).toHaveLength(0))

    // The pressed state is not a faint color: the fill is told apart from the
    // off state and from the page (3:1 for a state indicator), and the text on
    // it keeps 4.5:1. Measured in light and dark, from the computed styles.
    const estilo = getComputedStyle(alternador)
    const fundoLigado = estilo.backgroundColor
    const fundoDaPagina = getComputedStyle(
      canvasElement.firstElementChild ?? document.body
    ).backgroundColor
    await expect(fundoLigado).not.toBe(fundoDesligado)
    await expect(contraste(fundoLigado, fundoDaPagina)).toBeGreaterThanOrEqual(
      3
    )
    await expect(contraste(estilo.color, fundoLigado)).toBeGreaterThanOrEqual(
      4.5
    )
    await userEvent.keyboard("{Enter}")
    await expect(alternador).toHaveAttribute("aria-pressed", "false")
  },
  render: () => (
    <Toggle size="sm" variant="outline">
      <BookmarkIcon
        aria-hidden="true"
        className="group-aria-pressed/toggle:fill-current"
      />
      Favoritar
    </Toggle>
  ),
}

export const Outline: Story = {
  name: "Outline",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline">
        <ItalicIcon aria-hidden="true" />
        Itálico
      </Toggle>
      <Toggle variant="outline" aria-label="Negrito">
        <BoldIcon aria-hidden="true" />
      </Toggle>
    </div>
  ),
}

export const ComTexto: Story = {
  name: "Com texto",
  render: () => (
    <Toggle>
      <ItalicIcon aria-hidden="true" />
      Itálico
    </Toggle>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" size="sm">
        Pequeno
      </Toggle>
      <Toggle variant="outline" size="default">
        Padrão
      </Toggle>
      <Toggle variant="outline" size="lg">
        Grande
      </Toggle>
    </div>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle disabled>Desabilitado</Toggle>
      <Toggle variant="outline" disabled>
        Desabilitado
      </Toggle>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Toggle size="sm" variant="outline" dir="rtl">
        <BookmarkIcon
          aria-hidden="true"
          className="group-aria-pressed/toggle:fill-current"
        />
        إشارة مرجعية
      </Toggle>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    variant: "outline",
    size: "default",
    disabled: false,
    defaultPressed: false,
    children: "Itálico",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
    defaultPressed: { control: "boolean" },
  },
}
