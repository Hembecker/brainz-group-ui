import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Field,
  FieldDescription,
  FieldTitle,
} from "@workspace/ui/components/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

/*
 * One story per section of toggle-group.mdx, in the order of the shadcn/ui
 * page. The group is named (`aria-label` or `aria-labelledby`); an icon-only
 * item has an `aria-label`, and an item with visible text is named by that
 * text. Ids are prefixed with the story name: the Docs page renders all
 * stories in the same document.
 */
const meta = {
  title: "Componentes/Toggle Group",
  component: ToggleGroup,
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grupo = await canvas.findByRole("group", {
      name: "Formatação do texto",
    })
    const negrito = within(grupo).getByRole("button", { name: "Negrito" })
    const italico = within(grupo).getByRole("button", { name: "Itálico" })

    // Keyboard: Tab enters the group, Space presses, an arrow moves the
    // focus to another item (the direction follows the page, so only the
    // move is checked). `multiple` allows two pressed at once.
    await userEvent.tab()
    await expect(negrito).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(negrito).toHaveAttribute("aria-pressed", "true")
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(negrito).not.toHaveFocus())
    await userEvent.click(italico)
    await expect(italico).toHaveAttribute("aria-pressed", "true")
    await expect(negrito).toHaveAttribute("aria-pressed", "true")
  },
  render: () => (
    <ToggleGroup variant="outline" multiple aria-label="Formatação do texto">
      <ToggleGroupItem value="bold" aria-label="Negrito">
        <BoldIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálico">
        <ItalicIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Sublinhado">
        <UnderlineIcon aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Outline: Story = {
  name: "Outline",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const todas = await canvas.findByRole("button", { name: "Todas" })
    const perdidas = canvas.getByRole("button", { name: "Perdidas" })

    // Single selection: pressing the other item moves the pressed state.
    await expect(todas).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(perdidas)
    await expect(perdidas).toHaveAttribute("aria-pressed", "true")
    await expect(todas).toHaveAttribute("aria-pressed", "false")
  },
  render: () => (
    <ToggleGroup
      variant="outline"
      defaultValue={["all"]}
      aria-label="Filtrar chamadas"
    >
      <ToggleGroupItem value="all">Todas</ToggleGroupItem>
      <ToggleGroupItem value="missed">Perdidas</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        size="sm"
        defaultValue={["top"]}
        variant="outline"
        aria-label="Posição, tamanho pequeno"
      >
        <ToggleGroupItem value="top">Topo</ToggleGroupItem>
        <ToggleGroupItem value="bottom">Base</ToggleGroupItem>
        <ToggleGroupItem value="left">Esquerda</ToggleGroupItem>
        <ToggleGroupItem value="right">Direita</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        defaultValue={["top"]}
        variant="outline"
        aria-label="Posição, tamanho padrão"
      >
        <ToggleGroupItem value="top">Topo</ToggleGroupItem>
        <ToggleGroupItem value="bottom">Base</ToggleGroupItem>
        <ToggleGroupItem value="left">Esquerda</ToggleGroupItem>
        <ToggleGroupItem value="right">Direita</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

export const Espacamento: Story = {
  name: "Espaçamento",
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        size="sm"
        defaultValue={["top"]}
        variant="outline"
        spacing={0}
        aria-label="Posição, itens juntos"
      >
        <ToggleGroupItem value="top">Topo</ToggleGroupItem>
        <ToggleGroupItem value="bottom">Base</ToggleGroupItem>
        <ToggleGroupItem value="left">Esquerda</ToggleGroupItem>
        <ToggleGroupItem value="right">Direita</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        size="sm"
        defaultValue={["top"]}
        variant="outline"
        spacing={2}
        aria-label="Posição, itens separados"
      >
        <ToggleGroupItem value="top">Topo</ToggleGroupItem>
        <ToggleGroupItem value="bottom">Base</ToggleGroupItem>
        <ToggleGroupItem value="left">Esquerda</ToggleGroupItem>
        <ToggleGroupItem value="right">Direita</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

export const Vertical: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grupo = await canvas.findByRole("group", {
      name: "Formatação do texto, na vertical",
    })
    const negrito = within(grupo).getByRole("button", { name: "Negrito" })
    const italico = within(grupo).getByRole("button", { name: "Itálico" })

    // Vertical: up and down move the focus, in any direction (LTR or RTL).
    await userEvent.tab()
    await expect(negrito).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() => expect(italico).toHaveFocus())
    await userEvent.keyboard("{ArrowUp}")
    await waitFor(() => expect(negrito).toHaveFocus())
  },
  render: () => (
    <ToggleGroup
      multiple
      orientation="vertical"
      spacing={1}
      defaultValue={["bold", "italic"]}
      aria-label="Formatação do texto, na vertical"
    >
      <ToggleGroupItem value="bold" aria-label="Negrito">
        <BoldIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálico">
        <ItalicIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Sublinhado">
        <UnderlineIcon aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <ToggleGroup disabled aria-label="Formatação do texto, desabilitada">
      <ToggleGroupItem value="bold" aria-label="Negrito">
        <BoldIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálico">
        <ItalicIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Sublinhado">
        <UnderlineIcon aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

/*
 * The controlled example needs a hook, so it is a helper component. The
 * label text stays in the item's own color (no `text-muted-foreground`),
 * because on the pressed fill a muted gray would fall below 4.5:1.
 */
function ExemploPersonalizado() {
  const [peso, setPeso] = React.useState("normal")

  return (
    <Field className="max-w-sm">
      <FieldTitle id="personalizado-peso-titulo">Peso da fonte</FieldTitle>
      <ToggleGroup
        value={[peso]}
        onValueChange={(valor) => setPeso(valor[0] ?? peso)}
        variant="outline"
        spacing={2}
        size="lg"
        aria-labelledby="personalizado-peso-titulo"
        aria-describedby="personalizado-peso-descricao"
      >
        <ToggleGroupItem
          value="light"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-light">Aa</span>
          <span className="text-xs">Leve</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-normal">Aa</span>
          <span className="text-xs">Normal</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="medium"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-medium">Aa</span>
          <span className="text-xs">Médio</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bold"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-bold">Aa</span>
          <span className="text-xs">Negrito</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <FieldDescription id="personalizado-peso-descricao">
        Use{" "}
        <code className="rounded-md bg-muted px-1 py-0.5 font-mono">
          font-{peso}
        </code>{" "}
        para definir o peso da fonte.
      </FieldDescription>
    </Field>
  )
}

export const Personalizado: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const medio = await canvas.findByRole("button", { name: /Médio/ })
    const normal = canvas.getByRole("button", { name: /Normal/ })

    // Controlled single selection; pressing the pressed item keeps the value.
    await expect(normal).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(medio)
    await expect(medio).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(medio)
    await expect(medio).toHaveAttribute("aria-pressed", "true")
  },
  parameters: {
    docs: {
      source: {
        code: `export function ExemploPersonalizado() {
  const [peso, setPeso] = React.useState("normal")

  return (
    <Field className="max-w-sm">
      <FieldTitle id="personalizado-peso-titulo">Peso da fonte</FieldTitle>
      <ToggleGroup
        value={[peso]}
        onValueChange={(valor) => setPeso(valor[0] ?? peso)}
        variant="outline"
        spacing={2}
        size="lg"
        aria-labelledby="personalizado-peso-titulo"
        aria-describedby="personalizado-peso-descricao"
      >
        <ToggleGroupItem
          value="light"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-light">Aa</span>
          <span className="text-xs">Leve</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-normal">Aa</span>
          <span className="text-xs">Normal</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="medium"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-medium">Aa</span>
          <span className="text-xs">Médio</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bold"
          className="flex size-16 flex-col items-center justify-center"
        >
          <span className="text-2xl leading-none font-bold">Aa</span>
          <span className="text-xs">Negrito</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <FieldDescription id="personalizado-peso-descricao">
        Use{" "}
        <code className="rounded-md bg-muted px-1 py-0.5 font-mono">
          font-{peso}
        </code>{" "}
        para definir o peso da fonte.
      </FieldDescription>
    </Field>
  )
}`,
      },
    },
  },
  render: () => <ExemploPersonalizado />,
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const lista = await canvas.findByRole("button", { name: "قائمة" })
    const grade = canvas.getByRole("button", { name: "شبكة" })

    // In RTL the arrows swap: ArrowLeft goes to the next item (visually to
    // the left, where the next one is), ArrowRight to the previous.
    await userEvent.tab()
    await expect(lista).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(grade).toHaveFocus())
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(lista).toHaveFocus())
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <ToggleGroup
          variant="outline"
          defaultValue={["list"]}
          aria-label="طريقة العرض"
        >
          <ToggleGroupItem value="list">قائمة</ToggleGroupItem>
          <ToggleGroupItem value="grid">شبكة</ToggleGroupItem>
          <ToggleGroupItem value="cards">بطاقات</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </DirectionProvider>
  ),
}

export const Playground: Story = {
  args: {
    variant: "outline",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: false,
    disabled: false,
    "aria-label": "Formatação do texto",
    children: (
      <>
        <ToggleGroupItem value="bold" aria-label="Negrito">
          <BoldIcon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Itálico">
          <ItalicIcon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Sublinhado">
          <UnderlineIcon aria-hidden="true" />
        </ToggleGroupItem>
      </>
    ),
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    spacing: { control: "number" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}
