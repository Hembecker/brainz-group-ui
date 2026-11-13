import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

/*
 * One story per section of skeleton.mdx, in the order of the shadcn/ui page.
 * Every example puts the loading notice on its container (`aria-busy="true"`
 * plus a `role="status"` text that is only for screen readers), because the
 * "Show code" snippet is what people copy. A bare Skeleton is an empty <div>:
 * it is not announced, so the container is what tells the user that content
 * is on its way.
 */
const meta = {
  title: "Componentes/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div aria-busy="true" className="flex items-center gap-4">
      <span role="status" className="sr-only">
        Carregando o perfil
      </span>
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
}

export const Avatar: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-fit items-center gap-4">
      <span role="status" className="sr-only">
        Carregando o autor
      </span>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  ),
}

export const CardExample: Story = {
  name: "Card",
  render: () => (
    <Card aria-busy="true" className="w-full max-w-xs">
      <span role="status" className="sr-only">
        Carregando o card
      </span>
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  ),
}

export const Text: Story = {
  name: "Texto",
  render: () => (
    <div aria-busy="true" className="flex w-full max-w-xs flex-col gap-2">
      <span role="status" className="sr-only">
        Carregando o texto
      </span>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
}

export const Form: Story = {
  name: "Formulário",
  render: () => (
    <div aria-busy="true" className="flex w-full max-w-xs flex-col gap-7">
      <span role="status" className="sr-only">
        Carregando o formulário
      </span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  ),
}

export const Table: Story = {
  name: "Tabela",
  render: () => (
    <div aria-busy="true" className="flex w-full max-w-sm flex-col gap-2">
      <span role="status" className="sr-only">
        Carregando a tabela
      </span>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div
      dir="rtl"
      lang="ar"
      aria-busy="true"
      className="flex items-center gap-4"
    >
      <span role="status" className="sr-only">
        جارٍ تحميل الملف الشخصي
      </span>
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
}
