import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"

/*
 * One story per section of drawer.mdx, in the order of the shadcn/ui page
 * (Composition, Custom Sizes and Styling have no preview: they are text and
 * tables in the MDX; the "Migrating from Vaul" section is not covered).
 *
 * A closed drawer is invisible to axe, so every story has a `play` that opens
 * it first (the test runs axe after `play`). `abrirGaveta` finds the popup by
 * role and name (it is portaled to <body>, hence `screen`) and waits for the
 * slide and the veil to stop (450ms): axe would measure contrast mid-motion.
 *
 * The shadcn demo switches between a bottom and a side drawer with
 * `useIsMobile`; a story with literal JSX cannot call a hook, so the Demo is
 * a bottom drawer (the default `swipeDirection`) and the sides have their own
 * story. The only story with a helper component is "Responsivo", whose whole
 * point is switching between Dialog and Drawer by screen size.
 */
const meta = {
  title: "Componentes/Drawer",
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  for (let i = 0; i < 5; i++) {
    const animacoes = document.getAnimations()
    if (animacoes.length === 0) return
    await Promise.allSettled(animacoes.map((animacao) => animacao.finished))
  }
}

async function abrirGaveta(
  contexto: HTMLElement,
  gatilho: string,
  titulo: string
) {
  await userEvent.click(
    await within(contexto).findByRole("button", { name: gatilho })
  )
  const gaveta = await screen.findByRole("dialog", { name: titulo })
  await esperarAnimacoes()
  await waitFor(() => expect(gaveta).toBeVisible())
  return gaveta
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Abrir gaveta",
    })

    // Opens: the focus goes inside the drawer.
    const gaveta = await abrirGaveta(
      canvasElement,
      "Abrir gaveta",
      "Escolha um horário de entrega"
    )
    await waitFor(() =>
      expect(gaveta).toContainElement(document.activeElement as HTMLElement)
    )

    // The focus is trapped: Tab always comes back inside the drawer.
    for (let i = 0; i < 8; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(gaveta).toContainElement(document.activeElement as HTMLElement)
      )
    }

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirGaveta(
      canvasElement,
      "Abrir gaveta",
      "Escolha um horário de entrega"
    )
  },
  render: () => (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Abrir gaveta
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Escolha um horário de entrega</DrawerTitle>
          <DrawerDescription>
            Vamos preparar o seu pedido o mais rápido possível.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <RadioGroup
            defaultValue="agora"
            aria-label="Horário de entrega"
            className="gap-2"
          >
            <FieldLabel htmlFor="demo-agora">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle className="flex items-center gap-2">
                    Entrega padrão
                    <Badge variant="secondary">Mais rápida</Badge>
                  </FieldTitle>
                  <FieldDescription id="demo-agora-texto">
                    25 a 35 min · Entregador já escolhido
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="agora"
                  id="demo-agora"
                  aria-describedby="demo-agora-texto"
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="demo-17h">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>17h00 às 17h15</FieldTitle>
                  <FieldDescription id="demo-17h-texto">
                    O preparo começa às 16h45
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="17h"
                  id="demo-17h"
                  aria-describedby="demo-17h-texto"
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="demo-18h">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>18h00 às 18h15</FieldTitle>
                  <FieldDescription id="demo-18h-texto">
                    O mais escolhido · Muita procura
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="18h"
                  id="demo-18h"
                  aria-describedby="demo-18h-texto"
                />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Confirmar horário</DrawerClose>
          <DrawerClose render={<Button variant="outline" />}>
            Cancelar
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Posicao: Story = {
  name: "Posição",
  play: async ({ canvasElement }) => {
    const gaveta = await abrirGaveta(
      canvasElement,
      "Abrir gaveta à esquerda",
      "Meta diária"
    )
    // `left` is physical: the drawer sits on the left edge also in RTL.
    const box = gaveta.getBoundingClientRect()
    await expect(box.left).toBeLessThan(16)
    await expect(box.right).toBeLessThan(
      document.documentElement.clientWidth / 2
    )
  },
  render: () => (
    <Drawer swipeDirection="left">
      <DrawerTrigger render={<Button variant="secondary" />}>
        Abrir gaveta à esquerda
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Meta diária</DrawerTitle>
          <DrawerDescription>
            Defina a sua meta diária de atividade.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="size-full rounded-2xl bg-muted" />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Fechar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const AlcaDeArrasto: Story = {
  name: "Alça de arrasto",
  play: async ({ canvasElement }) => {
    await abrirGaveta(canvasElement, "Abrir gaveta", "Gaveta com alça")
  },
  render: () => (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Abrir gaveta
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Gaveta com alça</DrawerTitle>
          <DrawerDescription>Uma gaveta com alça de arrasto.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Fechar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Aninhadas: Story = {
  name: "Aninhadas",
  play: async ({ canvasElement }) => {
    const primeira = await abrirGaveta(
      canvasElement,
      "Abrir gaveta",
      "Primeira gaveta"
    )
    await userEvent.click(
      await within(primeira).findByRole("button", {
        name: "Abrir gaveta aninhada",
      })
    )
    await screen.findByRole("dialog", { name: "Gaveta aninhada" })
    await esperarAnimacoes()
    await waitFor(() =>
      expect(
        screen.getByRole("dialog", { name: "Gaveta aninhada" })
      ).toBeVisible()
    )
  },
  render: () => (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Abrir gaveta
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Primeira gaveta</DrawerTitle>
          <DrawerDescription>
            Abra outra gaveta a partir desta, na mesma direção.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </div>
        <DrawerFooter>
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button variant="outline" />}>
              Abrir gaveta aninhada
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Gaveta aninhada</DrawerTitle>
                <DrawerDescription>
                  A gaveta anterior continua montada atrás desta.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 p-4">
                <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
              </div>
              <DrawerFooter>
                <DrawerClose render={<Button variant="outline" />}>
                  Fechar gaveta aninhada
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <DrawerClose render={<Button variant="outline" />}>
            Fechar primeira gaveta
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const NaoModal: Story = {
  name: "Não modal",
  play: async ({ canvasElement }) => {
    await abrirGaveta(canvasElement, "Não modal", "Gaveta não modal")
  },
  render: () => (
    <Drawer modal={false} disablePointerDismissal swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" />}>
        Não modal
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Gaveta não modal</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Fechar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const PontosDeAncoragem: Story = {
  name: "Pontos de ancoragem",
  play: async ({ canvasElement }) => {
    await abrirGaveta(
      canvasElement,
      "Abrir gaveta com ancoragem",
      "Pontos de ancoragem"
    )
  },
  render: () => (
    <Drawer snapPoints={["31rem", 1]} showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Abrir gaveta com ancoragem
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pontos de ancoragem</DrawerTitle>
          <DrawerDescription>
            Arraste a gaveta para alternar entre uma vista compacta e uma quase
            em altura total.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Fechar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

/*
 * Helper of the "Responsivo" story only: Dialog on desktop, Drawer on mobile.
 * `useIsMobile` is the package hook (breakpoint 768px).
 */
function PerfilResponsivo({ prefixo }: { prefixo: string }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const formulario = (
    <form
      className="grid items-start gap-6 p-4 md:p-0"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-3">
        <Label htmlFor={`${prefixo}-email`}>E-mail</Label>
        <Input
          type="email"
          id={`${prefixo}-email`}
          defaultValue="maria@exemplo.com.br"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor={`${prefixo}-usuario`}>Usuário</Label>
        <Input id={`${prefixo}-usuario`} defaultValue="@mariasouza" />
      </div>
      <Button type="submit">Salvar alterações</Button>
    </form>
  )

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>
          Editar perfil
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Faça as alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </DialogDescription>
          </DialogHeader>
          {formulario}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Editar perfil
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar perfil</DrawerTitle>
          <DrawerDescription>
            Faça as alterações no seu perfil aqui. Clique em salvar quando
            terminar.
          </DrawerDescription>
        </DrawerHeader>
        {formulario}
      </DrawerContent>
    </Drawer>
  )
}

export const Responsivo: Story = {
  play: async ({ canvasElement }) => {
    // The test viewport is wide: this opens the Dialog branch. The Drawer
    // branch is the same Drawer as in the other stories.
    await abrirGaveta(canvasElement, "Editar perfil", "Editar perfil")
  },
  render: () => <PerfilResponsivo prefixo="responsivo" />,
}
