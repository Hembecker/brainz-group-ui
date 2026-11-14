import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

/*
 * One story per section of avatar.mdx, in the order of the shadcn/ui page.
 * The shadcn examples load photos from GitHub; here there are no external
 * images. Most avatars use the fallback with initials, and the one that shows
 * an image uses the brand logo from `brand/` (the Storybook serves it at the
 * root). An avatar that only has initials gets `role="img"` and an
 * `aria-label` with the person's name, so a screen reader reads the name and
 * not the letters. The badge is a decorative dot: the status goes in that
 * same label ("online"), never in the colour alone.
 *
 * The Dropdown section opens a menu, which axe cannot see while it is closed,
 * so that story has a `play` that opens it first (the test runs axe after
 * `play`). The menu is portaled to <body>, so it is queried with `screen`.
 */
const meta = {
  title: "Componentes/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
}

async function abrirMenu(canvasElement: HTMLElement, gatilho: string) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const menu = await screen.findByRole("menu", { name: gatilho })
  await esperarAnimacoes()
  await waitFor(() => expect(menu).toBeVisible())
  return menu
}

export const Demo: Story = {
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
      <Avatar>
        <AvatarImage
          src="brainz-group-logo.svg"
          alt="Logo da Brainz Group"
          className="object-left"
        />
        <AvatarFallback>BG</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Eduarda Rocha, online">
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <AvatarGroup role="group" aria-label="Equipe do projeto">
        <Avatar role="img" aria-label="Carlos Nunes">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar role="img" aria-label="Lucas Ribeiro">
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar role="img" aria-label="Eduarda Rocha">
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <span aria-hidden="true">+3</span>
          <span className="sr-only">e mais 3 pessoas</span>
        </AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage
          src="brainz-group-logo.svg"
          alt="Logo da Brainz Group"
          className="object-left"
        />
        <AvatarFallback>BG</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Selo: Story = {
  render: () => (
    <Avatar role="img" aria-label="Eduarda Rocha, online">
      <AvatarFallback>ER</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
}

export const SeloComIcone: Story = {
  name: "Selo com ícone",
  render: () => (
    <Avatar role="img" aria-label="Priscila Pinto">
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <PlusIcon aria-hidden="true" />
      </AvatarBadge>
    </Avatar>
  ),
}

export const Grupo: Story = {
  render: () => (
    <AvatarGroup role="group" aria-label="Equipe do projeto">
      <Avatar role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Lucas Ribeiro">
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Eduarda Rocha">
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
}

export const ContagemDoGrupo: Story = {
  name: "Contagem do grupo",
  render: () => (
    <AvatarGroup role="group" aria-label="Equipe do projeto">
      <Avatar role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Lucas Ribeiro">
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Eduarda Rocha">
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <span aria-hidden="true">+3</span>
        <span className="sr-only">e mais 3 pessoas</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const ContagemDoGrupoComIcone: Story = {
  name: "Contagem do grupo com ícone",
  render: () => (
    <AvatarGroup role="group" aria-label="Equipe do projeto">
      <Avatar role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Lucas Ribeiro">
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Eduarda Rocha">
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <PlusIcon aria-hidden="true" />
        <span className="sr-only">e mais pessoas</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar size="sm" role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg" role="img" aria-label="Carlos Nunes">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Menu: Story = {
  name: "Dropdown",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "CN, menu da conta")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="CN, menu da conta"
          />
        }
      >
        <Avatar>
          <AvatarImage
            src="brainz-group-logo.svg"
            alt=""
            className="object-left"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Cobrança</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div
      dir="rtl"
      lang="ar"
      className="flex flex-row flex-wrap items-center gap-6 md:gap-12"
    >
      <Avatar role="img" aria-label="أحمد سالم">
        <AvatarFallback>أس</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="ليلى حسن، متصلة">
        <AvatarFallback>لح</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <AvatarGroup role="group" aria-label="فريق المشروع">
        <Avatar role="img" aria-label="أحمد سالم">
          <AvatarFallback>أس</AvatarFallback>
        </Avatar>
        <Avatar role="img" aria-label="ليلى حسن">
          <AvatarFallback>لح</AvatarFallback>
        </Avatar>
        <Avatar role="img" aria-label="عمر خالد">
          <AvatarFallback>عخ</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <span aria-hidden="true">+٣</span>
          <span className="sr-only">و٣ أشخاص آخرين</span>
        </AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
}
