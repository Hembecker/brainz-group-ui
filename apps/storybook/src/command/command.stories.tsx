import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  SmileIcon,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command"

/*
 * One story per section of command.mdx, in the order of the shadcn/ui page.
 * The shadcn examples have no name on the search field (only a placeholder);
 * here every `Command` has a `label` (cmdk ties it to the search field with a
 * hidden <label>; an `aria-label` on the input would lose to it), because a
 * placeholder is never the label.
 *
 * The Basic, Shortcuts, Groups and Scrollable examples live in a
 * `CommandDialog`, which needs `open` state. A hook cannot live in
 * `render: () => (…)`, so they render a small component (`ExemploEmDialogo`)
 * and show the whole snippet (state included) in "Show code" through
 * `parameters.docs.source.code`, which skips the `render` transform. Only the
 * Demo and RTL examples are an inline `Command`.
 *
 * A closed dialog is invisible to axe, so the dialog stories have a `play`
 * that opens it first (the test runs axe after `play`). `abrirPaleta` clicks
 * the trigger, waits for the dialog by role and name (it is portaled to
 * <body>, so it is queried with `screen`), for the enter animation to end
 * (axe would measure contrast mid-fade) and for the focus to land on the
 * search field. cmdk highlights the first item by itself, so axe also measures
 * the highlighted state (`data-selected`) when the test ends.
 */
const meta = {
  title: "Componentes/Command",
  component: Command,
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

function ExemploEmDialogo({
  title,
  description,
  children,
}: {
  title?: string
  description?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Abrir menu
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
      >
        {children}
      </CommandDialog>
    </div>
  )
}

async function abrirPaleta(
  canvasElement: HTMLElement,
  titulo: string,
  campo: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(
    await canvas.findByRole("button", { name: "Abrir menu" })
  )
  const dialog = await screen.findByRole("dialog", { name: titulo })
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(dialog).toBeVisible())
  const busca = within(dialog).getByRole("combobox", { name: campo })
  await waitFor(() => expect(busca).toHaveFocus())
  await waitFor(() =>
    expect(within(dialog).getAllByRole("option")[0]).toHaveAttribute(
      "data-selected",
      "true"
    )
  )
  return { dialog, busca }
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const busca = await canvas.findByRole("combobox", {
      name: "Buscar comandos",
    })
    // The list is named (cmdk would say "Suggestions").
    await expect(
      canvas.getByRole("listbox", { name: "Resultados" })
    ).toBeVisible()

    // The empty-state region is always mounted and empty while there are
    // results; the same node gets the text when nothing matches.
    const vazio = canvas.getByRole("status")
    await expect(vazio).toBeEmptyDOMElement()
    await userEvent.type(busca, "zzzz")
    await waitFor(() =>
      expect(vazio).toHaveTextContent("Nenhum resultado encontrado.")
    )
    await expect(canvas.getByRole("status")).toBe(vazio)
    await userEvent.clear(busca)
    await waitFor(() => expect(vazio).toBeEmptyDOMElement())

    // The arrows move the highlight and the focus stays in the field.
    await userEvent.click(busca)
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(
        canvas.getByRole("option", { name: "Pesquisar emoji" })
      ).toHaveAttribute("data-selected", "true")
    )
    await expect(busca).toHaveFocus()
  },
  render: () => (
    <Command className="max-w-sm rounded-lg border" label="Buscar comandos">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>
            <CalendarIcon aria-hidden="true" />
            <span>Calendário</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon aria-hidden="true" />
            <span>Pesquisar emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <CalculatorIcon aria-hidden="true" />
            <span>Calculadora</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configurações">
          <CommandItem>
            <UserIcon aria-hidden="true" />
            <span>Perfil</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon aria-hidden="true" />
            <span>Cobrança</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon aria-hidden="true" />
            <span>Configurações</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const Basico: Story = {
  name: "Básico",
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = React.useState(false)

<div className="flex flex-col gap-4">
  <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
    Abrir menu
  </Button>
  <CommandDialog open={open} onOpenChange={setOpen}>
    <Command label="Buscar comandos">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>Calendário</CommandItem>
          <CommandItem>Pesquisar emoji</CommandItem>
          <CommandItem>Calculadora</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await abrirPaleta(canvasElement, "Paleta de comandos", "Buscar comandos")
  },
  render: () => (
    <ExemploEmDialogo>
      <Command label="Buscar comandos">
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Sugestões">
            <CommandItem>Calendário</CommandItem>
            <CommandItem>Pesquisar emoji</CommandItem>
            <CommandItem>Calculadora</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ExemploEmDialogo>
  ),
}

export const Atalhos: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = React.useState(false)

<div className="flex flex-col gap-4">
  <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
    Abrir menu
  </Button>
  <CommandDialog
    open={open}
    onOpenChange={setOpen}
    title="Atalhos da conta"
    description="Procure uma página da conta pelo nome ou pelo atalho."
  >
    <Command label="Buscar página da conta">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Configurações">
          <CommandItem>
            <UserIcon aria-hidden="true" />
            <span>Perfil</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon aria-hidden="true" />
            <span>Cobrança</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon aria-hidden="true" />
            <span>Configurações</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await abrirPaleta(
      canvasElement,
      "Atalhos da conta",
      "Buscar página da conta"
    )
  },
  render: () => (
    <ExemploEmDialogo
      title="Atalhos da conta"
      description="Procure uma página da conta pelo nome ou pelo atalho."
    >
      <Command label="Buscar página da conta">
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Configurações">
            <CommandItem>
              <UserIcon aria-hidden="true" />
              <span>Perfil</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon aria-hidden="true" />
              <span>Cobrança</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon aria-hidden="true" />
              <span>Configurações</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ExemploEmDialogo>
  ),
}

export const Grupos: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = React.useState(false)

<div className="flex flex-col gap-4">
  <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
    Abrir menu
  </Button>
  <CommandDialog
    open={open}
    onOpenChange={setOpen}
    title="Comandos por grupo"
    description="Procure um comando nas sugestões ou nas configurações."
  >
    <Command label="Buscar comando por grupo">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>
            <CalendarIcon aria-hidden="true" />
            <span>Calendário</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon aria-hidden="true" />
            <span>Pesquisar emoji</span>
          </CommandItem>
          <CommandItem>
            <CalculatorIcon aria-hidden="true" />
            <span>Calculadora</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configurações">
          <CommandItem>
            <UserIcon aria-hidden="true" />
            <span>Perfil</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon aria-hidden="true" />
            <span>Cobrança</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon aria-hidden="true" />
            <span>Configurações</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await abrirPaleta(
      canvasElement,
      "Comandos por grupo",
      "Buscar comando por grupo"
    )
  },
  render: () => (
    <ExemploEmDialogo
      title="Comandos por grupo"
      description="Procure um comando nas sugestões ou nas configurações."
    >
      <Command label="Buscar comando por grupo">
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Sugestões">
            <CommandItem>
              <CalendarIcon aria-hidden="true" />
              <span>Calendário</span>
            </CommandItem>
            <CommandItem>
              <SmileIcon aria-hidden="true" />
              <span>Pesquisar emoji</span>
            </CommandItem>
            <CommandItem>
              <CalculatorIcon aria-hidden="true" />
              <span>Calculadora</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Configurações">
            <CommandItem>
              <UserIcon aria-hidden="true" />
              <span>Perfil</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon aria-hidden="true" />
              <span>Cobrança</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon aria-hidden="true" />
              <span>Configurações</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ExemploEmDialogo>
  ),
}

export const Rolagem: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = React.useState(false)

<div className="flex flex-col gap-4">
  <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
    Abrir menu
  </Button>
  <CommandDialog
    open={open}
    onOpenChange={setOpen}
    title="Muitos comandos"
    description="Procure entre vários grupos de comandos."
  >
    <Command label="Buscar entre muitos comandos">
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Navegação">
          <CommandItem>
            <HomeIcon aria-hidden="true" />
            <span>Início</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <InboxIcon aria-hidden="true" />
            <span>Caixa de entrada</span>
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>
          {/* … */}
        </CommandGroup>
        <CommandSeparator />
        {/* …mais grupos: Ações, Exibição, Conta e Ferramentas */}
      </CommandList>
    </Command>
  </CommandDialog>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const { dialog } = await abrirPaleta(
      canvasElement,
      "Muitos comandos",
      "Buscar entre muitos comandos"
    )
    // The list scrolls inside the dialog: the last group is out of view.
    const lista = within(dialog).getByRole("listbox", { name: "Resultados" })
    await expect(lista.scrollHeight).toBeGreaterThan(lista.clientHeight)
  },
  render: () => (
    <ExemploEmDialogo
      title="Muitos comandos"
      description="Procure entre vários grupos de comandos."
    >
      <Command label="Buscar entre muitos comandos">
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            <CommandItem>
              <HomeIcon aria-hidden="true" />
              <span>Início</span>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <InboxIcon aria-hidden="true" />
              <span>Caixa de entrada</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileTextIcon aria-hidden="true" />
              <span>Documentos</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FolderIcon aria-hidden="true" />
              <span>Pastas</span>
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem>
              <PlusIcon aria-hidden="true" />
              <span>Novo arquivo</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FolderPlusIcon aria-hidden="true" />
              <span>Nova pasta</span>
              <CommandShortcut>⇧⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CopyIcon aria-hidden="true" />
              <span>Copiar</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <ScissorsIcon aria-hidden="true" />
              <span>Recortar</span>
              <CommandShortcut>⌘X</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <ClipboardPasteIcon aria-hidden="true" />
              <span>Colar</span>
              <CommandShortcut>⌘V</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <TrashIcon aria-hidden="true" />
              <span>Excluir</span>
              <CommandShortcut>⌫</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Exibição">
            <CommandItem>
              <LayoutGridIcon aria-hidden="true" />
              <span>Visualização em grade</span>
            </CommandItem>
            <CommandItem>
              <ListIcon aria-hidden="true" />
              <span>Visualização em lista</span>
            </CommandItem>
            <CommandItem>
              <ZoomInIcon aria-hidden="true" />
              <span>Aumentar zoom</span>
              <CommandShortcut>⌘+</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <ZoomOutIcon aria-hidden="true" />
              <span>Diminuir zoom</span>
              <CommandShortcut>⌘-</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Conta">
            <CommandItem>
              <UserIcon aria-hidden="true" />
              <span>Perfil</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon aria-hidden="true" />
              <span>Cobrança</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon aria-hidden="true" />
              <span>Configurações</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <BellIcon aria-hidden="true" />
              <span>Notificações</span>
            </CommandItem>
            <CommandItem>
              <HelpCircleIcon aria-hidden="true" />
              <span>Ajuda e suporte</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ferramentas">
            <CommandItem>
              <CalculatorIcon aria-hidden="true" />
              <span>Calculadora</span>
            </CommandItem>
            <CommandItem>
              <CalendarIcon aria-hidden="true" />
              <span>Calendário</span>
            </CommandItem>
            <CommandItem>
              <ImageIcon aria-hidden="true" />
              <span>Editor de imagens</span>
            </CommandItem>
            <CommandItem>
              <CodeIcon aria-hidden="true" />
              <span>Editor de código</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ExemploEmDialogo>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const busca = await canvas.findByRole("combobox", {
      name: "ابحث عن أمر",
    })
    await userEvent.click(busca)
    await waitFor(() =>
      expect(canvas.getAllByRole("option")[0]).toHaveAttribute(
        "data-selected",
        "true"
      )
    )
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <Command
        className="max-w-sm rounded-lg border"
        dir="rtl"
        label="ابحث عن أمر"
      >
        <CommandInput dir="rtl" placeholder="اكتب أمرًا أو ابحث..." />
        <CommandList>
          <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
          <CommandGroup heading="اقتراحات">
            <CommandItem>
              <CalendarIcon aria-hidden="true" />
              <span>التقويم</span>
            </CommandItem>
            <CommandItem>
              <SmileIcon aria-hidden="true" />
              <span>البحث عن الرموز التعبيرية</span>
            </CommandItem>
            <CommandItem disabled>
              <CalculatorIcon aria-hidden="true" />
              <span>الآلة الحاسبة</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="الإعدادات">
            <CommandItem>
              <UserIcon aria-hidden="true" />
              <span>الملف الشخصي</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon aria-hidden="true" />
              <span>الفوترة</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon aria-hidden="true" />
              <span>الإعدادات</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}
