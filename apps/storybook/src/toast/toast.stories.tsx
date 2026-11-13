import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import { Toaster, toast } from "@workspace/ui/components/toast"

/*
 * One story per section of toast.mdx, in the order of the shadcn/ui page
 * (the "Action" section is code only there, so it lives in the MDX).
 *
 * The toasts are rendered by the <Toaster /> through a portal, and the global
 * `toast` manager is shared by everything in the page. So the meta decorator
 * mounts one <Toaster /> per story, except on the Docs page, where toast.mdx
 * mounts a single one (otherwise every Toaster would show every toast).
 * `beforeEach` closes what a previous story left in the manager.
 *
 * A toast is invisible to axe until it exists, and it disappears after 5 s,
 * so every `play` clicks the trigger, waits for the toast and for the enter
 * animation to end, and then presses F6: it moves the focus to the viewport
 * and pauses the timers, which keeps the toast on screen for axe.
 */
const meta = {
  title: "Componentes/Toast",
  component: Toaster,
  decorators: [
    (Story, context) => (
      <>
        {context.viewMode === "docs" ? null : <Toaster />}
        <Story />
      </>
    ),
  ],
  beforeEach: () => {
    toast.close()
    return () => toast.close()
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
}

async function mostrarAviso(
  canvasElement: HTMLElement,
  gatilho: string,
  titulo: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const aviso = await screen.findByRole("dialog", { name: titulo })
  await esperarAnimacoes()
  await waitFor(() => expect(aviso).toBeVisible())
  return aviso
}

async function pausarComF6() {
  await userEvent.keyboard("{F6}")
  await waitFor(() =>
    expect(
      screen.getByRole("region", { name: "Notificações" })
    ).toHaveFocus()
  )
  await esperarAnimacoes()
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", { name: "Mostrar aviso" })

    // The live region is mounted before any toast exists.
    const regiao = screen.getByRole("region", { name: "Notificações" })
    await expect(regiao).toHaveAttribute("aria-live", "polite")

    const aviso = await mostrarAviso(
      canvasElement,
      "Mostrar aviso",
      "Evento criado"
    )

    // F6 moves the focus to the viewport; Tab reaches the toast's controls.
    await pausarComF6()
    for (let i = 0; i < 4; i++) {
      await userEvent.tab()
      if (aviso.contains(document.activeElement)) break
    }
    await waitFor(() =>
      expect(aviso).toContainElement(document.activeElement as HTMLElement)
    )

    // Esc closes the focused toast, and the focus goes back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Shows it again and keeps it on screen, for axe.
    await mostrarAviso(canvasElement, "Mostrar aviso", "Evento criado")
    await pausarComF6()
  },
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.add({
          title: "Evento criado",
          description: "Domingo, 3 de dezembro, às 9h00",
          actionProps: {
            children: "Desfazer",
            onClick() {
              toast.close(id)
            },
          },
        })
      }}
    >
      Mostrar aviso
    </Button>
  ),
}

export const Tipos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const nome of ["Padrão", "Sucesso", "Informação", "Alerta", "Erro"]) {
      await userEvent.click(await canvas.findByRole("button", { name: nome }))
    }
    // The high-priority toast is aria-hidden until it gets focus (the viewport
    // announces it separately as role="alert"), so it is found by its text.
    await screen.findAllByText("Não foi possível criar")
    await esperarAnimacoes()
    // No F6 here: hovering a toast pauses the timers and keeps the error
    // toast aria-hidden, which is its real state before it gets focus.
    await userEvent.hover(
      screen.getAllByText("Não foi possível criar")[0].closest("[data-slot=toast]")!
    )
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Evento criado",
            description: "O evento foi criado.",
          })
        }
      >
        Padrão
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "success",
            title: "Evento salvo",
            description: "O evento foi salvo com sucesso.",
          })
        }
      >
        Sucesso
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "info",
            title: "Chegue mais cedo",
            description: "Chegue 10 minutos antes do evento.",
          })
        }
      >
        Informação
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "warning",
            title: "Horário inválido",
            description: "O evento não pode começar antes das 8h00.",
          })
        }
      >
        Alerta
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "error",
            title: "Não foi possível criar",
            description: "O evento não pôde ser criado.",
            priority: "high",
          })
        }
      >
        Erro
      </Button>
    </div>
  ),
}

export const Promessa: Story = {
  name: "Promise",
  play: async ({ canvasElement }) => {
    await mostrarAviso(canvasElement, "Criar evento", "Criando evento…")
    await screen.findByRole("dialog", { name: "Evento criado." }, { timeout: 5000 })
    await esperarAnimacoes()
    await pausarComF6()
  },
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        toast.promise(
          new Promise<{ name: string }>((resolve) => {
            window.setTimeout(() => resolve({ name: "Evento" }), 2000)
          }),
          {
            loading: { title: "Criando evento…" },
            success: (data) => ({ title: `${data.name} criado.` }),
            error: { title: "Não foi possível criar o evento." },
          }
        )
      }}
    >
      Criar evento
    </Button>
  ),
}
