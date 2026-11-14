import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

/*
 * One story per section of table.mdx, in the order of the shadcn/ui page. The
 * shadcn examples render the rows with `.map`; here each row is literal JSX.
 * The "Data Table" section of the page is only a link to the TanStack Table
 * guide, so it has no story.
 *
 * Every table has a name: a `<caption>`, or `aria-label` when there is no
 * visible caption (the Actions example). The column headers are `<th
 * scope="col">` (the default of TableHead) and the numeric columns use
 * `text-end`, not `text-right`, so they follow the direction.
 *
 * A closed menu is invisible to axe: the Actions story has a `play` that
 * opens the first menu (portaled to <body>, so queried with `screen`) and
 * waits for the enter animation to end.
 */
const meta = {
  title: "Componentes/Table",
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <Table>
      <TableCaption>Uma lista das suas faturas recentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-end">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paga</TableCell>
          <TableCell>Cartão de crédito</TableCell>
          <TableCell className="text-end">R$ 250,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pendente</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-end">R$ 150,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Em aberto</TableCell>
          <TableCell>Transferência bancária</TableCell>
          <TableCell className="text-end">R$ 350,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV004</TableCell>
          <TableCell>Paga</TableCell>
          <TableCell>Cartão de crédito</TableCell>
          <TableCell className="text-end">R$ 450,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV005</TableCell>
          <TableCell>Paga</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-end">R$ 550,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV006</TableCell>
          <TableCell>Pendente</TableCell>
          <TableCell>Transferência bancária</TableCell>
          <TableCell className="text-end">R$ 200,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV007</TableCell>
          <TableCell>Em aberto</TableCell>
          <TableCell>Cartão de crédito</TableCell>
          <TableCell className="text-end">R$ 300,00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">R$ 2.250,00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const Rodape: Story = {
  name: "Rodapé",
  render: () => (
    <Table>
      <TableCaption>Uma lista das suas faturas recentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-end">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paga</TableCell>
          <TableCell>Cartão de crédito</TableCell>
          <TableCell className="text-end">R$ 250,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pendente</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-end">R$ 150,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Em aberto</TableCell>
          <TableCell>Transferência bancária</TableCell>
          <TableCell className="text-end">R$ 350,00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">R$ 750,00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const Acoes: Story = {
  name: "Ações",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("button", {
        name: "Abrir menu de Mouse sem fio",
      })
    )
    const menu = await screen.findByRole("menu", {
      name: "Abrir menu de Mouse sem fio",
    })
    await Promise.allSettled(
      document
        .getAnimations()
        // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
        .filter((animation) => animation.timeline === document.timeline)
        .map((animation) => animation.finished)
    )
    await waitFor(() => expect(menu).toBeVisible())
  },
  render: () => (
    <Table aria-label="Produtos e ações">
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead className="text-end">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Mouse sem fio</TableCell>
          <TableCell>R$ 149,90</TableCell>
          <TableCell className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <MoreHorizontalIcon aria-hidden="true" />
                <span className="sr-only">Abrir menu de Mouse sem fio</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Teclado mecânico</TableCell>
          <TableCell>R$ 649,90</TableCell>
          <TableCell className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <MoreHorizontalIcon aria-hidden="true" />
                <span className="sr-only">Abrir menu de Teclado mecânico</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Hub USB-C</TableCell>
          <TableCell>R$ 249,90</TableCell>
          <TableCell className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <MoreHorizontalIcon aria-hidden="true" />
                <span className="sr-only">Abrir menu de Hub USB-C</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <Table dir="rtl" lang="ar">
      <TableCaption>قائمة بفواتيرك الأخيرة.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">الفاتورة</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>الطريقة</TableHead>
          <TableHead className="text-end">المبلغ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>مدفوع</TableCell>
          <TableCell>بطاقة ائتمانية</TableCell>
          <TableCell className="text-end">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>قيد الانتظار</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-end">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>غير مدفوع</TableCell>
          <TableCell>تحويل بنكي</TableCell>
          <TableCell className="text-end">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV004</TableCell>
          <TableCell>مدفوع</TableCell>
          <TableCell>بطاقة ائتمانية</TableCell>
          <TableCell className="text-end">$450.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>المجموع</TableCell>
          <TableCell className="text-end">$1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
