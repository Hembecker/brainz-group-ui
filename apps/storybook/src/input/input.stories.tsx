import type { Meta, StoryObj } from "@storybook/react-vite"
import { InfoIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/input-group"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

/*
 * One story per section of input.mdx, in the order of the shadcn/ui page.
 * Every field has a persistent label (Basic uses a plain Label; the search
 * field uses aria-label because the button next to it names the purpose).
 * Ids are prefixed with the story name: the Docs page renders all stories in
 * the same document.
 */
const meta = {
  title: "Componentes/Input",
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="demo-chave-api">Chave de API</FieldLabel>
      <Input
        id="demo-chave-api"
        type="password"
        placeholder="sk-..."
        aria-describedby="demo-chave-api-descricao"
      />
      <FieldDescription id="demo-chave-api-descricao">
        Sua chave de API é criptografada e guardada com segurança.
      </FieldDescription>
    </Field>
  ),
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <div className="flex max-w-xs flex-col gap-3">
      <Label htmlFor="basico-texto">Nome do projeto</Label>
      <Input id="basico-texto" placeholder="Digite um texto" />
    </div>
  ),
}

export const Campo: Story = {
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="campo-usuario">Nome de usuário</FieldLabel>
      <Input
        id="campo-usuario"
        type="text"
        placeholder="Digite seu nome de usuário"
        autoComplete="username"
        aria-describedby="campo-usuario-descricao"
      />
      <FieldDescription id="campo-usuario-descricao">
        Escolha um nome de usuário único para a sua conta.
      </FieldDescription>
    </Field>
  ),
}

export const GrupoDeCampos: Story = {
  name: "Grupo de campos",
  render: () => (
    <FieldGroup className="max-w-xs">
      <Field>
        <FieldLabel htmlFor="grupo-nome">Nome</FieldLabel>
        <Input id="grupo-nome" placeholder="Joana Lima" autoComplete="name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="grupo-email">E-mail</FieldLabel>
        <Input
          id="grupo-email"
          type="email"
          placeholder="nome@exemplo.com"
          autoComplete="email"
          aria-describedby="grupo-email-descricao"
        />
        <FieldDescription id="grupo-email-descricao">
          Vamos enviar as novidades para este endereço.
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Limpar
        </Button>
        <Button type="submit">Enviar</Button>
      </Field>
    </FieldGroup>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <Field data-disabled className="max-w-xs">
      <FieldLabel htmlFor="desabilitado-email">E-mail</FieldLabel>
      <Input
        id="desabilitado-email"
        type="email"
        placeholder="nome@exemplo.com"
        disabled
        aria-describedby="desabilitado-email-descricao"
      />
      <FieldDescription id="desabilitado-email-descricao">
        Este campo está desabilitado no momento.
      </FieldDescription>
    </Field>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  render: () => (
    <Field data-invalid className="max-w-xs">
      <FieldLabel htmlFor="invalido-email">E-mail</FieldLabel>
      <Input
        id="invalido-email"
        type="email"
        defaultValue="joana@exemplo"
        aria-invalid
        aria-describedby="invalido-email-descricao invalido-email-erro"
        aria-errormessage="invalido-email-erro"
      />
      <FieldDescription id="invalido-email-descricao">
        Vamos enviar as novidades para este endereço.
      </FieldDescription>
      <FieldError id="invalido-email-erro">
        Informe um e-mail completo, como nome@exemplo.com.
      </FieldError>
    </Field>
  ),
}

export const Arquivo: Story = {
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="arquivo-foto">Foto do perfil</FieldLabel>
      <Input
        id="arquivo-foto"
        type="file"
        accept="image/*"
        aria-describedby="arquivo-foto-descricao"
      />
      <FieldDescription id="arquivo-foto-descricao">
        Escolha uma imagem para enviar.
      </FieldDescription>
    </Field>
  ),
}

export const EmLinha: Story = {
  name: "Em linha",
  render: () => (
    <form
      role="search"
      className="max-w-xs"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field orientation="horizontal">
        <Input type="search" placeholder="Buscar..." aria-label="Buscar" />
        <Button type="submit">Buscar</Button>
      </Field>
    </form>
  ),
}

export const Grade: Story = {
  render: () => (
    <FieldGroup className="grid max-w-sm grid-cols-2">
      <Field>
        <FieldLabel htmlFor="grade-nome">Nome</FieldLabel>
        <Input id="grade-nome" placeholder="Joana" autoComplete="given-name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="grade-sobrenome">Sobrenome</FieldLabel>
        <Input
          id="grade-sobrenome"
          placeholder="Lima"
          autoComplete="family-name"
        />
      </Field>
    </FieldGroup>
  ),
}

export const Obrigatorio: Story = {
  name: "Obrigatório",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="obrigatorio-campo">
        Campo obrigatório{" "}
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      </FieldLabel>
      <Input
        id="obrigatorio-campo"
        placeholder="Este campo é obrigatório"
        required
        aria-describedby="obrigatorio-campo-descricao"
      />
      <FieldDescription id="obrigatorio-campo-descricao">
        Este campo precisa ser preenchido.
      </FieldDescription>
    </Field>
  ),
}

export const EtiquetaBadge: Story = {
  name: "Badge",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="badge-webhook">
        URL do webhook{" "}
        <Badge variant="secondary" className="ms-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input
        id="badge-webhook"
        type="url"
        placeholder="https://api.exemplo.com/webhook"
      />
    </Field>
  ),
}

export const GrupoDeInput: Story = {
  name: "Input Group",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="input-group-url">URL do site</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="input-group-url"
          placeholder="exemplo.com"
          aria-describedby="input-group-url-prefixo"
        />
        <InputGroupAddon>
          <InputGroupText id="input-group-url-prefixo">https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InfoIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
}

export const GrupoDeBotoes: Story = {
  name: "Button Group",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="button-group-busca">Buscar</FieldLabel>
      <ButtonGroup aria-label="Busca">
        <Input id="button-group-busca" placeholder="Digite para buscar..." />
        <Button variant="outline">Buscar</Button>
      </ButtonGroup>
    </Field>
  ),
}

export const Formulario: Story = {
  name: "Formulário",
  render: () => (
    <form
      className="w-full max-w-sm"
      onSubmit={(event) => event.preventDefault()}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="formulario-nome">Nome</FieldLabel>
          <Input
            id="formulario-nome"
            type="text"
            placeholder="Joana Lima"
            autoComplete="name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="formulario-email">E-mail</FieldLabel>
          <Input
            id="formulario-email"
            type="email"
            placeholder="joana@exemplo.com"
            autoComplete="email"
            aria-describedby="formulario-email-descricao"
          />
          <FieldDescription id="formulario-email-descricao">
            Nunca vamos compartilhar o seu e-mail com ninguém.
          </FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="formulario-telefone">Telefone</FieldLabel>
            <Input
              id="formulario-telefone"
              type="tel"
              placeholder="(11) 91234-5678"
              autoComplete="tel"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="formulario-pais">País</FieldLabel>
            <Select
              defaultValue="br"
              items={[
                { label: "Brasil", value: "br" },
                { label: "Portugal", value: "pt" },
                { label: "Angola", value: "ao" },
              ]}
            >
              <SelectTrigger id="formulario-pais">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="br">Brasil</SelectItem>
                  <SelectItem value="pt">Portugal</SelectItem>
                  <SelectItem value="ao">Angola</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="formulario-endereco">Endereço</FieldLabel>
          <Input
            id="formulario-endereco"
            type="text"
            placeholder="Rua das Flores, 123"
            autoComplete="street-address"
          />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Enviar</Button>
        </Field>
      </FieldGroup>
    </form>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Field className="max-w-xs">
        <FieldLabel htmlFor="rtl-chave-api">مفتاح API</FieldLabel>
        <Input
          id="rtl-chave-api"
          type="password"
          placeholder="sk-..."
          dir="rtl"
          aria-describedby="rtl-chave-api-descricao"
        />
        <FieldDescription id="rtl-chave-api-descricao">
          مفتاح API الخاص بك مشفر ومخزن بأمان.
        </FieldDescription>
      </Field>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    type: "text",
    placeholder: "Digite um texto",
    "aria-label": "Campo de exemplo",
    disabled: false,
    required: false,
    "aria-invalid": false,
    className: "max-w-xs",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url", "number"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
}
