import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import { DirectionProvider } from "@workspace/ui/components/direction"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

/*
 * One story per section of popover.mdx, in the order of the shadcn/ui page
 * (Composition has no preview: it is a text tree in the MDX). A closed
 * popover is invisible to axe, so every story has a `play` that opens it
 * first (the test runs axe after `play`). `abrirPopover` finds the popup by
 * role and name (it is portaled to <body>, hence `screen`) and waits for the
 * enter animation to end, because axe would measure contrast mid-fade.
 * Every popup has a name: PopoverTitle, or aria-label when there is no
 * visible title. Ids are prefixed with the story name.
 */
const meta = {
  title: "Componentes/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

async function abrirPopover(
  canvasElement: HTMLElement,
  gatilho: string,
  nome: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const popover = await screen.findByRole("dialog", { name: nome })
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(popover).toBeVisible())
  return popover
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Abrir popover",
    })

    const popover = await abrirPopover(
      canvasElement,
      "Abrir popover",
      "Dimensões"
    )
    await waitFor(() =>
      expect(popover).toContainElement(document.activeElement as HTMLElement)
    )

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirPopover(canvasElement, "Abrir popover", "Dimensões")
  },
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Abrir popover
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <PopoverHeader>
            <PopoverTitle>Dimensões</PopoverTitle>
            <PopoverDescription>
              Defina as dimensões da camada.
            </PopoverDescription>
          </PopoverHeader>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="demo-largura">Largura</Label>
              <Input
                id="demo-largura"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="demo-largura-maxima">Largura máx.</Label>
              <Input
                id="demo-largura-maxima"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="demo-altura">Altura</Label>
              <Input
                id="demo-altura"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="demo-altura-maxima">Altura máx.</Label>
              <Input
                id="demo-altura-maxima"
                defaultValue="nenhuma"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Basico: Story = {
  name: "Básico",
  play: async ({ canvasElement }) => {
    await abrirPopover(canvasElement, "Abrir popover", "Dimensões")
  },
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-fit" />}>
        Abrir popover
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensões</PopoverTitle>
          <PopoverDescription>
            Defina as dimensões da camada.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}

export const Alinhamento: Story = {
  name: "Alinhamento",
  play: async ({ canvasElement }) => {
    // One at a time: the last one stays open, for axe.
    await abrirPopover(canvasElement, "Início", "Alinhado ao início")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await abrirPopover(canvasElement, "Centro", "Alinhado ao centro")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await abrirPopover(canvasElement, "Fim", "Alinhado ao fim")
  },
  render: () => (
    <div className="flex gap-6">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          Início
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-40"
          aria-label="Alinhado ao início"
        >
          Alinhado ao início
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          Centro
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="w-40"
          aria-label="Alinhado ao centro"
        >
          Alinhado ao centro
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          Fim
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-40"
          aria-label="Alinhado ao fim"
        >
          Alinhado ao fim
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const ComFormulario: Story = {
  name: "Com formulário",
  play: async ({ canvasElement }) => {
    await abrirPopover(canvasElement, "Abrir popover", "Dimensões")
  },
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Abrir popover
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensões</PopoverTitle>
          <PopoverDescription>
            Defina as dimensões da camada.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="formulario-largura" className="w-1/2">
              Largura
            </FieldLabel>
            <Input id="formulario-largura" defaultValue="100%" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="formulario-altura" className="w-1/2">
              Altura
            </FieldLabel>
            <Input id="formulario-altura" defaultValue="25px" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    // The popup is in a portal: the `dir` on the wrapper does not reach it,
    // and Base UI resolves `inline-*` sides from the DirectionProvider.
    const popover = await abrirPopover(canvasElement, "نهاية السطر", "الأبعاد")
    // `inline-end` in RTL is the left side of the trigger.
    const gatilho = within(canvasElement).getByRole("button", {
      name: "نهاية السطر",
    })
    await expect(popover.getBoundingClientRect().right).toBeLessThanOrEqual(
      gatilho.getBoundingClientRect().left + 1
    )
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar" className="grid gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              يسار
            </PopoverTrigger>
            <PopoverContent side="left" dir="rtl" lang="ar">
              <PopoverHeader>
                <PopoverTitle>الأبعاد</PopoverTitle>
                <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              أعلى
            </PopoverTrigger>
            <PopoverContent side="top" dir="rtl" lang="ar">
              <PopoverHeader>
                <PopoverTitle>الأبعاد</PopoverTitle>
                <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              أسفل
            </PopoverTrigger>
            <PopoverContent side="bottom" dir="rtl" lang="ar">
              <PopoverHeader>
                <PopoverTitle>الأبعاد</PopoverTitle>
                <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              يمين
            </PopoverTrigger>
            <PopoverContent side="right" dir="rtl" lang="ar">
              <PopoverHeader>
                <PopoverTitle>الأبعاد</PopoverTitle>
                <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              بداية السطر
            </PopoverTrigger>
            <PopoverContent side="inline-start" dir="rtl" lang="ar">
              <PopoverHeader>
                <PopoverTitle>الأبعاد</PopoverTitle>
                <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              نهاية السطر
            </PopoverTrigger>
            <PopoverContent side="inline-end" dir="rtl" lang="ar">
              <PopoverHeader>
                <PopoverTitle>الأبعاد</PopoverTitle>
                <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </DirectionProvider>
  ),
}
