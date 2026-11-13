import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { BluetoothIcon, CircleFadingPlusIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"

/*
 * One story per section of alert-dialog.mdx, in the order of the shadcn/ui
 * page. A closed alert dialog is invisible to axe, so every story has a
 * `play` that opens it first (the test runs axe after `play`).
 * `abrirAlerta` finds it by role and name (it is portaled to <body>, so it
 * is queried with `screen`), waits for the enter animation to end (axe would
 * measure contrast mid-fade) and checks that it is centered.
 */
const meta = {
  title: "Componentes/Alert Dialog",
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

async function abrirAlerta(
  canvasElement: HTMLElement,
  gatilho: string,
  titulo: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const alerta = await screen.findByRole("alertdialog", { name: titulo })
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(alerta).toBeVisible())
  const box = alerta.getBoundingClientRect()
  const root = document.documentElement
  await expect(
    Math.abs(box.left + box.width / 2 - root.clientWidth / 2)
  ).toBeLessThan(2)
  await expect(
    Math.abs(box.top + box.height / 2 - root.clientHeight / 2)
  ).toBeLessThan(2)
  return alerta
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Excluir conta",
    })

    // Opens: the initial focus is on Cancel (first control), never on the
    // destructive action.
    const alerta = await abrirAlerta(
      canvasElement,
      "Excluir conta",
      "Tem certeza absoluta?"
    )
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus()
    )

    // The focus is trapped: Tab always comes back inside the alert dialog.
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(alerta).toContainElement(document.activeElement as HTMLElement)
      )
    }

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirAlerta(canvasElement, "Excluir conta", "Tem certeza absoluta?")
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Excluir conta
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Ela exclui a sua conta para sempre
            e remove os seus dados dos nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const Basico: Story = {
  name: "Básico",
  play: async ({ canvasElement }) => {
    await abrirAlerta(canvasElement, "Mostrar diálogo", "Tem certeza absoluta?")
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Mostrar diálogo
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Ela exclui a sua conta e remove os
            seus dados dos nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const Pequeno: Story = {
  name: "Pequeno",
  play: async ({ canvasElement }) => {
    await abrirAlerta(
      canvasElement,
      "Permitir acessório",
      "Permitir a conexão do acessório?"
    )
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Permitir acessório
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Permitir a conexão do acessório?</AlertDialogTitle>
          <AlertDialogDescription>
            Você quer permitir que o acessório USB se conecte a este
            dispositivo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Não permitir</AlertDialogCancel>
          <AlertDialogAction>Permitir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const ComMidia: Story = {
  name: "Com mídia",
  play: async ({ canvasElement }) => {
    await abrirAlerta(
      canvasElement,
      "Compartilhar projeto",
      "Compartilhar este projeto?"
    )
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Compartilhar projeto
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CircleFadingPlusIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Compartilhar este projeto?</AlertDialogTitle>
          <AlertDialogDescription>
            Qualquer pessoa com o link poderá ver e editar este projeto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Compartilhar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const PequenoComMidia: Story = {
  name: "Pequeno com mídia",
  play: async ({ canvasElement }) => {
    await abrirAlerta(
      canvasElement,
      "Mostrar diálogo pequeno",
      "Permitir a conexão do acessório?"
    )
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Mostrar diálogo pequeno
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Permitir a conexão do acessório?</AlertDialogTitle>
          <AlertDialogDescription>
            Você quer permitir que o acessório USB se conecte a este
            dispositivo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Não permitir</AlertDialogCancel>
          <AlertDialogAction>Permitir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const Destrutivo: Story = {
  name: "Destrutivo",
  play: async ({ canvasElement }) => {
    await abrirAlerta(canvasElement, "Excluir chat", "Excluir o chat?")
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Excluir chat
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="text-destructive">
            <Trash2Icon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Excluir o chat?</AlertDialogTitle>
          <AlertDialogDescription>
            Isto exclui esta conversa para sempre. Veja as{" "}
            <a href="#configuracoes">configurações</a> para apagar também as
            memórias salvas durante este chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirAlerta(canvasElement, "إظهار الحوار", "هل أنت متأكد تمامًا؟")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          إظهار الحوار
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl" lang="ar">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا
              من خوادمنا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction>متابعة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
}
