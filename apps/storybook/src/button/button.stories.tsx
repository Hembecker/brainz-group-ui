import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CalendarPlusIcon,
  CircleFadingArrowUpIcon,
  ClockIcon,
  GitBranchIcon,
  GitForkIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"

import { Button, buttonVariants } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Spinner } from "@workspace/ui/components/spinner"

/*
 * One story per section of button.mdx, in the same order as the shadcn/ui
 * page. Section stories use literal JSX (no args) so "Show code" can be
 * copied as is; Playground is the one with controls.
 *
 * "Grupo de botões" is the Button Group demo of the shadcn page, with its
 * dropdown menu. A closed menu is invisible to axe, so that story has a
 * `play` that opens the menu and its submenu first (the test runs axe after
 * `play`). The menu is portaled to <body>: it is queried with `screen`, and
 * the helpers wait for the enter animation to end, because axe would measure
 * contrast mid-fade.
 */
const meta = {
  title: "Componentes/Button",
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
}

export const Demo: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline">Botão</Button>
      <Button variant="outline" size="icon" aria-label="Enviar mensagem">
        <ArrowUpIcon aria-hidden="true" />
      </Button>
    </div>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="xs">
          Extra pequeno
        </Button>
        <Button variant="outline" size="icon-xs" aria-label="Abrir em nova aba">
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          Pequeno
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Abrir em nova aba">
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline">Padrão</Button>
        <Button variant="outline" size="icon" aria-label="Abrir em nova aba">
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="lg">
          Grande
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Abrir em nova aba">
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  ),
}

export const Padrao: Story = {
  name: "Padrão",
  render: () => <Button>Botão</Button>,
}

export const Contorno: Story = {
  render: () => <Button variant="outline">Contorno</Button>,
}

export const Secundario: Story = {
  name: "Secundário",
  render: () => <Button variant="secondary">Secundário</Button>,
}

export const Fantasma: Story = {
  render: () => <Button variant="ghost">Fantasma</Button>,
}

export const Destrutivo: Story = {
  render: () => <Button variant="destructive">Excluir</Button>,
}

export const Link: Story = {
  render: () => <Button variant="link">Link</Button>,
}

export const Icone: Story = {
  name: "Ícone",
  render: () => (
    <Button variant="outline" size="icon" aria-label="Atualizar versão">
      <CircleFadingArrowUpIcon aria-hidden="true" />
    </Button>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline">
        <GitBranchIcon aria-hidden="true" data-icon="inline-start" /> Nova
        branch
      </Button>
      <Button variant="outline">
        Fork <GitForkIcon aria-hidden="true" data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const Arredondado: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button className="rounded-full">Começar</Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label="Enviar mensagem"
      >
        <ArrowUpIcon aria-hidden="true" />
      </Button>
    </div>
  ),
}

export const ComSpinner: Story = {
  name: "Spinner",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Gerando
      </Button>
      <Button variant="secondary" disabled>
        Baixando
        <Spinner data-icon="inline-end" />
      </Button>
      <Button disabled focusableWhenDisabled>
        <Spinner data-icon="inline-start" />
        Salvando
      </Button>
    </div>
  ),
}

export const GrupoDeBotoes: Story = {
  name: "Grupo de botões",
  play: async ({ canvasElement }) => {
    // Opens the menu and, inside it, the submenu: axe sees both levels.
    await userEvent.click(
      await within(canvasElement).findByRole("button", { name: "Mais opções" })
    )
    const menu = await screen.findByRole("menu", { name: "Mais opções" })
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Etiquetar como..." })
    )
    const submenu = await screen.findByRole("menu", {
      name: "Etiquetar como...",
    })
    await esperarAnimacoes()
    await waitFor(() => expect(submenu).toBeVisible())
  },
  render: () => (
    <ButtonGroup aria-label="Ações da mensagem">
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Voltar">
          <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Arquivar</Button>
        <Button variant="outline">Denunciar</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Adiar</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="Mais opções" />
            }
          >
            <MoreHorizontalIcon aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MailCheckIcon aria-hidden="true" />
                Marcar como lida
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon aria-hidden="true" />
                Arquivar
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon aria-hidden="true" />
                Adiar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon aria-hidden="true" />
                Adicionar ao calendário
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterIcon aria-hidden="true" />
                Adicionar à lista
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon aria-hidden="true" />
                  Etiquetar como...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup defaultValue="personal">
                    <DropdownMenuRadioItem value="personal">
                      Pessoal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">
                      Trabalho
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">
                      Outro
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon aria-hidden="true" />
                Mover para a lixeira
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const ComoLink: Story = {
  name: "Como link",
  render: () => (
    <a
      href="#entrar"
      className={buttonVariants({ variant: "secondary", size: "sm" })}
    >
      Entrar
    </a>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar" className="flex flex-wrap items-center gap-2">
      <Button variant="outline">زر</Button>
      <Button variant="destructive">حذف</Button>
      <Button variant="outline">
        إرسال{" "}
        <ArrowRightIcon
          aria-hidden="true"
          data-icon="inline-end"
          className="rtl:rotate-180"
        />
      </Button>
      <Button variant="outline" size="icon" aria-label="إضافة">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button variant="secondary" disabled>
        <Spinner data-icon="inline-start" aria-label="جاري التحميل" /> جاري
        التحميل
      </Button>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    children: "Botão",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    disabled: { control: "boolean" },
    focusableWhenDisabled: { control: "boolean" },
  },
}
