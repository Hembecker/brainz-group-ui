import type { Meta, StoryObj } from "@storybook/react-vite"

import { Spinner } from "@workspace/ui/components/spinner"
import { Button } from "@workspace/ui/components/button"

/* One story per section of spinner.mdx, in the order of the shadcn/ui page. */
const meta = {
  title: "Componentes/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="flex w-full max-w-xs items-center gap-3 rounded-lg border border-border p-4">
      <Spinner aria-label="Processando o pagamento" />
      <span className="flex-1 text-sm font-medium">
        Processando o pagamento…
      </span>
      <span className="text-sm text-muted-foreground">R$ 100,00</span>
    </div>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}

export const NoBotao: Story = {
  name: "Button",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Carregando…
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Aguarde
      </Button>
      <Button variant="secondary" disabled>
        Processando
        <Spinner data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div
      dir="rtl"
      lang="ar"
      className="flex w-full max-w-xs items-center gap-3 rounded-lg border border-border bg-muted p-4"
    >
      <Spinner aria-label="جاري معالجة الدفع" />
      <span className="line-clamp-1 flex-1 text-sm font-medium">
        جاري معالجة الدفع...
      </span>
      <span className="text-sm tabular-nums">١٠٠.٠٠ دولار</span>
    </div>
  ),
}
