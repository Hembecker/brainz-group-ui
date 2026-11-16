import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Label } from "@workspace/ui/components/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

/*
 * One story per section of checkbox.mdx, in the order of the shadcn/ui page.
 * "Checked State" has no preview on the shadcn page (only code), so it has no
 * story: its snippet is in the MDX. Every checkbox has a persistent label
 * (FieldLabel/Label htmlFor <-> id) or, in the table, an aria-label naming the
 * row. Ids are prefixed with the story name: the Docs page renders all stories
 * in the same document.
 */
const meta = {
  title: "Componentes/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="demo-termos" name="demo-termos" />
        <Label htmlFor="demo-termos">Aceitar os termos e condições</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="demo-termos-2"
          name="demo-termos-2"
          defaultChecked
          aria-describedby="demo-termos-2-texto"
        />
        <FieldContent>
          <FieldLabel htmlFor="demo-termos-2">
            Aceitar os termos e condições
          </FieldLabel>
          <FieldDescription id="demo-termos-2-texto">
            Ao marcar esta caixa, você concorda com os termos.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="demo-notificacoes" name="demo-notificacoes" disabled />
        <FieldLabel htmlFor="demo-notificacoes">Ativar notificações</FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox
            id="demo-notificacoes-2"
            name="demo-notificacoes-2"
            aria-describedby="demo-notificacoes-2-texto"
          />
          <FieldContent>
            <FieldTitle>Ativar notificações</FieldTitle>
            <FieldDescription id="demo-notificacoes-2-texto">
              Você pode ativar ou desativar as notificações a qualquer momento.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  render: () => (
    <FieldGroup className="max-w-xs">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="invalido-termos"
          name="invalido-termos"
          aria-invalid
          aria-describedby="invalido-termos-erro"
          aria-errormessage="invalido-termos-erro"
        />
        <FieldContent>
          <FieldLabel htmlFor="invalido-termos">
            Aceitar os termos e condições
          </FieldLabel>
          <FieldError id="invalido-termos-erro">
            Você precisa aceitar os termos para continuar.
          </FieldError>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <FieldGroup className="max-w-xs">
      <Field orientation="horizontal">
        <Checkbox id="basico-termos" name="basico-termos" />
        <FieldLabel htmlFor="basico-termos">
          Aceitar os termos e condições
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const Descricao: Story = {
  name: "Descrição",
  render: () => (
    <FieldGroup className="max-w-xs">
      <Field orientation="horizontal">
        <Checkbox
          id="descricao-termos"
          name="descricao-termos"
          defaultChecked
          aria-describedby="descricao-termos-texto"
        />
        <FieldContent>
          <FieldLabel htmlFor="descricao-termos">
            Aceitar os termos e condições
          </FieldLabel>
          <FieldDescription id="descricao-termos-texto">
            Ao marcar esta caixa, você concorda com os termos e condições.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <FieldGroup className="max-w-xs">
      <Field orientation="horizontal" data-disabled>
        <Checkbox
          id="desabilitado-notificacoes"
          name="desabilitado-notificacoes"
          disabled
        />
        <FieldLabel htmlFor="desabilitado-notificacoes">
          Ativar notificações
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const Grupo: Story = {
  render: () => (
    <FieldSet aria-describedby="grupo-descricao">
      <FieldLegend variant="label">
        Mostrar estes itens na área de trabalho:
      </FieldLegend>
      <FieldDescription id="grupo-descricao">
        Escolha os itens que você quer ver na área de trabalho.
      </FieldDescription>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox id="grupo-discos" name="grupo-discos" defaultChecked />
          <FieldLabel htmlFor="grupo-discos" className="font-normal">
            Discos rígidos
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="grupo-externos" name="grupo-externos" defaultChecked />
          <FieldLabel htmlFor="grupo-externos" className="font-normal">
            Discos externos
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="grupo-midias" name="grupo-midias" />
          <FieldLabel htmlFor="grupo-midias" className="font-normal">
            CDs e DVDs
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="grupo-servidores" name="grupo-servidores" />
          <FieldLabel htmlFor="grupo-servidores" className="font-normal">
            Servidores conectados
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const Tabela: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">
            <Checkbox
              id="tabela-todos"
              name="tabela-todos"
              indeterminate
              aria-label="Selecionar todas as pessoas"
            />
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Papel</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell>
            <Checkbox
              id="tabela-linha-1"
              name="tabela-linha-1"
              defaultChecked
              aria-label="Selecionar Sarah Chen"
            />
          </TableCell>
          <TableCell className="font-medium">Sarah Chen</TableCell>
          <TableCell>sarah.chen@exemplo.com</TableCell>
          <TableCell>Administradora</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox
              id="tabela-linha-2"
              name="tabela-linha-2"
              aria-label="Selecionar Marcus Rodriguez"
            />
          </TableCell>
          <TableCell className="font-medium">Marcus Rodriguez</TableCell>
          <TableCell>marcus.rodriguez@exemplo.com</TableCell>
          <TableCell>Usuário</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox
              id="tabela-linha-3"
              name="tabela-linha-3"
              aria-label="Selecionar Priya Patel"
            />
          </TableCell>
          <TableCell className="font-medium">Priya Patel</TableCell>
          <TableCell>priya.patel@exemplo.com</TableCell>
          <TableCell>Usuário</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox
              id="tabela-linha-4"
              name="tabela-linha-4"
              aria-label="Selecionar David Kim"
            />
          </TableCell>
          <TableCell className="font-medium">David Kim</TableCell>
          <TableCell>david.kim@exemplo.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <FieldGroup className="max-w-sm">
        <Field orientation="horizontal">
          <Checkbox id="rtl-termos" name="rtl-termos" />
          <Label htmlFor="rtl-termos">قبول الشروط والأحكام</Label>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="rtl-termos-2"
            name="rtl-termos-2"
            defaultChecked
            aria-describedby="rtl-termos-2-texto"
          />
          <FieldContent>
            <FieldLabel htmlFor="rtl-termos-2">قبول الشروط والأحكام</FieldLabel>
            <FieldDescription id="rtl-termos-2-texto">
              بالنقر على هذا المربع، فإنك توافق على الشروط.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="rtl-notificacoes" name="rtl-notificacoes" disabled />
          <FieldLabel htmlFor="rtl-notificacoes">تفعيل الإشعارات</FieldLabel>
        </Field>
        <FieldLabel>
          <Field orientation="horizontal">
            <Checkbox
              id="rtl-notificacoes-2"
              name="rtl-notificacoes-2"
              aria-describedby="rtl-notificacoes-2-texto"
            />
            <FieldContent>
              <FieldTitle>تفعيل الإشعارات</FieldTitle>
              <FieldDescription id="rtl-notificacoes-2-texto">
                يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    "aria-label": "Caixa de exemplo",
    defaultChecked: false,
    disabled: false,
    required: false,
    "aria-invalid": false,
  },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
}
