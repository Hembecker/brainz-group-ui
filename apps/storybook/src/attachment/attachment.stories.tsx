import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  FileCodeIcon,
  FileSearchIcon,
  FileTextIcon,
  FileWarningIcon,
  RefreshCwIcon,
  TableIcon,
  XIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@workspace/ui/components/attachment"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Spinner } from "@workspace/ui/components/spinner"

/*
 * One story per section of attachment.mdx, in the order of the shadcn/ui page
 * (Demo, Image, States, Sizes, Group, Trigger). The page has no RTL section:
 * the `Rtl` story at the end is an addition of this system, because the
 * actions of the vertical card sit at the inline end.
 *
 * The shadcn examples load photos from Unsplash. Here every image is the
 * brand logo (`brainz-group-logo.svg`, served from `brand/`), with an alt text
 * that says what it is.
 *
 * An `AttachmentGroup` scrolls sideways. When its attachments hold focusable
 * parts (actions or a trigger), the keyboard reaches the off-screen ones by
 * Tab. When they are presentational (Demo), the group itself needs
 * `tabIndex={0}`, `role="group"`, a name and a ring (`ring-inset`, because the
 * edge fade is a mask that would cut an outer ring).
 *
 * The Trigger story opens a Dialog from the card: a closed dialog is invisible
 * to axe, so its `play` opens it (and checks that Esc gives the focus back to
 * the card trigger) before the test runs axe.
 */
const meta = {
  title: "Componentes/Attachment",
  component: Attachment,
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj<typeof meta>

async function abrirPrevia(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await userEvent.click(
    await canvas.findByRole("button", {
      name: "Visualizar resumo-da-pesquisa.pdf",
    })
  )
  const dialog = await screen.findByRole("dialog", {
    name: "resumo-da-pesquisa.pdf",
  })
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(dialog).toBeVisible())
  return dialog
}

export const Demo: Story = {
  render: () => (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <AttachmentGroup
        role="group"
        aria-label="Imagens anexadas"
        tabIndex={0}
        className="outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 4 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo-escuro.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 4 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo-menor.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 3 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner aria-label="Enviando painel-de-vendas.pdf" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>painel-de-vendas.pdf</AttachmentTitle>
          <AttachmentDescription>Enviando · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancelar o envio de painel-de-vendas.pdf">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileCodeIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>renderizador-de-mensagens.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remover renderizador-de-mensagens.tsx">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
}

export const Imagem: Story = {
  name: "Imagem",
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <AttachmentGroup className="w-full">
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 4 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover logotipo.svg">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="brainz-group-logo.svg"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir logotipo.svg"
              />
            }
          />
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo-escuro.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 4 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover logotipo-escuro.svg">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="brainz-group-logo.svg"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir logotipo-escuro.svg"
              />
            }
          />
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo-menor.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 3 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover logotipo-menor.svg">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="brainz-group-logo.svg"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir logotipo-menor.svg"
              />
            }
          />
        </Attachment>
      </AttachmentGroup>
    </div>
  ),
}

export const Estados: Story = {
  render: () => (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
      <Attachment state="idle" className="w-full">
        <AttachmentMedia>
          <ClockIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>arquivo-selecionado.pdf</AttachmentTitle>
          <AttachmentDescription>Pronto para enviar</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remover arquivo-selecionado.pdf">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner aria-label="Enviando sistema-de-design.zip" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sistema-de-design.zip</AttachmentTitle>
          <AttachmentDescription>Enviando · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancelar o envio de sistema-de-design.zip">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="processing" className="w-full">
        <AttachmentMedia>
          <FileTextIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>pesquisa-de-mercado.pdf</AttachmentTitle>
          <AttachmentDescription>Processando o documento</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remover pesquisa-de-mercado.pdf">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="error" className="w-full">
        <AttachmentMedia>
          <FileWarningIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>modelo-financeiro.xlsx</AttachmentTitle>
          <AttachmentDescription>
            Falha no envio. Tente de novo.
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Tentar de novo o envio de modelo-financeiro.xlsx">
            <RefreshCwIcon aria-hidden="true" />
          </AttachmentAction>
          <AttachmentAction aria-label="Remover modelo-financeiro.xlsx">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="done" className="w-full">
        <AttachmentMedia>
          <CheckIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>relatorio-enviado.pdf</AttachmentTitle>
          <AttachmentDescription>Enviado · 1,8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remover relatorio-enviado.pdf">
            <XIcon aria-hidden="true" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
}

export const Tamanhos: Story = {
  render: () => (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <Attachment size="default" className="w-full">
        <AttachmentMedia>
          <FileTextIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Anexo padrão</AttachmentTitle>
          <AttachmentDescription>PDF · 2,4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="sm" className="w-full">
        <AttachmentMedia>
          <FileTextIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Anexo pequeno</AttachmentTitle>
          <AttachmentDescription>PDF · 2,4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="xs" className="w-full">
        <AttachmentMedia>
          <FileTextIcon aria-hidden="true" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Anexo extra pequeno</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
}

export const Grupo: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <AttachmentGroup className="w-full">
        <Attachment className="w-64">
          <AttachmentMedia>
            <FileTextIcon aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>notas-do-briefing.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 1,4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover notas-do-briefing.pdf">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment className="w-64">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="Logotipo da Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logotipo.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 4 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover logotipo.svg">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment className="w-64">
          <AttachmentMedia>
            <TableIcon aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>clientes.csv</AttachmentTitle>
            <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover clientes.csv">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment className="w-64">
          <AttachmentMedia>
            <FileCodeIcon aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>renderizador.tsx</AttachmentTitle>
            <AttachmentDescription>TSX · 12 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover renderizador.tsx">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
    </div>
  ),
}

export const Gatilho: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Visualizar resumo-da-pesquisa.pdf",
    })

    // As ações ficam clicáveis por cima do gatilho: o foco vai da primeira
    // ação à segunda e chega ao gatilho, sem armadilha.
    await userEvent.tab()
    await expect(
      canvas.getByRole("button", {
        name: "Copiar o link de resumo-da-pesquisa.pdf",
      })
    ).toHaveFocus()
    await userEvent.tab()
    await expect(
      canvas.getByRole("button", { name: "Remover resumo-da-pesquisa.pdf" })
    ).toHaveFocus()
    await userEvent.tab()
    await expect(gatilho).toHaveFocus()

    // Abre o diálogo; o Esc fecha e devolve o foco ao gatilho.
    await abrirPrevia(canvasElement)
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Abre de novo e fica aberto, para o axe.
    await abrirPrevia(canvasElement)
  },
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <Dialog>
        <Attachment className="w-full">
          <AttachmentMedia>
            <FileSearchIcon aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>resumo-da-pesquisa.pdf</AttachmentTitle>
            <AttachmentDescription>Abrir a visualização</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Copiar o link de resumo-da-pesquisa.pdf">
              <CopyIcon aria-hidden="true" />
            </AttachmentAction>
            <AttachmentAction aria-label="Remover resumo-da-pesquisa.pdf">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
          <DialogTrigger
            render={
              <AttachmentTrigger aria-label="Visualizar resumo-da-pesquisa.pdf" />
            }
          />
        </Attachment>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>resumo-da-pesquisa.pdf</DialogTitle>
            <DialogDescription>
              O gatilho do anexo cobre o card e abre o diálogo, enquanto as
              ações continuam clicáveis por cima dele.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <DirectionProvider direction="rtl">
      <div
        dir="rtl"
        lang="ar"
        className="mx-auto flex w-full max-w-sm flex-col gap-3"
      >
        <Attachment className="w-full">
          <AttachmentMedia>
            <FileTextIcon aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 2.4 ميجابايت</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="إزالة sales-dashboard.pdf">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="error" className="w-full">
          <AttachmentMedia>
            <FileWarningIcon aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
            <AttachmentDescription>
              فشل الرفع. حاول مرة أخرى.
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="إعادة محاولة رفع financial-model.xlsx">
              <RefreshCwIcon aria-hidden="true" />
            </AttachmentAction>
            <AttachmentAction aria-label="إزالة financial-model.xlsx">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="brainz-group-logo.svg" alt="شعار Brainz Group" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logo.svg</AttachmentTitle>
            <AttachmentDescription>SVG · 4 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="إزالة logo.svg">
              <XIcon aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </div>
    </DirectionProvider>
  ),
}
