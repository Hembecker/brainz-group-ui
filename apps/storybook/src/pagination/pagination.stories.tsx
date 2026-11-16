import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { DirectionProvider } from "@workspace/ui/components/direction"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

/*
 * One story per section of pagination.mdx, in the order of the shadcn/ui
 * page. The "Next.js" section of the page is a diff to apply to the component
 * (not an example), so it has no story: the MDX explains how the router link
 * is done here.
 *
 * Every page link has a specific `aria-label` ("Ir para a página 3") that
 * contains its visible text (WCAG 2.5.3). The Select in "Apenas ícones" is
 * closed: the label ties to the trigger by `htmlFor`/`id` (ids are prefixed
 * with the story name, because the Docs page renders all stories in the same
 * document).
 */
const meta = {
  title: "Componentes/Pagination",
  component: Pagination,
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // It is a navigation landmark and the links are links (not buttons); the
    // current page is marked with aria-current.
    await expect(
      canvas.getByRole("navigation", { name: "Paginação" })
    ).toBeVisible()
    await expect(canvas.getAllByRole("link")).toHaveLength(5)
    await expect(canvas.getByRole("link", { current: "page" })).toHaveTextContent(
      "2"
    )
    await expect(
      canvas.getByRole("link", { name: "Ir para a página anterior" })
    ).toBeVisible()
    await expect(canvas.getByText("Mais páginas")).toBeInTheDocument()
  },
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#pagina-1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-1" aria-label="Ir para a página 1">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#pagina-2"
            isActive
            aria-label="Ir para a página 2"
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-3" aria-label="Ir para a página 3">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#pagina-3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const Simples: Story = {
  render: () => (
    <Pagination aria-label="Paginação simples">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#pagina-1" aria-label="Ir para a página 1">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#pagina-2"
            isActive
            aria-label="Ir para a página 2"
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-3" aria-label="Ir para a página 3">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-4" aria-label="Ir para a página 4">
            4
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-5" aria-label="Ir para a página 5">
            5
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const ApenasIcones: Story = {
  name: "Apenas ícones",
  render: () => (
    <div className="flex items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="apenas-icones-linhas">Linhas por página</FieldLabel>
        <Select
          defaultValue="25"
          items={[
            { label: "10", value: "10" },
            { label: "25", value: "25" },
            { label: "50", value: "50" },
            { label: "100", value: "100" },
          ]}
        >
          <SelectTrigger className="w-20" id="apenas-icones-linhas">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination aria-label="Paginação por ícones" className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#anterior" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#proxima" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Pagination aria-label="التنقل بين الصفحات">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#pagina-1"
                text="السابق"
                aria-label="السابق، الانتقال إلى الصفحة السابقة"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagina-1" aria-label="الصفحة ١">
                ١
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#pagina-2"
                isActive
                aria-label="الصفحة ٢"
              >
                ٢
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagina-3" aria-label="الصفحة ٣">
                ٣
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#pagina-3"
                text="التالي"
                aria-label="التالي، الانتقال إلى الصفحة التالية"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </DirectionProvider>
  ),
}
