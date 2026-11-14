import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { GlobeIcon } from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@workspace/ui/components/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { InputGroupAddon } from "@workspace/ui/components/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"

/*
 * One story per section of combobox.mdx, in the order of the shadcn/ui page.
 * The shadcn examples have no visible label; here every field has a
 * persistent `FieldLabel` tied to it by `htmlFor`/`id` (the label names the
 * input, the chips input or, in the popup, the trigger).
 *
 * A closed list is invisible to axe, so every story has a `play` that opens
 * it first (the test runs axe after `play`). `abrirLista` finds the field by
 * role and name, waits for the listbox (it is in a portal, so it is queried
 * with `screen`) and for the enter animation to end, because axe would
 * measure contrast mid-fade. Ids are prefixed with the story name: the Docs
 * page renders all stories in the same document.
 *
 * Multiple and RTL need `useComboboxAnchor`, a hook, and a hook cannot live in
 * `render: () => (…)`. They render a small component (`ChipsMultiplos`,
 * `ChipsRtl`) and show the whole snippet (hook included) in "Show code"
 * through `parameters.docs.source.code`, which skips the `render` transform.
 */
const meta = {
  title: "Componentes/Combobox",
  component: Combobox,
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

async function abrirLista(canvasElement: HTMLElement, nome: string) {
  const canvas = within(canvasElement)
  const campo = await canvas.findByRole("combobox", { name: nome })
  await userEvent.click(campo)
  const lista = await screen.findByRole("listbox")
  await Promise.allSettled(
    document
      .getAnimations()
      // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
      .filter((animation) => animation.timeline === document.timeline)
      .map((animation) => animation.finished)
  )
  await waitFor(() => expect(lista).toBeVisible())
  return { campo, lista }
}

function ChipsMultiplos() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="multiplo-frameworks">Frameworks</FieldLabel>
      <Combobox
        multiple
        autoHighlight
        items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}
        defaultValue={["Next.js"]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <React.Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="multiplo-frameworks"
                  placeholder="Adicionar framework"
                />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

function ChipsRtl() {
  const anchor = useComboboxAnchor()

  return (
    <div dir="rtl" lang="ar">
      <Field className="w-full max-w-xs">
        <FieldLabel htmlFor="rtl-categorias">الفئات</FieldLabel>
        <Combobox
          multiple
          autoHighlight
          items={[
            "التكنولوجيا",
            "التصميم",
            "الأعمال",
            "التسويق",
            "التعليم",
            "الصحة",
          ]}
          defaultValue={["التكنولوجيا"]}
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values: string[]) => (
                <React.Fragment>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    id="rtl-categorias"
                    placeholder="أضف فئات"
                  />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} dir="rtl" lang="ar">
            <ComboboxEmpty>لم يتم العثور على فئات.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    // Opens by click: the focus stays in the field (the list is driven by
    // aria-activedescendant).
    const { campo } = await abrirLista(canvasElement, "Framework")
    await expect(campo).toHaveFocus()

    // Typing filters the list.
    await userEvent.keyboard("ast")
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(1))
    await expect(screen.getByRole("option", { name: "Astro" })).toBeVisible()

    // Esc closes it and the focus stays in the field.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(campo).toHaveFocus()

    // Opens again and stays open, for axe.
    await userEvent.clear(campo)
    await abrirLista(canvasElement, "Framework")
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="demo-framework">Framework</FieldLabel>
      <Combobox items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}>
        <ComboboxInput
          id="demo-framework"
          placeholder="Selecione um framework"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const Basico: Story = {
  name: "Básico",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Framework")
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="basico-framework">Framework</FieldLabel>
      <Combobox items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}>
        <ComboboxInput
          id="basico-framework"
          placeholder="Selecione um framework"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const Multiplo: Story = {
  name: "Múltiplo",
  play: async ({ canvasElement }) => {
    // The chip names its remove button with the chip text. Checked before
    // opening: with the list open Base UI hides the rest of the page.
    await expect(
      await within(canvasElement).findByRole("button", {
        name: "Remover Next.js",
      })
    ).toBeVisible()
    const { campo } = await abrirLista(canvasElement, "Frameworks")
    await expect(campo).toHaveFocus()
  },
  parameters: {
    docs: {
      source: {
        code: `export function ExemploMultiplo() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="multiplo-frameworks">Frameworks</FieldLabel>
      <Combobox
        multiple
        autoHighlight
        items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}
        defaultValue={["Next.js"]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <React.Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="multiplo-frameworks"
                  placeholder="Adicionar framework"
                />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}`,
      },
    },
  },
  render: () => <ChipsMultiplos />,
}

export const BotaoDeLimpar: Story = {
  name: "Botão de limpar",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The button is named by the component and is out of the Tab order (the
    // keyboard clears by deleting the text of the field).
    const limpar = await canvas.findByRole("button", {
      name: "Limpar seleção",
    })
    await expect(limpar).toHaveAttribute("tabindex", "-1")
    const campo = canvas.getByRole("combobox", { name: "Framework" })
    await expect(campo).toHaveValue("Next.js")
    await userEvent.clear(campo)
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: "Limpar seleção" })
      ).toBeNull()
    )
    await userEvent.type(campo, "Remix")
    await userEvent.keyboard("{Escape}")
    await abrirLista(canvasElement, "Framework")
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="limpar-framework">Framework</FieldLabel>
      <Combobox
        items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}
        defaultValue="Next.js"
      >
        <ComboboxInput
          id="limpar-framework"
          placeholder="Selecione um framework"
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const Grupos: Story = {
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Fuso horário")
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="grupos-fuso">Fuso horário</FieldLabel>
      <Combobox
        items={[
          {
            value: "Américas",
            items: [
              "(GMT-5) Nova York",
              "(GMT-8) Los Angeles",
              "(GMT-6) Chicago",
              "(GMT-5) Toronto",
              "(GMT-8) Vancouver",
              "(GMT-3) São Paulo",
            ],
          },
          {
            value: "Europa",
            items: [
              "(GMT+0) Londres",
              "(GMT+1) Paris",
              "(GMT+1) Berlim",
              "(GMT+1) Roma",
              "(GMT+1) Madri",
              "(GMT+1) Amsterdã",
            ],
          },
          {
            value: "Ásia e Pacífico",
            items: [
              "(GMT+9) Tóquio",
              "(GMT+8) Xangai",
              "(GMT+8) Singapura",
              "(GMT+4) Dubai",
              "(GMT+11) Sydney",
              "(GMT+9) Seul",
            ],
          },
        ]}
      >
        <ComboboxInput
          id="grupos-fuso"
          placeholder="Selecione um fuso horário"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum fuso horário encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(group, index) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                {index < 2 && <ComboboxSeparator />}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const ItensPersonalizados: Story = {
  name: "Itens personalizados",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "País")
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="personalizados-pais">País</FieldLabel>
      <Combobox
        items={[
          { code: "ar", label: "Argentina", continent: "América do Sul" },
          { code: "au", label: "Austrália", continent: "Oceania" },
          { code: "br", label: "Brasil", continent: "América do Sul" },
          { code: "ca", label: "Canadá", continent: "América do Norte" },
          { code: "eg", label: "Egito", continent: "África" },
          { code: "fr", label: "França", continent: "Europa" },
          { code: "jp", label: "Japão", continent: "Ásia" },
          { code: "pt", label: "Portugal", continent: "Europa" },
        ]}
        itemToStringValue={(country: { label: string }) => country.label}
      >
        <ComboboxInput
          id="personalizados-pais"
          placeholder="Buscar países..."
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum país encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(country) => (
              <ComboboxItem key={country.code} value={country}>
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">
                      {country.label}
                    </ItemTitle>
                    <ItemDescription>
                      {country.continent} ({country.code})
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const Invalido: Story = {
  name: "Inválido",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Framework")
  },
  render: () => (
    <Field data-invalid className="w-full max-w-xs">
      <FieldLabel id="invalido-framework-rotulo" htmlFor="invalido-framework">
        Framework
      </FieldLabel>
      <Combobox items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}>
        <ComboboxInput
          id="invalido-framework"
          placeholder="Selecione um framework"
          aria-invalid="true"
          aria-labelledby="invalido-framework-rotulo"
          aria-describedby="invalido-framework-descricao invalido-framework-erro"
          aria-errormessage="invalido-framework-erro"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription id="invalido-framework-descricao">
        Escolha o framework do projeto.
      </FieldDescription>
      <FieldError id="invalido-framework-erro">
        Selecione um framework.
      </FieldError>
    </Field>
  ),
}

export const Desabilitado: Story = {
  play: async ({ canvasElement }) => {
    // The first combobox is disabled and cannot open; the second one opens to
    // show a disabled option.
    await abrirLista(canvasElement, "Framework com uma opção desabilitada")
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
      <Field data-disabled className="w-full max-w-xs">
        <FieldLabel htmlFor="desabilitado-todo">
          Framework desabilitado
        </FieldLabel>
        <Combobox
          items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}
        >
          <ComboboxInput
            id="desabilitado-todo"
            placeholder="Selecione um framework"
            disabled
          />
          <ComboboxContent>
            <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <Field className="w-full max-w-xs">
        <FieldLabel htmlFor="desabilitado-opcao">
          Framework com uma opção desabilitada
        </FieldLabel>
        <Combobox
          items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}
        >
          <ComboboxInput
            id="desabilitado-opcao"
            placeholder="Selecione um framework"
          />
          <ComboboxContent>
            <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  key={item}
                  value={item}
                  disabled={item === "Remix"}
                >
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  ),
}

export const DestaqueAutomatico: Story = {
  name: "Destaque automático",
  play: async ({ canvasElement }) => {
    const { campo } = await abrirLista(canvasElement, "Framework")
    // With autoHighlight the first item is highlighted as the list filters.
    await userEvent.type(campo, "n")
    await waitFor(() =>
      expect(screen.getAllByRole("option")[0]).toHaveAttribute(
        "data-highlighted"
      )
    )
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="destaque-framework">Framework</FieldLabel>
      <Combobox
        items={["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]}
        autoHighlight
      >
        <ComboboxInput
          id="destaque-framework"
          placeholder="Selecione um framework"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const Popup: Story = {
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "País")
    // The default value is an object written inline: the item must still be
    // the selected one (isItemEqualToValue compares by `code`, not identity).
    await expect(
      screen.getByRole("option", { name: "Selecione um país" })
    ).toHaveAttribute("aria-selected", "true")
  },
  render: () => (
    <Field className="w-64">
      <FieldLabel htmlFor="popup-pais">País</FieldLabel>
      <Combobox
        items={[
          { code: "", label: "Selecione um país" },
          { code: "ar", label: "Argentina" },
          { code: "au", label: "Austrália" },
          { code: "br", label: "Brasil" },
          { code: "ca", label: "Canadá" },
          { code: "eg", label: "Egito" },
          { code: "fr", label: "França" },
          { code: "jp", label: "Japão" },
          { code: "pt", label: "Portugal" },
        ]}
        defaultValue={{ code: "", label: "Selecione um país" }}
        isItemEqualToValue={(item, value) => item.code === value.code}
      >
        <ComboboxTrigger
          id="popup-pais"
          render={
            <Button
              variant="outline"
              className="w-64 justify-between font-normal"
            />
          }
        >
          <ComboboxValue />
        </ComboboxTrigger>
        <ComboboxContent aria-label="Escolher país">
          <ComboboxInput
            showTrigger={false}
            placeholder="Buscar"
            aria-label="Buscar país"
          />
          <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const GrupoDeInput: Story = {
  name: "Input Group",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "Fuso horário")
  },
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="input-group-fuso">Fuso horário</FieldLabel>
      <Combobox
        items={[
          {
            value: "Américas",
            items: [
              "(GMT-5) Nova York",
              "(GMT-8) Los Angeles",
              "(GMT-6) Chicago",
              "(GMT-5) Toronto",
              "(GMT-8) Vancouver",
              "(GMT-3) São Paulo",
            ],
          },
          {
            value: "Europa",
            items: [
              "(GMT+0) Londres",
              "(GMT+1) Paris",
              "(GMT+1) Berlim",
              "(GMT+1) Roma",
              "(GMT+1) Madri",
              "(GMT+1) Amsterdã",
            ],
          },
          {
            value: "Ásia e Pacífico",
            items: [
              "(GMT+9) Tóquio",
              "(GMT+8) Xangai",
              "(GMT+8) Singapura",
              "(GMT+4) Dubai",
              "(GMT+11) Sydney",
              "(GMT+9) Seul",
            ],
          },
        ]}
      >
        <ComboboxInput
          id="input-group-fuso"
          placeholder="Selecione um fuso horário"
        >
          <InputGroupAddon>
            <GlobeIcon aria-hidden="true" />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent alignOffset={-28} className="w-60">
          <ComboboxEmpty>Nenhum fuso horário encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirLista(canvasElement, "الفئات")
  },
  parameters: {
    docs: {
      source: {
        code: `export function ExemploRtl() {
  const anchor = useComboboxAnchor()

  return (
    <div dir="rtl" lang="ar">
      <Field className="w-full max-w-xs">
        <FieldLabel htmlFor="rtl-categorias">الفئات</FieldLabel>
        <Combobox
          multiple
          autoHighlight
          items={[
            "التكنولوجيا",
            "التصميم",
            "الأعمال",
            "التسويق",
            "التعليم",
            "الصحة",
          ]}
          defaultValue={["التكنولوجيا"]}
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values: string[]) => (
                <React.Fragment>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    id="rtl-categorias"
                    placeholder="أضف فئات"
                  />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} dir="rtl" lang="ar">
            <ComboboxEmpty>لم يتم العثور على فئات.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ChipsRtl />,
}
