import * as React from "react"
import { cn } from "cn"
import {
  ChevronRightIcon,
  ChevronsUpDownIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { useBrand } from "@workspace/ui/brand/use-brand"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { useDirection } from "@workspace/ui/components/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@workspace/ui/components/sidebar"

/*
 * Dashboard — o layout de aplicação padrão, a partir do bloco sidebar-08 do
 * shadcn/ui (versão Base UI): https://ui.shadcn.com/blocks/sidebar#sidebar-08
 * O CLI (`shadcn add sidebar-08`) escreveu app-sidebar, nav-main,
 * nav-projects, nav-secondary e nav-user no app; a página do bloco
 * (SidebarProvider > AppSidebar + SidebarInset com cabeçalho, gatilho,
 * separador vertical, trilha e área de conteúdo) veio do código do bloco.
 * Aqui eles viram um só template, sem dados: tudo o que é conteúdo chega por
 * props.
 *
 * Decisões:
 * - Mesma aparência do sidebar-08: `Sidebar variant="inset"` com a barra no
 *   início da linha (esquerda em LTR, direita em RTL: o `side` fica de fora e
 *   a Sidebar segue a direção) e o conteúdo num `SidebarInset` arredondado.
 *   O sidebar-08 recolhe em `offcanvas` (o padrão da Sidebar), e esse é o
 *   padrão aqui; `collapsible="icon"` recolhe para a faixa de ícones, com
 *   tooltip nos itens. No celular (< 768px) a barra vira o Sheet da Sidebar.
 *   Ctrl/⌘+B alterna (atalho do SidebarProvider).
 * - Marca: sem a prop `brand`, o cabeçalho mostra a marca ativa
 *   (`useBrand()`, o `data-brand` do <html>): o símbolo (`Mark`) e o nome; se
 *   a marca é ilustrativa, o subtítulo diz isso. O símbolo já tem as cores da
 *   marca, então fica sem o quadrado `bg-sidebar-primary` do registro (o
 *   gradiente sumiria nele). Cada campo de `brand` substitui só o seu.
 * - Links: `renderLink` devolve o elemento de link (`({ href }) => <Link
 *   to={href} />` de um roteador); ele entra pela prop `render` do Base UI,
 *   que junta classe, filhos e `aria-current`. O padrão é `<a href>`. Ele
 *   chega às partes por contexto, então as partes exportadas funcionam
 *   sozinhas (com `<a>`), dentro de um `SidebarProvider`.
 * - Nada sem função: as ações de projeto, o "ver mais" e o menu da conta só
 *   aparecem quando chegam por props (o registro tinha "Upgrade to Pro",
 *   "Billing" e um "More" que não faziam nada). Sem `userMenu`, o usuário
 *   aparece no rodapé como texto, sem botão.
 * - `isActive` marca a página atual (`aria-current="page"` e o destaque da
 *   Sidebar). No registro ele só abria o grupo; aqui um grupo abre sozinho
 *   quando ele ou um subitem é a página atual (ou com `defaultOpen`), também
 *   quando a página muda sem remontar o layout (navegação de um roteador): o
 *   grupo é controlado e abre quando passa a conter a página atual. Ele não
 *   fecha sozinho quando a página sai dele.
 * - Placeholder: sem `children`, a área mostra a grade neutra do sidebar-08
 *   (três blocos e um painel) em `bg-muted` cheio, no lugar de `bg-muted/50`.
 * - Classes lógicas (`-ms-1`, `me-2`, `ms-auto`, `text-start`) no lugar de
 *   `-ml-1` e `mr-2`. Os menus abrem em `inline-end` (ao lado da barra, do
 *   lado da página) e embaixo no celular, no lugar de `right`; o item aberto
 *   usa `data-popup-open:bg-sidebar-accent` (o `aria-expanded:bg-muted` do
 *   registro).
 * - Textos fixos em português, trocáveis por `labels` (outro idioma, RTL),
 *   inclusive os da Sidebar: o nome do gatilho (`sidebarToggle`) e o nome e a
 *   descrição do Sheet do celular (`sidebar`, `sidebarDescription`).
 *
 * Acessibilidade:
 * - Pontos de referência: no desktop, a barra inteira é um `<aside>` chamado
 *   `labels.sidebar` ("Barra lateral"), para a marca e os rótulos dos grupos
 *   não ficarem fora de um ponto de referência; recolhida em `offcanvas`, ele
 *   fica invisível e sai da árvore acessível. No celular a barra já é o
 *   diálogo do Sheet, com o mesmo nome. Dentro dela, cada menu de navegação
 *   fica num `<nav>` com nome próprio (`labels.navMain`, `labels.projects`,
 *   `labels.navSecondary`), diferente do "Trilha de navegação" do Breadcrumb.
 *   O conteúdo fica no `<main>` do `SidebarInset`; o cabeçalho é um
 *   `<header>` dentro dele.
 * - Nomes: o gatilho da barra é "Alternar barra lateral" (`labels.sidebarToggle`), com
 *   `aria-expanded`; a seta de cada grupo é "Alternar submenu de <item>", com
 *   `aria-expanded` e `aria-controls` do Collapsible; o menu de um projeto é
 *   "Mais opções de <projeto>"; o menu do usuário tem o prefixo `sr-only`
 *   "Menu da conta" antes do nome e do e-mail visíveis (o nome visível
 *   continua dentro do nome acessível). Ícones, símbolo e avatar são
 *   `aria-hidden`: o texto ao lado já nomeia.
 * - Os menus são os do DropdownMenu (setas, Esc devolve o foco ao gatilho).
 *   Eles vão para um portal no <body>; o `dir` vem do `useDirection()`, então
 *   seguem a direção do `DirectionProvider` mesmo quando o <html> não muda.
 * - Foco: os itens da barra usam o anel `sidebar-ring`; o gatilho, o Button;
 *   os links da trilha, o anel `ring` com afastamento. Nenhuma cor com
 *   opacidade.
 */

/** Ícone de um item (um ícone do lucide-react, por exemplo). */
export type DashboardIcon = React.ComponentType<{
  className?: string
  "aria-hidden"?: boolean | "true" | "false"
}>

/** Devolve o elemento de link; o Base UI junta a ele classe e filhos. */
export type DashboardRenderLink = (link: { href: string }) => React.ReactElement

export interface DashboardBrand {
  /** Nome no cabeçalho. Padrão: o nome da marca ativa. */
  name?: string
  /** Segunda linha. Padrão: nenhuma (ou "Marca ilustrativa"). */
  subtitle?: string
  /** Símbolo (até 32px). Padrão: o `Mark` da marca ativa. */
  logo?: React.ReactNode
  /** Com `href`, o cabeçalho é um link (o início do app). */
  href?: string
}

export interface DashboardNavSubItem {
  title: string
  url: string
  /** Página atual. */
  isActive?: boolean
}

export interface DashboardNavItem {
  title: string
  url: string
  icon?: DashboardIcon
  /** Página atual (também abre o grupo). */
  isActive?: boolean
  /** Abre o grupo de subitens na primeira renderização. */
  defaultOpen?: boolean
  items?: DashboardNavSubItem[]
}

export interface DashboardProject {
  name: string
  url: string
  icon?: DashboardIcon
  isActive?: boolean
}

export interface DashboardMenuItem {
  label: string
  icon?: DashboardIcon
  /** Navega (item de menu como link). */
  href?: string
  /** Ação (item de menu como botão). */
  onSelect?: () => void
  variant?: "default" | "destructive"
  disabled?: boolean
}

/** Um grupo de itens; os grupos ficam separados por uma linha. */
export type DashboardMenuGroup = DashboardMenuItem[]

export interface DashboardProjectAction {
  label: string
  icon?: DashboardIcon
  /** Navega para o endereço devolvido. */
  href?: (project: DashboardProject) => string
  onSelect?: (project: DashboardProject) => void
  variant?: "default" | "destructive"
}

export type DashboardProjectActionGroup = DashboardProjectAction[]

export interface DashboardUser {
  name: string
  email: string
  /** Endereço da foto. Sem foto, as iniciais do nome. */
  avatar?: string
}

export interface DashboardBreadcrumb {
  label: string
  /** Sem `href`, o item é só texto. O último item é a página atual. */
  href?: string
}

export interface DashboardLabels {
  /** Rótulo e nome do `<nav>` da navegação principal. */
  navMain: string
  /** Rótulo e nome do `<nav>` dos projetos. */
  projects: string
  /** Nome do `<nav>` da navegação secundária. */
  navSecondary: string
  /** Nome do `<nav>` da trilha no cabeçalho. */
  breadcrumb: string
  /** Nome da seta que abre os subitens de um item. */
  toggleSubmenu: (title: string) => string
  /** Nome do botão do menu de um projeto. */
  projectOptions: (name: string) => string
  /** Texto do link para todos os projetos. */
  moreProjects: string
  /** Prefixo lido antes do nome no botão do menu da conta. */
  userMenu: string
  /** Subtítulo padrão quando a marca ativa é ilustrativa. */
  illustrativeBrand: string
  /** Nome do gatilho que abre e fecha a barra. */
  sidebarToggle: string
  /** Nome da barra: o `<aside>` no desktop e o Sheet no celular. */
  sidebar: string
  /** Descrição do Sheet da barra no celular. */
  sidebarDescription: string
}

export const defaultDashboardLabels: DashboardLabels = {
  navMain: "Plataforma",
  projects: "Projetos",
  navSecondary: "Navegação secundária",
  breadcrumb: "Trilha de navegação",
  toggleSubmenu: (title) => `Alternar submenu de ${title}`,
  projectOptions: (name) => `Mais opções de ${name}`,
  moreProjects: "Ver mais projetos",
  userMenu: "Menu da conta",
  illustrativeBrand: "Marca ilustrativa",
  sidebarToggle: "Alternar barra lateral",
  sidebar: "Barra lateral",
  sidebarDescription: "Exibe a barra lateral no celular.",
}

const defaultRenderLink: DashboardRenderLink = ({ href }) => <a href={href} />

type DashboardContextValue = {
  renderLink: DashboardRenderLink
  labels: DashboardLabels
}

const DashboardContext = React.createContext<DashboardContextValue>({
  renderLink: defaultRenderLink,
  labels: defaultDashboardLabels,
})

/** Passa `renderLink` e `labels` às partes (o DashboardLayout já usa). */
export function DashboardProvider({
  renderLink,
  labels,
  children,
}: {
  renderLink?: DashboardRenderLink
  labels?: Partial<DashboardLabels>
  children: React.ReactNode
}) {
  const parent = React.useContext(DashboardContext)
  const value = React.useMemo<DashboardContextValue>(
    () => ({
      renderLink: renderLink ?? parent.renderLink,
      labels: { ...parent.labels, ...labels },
    }),
    [renderLink, labels, parent]
  )
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

function useDashboard() {
  return React.useContext(DashboardContext)
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

function hasActiveChild(item: DashboardNavItem) {
  return item.items?.some((sub) => sub.isActive) ?? false
}

/* ------------------------------------------------------------------------ */

export interface DashboardBrandHeaderProps {
  brand?: DashboardBrand
}

/** O cabeçalho da barra: símbolo, nome e subtítulo da marca. */
export function DashboardBrandHeader({ brand }: DashboardBrandHeaderProps) {
  const active = useBrand()
  const { renderLink, labels } = useDashboard()
  const name = brand?.name ?? active.name
  const subtitle =
    brand?.subtitle ??
    (!brand?.name && active.illustrative ? labels.illustrativeBrand : undefined)
  const logo = brand?.logo ?? (
    <active.Mark aria-hidden="true" className="size-7" />
  )

  const content = (
    <>
      <span
        data-slot="dashboard-brand-logo"
        aria-hidden="true"
        className="flex aspect-square size-8 shrink-0 items-center justify-center [&>svg]:max-h-8 [&>svg]:max-w-8"
      >
        {logo}
      </span>
      <span className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        {subtitle ? (
          <span className="truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </span>
    </>
  )

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {brand?.href ? (
            <SidebarMenuButton
              size="lg"
              render={renderLink({ href: brand.href })}
            >
              {content}
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              size="lg"
              render={<div />}
              className="hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent active:text-sidebar-foreground"
            >
              {content}
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

/* ------------------------------------------------------------------------ */

export interface DashboardNavMainProps extends React.ComponentProps<
  typeof SidebarGroup
> {
  items: DashboardNavItem[]
  /** Rótulo do grupo e nome do `<nav>`. Padrão: `labels.navMain`. */
  label?: string
}

/*
 * Um grupo de subitens. Controlado, para abrir quando passa a conter a página
 * atual depois da montagem (`isActive` muda sem remontar o layout): com um
 * `defaultOpen` só, ele ficaria fechado e o link `aria-current` não estaria
 * no DOM. Só abre; fechar continua com a pessoa.
 */
function DashboardNavGroup({
  item,
  children,
}: {
  item: DashboardNavItem
  children: React.ReactNode
}) {
  const active = Boolean(item.isActive || hasActiveChild(item))
  const [open, setOpen] = React.useState(item.defaultOpen ?? active)
  const [wasActive, setWasActive] = React.useState(active)
  if (active !== wasActive) {
    setWasActive(active)
    if (active) setOpen(true)
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={<SidebarMenuItem />}
    >
      {children}
    </Collapsible>
  )
}

/** Navegação principal: itens com ícone e grupos de subitens que abrem. */
export function DashboardNavMain({
  items,
  label,
  ...props
}: DashboardNavMainProps) {
  const { renderLink, labels } = useDashboard()
  const { isMobile } = useSidebar()
  const name = label ?? labels.navMain

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <nav aria-label={name}>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon
            const button = (
              <SidebarMenuButton
                // No celular a barra é um Sheet e nunca recolhe: sem tooltip,
                // o Esc num item fecha o Sheet direto (o Tooltip aberto pelo
                // foco consumiria o primeiro Esc).
                tooltip={isMobile ? undefined : item.title}
                isActive={item.isActive}
                render={renderLink({ href: item.url })}
              >
                {Icon ? <Icon aria-hidden="true" /> : null}
                <span>{item.title}</span>
              </SidebarMenuButton>
            )

            if (!item.items?.length) {
              return (
                <SidebarMenuItem key={item.title}>{button}</SidebarMenuItem>
              )
            }

            return (
              <DashboardNavGroup key={item.title} item={item}>
                {button}
                <CollapsibleTrigger
                  render={
                    <SidebarMenuAction className="group/dashboard-submenu" />
                  }
                >
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="transition-transform duration-200 group-data-panel-open/dashboard-submenu:rotate-90 rtl:rotate-180"
                  />
                  <span className="sr-only">
                    {labels.toggleSubmenu(item.title)}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton
                          isActive={sub.isActive}
                          render={renderLink({ href: sub.url })}
                        >
                          <span>{sub.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </DashboardNavGroup>
            )
          })}
        </SidebarMenu>
      </nav>
    </SidebarGroup>
  )
}

/* ------------------------------------------------------------------------ */

function MenuItems({
  groups,
  render,
}: {
  groups: DashboardMenuGroup[]
  render: DashboardRenderLink
}) {
  return groups.map((group, index) => (
    <React.Fragment key={index}>
      {index > 0 ? <DropdownMenuSeparator /> : null}
      <DropdownMenuGroup>
        {group.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem
              key={item.label}
              variant={item.variant}
              disabled={item.disabled}
              render={item.href ? render({ href: item.href }) : undefined}
              onClick={item.onSelect}
            >
              {Icon ? <Icon aria-hidden="true" /> : null}
              <span>{item.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuGroup>
    </React.Fragment>
  ))
}

export interface DashboardNavProjectsProps extends React.ComponentProps<
  typeof SidebarGroup
> {
  projects: DashboardProject[]
  /** Itens do menu de cada projeto. Sem eles, o projeto não tem menu. */
  actions?: DashboardProjectActionGroup[]
  /** Endereço da lista completa: mostra o link "Ver mais projetos". */
  moreUrl?: string
  /** Rótulo do grupo e nome do `<nav>`. Padrão: `labels.projects`. */
  label?: string
}

/** Projetos, cada um com um menu de ações. Some na barra recolhida em ícones. */
export function DashboardNavProjects({
  projects,
  actions,
  moreUrl,
  label,
  className,
  ...props
}: DashboardNavProjectsProps) {
  const { isMobile } = useSidebar()
  const direction = useDirection()
  const { renderLink, labels } = useDashboard()
  const name = label ?? labels.projects

  return (
    <SidebarGroup
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    >
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <nav aria-label={name}>
        <SidebarMenu>
          {projects.map((project) => {
            const Icon = project.icon
            return (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton
                  isActive={project.isActive}
                  render={renderLink({ href: project.url })}
                >
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  <span>{project.name}</span>
                </SidebarMenuButton>
                {actions?.length ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction
                          showOnHover
                          className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                        />
                      }
                    >
                      <MoreHorizontalIcon aria-hidden="true" />
                      <span className="sr-only">
                        {labels.projectOptions(project.name)}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      dir={direction}
                      className="w-48"
                      side={isMobile ? "bottom" : "inline-end"}
                      align={isMobile ? "end" : "start"}
                    >
                      <MenuItems
                        render={renderLink}
                        groups={actions.map((group) =>
                          group.map((action) => ({
                            label: action.label,
                            icon: action.icon,
                            variant: action.variant,
                            href: action.href?.(project),
                            onSelect: action.onSelect
                              ? () => action.onSelect?.(project)
                              : undefined,
                          }))
                        )}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </SidebarMenuItem>
            )
          })}
          {moreUrl ? (
            <SidebarMenuItem>
              <SidebarMenuButton render={renderLink({ href: moreUrl })}>
                <MoreHorizontalIcon aria-hidden="true" />
                <span>{labels.moreProjects}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </nav>
    </SidebarGroup>
  )
}

/* ------------------------------------------------------------------------ */

export interface DashboardNavSecondaryProps extends React.ComponentProps<
  typeof SidebarGroup
> {
  items: DashboardNavItem[]
  /** Nome do `<nav>`. Padrão: `labels.navSecondary`. */
  label?: string
}

/** Links menores no fim da barra (ajuda, comentários). */
export function DashboardNavSecondary({
  items,
  label,
  ...props
}: DashboardNavSecondaryProps) {
  const { renderLink, labels } = useDashboard()
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <nav aria-label={label ?? labels.navSecondary}>
          <SidebarMenu>
            {items.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="sm"
                    tooltip={isMobile ? undefined : item.title}
                    isActive={item.isActive}
                    render={renderLink({ href: item.url })}
                  >
                    {Icon ? <Icon aria-hidden="true" /> : null}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </nav>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

/* ------------------------------------------------------------------------ */

function UserSummary({ user }: { user: DashboardUser }) {
  return (
    <>
      <Avatar aria-hidden="true">
        {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
        <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
      </Avatar>
      <span className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </span>
    </>
  )
}

export interface DashboardNavUserProps {
  user: DashboardUser
  /** Itens do menu da conta, em grupos. Sem eles, o usuário é só texto. */
  menu?: DashboardMenuGroup[]
}

/** O usuário no rodapé da barra, com o menu da conta. */
export function DashboardNavUser({ user, menu }: DashboardNavUserProps) {
  const { isMobile } = useSidebar()
  const direction = useDirection()
  const { renderLink, labels } = useDashboard()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {menu?.length ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                />
              }
            >
              <span className="sr-only">{labels.userMenu}: </span>
              <UserSummary user={user} />
              <ChevronsUpDownIcon
                aria-hidden="true"
                className="ms-auto size-4"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              dir={direction}
              className="w-(--anchor-width) min-w-56"
              side={isMobile ? "bottom" : "inline-end"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <span className="flex items-center gap-2 px-1 py-1.5 text-start text-sm text-popover-foreground">
                    <UserSummary user={user} />
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <MenuItems groups={menu} render={renderLink} />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex h-12 items-center gap-2 overflow-hidden px-3 text-sm group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0">
            <UserSummary user={user} />
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/* ------------------------------------------------------------------------ */

export interface DashboardSidebarProps extends Omit<
  React.ComponentProps<typeof Sidebar>,
  "children"
> {
  brand?: DashboardBrand
  navMain: DashboardNavItem[]
  navMainLabel?: string
  projects?: DashboardProject[]
  projectActions?: DashboardProjectActionGroup[]
  moreProjectsUrl?: string
  navSecondary?: DashboardNavItem[]
  user: DashboardUser
  userMenu?: DashboardMenuGroup[]
}

/** A barra do sidebar-08: marca, navegação, projetos, links e usuário. */
export function DashboardSidebar({
  brand,
  navMain,
  navMainLabel,
  projects,
  projectActions,
  moreProjectsUrl,
  navSecondary,
  user,
  userMenu,
  variant = "inset",
  ...props
}: DashboardSidebarProps) {
  const direction = useDirection()
  const { labels } = useDashboard()
  const { isMobile } = useSidebar()
  // No desktop, um <aside> com nome: a marca e os rótulos dos grupos ficam
  // dentro de um ponto de referência. No celular a barra já é o diálogo do
  // Sheet (com o mesmo nome), então o invólucro é um div.
  const Region = isMobile ? "div" : "aside"
  return (
    <Sidebar
      variant={variant}
      dir={direction}
      mobileTitle={labels.sidebar}
      mobileDescription={labels.sidebarDescription}
      {...props}
    >
      <Region
        data-slot="dashboard-sidebar-region"
        aria-label={isMobile ? undefined : labels.sidebar}
        className="flex min-h-0 flex-1 flex-col"
      >
        <DashboardBrandHeader brand={brand} />
        <SidebarContent>
          <DashboardNavMain items={navMain} label={navMainLabel} />
          {projects?.length ? (
            <DashboardNavProjects
              projects={projects}
              actions={projectActions}
              moreUrl={moreProjectsUrl}
            />
          ) : null}
          {navSecondary?.length ? (
            <DashboardNavSecondary items={navSecondary} className="mt-auto" />
          ) : null}
        </SidebarContent>
        <SidebarFooter>
          <DashboardNavUser user={user} menu={userMenu} />
        </SidebarFooter>
      </Region>
    </Sidebar>
  )
}

/* ------------------------------------------------------------------------ */

export interface DashboardHeaderProps extends Omit<
  React.ComponentProps<"header">,
  "children"
> {
  breadcrumbs?: DashboardBreadcrumb[]
  /** Ações no fim do cabeçalho (botões, menu). */
  actions?: React.ReactNode
}

/** Cabeçalho do conteúdo: gatilho da barra, trilha e ações. */
export function DashboardHeader({
  breadcrumbs,
  actions,
  className,
  ...props
}: DashboardHeaderProps) {
  const { renderLink, labels } = useDashboard()
  const last = (breadcrumbs?.length ?? 0) - 1

  return (
    <header
      data-slot="dashboard-header"
      className={cn("flex h-16 shrink-0 items-center gap-2", className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ms-1" label={labels.sidebarToggle} />
        {breadcrumbs?.length ? (
          <>
            <Separator
              orientation="vertical"
              className="me-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb aria-label={labels.breadcrumb}>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={`${index}-${crumb.label}`}>
                    {index > 0 ? (
                      <BreadcrumbSeparator className="hidden md:block" />
                    ) : null}
                    <BreadcrumbItem
                      className={
                        index < last ? "hidden md:inline-flex" : undefined
                      }
                    >
                      {index === last ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : crumb.href ? (
                        <BreadcrumbLink
                          render={renderLink({ href: crumb.href })}
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        ) : null}
      </div>
      {actions ? (
        <div
          data-slot="dashboard-header-actions"
          className="ms-auto flex items-center gap-2 px-4"
        >
          {actions}
        </div>
      ) : null}
    </header>
  )
}

/* ------------------------------------------------------------------------ */

/** A área de conteúdo, com o recuo do sidebar-08. */
export function DashboardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dashboard-content"
      className={cn("flex flex-1 flex-col gap-4 p-4 pt-0", className)}
      {...props}
    />
  )
}

/** A grade neutra do sidebar-08, mostrada quando não há conteúdo. */
export function DashboardPlaceholder() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
    </>
  )
}

/* ------------------------------------------------------------------------ */

export interface DashboardLayoutProps extends Omit<
  React.ComponentProps<typeof SidebarProvider>,
  "children"
> {
  /** Marca do cabeçalho. Padrão: a marca ativa (`data-brand`). */
  brand?: DashboardBrand
  navMain: DashboardNavItem[]
  /** Rótulo da navegação principal. Padrão: "Plataforma". */
  navMainLabel?: string
  projects?: DashboardProject[]
  projectActions?: DashboardProjectActionGroup[]
  moreProjectsUrl?: string
  navSecondary?: DashboardNavItem[]
  user: DashboardUser
  userMenu?: DashboardMenuGroup[]
  breadcrumbs?: DashboardBreadcrumb[]
  headerActions?: React.ReactNode
  /** Como a barra recolhe. Padrão: "offcanvas", como no sidebar-08. */
  collapsible?: "offcanvas" | "icon"
  renderLink?: DashboardRenderLink
  labels?: Partial<DashboardLabels>
  /** O conteúdo da página. Sem ele, a grade neutra do sidebar-08. */
  children?: React.ReactNode
}

/** Layout de aplicação padrão (sidebar-08): barra no início, conteúdo ao lado. */
export function DashboardLayout({
  brand,
  navMain,
  navMainLabel,
  projects,
  projectActions,
  moreProjectsUrl,
  navSecondary,
  user,
  userMenu,
  breadcrumbs,
  headerActions,
  collapsible = "offcanvas",
  renderLink,
  labels,
  children,
  ...props
}: DashboardLayoutProps) {
  return (
    <DashboardProvider renderLink={renderLink} labels={labels}>
      <SidebarProvider {...props}>
        <DashboardSidebar
          brand={brand}
          navMain={navMain}
          navMainLabel={navMainLabel}
          projects={projects}
          projectActions={projectActions}
          moreProjectsUrl={moreProjectsUrl}
          navSecondary={navSecondary}
          user={user}
          userMenu={userMenu}
          collapsible={collapsible}
        />
        <SidebarInset>
          <DashboardHeader breadcrumbs={breadcrumbs} actions={headerActions} />
          <DashboardContent>
            {children ?? <DashboardPlaceholder />}
          </DashboardContent>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  )
}
