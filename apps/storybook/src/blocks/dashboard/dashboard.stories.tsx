import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  ChartColumnIcon,
  CreditCardIcon,
  FolderIcon,
  ForwardIcon,
  FrameIcon,
  HomeIcon,
  InboxIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MapIcon,
  PieChartIcon,
  PlusIcon,
  SendIcon,
  Settings2Icon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"

import { DashboardLayout } from "@workspace/ui/blocks/dashboard"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ChartContainer } from "@workspace/ui/components/chart"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

/*
 * Stories of the Dashboard block (sidebar-08). All the sample data (labels,
 * user, projects) lives here, inline in each `render`, so "Show code" gives
 * a snippet that can be pasted as is; the block itself has no data.
 *
 * LAYOUT. The desktop Sidebar is `position: fixed` and `h-svh`. Like the
 * Sidebar stories, the decorator gives each story a box that is its own
 * containing block (`transform`), with a fixed height, and overrides
 * `h-svh`/`min-h-svh` inside it; the inset scrolls inside the box. The Docs
 * page renders the stories inline, like the Sidebar page: as iframes
 * (`docs.story.inline: false`) Storybook ran every `play` on the Docs page,
 * which left menus open, collapsed sidebars and scrolled the page. Inline,
 * Ctrl+B (a window listener) toggles every story on the page at once, and the
 * `<nav>` names repeat between stories; each story alone is clean.
 *
 * DESKTOP vs MOBILE. Tests run at 1200x900; only `Mobile` sets
 * `globals.viewport`. `conferirDesktop` makes a leaking viewport fail loudly.
 *
 * OVERLAYS. A closed menu is invisible to axe, so the plays end with a menu
 * or the Sheet open. Menus are portaled to <body>: query them with `screen`.
 */
const meta = {
  title: "Blocks/Dashboard",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        data-caixa=""
        className="relative h-[42rem] [transform:translateZ(0)] overflow-hidden rounded-2xl border border-border **:data-[slot=sidebar-container]:h-full **:data-[slot=sidebar-inset]:overflow-y-auto **:data-[slot=sidebar-wrapper]:h-full **:data-[slot=sidebar-wrapper]:min-h-0"
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta

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

// The sidebar must stay inside the box of the decorator (footer included).
async function conferirContido(canvasElement: HTMLElement) {
  const caixa = pegar(canvasElement, "[data-caixa]").getBoundingClientRect()
  const barra = pegar(
    canvasElement,
    "[data-slot=sidebar-container]"
  ).getBoundingClientRect()
  await expect(barra.top).toBeGreaterThanOrEqual(caixa.top - 1)
  await expect(barra.bottom).toBeLessThanOrEqual(caixa.bottom + 1)
}

function rotacao(elemento: HTMLElement) {
  return getComputedStyle(elemento.querySelector("svg") as SVGElement).rotate
}

// The name of the active brand (the Marca toolbar, or `--mode sesi`).
function marcaAtiva() {
  return document.documentElement.getAttribute("data-brand") === "sesi"
    ? /SESI/
    : /Brainz Group/
}

// Opens a menu from its trigger, closes it with Escape (the focus goes back
// to the trigger) and opens it again, so axe sees it open.
async function abrirMenu(gatilho: HTMLElement) {
  await userEvent.click(gatilho)
  let menu = await screen.findByRole("menu")
  await esperarAnimacoes()
  await waitFor(() => expect(menu).toBeVisible())
  await userEvent.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  await waitFor(() => expect(gatilho).toHaveFocus())
  await userEvent.click(gatilho)
  menu = await screen.findByRole("menu")
  await esperarAnimacoes()
  await waitFor(() => expect(menu).toBeVisible())
  return menu
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const tela = within(canvasElement)
    const rtl = document.documentElement.dir === "rtl"
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const barra = pegar(canvasElement, "[data-slot=sidebar]")

    // sidebar-08: inset variant, on the start side, content beside it.
    await expect(barra).toHaveAttribute("data-variant", "inset")
    const container = pegar(canvasElement, "[data-slot=sidebar-container]")
    const inset = pegar(canvasElement, "[data-slot=sidebar-inset]")
    if (rtl) {
      await expect(inset.getBoundingClientRect().right).toBeLessThanOrEqual(
        container.getBoundingClientRect().left + 2
      )
    } else {
      await expect(inset.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        container.getBoundingClientRect().right - 2
      )
    }

    // The header shows the active brand, as a link.
    await expect(tela.getByRole("link", { name: marcaAtiva() })).toBeVisible()

    // One named <nav> per menu, plus the breadcrumb.
    const plataforma = tela.getByRole("navigation", { name: "Plataforma" })
    await expect(
      tela.getByRole("navigation", { name: "Projetos" })
    ).toBeVisible()
    await expect(
      tela.getByRole("navigation", { name: "Navegação secundária" })
    ).toBeVisible()
    await expect(
      tela.getByRole("navigation", { name: "Trilha de navegação" })
    ).toBeVisible()

    // The current page is marked, and its group starts open.
    await expect(
      within(plataforma).getByRole("link", { name: "Visão geral" })
    ).toHaveAttribute("aria-current", "page")
    const inicio = tela.getByRole("button", {
      name: "Alternar submenu de Início",
    })
    await expect(inicio).toHaveAttribute("aria-expanded", "true")
    await expect(rotacao(inicio)).toBe("90deg")

    // A closed group opens with the keyboard; the arrow follows the direction.
    const relatorios = tela.getByRole("button", {
      name: "Alternar submenu de Relatórios",
    })
    await expect(relatorios).toHaveAttribute("aria-expanded", "false")
    await expect(rotacao(relatorios)).toBe(rtl ? "180deg" : "none")
    relatorios.focus()
    await userEvent.keyboard("{Enter}")
    await expect(relatorios).toHaveAttribute("aria-expanded", "true")
    await expect(
      await within(plataforma).findByRole("link", { name: "Vendas" })
    ).toBeVisible()

    // The trigger collapses the sidebar off canvas (as in sidebar-08)...
    await expect(gatilho).toHaveAccessibleName("Alternar barra lateral")
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-collapsible", "offcanvas")
    )
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await esperarAnimacoes()
    await waitFor(() =>
      expect(tela.queryByRole("navigation", { name: "Plataforma" })).toBeNull()
    )

    // ...and Ctrl+B brings it back.
    await userEvent.keyboard("{Control>}b{/Control}")
    await waitFor(() => expect(barra).toHaveAttribute("data-state", "expanded"))
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()

    // The project menu opens with the keyboard and Escape returns the focus.
    const opcoes = tela.getByRole("button", {
      name: "Mais opções de Engenharia de design",
    })
    opcoes.focus()
    await userEvent.keyboard("{Enter}")
    const menuProjeto = await screen.findByRole("menu")
    await expect(
      within(menuProjeto).getByRole("menuitem", { name: "Excluir projeto" })
    ).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(opcoes).toHaveFocus())

    // The account menu stays open, for axe.
    const conta = tela.getByRole("button", { name: /^Menu da conta/ })
    await expect(conta).toHaveAccessibleName(
      "Menu da conta: Maria Souza maria@example.com"
    )
    let menu = await abrirMenu(conta)
    await expect(
      within(menu).getByRole("menuitem", { name: "Sair" })
    ).toBeInTheDocument()

    // An item with `href` is a link: Enter activates it (the click that
    // makes an <a> navigate) and closes the menu. The test stops the
    // navigation itself, which would unload the test page.
    const item = within(menu).getByRole("menuitem", { name: "Conta" })
    await expect(item.tagName).toBe("A")
    await expect(item).toHaveAttribute("href", "#conta")
    let ativado = false
    item.addEventListener("click", (event) => {
      event.preventDefault()
      ativado = true
    })
    item.focus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(ativado).toBe(true))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())

    // Open again, for axe.
    await userEvent.click(conta)
    menu = await screen.findByRole("menu")
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
  },
  render: () => (
    <DashboardLayout
      brand={{ href: "#inicio" }}
      navMain={[
        {
          title: "Início",
          url: "#inicio",
          icon: HomeIcon,
          items: [
            { title: "Visão geral", url: "#visao-geral", isActive: true },
            { title: "Atividade", url: "#atividade" },
            { title: "Favoritos", url: "#favoritos" },
          ],
        },
        {
          title: "Relatórios",
          url: "#relatorios",
          icon: ChartColumnIcon,
          items: [
            { title: "Vendas", url: "#vendas" },
            { title: "Financeiro", url: "#financeiro" },
            { title: "Equipe", url: "#relatorio-equipe" },
          ],
        },
        {
          title: "Documentação",
          url: "#documentacao",
          icon: BookOpenIcon,
          items: [
            { title: "Introdução", url: "#introducao" },
            { title: "Primeiros passos", url: "#primeiros-passos" },
            { title: "Tutoriais", url: "#tutoriais" },
          ],
        },
        {
          title: "Configurações",
          url: "#configuracoes",
          icon: Settings2Icon,
          items: [
            { title: "Geral", url: "#geral" },
            { title: "Equipe", url: "#equipe" },
            { title: "Notificações", url: "#notificacoes" },
          ],
        },
      ]}
      projects={[
        { name: "Engenharia de design", url: "#design", icon: FrameIcon },
        { name: "Vendas e marketing", url: "#marketing", icon: PieChartIcon },
        { name: "Viagens", url: "#viagens", icon: MapIcon },
      ]}
      projectActions={[
        [
          {
            label: "Ver projeto",
            icon: FolderIcon,
            href: (project) => project.url,
          },
          {
            label: "Compartilhar projeto",
            icon: ForwardIcon,
            onSelect: () => {},
          },
        ],
        [{ label: "Excluir projeto", icon: Trash2Icon, onSelect: () => {} }],
      ]}
      moreProjectsUrl="#projetos"
      navSecondary={[
        { title: "Suporte", url: "#suporte", icon: LifeBuoyIcon },
        { title: "Comentários", url: "#comentarios", icon: SendIcon },
      ]}
      user={{ name: "Maria Souza", email: "maria@example.com" }}
      userMenu={[
        [
          { label: "Conta", icon: BadgeCheckIcon, href: "#conta" },
          { label: "Notificações", icon: BellIcon, href: "#avisos" },
        ],
        [{ label: "Sair", icon: LogOutIcon, onSelect: () => {} }],
      ]}
      breadcrumbs={[
        { label: "Início", href: "#inicio" },
        { label: "Visão geral" },
      ]}
    />
  ),
}

export const Recolhida: Story = {
  name: "Recolhida em ícones",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const tela = within(canvasElement)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const barra = pegar(canvasElement, "[data-slot=sidebar]")
    const container = pegar(canvasElement, "[data-slot=sidebar-container]")

    // Starts collapsed to the icon strip (3rem + the inset padding).
    await expect(barra).toHaveAttribute("data-collapsible", "icon")
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await esperarAnimacoes()
    await expect(
      Math.round(container.getBoundingClientRect().width)
    ).toBeLessThanOrEqual(66)

    // The links keep their names (the text is only clipped); the projects
    // group and the submenu arrows are gone.
    const plataforma = tela.getByRole("navigation", { name: "Plataforma" })
    await expect(
      within(plataforma).getByRole("link", { name: "Início" })
    ).toBeVisible()
    await expect(
      tela.queryByRole("navigation", { name: "Projetos" })
    ).toBeNull()
    await expect(
      tela.queryByRole("button", { name: /^Alternar submenu/ })
    ).toBeNull()

    // Enter on the trigger expands it; Ctrl+B collapses it again.
    gatilho.focus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(barra).toHaveAttribute("data-state", "expanded"))
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await esperarAnimacoes()
    await expect(
      tela.getByRole("navigation", { name: "Projetos" })
    ).toBeVisible()
    await userEvent.keyboard("{Control>}b{/Control}")
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-collapsible", "icon")
    )
    await esperarAnimacoes()

    // The account menu opens from the avatar, beside the strip.
    const conta = tela.getByRole("button", { name: /^Menu da conta/ })
    const menu = await abrirMenu(conta)
    if (document.documentElement.dir !== "rtl") {
      await expect(menu.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        conta.getBoundingClientRect().right
      )
    }
  },
  render: () => (
    <DashboardLayout
      collapsible="icon"
      defaultOpen={false}
      brand={{ href: "#inicio" }}
      navMain={[
        { title: "Início", url: "#inicio", icon: HomeIcon, isActive: true },
        { title: "Caixa de entrada", url: "#caixa", icon: InboxIcon },
        {
          title: "Relatórios",
          url: "#relatorios",
          icon: ChartColumnIcon,
          items: [
            { title: "Vendas", url: "#vendas" },
            { title: "Financeiro", url: "#financeiro" },
          ],
        },
        { title: "Configurações", url: "#configuracoes", icon: Settings2Icon },
      ]}
      projects={[
        { name: "Engenharia de design", url: "#design", icon: FrameIcon },
        { name: "Vendas e marketing", url: "#marketing", icon: PieChartIcon },
      ]}
      navSecondary={[
        { title: "Suporte", url: "#suporte", icon: LifeBuoyIcon },
        { title: "Comentários", url: "#comentarios", icon: SendIcon },
      ]}
      user={{ name: "Maria Souza", email: "maria@example.com" }}
      userMenu={[
        [{ label: "Conta", icon: BadgeCheckIcon, href: "#conta" }],
        [{ label: "Sair", icon: LogOutIcon, onSelect: () => {} }],
      ]}
      breadcrumbs={[{ label: "Início" }]}
    />
  ),
}

export const ComConteudo: Story = {
  name: "Com conteúdo",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const tela = within(canvasElement)

    // The page has its own heading, chart and table, named.
    await expect(
      tela.getByRole("heading", { level: 1, name: "Visão geral" })
    ).toBeVisible()
    await expect(
      tela.getByRole("figure", { name: "Pedidos por mês" })
    ).toBeInTheDocument()
    await expect(
      tela.getByRole("table", { name: "Pedidos recentes" })
    ).toBeInTheDocument()
    // At phone width the table scrolls sideways: the scroller is a named,
    // focusable region (a text-only table has nothing else to focus).
    await expect(
      tela.getByRole("region", { name: "Pedidos recentes" })
    ).toHaveAttribute("tabindex", "0")

    // The bars are painted with the chart tokens, not the default black.
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(".recharts-bar-rectangle path").length
      ).toBeGreaterThanOrEqual(6)
    )
    const cor = getComputedStyle(
      canvasElement.querySelector(".recharts-bar-rectangle path")!
    ).fill
    await expect(cor).not.toBe("rgb(0, 0, 0)")
    await new Promise((resolve) => setTimeout(resolve, 900))

    // Keyboard order in the header: trigger, breadcrumb link, header action.
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    gatilho.focus()
    await userEvent.tab()
    await expect(tela.getByRole("link", { name: "Início" })).toHaveFocus()
    await userEvent.tab()
    await expect(
      tela.getByRole("button", { name: "Novo relatório" })
    ).toHaveFocus()
  },
  render: () => (
    <DashboardLayout
      navMain={[
        {
          title: "Visão geral",
          url: "#visao-geral",
          icon: HomeIcon,
          isActive: true,
        },
        { title: "Pedidos", url: "#pedidos", icon: InboxIcon },
        { title: "Clientes", url: "#clientes", icon: UsersIcon },
        { title: "Relatórios", url: "#relatorios", icon: ChartColumnIcon },
      ]}
      navSecondary={[{ title: "Suporte", url: "#suporte", icon: LifeBuoyIcon }]}
      user={{ name: "Maria Souza", email: "maria@example.com" }}
      userMenu={[[{ label: "Sair", icon: LogOutIcon, onSelect: () => {} }]]}
      breadcrumbs={[
        { label: "Início", href: "#inicio" },
        { label: "Visão geral" },
      ]}
      headerActions={
        <Button size="sm">
          <PlusIcon aria-hidden="true" data-icon="inline-start" />
          Novo relatório
        </Button>
      }
    >
      <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Receita do mês</CardDescription>
            <CardTitle>
              <h2 className="text-2xl font-semibold tabular-nums">R$ 48.200</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            12% acima do mês passado
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Novos clientes</CardDescription>
            <CardTitle>
              <h2 className="text-2xl font-semibold tabular-nums">126</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            34 nesta semana
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Chamados abertos</CardDescription>
            <CardTitle>
              <h2 className="text-2xl font-semibold tabular-nums">18</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            5 com prazo hoje
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <figure
            aria-labelledby="dashboard-grafico-titulo"
            className="grid gap-3"
          >
            <figcaption className="grid gap-1">
              <h2 id="dashboard-grafico-titulo" className="font-medium">
                Pedidos por mês
              </h2>
              <p className="text-sm text-muted-foreground">
                De janeiro a junho.
              </p>
            </figcaption>
            <ChartContainer
              id="dashboard-pedidos"
              config={{
                pedidos: { label: "Pedidos", color: "var(--chart-1)" },
              }}
              className="aspect-auto h-[220px] w-full"
            >
              <BarChart
                accessibilityLayer
                title="Pedidos por mês"
                desc="Gráfico de barras com os pedidos de janeiro a junho."
                data={[
                  { mes: "Jan", pedidos: 186 },
                  { mes: "Fev", pedidos: 305 },
                  { mes: "Mar", pedidos: 237 },
                  { mes: "Abr", pedidos: 173 },
                  { mes: "Mai", pedidos: 209 },
                  { mes: "Jun", pedidos: 264 },
                ]}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                <Bar dataKey="pedidos" fill="var(--color-pedidos)" radius={4} />
              </BarChart>
            </ChartContainer>
          </figure>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div
            role="region"
            aria-labelledby="pedidos-recentes"
            tabIndex={0}
            className="overflow-x-auto rounded-xl outline-hidden focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card **:data-[slot=table-container]:overflow-visible"
          >
            <Table>
              <TableCaption id="pedidos-recentes">
                Pedidos recentes
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-end">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#1042</TableCell>
                  <TableCell>Ana Lima</TableCell>
                  <TableCell>Pago</TableCell>
                  <TableCell className="text-end">R$ 250,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#1041</TableCell>
                  <TableCell>Bruno Costa</TableCell>
                  <TableCell>Pendente</TableCell>
                  <TableCell className="text-end">R$ 150,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#1040</TableCell>
                  <TableCell>Carla Dias</TableCell>
                  <TableCell>Pago</TableCell>
                  <TableCell className="text-end">R$ 350,00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  ),
}

export const SemProjetos: Story = {
  name: "Sem projetos",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const tela = within(canvasElement)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    const barra = pegar(canvasElement, "[data-slot=sidebar]")

    // Only what was passed: no projects, no secondary links, no breadcrumb,
    // and without `userMenu` the user is plain text, not a button.
    await expect(
      tela.queryByRole("navigation", { name: "Projetos" })
    ).toBeNull()
    await expect(
      tela.queryByRole("navigation", { name: "Navegação secundária" })
    ).toBeNull()
    await expect(
      tela.queryByRole("navigation", { name: "Trilha de navegação" })
    ).toBeNull()
    await expect(
      tela.queryByRole("button", { name: /Menu da conta/ })
    ).toBeNull()
    await expect(tela.getByText("Maria Souza")).toBeVisible()

    // The brand without `href` is not a link (nothing to focus).
    await expect(tela.queryByRole("link", { name: marcaAtiva() })).toBeNull()

    // From the last link, Tab goes to the trigger.
    const plataforma = tela.getByRole("navigation", { name: "Plataforma" })
    within(plataforma).getByRole("link", { name: "Configurações" }).focus()
    await userEvent.tab()
    await expect(gatilho).toHaveFocus()

    // Enter collapses; the hidden links leave the Tab order.
    await userEvent.keyboard("{Enter}")
    await waitFor(() =>
      expect(barra).toHaveAttribute("data-collapsible", "offcanvas")
    )
    await esperarAnimacoes()
    await userEvent.tab({ shift: true })
    await expect(barra).not.toContainElement(
      document.activeElement as HTMLElement
    )

    // Ctrl+B opens it again.
    await userEvent.keyboard("{Control>}b{/Control}")
    await waitFor(() => expect(barra).toHaveAttribute("data-state", "expanded"))
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
  },
  render: () => (
    <DashboardLayout
      navMain={[
        { title: "Início", url: "#inicio", icon: HomeIcon, isActive: true },
        { title: "Caixa de entrada", url: "#caixa", icon: InboxIcon },
        { title: "Configurações", url: "#configuracoes", icon: Settings2Icon },
      ]}
      user={{ name: "Maria Souza", email: "maria@example.com" }}
    />
  ),
}

export const Mobile: Story = {
  name: "Celular",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    // 320px wide: the sidebar is the Sheet of the Sidebar.
    expect(window.matchMedia("(max-width: 767px)").matches).toBe(true)
    const gatilho = pegar(canvasElement, "[data-slot=sidebar-trigger]")
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")

    // The trigger opens a modal dialog with the focus inside.
    await userEvent.click(gatilho)
    const dialogo = await screen.findByRole("dialog", { name: "Barra lateral" })
    await esperarAnimacoes()
    await waitFor(() => expect(dialogo).toBeVisible())
    await expect(gatilho).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(dialogo).toContainElement(document.activeElement as HTMLElement)
    )
    await expect(
      within(dialogo).getByRole("navigation", { name: "Plataforma" })
    ).toBeVisible()

    // The focus is trapped.
    for (let i = 0; i < 5; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(dialogo).toContainElement(document.activeElement as HTMLElement)
      )
    }

    // Escape closes and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Ctrl+B opens it again and it stays open, for axe.
    await userEvent.keyboard("{Control>}b{/Control}")
    const aberto = await screen.findByRole("dialog", { name: "Barra lateral" })
    await esperarAnimacoes()
    await waitFor(() => expect(aberto).toBeVisible())
  },
  render: () => (
    <DashboardLayout
      brand={{ href: "#inicio" }}
      navMain={[
        {
          title: "Início",
          url: "#inicio",
          icon: HomeIcon,
          items: [
            { title: "Visão geral", url: "#visao-geral", isActive: true },
            { title: "Atividade", url: "#atividade" },
          ],
        },
        { title: "Caixa de entrada", url: "#caixa", icon: InboxIcon },
        { title: "Configurações", url: "#configuracoes", icon: Settings2Icon },
      ]}
      projects={[
        { name: "Engenharia de design", url: "#design", icon: FrameIcon },
        { name: "Viagens", url: "#viagens", icon: MapIcon },
      ]}
      projectActions={[
        [
          {
            label: "Ver projeto",
            icon: FolderIcon,
            href: (project) => project.url,
          },
        ],
        [{ label: "Excluir projeto", icon: Trash2Icon, onSelect: () => {} }],
      ]}
      user={{ name: "Maria Souza", email: "maria@example.com" }}
      userMenu={[
        [{ label: "Conta", icon: BadgeCheckIcon, href: "#conta" }],
        [{ label: "Sair", icon: LogOutIcon, onSelect: () => {} }],
      ]}
      breadcrumbs={[
        { label: "Início", href: "#inicio" },
        { label: "Visão geral" },
      ]}
    />
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const tela = within(canvasElement)

    // Without `side`, the sidebar opens on the start side: the right edge
    // in RTL, with the content on its left.
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

    // The labels came from `labels`, the Sidebar's ones too; the closed arrow
    // points to the start.
    await expect(tela.getByRole("navigation", { name: "المنصة" })).toBeVisible()
    await expect(
      tela.getByRole("complementary", { name: "الشريط الجانبي" })
    ).toBeVisible()
    await expect(
      pegar(canvasElement, "[data-slot=sidebar-trigger]")
    ).toHaveAccessibleName("تبديل الشريط الجانبي")
    const fechado = tela.getByRole("button", {
      name: "تبديل القائمة الفرعية لـ التقارير",
    })
    await expect(rotacao(fechado)).toBe("180deg")

    // The account menu follows the direction, though it is portaled.
    const menu = await abrirMenu(
      tela.getByRole("button", { name: /^قائمة الحساب/ })
    )
    await expect(menu).toHaveAttribute("dir", "rtl")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <DirectionProvider direction="rtl">
        <DashboardLayout
          brand={{ href: "#inicio" }}
          labels={{
            navMain: "المنصة",
            projects: "المشاريع",
            navSecondary: "روابط ثانوية",
            breadcrumb: "مسار التنقل",
            toggleSubmenu: (title) => `تبديل القائمة الفرعية لـ ${title}`,
            projectOptions: (name) => `مزيد من الخيارات لـ ${name}`,
            moreProjects: "المزيد من المشاريع",
            userMenu: "قائمة الحساب",
            illustrativeBrand: "علامة توضيحية",
            sidebarToggle: "تبديل الشريط الجانبي",
            sidebar: "الشريط الجانبي",
            sidebarDescription: "يعرض الشريط الجانبي على الهاتف.",
          }}
          navMain={[
            {
              title: "الرئيسية",
              url: "#inicio",
              icon: HomeIcon,
              items: [
                { title: "نظرة عامة", url: "#visao-geral", isActive: true },
                { title: "النشاط", url: "#atividade" },
              ],
            },
            {
              title: "التقارير",
              url: "#relatorios",
              icon: ChartColumnIcon,
              items: [
                { title: "المبيعات", url: "#vendas" },
                { title: "المالية", url: "#financeiro" },
              ],
            },
            { title: "الإعدادات", url: "#configuracoes", icon: Settings2Icon },
          ]}
          projects={[
            { name: "هندسة التصميم", url: "#design", icon: FrameIcon },
            { name: "السفر", url: "#viagens", icon: MapIcon },
          ]}
          projectActions={[
            [
              {
                label: "عرض المشروع",
                icon: FolderIcon,
                href: (project) => project.url,
              },
            ],
            [{ label: "حذف المشروع", icon: Trash2Icon, onSelect: () => {} }],
          ]}
          navSecondary={[
            { title: "الدعم", url: "#suporte", icon: LifeBuoyIcon },
          ]}
          user={{ name: "مريم سوزا", email: "maria@example.com" }}
          userMenu={[
            [{ label: "الحساب", icon: BadgeCheckIcon, href: "#conta" }],
            [{ label: "تسجيل الخروج", icon: LogOutIcon, onSelect: () => {} }],
          ]}
          breadcrumbs={[
            { label: "الرئيسية", href: "#inicio" },
            { label: "نظرة عامة" },
          ]}
        />
      </DirectionProvider>
    </div>
  ),
}

export const MarcaEConta: Story = {
  name: "Marca própria e conta",
  play: async ({ canvasElement }) => {
    conferirDesktop()
    await conferirContido(canvasElement)
    const tela = within(canvasElement)

    // The `brand` prop replaces the active brand (name, subtitle, logo), so
    // "Marca ilustrativa" never shows, not even with SESI.
    const marca = tela.getByRole("link", { name: /Portal do Cliente/ })
    await expect(marca).toHaveAttribute("href", "#inicio")
    await expect(within(marca).getByText("Ambiente de testes")).toBeVisible()
    await expect(tela.queryByText("Marca ilustrativa")).toBeNull()

    // The photo is decorative: the name beside it already names the account.
    await waitFor(
      () =>
        expect(
          canvasElement.querySelector("[data-slot=avatar-image]")
        ).toBeInTheDocument(),
      { timeout: 5000 }
    )
    await expect(
      canvasElement.querySelector("[data-slot=avatar-image]")
    ).toHaveAttribute("alt", "")

    // The destructive project action keeps its name and its variant.
    const opcoes = tela.getByRole("button", {
      name: "Mais opções de Engenharia de design",
    })
    const menuProjeto = await abrirMenu(opcoes)
    await expect(
      within(menuProjeto).getByRole("menuitem", { name: "Excluir projeto" })
    ).toHaveAttribute("data-variant", "destructive")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(opcoes).toHaveFocus())

    // The account menu stays open, for axe: a destructive item and a
    // disabled one, which is announced as disabled.
    const conta = tela.getByRole("button", { name: /^Menu da conta/ })
    const menu = await abrirMenu(conta)
    await expect(
      within(menu).getByRole("menuitem", { name: "Sair" })
    ).toHaveAttribute("data-variant", "destructive")
    const desativado = within(menu).getByRole("menuitem", {
      name: "Faturamento",
    })
    await expect(desativado).toHaveAttribute("aria-disabled", "true")
    await expect(desativado).toHaveAttribute("data-disabled")
  },
  render: () => (
    <DashboardLayout
      brand={{
        name: "Portal do Cliente",
        subtitle: "Ambiente de testes",
        href: "#inicio",
        logo: (
          <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7">
            <rect width="32" height="32" rx="8" fill="currentColor" />
          </svg>
        ),
      }}
      navMain={[
        { title: "Início", url: "#inicio", icon: HomeIcon, isActive: true },
        { title: "Caixa de entrada", url: "#caixa", icon: InboxIcon },
        { title: "Configurações", url: "#configuracoes", icon: Settings2Icon },
      ]}
      projects={[
        { name: "Engenharia de design", url: "#design", icon: FrameIcon },
        { name: "Viagens", url: "#viagens", icon: MapIcon },
      ]}
      projectActions={[
        [
          {
            label: "Ver projeto",
            icon: FolderIcon,
            href: (project) => project.url,
          },
        ],
        [
          {
            label: "Excluir projeto",
            icon: Trash2Icon,
            variant: "destructive",
            onSelect: () => {},
          },
        ],
      ]}
      user={{
        name: "Maria Souza",
        email: "maria@example.com",
        avatar:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%234787f0'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23ffffff'/%3E%3Cpath d='M10 60c2-13 11-20 22-20s20 7 22 20z' fill='%23ffffff'/%3E%3C/svg%3E",
      }}
      userMenu={[
        [
          { label: "Conta", icon: BadgeCheckIcon, href: "#conta" },
          {
            label: "Faturamento",
            icon: CreditCardIcon,
            onSelect: () => {},
            disabled: true,
          },
        ],
        [
          {
            label: "Sair",
            icon: LogOutIcon,
            variant: "destructive",
            onSelect: () => {},
          },
        ],
      ]}
      breadcrumbs={[{ label: "Início" }]}
    />
  ),
}
