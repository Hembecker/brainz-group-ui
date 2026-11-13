import type { Meta, StoryObj } from "@storybook/react-vite"
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import { Kbd } from "@workspace/ui/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

/*
 * One story per section of tooltip.mdx, in the order of the shadcn/ui page,
 * plus "Provedor", which shows the TooltipProvider that the page asks for in
 * the installation step. None of the other stories uses the provider: they
 * prove that the Base UI Tooltip works without it.
 *
 * A closed tooltip is invisible to axe, so every story has a `play` that
 * opens it first, by KEYBOARD (Tab to the trigger): the focus keeps the
 * tooltip open while axe runs, and it proves that the tooltip opens on focus,
 * not only on hover. `abrirPorTeclado` waits for the content (it is portaled
 * to <body>, so it is queried with `screen`) and for the enter animation to
 * end (axe would measure contrast mid-fade).
 */
const meta = {
  title: "Componentes/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

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
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(conteudo).toBeVisible())
  return { botao, conteudo }
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const texto = "Adicionar à biblioteca"
    const botao = await within(canvasElement).findByRole("button", {
      name: "Passe o mouse",
    })

    // Opens on hover and closes when the mouse leaves.
    await userEvent.hover(botao)
    await waitFor(() => expect(screen.getByText(texto)).toBeVisible())
    await userEvent.unhover(botao)
    await waitFor(() => expect(screen.queryByText(texto)).toBeNull())

    // Opens on keyboard focus too (Tab).
    await abrirPorTeclado(canvasElement, "Passe o mouse", texto)

    // Esc closes it.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByText(texto)).toBeNull())

    // Leaves and comes back with the keyboard, and stays open for axe.
    botao.blur()
    await abrirPorTeclado(canvasElement, "Passe o mouse", texto)
  },
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Passe o mouse
      </TooltipTrigger>
      <TooltipContent>
        <p>Adicionar à biblioteca</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const Provedor: Story = {
  play: async ({ canvasElement }) => {
    // Tab moves from one trigger to the next, and each one opens its tooltip.
    await abrirPorTeclado(canvasElement, "Editar fatura", "Editar fatura")
    await abrirPorTeclado(canvasElement, "Salvar fatura", "Salvar fatura")
    await abrirPorTeclado(canvasElement, "Excluir fatura", "Excluir fatura")
  },
  render: () => (
    <TooltipProvider delay={300} closeDelay={100}>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Editar fatura"
              />
            }
          >
            <PencilIcon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Editar fatura</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Salvar fatura"
              />
            }
          >
            <SaveIcon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Salvar fatura</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Excluir fatura"
              />
            }
          >
            <Trash2Icon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Excluir fatura</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const Lado: Story = {
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(canvasElement, "esquerda", "Adicionar à biblioteca")
    await abrirPorTeclado(canvasElement, "acima", "Adicionar à biblioteca")
    await abrirPorTeclado(canvasElement, "abaixo", "Adicionar à biblioteca")
    await abrirPorTeclado(canvasElement, "direita", "Adicionar à biblioteca")
  },
  render: () => (
    <div className="flex flex-wrap gap-2 px-40 py-16">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          esquerda
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Adicionar à biblioteca</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          acima
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Adicionar à biblioteca</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          abaixo
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Adicionar à biblioteca</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          direita
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Adicionar à biblioteca</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const ComAtalhoDeTeclado: Story = {
  name: "Com atalho de teclado",
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(
      canvasElement,
      "Salvar alterações",
      "Salvar alterações"
    )
  },
  render: () => (
    <div className="pt-12">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Salvar alterações"
            />
          }
        >
          <SaveIcon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>
          Salvar alterações <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const BotaoDesabilitado: Story = {
  name: "Botão desabilitado",
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(
      canvasElement,
      "Exportar",
      "Este recurso está indisponível no momento"
    )
  },
  render: () => (
    <div className="pt-12">
      <Tooltip>
        <TooltipTrigger render={<span className="inline-block w-fit" />}>
          <Button variant="outline" disabled focusableWhenDisabled>
            Exportar
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Este recurso está indisponível no momento</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirPorTeclado(canvasElement, "يسار", "إضافة إلى المكتبة")
    await abrirPorTeclado(canvasElement, "أعلى", "إضافة إلى المكتبة")
    await abrirPorTeclado(canvasElement, "بداية السطر", "إضافة إلى المكتبة")
    await abrirPorTeclado(canvasElement, "نهاية السطر", "إضافة إلى المكتبة")
  },
  render: () => (
    <div dir="rtl" lang="ar" className="grid gap-4 px-40 py-16">
      <div className="flex flex-wrap justify-center gap-2">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            يسار
          </TooltipTrigger>
          <TooltipContent side="left" dir="rtl" lang="ar">
            إضافة إلى المكتبة
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            أعلى
          </TooltipTrigger>
          <TooltipContent side="top" dir="rtl" lang="ar">
            إضافة إلى المكتبة
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            بداية السطر
          </TooltipTrigger>
          <TooltipContent side="inline-start" dir="rtl" lang="ar">
            إضافة إلى المكتبة
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            نهاية السطر
          </TooltipTrigger>
          <TooltipContent side="inline-end" dir="rtl" lang="ar">
            إضافة إلى المكتبة
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
}
