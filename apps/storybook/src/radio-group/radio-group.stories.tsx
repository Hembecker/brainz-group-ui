import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Label } from "@workspace/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"

/*
 * One story per section of radio-group.mdx, in the order of the shadcn/ui
 * page (Composition has no preview: it is a text tree in the MDX). Every
 * group has a name (aria-label, or FieldLegend in the fieldset stories) and
 * every item a persistent label (htmlFor <-> id). Ids are prefixed with the
 * story name: the Docs page renders all stories in the same document.
 */
const meta = {
  title: "Componentes/Radio Group",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <RadioGroup
      defaultValue="confortavel"
      aria-label="Densidade"
      className="w-fit"
    >
      <div className="flex items-center gap-3">
        <RadioGroupItem value="padrao" id="demo-padrao" />
        <Label htmlFor="demo-padrao">Padrão</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="confortavel" id="demo-confortavel" />
        <Label htmlFor="demo-confortavel">Confortável</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compacto" id="demo-compacto" />
        <Label htmlFor="demo-compacto">Compacto</Label>
      </div>
    </RadioGroup>
  ),
}

export const Descricao: Story = {
  name: "Descrição",
  render: () => (
    <RadioGroup
      defaultValue="confortavel"
      aria-label="Densidade"
      className="w-fit"
    >
      <Field orientation="horizontal">
        <RadioGroupItem
          value="padrao"
          id="descricao-padrao"
          aria-describedby="descricao-padrao-texto"
        />
        <FieldContent>
          <FieldLabel htmlFor="descricao-padrao">Padrão</FieldLabel>
          <FieldDescription id="descricao-padrao-texto">
            Espaçamento padrão para a maioria dos casos.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem
          value="confortavel"
          id="descricao-confortavel"
          aria-describedby="descricao-confortavel-texto"
        />
        <FieldContent>
          <FieldLabel htmlFor="descricao-confortavel">Confortável</FieldLabel>
          <FieldDescription id="descricao-confortavel-texto">
            Mais espaço entre os elementos.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem
          value="compacto"
          id="descricao-compacto"
          aria-describedby="descricao-compacto-texto"
        />
        <FieldContent>
          <FieldLabel htmlFor="descricao-compacto">Compacto</FieldLabel>
          <FieldDescription id="descricao-compacto-texto">
            Espaçamento mínimo para layouts densos.
          </FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  ),
}

export const CartaoDeEscolha: Story = {
  name: "Cartão de escolha",
  render: () => (
    <RadioGroup defaultValue="plus" aria-label="Plano" className="max-w-sm">
      <FieldLabel htmlFor="cartao-plus">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Plus</FieldTitle>
            <FieldDescription>
              Para pessoas e equipes pequenas.
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="plus" id="cartao-plus" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="cartao-pro">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>Para empresas em crescimento.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="cartao-pro" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="cartao-enterprise">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Enterprise</FieldTitle>
            <FieldDescription>
              Para grandes equipes e corporações.
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="enterprise" id="cartao-enterprise" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  ),
}

export const ConjuntoDeCampos: Story = {
  name: "Conjunto de campos",
  render: () => (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Plano de assinatura</FieldLegend>
      <FieldDescription id="conjunto-descricao">
        Os planos anual e vitalício oferecem uma economia significativa.
      </FieldDescription>
      <RadioGroup defaultValue="mensal" aria-describedby="conjunto-descricao">
        <Field orientation="horizontal">
          <RadioGroupItem value="mensal" id="conjunto-mensal" />
          <FieldLabel htmlFor="conjunto-mensal" className="font-normal">
            Mensal (R$ 49,90/mês)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="anual" id="conjunto-anual" />
          <FieldLabel htmlFor="conjunto-anual" className="font-normal">
            Anual (R$ 499,90/ano)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="vitalicio" id="conjunto-vitalicio" />
          <FieldLabel htmlFor="conjunto-vitalicio" className="font-normal">
            Vitalício (R$ 1.499,90)
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <RadioGroup defaultValue="opcao-2" aria-label="Opções" className="w-fit">
      <Field orientation="horizontal" data-disabled>
        <RadioGroupItem value="opcao-1" id="desabilitado-1" disabled />
        <FieldLabel htmlFor="desabilitado-1" className="font-normal">
          Desabilitada
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="opcao-2" id="desabilitado-2" />
        <FieldLabel htmlFor="desabilitado-2" className="font-normal">
          Opção 2
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="opcao-3" id="desabilitado-3" />
        <FieldLabel htmlFor="desabilitado-3" className="font-normal">
          Opção 3
        </FieldLabel>
      </Field>
    </RadioGroup>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  render: () => (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Preferências de notificação</FieldLegend>
      <FieldDescription id="invalido-descricao">
        Escolha como você quer receber as notificações.
      </FieldDescription>
      <RadioGroup
        defaultValue="email"
        aria-invalid
        aria-describedby="invalido-descricao invalido-erro"
        aria-errormessage="invalido-erro"
      >
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="email" id="invalido-email" aria-invalid />
          <FieldLabel htmlFor="invalido-email" className="font-normal">
            Somente e-mail
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="sms" id="invalido-sms" aria-invalid />
          <FieldLabel htmlFor="invalido-sms" className="font-normal">
            Somente SMS
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="ambos" id="invalido-ambos" aria-invalid />
          <FieldLabel htmlFor="invalido-ambos" className="font-normal">
            E-mail e SMS
          </FieldLabel>
        </Field>
      </RadioGroup>
      <FieldError id="invalido-erro">
        Escolha uma opção compatível com a sua conta.
      </FieldError>
    </FieldSet>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const confortavel = await canvas.findByRole("radio", { name: "مريح" })
    const compacto = canvas.getByRole("radio", { name: "مضغوط" })

    // In RTL the horizontal axis is mirrored: ArrowLeft goes to the next item.
    confortavel.focus()
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() =>
      expect(compacto).toHaveAttribute("aria-checked", "true")
    )
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <RadioGroup
          defaultValue="confortavel"
          aria-label="الكثافة"
          className="w-fit"
          dir="rtl"
        >
          <Field orientation="horizontal">
            <RadioGroupItem
              value="padrao"
              id="rtl-padrao"
              aria-describedby="rtl-padrao-texto"
              dir="rtl"
            />
            <FieldContent>
              <FieldLabel htmlFor="rtl-padrao" dir="rtl">
                افتراضي
              </FieldLabel>
              <FieldDescription id="rtl-padrao-texto" dir="rtl">
                تباعد قياسي لمعظم حالات الاستخدام.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem
              value="confortavel"
              id="rtl-confortavel"
              aria-describedby="rtl-confortavel-texto"
              dir="rtl"
            />
            <FieldContent>
              <FieldLabel htmlFor="rtl-confortavel" dir="rtl">
                مريح
              </FieldLabel>
              <FieldDescription id="rtl-confortavel-texto" dir="rtl">
                مساحة أكبر بين العناصر.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem
              value="compacto"
              id="rtl-compacto"
              aria-describedby="rtl-compacto-texto"
              dir="rtl"
            />
            <FieldContent>
              <FieldLabel htmlFor="rtl-compacto" dir="rtl">
                مضغوط
              </FieldLabel>
              <FieldDescription id="rtl-compacto-texto" dir="rtl">
                تباعد أدنى للتخطيطات الكثيفة.
              </FieldDescription>
            </FieldContent>
          </Field>
        </RadioGroup>
      </div>
    </DirectionProvider>
  ),
}
