import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"

/*
 * One story per section of resizable.mdx, in the order of the shadcn/ui
 * page. Every handle is a focusable `role="separator"` and has its own
 * specific name (`aria-label`), different from the others on the same story.
 */
const meta = {
  title: "Componentes/Resizable",
  component: ResizablePanelGroup,
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alca = await canvas.findByRole("separator", {
      name: "Redimensionar o painel Um",
    })
    await expect(
      canvas.getByRole("separator", { name: "Redimensionar o painel Dois" })
    ).toBeVisible()

    // Keyboard: Tab focuses the handle and an arrow resizes the panels, which
    // shows in `aria-valuenow` (the direction follows the page, so only the
    // change is checked).
    await userEvent.tab()
    await expect(alca).toHaveFocus()
    const antes = alca.getAttribute("aria-valuenow")
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(alca.getAttribute("aria-valuenow")).not.toBe(antes))

    // The focus ring is drawn on the 1px line: a solid ring plus the 2px gap
    // in the background color (two shadows), over the neighbor panels.
    const estilo = getComputedStyle(alca)
    await expect(estilo.boxShadow).not.toBe("none")
    await expect(estilo.boxShadow).toContain("2px")
    await expect(estilo.boxShadow).toContain("5px")
    await expect(estilo.zIndex).toBe("10")
  },
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="max-w-sm rounded-lg border"
    >
      <ResizablePanel defaultSize="50%">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Um</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Redimensionar o painel Um" />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Dois</span>
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            aria-label="Redimensionar o painel Dois"
          />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Três</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Vertical: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alca = await canvas.findByRole("separator", {
      name: "Redimensionar o cabeçalho",
    })

    // Stacked panels: the handle is a horizontal line and the vertical
    // arrows resize.
    await expect(alca).toHaveAttribute("aria-orientation", "horizontal")
    await userEvent.tab()
    await expect(alca).toHaveFocus()
    const antes = alca.getAttribute("aria-valuenow")
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() => expect(alca.getAttribute("aria-valuenow")).not.toBe(antes))
  },
  render: () => (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[200px] max-w-sm rounded-lg border"
    >
      <ResizablePanel defaultSize="25%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Cabeçalho</span>
        </div>
      </ResizablePanel>
      <ResizableHandle aria-label="Redimensionar o cabeçalho" />
      <ResizablePanel defaultSize="75%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Conteúdo</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Handle: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] max-w-sm rounded-lg border"
    >
      <ResizablePanel defaultSize="25%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Barra lateral</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Redimensionar a barra lateral" />
      <ResizablePanel defaultSize="75%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Conteúdo</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <DirectionProvider direction="rtl">
        <ResizablePanelGroup
          orientation="horizontal"
          className="max-w-sm rounded-lg border"
          dir="rtl"
        >
          <ResizablePanel defaultSize="50%">
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">واحد</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="تغيير حجم اللوحة واحد" />
          <ResizablePanel defaultSize="50%">
            <ResizablePanelGroup orientation="vertical" dir="rtl">
              <ResizablePanel defaultSize="25%">
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">اثنان</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle aria-label="تغيير حجم اللوحة اثنان" />
              <ResizablePanel defaultSize="75%">
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">ثلاثة</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DirectionProvider>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    orientation: "horizontal",
    className: "min-h-[200px] max-w-sm rounded-lg border",
    children: (
      <>
        <ResizablePanel defaultSize="40%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Esquerda</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Redimensionar a esquerda" />
        <ResizablePanel defaultSize="60%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Direita</span>
          </div>
        </ResizablePanel>
      </>
    ),
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    className: { control: "text" },
  },
}
