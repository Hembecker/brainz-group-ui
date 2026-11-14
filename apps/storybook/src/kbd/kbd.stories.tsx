import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchIcon } from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

/*
 * One story per section of kbd.mdx, in the order of the shadcn/ui page.
 * Section stories use literal JSX (no args) so "Show code" can be copied as
 * is; Playground is the one with controls.
 *
 * Symbol keys (⌘ ⇧ ⏎) have an unpredictable spoken name, so each one is a
 * hidden symbol plus an `sr-only` name. The Tooltip story has a `play` that
 * opens each tooltip by keyboard: a closed tooltip is invisible to axe, and
 * the content is portaled to <body> (queried with `screen`).
 */
const meta = {
  title: "Componentes/Kbd",
  component: Kbd,
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

async function abrirPorTeclado(
  canvasElement: HTMLElement,
  gatilho: string,
  texto: string
) {
  const botao = await within(canvasElement).findByRole("button", {
    name: gatilho,
  })
  for (let i = 0; i < 10 && document.activeElement !== botao; i++) {
    await userEvent.tab()
  }
  await expect(botao).toHaveFocus()
  const conteudo = await screen.findByText(texto)
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(conteudo).toBeVisible())
}

export const Demo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>
          <span aria-hidden="true">⌘</span>
          <span className="sr-only">Command</span>
        </Kbd>
        <Kbd>
          <span aria-hidden="true">⇧</span>
          <span className="sr-only">Shift</span>
        </Kbd>
        <Kbd>
          <span aria-hidden="true">⌥</span>
          <span className="sr-only">Option</span>
        </Kbd>
        <Kbd>
          <span aria-hidden="true">⌃</span>
          <span className="sr-only">Control</span>
        </Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span aria-hidden="true">+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </div>
  ),
}

export const Grupo: Story = {
  render: () => (
    <p className="text-sm text-muted-foreground">
      Use{" "}
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      para abrir a paleta de comandos
    </p>
  ),
}

export const Botao: Story = {
  name: "Button",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline">
        Aceitar{" "}
        <Kbd
          data-icon="inline-end"
          className="translate-x-0.5 rtl:-translate-x-0.5"
        >
          <span aria-hidden="true">⏎</span>
          <span className="sr-only">Enter</span>
        </Kbd>
      </Button>
      <Button>
        Salvar{" "}
        <Kbd
          data-icon="inline-end"
          className="translate-x-0.5 rtl:-translate-x-0.5"
        >
          <span aria-hidden="true">⌘</span>
          <span className="sr-only">Command</span>
        </Kbd>
      </Button>
    </div>
  ),
}

export const ComTooltip: Story = {
  name: "Tooltip",
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(canvasElement, "Salvar", "Salvar alterações")
    await abrirPorTeclado(canvasElement, "Imprimir", "Imprimir documento")
  },
  render: () => (
    <div className="pt-12">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Salvar
          </TooltipTrigger>
          <TooltipContent>
            Salvar alterações <Kbd>S</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Imprimir
          </TooltipTrigger>
          <TooltipContent>
            Imprimir documento{" "}
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  ),
}

export const ComInputGroup: Story = {
  name: "Input Group",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="kbd-input-group-busca">Buscar</FieldLabel>
      <InputGroup>
        <InputGroupInput id="kbd-input-group-busca" placeholder="Buscar..." />
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>
            <span aria-hidden="true">⌘</span>
            <span className="sr-only">Command</span>
          </Kbd>
          <Kbd>K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar" className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>
          <span aria-hidden="true">⌘</span>
          <span className="sr-only">أمر</span>
        </Kbd>
        <Kbd>
          <span aria-hidden="true">⇧</span>
          <span className="sr-only">تبديل</span>
        </Kbd>
        <Kbd>
          <span aria-hidden="true">⌥</span>
          <span className="sr-only">خيار</span>
        </Kbd>
        <Kbd>
          <span aria-hidden="true">⌃</span>
          <span className="sr-only">تحكم</span>
        </Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span aria-hidden="true">+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    children: "Ctrl",
  },
}
