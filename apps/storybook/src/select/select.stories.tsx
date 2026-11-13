import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

/*
 * One story per section of select.mdx, in the order of the shadcn/ui page.
 * The shadcn examples have no visible label; here every trigger has a
 * persistent `FieldLabel` tied to it by `htmlFor`/`id` (the label names the
 * trigger, which is a `<button role="combobox">`).
 *
 * A closed list is invisible to axe, so every story has a `play` that opens
 * it first (the test runs axe after `play`). `abrirLista` finds the trigger by
 * role and name, waits for the listbox (it is in a portal, so it is queried
 * with `screen`) and for the enter animation to end, because axe would
 * measure contrast mid-fade. Ids are prefixed with the story name: the Docs
 * page renders all stories in the same document.
 */
const meta = {
  title: "Componentes/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

async function abrirLista(canvasElement: HTMLElement, nome: string) {
  const canvas = within(canvasElement)
  const gatilho = await canvas.findByRole("combobox", { name: nome })
  await userEvent.click(gatilho)
  const lista = await screen.findByRole("listbox")
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(lista).toBeVisible())
  return { gatilho, lista }
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    // Opens by click: the listbox appears and the focus goes into it.
    const { gatilho } = await abrirLista(canvasElement, "Fruta")
    await waitFor(() =>
      expect(screen.getByRole("listbox")).toContainElement(
        document.activeElement as HTMLElement
      )
    )

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await abrirLista(canvasElement, "Fruta")
  },
  render: () => (
    <Field className="w-full max-w-48">
      <FieldLabel htmlFor="demo-fruta">Fruta</FieldLabel>
      <Select
        items={[
          { label: "Selecione uma fruta", value: null },
          { label: "Maçã", value: "maca" },
          { label: "Banana", value: "banana" },
          { label: "Mirtilo", value: "mirtilo" },
          { label: "Uva", value: "uva" },
          { label: "Abacaxi", value: "abacaxi" },
        ]}
      >
        <SelectTrigger id="demo-fruta" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frutas</SelectLabel>
            <SelectItem value={null}>Selecione uma fruta</SelectItem>
            <SelectItem value="maca">Maçã</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="mirtilo">Mirtilo</SelectItem>
            <SelectItem value="uva">Uva</SelectItem>
            <SelectItem value="abacaxi">Abacaxi</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
}

export const AlinharItemComGatilho: Story = {
  name: "Alinhar item com o gatilho",
  play: async ({ canvasElement }) => {
    // The second select is the one that does not align the list with the
    // trigger: opening it sends the animated popup through axe.
    await abrirLista(canvasElement, "Alinhado à borda")
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
      <Field>
        <FieldLabel htmlFor="alinhar-sim">Alinhado ao gatilho</FieldLabel>
        <Select
          defaultValue="banana"
          items={[
            { label: "Maçã", value: "maca" },
            { label: "Banana", value: "banana" },
            { label: "Mirtilo", value: "mirtilo" },
            { label: "Uva", value: "uva" },
            { label: "Abacaxi", value: "abacaxi" },
          ]}
        >
          <SelectTrigger id="alinhar-sim" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger>
            <SelectGroup>
              <SelectItem value="maca">Maçã</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="mirtilo">Mirtilo</SelectItem>
              <SelectItem value="uva">Uva</SelectItem>
              <SelectItem value="abacaxi">Abacaxi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="alinhar-nao">Alinhado à borda</FieldLabel>
        <Select
          defaultValue="banana"
          items={[
            { label: "Maçã", value: "maca" },
            { label: "Banana", value: "banana" },
            { label: "Mirtilo", value: "mirtilo" },
            { label: "Uva", value: "uva" },
            { label: "Abacaxi", value: "abacaxi" },
          ]}
        >
          <SelectTrigger id="alinhar-nao" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              <SelectItem value="maca">Maçã</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="mirtilo">Mirtilo</SelectItem>
              <SelectItem value="uva">Uva</SelectItem>
              <SelectItem value="abacaxi">Abacaxi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
}

export const Grupos: Story = {
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Alimento")
  },
  render: () => (
    <Field className="w-full max-w-48">
      <FieldLabel htmlFor="grupos-alimento">Alimento</FieldLabel>
      <Select
        items={[
          { label: "Selecione um alimento", value: null },
          { label: "Maçã", value: "maca" },
          { label: "Banana", value: "banana" },
          { label: "Mirtilo", value: "mirtilo" },
          { label: "Cenoura", value: "cenoura" },
          { label: "Brócolis", value: "brocolis" },
          { label: "Espinafre", value: "espinafre" },
        ]}
      >
        <SelectTrigger id="grupos-alimento" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frutas</SelectLabel>
            <SelectItem value="maca">Maçã</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="mirtilo">Mirtilo</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Legumes e verduras</SelectLabel>
            <SelectItem value="cenoura">Cenoura</SelectItem>
            <SelectItem value="brocolis">Brócolis</SelectItem>
            <SelectItem value="espinafre">Espinafre</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
}

export const Rolagem: Story = {
  name: "Com rolagem",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Fuso horário")
  },
  render: () => (
    <Field className="w-full max-w-64">
      <FieldLabel htmlFor="rolagem-fuso">Fuso horário</FieldLabel>
      <Select
        items={[
          { label: "Selecione um fuso horário", value: null },
          { label: "Horário Padrão do Leste", value: "est" },
          { label: "Horário Padrão Central", value: "cst" },
          { label: "Horário Padrão das Montanhas", value: "mst" },
          { label: "Horário Padrão do Pacífico", value: "pst" },
          { label: "Horário Padrão do Alasca", value: "akst" },
          { label: "Horário Padrão do Havaí", value: "hst" },
          { label: "Horário do Meridiano de Greenwich", value: "gmt" },
          { label: "Horário da Europa Central", value: "cet" },
          { label: "Horário da Europa Oriental", value: "eet" },
          { label: "Horário de Verão da Europa Ocidental", value: "west" },
          { label: "Horário da África Central", value: "cat" },
          { label: "Horário da África Oriental", value: "eat" },
          { label: "Horário de Moscou", value: "msk" },
          { label: "Horário Padrão da Índia", value: "ist" },
          { label: "Horário Padrão da China", value: "cst_china" },
          { label: "Horário Padrão do Japão", value: "jst" },
          { label: "Horário Padrão da Coreia", value: "kst" },
          { label: "Horário Padrão da Indonésia Central", value: "wita" },
          { label: "Horário Padrão da Austrália Ocidental", value: "awst" },
          { label: "Horário Padrão da Austrália Central", value: "acst" },
          { label: "Horário Padrão da Austrália Oriental", value: "aest" },
          { label: "Horário Padrão da Nova Zelândia", value: "nzst" },
          { label: "Horário de Fiji", value: "fjt" },
          { label: "Horário da Argentina", value: "art" },
          { label: "Horário da Bolívia", value: "bot" },
          { label: "Horário de Brasília", value: "brt" },
          { label: "Horário Padrão do Chile", value: "clt" },
        ]}
      >
        <SelectTrigger id="rolagem-fuso" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>América do Norte</SelectLabel>
            <SelectItem value="est">Horário Padrão do Leste</SelectItem>
            <SelectItem value="cst">Horário Padrão Central</SelectItem>
            <SelectItem value="mst">Horário Padrão das Montanhas</SelectItem>
            <SelectItem value="pst">Horário Padrão do Pacífico</SelectItem>
            <SelectItem value="akst">Horário Padrão do Alasca</SelectItem>
            <SelectItem value="hst">Horário Padrão do Havaí</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europa e África</SelectLabel>
            <SelectItem value="gmt">Horário do Meridiano de Greenwich</SelectItem>
            <SelectItem value="cet">Horário da Europa Central</SelectItem>
            <SelectItem value="eet">Horário da Europa Oriental</SelectItem>
            <SelectItem value="west">
              Horário de Verão da Europa Ocidental
            </SelectItem>
            <SelectItem value="cat">Horário da África Central</SelectItem>
            <SelectItem value="eat">Horário da África Oriental</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Ásia</SelectLabel>
            <SelectItem value="msk">Horário de Moscou</SelectItem>
            <SelectItem value="ist">Horário Padrão da Índia</SelectItem>
            <SelectItem value="cst_china">Horário Padrão da China</SelectItem>
            <SelectItem value="jst">Horário Padrão do Japão</SelectItem>
            <SelectItem value="kst">Horário Padrão da Coreia</SelectItem>
            <SelectItem value="wita">
              Horário Padrão da Indonésia Central
            </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Austrália e Pacífico</SelectLabel>
            <SelectItem value="awst">
              Horário Padrão da Austrália Ocidental
            </SelectItem>
            <SelectItem value="acst">
              Horário Padrão da Austrália Central
            </SelectItem>
            <SelectItem value="aest">
              Horário Padrão da Austrália Oriental
            </SelectItem>
            <SelectItem value="nzst">Horário Padrão da Nova Zelândia</SelectItem>
            <SelectItem value="fjt">Horário de Fiji</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>América do Sul</SelectLabel>
            <SelectItem value="art">Horário da Argentina</SelectItem>
            <SelectItem value="bot">Horário da Bolívia</SelectItem>
            <SelectItem value="brt">Horário de Brasília</SelectItem>
            <SelectItem value="clt">Horário Padrão do Chile</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
}

export const Desabilitado: Story = {
  play: async ({ canvasElement }) => {
    // The first select is disabled and cannot open; the second one opens to
    // show a disabled option.
    await abrirLista(canvasElement, "Fruta com uma opção desabilitada")
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
      <Field data-disabled className="w-full max-w-48">
        <FieldLabel htmlFor="desabilitado-todo">Fruta desabilitada</FieldLabel>
        <Select
          disabled
          items={[
            { label: "Selecione uma fruta", value: null },
            { label: "Maçã", value: "maca" },
            { label: "Banana", value: "banana" },
          ]}
        >
          <SelectTrigger id="desabilitado-todo" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={null}>Selecione uma fruta</SelectItem>
              <SelectItem value="maca">Maçã</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field className="w-full max-w-48">
        <FieldLabel htmlFor="desabilitado-opcao">
          Fruta com uma opção desabilitada
        </FieldLabel>
        <Select
          items={[
            { label: "Selecione uma fruta", value: null },
            { label: "Maçã", value: "maca" },
            { label: "Banana", value: "banana" },
            { label: "Mirtilo", value: "mirtilo" },
            { label: "Uva", value: "uva" },
            { label: "Abacaxi", value: "abacaxi" },
          ]}
        >
          <SelectTrigger id="desabilitado-opcao" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={null}>Selecione uma fruta</SelectItem>
              <SelectItem value="maca">Maçã</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="mirtilo">Mirtilo</SelectItem>
              <SelectItem value="uva" disabled>
                Uva
              </SelectItem>
              <SelectItem value="abacaxi">Abacaxi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Fruta")
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
      <Field data-invalid className="w-full max-w-48">
        <FieldLabel htmlFor="invalido-fruta">Fruta</FieldLabel>
        <Select
          items={[
            { label: "Selecione uma fruta", value: null },
            { label: "Maçã", value: "maca" },
            { label: "Banana", value: "banana" },
            { label: "Mirtilo", value: "mirtilo" },
          ]}
        >
          <SelectTrigger
            id="invalido-fruta"
            className="w-full"
            aria-invalid
            aria-describedby="invalido-fruta-descricao invalido-fruta-erro"
            aria-errormessage="invalido-fruta-erro"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={null}>Selecione uma fruta</SelectItem>
              <SelectItem value="maca">Maçã</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="mirtilo">Mirtilo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription id="invalido-fruta-descricao">
          Escolha a fruta do seu pedido.
        </FieldDescription>
        <FieldError id="invalido-fruta-erro">Selecione uma fruta.</FieldError>
      </Field>
      <Field data-invalid className="w-full max-w-48">
        <FieldLabel htmlFor="invalido-escolhida">Fruta escolhida</FieldLabel>
        <Select
          defaultValue="uva"
          items={[
            { label: "Maçã", value: "maca" },
            { label: "Uva", value: "uva" },
          ]}
        >
          <SelectTrigger
            id="invalido-escolhida"
            className="w-full"
            aria-invalid
            aria-describedby="invalido-escolhida-erro"
            aria-errormessage="invalido-escolhida-erro"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="maca">Maçã</SelectItem>
              <SelectItem value="uva">Uva</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError id="invalido-escolhida-erro">
          A uva está em falta. Escolha outra fruta.
        </FieldError>
      </Field>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "الطعام")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <Field className="w-full max-w-48">
        <FieldLabel htmlFor="rtl-alimento">الطعام</FieldLabel>
        <Select
          items={[
            { label: "اختر فاكهة", value: null },
            { label: "تفاح", value: "maca" },
            { label: "موز", value: "banana" },
            { label: "توت أزرق", value: "mirtilo" },
            { label: "عنب", value: "uva" },
            { label: "أناناس", value: "abacaxi" },
            { label: "جزر", value: "cenoura" },
            { label: "بروكلي", value: "brocolis" },
            { label: "سبانخ", value: "espinafre" },
          ]}
        >
          <SelectTrigger id="rtl-alimento" className="w-full" dir="rtl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir="rtl" lang="ar">
            <SelectGroup>
              <SelectLabel>الفواكه</SelectLabel>
              <SelectItem value="maca">تفاح</SelectItem>
              <SelectItem value="banana">موز</SelectItem>
              <SelectItem value="mirtilo">توت أزرق</SelectItem>
              <SelectItem value="uva">عنب</SelectItem>
              <SelectItem value="abacaxi">أناناس</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>الخضروات</SelectLabel>
              <SelectItem value="cenoura">جزر</SelectItem>
              <SelectItem value="brocolis">بروكلي</SelectItem>
              <SelectItem value="espinafre">سبانخ</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
}
