import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@workspace/ui/components/native-select"

/*
 * One story per section of native-select.mdx, in the order of the shadcn/ui
 * page. Every select has a persistent label (Field + FieldLabel htmlFor <-> id;
 * the id goes on the <select>, not on the wrapper). Ids are prefixed with the
 * story name: the Docs page renders all stories in the same document.
 */
const meta = {
  title: "Componentes/Native Select",
  component: NativeSelect,
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="demo-status">Status</FieldLabel>
      <NativeSelect id="demo-status">
        <NativeSelectOption value="">Selecione o status</NativeSelectOption>
        <NativeSelectOption value="todo">A fazer</NativeSelectOption>
        <NativeSelectOption value="in-progress">
          Em andamento
        </NativeSelectOption>
        <NativeSelectOption value="done">Concluído</NativeSelectOption>
        <NativeSelectOption value="cancelled">Cancelado</NativeSelectOption>
      </NativeSelect>
    </Field>
  ),
}

export const Grupos: Story = {
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="grupos-departamento">Departamento</FieldLabel>
      <NativeSelect id="grupos-departamento">
        <NativeSelectOption value="">
          Selecione o departamento
        </NativeSelectOption>
        <NativeSelectOptGroup label="Engenharia">
          <NativeSelectOption value="frontend">Front-end</NativeSelectOption>
          <NativeSelectOption value="backend">Back-end</NativeSelectOption>
          <NativeSelectOption value="devops">DevOps</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Vendas">
          <NativeSelectOption value="sales-rep">
            Representante de vendas
          </NativeSelectOption>
          <NativeSelectOption value="account-manager">
            Gerente de contas
          </NativeSelectOption>
          <NativeSelectOption value="sales-director">
            Diretor de vendas
          </NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Operações">
          <NativeSelectOption value="support">
            Atendimento ao cliente
          </NativeSelectOption>
          <NativeSelectOption value="product-manager">
            Gerente de produto
          </NativeSelectOption>
          <NativeSelectOption value="ops-manager">
            Gerente de operações
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </Field>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <Field data-disabled className="w-fit">
      <FieldLabel htmlFor="desabilitado-fruta">Fruta</FieldLabel>
      <NativeSelect
        id="desabilitado-fruta"
        disabled
        aria-describedby="desabilitado-fruta-descricao"
      >
        <NativeSelectOption value="">Desabilitado</NativeSelectOption>
        <NativeSelectOption value="apple">Maçã</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Mirtilo</NativeSelectOption>
      </NativeSelect>
      <FieldDescription id="desabilitado-fruta-descricao">
        Este campo está desabilitado no momento.
      </FieldDescription>
    </Field>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  render: () => (
    <Field data-invalid className="w-fit">
      <FieldLabel htmlFor="invalido-fruta">Fruta</FieldLabel>
      <NativeSelect
        id="invalido-fruta"
        aria-invalid="true"
        aria-describedby="invalido-fruta-erro"
        aria-errormessage="invalido-fruta-erro"
      >
        <NativeSelectOption value="">Estado de erro</NativeSelectOption>
        <NativeSelectOption value="apple">Maçã</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Mirtilo</NativeSelectOption>
      </NativeSelect>
      <FieldError id="invalido-fruta-erro">
        Escolha uma fruta da lista.
      </FieldError>
    </Field>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Field dir="rtl" className="w-fit">
        <FieldLabel htmlFor="rtl-status" dir="rtl">
          الحالة
        </FieldLabel>
        <NativeSelect id="rtl-status" dir="rtl">
          <NativeSelectOption value="">اختر الحالة</NativeSelectOption>
          <NativeSelectOption value="todo">مهام</NativeSelectOption>
          <NativeSelectOption value="in-progress">
            قيد التنفيذ
          </NativeSelectOption>
          <NativeSelectOption value="done">منجز</NativeSelectOption>
          <NativeSelectOption value="cancelled">ملغي</NativeSelectOption>
        </NativeSelect>
      </Field>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    size: "default",
    "aria-label": "Status",
    disabled: false,
    required: false,
    "aria-invalid": false,
    children: [
      <NativeSelectOption key="" value="">
        Selecione o status
      </NativeSelectOption>,
      <NativeSelectOption key="todo" value="todo">
        A fazer
      </NativeSelectOption>,
      <NativeSelectOption key="done" value="done">
        Concluído
      </NativeSelectOption>,
    ],
  },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
}
