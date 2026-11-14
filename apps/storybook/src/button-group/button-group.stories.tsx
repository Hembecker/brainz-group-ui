import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import * as React from "react"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AudioLinesIcon,
  BotIcon,
  CalendarPlusIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CopyIcon,
  ListFilterIcon,
  MailCheckIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  TagIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@workspace/ui/components/button-group"
import { DirectionProvider } from "@workspace/ui/components/direction"
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
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

/*
 * One story per section of button-group.mdx, in the order of the shadcn/ui
 * page, plus "Texto" (the ButtonGroupText example of the API reference).
 *
 * - The shadcn examples have no accessible names on the controls; here every
 *   group, field and icon-only button is named, and the menu items are in
 *   Portuguese. Radios and checkboxes of the menu are uncontrolled
 *   (`defaultValue`), so each story stays literal JSX.
 * - Menu, Select and Popover stay closed, which axe cannot see, so the
 *   stories that have one have a `play` that opens it first (the test runs
 *   axe after `play`). The popups are portaled to <body>: they are queried
 *   with `screen`, and the helpers wait for the enter animation to end,
 *   because axe would measure contrast mid-fade.
 * - "Grupo de entrada" needs state (voice mode), so it uses the small
 *   component below and gives the Docs page the copyable snippet in
 *   `docs.source.code`. The orange highlight of the shadcn example became the
 *   `secondary` role: the system does not use palette colors.
 * - Ids are prefixed with the story name: the Docs page renders all stories
 *   in the same document.
 */
const meta = {
  title: "Componentes/Button Group",
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

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

async function abrirLista(canvasElement: HTMLElement, nome: string) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("combobox", { name: nome }))
  const lista = await screen.findByRole("listbox")
  await esperarAnimacoes()
  await waitFor(() => expect(lista).toBeVisible())
  return lista
}

async function abrirPopover(
  canvasElement: HTMLElement,
  gatilho: string,
  nome: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("button", { name: gatilho }))
  const popover = await screen.findByRole("dialog", { name: nome })
  await esperarAnimacoes()
  await waitFor(() => expect(popover).toBeVisible())
  return popover
}

// Opens the tooltip by KEYBOARD (Tab to the trigger): the focus keeps it open
// while axe runs, and it proves that it opens on focus, not only on hover.
async function abrirTooltipPorTeclado(
  canvasElement: HTMLElement,
  gatilho: string,
  texto: string
) {
  const botao = await within(canvasElement).findByRole("button", {
    name: gatilho,
  })
  for (let i = 0; i < 10 && document.activeElement !== botao; i++) {
    await userEvent.tab()
  }
  await expect(botao).toHaveFocus()
  const conteudo = await screen.findByText(texto)
  await esperarAnimacoes()
  await waitFor(() => expect(conteudo).toBeVisible())
  return botao
}

function GrupoComEntrada() {
  const [vozLigada, setVozLigada] = React.useState(false)

  return (
    <ButtonGroup aria-label="Enviar mensagem" className="[--radius:9999rem]">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Anexar arquivo">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Mensagem"
            placeholder={
              vozLigada ? "Gravar e enviar áudio..." : "Enviar uma mensagem..."
            }
            disabled={vozLigada}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    onClick={() => setVozLigada(!vozLigada)}
                    size="icon-xs"
                    data-active={vozLigada}
                    className="data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground"
                    aria-label="Modo de voz"
                    aria-pressed={vozLigada}
                  />
                }
              >
                <AudioLinesIcon aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Modo de voz</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    // Opens the menu and, inside it, the submenu: axe sees both levels.
    await abrirMenu(canvasElement, "Mais opções")
    await abrirSubmenu("Etiquetar como...")
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

export const Orientacao: Story = {
  name: "Orientação",
  render: () => (
    <ButtonGroup
      orientation="vertical"
      aria-label="Controles de zoom"
      className="h-fit"
    >
      <Button variant="outline" size="icon" aria-label="Aumentar o zoom">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Diminuir o zoom">
        <MinusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <ButtonGroup aria-label="Grupo pequeno">
        <Button variant="outline" size="sm">
          Pequeno
        </Button>
        <Button variant="outline" size="sm">
          Botão
        </Button>
        <Button variant="outline" size="sm">
          Grupo
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Adicionar item">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Grupo padrão">
        <Button variant="outline">Padrão</Button>
        <Button variant="outline">Botão</Button>
        <Button variant="outline">Grupo</Button>
        <Button variant="outline" size="icon" aria-label="Adicionar item">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Grupo grande">
        <Button variant="outline" size="lg">
          Grande
        </Button>
        <Button variant="outline" size="lg">
          Botão
        </Button>
        <Button variant="outline" size="lg">
          Grupo
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Adicionar item">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  ),
}

export const Aninhado: Story = {
  play: async ({ canvasElement }) => {
    await abrirTooltipPorTeclado(canvasElement, "Modo de voz", "Modo de voz")
  },
  render: () => (
    <ButtonGroup aria-label="Enviar mensagem">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Anexar arquivo">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Mensagem"
            placeholder="Enviar uma mensagem..."
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton size="icon-xs" aria-label="Modo de voz" />
                }
              >
                <AudioLinesIcon aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Modo de voz</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Separador: Story = {
  render: () => (
    <ButtonGroup aria-label="Área de transferência">
      <Button variant="secondary" size="sm">
        Copiar
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Colar
      </Button>
    </ButtonGroup>
  ),
}

export const Dividido: Story = {
  name: "Dividido",
  render: () => (
    <ButtonGroup aria-label="Criar">
      <Button variant="secondary">Botão</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="Mais opções">
        <PlusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
}

export const Entrada: Story = {
  name: "Input",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="entrada-busca">Buscar</FieldLabel>
      <ButtonGroup aria-label="Busca">
        <Input id="entrada-busca" placeholder="Digite para buscar..." />
        <Button variant="outline" aria-label="Pesquisar">
          <SearchIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </Field>
  ),
}

export const GrupoDeEntrada: Story = {
  name: "Input Group",
  play: async ({ canvasElement }) => {
    const botao = await abrirTooltipPorTeclado(
      canvasElement,
      "Modo de voz",
      "Modo de voz"
    )

    // Pressing the toggle turns the voice mode on: the pressed state shows
    // (`secondary`) and the field is disabled, so axe sees the new state.
    await expect(botao).toHaveAttribute("aria-pressed", "false")
    await userEvent.keyboard("{Enter}")
    await expect(botao).toHaveAttribute("aria-pressed", "true")
    await expect(
      within(canvasElement).getByRole("textbox", { name: "Mensagem" })
    ).toBeDisabled()
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `function Example() {
  const [vozLigada, setVozLigada] = React.useState(false)

  return (
    <ButtonGroup aria-label="Enviar mensagem" className="[--radius:9999rem]">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Anexar arquivo">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Mensagem"
            placeholder={
              vozLigada ? "Gravar e enviar áudio..." : "Enviar uma mensagem..."
            }
            disabled={vozLigada}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    onClick={() => setVozLigada(!vozLigada)}
                    size="icon-xs"
                    data-active={vozLigada}
                    className="data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground"
                    aria-label="Modo de voz"
                    aria-pressed={vozLigada}
                  />
                }
              >
                <AudioLinesIcon aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Modo de voz</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}`,
      },
    },
  },
  render: () => <GrupoComEntrada />,
}

export const MenuSuspenso: Story = {
  name: "Dropdown Menu",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "Mais opções de seguir")
  },
  render: () => (
    <ButtonGroup aria-label="Seguir">
      <Button variant="outline">Seguir</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="ps-2!"
              aria-label="Mais opções de seguir"
            />
          }
        >
          <ChevronDownIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <VolumeOffIcon aria-hidden="true" />
              Silenciar conversa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckIcon aria-hidden="true" />
              Marcar como lida
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TriangleAlertIcon aria-hidden="true" />
              Denunciar conversa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserRoundXIcon aria-hidden="true" />
              Bloquear usuário
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon aria-hidden="true" />
              Compartilhar conversa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon aria-hidden="true" />
              Copiar conversa
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon aria-hidden="true" />
              Excluir conversa
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
}

export const Selecao: Story = {
  name: "Select",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Moeda")
  },
  render: () => (
    <ButtonGroup aria-label="Valor a enviar">
      <ButtonGroup>
        <Select
          defaultValue="$"
          items={[
            { label: "$", value: "$" },
            { label: "€", value: "€" },
            { label: "£", value: "£" },
          ]}
        >
          <SelectTrigger aria-label="Moeda" className="font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            <SelectGroup>
              <SelectItem value="$">
                $ <span className="text-muted-foreground">Dólar americano</span>
              </SelectItem>
              <SelectItem value="€">
                € <span className="text-muted-foreground">Euro</span>
              </SelectItem>
              <SelectItem value="£">
                £ <span className="text-muted-foreground">Libra esterlina</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input aria-label="Valor" placeholder="10,00" pattern="[0-9]*" />
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Enviar" size="icon" variant="outline">
          <ArrowRightIcon aria-hidden="true" className="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Popup: Story = {
  name: "Popover",
  play: async ({ canvasElement }) => {
    await abrirPopover(
      canvasElement,
      "Abrir tarefa do Copilot",
      "Iniciar uma tarefa com o Copilot"
    )
  },
  render: () => (
    <ButtonGroup aria-label="Copilot">
      <Button variant="outline">
        <BotIcon aria-hidden="true" /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Abrir tarefa do Copilot"
            />
          }
        >
          <ChevronDownIcon aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-xl text-sm">
          <PopoverHeader>
            <PopoverTitle>Iniciar uma tarefa com o Copilot</PopoverTitle>
            <PopoverDescription>
              Descreva a tarefa em linguagem natural.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="popover-tarefa" className="sr-only">
              Descrição da tarefa
            </FieldLabel>
            <Textarea
              id="popover-tarefa"
              placeholder="Preciso de..."
              className="resize-none"
              aria-describedby="popover-tarefa-descricao"
            />
            <FieldDescription id="popover-tarefa-descricao">
              O Copilot vai abrir um pull request para revisão.
            </FieldDescription>
          </Field>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
}

export const Texto: Story = {
  render: () => (
    <ButtonGroup aria-label="Visualização">
      <ButtonGroupText>Página 2 de 10</ButtonGroupText>
      <Button variant="outline" size="icon" aria-label="Página anterior">
        <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Próxima página">
        <ArrowRightIcon aria-hidden="true" className="rtl:rotate-180" />
      </Button>
    </ButtonGroup>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "خيارات إضافية")
    await abrirSubmenu("تصنيف كـ...")
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <ButtonGroup aria-label="إجراءات الرسالة">
          <ButtonGroup className="hidden sm:flex">
            <Button variant="outline" size="icon" aria-label="رجوع">
              <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">أرشفة</Button>
            <Button variant="outline">تقرير</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">تأجيل</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="خيارات إضافية"
                  />
                }
              >
                <MoreHorizontalIcon aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                dir="rtl"
                lang="ar"
                className="w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailCheckIcon aria-hidden="true" />
                    وضع علامة كمقروء
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArchiveIcon aria-hidden="true" />
                    أرشفة
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ClockIcon aria-hidden="true" />
                    تأجيل
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CalendarPlusIcon aria-hidden="true" />
                    إضافة إلى التقويم
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListFilterIcon aria-hidden="true" />
                    إضافة إلى القائمة
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <TagIcon aria-hidden="true" />
                      تصنيف كـ...
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent dir="rtl" lang="ar">
                      <DropdownMenuRadioGroup defaultValue="personal">
                        <DropdownMenuRadioItem value="personal">
                          شخصي
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="work">
                          عمل
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="other">
                          آخر
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <Trash2Icon aria-hidden="true" />
                    سلة المهملات
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </ButtonGroup>
      </div>
    </DirectionProvider>
  ),
}
