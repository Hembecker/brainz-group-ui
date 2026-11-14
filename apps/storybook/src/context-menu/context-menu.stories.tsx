import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  expect,
  fireEvent,
  screen,
  userEvent,
  waitFor,
  within,
} from "storybook/test"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClipboardPasteIcon,
  CopyIcon,
  PencilIcon,
  RotateCwIcon,
  ScissorsIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu"
import { DirectionProvider } from "@workspace/ui/components/direction"

/*
 * One story per section of context-menu.mdx, in the order of the shadcn/ui
 * page. The shadcn examples keep the radios in React state; here each story is
 * literal JSX without constants, so they are uncontrolled (`defaultValue`).
 *
 * The shadcn trigger is an unfocusable <div>, so the menu only opens with the
 * mouse or a long press. Every trigger here has `tabIndex={0}`, `role="group"`
 * and an `aria-label`, so the keyboard reaches it and Shift+F10 (or the menu
 * key) opens the menu: the browser answers those keys with a `contextmenu`
 * event on the focused element, which is what Base UI listens to.
 *
 * A closed menu is invisible to axe, so every story has a `play` that opens it
 * first (the test runs axe after `play`). The menu is portaled to <body>, so it
 * is queried with `screen`. `abrirMenuDeContexto` right-clicks the trigger,
 * waits for the menu (named by the `aria-label` on the content) and for the
 * enter animation to end (axe would measure contrast mid-fade).
 */
const meta = {
  title: "Componentes/Context Menu",
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>

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

async function abrirMenuDeContexto(
  canvasElement: HTMLElement,
  area: string,
  menu: string
) {
  const gatilho = await within(canvasElement).findByRole("group", {
    name: area,
  })
  // Right-clicks near the start edge of the area, so there is room on the end
  // side for the menu and its submenu in a narrow viewport (the menu would
  // flip to the other side otherwise).
  const caixa = gatilho.getBoundingClientRect()
  await userEvent.pointer({
    keys: "[MouseRight]",
    target: gatilho,
    coords: {
      clientX:
        document.documentElement.dir === "rtl"
          ? caixa.right - 8
          : caixa.left + 8,
      clientY: caixa.top + caixa.height / 2,
    },
  })
  const popup = await screen.findByRole("menu", { name: menu })
  await esperarAnimacoes()
  await waitFor(() => expect(popup).toBeVisible())
  return popup
}

async function abrirSubmenu(nome: string) {
  await userEvent.click(await screen.findByRole("menuitem", { name: nome }))
  const submenu = await screen.findByRole("menu", { name: nome })
  await esperarAnimacoes()
  await waitFor(() => expect(submenu).toBeVisible())
  return submenu
}

// The submenu opens on the logical end side: to the right in LTR and to the
// left in RTL (the tolerance covers the offset and the rounded border).
async function conferirLadoDoSubmenu(
  menu: HTMLElement,
  submenu: HTMLElement,
  dir: string
) {
  const a = menu.getBoundingClientRect()
  const b = submenu.getBoundingClientRect()
  if (dir === "rtl") {
    await expect(b.right).toBeLessThanOrEqual(a.left + 8)
  } else {
    await expect(b.left).toBeGreaterThanOrEqual(a.right - 8)
  }
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const gatilho = await within(canvasElement).findByRole("group", {
      name: "Área de exemplo, Shift+F10 abre o menu",
    })
    const dir = document.documentElement.dir
    const abreSubmenu = dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}"
    const fechaSubmenu = dir === "rtl" ? "{ArrowRight}" : "{ArrowLeft}"

    // The keyboard reaches the trigger (Tab) and a `contextmenu` event on the
    // focused element, what Shift+F10 and the menu key make the browser send,
    // opens the menu. The test sends the event because the synthetic
    // `userEvent` of `storybook/test` does not produce the native one.
    await userEvent.tab()
    await waitFor(() => expect(gatilho).toHaveFocus())
    const caixa = gatilho.getBoundingClientRect()
    fireEvent.contextMenu(gatilho, {
      clientX: caixa.left + caixa.width / 2,
      clientY: caixa.top + caixa.height / 2,
    })
    const menu = await screen.findByRole("menu", { name: "Ações da página" })
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())

    // The arrows move the highlight (ArrowDown enters the menu on the first
    // enabled item); End and Home go to the last and the first item.
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Voltar/ })).toHaveFocus()
    )
    // A disabled item (aria-disabled) stays reachable by the arrows, so a
    // screen reader user finds it and hears that it is unavailable.
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Avançar/ })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Recarregar/ })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Voltar/ })).toHaveFocus()
    )
    await userEvent.keyboard("{End}")
    await waitFor(() =>
      expect(
        screen.getByRole("menuitemradio", { name: "Colm Tuite" })
      ).toHaveFocus()
    )
    await userEvent.keyboard("{Home}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Voltar/ })).toHaveFocus()
    )

    // The submenu opens with the arrow of the end side, on that side, and the
    // opposite arrow closes it.
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}")
    const ferramentas = screen.getByRole("menuitem", {
      name: "Mais ferramentas",
    })
    await waitFor(() => expect(ferramentas).toHaveFocus())
    await userEvent.keyboard(abreSubmenu)
    const submenu = await screen.findByRole("menu", {
      name: "Mais ferramentas",
    })
    await esperarAnimacoes()
    await conferirLadoDoSubmenu(menu, submenu, dir)
    await userEvent.keyboard(fechaSubmenu)
    await waitFor(() =>
      expect(screen.queryByRole("menu", { name: "Mais ferramentas" })).toBeNull()
    )
    await waitFor(() => expect(ferramentas).toHaveFocus())

    // Esc closes the menu and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again with the right button, with the submenu, and stays open for
    // axe.
    await userEvent.pointer({ keys: "[MouseRight]", target: gatilho })
    await screen.findByRole("menu", { name: "Ações da página" })
    await esperarAnimacoes()
    await abrirSubmenu("Mais ferramentas")
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área de exemplo, Shift+F10 abre o menu"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52" aria-label="Ações da página">
        <ContextMenuGroup>
          <ContextMenuItem>
            Voltar
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Avançar
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Recarregar
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Mais ferramentas</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuGroup>
                <ContextMenuItem>Salvar página...</ContextMenuItem>
                <ContextMenuItem>Criar atalho...</ContextMenuItem>
                <ContextMenuItem>Nomear janela...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Ferramentas do desenvolvedor</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Excluir</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Mostrar favoritos
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Mostrar URLs completas</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Pessoas</ContextMenuLabel>
          <ContextMenuRadioGroup defaultValue="pedro">
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Basico: Story = {
  name: "Básico",
  play: async ({ canvasElement }) => {
    await abrirMenuDeContexto(canvasElement, "Área com menu", "Ações")
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com menu"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Ações">
        <ContextMenuGroup>
          <ContextMenuItem>Voltar</ContextMenuItem>
          <ContextMenuItem disabled>Avançar</ContextMenuItem>
          <ContextMenuItem>Recarregar</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Submenu: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenuDeContexto(
      canvasElement,
      "Área com submenu",
      "Edição"
    )
    const submenu = await abrirSubmenu("Mais ferramentas")
    await conferirLadoDoSubmenu(menu, submenu, document.documentElement.dir)
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com submenu"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Edição">
        <ContextMenuGroup>
          <ContextMenuItem>
            Copiar
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Recortar
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Mais ferramentas</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuGroup>
              <ContextMenuItem>Salvar página...</ContextMenuItem>
              <ContextMenuItem>Criar atalho...</ContextMenuItem>
              <ContextMenuItem>Nomear janela...</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem>Ferramentas do desenvolvedor</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">Excluir</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Atalhos: Story = {
  play: async ({ canvasElement }) => {
    await abrirMenuDeContexto(
      canvasElement,
      "Área com atalhos",
      "Navegação e arquivo"
    )
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com atalhos"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Navegação e arquivo">
        <ContextMenuGroup>
          <ContextMenuItem>
            Voltar
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Avançar
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Recarregar
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Salvar
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Salvar como...
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Grupos: Story = {
  play: async ({ canvasElement }) => {
    await abrirMenuDeContexto(canvasElement, "Área com grupos", "Comandos")
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com grupos"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Comandos">
        <ContextMenuGroup>
          <ContextMenuLabel>Arquivo</ContextMenuLabel>
          <ContextMenuItem>
            Novo arquivo
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Abrir arquivo
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Salvar
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Editar</ContextMenuLabel>
          <ContextMenuItem>
            Desfazer
            <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Refazer
            <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Recortar
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Copiar
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Colar
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            Excluir
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Icones: Story = {
  name: "Ícones",
  play: async ({ canvasElement }) => {
    await abrirMenuDeContexto(canvasElement, "Área com ícones", "Edição")
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com ícones"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Edição">
        <ContextMenuGroup>
          <ContextMenuItem>
            <CopyIcon aria-hidden="true" />
            Copiar
          </ContextMenuItem>
          <ContextMenuItem>
            <ScissorsIcon aria-hidden="true" />
            Recortar
          </ContextMenuItem>
          <ContextMenuItem>
            <ClipboardPasteIcon aria-hidden="true" />
            Colar
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <TrashIcon aria-hidden="true" />
            Excluir
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const CaixasDeSelecao: Story = {
  name: "Caixas de seleção",
  play: async ({ canvasElement }) => {
    const menu = await abrirMenuDeContexto(
      canvasElement,
      "Área com caixas de seleção",
      "Exibição"
    )
    const url = within(menu).getByRole("menuitemcheckbox", {
      name: "Mostrar URLs completas",
    })
    await expect(url).not.toBeChecked()
    await userEvent.click(url)
    await waitFor(() => expect(url).toBeChecked())
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com caixas de seleção"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Exibição">
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Mostrar barra de favoritos
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Mostrar URLs completas</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem defaultChecked>
            Mostrar ferramentas do desenvolvedor
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Radio: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenuDeContexto(
      canvasElement,
      "Área com opções",
      "Preferências"
    )
    await expect(
      within(menu).getByRole("menuitemradio", { name: "Pedro Duarte" })
    ).toBeChecked()
    await expect(
      within(menu).getByRole("menuitemradio", { name: "Claro" })
    ).toBeChecked()
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com opções"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Preferências">
        <ContextMenuGroup>
          <ContextMenuLabel>Pessoas</ContextMenuLabel>
          <ContextMenuRadioGroup defaultValue="pedro">
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Tema</ContextMenuLabel>
          <ContextMenuRadioGroup defaultValue="light">
            <ContextMenuRadioItem value="light">Claro</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Escuro</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">Sistema</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Destrutivo: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenuDeContexto(
      canvasElement,
      "Área com ação destrutiva",
      "Ações"
    )
    // Highlights the destructive item (the highlighted state is what needs
    // the contrast check) and leaves it highlighted for axe.
    const excluir = within(menu).getByRole("menuitem", { name: "Excluir" })
    excluir.focus()
    await waitFor(() => expect(excluir).toHaveFocus())
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        role="group"
        aria-label="Área com ação destrutiva"
        className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
      >
        <span className="hidden pointer-fine:inline-block">
          Clique com o botão direito aqui
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Pressione e segure aqui
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Ações">
        <ContextMenuGroup>
          <ContextMenuItem>
            <PencilIcon aria-hidden="true" />
            Editar
          </ContextMenuItem>
          <ContextMenuItem>
            <ShareIcon aria-hidden="true" />
            Compartilhar
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <TrashIcon aria-hidden="true" />
            Excluir
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Lados: Story = {
  play: async ({ canvasElement }) => {
    // Opens the one on top and checks it is above the trigger.
    const gatilho = await within(canvasElement).findByRole("group", {
      name: "Menu para cima",
    })
    const menu = await abrirMenuDeContexto(
      canvasElement,
      "Menu para cima",
      "Ações para cima"
    )
    await expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      gatilho.getBoundingClientRect().bottom
    )
  },
  render: () => (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4">
      <ContextMenu>
        <ContextMenuTrigger
          tabIndex={0}
          role="group"
          aria-label="Menu para cima"
          className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
        >
          <span className="hidden pointer-fine:inline-block">
            Botão direito (cima)
          </span>
          <span className="hidden pointer-coarse:inline-block">
            Toque longo (cima)
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent side="top" aria-label="Ações para cima">
          <ContextMenuGroup>
            <ContextMenuItem>Voltar</ContextMenuItem>
            <ContextMenuItem>Avançar</ContextMenuItem>
            <ContextMenuItem>Recarregar</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          tabIndex={0}
          role="group"
          aria-label="Menu para a direita"
          className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
        >
          <span className="hidden pointer-fine:inline-block">
            Botão direito (direita)
          </span>
          <span className="hidden pointer-coarse:inline-block">
            Toque longo (direita)
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent side="right" aria-label="Ações para a direita">
          <ContextMenuGroup>
            <ContextMenuItem>Voltar</ContextMenuItem>
            <ContextMenuItem>Avançar</ContextMenuItem>
            <ContextMenuItem>Recarregar</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          tabIndex={0}
          role="group"
          aria-label="Menu para baixo"
          className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
        >
          <span className="hidden pointer-fine:inline-block">
            Botão direito (baixo)
          </span>
          <span className="hidden pointer-coarse:inline-block">
            Toque longo (baixo)
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent side="bottom" aria-label="Ações para baixo">
          <ContextMenuGroup>
            <ContextMenuItem>Voltar</ContextMenuItem>
            <ContextMenuItem>Avançar</ContextMenuItem>
            <ContextMenuItem>Recarregar</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          tabIndex={0}
          role="group"
          aria-label="Menu para a esquerda"
          className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
        >
          <span className="hidden pointer-fine:inline-block">
            Botão direito (esquerda)
          </span>
          <span className="hidden pointer-coarse:inline-block">
            Toque longo (esquerda)
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent side="left" aria-label="Ações para a esquerda">
          <ContextMenuGroup>
            <ContextMenuItem>Voltar</ContextMenuItem>
            <ContextMenuItem>Avançar</ContextMenuItem>
            <ContextMenuItem>Recarregar</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const gatilho = await within(canvasElement).findByRole("group", {
      name: "منطقة بها قائمة",
    })

    // The menu opens at the pointer, ArrowDown highlights "التنقل" (the first
    // submenu trigger) and ArrowLeft, the arrow of the end side in RTL, opens
    // the submenu on the left of the menu.
    // Right-click near the start edge of the area (right, in RTL), so there
    // is room on the left for the menu and the submenu in a narrow viewport.
    const caixa = gatilho.getBoundingClientRect()
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: gatilho,
      coords: { clientX: caixa.right - 8, clientY: caixa.top + caixa.height / 2 },
    })
    const menu = await screen.findByRole("menu", { name: "إجراءات" })
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "التنقل" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowLeft}")
    const submenu = await screen.findByRole("menu", { name: "التنقل" })
    await esperarAnimacoes()
    await waitFor(() => expect(submenu).toBeVisible())
    await conferirLadoDoSubmenu(menu, submenu, "rtl")
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <ContextMenu>
          <ContextMenuTrigger
            tabIndex={0}
            role="group"
            aria-label="منطقة بها قائمة"
            className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
          >
            <span className="hidden pointer-fine:inline-block">
              انقر بزر الماوس الأيمن هنا
            </span>
            <span className="hidden pointer-coarse:inline-block">
              اضغط مطولاً هنا
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent
            className="w-44"
            dir="rtl"
            lang="ar"
            aria-label="إجراءات"
          >
            <ContextMenuGroup>
              <ContextMenuSub>
                <ContextMenuSubTrigger>التنقل</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-40" dir="rtl" lang="ar">
                  <ContextMenuGroup>
                    <ContextMenuItem>
                      <ArrowLeftIcon
                        aria-hidden="true"
                        className="rtl:rotate-180"
                      />
                      رجوع
                      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem disabled>
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="rtl:rotate-180"
                      />
                      تقدم
                      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <RotateCwIcon aria-hidden="true" />
                      إعادة تحميل
                      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSub>
                <ContextMenuSubTrigger>المزيد من الأدوات</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-40" dir="rtl" lang="ar">
                  <ContextMenuGroup>
                    <ContextMenuItem>حفظ الصفحة...</ContextMenuItem>
                    <ContextMenuItem>إنشاء اختصار...</ContextMenuItem>
                    <ContextMenuItem>تسمية النافذة...</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem>أدوات المطور</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem variant="destructive">حذف</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuCheckboxItem defaultChecked>
                إظهار الإشارات المرجعية
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem>
                إظهار عناوين URL الكاملة
              </ContextMenuCheckboxItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuLabel>الأشخاص</ContextMenuLabel>
              <ContextMenuRadioGroup defaultValue="pedro">
                <ContextMenuRadioItem value="pedro">
                  Pedro Duarte
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </DirectionProvider>
  ),
}
