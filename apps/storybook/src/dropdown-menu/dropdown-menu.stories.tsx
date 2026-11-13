import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  BadgeCheckIcon,
  BellIcon,
  Building2Icon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderSearchIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LanguagesIcon,
  LayoutIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  MonitorIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  PencilIcon,
  SaveIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

/*
 * One story per section of dropdown-menu.mdx, in the order of the shadcn/ui
 * page. The shadcn examples keep the checkboxes and the radios in React state;
 * here each story is literal JSX without constants, so they are uncontrolled
 * (`defaultChecked`, `defaultValue`).
 *
 * A closed menu is invisible to axe, so every story has a `play` that opens it
 * first (the test runs axe after `play`). The menu is portaled to <body>, so
 * it is queried with `screen`, not with the story canvas. `abrirMenu` waits
 * for the menu to be found by role and name, and for the enter animation to
 * end (axe would measure contrast mid-fade). `abrirSubmenu` does the same for
 * a submenu, so axe sees the nested levels open.
 */
const meta = {
  title: "Componentes/Dropdown Menu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
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
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", { name: "Abrir" })
    const dir = document.documentElement.dir
    const abreSubmenu = dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}"
    const fechaSubmenu = dir === "rtl" ? "{ArrowRight}" : "{ArrowLeft}"

    // Opens with the keyboard: Enter on the trigger puts the focus on the
    // first item.
    gatilho.focus()
    await userEvent.keyboard("{Enter}")
    const menu = await screen.findByRole("menu", { name: "Abrir" })
    await esperarAnimacoes()
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Perfil/ })).toHaveFocus()
    )

    // The arrows move the highlight; End and Home go to the last and the
    // first item.
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Cobrança/ })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowUp}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Perfil/ })).toHaveFocus()
    )
    await userEvent.keyboard("{End}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Sair/ })).toHaveFocus()
    )
    await userEvent.keyboard("{Home}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /^Perfil/ })).toHaveFocus()
    )

    // The submenu opens with the arrow of the end side (right in LTR, left in
    // RTL), on that side, and the opposite arrow closes it.
    for (let i = 0; i < 4; i++) await userEvent.keyboard("{ArrowDown}")
    const convidar = screen.getByRole("menuitem", { name: "Convidar usuários" })
    await waitFor(() => expect(convidar).toHaveFocus())
    await userEvent.keyboard(abreSubmenu)
    const submenu = await screen.findByRole("menu", {
      name: "Convidar usuários",
    })
    await esperarAnimacoes()
    await conferirLadoDoSubmenu(menu, submenu, dir)
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "E-mail" })).toHaveFocus()
    )
    await userEvent.keyboard(fechaSubmenu)
    await waitFor(() =>
      expect(screen.queryByRole("menu", { name: "Convidar usuários" })).toBeNull()
    )
    await waitFor(() => expect(convidar).toHaveFocus())

    // Esc closes the menu and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again, with the submenu, and stays open for axe.
    await abrirMenu(canvasElement, "Abrir")
    await abrirSubmenu("Convidar usuários")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuItem>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Cobrança
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Equipe</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Convidar usuários</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>E-mail</DropdownMenuItem>
                <DropdownMenuItem>Mensagem</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mais...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            Nova equipe
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Suporte</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Sair
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Basico: Story = {
  name: "Básico",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Abrir")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Cobrança</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Suporte</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Submenu: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Abrir")
    const convidar = await abrirSubmenu("Convidar usuários")
    await conferirLadoDoSubmenu(menu, convidar, document.documentElement.dir)
    await abrirSubmenu("Mais opções")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>Equipe</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Convidar usuários</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>E-mail</DropdownMenuItem>
                <DropdownMenuItem>Mensagem</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Mais opções</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Agenda</DropdownMenuItem>
                      <DropdownMenuItem>Slack</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Webhook</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Avançado...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            Nova equipe
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Atalhos: Story = {
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Abrir")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuItem>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Cobrança
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Sair
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Icones: Story = {
  name: "Ícones",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Abrir")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon aria-hidden="true" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon aria-hidden="true" />
          Cobrança
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon aria-hidden="true" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon aria-hidden="true" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const CaixasDeSelecao: Story = {
  name: "Caixas de seleção",
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Abrir")
    const barra = within(menu).getByRole("menuitemcheckbox", {
      name: "Barra de status",
    })
    await expect(barra).toBeChecked()
    // The menu stays open after a click on a checkbox item (so several can be
    // changed in a row) and the state changes.
    await userEvent.click(barra)
    await waitFor(() => expect(barra).not.toBeChecked())
    await expect(menu).toBeVisible()
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Aparência</DropdownMenuLabel>
          <DropdownMenuCheckboxItem defaultChecked>
            Barra de status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled>
            Barra de atividades
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Painel</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const CaixasDeSelecaoComIcones: Story = {
  name: "Caixas de seleção com ícones",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Notificações")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Notificações
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Preferências de notificação</DropdownMenuLabel>
          <DropdownMenuCheckboxItem defaultChecked>
            <MailIcon aria-hidden="true" />
            Notificações por e-mail
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            <MessageSquareIcon aria-hidden="true" />
            Notificações por SMS
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem defaultChecked>
            <BellIcon aria-hidden="true" />
            Notificações push
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const GrupoDeRadio: Story = {
  name: "Grupo de radio",
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Abrir")
    await expect(
      within(menu).getByRole("menuitemradio", { name: "Inferior" })
    ).toBeChecked()
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Abrir
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Posição do painel</DropdownMenuLabel>
          <DropdownMenuRadioGroup defaultValue="bottom">
            <DropdownMenuRadioItem value="top">Superior</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">
              Inferior
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Direita</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const RadioComIcones: Story = {
  name: "Radio com ícones",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Forma de pagamento")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Forma de pagamento
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Escolha a forma de pagamento</DropdownMenuLabel>
          <DropdownMenuRadioGroup defaultValue="card">
            <DropdownMenuRadioItem value="card">
              <CreditCardIcon aria-hidden="true" />
              Cartão de crédito
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="paypal">
              <WalletIcon aria-hidden="true" />
              PayPal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bank">
              <Building2Icon aria-hidden="true" />
              Transferência bancária
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Destrutivo: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Ações")
    // Highlights the destructive item (the highlighted state is what needs
    // the contrast check) and leaves it highlighted for axe.
    const excluir = within(menu).getByRole("menuitem", { name: "Excluir" })
    excluir.focus()
    await waitFor(() => expect(excluir).toHaveFocus())
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Ações
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon aria-hidden="true" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon aria-hidden="true" />
            Compartilhar
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <TrashIcon aria-hidden="true" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const AvatarComMenu: Story = {
  name: "Avatar",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "LR, abrir o menu da conta")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="LR, abrir o menu da conta"
          />
        }
      >
        <Avatar>
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" />
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Complexo: Story = {
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Menu completo")
    await abrirSubmenu("Abrir recentes")
    await abrirSubmenu("Mais projetos")
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Menu completo
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Arquivo</DropdownMenuLabel>
          <DropdownMenuItem>
            <FileIcon aria-hidden="true" />
            Novo arquivo
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderIcon aria-hidden="true" />
            Nova pasta
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderOpenIcon aria-hidden="true" />
              Abrir recentes
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Projetos recentes</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileCodeIcon aria-hidden="true" />
                    Projeto Alfa
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCodeIcon aria-hidden="true" />
                    Projeto Beta
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MoreHorizontalIcon aria-hidden="true" />
                      Mais projetos
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <FileCodeIcon aria-hidden="true" />
                          Projeto Gama
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileCodeIcon aria-hidden="true" />
                          Projeto Delta
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FolderSearchIcon aria-hidden="true" />
                    Procurar...
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SaveIcon aria-hidden="true" />
            Salvar
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon aria-hidden="true" />
            Exportar
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Exibir</DropdownMenuLabel>
          <DropdownMenuCheckboxItem defaultChecked>
            <EyeIcon aria-hidden="true" />
            Mostrar barra lateral
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            <LayoutIcon aria-hidden="true" />
            Mostrar barra de status
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PaletteIcon aria-hidden="true" />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Aparência</DropdownMenuLabel>
                  <DropdownMenuRadioGroup defaultValue="light">
                    <DropdownMenuRadioItem value="light">
                      <SunIcon aria-hidden="true" />
                      Claro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <MoonIcon aria-hidden="true" />
                      Escuro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <MonitorIcon aria-hidden="true" />
                      Sistema
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Conta</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon aria-hidden="true" />
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon aria-hidden="true" />
            Cobrança
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon aria-hidden="true" />
              Configurações
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Preferências</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <KeyboardIcon aria-hidden="true" />
                    Atalhos de teclado
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LanguagesIcon aria-hidden="true" />
                    Idioma
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <BellIcon aria-hidden="true" />
                      Notificações
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>
                            Tipos de notificação
                          </DropdownMenuLabel>
                          <DropdownMenuCheckboxItem defaultChecked>
                            <BellIcon aria-hidden="true" />
                            Notificações push
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem defaultChecked>
                            <MailIcon aria-hidden="true" />
                            Notificações por e-mail
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ShieldIcon aria-hidden="true" />
                    Privacidade e segurança
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HelpCircleIcon aria-hidden="true" />
            Ajuda e suporte
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileTextIcon aria-hidden="true" />
            Documentação
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <LogOutIcon aria-hidden="true" />
            Encerrar sessão
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const gatilho = await within(canvasElement).findByRole("button", {
      name: "افتح القائمة",
    })

    // The menu opens, ArrowDown highlights "الحساب" (the submenu trigger) and
    // ArrowLeft, the arrow of the end side in RTL, opens the submenu on the
    // left of the menu.
    gatilho.focus()
    await userEvent.keyboard("{Enter}")
    const menu = await screen.findByRole("menu", { name: "افتح القائمة" })
    await esperarAnimacoes()
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "الحساب" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowLeft}")
    const submenu = await screen.findByRole("menu", { name: "الحساب" })
    await esperarAnimacoes()
    await waitFor(() => expect(submenu).toBeVisible())
    await conferirLadoDoSubmenu(menu, submenu, "rtl")
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            افتح القائمة
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" dir="rtl" lang="ar" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>الحساب</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent dir="rtl" lang="ar">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <UserIcon aria-hidden="true" />
                        الملف الشخصي
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCardIcon aria-hidden="true" />
                        الفوترة
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SettingsIcon aria-hidden="true" />
                        الإعدادات
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>الفريق</DropdownMenuLabel>
              <DropdownMenuItem>الفريق</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>دعوة المستخدمين</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent dir="rtl" lang="ar">
                    <DropdownMenuItem>البريد الإلكتروني</DropdownMenuItem>
                    <DropdownMenuItem>رسالة</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>المزيد</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent dir="rtl" lang="ar">
                          <DropdownMenuItem>تقويم</DropdownMenuItem>
                          <DropdownMenuItem>دردشة</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>خطاف ويب</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>متقدم...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                فريق جديد
                <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>عرض</DropdownMenuLabel>
              <DropdownMenuCheckboxItem defaultChecked>
                شريط الحالة
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>شريط النشاط</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>اللوحة</DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>الموضع</DropdownMenuLabel>
              <DropdownMenuRadioGroup defaultValue="bottom">
                <DropdownMenuRadioItem value="top">أعلى</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">
                  أسفل
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">يمين</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="left">يسار</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DirectionProvider>
  ),
}
