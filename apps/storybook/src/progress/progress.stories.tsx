import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { DirectionProvider } from "@workspace/ui/components/direction"
import { Label } from "@workspace/ui/components/label"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@workspace/ui/components/progress"
import { Slider } from "@workspace/ui/components/slider"

/*
 * One story per section of progress.mdx, in the order of the shadcn/ui page.
 * The shadcn Demo animates the value from 13 to 66 with a timer; here it shows
 * the final value (a literal snippet cannot hold the state).
 *
 * Every progress bar has an accessible name: the ProgressLabel (linked by
 * `aria-labelledby` by Base UI itself) or, with no visible label, `aria-label`.
 * The value is exposed by the Base UI root (`aria-valuenow` and
 * `aria-valuetext`); the visible ProgressValue is `aria-hidden`.
 *
 * `ProgressControlado` exists only because the Controlado story needs state:
 * a story's `render` cannot call hooks. The story has the full code in
 * `parameters.docs.source.code`.
 */
const meta = {
  title: "Componentes/Progress",
  component: Progress,
} satisfies Meta<typeof Progress>

export default meta
// `value` is a required prop of Progress, which the literal `render` stories
// do not pass as `args`: a plain StoryObj keeps the args untyped.
type Story = StoryObj

function ProgressControlado() {
  const [valor, setValor] = React.useState(50)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress
        value={valor}
        aria-label="Progresso do envio"
        className="w-full"
      />
      <div className="grid gap-3">
        <Label id="controlado-ajuste">Ajustar o progresso</Label>
        <Slider
          aria-labelledby="controlado-ajuste"
          value={[valor]}
          onValueChange={(novo) => setValor((novo as number[])[0])}
          min={0}
          max={100}
          step={1}
        />
      </div>
    </div>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const barra = await canvas.findByRole("progressbar", {
      name: "Progresso do envio",
    })
    await expect(barra).toHaveAttribute("aria-valuenow", "66")
    await expect(barra).toHaveAttribute("aria-valuemin", "0")
    await expect(barra).toHaveAttribute("aria-valuemax", "100")
    await expect(barra).toHaveAttribute("aria-valuetext", "66%")
  },
  render: () => (
    <Progress value={66} aria-label="Progresso do envio" className="w-[60%]" />
  ),
}

export const Rotulo: Story = {
  name: "Rótulo",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The ProgressLabel names the bar with no `aria-label`.
    const barra = await canvas.findByRole("progressbar", {
      name: "Progresso do envio",
    })
    await expect(barra).toHaveAttribute("aria-valuenow", "56")
  },
  render: () => (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Progresso do envio</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

export const Controlado: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [valor, setValor] = React.useState(50)

<div className="flex w-full max-w-sm flex-col gap-4">
  <Progress
    value={valor}
    aria-label="Progresso do envio"
    className="w-full"
  />
  <div className="grid gap-3">
    <Label id="controlado-ajuste">Ajustar o progresso</Label>
    <Slider
      aria-labelledby="controlado-ajuste"
      value={[valor]}
      onValueChange={(novo) => setValor((novo as number[])[0])}
      min={0}
      max={100}
      step={1}
    />
  </div>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const barra = await canvas.findByRole("progressbar", {
      name: "Progresso do envio",
    })
    await expect(barra).toHaveAttribute("aria-valuenow", "50")

    // Moving the slider moves the exposed value of the progress bar.
    const polegar = await canvas.findByRole("slider", {
      name: "Ajustar o progresso",
    })
    // The arrow that raises the value is mirrored in RTL.
    const aumentar =
      document.documentElement.dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}"
    polegar.focus()
    await userEvent.keyboard(aumentar + aumentar)
    await expect(barra).toHaveAttribute("aria-valuenow", "52")
  },
  render: () => <ProgressControlado />,
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const barra = await canvas.findByRole("progressbar", {
      name: "تقدم الرفع",
    })
    await expect(barra).toHaveAttribute("aria-valuenow", "56")
    // `ar-EG` writes Arabic-Indic digits (the plain `ar` gives Latin ones).
    await expect(barra).toHaveAttribute("aria-valuetext", "٥٦٪؜")

    // The fill grows from the start side, which is the right in RTL.
    const trilho = barra.querySelector('[data-slot="progress-track"]')!
    const preenchimento = barra.querySelector(
      '[data-slot="progress-indicator"]'
    )!
    const t = trilho.getBoundingClientRect()
    const p = preenchimento.getBoundingClientRect()
    await expect(Math.abs(p.right - (t.right - 1))).toBeLessThan(2)
    await expect(p.left).toBeGreaterThan(t.left + 2)
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Progress value={56} locale="ar-EG" className="w-full max-w-sm" dir="rtl">
          <ProgressLabel>تقدم الرفع</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    </DirectionProvider>
  ),
}

export const Playground: Story = {
  args: {
    value: 56,
    min: 0,
    max: 100,
    "aria-label": "Progresso do envio",
    className: "w-full max-w-sm",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
  },
}
