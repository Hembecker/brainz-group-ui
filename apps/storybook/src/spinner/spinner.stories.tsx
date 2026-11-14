import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpIcon, LoaderIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Spinner } from "@workspace/ui/components/spinner"

/*
 * One story per section of spinner.mdx, in the order of the shadcn/ui page.
 * The Spinner has `role="status"` and a default name ("Carregando"); where the
 * context says what is loading, the story passes a specific `aria-label`.
 * The fields of the InputGroup example have an `aria-label` (they are
 * disabled while the spinner runs, and the placeholder is not a label).
 * EmptyTitle is a <div>, so its title has a heading inside it.
 */
const meta = {
  title: "Componentes/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Item variant="muted">
        <ItemMedia>
          <Spinner aria-label="Processando o pagamento" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            Processando o pagamento...
          </ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-sm tabular-nums">R$ 100,00</span>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const Personalizacao: Story = {
  name: "Personalização",
  render: () => (
    <div className="flex items-center gap-4">
      <LoaderIcon
        role="status"
        aria-label="Carregando"
        className="size-4 animate-spin motion-reduce:animate-none"
      />
    </div>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}

export const NoBotao: Story = {
  name: "Button",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Carregando...
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Aguarde
      </Button>
      <Button variant="secondary" disabled>
        Processando
        <Spinner data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const NoBadge: Story = {
  name: "Badge",
  render: () => (
    <div className="flex items-center gap-4 [--radius:1.2rem]">
      <Badge>
        <Spinner data-icon="inline-start" />
        Sincronizando
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Atualizando
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Processando
      </Badge>
    </div>
  ),
}

export const NoGrupoDeEntrada: Story = {
  name: "Input Group",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          aria-label="Mensagem"
          placeholder="Enviar uma mensagem..."
          disabled
        />
        <InputGroupAddon align="inline-end">
          <Spinner aria-label="Enviando a mensagem" />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea
          aria-label="Mensagem longa"
          placeholder="Enviar uma mensagem..."
          disabled
        />
        <InputGroupAddon align="block-end">
          <Spinner aria-label="Validando a mensagem" /> Validando...
          <InputGroupButton className="ms-auto" variant="default">
            <ArrowUpIcon aria-hidden="true" />
            <span className="sr-only">Enviar</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const NoVazio: Story = {
  name: "Empty",
  render: () => (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner aria-label="Processando a solicitação" />
        </EmptyMedia>
        <EmptyTitle>
          <h3>Processando a sua solicitação</h3>
        </EmptyTitle>
        <EmptyDescription>
          Aguarde enquanto processamos a sua solicitação. Não atualize a página.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Cancelar
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div
      dir="rtl"
      lang="ar"
      className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]"
    >
      <Item variant="muted" dir="rtl">
        <ItemMedia>
          <Spinner aria-label="جاري معالجة الدفع" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">جاري معالجة الدفع...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-sm tabular-nums">١٠٠.٠٠ دولار</span>
        </ItemContent>
      </Item>
    </div>
  ),
}
