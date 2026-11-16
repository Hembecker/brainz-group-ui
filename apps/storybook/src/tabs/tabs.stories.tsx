import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { AppWindowIcon, CodeIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

/*
 * One story per section of tabs.mdx, in the order of the shadcn/ui page.
 * The shadcn examples for Line, Vertical, Disabled and Icons only have the
 * tab list. Here each one also has its panels: a tab without a panel has no
 * `aria-controls` and activates nothing, so it is a poor example to copy.
 * Every list has an `aria-label`, because a tablist needs a name.
 *
 * The keyboard tests read the direction from the canvas, so they also pass
 * with the global RTL mode: in RTL the horizontal arrows swap.
 */
const meta = {
  title: "Componentes/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

// Rolagem na barra: o item focado fica inteiro dentro da barra e, do lado em
// que ainda há itens escondidos, a pelo menos 40px da borda (fora do fade).
async function esperarItemForaDoFade(barra: HTMLElement) {
  await waitFor(() => {
    const item = document.activeElement as HTMLElement
    expect(barra).toContainElement(item)
    const b = barra.getBoundingClientRect()
    const i = item.getBoundingClientRect()
    const max = barra.scrollWidth - barra.clientWidth
    const rtl = getComputedStyle(barra).direction === "rtl"
    const escondidoAEsquerda = rtl ? max + barra.scrollLeft : barra.scrollLeft
    const escondidoADireita = max - escondidoAEsquerda
    expect(i.left).toBeGreaterThanOrEqual(
      b.left + (escondidoAEsquerda > 1 ? 39 : -1)
    )
    expect(i.right).toBeLessThanOrEqual(
      b.right - (escondidoADireita > 1 ? 39 : -1)
    )
  })
}

function setaParaAvancar(elemento: HTMLElement) {
  return getComputedStyle(elemento).direction === "rtl"
    ? "{ArrowLeft}"
    : "{ArrowRight}"
}

function teclas(elemento: HTMLElement) {
  const rtl = getComputedStyle(elemento).direction === "rtl"
  return {
    avancar: rtl ? "{ArrowLeft}" : "{ArrowRight}",
    voltar: rtl ? "{ArrowRight}" : "{ArrowLeft}",
  }
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { avancar, voltar } = teclas(canvasElement)
    const visao = await canvas.findByRole("tab", { name: "Visão geral" })
    const analises = await canvas.findByRole("tab", { name: "Análises" })
    const relatorios = await canvas.findByRole("tab", { name: "Relatórios" })
    const ajustes = await canvas.findByRole("tab", { name: "Ajustes" })

    // State exposed: aria-selected, and aria-controls pointing at the panel
    // that is labelled by the tab.
    await expect(visao).toHaveAttribute("aria-selected", "true")
    await expect(analises).toHaveAttribute("aria-selected", "false")
    const painel = canvas.getByRole("tabpanel", { name: "Visão geral" })
    await expect(visao).toHaveAttribute("aria-controls", painel.id)

    // Keyboard: Tab reaches the selected tab (roving tabindex); the arrows
    // move the focus; Enter and Space activate the focused tab.
    await userEvent.tab()
    await expect(visao).toHaveFocus()
    await userEvent.keyboard(avancar)
    await waitFor(() => expect(analises).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(analises).toHaveAttribute("aria-selected", "true")
    await expect(visao).toHaveAttribute("aria-selected", "false")
    await expect(
      canvas.getByRole("tabpanel", { name: "Análises" })
    ).toBeVisible()

    // End and Home go to the ends; Space activates.
    await userEvent.keyboard("{End}")
    await waitFor(() => expect(ajustes).toHaveFocus())
    await userEvent.keyboard(voltar)
    await waitFor(() => expect(relatorios).toHaveFocus())
    await userEvent.keyboard(" ")
    await expect(relatorios).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard("{Home}")
    await waitFor(() => expect(visao).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(visao).toHaveAttribute("aria-selected", "true")
  },
  render: () => (
    <Tabs defaultValue="visao" className="w-full max-w-[400px]">
      <TabsList aria-label="Seções do projeto">
        <TabsTrigger value="visao">Visão geral</TabsTrigger>
        <TabsTrigger value="analises">Análises</TabsTrigger>
        <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
      </TabsList>
      <TabsContent value="visao">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Visão geral</h3>
            </CardTitle>
            <CardDescription>
              Veja os principais indicadores e a atividade recente dos projetos.
              Acompanhe o andamento de todos os projetos ativos.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Você tem 12 projetos ativos e 3 tarefas pendentes.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analises">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Análises</h3>
            </CardTitle>
            <CardDescription>
              Acompanhe o desempenho e o engajamento dos usuários. Observe as
              tendências e encontre oportunidades de crescimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            As visualizações de página subiram 25% em relação ao mês passado.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="relatorios">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Relatórios</h3>
            </CardTitle>
            <CardDescription>
              Gere e baixe seus relatórios detalhados. Exporte os dados em
              vários formatos para analisar.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Você tem 5 relatórios prontos para exportar.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="ajustes">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Ajustes</h3>
            </CardTitle>
            <CardDescription>
              Gerencie as preferências e as opções da conta. Personalize a
              experiência do seu jeito.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure as notificações, a segurança e os temas.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const Linha: Story = {
  name: "Linha",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { avancar } = teclas(canvasElement)
    const visao = await canvas.findByRole("tab", { name: "Visão geral" })
    const analises = await canvas.findByRole("tab", { name: "Análises" })
    await expect(visao.closest("[data-slot=tabs-list]")).toHaveAttribute(
      "data-variant",
      "line"
    )
    await userEvent.tab()
    await expect(visao).toHaveFocus()
    await userEvent.keyboard(avancar)
    await waitFor(() => expect(analises).toHaveFocus())
    await userEvent.keyboard(" ")
    await expect(analises).toHaveAttribute("aria-selected", "true")
  },
  render: () => (
    <Tabs defaultValue="visao">
      <TabsList variant="line" aria-label="Seções do projeto">
        <TabsTrigger value="visao">Visão geral</TabsTrigger>
        <TabsTrigger value="analises">Análises</TabsTrigger>
        <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
      </TabsList>
      <TabsContent value="visao" className="p-2">
        Os principais indicadores do projeto.
      </TabsContent>
      <TabsContent value="analises" className="p-2">
        Desempenho e engajamento dos usuários.
      </TabsContent>
      <TabsContent value="relatorios" className="p-2">
        Relatórios prontos para exportar.
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const conta = await canvas.findByRole("tab", { name: "Conta" })
    const senha = await canvas.findByRole("tab", { name: "Senha" })
    const notificacoes = await canvas.findByRole("tab", {
      name: "Notificações",
    })

    // The tablist exposes the orientation; the vertical keys (up and down)
    // do not change with the direction.
    await expect(conta.closest("[role=tablist]")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    )
    await userEvent.tab()
    await expect(conta).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() => expect(senha).toHaveFocus())
    await userEvent.keyboard("{End}")
    await waitFor(() => expect(notificacoes).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(notificacoes).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard("{ArrowUp}")
    await waitFor(() => expect(senha).toHaveFocus())
  },
  render: () => (
    <Tabs defaultValue="conta" orientation="vertical">
      <TabsList aria-label="Configurações da conta">
        <TabsTrigger value="conta">Conta</TabsTrigger>
        <TabsTrigger value="senha">Senha</TabsTrigger>
        <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
      </TabsList>
      <TabsContent value="conta" className="p-2">
        Altere os dados da sua conta aqui.
      </TabsContent>
      <TabsContent value="senha" className="p-2">
        Troque a sua senha aqui.
      </TabsContent>
      <TabsContent value="notificacoes" className="p-2">
        Escolha como receber os avisos.
      </TabsContent>
    </Tabs>
  ),
}

export const Desabilitado: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { avancar } = teclas(canvasElement)
    const inicio = await canvas.findByRole("tab", { name: "Início" })
    const desabilitada = await canvas.findByRole("tab", {
      name: "Desabilitado",
    })
    const ajuda = await canvas.findByRole("tab", { name: "Ajuda" })

    // The disabled tab is exposed by aria-disabled and a click does not select it.
    await expect(desabilitada).toHaveAttribute("aria-disabled", "true")
    await expect(desabilitada).toHaveAttribute("data-disabled")
    await userEvent.click(desabilitada, { pointerEventsCheck: 0 })
    await expect(desabilitada).toHaveAttribute("aria-selected", "false")
    await expect(inicio).toHaveAttribute("aria-selected", "true")

    // Base UI keeps it focusable (aria-disabled, not `disabled`), so the
    // arrow key lands on it; Enter does not select it, and the next arrow
    // goes on to "Ajuda".
    await userEvent.tab()
    await expect(inicio).toHaveFocus()
    await userEvent.keyboard(avancar)
    await waitFor(() => expect(desabilitada).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(desabilitada).toHaveAttribute("aria-selected", "false")
    await expect(inicio).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard(avancar)
    await waitFor(() => expect(ajuda).toHaveFocus())
  },
  render: () => (
    <Tabs defaultValue="inicio">
      <TabsList aria-label="Seções">
        <TabsTrigger value="inicio">Início</TabsTrigger>
        <TabsTrigger value="ajustes" disabled>
          Desabilitado
        </TabsTrigger>
        <TabsTrigger value="ajuda">Ajuda</TabsTrigger>
      </TabsList>
      <TabsContent value="inicio" className="p-2">
        Bem-vindo de volta.
      </TabsContent>
      <TabsContent value="ajustes" className="p-2">
        Esta aba não está disponível.
      </TabsContent>
      <TabsContent value="ajuda" className="p-2">
        Central de ajuda.
      </TabsContent>
    </Tabs>
  ),
}

export const Icones: Story = {
  name: "Ícones",
  render: () => (
    <Tabs defaultValue="visualizar">
      <TabsList aria-label="Modo de exibição">
        <TabsTrigger value="visualizar">
          <AppWindowIcon aria-hidden="true" />
          Visualizar
        </TabsTrigger>
        <TabsTrigger value="codigo">
          <CodeIcon aria-hidden="true" />
          Código
        </TabsTrigger>
      </TabsList>
      <TabsContent value="visualizar" className="p-2">
        A visualização do componente.
      </TabsContent>
      <TabsContent value="codigo" className="p-2">
        O código do componente.
      </TabsContent>
    </Tabs>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const visao = await canvas.findByRole("tab", { name: "نظرة عامة" })
    const analises = await canvas.findByRole("tab", { name: "التحليلات" })
    const ajustes = await canvas.findByRole("tab", { name: "الإعدادات" })

    // In RTL the arrows swap: ArrowLeft goes to the next tab (visually to
    // the left, where the next one is), ArrowRight to the previous.
    await userEvent.tab()
    await expect(visao).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(analises).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(analises).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(visao).toHaveFocus())
    await userEvent.keyboard("{End}")
    await waitFor(() => expect(ajustes).toHaveFocus())
    await userEvent.keyboard(" ")
    await expect(ajustes).toHaveAttribute("aria-selected", "true")
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Tabs defaultValue="overview" className="w-full max-w-sm">
          <TabsList aria-label="أقسام المشروع">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>نظرة عامة</h3>
                </CardTitle>
                <CardDescription>
                  عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر
                  جميع مشاريعك النشطة.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>التحليلات</h3>
                </CardTitle>
                <CardDescription>
                  تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص
                  النمو.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>التقارير</h3>
                </CardTitle>
                <CardDescription>
                  إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة
                  للتحليل.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                لديك ٥ تقارير جاهزة ومتاحة للتصدير.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>الإعدادات</h3>
                </CardTitle>
                <CardDescription>
                  إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                تكوين الإشعارات والأمان والسمات.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DirectionProvider>
  ),
}

export const RolagemNaBarra: Story = {
  name: "Rolagem na barra",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const barra = canvas.getByRole("tablist")
    // A barra precisa rolar de verdade, senão o teste não confere nada.
    expect(barra.scrollWidth).toBeGreaterThan(barra.clientWidth)
    const itens = canvas.getAllByRole("tab")
    itens[0]!.focus()
    for (const item of itens.slice(1)) {
      await userEvent.keyboard(setaParaAvancar(barra))
      await waitFor(() => expect(item).toHaveFocus())
      await esperarItemForaDoFade(barra)
    }
    expect(Math.abs(barra.scrollLeft)).toBeGreaterThan(0)
  },
  render: () => (
    <Tabs defaultValue="visao" className="w-full max-w-[240px]">
      <TabsList aria-label="Seções do projeto">
        <TabsTrigger value="visao">Visão geral</TabsTrigger>
        <TabsTrigger value="analises">Análises</TabsTrigger>
        <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        <TabsTrigger value="equipe">Equipe</TabsTrigger>
        <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
      </TabsList>
      <TabsContent value="visao" className="p-2">
        Os principais indicadores do projeto.
      </TabsContent>
      <TabsContent value="analises" className="p-2">
        O desempenho e o engajamento dos usuários.
      </TabsContent>
      <TabsContent value="relatorios" className="p-2">
        Os relatórios gerados neste mês.
      </TabsContent>
      <TabsContent value="equipe" className="p-2">
        As pessoas que participam do projeto.
      </TabsContent>
      <TabsContent value="ajustes" className="p-2">
        As preferências do projeto.
      </TabsContent>
    </Tabs>
  ),
}
