import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { ChevronDownIcon, DotIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

/*
 * One story per section of breadcrumb.mdx, in the order of the shadcn/ui
 * page. The shadcn examples use next/link; here the links are plain `<a>`
 * (the "Componente de link" story shows the `render` prop).
 *
 * Two stories have a dropdown (Demo and Dropdown). A closed menu is invisible
 * to axe, so their `play` opens it first (the test runs axe after `play`).
 * The menu is in a portal, so it is queried with `screen`; `abrirMenu` also
 * waits for the enter animation to end, because axe would measure contrast
 * mid-fade.
 */
const meta = {
  title: "Componentes/Breadcrumb",
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

async function abrirMenu(canvasElement: HTMLElement, nome: string) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: nome }))
  const menu = await screen.findByRole("menu", { name: nome })
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(menu).toBeVisible())
  return menu
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    // The ellipsis opens a menu with the hidden items; Esc closes it and
    // gives the focus back to the button.
    const gatilho = within(canvasElement).getByRole("button", {
      name: "Mostrar itens omitidos",
    })
    await abrirMenu(canvasElement, "Mostrar itens omitidos")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())
    await abrirMenu(canvasElement, "Mostrar itens omitidos")

    // The current page is marked for assistive technology.
    await expect(
      within(canvasElement).getByRole("link", { current: "page" })
    ).toHaveTextContent("Breadcrumb")
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#inicio" />}>Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button size="icon-sm" variant="ghost" />}
            >
              <BreadcrumbEllipsis aria-hidden="true" />
              <span className="sr-only">Mostrar itens omitidos</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem render={<a href="#documentacao" />}>
                  Documentação
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href="#temas" />}>
                  Temas
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href="#github" />}>
                  GitHub
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#componentes" />}>
            Componentes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <Breadcrumb aria-label="Trilha básica">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#inicio">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#componentes">Componentes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const SeparadorPersonalizado: Story = {
  name: "Separador personalizado",
  render: () => (
    <Breadcrumb aria-label="Trilha com separador personalizado">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#inicio" />}>Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon aria-hidden="true" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#componentes" />}>
            Componentes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon aria-hidden="true" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const Dropdown: Story = {
  play: async ({ canvasElement }) => {
    // Opens by click and stays open, for axe.
    await abrirMenu(canvasElement, "Componentes")
  },
  render: () => (
    <Breadcrumb aria-label="Trilha com menu">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#inicio" />}>Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon aria-hidden="true" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
              }
            >
              Componentes
              <ChevronDownIcon
                aria-hidden="true"
                data-icon="inline-end"
                className="size-3.5"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem render={<a href="#documentacao" />}>
                  Documentação
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href="#temas" />}>
                  Temas
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href="#github" />}>
                  GitHub
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon aria-hidden="true" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const Recolhido: Story = {
  render: () => (
    <Breadcrumb aria-label="Trilha recolhida">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#inicio" />}>Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#componentes" />}>
            Componentes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const ComponenteDeLink: Story = {
  name: "Componente de link",
  render: () => (
    <Breadcrumb aria-label="Trilha com link do roteador">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#link-component" />}>
            Início
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#link-component" />}>
            Componentes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    // The menu is in a portal, so the button opens it with `dir` and `lang`
    // set on the content itself.
    await abrirMenu(canvasElement, "المكونات")
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Breadcrumb aria-label="مسار التنقل">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="#inicio" />}>
                الرئيسية
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <DotIcon aria-hidden="true" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="flex items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
                  }
                >
                  المكونات
                  <ChevronDownIcon
                    aria-hidden="true"
                    data-icon="inline-end"
                    className="size-3.5"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" dir="rtl" lang="ar">
                  <DropdownMenuGroup>
                    <DropdownMenuItem render={<a href="#documentacao" />}>
                      التوثيق
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<a href="#temas" />}>
                      السمات
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<a href="#github" />}>
                      جيت هاب
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <DotIcon aria-hidden="true" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>مسار التنقل</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </DirectionProvider>
  ),
}
