import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"

/*
 * One story per section of switch.mdx, in the order of the shadcn/ui page.
 * Every switch has a persistent label tied by `htmlFor`/`id` (the choice card
 * ties it through the `FieldLabel` that wraps the whole `Field`). Ids are
 * prefixed with the story name: the Docs page renders all stories in the same
 * document.
 */
const meta = {
  title: "Componentes/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alternador = await canvas.findByRole("switch", { name: "Modo avião" })

    // Keyboard: Tab reaches the switch and Space toggles it.
    await userEvent.tab()
    await expect(alternador).toHaveFocus()
    await expect(alternador).toHaveAttribute("aria-checked", "false")
    await userEvent.keyboard(" ")
    await expect(alternador).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard(" ")
    await expect(alternador).toHaveAttribute("aria-checked", "false")
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="demo-modo-aviao" />
      <Label htmlFor="demo-modo-aviao">Modo avião</Label>
    </div>
  ),
}

export const Descricao: Story = {
  name: "Descrição",
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="descricao-modo-foco">
          Compartilhar entre dispositivos
        </FieldLabel>
        <FieldDescription id="descricao-modo-foco-descricao">
          O foco é compartilhado entre os dispositivos e é desativado quando
          você sai do aplicativo.
        </FieldDescription>
      </FieldContent>
      <Switch
        id="descricao-modo-foco"
        aria-describedby="descricao-modo-foco-descricao"
      />
    </Field>
  ),
}

export const CartaoDeEscolha: Story = {
  name: "Cartão de escolha",
  render: () => (
    <FieldGroup className="w-full max-w-sm">
      <FieldLabel htmlFor="cartao-compartilhar">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Compartilhar entre dispositivos</FieldTitle>
            <FieldDescription>
              O foco é compartilhado entre os dispositivos e é desativado quando
              você sai do aplicativo.
            </FieldDescription>
          </FieldContent>
          <Switch id="cartao-compartilhar" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="cartao-notificacoes">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Ativar notificações</FieldTitle>
            <FieldDescription>
              Receba notificações quando o modo foco for ativado ou desativado.
            </FieldDescription>
          </FieldContent>
          <Switch id="cartao-notificacoes" defaultChecked />
        </Field>
      </FieldLabel>
    </FieldGroup>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <FieldGroup className="w-fit">
      <Field orientation="horizontal" data-disabled className="w-fit">
        <Switch id="desabilitado-desligado" disabled />
        <FieldLabel htmlFor="desabilitado-desligado">Desabilitado</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-disabled className="w-fit">
        <Switch id="desabilitado-ligado" disabled defaultChecked />
        <FieldLabel htmlFor="desabilitado-ligado">
          Desabilitado e ligado
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  render: () => (
    <Field orientation="horizontal" className="max-w-sm" data-invalid>
      <FieldContent>
        <FieldLabel htmlFor="invalido-termos">
          Aceitar os termos e condições
        </FieldLabel>
        <FieldDescription id="invalido-termos-descricao">
          Você precisa aceitar os termos e condições para continuar.
        </FieldDescription>
        <FieldError id="invalido-termos-erro">
          Ligue esta opção para aceitar os termos.
        </FieldError>
      </FieldContent>
      <Switch
        id="invalido-termos"
        aria-invalid
        aria-describedby="invalido-termos-descricao invalido-termos-erro"
        aria-errormessage="invalido-termos-erro"
      />
    </Field>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <FieldGroup className="w-full max-w-[10rem]">
      <Field orientation="horizontal">
        <Switch id="tamanho-pequeno" size="sm" />
        <FieldLabel htmlFor="tamanho-pequeno">Pequeno</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="tamanho-padrao" size="default" />
        <FieldLabel htmlFor="tamanho-padrao">Padrão</FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Field orientation="horizontal" className="max-w-sm" dir="rtl">
        <FieldContent>
          <FieldLabel htmlFor="rtl-modo-foco" dir="rtl">
            المشاركة عبر الأجهزة
          </FieldLabel>
          <FieldDescription id="rtl-modo-foco-descricao" dir="rtl">
            يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة
            التطبيق.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="rtl-modo-foco"
          dir="rtl"
          aria-describedby="rtl-modo-foco-descricao"
        />
      </Field>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    size: "default",
    disabled: false,
    defaultChecked: false,
    "aria-invalid": false,
    "aria-label": "Modo avião",
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
}
