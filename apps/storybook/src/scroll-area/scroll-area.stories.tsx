import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"

/*
 * One story per section of scroll-area.mdx, in the order of the shadcn/ui
 * page. The viewport is what scrolls and takes focus, so every scrollable
 * area is a named region: `role="region"` and `aria-labelledby` (or
 * `aria-label`) on the `ScrollArea`, which forwards them to the viewport.
 * Ids are prefixed with the story name: the Docs page renders all stories in
 * the same document. The shadcn examples loop over 50 items and use remote
 * photos: here the items are literal and the pictures are local.
 */
const meta = {
  title: "Componentes/Scroll Area",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const regiao = await canvas.findByRole("region", { name: "Versões" })

    // The region is reachable by keyboard: Tab focuses the viewport (its
    // tabindex only appears after the overflow is measured); the arrow keys
    // then scroll it natively (the synthetic keys of the test do not).
    await waitFor(() => expect(regiao).toHaveAttribute("tabindex", "0"))
    await expect(regiao.scrollHeight).toBeGreaterThan(regiao.clientHeight)
    await userEvent.tab()
    await expect(regiao).toHaveFocus()
  },
  render: () => (
    <ScrollArea
      role="region"
      aria-labelledby="demo-versoes-titulo"
      className="h-72 w-48 rounded-md border"
    >
      <div className="p-4">
        <h4
          id="demo-versoes-titulo"
          className="mb-4 text-sm leading-none font-medium"
        >
          Versões
        </h4>
        <div className="text-sm">v1.2.0-beta.12</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.11</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.10</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.9</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.8</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.7</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.6</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.5</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.4</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.3</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.2</div>
        <Separator className="my-2" />
        <div className="text-sm">v1.2.0-beta.1</div>
        <Separator className="my-2" />
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const regiao = await canvas.findByRole("region", {
      name: "Galeria de obras",
    })

    await waitFor(() => expect(regiao).toHaveAttribute("tabindex", "0"))
    await expect(regiao.scrollWidth).toBeGreaterThan(regiao.clientWidth)
    await userEvent.tab()
    await expect(regiao).toHaveFocus()
  },
  render: () => (
    <ScrollArea
      role="region"
      aria-label="Galeria de obras"
      className="w-96 rounded-md border whitespace-nowrap"
    >
      <div className="flex w-max gap-4 p-4">
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md bg-muted">
            <img
              src="brainz-group-logo.svg"
              alt=""
              className="aspect-[3/4] h-48 w-36 object-contain p-4"
            />
          </div>
          <figcaption className="pt-2 text-xs text-muted-foreground">
            Obra de{" "}
            <span className="font-semibold text-foreground">Ornella Binni</span>
          </figcaption>
        </figure>
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md bg-muted">
            <img
              src="brainz-group-logo.svg"
              alt=""
              className="aspect-[3/4] h-48 w-36 object-contain p-4"
            />
          </div>
          <figcaption className="pt-2 text-xs text-muted-foreground">
            Obra de{" "}
            <span className="font-semibold text-foreground">Tom Byrom</span>
          </figcaption>
        </figure>
        <figure className="shrink-0">
          <div className="overflow-hidden rounded-md bg-muted">
            <img
              src="brainz-group-logo.svg"
              alt=""
              className="aspect-[3/4] h-48 w-36 object-contain p-4"
            />
          </div>
          <figcaption className="pt-2 text-xs text-muted-foreground">
            Obra de{" "}
            <span className="font-semibold text-foreground">
              Vladimir Malyavko
            </span>
          </figcaption>
        </figure>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <ScrollArea
        role="region"
        aria-labelledby="rtl-tags-titulo"
        className="h-72 w-48 rounded-md border"
        dir="rtl"
      >
        <div className="p-4">
          <h4
            id="rtl-tags-titulo"
            className="mb-4 text-sm leading-none font-medium"
          >
            العلامات
          </h4>
          <div className="text-sm">v1.2.0-beta.12</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.11</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.10</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.9</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.8</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.7</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.6</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.5</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.4</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.3</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.2</div>
          <Separator className="my-2" />
          <div className="text-sm">v1.2.0-beta.1</div>
          <Separator className="my-2" />
        </div>
      </ScrollArea>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    role: "region",
    "aria-label": "Notas de versão",
    className: "h-40 w-48 rounded-md border",
    children: (
      <div className="p-4 text-sm">
        <p className="mb-2">v1.2.0 corrige o foco do menu lateral.</p>
        <p className="mb-2">v1.1.0 adiciona o modo escuro.</p>
        <p className="mb-2">v1.0.0 é a primeira versão pública.</p>
        <p className="mb-2">v0.9.0 reúne as últimas correções antes do lançamento.</p>
      </div>
    ),
  },
  argTypes: {
    className: { control: "text" },
    "aria-label": { control: "text" },
  },
}
