import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Textarea } from "@workspace/ui/components/textarea"

/*
 * One story per section of textarea.mdx, in the order of the shadcn/ui page.
 * Every textarea has a persistent label (Field + FieldLabel htmlFor <-> id),
 * except the one next to a button, which is named by aria-label.
 * Ids are prefixed with the story name: the Docs page renders all stories in
 * the same document.
 */
const meta = {
  title: "Componentes/Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="demo-mensagem">Mensagem</FieldLabel>
      <Textarea id="demo-mensagem" placeholder="Digite sua mensagem aqui." />
    </Field>
  ),
}

export const Campo: Story = {
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="campo-mensagem">Mensagem</FieldLabel>
      <FieldDescription id="campo-mensagem-descricao">
        Escreva sua mensagem abaixo.
      </FieldDescription>
      <Textarea
        id="campo-mensagem"
        placeholder="Digite sua mensagem aqui."
        aria-describedby="campo-mensagem-descricao"
      />
    </Field>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <Field data-disabled className="max-w-xs">
      <FieldLabel htmlFor="desabilitado-mensagem">Mensagem</FieldLabel>
      <Textarea
        id="desabilitado-mensagem"
        placeholder="Digite sua mensagem aqui."
        disabled
        aria-describedby="desabilitado-mensagem-descricao"
      />
      <FieldDescription id="desabilitado-mensagem-descricao">
        Este campo está desabilitado no momento.
      </FieldDescription>
    </Field>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  render: () => (
    <Field data-invalid className="max-w-xs">
      <FieldLabel htmlFor="invalido-mensagem">Mensagem</FieldLabel>
      <Textarea
        id="invalido-mensagem"
        defaultValue="Oi"
        aria-invalid
        aria-describedby="invalido-mensagem-erro"
        aria-errormessage="invalido-mensagem-erro"
      />
      <FieldError id="invalido-mensagem-erro">
        Escreva uma mensagem com pelo menos 10 caracteres.
      </FieldError>
    </Field>
  ),
}

export const Botao: Story = {
  name: "Botão",
  render: () => (
    <form
      className="grid w-full max-w-xs gap-2"
      onSubmit={(event) => event.preventDefault()}
    >
      <Textarea placeholder="Digite sua mensagem aqui." aria-label="Mensagem" />
      <Button type="submit">Enviar mensagem</Button>
    </form>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Field className="w-full max-w-xs" dir="rtl">
        <FieldLabel htmlFor="rtl-comentarios" dir="rtl">
          التعليقات
        </FieldLabel>
        <Textarea
          id="rtl-comentarios"
          placeholder="تعليقاتك تساعدنا على التحسين..."
          dir="rtl"
          rows={4}
          aria-describedby="rtl-comentarios-descricao"
        />
        <FieldDescription id="rtl-comentarios-descricao" dir="rtl">
          شاركنا أفكارك حول خدمتنا.
        </FieldDescription>
      </Field>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    placeholder: "Digite sua mensagem aqui.",
    "aria-label": "Campo de exemplo",
    rows: 3,
    disabled: false,
    required: false,
    "aria-invalid": false,
    className: "max-w-xs",
  },
  argTypes: {
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 10 } },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
}
