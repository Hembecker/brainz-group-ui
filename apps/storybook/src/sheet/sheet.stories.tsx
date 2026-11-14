import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

/*
 * One story per section of sheet.mdx, in the order of the shadcn/ui page.
 * The shadcn examples put the submit button outside any <form>; here the
 * <form> wraps the fields and the footer inside SheetContent, so it submits.
 *
 * A closed sheet is invisible to axe, so every story has a `play` that opens
 * it first (the test runs axe after `play`). `abrirSheet` finds the sheet by
 * role and name (it is portaled to <body>, so it is queried with `screen`)
 * and waits for the slide/fade transition to end (axe would measure contrast
 * mid-fade). `lado` checks that the sheet is glued to the expected edge: the
 * sides are physical (`left` is the left edge in RTL too).
 */
const meta = {
  title: "Componentes/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

type Lado = "top" | "right" | "bottom" | "left"

async function abrirSheet(
  canvasElement: HTMLElement,
  gatilho: string,
  titulo: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const sheet = await screen.findByRole("dialog", { name: titulo })
  // The slide is a CSS transition (data-starting-style): it only exists as an
  // animation one frame after mounting, so wait two frames before waiting for
  // it to finish.
  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  )
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(sheet).toBeVisible())
  return sheet
}

async function conferirLado(sheet: HTMLElement, lado: Lado) {
  await waitFor(() => {
    const box = sheet.getBoundingClientRect()
    const root = document.documentElement
    const borda = {
      left: box.left,
      top: box.top,
      right: root.clientWidth - box.right,
      bottom: root.clientHeight - box.bottom,
    }
    expect(Math.abs(borda[lado])).toBeLessThan(2)
  })
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", { name: "Abrir" })

    // Opens: the focus goes inside the sheet.
    const sheet = await abrirSheet(canvasElement, "Abrir", "Editar perfil")
    await conferirLado(sheet, "right")
    await waitFor(() =>
      expect(sheet).toContainElement(document.activeElement as HTMLElement)
    )

    // The focus is trapped: Tab always comes back inside the sheet.
    for (let i = 0; i < 8; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(sheet).toContainElement(document.activeElement as HTMLElement)
      )
    }

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirSheet(canvasElement, "Abrir", "Editar perfil")
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Abrir</SheetTrigger>
      <SheetContent>
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => event.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Editar perfil</SheetTitle>
            <SheetDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="flex-1 px-6">
            <Field>
              <Label htmlFor="demo-nome">Nome</Label>
              <Input id="demo-nome" name="nome" defaultValue="Maria Souza" />
            </Field>
            <Field>
              <Label htmlFor="demo-usuario">Usuário</Label>
              <Input
                id="demo-usuario"
                name="usuario"
                defaultValue="@mariasouza"
              />
            </Field>
          </FieldGroup>
          <SheetFooter>
            <Button type="submit">Salvar alterações</Button>
            <SheetClose render={<Button variant="outline" />}>
              Fechar
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  ),
}

export const Lados: Story = {
  play: async ({ canvasElement }) => {
    const lados: [string, string, Lado][] = [
      ["Topo", "Editar perfil (topo)", "top"],
      ["Direita", "Editar perfil (direita)", "right"],
      ["Base", "Editar perfil (base)", "bottom"],
      ["Esquerda", "Editar perfil (esquerda)", "left"],
    ]

    // Opens each side, checks that it is glued to its edge and closes it
    // with Esc; the last one stays open, for axe.
    for (const [gatilho, titulo, lado] of lados) {
      const sheet = await abrirSheet(canvasElement, gatilho, titulo)
      await conferirLado(sheet, lado)
      if (lado !== "left") {
        await userEvent.keyboard("{Escape}")
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      }
    }
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Topo</SheetTrigger>
        <SheetContent
          side="top"
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <SheetHeader>
            <SheetTitle id="lados-topo-titulo">
              Editar perfil (topo)
            </SheetTitle>
            <SheetDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </SheetDescription>
          </SheetHeader>
          <div
            role="region"
            aria-labelledby="lados-topo-titulo"
            tabIndex={0}
            className="overflow-y-auto px-6 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <p key={index} className="mb-2 leading-relaxed">
                Estes termos regem o uso do workspace, incluindo o acesso a
                documentos compartilhados, arquivos de projeto e ferramentas de
                colaboração. Você é responsável pelo conteúdo que envia e por
                garantir que a sua equipe tenha as permissões certas.
              </p>
            ))}
          </div>
          <SheetFooter>
            <Button type="button">Salvar alterações</Button>
            <SheetClose render={<Button variant="outline" />}>
              Cancelar
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Direita
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Editar perfil (direita)</SheetTitle>
            <SheetDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button type="button">Salvar alterações</Button>
            <SheetClose render={<Button variant="outline" />}>
              Cancelar
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Base</SheetTrigger>
        <SheetContent
          side="bottom"
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <SheetHeader>
            <SheetTitle id="lados-base-titulo">
              Editar perfil (base)
            </SheetTitle>
            <SheetDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </SheetDescription>
          </SheetHeader>
          <div
            role="region"
            aria-labelledby="lados-base-titulo"
            tabIndex={0}
            className="overflow-y-auto px-6 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <p key={index} className="mb-2 leading-relaxed">
                Estes termos regem o uso do workspace, incluindo o acesso a
                documentos compartilhados, arquivos de projeto e ferramentas de
                colaboração. Você é responsável pelo conteúdo que envia e por
                garantir que a sua equipe tenha as permissões certas.
              </p>
            ))}
          </div>
          <SheetFooter>
            <Button type="button">Salvar alterações</Button>
            <SheetClose render={<Button variant="outline" />}>
              Cancelar
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Esquerda
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Editar perfil (esquerda)</SheetTitle>
            <SheetDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button type="button">Salvar alterações</Button>
            <SheetClose render={<Button variant="outline" />}>
              Cancelar
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
}

export const SemBotaoDeFechar: Story = {
  name: "Sem botão de fechar",
  play: async ({ canvasElement }) => {
    await abrirSheet(
      canvasElement,
      "Abrir sem botão de fechar",
      "Sem botão de fechar"
    )
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Abrir sem botão de fechar
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Sem botão de fechar</SheetTitle>
          <SheetDescription>
            Este sheet não tem o botão de fechar no canto. Aperte Esc ou clique
            fora dele para fechar.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const sheet = await abrirSheet(
      canvasElement,
      "فتح",
      "تعديل الملف الشخصي"
    )
    await conferirLado(sheet, "left")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>فتح</SheetTrigger>
        <SheetContent side="left" dir="rtl" lang="ar">
          <form
            className="flex h-full flex-col"
            onSubmit={(event) => event.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>تعديل الملف الشخصي</SheetTitle>
              <SheetDescription>
                قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.
              </SheetDescription>
            </SheetHeader>
            <FieldGroup className="flex-1 px-6">
              <Field>
                <Label htmlFor="rtl-nome">الاسم</Label>
                <Input id="rtl-nome" name="nome" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <Label htmlFor="rtl-usuario">اسم المستخدم</Label>
                <Input
                  id="rtl-usuario"
                  name="usuario"
                  defaultValue="peduarte"
                />
              </Field>
            </FieldGroup>
            <SheetFooter>
              <Button type="submit">حفظ التغييرات</Button>
              <SheetClose render={<Button variant="outline" />}>
                إغلاق
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  ),
}
