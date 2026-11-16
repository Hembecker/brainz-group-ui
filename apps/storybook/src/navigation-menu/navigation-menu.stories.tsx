import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"

/*
 * One story per section of navigation-menu.mdx, in the order of the shadcn/ui
 * page. The shadcn examples use next/link and a `ListItem` helper: here every
 * link is a literal `<a>` passed through `render`, so "Show code" gives a
 * snippet that can be pasted as is.
 *
 * A closed menu is invisible to axe, so the stories with panels have a `play`
 * that opens one. It uses the keyboard only (Tab, then Enter): the menu also
 * opens on hover, and a pointer resting on the trigger would reopen it after
 * Esc. `abrirPainel` waits for the link to be found by role and name, for
 * the enter animation to end (axe would measure contrast mid-fade) and for
 * it to be visible. The panel is portaled to <body>, so it is queried with
 * `screen`, not with the story canvas.
 *
 * With a panel open, the Base UI trigger and viewport render four internal
 * focus guards (`<span aria-hidden="true" tabindex="0" data-base-ui-focus-guard>`)
 * that axe reports as `aria-hidden-focus`. They are part of the library's
 * focus handling (the focus is redirected as soon as one receives it) and
 * cannot be changed from here, so axe leaves just those spans out of the
 * scan (`a11y.context.exclude`, set for every story in `.storybook/preview.tsx`).
 * The rule itself stays on for everything else.
 */
const meta = {
  title: "Componentes/Navigation Menu",
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>

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

async function abrirPainel(link: RegExp) {
  await userEvent.keyboard("{Enter}")
  const item = await screen.findByRole("link", { name: link })
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(item).toBeVisible())
  return item
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rtl = document.documentElement.dir === "rtl"
    const proxima = rtl ? "{ArrowLeft}" : "{ArrowRight}"
    const anterior = rtl ? "{ArrowRight}" : "{ArrowLeft}"

    // The trigger is a <button> and the plain link is an <a>.
    const primeiro = await canvas.findByRole("button", {
      name: "Primeiros passos",
    })
    await expect(
      await canvas.findByRole("link", { name: "Documentação" })
    ).toHaveAttribute("href")

    // Tab enters the menu on the first trigger.
    await userEvent.tab()
    await waitFor(() => expect(primeiro).toHaveFocus())

    // The arrows move along the bar, and the opposite arrow comes back.
    await userEvent.keyboard(proxima)
    await waitFor(() => expect(primeiro).not.toHaveFocus())
    await expect(
      within(canvasElement.querySelector("nav")!).getAllByRole("button")
    ).toContain(document.activeElement)
    await userEvent.keyboard(anterior)
    await waitFor(() => expect(primeiro).toHaveFocus())

    // Enter opens the panel, and Esc closes it and keeps the focus on the
    // trigger.
    await abrirPainel(/Introdução/)
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: /Introdução/ })).toBeNull()
    )
    await waitFor(() => expect(primeiro).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirPainel(/Introdução/)

    // With the panel open, Tab goes to its first link and the arrows move
    // between the links of the panel.
    await userEvent.keyboard("{Tab}")
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Introdução/ })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Instalação/ })).toHaveFocus()
    )
  },
  render: () => (
    <NavigationMenu aria-label="Principal">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Primeiros passos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">Introdução</div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Componentes reutilizáveis feitos com Tailwind CSS.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">Instalação</div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Como instalar as dependências e organizar o seu app.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">Tipografia</div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Estilos para títulos, parágrafos, listas e mais.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Componentes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">
                      Diálogo de alerta
                    </div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Um diálogo modal que interrompe o usuário com um conteúdo
                      importante e espera uma resposta.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">
                      Cartão de passar o mouse
                    </div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Para quem enxerga, uma prévia do conteúdo que está atrás
                      de um link.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">Progresso</div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Mostra o andamento de uma tarefa, em geral como uma barra
                      de progresso.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">
                      Área de rolagem
                    </div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Separa o conteúdo de forma visual ou semântica.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">Abas</div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Seções de conteúdo em camadas, mostradas uma de cada vez.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#" />}>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">Dica</div>
                    <div className="line-clamp-2 text-muted-foreground">
                      Um balão com informações sobre um elemento quando ele
                      recebe o foco ou o mouse passa por cima.
                    </div>
                  </div>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Com ícone</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px]">
              <li>
                <NavigationMenuLink
                  render={
                    <a href="#" className="flex-row items-center gap-2" />
                  }
                >
                  <CircleAlertIcon aria-hidden="true" />
                  Backlog
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  render={
                    <a href="#" className="flex-row items-center gap-2" />
                  }
                >
                  <CircleDashedIcon aria-hidden="true" />A fazer
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  render={
                    <a href="#" className="flex-row items-center gap-2" />
                  }
                >
                  <CircleCheckIcon aria-hidden="true" />
                  Concluído
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Documentação
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const ComponenteDeLink: Story = {
  name: "Componente de link",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The link of the current page (`active`) is announced as the current
    // page and gets the solid `muted` background, without focus or hover
    // (`focus:bg-muted` would hide a missing `data-active` style).
    const atual = await canvas.findByRole("link", { name: "Documentação" })
    await expect(atual).toHaveAttribute("aria-current", "page")
    await expect(atual).toHaveAttribute("data-active")
    await expect(
      canvas.getByRole("link", { name: "Blocos" })
    ).not.toHaveAttribute("aria-current")

    const referencia = document.createElement("div")
    referencia.style.backgroundColor = "var(--muted)"
    canvasElement.append(referencia)
    const muted = getComputedStyle(referencia).backgroundColor
    referencia.remove()
    await waitFor(() =>
      expect(getComputedStyle(atual).backgroundColor).toBe(muted)
    )
  },
  render: () => (
    <NavigationMenu aria-label="Link do roteador">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            active
            className={navigationMenuTriggerStyle()}
          >
            Documentação
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Blocos
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async () => {
    await userEvent.tab()
    await abrirPainel(/مقدمة/)
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <NavigationMenu dir="rtl" align="end" aria-label="القائمة الرئيسية">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
            <NavigationMenuContent dir="rtl" lang="ar">
              <ul className="w-96">
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">مقدمة</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind
                        CSS.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">التثبيت</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        كيفية تثبيت التبعيات وتنظيم تطبيقك.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">الطباعة</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        أنماط للعناوين والفقرات والقوائم...إلخ
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:flex">
            <NavigationMenuTrigger>المكونات</NavigationMenuTrigger>
            <NavigationMenuContent dir="rtl" lang="ar">
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">
                        حوار التنبيه
                      </div>
                      <div className="line-clamp-2 text-muted-foreground">
                        حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">
                        بطاقة التحويم
                      </div>
                      <div className="line-clamp-2 text-muted-foreground">
                        للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">التقدم</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط
                        تقدم.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">
                        منطقة التمرير
                      </div>
                      <div className="line-clamp-2 text-muted-foreground">
                        يفصل المحتوى بصريًا أو دلاليًا.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">التبويبات</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح
                        التبويب—التي يتم عرضها واحدة في كل مرة.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<a href="#" />}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="leading-none font-medium">تلميح</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى
                        العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس
                        فوقه.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>مع أيقونة</NavigationMenuTrigger>
            <NavigationMenuContent dir="rtl" lang="ar">
              <ul className="grid w-[200px]">
                <li>
                  <NavigationMenuLink
                    render={
                      <a href="#" className="flex-row items-center gap-2" />
                    }
                  >
                    <CircleAlertIcon aria-hidden="true" />
                    قائمة الانتظار
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    render={
                      <a href="#" className="flex-row items-center gap-2" />
                    }
                  >
                    <CircleDashedIcon aria-hidden="true" />
                    المهام
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    render={
                      <a href="#" className="flex-row items-center gap-2" />
                    }
                  >
                    <CircleCheckIcon aria-hidden="true" />
                    منجز
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<a href="#" />}
              className={navigationMenuTriggerStyle()}
            >
              الوثائق
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
}

export const RolagemNaBarra: Story = {
  name: "Rolagem na barra",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const barra = canvas.getByRole("list")
    // A barra precisa rolar de verdade, senão o teste não confere nada.
    expect(barra.scrollWidth).toBeGreaterThan(barra.clientWidth)
    const itens = canvas.getAllByRole("link")
    itens[0]!.focus()
    for (const item of itens.slice(1)) {
      // Tab, e não as setas: as setas do Base UI já rolam o item; o Tab
      // depende do onFocus da lista (o focus() não rola um item que aparece em parte).
      await userEvent.tab()
      await waitFor(() => expect(item).toHaveFocus())
      await esperarItemForaDoFade(barra)
    }
    expect(Math.abs(barra.scrollLeft)).toBeGreaterThan(0)
  },
  render: () => (
    <NavigationMenu aria-label="Principal" className="w-full max-w-[220px]">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Início
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Produtos
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Preços
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#" />}
            className={navigationMenuTriggerStyle()}
          >
            Contato
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
