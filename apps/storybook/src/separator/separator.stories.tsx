import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Separator } from "@workspace/ui/components/separator"

/*
 * One story per section of separator.mdx, in the order of the shadcn/ui page.
 * The page has no Playground: `orientation` is the only prop of the
 * component, and the Vertical story shows it.
 */
const meta = {
  title: "Componentes/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    // The separator is exposed with its orientation.
    const separador = within(canvasElement).getByRole("separator")
    await expect(separador).toHaveAttribute("aria-orientation", "horizontal")
    await expect(separador).toHaveAttribute("data-slot", "separator")
  },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1.5">
        <div className="leading-none font-medium">Brainz Group UI</div>
        <div className="text-muted-foreground">
          A base do design system da Brainz Group
        </div>
      </div>
      <Separator />
      <div>
        Um conjunto de componentes acessíveis que você pode personalizar,
        estender e usar como base.
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  play: async ({ canvasElement }) => {
    const separadores = within(canvasElement).getAllByRole("separator")
    await expect(separadores).toHaveLength(2)
    for (const separador of separadores) {
      await expect(separador).toHaveAttribute("aria-orientation", "vertical")
    }
  },
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Documentação</div>
      <Separator orientation="vertical" />
      <div>Código</div>
    </div>
  ),
}

export const Menu: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm md:gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Configurações</span>
        <span className="text-xs text-muted-foreground">
          Gerencie as preferências
        </span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-1">
        <span className="font-medium">Conta</span>
        <span className="text-xs text-muted-foreground">
          Perfil e segurança
        </span>
      </div>
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="hidden flex-col gap-1 md:flex">
        <span className="font-medium">Ajuda</span>
        <span className="text-xs text-muted-foreground">
          Suporte e documentação
        </span>
      </div>
    </div>
  ),
}

export const Lista: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-2 text-sm">
      <dl className="flex items-center justify-between">
        <dt>Item 1</dt>
        <dd className="text-muted-foreground">Valor 1</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt>Item 2</dt>
        <dd className="text-muted-foreground">Valor 2</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt>Item 3</dt>
        <dd className="text-muted-foreground">Valor 3</dd>
      </dl>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar" className="flex max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1.5">
        <div className="leading-none font-medium">shadcn/ui</div>
        <div className="text-muted-foreground">
          الأساس لنظام التصميم الخاص بك
        </div>
      </div>
      <Separator />
      <div>
        مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء
        عليها.
      </div>
    </div>
  ),
}
