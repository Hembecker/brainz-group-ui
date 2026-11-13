import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { DirectionProvider } from "@workspace/ui/components/direction"
import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"

/*
 * One story per section of slider.mdx, in the order of the shadcn/ui page.
 * The thumb gets its accessible name from the Slider's `aria-labelledby`, so
 * every example has a visible `Label` with an `id` (a plain `aria-label` on
 * the Slider would name only the group, not the thumb). Ids are prefixed with
 * the story name: the Docs page renders all stories in the same document.
 *
 * `SliderControlado` exists only because the Controlado story needs state:
 * a story's `render` cannot call hooks. The MDX shows the full code.
 */
const meta = {
  title: "Componentes/Slider",
  component: Slider,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

function SliderControlado() {
  const [valor, setValor] = React.useState([0.3, 0.7])

  return (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label id="controlado-temperatura">Temperatura</Label>
        <span aria-hidden="true" className="text-sm text-muted-foreground">
          {valor.join(", ")}
        </span>
      </div>
      <Slider
        aria-labelledby="controlado-temperatura"
        value={valor}
        onValueChange={(novo) => setValor(novo as number[])}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const polegar = await canvas.findByRole("slider", { name: "Volume" })

    // Keyboard: Tab reaches the thumb, arrows change the value by one step.
    // Up/Down do not depend on the direction (Left/Right swap in RTL; the
    // Rtl story checks that).
    await userEvent.tab()
    await expect(polegar).toHaveFocus()
    await expect(polegar).toHaveAttribute("aria-valuenow", "75")
    await userEvent.keyboard("{ArrowUp}")
    await expect(polegar).toHaveAttribute("aria-valuenow", "76")
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect(polegar).toHaveAttribute("aria-valuenow", "74")
  },
  render: () => (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <Label id="demo-volume">Volume</Label>
      <Slider
        aria-labelledby="demo-volume"
        defaultValue={[75]}
        max={100}
        step={1}
      />
    </div>
  ),
}

export const Intervalo: Story = {
  render: () => (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <Label id="intervalo-preco">Faixa de preço</Label>
      <Slider
        aria-labelledby="intervalo-preco"
        defaultValue={[25, 50]}
        max={100}
        step={5}
      />
    </div>
  ),
}

export const VariosPolegares: Story = {
  name: "Vários polegares",
  render: () => (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <Label id="polegares-pontos">Pontos de corte</Label>
      <Slider
        aria-labelledby="polegares-pontos"
        defaultValue={[10, 20, 70]}
        max={100}
        step={10}
      />
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <Slider
          aria-labelledby="vertical-volume"
          defaultValue={[50]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
        <Label id="vertical-volume">Volume</Label>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Slider
          aria-labelledby="vertical-brilho"
          defaultValue={[25]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
        <Label id="vertical-brilho">Brilho</Label>
      </div>
    </div>
  ),
}

export const Controlado: Story = {
  render: () => <SliderControlado />,
}

export const Desabilitado: Story = {
  render: () => (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <Label id="desabilitado-volume">Volume</Label>
      <Slider
        aria-labelledby="desabilitado-volume"
        defaultValue={[50]}
        max={100}
        step={1}
        disabled
      />
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const polegar = await canvas.findByRole("slider", { name: "مستوى الصوت" })

    // In RTL the horizontal axis is mirrored: ArrowLeft raises the value.
    polegar.focus()
    await userEvent.keyboard("{ArrowLeft}")
    await expect(polegar).toHaveAttribute("aria-valuenow", "76")
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar" className="mx-auto grid w-full max-w-xs gap-3">
        <Label id="rtl-volume">مستوى الصوت</Label>
        <Slider
          aria-labelledby="rtl-volume"
          defaultValue={[75]}
          max={100}
          step={1}
          dir="rtl"
        />
      </div>
    </DirectionProvider>
  ),
}

export const Playground: Story = {
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    disabled: false,
    "aria-labelledby": "playground-volume",
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <div className="mx-auto grid w-full max-w-xs gap-3">
      <Label id="playground-volume">Volume</Label>
      <Slider {...args} />
    </div>
  ),
}
