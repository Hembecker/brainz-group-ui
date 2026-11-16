import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
  ShieldAlertIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@workspace/ui/components/item"

/*
 * One story per section of item.mdx, in the order of the shadcn/ui page.
 * The shadcn examples use external photos (github.com avatars, Unsplash,
 * avatar.vercel.sh): here the avatars use only the fallback and the images use
 * the brand logo served from `brand/`. The `.map` lists are literal JSX.
 *
 * An ItemGroup is `role="list"`, so its direct children are list items: a
 * plain Item gets `role="listitem"`; an Item that is a link goes inside a
 * `<div role="listitem">`, because `role="listitem"` on the `<a>` itself would
 * erase the link role.
 *
 * A closed menu is invisible to axe: the Dropdown story has a `play` that
 * opens it first (the menu is portaled to <body>, so it is queried with
 * `screen`) and waits for the enter animation to end.
 */
const meta = {
  title: "Componentes/Item",
  component: Item,
} satisfies Meta<typeof Item>

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

export const Demo: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Item básico</ItemTitle>
          <ItemDescription>
            Um item simples com título e descrição.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Ação
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" render={<a href="#perfil" />}>
        <ItemMedia>
          <BadgeCheckIcon aria-hidden="true" className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Seu perfil foi verificado.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 rtl:rotate-180"
          />
        </ItemActions>
      </Item>
    </div>
  ),
}

export const Variante: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item>
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Variante padrão</ItemTitle>
          <ItemDescription>Fundo transparente e sem borda.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Variante outline</ItemTitle>
          <ItemDescription>Estilo com uma borda visível.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Variante muted</ItemTitle>
          <ItemDescription>
            Fundo suave para conteúdo secundário.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Tamanho padrão</ItemTitle>
          <ItemDescription>O tamanho para a maioria dos casos.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Tamanho pequeno</ItemTitle>
          <ItemDescription>
            Um tamanho compacto para telas densas.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Tamanho extra pequeno</ItemTitle>
          <ItemDescription>O tamanho mais compacto que existe.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const Icone: Story = {
  name: "Ícone",
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <ShieldAlertIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Alerta de segurança</ItemTitle>
          <ItemDescription>
            Novo acesso detectado de um aparelho desconhecido.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Revisar acesso
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}

export const AvatarStory: Story = {
  name: "Avatar",
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar aria-hidden="true" className="size-10">
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Carla Souza</ItemTitle>
          <ItemDescription>Vista pela última vez há 5 meses</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full"
            aria-label="Convidar Carla Souza"
          >
            <PlusIcon aria-hidden="true" />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background">
            <Avatar aria-hidden="true">
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
            <Avatar aria-hidden="true">
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <Avatar aria-hidden="true">
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Nenhum membro na equipe</ItemTitle>
          <ItemDescription>
            Convide sua equipe para colaborar neste projeto.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Convidar equipe
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}

export const Imagem: Story = {
  render: () => (
    <ItemGroup className="w-full max-w-md gap-4">
      <div role="listitem">
        <Item variant="outline" render={<a href="#midnight-city-lights" />}>
          <ItemMedia variant="image">
            <img src="brainz-group-logo.svg" alt="" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              Midnight City Lights -{" "}
              <span className="text-muted-foreground">Electric Nights</span>
            </ItemTitle>
            <ItemDescription>Neon Dreams</ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription>3:45</ItemDescription>
          </ItemContent>
        </Item>
      </div>
      <div role="listitem">
        <Item
          variant="outline"
          render={<a href="#coffee-shop-conversations" />}
        >
          <ItemMedia variant="image">
            <img src="brainz-group-logo.svg" alt="" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              Coffee Shop Conversations -{" "}
              <span className="text-muted-foreground">Urban Stories</span>
            </ItemTitle>
            <ItemDescription>The Morning Brew</ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription>4:05</ItemDescription>
          </ItemContent>
        </Item>
      </div>
      <div role="listitem">
        <Item variant="outline" render={<a href="#digital-rain" />}>
          <ItemMedia variant="image">
            <img src="brainz-group-logo.svg" alt="" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              Digital Rain -{" "}
              <span className="text-muted-foreground">Binary Beats</span>
            </ItemTitle>
            <ItemDescription>Cyber Symphony</ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription>3:30</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </ItemGroup>
  ),
}

export const Grupo: Story = {
  render: () => (
    <ItemGroup className="max-w-sm">
      <Item variant="outline" role="listitem">
        <ItemMedia>
          <Avatar aria-hidden="true">
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="gap-1">
          <ItemTitle>carla.souza</ItemTitle>
          <ItemDescription>carla.souza@exemplo.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Adicionar carla.souza"
          >
            <PlusIcon aria-hidden="true" />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="outline" role="listitem">
        <ItemMedia>
          <Avatar aria-hidden="true">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="gap-1">
          <ItemTitle>marcos.pereira</ItemTitle>
          <ItemDescription>marcos.pereira@exemplo.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Adicionar marcos.pereira"
          >
            <PlusIcon aria-hidden="true" />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="outline" role="listitem">
        <ItemMedia>
          <Avatar aria-hidden="true">
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="gap-1">
          <ItemTitle>eduarda.ramos</ItemTitle>
          <ItemDescription>eduarda.ramos@exemplo.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Adicionar eduarda.ramos"
          >
            <PlusIcon aria-hidden="true" />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
}

export const Cabecalho: Story = {
  name: "Cabeçalho",
  render: () => (
    <ItemGroup className="grid w-full max-w-xl grid-cols-3 gap-4">
      <Item variant="outline" role="listitem">
        <ItemHeader>
          <img
            src="brainz-group-logo.svg"
            alt=""
            className="aspect-square w-full rounded-xl bg-muted object-contain p-4"
          />
        </ItemHeader>
        <ItemContent>
          <ItemTitle>modelo-1.5-sm</ItemTitle>
          <ItemDescription>Tarefas do dia a dia.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" role="listitem">
        <ItemHeader>
          <img
            src="brainz-group-logo.svg"
            alt=""
            className="aspect-square w-full rounded-xl bg-muted object-contain p-4"
          />
        </ItemHeader>
        <ItemContent>
          <ItemTitle>modelo-1.5-lg</ItemTitle>
          <ItemDescription>Raciocínio avançado.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" role="listitem">
        <ItemHeader>
          <img
            src="brainz-group-logo.svg"
            alt=""
            className="aspect-square w-full rounded-xl bg-muted object-contain p-4"
          />
        </ItemHeader>
        <ItemContent>
          <ItemTitle>modelo-2.0-mini</ItemTitle>
          <ItemDescription>Código aberto para todos.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
}

export const Link: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const documentacao = await canvas.findByRole("link", {
      name: /Acessar a documentação/,
    })
    await expect(documentacao).toHaveAttribute("data-slot", "item")
    await expect(documentacao).toHaveAttribute("data-variant", "default")

    // The item is the link: the keyboard focus lands on the `<a>` itself.
    await userEvent.tab()
    await expect(documentacao).toHaveFocus()
    await userEvent.tab()
    await expect(
      canvas.getByRole("link", { name: /Recurso externo/ })
    ).toHaveFocus()
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item render={<a href="#documentacao" />}>
        <ItemContent>
          <ItemTitle>Acessar a documentação</ItemTitle>
          <ItemDescription>
            Aprenda a começar com os nossos componentes.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 rtl:rotate-180"
          />
        </ItemActions>
      </Item>
      <Item
        variant="outline"
        render={
          <a
            href="#recurso-externo"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <ItemContent>
          <ItemTitle>
            Recurso externo <span className="sr-only">(abre em nova aba)</span>
          </ItemTitle>
          <ItemDescription>
            Abre numa nova aba, com os atributos de segurança.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon aria-hidden="true" className="size-4" />
        </ItemActions>
      </Item>
      <Item variant="muted" render={<button type="button" />}>
        <ItemMedia variant="icon">
          <HomeIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Definir como página inicial</ItemTitle>
          <ItemDescription>Uma ação, e não uma navegação.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const Dropdown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Selecionar pessoa" })
    )
    const menu = await screen.findByRole("menu", { name: "Selecionar pessoa" })
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Selecionar pessoa
        <ChevronDownIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Item size="xs" className="w-full p-2">
              <ItemMedia>
                <Avatar aria-hidden="true" className="size-[--spacing(6.5)]">
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-0">
                <ItemTitle>carla.souza</ItemTitle>
                <ItemDescription className="leading-none">
                  carla.souza@exemplo.com
                </ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Item size="xs" className="w-full p-2">
              <ItemMedia>
                <Avatar aria-hidden="true" className="size-[--spacing(6.5)]">
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-0">
                <ItemTitle>marcos.pereira</ItemTitle>
                <ItemDescription className="leading-none">
                  marcos.pereira@exemplo.com
                </ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Item size="xs" className="w-full p-2">
              <ItemMedia>
                <Avatar aria-hidden="true" className="size-[--spacing(6.5)]">
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-0">
                <ItemTitle>eduarda.ramos</ItemTitle>
                <ItemDescription className="leading-none">
                  eduarda.ramos@exemplo.com
                </ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar" className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>عنصر أساسي</ItemTitle>
          <ItemDescription>عنصر بسيط يحتوي على عنوان ووصف.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            إجراء
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" render={<a href="#الملف-الشخصي" />}>
        <ItemMedia>
          <BadgeCheckIcon aria-hidden="true" className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>تم التحقق من ملفك الشخصي.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 rtl:rotate-180"
          />
        </ItemActions>
      </Item>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    variant: "outline",
    size: "default",
    className: "w-full max-w-md",
    children: (
      <>
        <ItemMedia variant="icon">
          <InboxIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Título do item</ItemTitle>
          <ItemDescription>Descrição do item.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Ação
          </Button>
        </ItemActions>
      </>
    ),
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "muted"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
  },
}
