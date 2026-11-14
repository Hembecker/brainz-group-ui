import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

/*
 * One story per section of dialog.mdx, in the order of the shadcn/ui page.
 * The shadcn examples put the <form> around the trigger, but the submit
 * button lives in the portal, outside that form, so it would never submit:
 * here the <form> goes inside DialogContent.
 *
 * A closed dialog is invisible to axe, so every story has a `play` that
 * opens it first (the test runs axe after `play`). `abrirDialogo` waits for
 * the dialog to be found by role and name, for the enter animation to end
 * (axe would measure contrast mid-fade) and checks that it is centered. The
 * dialog is portaled to <body>, so it is queried with `screen`, not with the
 * story canvas.
 */
const meta = {
  title: "Componentes/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

async function abrirDialogo(
  canvasElement: HTMLElement,
  gatilho: string,
  titulo: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const dialog = await screen.findByRole("dialog", { name: titulo })
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(dialog).toBeVisible())
  const box = dialog.getBoundingClientRect()
  const root = document.documentElement
  await expect(
    Math.abs(box.left + box.width / 2 - root.clientWidth / 2)
  ).toBeLessThan(2)
  await expect(
    Math.abs(box.top + box.height / 2 - root.clientHeight / 2)
  ).toBeLessThan(2)
  return dialog
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", { name: "Editar perfil" })

    // Opens: the focus goes inside the dialog.
    const dialog = await abrirDialogo(
      canvasElement,
      "Editar perfil",
      "Editar perfil"
    )
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    )

    // The focus is trapped: Tab always comes back inside the dialog. The
    // Base UI focus guards hold the focus for a moment before moving it, so
    // this waits for it.
    for (let i = 0; i < 8; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
      )
    }

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirDialogo(canvasElement, "Editar perfil", "Editar perfil")
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Editar perfil
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          className="grid gap-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
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
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ),
}

export const BotaoDeFecharPersonalizado: Story = {
  name: "Botão de fechar personalizado",
  play: async ({ canvasElement }) => {
    await abrirDialogo(canvasElement, "Compartilhar", "Compartilhar link")
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Compartilhar
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar link</DialogTitle>
          <DialogDescription>
            Qualquer pessoa com este link poderá ver o relatório.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="personalizado-link" className="sr-only">
            Link do relatório
          </Label>
          <Input
            id="personalizado-link"
            defaultValue="https://exemplo.com.br/relatorios/42"
            readOnly
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose render={<Button type="button" />}>Fechar</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const SemBotaoDeFechar: Story = {
  name: "Sem botão de fechar",
  play: async ({ canvasElement }) => {
    await abrirDialogo(
      canvasElement,
      "Sem botão de fechar",
      "Sem botão de fechar"
    )
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Sem botão de fechar
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Sem botão de fechar</DialogTitle>
          <DialogDescription>
            Este diálogo não tem o botão de fechar no canto. Aperte Esc ou
            clique fora dele para fechar.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
}

export const RodapeFixo: Story = {
  name: "Rodapé fixo",
  play: async ({ canvasElement }) => {
    await abrirDialogo(canvasElement, "Rodapé fixo", "Rodapé fixo")
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Rodapé fixo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="rodape-fixo-titulo">Rodapé fixo</DialogTitle>
          <DialogDescription>
            Este diálogo tem um rodapé que continua visível enquanto o conteúdo
            rola.
          </DialogDescription>
        </DialogHeader>
        <div
          role="region"
          aria-labelledby="rodape-fixo-titulo"
          tabIndex={0}
          className="-mx-6 max-h-[50vh] overflow-y-auto px-6 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <p key={index} className="mb-4 leading-normal">
              Estes termos regem o uso do workspace, incluindo o acesso a
              documentos compartilhados, arquivos de projeto e ferramentas de
              colaboração. Você é responsável pelo conteúdo que envia e por
              garantir que a sua equipe tenha as permissões certas para ver ou
              editar esse conteúdo. Podemos atualizar recursos ou limites
              conforme o serviço evolui, e avisaremos os administradores quando
              isso afetar o seu trabalho.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Fechar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const ConteudoComRolagem: Story = {
  name: "Conteúdo com rolagem",
  play: async ({ canvasElement }) => {
    await abrirDialogo(
      canvasElement,
      "Conteúdo com rolagem",
      "Conteúdo com rolagem"
    )
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Conteúdo com rolagem
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="rolagem-titulo">Conteúdo com rolagem</DialogTitle>
          <DialogDescription>
            Um diálogo com conteúdo que rola, e o cabeçalho sempre à vista.
          </DialogDescription>
        </DialogHeader>
        <div
          role="region"
          aria-labelledby="rolagem-titulo"
          tabIndex={0}
          className="-mx-6 max-h-[50vh] overflow-y-auto px-6 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <p key={index} className="mb-4 leading-normal">
              Estes termos regem o uso do workspace, incluindo o acesso a
              documentos compartilhados, arquivos de projeto e ferramentas de
              colaboração. Você é responsável pelo conteúdo que envia e por
              garantir que a sua equipe tenha as permissões certas para ver ou
              editar esse conteúdo. Podemos atualizar recursos ou limites
              conforme o serviço evolui, e avisaremos os administradores quando
              isso afetar o seu trabalho.
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirDialogo(canvasElement, "فتح الحوار", "تعديل الملف الشخصي")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          فتح الحوار
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm" dir="rtl" lang="ar">
          <form
            className="grid gap-6"
            onSubmit={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>تعديل الملف الشخصي</DialogTitle>
              <DialogDescription>
                قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند
                الانتهاء.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="rtl-nome">الاسم</Label>
                <Input id="rtl-nome" name="nome" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <Label htmlFor="rtl-usuario">اسم المستخدم</Label>
                <Input
                  id="rtl-usuario"
                  name="usuario"
                  defaultValue="@peduarte"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                إلغاء
              </DialogClose>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  ),
}
