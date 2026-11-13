import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  FolderIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { DirectionProvider } from "@workspace/ui/components/direction"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

/*
 * One story per section of collapsible.mdx, in the order of the shadcn/ui
 * page. A closed panel is out of the accessible tree, so every story ends
 * with the panel open (in `play` or by `defaultOpen`) for axe to measure it.
 * Differences from the shadcn examples:
 * - the arrow that turns is driven by `group-data-panel-open/button` on the
 *   trigger (Base UI), not by React state or by Radix's `data-state`;
 * - the settings panel swaps its icon the same way, and its fields have
 *   distinct ids and labels (the original repeats `id="radius"`);
 * - the file tree is written out as literal JSX, without a recursive helper.
 */
const meta = {
  title: "Componentes/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Alternar detalhes do pedido",
    })

    // Starts closed: aria-expanded is false and the panel is not rendered.
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByText("Endereço de entrega")).toBeNull()

    // Keyboard: Tab reaches the trigger; Enter opens, Space closes.
    await userEvent.tab()
    await expect(gatilho).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    const painel = canvasElement.querySelector(
      `#${CSS.escape(gatilho.getAttribute("aria-controls") ?? "")}`
    )
    await expect(painel).not.toBeNull()
    await expect(canvas.getByText("Endereço de entrega")).toBeVisible()
    await userEvent.keyboard(" ")
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")

    // Opens again and stays open, for axe.
    await userEvent.keyboard("{Enter}")
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
  },
  render: () => (
    <Collapsible className="flex w-[350px] flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="text-sm font-semibold">Pedido nº 4189</h4>
        <CollapsibleTrigger
          render={<Button variant="ghost" size="icon" className="size-8" />}
        >
          <ChevronsUpDownIcon aria-hidden="true" />
          <span className="sr-only">Alternar detalhes do pedido</span>
        </CollapsibleTrigger>
      </div>
      <div className="flex items-center justify-between rounded-2xl border px-4 py-2 text-sm">
        <span className="text-muted-foreground">Status</span>
        <span className="font-medium">Enviado</span>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-2xl border px-4 py-2 text-sm">
          <p className="font-medium">Endereço de entrega</p>
          <p className="text-muted-foreground">Av. Paulista, 1000, São Paulo</p>
        </div>
        <div className="rounded-2xl border px-4 py-2 text-sm">
          <p className="font-medium">Itens</p>
          <p className="text-muted-foreground">2x Fones de ouvido de estúdio</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

function EstadoControladoExemplo() {
  const [open, setOpen] = React.useState(true)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex w-[350px] flex-col gap-2"
    >
      <CollapsibleTrigger render={<Button variant="outline" />}>
        {open ? "Ocultar detalhes" : "Mostrar detalhes"}
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-2xl border px-4 py-2 text-sm">
        O estado fica no seu componente: ele sabe quando o painel está aberto.
      </CollapsibleContent>
    </Collapsible>
  )
}

export const EstadoControlado: Story = {
  name: "Estado controlado",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [open, setOpen] = React.useState(true)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex w-[350px] flex-col gap-2"
    >
      <CollapsibleTrigger render={<Button variant="outline" />}>
        {open ? "Ocultar detalhes" : "Mostrar detalhes"}
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-2xl border px-4 py-2 text-sm">
        O estado fica no seu componente: ele sabe quando o painel está aberto.
      </CollapsibleContent>
    </Collapsible>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Ocultar detalhes",
    })

    // The label follows the controlled state; the state is also exposed.
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(gatilho)
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await expect(gatilho).toHaveTextContent("Mostrar detalhes")
    await userEvent.click(gatilho)
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
  },
  render: () => <EstadoControladoExemplo />,
}

export const Basico: Story = {
  name: "Básico",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Detalhes do produto",
    })
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(gatilho)
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Saiba mais" })).toBeVisible()
    )
    await esperarAnimacoes()
  },
  render: () => (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent>
        <Collapsible className="rounded-2xl data-open:bg-muted">
          <CollapsibleTrigger
            render={<Button variant="ghost" className="w-full" />}
          >
            Detalhes do produto
            <ChevronDownIcon
              aria-hidden="true"
              className="ms-auto group-data-panel-open/button:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div>
              Este painel pode ser aberto ou fechado para mostrar mais conteúdo.
            </div>
            <Button size="xs">Saiba mais</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ),
}

export const Configuracoes: Story = {
  name: "Painel de configurações",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Mostrar os raios dos outros cantos",
    })
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(gatilho)
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await expect(
      await canvas.findByRole("textbox", { name: "Raio X, canto inferior" })
    ).toBeVisible()
    await esperarAnimacoes()
  },
  render: () => (
    <Card className="mx-auto w-full max-w-xs" size="sm">
      <CardHeader>
        <CardTitle>
          <h3>Raio</h3>
        </CardTitle>
        <CardDescription>Defina o raio dos cantos do elemento.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible className="flex items-start gap-2">
          <FieldGroup className="grid w-full grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="configuracoes-raio-x-superior" className="sr-only">
                Raio X, canto superior
              </FieldLabel>
              <Input
                id="configuracoes-raio-x-superior"
                inputMode="numeric"
                placeholder="0"
                defaultValue={0}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="configuracoes-raio-y-superior" className="sr-only">
                Raio Y, canto superior
              </FieldLabel>
              <Input
                id="configuracoes-raio-y-superior"
                inputMode="numeric"
                placeholder="0"
                defaultValue={0}
              />
            </Field>
            <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-2">
              <Field>
                <FieldLabel htmlFor="configuracoes-raio-x-inferior" className="sr-only">
                  Raio X, canto inferior
                </FieldLabel>
                <Input
                  id="configuracoes-raio-x-inferior"
                  inputMode="numeric"
                  placeholder="0"
                  defaultValue={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="configuracoes-raio-y-inferior" className="sr-only">
                  Raio Y, canto inferior
                </FieldLabel>
                <Input
                  id="configuracoes-raio-y-inferior"
                  inputMode="numeric"
                  placeholder="0"
                  defaultValue={0}
                />
              </Field>
            </CollapsibleContent>
          </FieldGroup>
          <CollapsibleTrigger render={<Button variant="outline" size="icon" />}>
            <MaximizeIcon
              aria-hidden="true"
              className="group-data-panel-open/button:hidden"
            />
            <MinimizeIcon
              aria-hidden="true"
              className="hidden group-data-panel-open/button:block"
            />
            <span className="sr-only">Mostrar os raios dos outros cantos</span>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  ),
}

export const ArvoreDeArquivos: Story = {
  name: "Árvore de arquivos",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pasta = await canvas.findByRole("button", { name: "components" })
    await expect(pasta).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(pasta)
    await expect(pasta).toHaveAttribute("aria-expanded", "true")

    // Nested collapsible: opens inside the first one.
    const interna = await canvas.findByRole("button", { name: "ui" })
    await userEvent.click(interna)
    await expect(interna).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText("dialog.tsx")).toBeVisible()
    await esperarAnimacoes()
  },
  render: () => (
    <Card className="mx-auto w-full max-w-[16rem] gap-2" size="sm">
      <CardHeader>
        <Tabs defaultValue="explorer">
          <TabsList aria-label="Painel lateral" className="w-full">
            <TabsTrigger value="explorer">Explorador</TabsTrigger>
            <TabsTrigger value="outline">Estrutura</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <Collapsible>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                />
              }
            >
              <ChevronRightIcon
                aria-hidden="true"
                className="transition-transform group-data-panel-open/button:rotate-90 rtl:rotate-180 rtl:group-data-panel-open/button:rotate-90"
              />
              <FolderIcon aria-hidden="true" />
              components
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ms-5">
              <div className="flex flex-col gap-1">
                <Collapsible>
                  <CollapsibleTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                      />
                    }
                  >
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="transition-transform group-data-panel-open/button:rotate-90 rtl:rotate-180 rtl:group-data-panel-open/button:rotate-90"
                    />
                    <FolderIcon aria-hidden="true" />
                    ui
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ms-5">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full justify-start gap-2 text-foreground"
                      >
                        <FileIcon aria-hidden="true" />
                        <span>button.tsx</span>
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full justify-start gap-2 text-foreground"
                      >
                        <FileIcon aria-hidden="true" />
                        <span>card.tsx</span>
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full justify-start gap-2 text-foreground"
                      >
                        <FileIcon aria-hidden="true" />
                        <span>dialog.tsx</span>
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Button
                  variant="link"
                  size="sm"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <FileIcon aria-hidden="true" />
                  <span>login-form.tsx</span>
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                />
              }
            >
              <ChevronRightIcon
                aria-hidden="true"
                className="transition-transform group-data-panel-open/button:rotate-90 rtl:rotate-180 rtl:group-data-panel-open/button:rotate-90"
              />
              <FolderIcon aria-hidden="true" />
              lib
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ms-5">
              <div className="flex flex-col gap-1">
                <Button
                  variant="link"
                  size="sm"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <FileIcon aria-hidden="true" />
                  <span>utils.ts</span>
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <FileIcon aria-hidden="true" />
                  <span>api.ts</span>
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Button
            variant="link"
            size="sm"
            className="w-full justify-start gap-2 text-foreground"
          >
            <FileIcon aria-hidden="true" />
            <span>package.json</span>
          </Button>
          <Button
            variant="link"
            size="sm"
            className="w-full justify-start gap-2 text-foreground"
          >
            <FileIcon aria-hidden="true" />
            <span>README.md</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "تبديل التفاصيل",
    })
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    gatilho.focus()
    await userEvent.keyboard(" ")
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText("عنوان الشحن")).toBeVisible()
    await esperarAnimacoes()
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Collapsible className="flex w-[350px] flex-col gap-2">
          <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="text-sm font-semibold">الطلب #4189</h4>
            <CollapsibleTrigger
              render={<Button variant="ghost" size="icon" className="size-8" />}
            >
              <ChevronsUpDownIcon aria-hidden="true" />
              <span className="sr-only">تبديل التفاصيل</span>
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center justify-between rounded-2xl border px-4 py-2 text-sm">
            <span className="text-muted-foreground">الحالة</span>
            <span className="font-medium">تم الشحن</span>
          </div>
          <CollapsibleContent className="flex flex-col gap-2">
            <div className="rounded-2xl border px-4 py-2 text-sm">
              <p className="font-medium">عنوان الشحن</p>
              <p className="text-muted-foreground">100 Market St, San Francisco</p>
            </div>
            <div className="rounded-2xl border px-4 py-2 text-sm">
              <p className="font-medium">العناصر</p>
              <p className="text-muted-foreground">2x سماعات الاستوديو</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </DirectionProvider>
  ),
}
