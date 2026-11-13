import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@workspace/ui/components/checkbox"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

/*
 * One story per section of label.mdx, in the order of the shadcn/ui page.
 * The "Label in Field" example of shadcn shows the Field with an Input; the
 * long Field demo it previews lives in the Field page.
 * Ids are prefixed with the story name: the Docs page renders all stories in
 * the same document.
 */
const meta = {
  title: "Componentes/Label",
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="flex gap-2">
      <Checkbox id="demo-termos" />
      <Label htmlFor="demo-termos">Aceito os termos e condições</Label>
    </div>
  ),
}

export const RotuloNoCampo: Story = {
  name: "Rótulo no Field",
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="campo-email">Seu endereço de e-mail</FieldLabel>
      <Input
        id="campo-email"
        type="email"
        placeholder="nome@exemplo.com"
        autoComplete="email"
      />
    </Field>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div className="flex gap-2" dir="rtl" lang="ar">
      <Checkbox id="rtl-termos" dir="rtl" />
      <Label htmlFor="rtl-termos" dir="rtl">
        قبول الشروط والأحكام
      </Label>
    </div>
  ),
}
