import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  CornerDownLeftIcon,
  CreditCardIcon,
  EyeOffIcon,
  FileCodeIcon,
  InfoIcon,
  LoaderIcon,
  MailIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group"
import { Kbd } from "@workspace/ui/components/kbd"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Spinner } from "@workspace/ui/components/spinner"

/*
 * One story per section of input-group.mdx, in the order of the shadcn/ui
 * page, plus "Inválido" (not on the shadcn page: it is where the invalid
 * state and its focus ring are tested).
 *
 * - The label belongs to the field, not to the group: every example has a
 *   visible `FieldLabel htmlFor` ↔ `InputGroupInput id`. The text addons that
 *   explain the field (the `https://` prefix, "USD", the counter) are tied to
 *   it with `aria-describedby`. Decorative icons have `aria-hidden="true"`
 *   and icon-only buttons have an `aria-label`.
 * - The shadcn examples put some addons before the input in the DOM; here
 *   the input always comes first and `align` places the addon (focus order
 *   follows the DOM).
 * - Popover and Dropdown stay closed, which axe cannot see, so "Botão" and
 *   "Menu suspenso" have a `play` that opens one first. The popup is
 *   portaled to <body>: it is queried with `screen`.
 * - "Botão" needs state (copied, favorite), so it uses the small component
 *   below and gives the Docs page the copyable snippet in `docs.source.code`.
 * - The Demo `play` proves the focus ring: it lives on the GROUP, solid, and
 *   the inner control draws nothing of its own.
 * - Ids are prefixed with the story name: the Docs page renders all stories
 *   in the same document.
 */
const meta = {
  title: "Componentes/Input Group",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>

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

// The computed color of a token, serialized the same way as in box-shadow.
function corDoToken(token: string) {
  const sonda = document.createElement("span")
  sonda.style.color = `var(${token})`
  document.body.appendChild(sonda)
  const cor = getComputedStyle(sonda).color
  sonda.remove()
  return cor
}

function GrupoDeBotoes() {
  const [copiado, setCopiado] = React.useState(false)
  const [favorito, setFavorito] = React.useState(false)

  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="botao-link">Link para compartilhar</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="botao-link"
            readOnly
            defaultValue="https://exemplo.com/maria"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Copiar link"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText("https://exemplo.com/maria")
                  .catch(() => undefined)
                setCopiado(true)
              }}
            >
              {copiado ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <CopyIcon aria-hidden="true" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <span role="status" className="sr-only">
          {copiado ? "Link copiado" : ""}
        </span>
      </Field>
      <Field>
        <FieldLabel htmlFor="botao-endereco">Endereço do site</FieldLabel>
        <InputGroup>
          <InputGroupInput id="botao-endereco" />
          <InputGroupAddon>
            <Popover>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    variant="secondary"
                    size="icon-xs"
                    aria-label="Informações de segurança"
                  />
                }
              >
                <InfoIcon aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex flex-col gap-1 rounded-xl text-sm"
              >
                <PopoverTitle className="text-sm">
                  Sua conexão não é segura.
                </PopoverTitle>
                <PopoverDescription>
                  Não informe dados sensíveis neste site.
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
          <InputGroupAddon className="ps-1.5">https://</InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Favoritar"
              aria-pressed={favorito}
              onClick={() => setFavorito(!favorito)}
            >
              <StarIcon
                aria-hidden="true"
                data-favorite={favorito}
                className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="botao-busca">Buscar</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="botao-busca"
            placeholder="Digite para buscar..."
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">Buscar</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const campo = await canvas.findByLabelText("Buscar no catálogo")
    const grupo = campo.closest<HTMLElement>('[data-slot="input-group"]')!

    // Tab puts the focus on the field, and the ring shows on the GROUP.
    await userEvent.tab()
    await expect(campo).toHaveFocus()
    await esperarAnimacoes()

    // Solid: the ring (3px + 2px offset) is the `--ring` token, with no alpha,
    // and the 2px offset is the background color.
    const sombra = getComputedStyle(grupo).boxShadow
    await expect(sombra).toContain(corDoToken("--ring"))
    await expect(sombra).toContain(corDoToken("--background"))
    await expect(sombra).toMatch(/\b5px\b/)
    await expect(sombra).toMatch(/\b2px\b/)
    await expect(getComputedStyle(grupo).borderColor).toBe(corDoToken("--ring"))

    // The inner control draws nothing: no ring, no offset halo.
    const interna = getComputedStyle(campo).boxShadow
    const espalhamentos = [
      ...interna.matchAll(
        /(-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px/g
      ),
    ].map((par) => par[4])
    await expect(espalhamentos.every((valor) => Number(valor) === 0)).toBe(true)
  },
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="demo-busca">Buscar no catálogo</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="demo-busca"
          placeholder="Buscar..."
          aria-describedby="demo-busca-resultados"
        />
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" id="demo-busca-resultados">
          12 resultados
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
}

export const InlineStart: Story = {
  name: "inline-start",
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-start-busca">Campo</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-start-busca"
          placeholder="Buscar..."
          aria-describedby="inline-start-busca-descricao"
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription id="inline-start-busca-descricao">
        Ícone posicionado no início.
      </FieldDescription>
    </Field>
  ),
}

export const InlineEnd: Story = {
  name: "inline-end",
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-end-senha">Senha</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-end-senha"
          type="password"
          placeholder="Digite a senha"
          autoComplete="current-password"
          aria-describedby="inline-end-senha-descricao"
        />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription id="inline-end-senha-descricao">
        Ícone posicionado no fim.
      </FieldDescription>
    </Field>
  ),
}

export const BlockStart: Story = {
  name: "block-start",
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="block-start-nome">Campo</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput
            id="block-start-nome"
            placeholder="Digite o seu nome"
            aria-describedby="block-start-nome-descricao"
          />
          <InputGroupAddon align="block-start">
            <InputGroupText>Nome completo</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription id="block-start-nome-descricao">
          Cabeçalho posicionado acima do campo.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="block-start-codigo">Área de texto</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-start-codigo"
            placeholder="console.log('Olá, mundo!');"
            className="font-mono text-sm"
            aria-describedby="block-start-codigo-descricao"
          />
          <InputGroupAddon align="block-start">
            <FileCodeIcon
              aria-hidden="true"
              className="text-muted-foreground"
            />
            <InputGroupText className="font-mono">script.js</InputGroupText>
            <InputGroupButton size="icon-xs" className="ms-auto">
              <CopyIcon aria-hidden="true" />
              <span className="sr-only">Copiar código</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription id="block-start-codigo-descricao">
          Cabeçalho posicionado acima da área de texto.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
}

export const BlockEnd: Story = {
  name: "block-end",
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="block-end-valor">Campo</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput
            id="block-end-valor"
            placeholder="Digite o valor"
            aria-describedby="block-end-valor-moeda block-end-valor-descricao"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText id="block-end-valor-moeda">USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription id="block-end-valor-descricao">
          Rodapé posicionado abaixo do campo.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="block-end-comentario">Área de texto</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-end-comentario"
            placeholder="Escreva um comentário..."
            aria-describedby="block-end-comentario-contador block-end-comentario-descricao"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText id="block-end-comentario-contador">
              0/280
            </InputGroupText>
            <InputGroupButton variant="default" size="sm" className="ms-auto">
              Publicar
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription id="block-end-comentario-descricao">
          Rodapé posicionado abaixo da área de texto.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
}

export const Icone: Story = {
  name: "Ícone",
  render: () => (
    <FieldGroup className="max-w-sm gap-4">
      <Field>
        <FieldLabel htmlFor="icone-busca">Pesquisa</FieldLabel>
        <InputGroup>
          <InputGroupInput id="icone-busca" placeholder="Buscar..." />
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="icone-email">E-mail</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="icone-email"
            type="email"
            placeholder="Digite o seu e-mail"
            autoComplete="email"
          />
          <InputGroupAddon>
            <MailIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="icone-cartao">Número do cartão</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="icone-cartao"
            placeholder="0000 0000 0000 0000"
            autoComplete="cc-number"
          />
          <InputGroupAddon>
            <CreditCardIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <CheckIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="icone-reserva">Cartão de reserva</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="icone-reserva"
            placeholder="0000 0000 0000 0000"
          />
          <InputGroupAddon align="inline-end">
            <StarIcon aria-hidden="true" />
            <InfoIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  ),
}

export const Texto: Story = {
  render: () => (
    <FieldGroup className="max-w-sm gap-4">
      <Field>
        <FieldLabel htmlFor="texto-valor">Valor</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="texto-valor"
            placeholder="0,00"
            inputMode="decimal"
            aria-describedby="texto-valor-moeda"
          />
          <InputGroupAddon>
            <InputGroupText>R$</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText id="texto-valor-moeda">BRL</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="texto-site">Endereço do site</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="texto-site"
            placeholder="exemplo"
            className="ps-0.5!"
            aria-describedby="texto-site-prefixo texto-site-sufixo"
          />
          <InputGroupAddon>
            <InputGroupText id="texto-site-prefixo">https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText id="texto-site-sufixo">.com.br</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="texto-usuario">Nome de usuário</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="texto-usuario"
            placeholder="Digite o seu usuário"
            autoComplete="username"
            aria-describedby="texto-usuario-dominio"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText id="texto-usuario-dominio">
              @empresa.com
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="texto-mensagem">Mensagem</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="texto-mensagem"
            placeholder="Digite a sua mensagem"
            aria-describedby="texto-mensagem-contador"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText
              id="texto-mensagem-contador"
              className="text-xs text-muted-foreground"
            >
              Restam 120 caracteres
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  ),
}

export const Botao: Story = {
  name: "Botão",
  parameters: {
    docs: {
      source: {
        code: `const [copiado, setCopiado] = React.useState(false)
const [favorito, setFavorito] = React.useState(false)

<FieldGroup className="max-w-sm">
  <Field>
    <FieldLabel htmlFor="link">Link para compartilhar</FieldLabel>
    <InputGroup>
      <InputGroupInput id="link" readOnly defaultValue="https://exemplo.com/maria" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label="Copiar link"
          onClick={() => {
            navigator.clipboard?.writeText("https://exemplo.com/maria")
            setCopiado(true)
          }}
        >
          {copiado ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <span role="status" className="sr-only">
      {copiado ? "Link copiado" : ""}
    </span>
  </Field>
  <Field>
    <FieldLabel htmlFor="endereco">Endereço do site</FieldLabel>
    <InputGroup>
      <InputGroupInput id="endereco" />
      <InputGroupAddon>
        <Popover>
          <PopoverTrigger
            render={
              <InputGroupButton
                variant="secondary"
                size="icon-xs"
                aria-label="Informações de segurança"
              />
            }
          >
            <InfoIcon aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent align="start" className="flex flex-col gap-1 rounded-xl text-sm">
            <PopoverTitle className="text-sm">Sua conexão não é segura.</PopoverTitle>
            <PopoverDescription>Não informe dados sensíveis neste site.</PopoverDescription>
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
      <InputGroupAddon className="ps-1.5">https://</InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label="Favoritar"
          aria-pressed={favorito}
          onClick={() => setFavorito(!favorito)}
        >
          <StarIcon
            aria-hidden="true"
            data-favorite={favorito}
            className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
          />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </Field>
  <Field>
    <FieldLabel htmlFor="busca">Buscar</FieldLabel>
    <InputGroup>
      <InputGroupInput id="busca" placeholder="Digite para buscar..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="secondary">Buscar</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </Field>
</FieldGroup>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Copy: the button changes and the status region announces it.
    await userEvent.click(
      await canvas.findByRole("button", { name: "Copiar link" })
    )
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Link copiado")
    )

    // Favorite: aria-pressed follows the click.
    const favoritar = await canvas.findByRole("button", { name: "Favoritar" })
    await expect(favoritar).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(favoritar)
    await expect(favoritar).toHaveAttribute("aria-pressed", "true")

    // Popover: opens (axe only sees it open), Esc closes and returns the focus.
    const gatilho = await canvas.findByRole("button", {
      name: "Informações de segurança",
    })
    await userEvent.click(gatilho)
    const popover = await screen.findByRole("dialog", {
      name: "Sua conexão não é segura.",
    })
    await esperarAnimacoes()
    await waitFor(() => expect(popover).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())
    await userEvent.click(gatilho)
    await screen.findByRole("dialog", { name: "Sua conexão não é segura." })
    await esperarAnimacoes()
  },
  render: () => <GrupoDeBotoes />,
}

export const TeclaDeAtalho: Story = {
  name: "Kbd",
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="kbd-busca">Buscar</FieldLabel>
      <InputGroup>
        <InputGroupInput id="kbd-busca" placeholder="Buscar..." />
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
}

export const MenuSuspenso: Story = {
  name: "Dropdown",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", { name: "Mais opções" })

    // Opens by keyboard; Esc closes it and returns the focus to the trigger.
    gatilho.focus()
    await userEvent.keyboard("{Enter}")
    await screen.findByRole("menu")
    await esperarAnimacoes()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await userEvent.click(gatilho)
    const menu = await screen.findByRole("menu")
    await esperarAnimacoes()
    await waitFor(() => expect(menu).toBeVisible())
  },
  render: () => (
    <FieldGroup className="max-w-sm gap-4">
      <Field>
        <FieldLabel htmlFor="dropdown-arquivo">Nome do arquivo</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="dropdown-arquivo"
            placeholder="Digite o nome do arquivo"
          />
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Mais opções"
                    size="icon-xs"
                  />
                }
              >
                <MoreHorizontalIcon aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuItem>Copiar caminho</DropdownMenuItem>
                  <DropdownMenuItem>Abrir local</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="dropdown-consulta">Consulta</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="dropdown-consulta"
            placeholder="Digite a consulta"
          />
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton
                    variant="ghost"
                    className="pe-1.5! text-xs"
                  />
                }
              >
                Buscar em...{" "}
                <ChevronDownIcon aria-hidden="true" className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Documentação</DropdownMenuItem>
                  <DropdownMenuItem>Artigos do blog</DropdownMenuItem>
                  <DropdownMenuItem>Histórico de alterações</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  ),
}

export const Carregando: Story = {
  name: "Spinner",
  render: () => (
    <FieldGroup className="max-w-sm gap-4">
      <Field>
        <FieldLabel htmlFor="spinner-busca">Busca</FieldLabel>
        <InputGroup>
          <InputGroupInput id="spinner-busca" placeholder="Buscando..." />
          <InputGroupAddon align="inline-end">
            <Spinner aria-label="Buscando" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="spinner-processamento">Processamento</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="spinner-processamento"
            placeholder="Processando..."
          />
          <InputGroupAddon>
            <Spinner aria-label="Processando" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="spinner-salvar">Alterações</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="spinner-salvar"
            placeholder="Salvando alterações..."
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>Salvando...</InputGroupText>
            <Spinner aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="spinner-dados">Dados</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="spinner-dados"
            placeholder="Atualizando dados..."
            aria-describedby="spinner-dados-aviso"
          />
          <InputGroupAddon>
            <LoaderIcon
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText id="spinner-dados-aviso">Aguarde...</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  ),
}

export const AreaDeTexto: Story = {
  name: "Textarea",
  render: () => (
    <Field className="max-w-md">
      <FieldLabel htmlFor="textarea-codigo">Editor de código</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="textarea-codigo"
          placeholder="console.log('Olá, mundo!');"
          className="min-h-[200px]"
          aria-describedby="textarea-codigo-posicao"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText id="textarea-codigo-posicao">
            Linha 1, coluna 1
          </InputGroupText>
          <InputGroupButton size="sm" className="ms-auto" variant="default">
            Executar <CornerDownLeftIcon aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <FileCodeIcon aria-hidden="true" />
            script.js
          </InputGroupText>
          <InputGroupButton className="ms-auto" size="icon-xs">
            <RefreshCwIcon aria-hidden="true" />
            <span className="sr-only">Recarregar arquivo</span>
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs">
            <CopyIcon aria-hidden="true" />
            <span className="sr-only">Copiar código</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
}

export const Personalizado: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="personalizado-mensagem">Mensagem</FieldLabel>
      <InputGroup>
        <textarea
          id="personalizado-mensagem"
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-none bg-transparent px-2.5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm"
          placeholder="Escreva uma mensagem que cresce sozinha..."
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton className="ms-auto" size="sm" variant="default">
            Enviar
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const campo = await canvas.findByLabelText("E-mail")
    const grupo = campo.closest<HTMLElement>('[data-slot="input-group"]')!

    // At rest: only the border turns red, no ring.
    await expect(getComputedStyle(grupo).borderColor).toBe(
      corDoToken("--destructive")
    )

    // With focus: the ring is solid `destructive`, not the `ring` blue.
    await userEvent.tab()
    await expect(campo).toHaveFocus()
    await esperarAnimacoes()
    const sombra = getComputedStyle(grupo).boxShadow
    await expect(sombra).toContain(corDoToken("--destructive"))
    await expect(sombra).not.toContain(corDoToken("--ring"))
    await expect(getComputedStyle(grupo).borderColor).toBe(
      corDoToken("--destructive")
    )
  },
  render: () => (
    <Field data-invalid className="max-w-sm">
      <FieldLabel htmlFor="invalido-email">E-mail</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="invalido-email"
          type="email"
          defaultValue="maria@exemplo"
          aria-invalid
          aria-describedby="invalido-email-descricao invalido-email-erro"
          aria-errormessage="invalido-email-erro"
        />
        <InputGroupAddon>
          <MailIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription id="invalido-email-descricao">
        Vamos enviar as novidades para este endereço.
      </FieldDescription>
      <FieldError id="invalido-email-erro">
        Informe um e-mail completo, como nome@exemplo.com.
      </FieldError>
    </Field>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <FieldGroup className="max-w-sm gap-4">
        <Field>
          <FieldLabel htmlFor="rtl-busca">بحث</FieldLabel>
          <InputGroup className="max-w-xs">
            <InputGroupInput
              id="rtl-busca"
              placeholder="بحث..."
              aria-describedby="rtl-busca-resultados"
            />
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" id="rtl-busca-resultados">
              ١٢ نتيجة
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="rtl-estado">بحث متقدم</FieldLabel>
          <InputGroup>
            <InputGroupInput id="rtl-estado" placeholder="جاري البحث..." />
            <InputGroupAddon align="inline-end">
              <Spinner aria-label="جاري التحميل" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="rtl-salvar">تغييرات</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="rtl-salvar"
              placeholder="جاري حفظ التغييرات..."
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>جاري الحفظ...</InputGroupText>
              <Spinner aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="rtl-comentario">منطقة النص</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="rtl-comentario"
              placeholder="اكتب تعليقًا..."
              aria-describedby="rtl-comentario-contador rtl-comentario-descricao"
            />
            <InputGroupAddon align="block-end">
              <InputGroupText id="rtl-comentario-contador">
                ٠/٢٨٠
              </InputGroupText>
              <InputGroupButton variant="default" size="sm" className="ms-auto">
                نشر
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription id="rtl-comentario-descricao">
            تذييل موضع أسفل منطقة النص.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  ),
}
