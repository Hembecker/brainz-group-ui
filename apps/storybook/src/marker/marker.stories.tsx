import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import {
  BookOpenCheckIcon,
  GitBranchIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react"

import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@workspace/ui/components/marker"
import { Spinner } from "@workspace/ui/components/spinner"

/*
 * One story per section of marker.mdx, in the order of the shadcn/ui page
 * (marker-demo, -variants, -status, -shimmer, -separator, -border, -icon and
 * -link-button). The page has no RTL section: the `Rtl` story at the end is
 * an addition of this system, because the separator lines and the icon spacing
 * are directional.
 * `role="status"` goes on the markers that announce progress; the others are
 * presentational, as the shadcn page asks.
 */
const meta = {
  title: "Componentes/Marker",
  component: Marker,
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Mudou para uma nova branch</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Pensando...</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversa resumida</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explorou 4 arquivos</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Variantes: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker>
        <MarkerContent>Um marcador padrão para notas em linha.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Um marcador separador</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>
          Um marcador com borda para limites de linha.
        </MarkerContent>
      </Marker>
    </div>
  ),
}

export const Status: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Resumindo a conversa</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Executando os testes</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Shimmer: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker role="status">
        <MarkerContent className="shimmer">Pensando...</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Lendo 4 arquivos</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Separador: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker variant="separator">
        <MarkerContent>Hoje</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Trabalhou por 42 s</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversa resumida</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Borda: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Marker variant="border">
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Mudou para a release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Revisou 8 arquivos relacionados</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <BookOpenCheckIcon />
        </MarkerIcon>
        <MarkerContent>Abriu as notas de implementação</MarkerContent>
      </Marker>
    </div>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-12">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Mudou para uma nova branch</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explorou 4 arquivos</MarkerContent>
      </Marker>
      <Marker className="flex-col">
        <MarkerIcon>
          <BookOpenCheckIcon />
        </MarkerIcon>
        <MarkerContent>Sincronização concluída</MarkerContent>
      </Marker>
    </div>
  ),
}

export const LinksEBotoes: Story = {
  name: "Links e botões",
  // Tab chega ao link e ao botão, e os dois mostram o anel de foco do projeto.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole("link", { name: "Ver o pull request" })
    const botao = canvas.getByRole("button", {
      name: "Reverter esta alteração",
    })
    await expect(getComputedStyle(link).textDecorationLine).toBe("underline")
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await expect(getComputedStyle(link).boxShadow).not.toBe("none")
    await userEvent.tab()
    await expect(botao).toHaveFocus()
    await expect(getComputedStyle(botao).boxShadow).not.toBe("none")
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Marker render={<a href="#links-e-botoes" />}>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Ver o pull request</MarkerContent>
      </Marker>
      <Marker
        render={
          <button
            type="button"
            className="transition-colors hover:text-foreground"
            onClick={() => {}}
          />
        }
      >
        <MarkerIcon>
          <RotateCcwIcon />
        </MarkerIcon>
        <MarkerContent>Reverter esta alteração</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar" className="flex w-full max-w-sm flex-col gap-8">
        <Marker>
          <MarkerIcon>
            <GitBranchIcon />
          </MarkerIcon>
          <MarkerContent>تم التبديل إلى فرع جديد</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>تم ضغط المحادثة</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerIcon>
            <SearchIcon />
          </MarkerIcon>
          <MarkerContent>تمت مراجعة 8 ملفات ذات صلة</MarkerContent>
        </Marker>
        <Marker render={<a href="#rtl" />}>
          <MarkerIcon>
            <GitBranchIcon />
          </MarkerIcon>
          <MarkerContent>عرض طلب السحب</MarkerContent>
        </Marker>
      </div>
    </DirectionProvider>
  ),
}
