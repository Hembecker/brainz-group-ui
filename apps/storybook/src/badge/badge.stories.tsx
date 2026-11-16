import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRightIcon, BadgeCheckIcon, BookmarkIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Spinner } from "@workspace/ui/components/spinner"

/*
 * One story per section of badge.mdx, in the same order as the shadcn/ui
 * page. Section stories use literal JSX (no args) so "Show code" can be
 * copied as is; Playground is the one with controls.
 */
const meta = {
  title: "Componentes/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="flex w-full flex-wrap justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secundário</Badge>
      <Badge variant="destructive">Destrutivo</Badge>
      <Badge variant="outline">Contorno</Badge>
    </div>
  ),
}

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Padrão</Badge>
      <Badge variant="secondary">Secundário</Badge>
      <Badge variant="destructive">Destrutivo</Badge>
      <Badge variant="outline">Contorno</Badge>
      <Badge variant="ghost">Fantasma</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <BadgeCheckIcon aria-hidden="true" data-icon="inline-start" />
        Verificado
      </Badge>
      <Badge variant="outline">
        Favorito
        <BookmarkIcon aria-hidden="true" data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

export const ComSpinner: Story = {
  name: "Com Spinner",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" aria-hidden="true" />
        Excluindo
      </Badge>
      <Badge variant="secondary">
        Gerando
        <Spinner data-icon="inline-end" aria-hidden="true" />
      </Badge>
    </div>
  ),
}

export const Link: Story = {
  render: () => (
    <Badge render={<a href="#relatorio" />}>
      Abrir relatório
      <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" />
    </Badge>
  ),
}

export const CoresPersonalizadas: Story = {
  name: "Cores personalizadas",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Azul
      </Badge>
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        Verde
      </Badge>
      <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        Céu
      </Badge>
      <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
        Roxo
      </Badge>
      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
        Vermelho
      </Badge>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div
      dir="rtl"
      lang="ar"
      className="flex w-full flex-wrap justify-center gap-2"
    >
      <Badge>شارة</Badge>
      <Badge variant="secondary">ثانوي</Badge>
      <Badge variant="destructive">مدمر</Badge>
      <Badge variant="outline">مخطط</Badge>
      <Badge variant="secondary">
        <BadgeCheckIcon aria-hidden="true" data-icon="inline-start" />
        متحقق
      </Badge>
      <Badge variant="outline">
        إشارة مرجعية
        <BookmarkIcon aria-hidden="true" data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
}
