import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  AudioWaveformIcon,
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  BotIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CommandIcon,
  CreditCardIcon,
  FolderIcon,
  ForwardIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  InboxIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  PlusIcon,
  Settings2Icon,
  SparklesIcon,
  SquareTerminalIcon,
  Trash2Icon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@workspace/ui/components/sidebar"

/*
 * One story per section of sidebar.mdx, in the order of the shadcn/ui page.
 * The shadcn page has one preview (the Demo, an "icon" sidebar with a team
 * switcher, collapsible menus, projects and a user menu) and one RTL example;
 * the other sections are code snippets, and each of them gets its own story
 * here (variants, side, collapsible modes, controlled state, mobile…).
 *
 * LAYOUT. The desktop Sidebar is `position: fixed` and `h-svh`, so on a Docs
 * page (every story inline) the sidebars would pile up on the viewport. The
 * meta-level decorator gives each story a box that is its own containing block
 * (`transform`), with a fixed height, and overrides `h-svh`/`min-h-svh` inside
 * it. It lives in the decorator, not in `render`, so the "Show code" snippets
 * stay copyable. The box is 40rem high so the Demo's menu fits without
 * scrolling `SidebarContent`.
 *
 * DESKTOP vs MOBILE. Under 768px (`useIsMobile`) the Sidebar becomes a Sheet.
 * The tests run at 1200x900, so every story is desktop except `Mobile`, which
 * sets `globals.viewport` (the Vitest addon applies it). `conferirDesktop`
 * makes a viewport that leaks between stories fail loudly.
 *
 * OVERLAYS. A closed menu is invisible to axe, so the Demo and the RTL story
 * end with a menu open (`play` runs before axe). Menus and the Sheet are
 * portaled to <body>, so they are queried with `screen`.
 *
 * Every story has its own ids/names: the Docs page renders them all together.
 * Ctrl+B toggles every SidebarProvider on the page at once (it is a window
 * listener); the stories only use it one at a time.
 */
const meta = {
  title: "Componentes/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        data-caixa=""
        className="relative h-[40rem] [transform:translateZ(0)] overflow-hidden rounded-2xl border border-border **:data-[slot=sidebar-container]:h-full **:data-[slot=sidebar-wrapper]:h-full **:data-[slot=sidebar-wrapper]:min-h-0"
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  // Transitions only exist one frame after the state changes.
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
}

function conferirDesktop() {
  expect(window.matchMedia("(max-width: 767px)").matches).toBe(false)
}

function pegar(canvasElement: HTMLElement, seletor: string) {
  const elemento = canvasElement.querySelector<HTMLElement>(seletor)
  if (!elemento) throw new Error(`Não achei ${seletor}`)
  return elemento
}

// The sidebar must stay inside the box of the decorator (bottom included, or
// the footer would be cut off).
async function conferirContido(canvasElement: HTMLElement) {
  const caixa = pegar(canvasElement, "[data-caixa]")
  const barra = pegar(canvasElement, "[data-slot=sidebar-container]")
  const a = caixa.getBoundingClientRect()
  const b = barra.getBoundingClientRect()
  await expect(b.top).toBeGreaterThanOrEqual(a.top - 1)
  await expect(b.bottom).toBeLessThanOrEqual(a.bottom + 1)
}

async function alternarComTeclado() {
  await userEvent.keyboard("{Control>}b{/Control}")
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const barra = pegar(canvasElement, "[data-slot=sidebar]")
    const container = pegar(canvasElement, "[data-slot=sidebar-container]")

    // The trigger has a name and exposes the state.
    await expect(gatilho).toHaveAccessibleName("Alternar barra lateral")
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")

    // Click collapses to icons (3rem).
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-state", "collapsed")
    )
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await esperarAnimacoes()
    await expect(
      Math.round(container.getBoundingClientRect().width)
    ).toBeLessThanOrEqual(50)

    // Ctrl+B expands again.
    await alternarComTeclado()
    await waitFor(() => expect(barra).toHaveAttribute("data-state", "expanded"))
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()

    // The arrows are directional: right-pointing closed (flipped in RTL),
    // pointing down when open. The `rtl:` variant has no specificity, so the
    // open rotation wins.
    const rtl = document.documentElement.dir === "rtl"
    const seta = (nome: string) =>
      getComputedStyle(
        within(canvasElement)
          .getByRole("button", { name: nome })
          .querySelector("svg:last-child") as SVGElement
      ).rotate
    await expect(seta("Laboratório")).toBe("90deg")
    await expect(seta("Modelos")).toBe(rtl ? "180deg" : "none")

    // The team switcher opens and stays open, for axe.
    const equipe = within(canvasElement).getByRole("button", {
      name: /Acme Inc/,
    })
    await userEvent.click(equipe)
    const menu = await screen.findByRole("menu")
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())

    // Base UI facts the story relies on: the open trigger is marked with
    // `data-popup-open`, and `--anchor-width` makes the menu as wide as the
    // trigger (without it the menu would be its own `min-w-56`, 224px, narrower
    // than the 240px trigger).
    await expect(equipe).toHaveAttribute("data-popup-open")
    await expect(
      Math.abs(
        menu.getBoundingClientRect().width -
          equipe.getBoundingClientRect().width
      )
    ).toBeLessThan(2)
    // `side="inline-end"`: beside the trigger, on the end side (LTR: right).
    if (!rtl) {
      await expect(menu.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        equipe.getBoundingClientRect().right - 8
      )
    }
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEndIcon
                      aria-hidden="true"
                      className="size-4"
                    />
                  </div>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Corporativo</span>
                  </div>
                  <ChevronsUpDownIcon aria-hidden="true" className="ms-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--anchor-width) min-w-56"
                  align="start"
                  side="inline-end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Equipes</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-lg border">
                        <GalleryVerticalEndIcon
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                      </div>
                      Acme Inc
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-lg border">
                        <AudioWaveformIcon
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                      </div>
                      Acme Corp.
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-lg border">
                        <CommandIcon
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                      </div>
                      Evil Corp.
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-lg border">
                        <PlusIcon aria-hidden="true" className="size-4" />
                      </div>
                      <span className="font-medium">Adicionar equipe</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
            <nav aria-label="Plataforma">
              <SidebarMenu>
                <Collapsible
                  defaultOpen
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Laboratório" />}
                  >
                    <SquareTerminalIcon aria-hidden="true" />
                    <span>Laboratório</span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="ms-auto transition-transform duration-200 group-data-panel-open/menu-button:rotate-90 rtl:rotate-180"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Histórico</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Favoritos</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Preferências</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Modelos" />}
                  >
                    <BotIcon aria-hidden="true" />
                    <span>Modelos</span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="ms-auto transition-transform duration-200 group-data-panel-open/menu-button:rotate-90 rtl:rotate-180"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Genesis</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Explorer</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Quantum</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Documentação" />}
                  >
                    <BookOpenIcon aria-hidden="true" />
                    <span>Documentação</span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="ms-auto transition-transform duration-200 group-data-panel-open/menu-button:rotate-90 rtl:rotate-180"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Introdução</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Primeiros passos</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Tutoriais</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Configurações" />}
                  >
                    <Settings2Icon aria-hidden="true" />
                    <span>Configurações</span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="ms-auto transition-transform duration-200 group-data-panel-open/menu-button:rotate-90 rtl:rotate-180"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Geral</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Equipe</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href="#" />}>
                          <span>Cobrança</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projetos</SidebarGroupLabel>
            <nav aria-label="Projetos">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <FrameIcon aria-hidden="true" />
                    <span>Engenharia de design</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<SidebarMenuAction showOnHover />}
                    >
                      <MoreHorizontalIcon aria-hidden="true" />
                      <span className="sr-only">
                        Mais opções de Engenharia de design
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side="inline-end"
                      align="start"
                    >
                      <DropdownMenuItem>
                        <FolderIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Ver projeto</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ForwardIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Compartilhar projeto</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2Icon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Excluir projeto</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <PieChartIcon aria-hidden="true" />
                    <span>Vendas e marketing</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<SidebarMenuAction showOnHover />}
                    >
                      <MoreHorizontalIcon aria-hidden="true" />
                      <span className="sr-only">
                        Mais opções de Vendas e marketing
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side="inline-end"
                      align="start"
                    >
                      <DropdownMenuItem>
                        <FolderIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Ver projeto</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ForwardIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Compartilhar projeto</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2Icon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Excluir projeto</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <MapIcon aria-hidden="true" />
                    <span>Viagens</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<SidebarMenuAction showOnHover />}
                    >
                      <MoreHorizontalIcon aria-hidden="true" />
                      <span className="sr-only">Mais opções de Viagens</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side="inline-end"
                      align="start"
                    >
                      <DropdownMenuItem>
                        <FolderIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Ver projeto</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ForwardIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Compartilhar projeto</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2Icon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        <span>Excluir projeto</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <MoreHorizontalIcon aria-hidden="true" />
                    <span>Ver todos os projetos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar aria-hidden="true">
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">Maria Souza</span>
                    <span className="truncate text-xs">maria@example.com</span>
                  </div>
                  <ChevronsUpDownIcon
                    aria-hidden="true"
                    className="ms-auto size-4"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--anchor-width) min-w-56"
                  side="inline-end"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                        <Avatar aria-hidden="true">
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-start text-sm leading-tight">
                          <span className="truncate font-medium">
                            Maria Souza
                          </span>
                          <span className="truncate text-xs">
                            maria@example.com
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <SparklesIcon aria-hidden="true" />
                      Fazer upgrade para o Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheckIcon aria-hidden="true" />
                      Conta
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCardIcon aria-hidden="true" />
                      Cobrança
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BellIcon aria-hidden="true" />
                      Notificações
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <LogOutIcon aria-hidden="true" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-base font-medium">Painel</h1>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Flutuante: Story = {
  name: "Variante flutuante",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    await expect(pegar(canvasElement, "[data-slot=sidebar]")).toHaveAttribute(
      "data-variant",
      "floating"
    )
  },
  render: () => (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (flutuante)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <CalendarIcon aria-hidden="true" />
                    <span>Calendário</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Inset: Story = {
  name: "Variante inset",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    await expect(pegar(canvasElement, "[data-slot=sidebar]")).toHaveAttribute(
      "data-variant",
      "inset"
    )
    // The inset sits next to the sidebar, not under it. Without `side`, the
    // sidebar follows the direction: on the left in LTR (the inset to its
    // right) and on the right in RTL (the inset to its left), also in the
    // global RTL mode.
    const barra = pegar(canvasElement, "[data-slot=sidebar-container]")
    const inset = pegar(canvasElement, "[data-slot=sidebar-inset]")
    if (document.documentElement.dir === "rtl") {
      await expect(inset.getBoundingClientRect().right).toBeLessThanOrEqual(
        barra.getBoundingClientRect().left + 2
      )
    } else {
      await expect(inset.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        barra.getBoundingClientRect().right - 2
      )
    }
  },
  render: () => (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (inset)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <CalendarIcon aria-hidden="true" />
                    <span>Calendário</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Offcanvas: Story = {
  name: "Recolhível: offcanvas",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const barra = pegar(canvasElement, "[data-slot=sidebar]")
    const container = pegar(canvasElement, "[data-slot=sidebar-container]")
    const caixa = pegar(canvasElement, "[data-caixa]")
    const link = within(canvasElement).getByRole("link", { name: "Início" })
    await expect(link).toBeVisible()

    // The border faces the page: physical, so on the right of a left sidebar
    // (LTR) and on the left of a right sidebar (RTL, where the sidebar follows
    // the direction). The registry's `border-e` went to the screen edge in RTL.
    const rtl = document.documentElement.dir === "rtl"
    await expect(getComputedStyle(container).borderRightWidth).toBe(
      rtl ? "0px" : "1px"
    )
    await expect(getComputedStyle(container).borderLeftWidth).toBe(
      rtl ? "1px" : "0px"
    )

    // Collapsed, the panel leaves the screen and nothing in it takes focus.
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-state", "collapsed")
    )
    await esperarAnimacoes()
    if (rtl) {
      await expect(
        container.getBoundingClientRect().left
      ).toBeGreaterThanOrEqual(caixa.getBoundingClientRect().right - 2)
    } else {
      await expect(container.getBoundingClientRect().right).toBeLessThanOrEqual(
        caixa.getBoundingClientRect().left + 2
      )
    }
    await expect(link).not.toBeVisible()
    gatilho.focus()
    for (let i = 0; i < 4; i++) {
      await userEvent.tab()
      await expect(container).not.toContainElement(
        document.activeElement as HTMLElement
      )
    }

    // Ctrl+B brings it back.
    await alternarComTeclado()
    await waitFor(() => expect(barra).toHaveAttribute("data-state", "expanded"))
    await esperarAnimacoes()
    await expect(link).toBeVisible()
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (offcanvas)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Icone: Story = {
  name: "Recolhível: ícone",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const barra = pegar(canvasElement, "[data-slot=sidebar]")
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-state", "collapsed")
    )
    await esperarAnimacoes()
    // Only the icon stays; the name of the link is still its text.
    await expect(
      within(canvasElement).getByRole("link", { name: "Início" })
    ).toBeVisible()
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (ícone)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<a href="#" />}
                    isActive
                    tooltip="Início"
                  >
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<a href="#" />}
                    tooltip="Caixa de entrada"
                  >
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<a href="#" />}
                    tooltip="Calendário"
                  >
                    <CalendarIcon aria-hidden="true" />
                    <span>Calendário</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const SemRecolher: Story = {
  name: "Recolhível: nenhum",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    const barra = pegar(canvasElement, "[data-slot=sidebar]")
    await expect(barra).toBeVisible()
    // Ctrl+B does not hide a sidebar that is not collapsible.
    await alternarComTeclado()
    await esperarAnimacoes()
    await expect(barra).toBeVisible()
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none" className="border-e border-sidebar-border">
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (fixa)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const LadoDireito: Story = {
  name: "Lado",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const container = pegar(canvasElement, "[data-slot=sidebar-container]")
    const caixa = pegar(canvasElement, "[data-caixa]")
    // `side` is physical: "right" is the right edge, in LTR and in RTL.
    await expect(
      Math.abs(
        container.getBoundingClientRect().right -
          caixa.getBoundingClientRect().right
      )
    ).toBeLessThan(3)
    await expect(getComputedStyle(container).borderLeftWidth).toBe("1px")
    await expect(getComputedStyle(container).borderRightWidth).toBe("0px")

    // The in-flow gap follows the physical side (flex `order`), so the page
    // never sits under the bar: the inset ends where the bar starts, in LTR and
    // in RTL, and the trigger is the element under its own centre.
    const inset = pegar(canvasElement, "[data-slot=sidebar-inset]")
    await expect(inset.getBoundingClientRect().right).toBeLessThanOrEqual(
      container.getBoundingClientRect().left + 2
    )
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const centro = gatilho.getBoundingClientRect()
    await expect(
      gatilho.contains(
        document.elementFromPoint(
          centro.left + centro.width / 2,
          centro.top + centro.height / 2
        )
      )
    ).toBe(true)
  },
  render: () => (
    <SidebarProvider>
      <Sidebar side="right">
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (à direita)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

function EstadoDaBarra() {
  const { state, open, openMobile, isMobile, toggleSidebar } = useSidebar()

  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <Button
        variant="outline"
        aria-expanded={isMobile ? openMobile : open}
        onClick={toggleSidebar}
      >
        Alternar com o hook
      </Button>
      <p role="status" className="text-sm">
        Estado: {state}. Celular: {isMobile ? "sim" : "não"}.
      </p>
    </div>
  )
}

export const Hook: Story = {
  name: "useSidebar",
  parameters: {
    docs: {
      source: {
        code: `import { useSidebar } from "@workspace/ui/components/sidebar"

function EstadoDaBarra() {
  const { state, open, openMobile, isMobile, toggleSidebar } = useSidebar()

  return (
    <div>
      <Button
        variant="outline"
        aria-expanded={isMobile ? openMobile : open}
        onClick={toggleSidebar}
      >
        Alternar com o hook
      </Button>
      <p role="status">
        Estado: {state}. Celular: {isMobile ? "sim" : "não"}.
      </p>
    </div>
  )
}

// Dentro do SidebarProvider:
<SidebarProvider>
  <Sidebar>{/* … */}</Sidebar>
  <SidebarInset>
    <EstadoDaBarra />
  </SidebarInset>
</SidebarProvider>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const canvas = within(canvasElement)
    const botao = canvas.getByRole("button", { name: "Alternar com o hook" })
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Estado: expanded. Celular: não."
    )
    await userEvent.click(botao)
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Estado: collapsed. Celular: não."
    )
    await expect(botao).toHaveAttribute("aria-expanded", "false")
    await esperarAnimacoes()
  },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (hook)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <EstadoDaBarra />
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Grupo: Story = {
  name: "SidebarGroup",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const canvas = within(canvasElement)

    // The group action has a specific name.
    await expect(
      canvas.getByRole("button", { name: "Adicionar projeto" })
    ).toBeVisible()

    // The collapsible group: the label is the trigger.
    const gatilho = canvas.getByRole("button", { name: "Ajuda" })
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await expect(
      canvas.getByRole("link", { name: "Documentação" })
    ).toBeVisible()
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(gatilho).toHaveAttribute("aria-expanded", "false")
    )
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(gatilho).toHaveAttribute("aria-expanded", "true")
    )
  },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <SidebarGroupAction>
              <PlusIcon aria-hidden="true" />
              <span className="sr-only">Adicionar projeto</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <nav aria-label="Aplicação (grupo)">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<a href="#" />} isActive>
                      <HomeIcon aria-hidden="true" />
                      <span>Início</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<a href="#" />}>
                      <InboxIcon aria-hidden="true" />
                      <span>Caixa de entrada</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                className="group/label w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                render={<CollapsibleTrigger />}
              >
                Ajuda
                <ChevronDownIcon
                  aria-hidden="true"
                  className="ms-auto transition-transform group-data-panel-open/label:rotate-180"
                />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <nav aria-label="Ajuda">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="#" />}>
                          <LifeBuoyIcon aria-hidden="true" />
                          <span>Documentação</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </nav>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const BotaoDeMenu: Story = {
  name: "SidebarMenuButton",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    const canvas = within(canvasElement)

    // The current page: data-active (the highlight) and aria-current (the AT).
    const atual = canvas.getByRole("link", { name: "Início" })
    // `data-active` has no value (not "true"): style it with `data-active:`.
    await expect(atual.getAttribute("data-active")).toBe("")
    await expect(atual).toHaveAttribute("aria-current", "page")
    const outro = canvas.getByRole("link", { name: "Caixa de entrada" })
    await expect(outro).not.toHaveAttribute("aria-current")

    // A link is an <a>; an action is a <button>.
    await expect(
      canvas.getByRole("button", { name: "Pesquisar" }).tagName
    ).toBe("BUTTON")
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <nav aria-label="Navegação (botões)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton variant="outline">
                    <SparklesIcon aria-hidden="true" />
                    <span>Pesquisar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm" render={<a href="#" />}>
                    <CalendarIcon aria-hidden="true" />
                    <span>Calendário (pequeno)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" render={<a href="#" />}>
                    <LifeBuoyIcon aria-hidden="true" />
                    <span>Suporte (grande)</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const AcaoDeMenu: Story = {
  name: "SidebarMenuAction",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole("button", { name: "Adicionar à caixa de entrada" })
    ).toBeVisible()

    // `showOnHover` hides the action, but the keyboard focus shows it.
    const oculta = canvas.getByRole("button", {
      name: "Adicionar ao calendário",
    })
    await expect(oculta).toHaveStyle({ opacity: "0" })
    oculta.focus()
    await waitFor(() => expect(oculta).toHaveStyle({ opacity: "1" }))
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <nav aria-label="Navegação (ações)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction>
                    <PlusIcon aria-hidden="true" />
                    <span className="sr-only">
                      Adicionar à caixa de entrada
                    </span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <CalendarIcon aria-hidden="true" />
                    <span>Calendário</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover>
                    <PlusIcon aria-hidden="true" />
                    <span className="sr-only">Adicionar ao calendário</span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const SubMenu: Story = {
  name: "SidebarMenuSub",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    const canvas = within(canvasElement)
    const atual = canvas.getByRole("link", { name: "Equipe" })
    await expect(atual).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("link", { name: "Geral" })
    ).not.toHaveAttribute("aria-current")
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <nav aria-label="Navegação (submenu)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <Settings2Icon aria-hidden="true" />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton render={<a href="#" />}>
                        <span>Geral</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton render={<a href="#" />} isActive>
                        <span>Equipe</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton render={<a href="#" />} size="sm">
                        <span>Cobrança (pequeno)</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const SeloDeMenu: Story = {
  name: "SidebarMenuBadge",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await expect(within(canvasElement).getByText("24")).toBeVisible()
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <nav aria-label="Navegação (selos)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>
                    <span aria-hidden="true">24</span>
                    <span className="sr-only">24 não lidas</span>
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const Esqueleto: Story = {
  name: "SidebarMenuSkeleton",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Carregando o menu"
    )
  },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup aria-busy="true">
            <SidebarGroupLabel>Projetos</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            </SidebarMenu>
            <p role="status" className="sr-only">
              Carregando o menu…
            </p>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

function SidebarControlada() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (controlada)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col items-start gap-3 p-4">
          <Button
            variant="outline"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            Alternar barra de fora
          </Button>
          <p role="status" className="text-sm">
            A barra lateral está {open ? "aberta" : "recolhida"}.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Controlada: Story = {
  name: "Barra controlada",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>{/* … */}</Sidebar>
      <SidebarInset>
        <Button
          variant="outline"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Alternar barra de fora
        </Button>
        <p role="status">
          A barra lateral está {open ? "aberta" : "recolhida"}.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const canvas = within(canvasElement)
    const barra = pegar(canvasElement, "[data-slot=sidebar]")
    const botao = canvas.getByRole("button", { name: "Alternar barra de fora" })
    await expect(canvas.getByRole("status")).toHaveTextContent("aberta")

    // The state lives in the story: the outside button and Ctrl+B change it.
    await userEvent.click(botao)
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-state", "collapsed")
    )
    await expect(canvas.getByRole("status")).toHaveTextContent("recolhida")
    await expect(botao).toHaveAttribute("aria-expanded", "false")
    await alternarComTeclado()
    await waitFor(() => expect(barra).toHaveAttribute("data-state", "expanded"))
    await expect(canvas.getByRole("status")).toHaveTextContent("aberta")
    await esperarAnimacoes()
  },
  render: () => <SidebarControlada />,
}

export const Mobile: Story = {
  name: "Celular (Sheet)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    // 320px wide: useIsMobile is true and the Sidebar is a Sheet.
    expect(window.matchMedia("(max-width: 767px)").matches).toBe(true)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")

    // Opens: a modal dialog named "Barra lateral", focus inside.
    await userEvent.click(gatilho)
    const dialogo = await screen.findByRole("dialog", {
      name: "Barra lateral",
    })
    await esperarAnimacoes()
    await waitFor(() => expect(dialogo).toBeVisible())
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(dialogo).toContainElement(document.activeElement as HTMLElement)
    )

    // The focus is trapped.
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(dialogo).toContainElement(document.activeElement as HTMLElement)
      )
    }

    // Esc closes and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")

    // Ctrl+B opens it again and it stays open, for axe.
    await alternarComTeclado()
    const aberto = await screen.findByRole("dialog", { name: "Barra lateral" })
    await esperarAnimacoes()
    await waitFor(() => expect(aberto).toBeVisible())
  },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <span className="px-2 py-1 text-sm font-medium">Acme Inc</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
            <nav aria-label="Aplicação (celular)">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} isActive>
                    <HomeIcon aria-hidden="true" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <InboxIcon aria-hidden="true" />
                    <span>Caixa de entrada</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />}>
                    <CalendarIcon aria-hidden="true" />
                    <span>Calendário</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-base font-medium">Início</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)

    // Without `side`, the sidebar follows the direction: in RTL it opens on
    // the right edge, and the content is on its left.
    const container = pegar(canvasElement, "[data-slot=sidebar-container]")
    const inset = pegar(canvasElement, "[data-slot=sidebar-inset]")
    const caixa = pegar(canvasElement, "[data-caixa]")
    await expect(
      Math.abs(
        container.getBoundingClientRect().right -
          caixa.getBoundingClientRect().right
      )
    ).toBeLessThan(3)
    await expect(inset.getBoundingClientRect().right).toBeLessThanOrEqual(
      container.getBoundingClientRect().left + 2
    )
    // The border faces the page (the left edge of a right sidebar), also in RTL.
    await expect(getComputedStyle(container).borderLeftWidth).toBe("1px")
    await expect(getComputedStyle(container).borderRightWidth).toBe("0px")

    // The controls are named in Arabic, like the rest of the example (the rail
    // has the same name, so the query is scoped to the trigger).
    await expect(
      pegar(canvasElement, "[data-slot=sidebar-trigger]")
    ).toHaveAccessibleName("تبديل الشريط الجانبي")
    await expect(
      pegar(canvasElement, "[data-slot=sidebar-rail]")
    ).toHaveAccessibleName("تبديل الشريط الجانبي")

    // The user menu opens and stays open, for axe.
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: /shadcn/ })
    )
    const menu = await screen.findByRole("menu")
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
    await expect(menu).toHaveAttribute("dir", "rtl")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <DirectionProvider direction="rtl">
        <SidebarProvider>
          <Sidebar
            dir="rtl"
            collapsible="icon"
            mobileTitle="الشريط الجانبي"
            mobileDescription="يعرض الشريط الجانبي على الهاتف."
          >
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" render={<a href="#" />}>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                      <GalleryVerticalEndIcon
                        aria-hidden="true"
                        className="size-4"
                      />
                    </div>
                    <div className="grid flex-1 text-start text-sm leading-tight">
                      <span className="truncate font-medium">شركة أكمي</span>
                      <span className="truncate text-xs">المؤسسة</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>المنصة</SidebarGroupLabel>
                <nav aria-label="المنصة">
                  <SidebarMenu>
                    <Collapsible
                      defaultOpen
                      className="group/collapsible"
                      render={<SidebarMenuItem />}
                    >
                      <CollapsibleTrigger
                        render={<SidebarMenuButton tooltip="ملعب" />}
                      >
                        <SquareTerminalIcon aria-hidden="true" />
                        <span>ملعب</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="ms-auto transition-transform duration-200 group-data-panel-open/menu-button:rotate-90 rtl:rotate-180"
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton render={<a href="#" />}>
                              <span>السجل</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton render={<a href="#" />}>
                              <span>المميز</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                    <Collapsible
                      className="group/collapsible"
                      render={<SidebarMenuItem />}
                    >
                      <CollapsibleTrigger
                        render={<SidebarMenuButton tooltip="النماذج" />}
                      >
                        <BotIcon aria-hidden="true" />
                        <span>النماذج</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="ms-auto transition-transform duration-200 group-data-panel-open/menu-button:rotate-90 rtl:rotate-180"
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton render={<a href="#" />}>
                              <span>جينيسيس</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton render={<a href="#" />}>
                              <span>كوانتوم</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenu>
                </nav>
              </SidebarGroup>
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>المشاريع</SidebarGroupLabel>
                <nav aria-label="المشاريع">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<a href="#" />}>
                        <FrameIcon aria-hidden="true" />
                        <span>هندسة التصميم</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<a href="#" />}>
                        <PieChartIcon aria-hidden="true" />
                        <span>المبيعات والتسويق</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </nav>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuButton
                          size="lg"
                          className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                        />
                      }
                    >
                      <Avatar aria-hidden="true">
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-start text-sm leading-tight">
                        <span className="truncate font-medium">shadcn</span>
                        <span className="truncate text-xs">m@example.com</span>
                      </div>
                      <ChevronsUpDownIcon
                        aria-hidden="true"
                        className="ms-auto size-4"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-(--anchor-width) min-w-56"
                      side="inline-end"
                      align="end"
                      sideOffset={4}
                      dir="rtl"
                      lang="ar"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <SparklesIcon aria-hidden="true" />
                          ترقية إلى Pro
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheckIcon aria-hidden="true" />
                          الحساب
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCardIcon aria-hidden="true" />
                          الفوترة
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BellIcon aria-hidden="true" />
                          الإشعارات
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <LogOutIcon aria-hidden="true" />
                          تسجيل الخروج
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail
              aria-label="تبديل الشريط الجانبي"
              title="تبديل الشريط الجانبي"
            />
          </Sidebar>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger label="تبديل الشريط الجانبي" />
                <h1 className="text-base font-medium">لوحة التحكم</h1>
              </div>
            </header>
          </SidebarInset>
        </SidebarProvider>
      </DirectionProvider>
    </div>
  ),
}
