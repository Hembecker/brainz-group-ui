import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"
import { expect, userEvent, within } from "storybook/test"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@workspace/ui/components/attachment"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@workspace/ui/components/bubble"
import { Button } from "@workspace/ui/components/button"
import { Marker, MarkerContent } from "@workspace/ui/components/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@workspace/ui/components/message"

/*
 * One story per section of message.mdx, in the order of the shadcn/ui page
 * (Composition and Features have no preview: they are a text tree and a list
 * in the MDX). Differences from the shadcn examples:
 * - a list of messages is a `role="list"` with a name, and each Message is a
 *   `role="listitem"`. The typing indicator is a `Marker role="status"` and
 *   stays outside the list (a list may only own list items);
 * - who wrote each message is always available to a screen reader: an
 *   `Avatar` with `role="img"` and `aria-label` (initials only, no photo), a
 *   `MessageHeader` with the name, or a `sr-only` "Você:" inside the bubble;
 * - icon-only buttons in the footer have a specific `aria-label` (no `title`
 *   attribute: it would repeat the name), and the icons are `aria-hidden`;
 * - the typing indicator does not use the `shimmer` class of the site (an
 *   endless animation: axe would measure the text mid-effect);
 * - the attachment image is the brand logo from `brand/`, not an Unsplash
 *   photo, and the photo avatars are replaced by initials.
 * The page has no RTL section and no RTL example (the shadcn example does
 * not exist), so there is no `Rtl` story: `npm run test:rtl` still runs every
 * story with `dir="rtl"` on <html>. Ids are prefixed with the story name.
 */
const meta = {
  title: "Componentes/Message",
  component: Message,
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const lista = await canvas.findByRole("list", {
      name: "Conversa com o Rafael",
    })
    await expect(within(lista).getAllByRole("listitem")).toHaveLength(4)
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Oliver está digitando…"
    )
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-6 py-12">
      <div
        role="list"
        aria-label="Conversa com o Rafael"
        className="flex flex-col gap-6"
      >
        <Message role="listitem" align="end">
          <MessageAvatar>
            <Avatar role="img" aria-label="Você">
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>Vou publicar em produção rapidinho.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message role="listitem">
          <MessageAvatar>
            <Avatar role="img" aria-label="Rafael">
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>São 16h55. De uma sexta-feira.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message role="listitem" align="end">
          <MessageAvatar>
            <Avatar role="img" aria-label="Você">
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>É uma mudança de uma linha só.</BubbleContent>
            </Bubble>
            <MessageFooter>Entregue</MessageFooter>
          </MessageContent>
        </Message>
        <Message role="listitem">
          <MessageAvatar>
            <Avatar role="img" aria-label="Rafael">
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <BubbleGroup>
              <Bubble variant="muted">
                <BubbleContent>
                  É sempre uma mudança de uma linha só 😭.
                </BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent>Beleza, deixa eu dar uma olhada.</BubbleContent>
                <BubbleReactions role="img" aria-label="Reação: joinha">
                  <span>👍</span>
                </BubbleReactions>
              </Bubble>
            </BubbleGroup>
          </MessageContent>
        </Message>
      </div>
      <Marker role="status">
        <MarkerContent>
          <span className="font-medium">Oliver</span> está digitando…
        </MarkerContent>
      </Marker>
    </div>
  ),
}

export const Avatares: Story = {
  render: () => (
    <div
      role="list"
      aria-label="Conversa sobre o build"
      className="flex w-full max-w-sm flex-col gap-6 py-12"
    >
      <Message role="listitem">
        <MessageAvatar>
          <Avatar role="img" aria-label="Rafael">
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              O build falhou durante a instalação das dependências.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message role="listitem" align="end">
        <MessageAvatar>
          <Avatar role="img" aria-label="Você">
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>Você pode mandar o erro exato?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message role="listitem">
        <MessageAvatar>
          <Avatar role="img" aria-label="Rafael">
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>Aqui está o erro dos logs</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>
                Algo deu errado no build. As bibliotecas não foram instaladas
                direito. Tente rodar o build de novo.
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
    </div>
  ),
}

export const Grupo: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-6 py-12">
      <MessageGroup role="list" aria-label="Mensagens da Camila">
        <Message role="listitem">
          <MessageAvatar />
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                <span className="sr-only">Camila: </span>Conferi os endereços do
                registro.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message role="listitem">
          <MessageAvatar>
            <Avatar role="img" aria-label="Camila">
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                <span className="sr-only">Camila: </span>O componente e o JSON
                dos exemplos agora ficam no registro da UI.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  ),
}

export const CabecalhoERodape: Story = {
  name: "Cabeçalho e rodapé",
  render: () => (
    <div
      role="list"
      aria-label="Conversa com a Olívia"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Message role="listitem">
        <MessageContent>
          <MessageHeader>Olívia</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Eu já conferi os logs.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message role="listitem" align="end">
        <MessageContent>
          <MessageHeader>Você</MessageHeader>
          <Bubble>
            <BubbleContent>
              Mande o relatório para o time. Chame a Ana se precisar de ajuda.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <div>
              Lida <span className="font-normal">ontem</span>
            </div>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
}

export const Acoes: Story = {
  name: "Ações",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const copiar = await canvas.findByRole("button", {
      name: "Copiar a resposta",
    })
    // Tab reaches the first footer action and shows the focus ring on it.
    for (let i = 0; i < 5 && document.activeElement !== copiar; i++) {
      await userEvent.tab()
    }
    await expect(copiar).toHaveFocus()
    await expect(
      canvas.getByRole("button", { name: "Tentar enviar de novo" })
    ).toBeEnabled()
  },
  render: () => (
    <div
      role="list"
      aria-label="Conversa sobre a instalação"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Message role="listitem">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              <span className="sr-only">Assistente: </span>A falha de instalação
              vem do pacote do workspace.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Copiar a resposta"
            >
              <CopyIcon aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Gostei da resposta"
            >
              <ThumbsUpIcon aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Não gostei da resposta"
            >
              <ThumbsDownIcon aria-hidden="true" />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message role="listitem" align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>
              <span className="sr-only">Você: </span>Beleza, manda o link. Vou
              dar uma olhada…
            </BubbleContent>
          </Bubble>
          <MessageFooter className="gap-2">
            <span className="font-normal text-destructive">
              Falha ao enviar
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Tentar enviar de novo"
            >
              <RefreshCcwIcon aria-hidden="true" />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
}

export const Anexo: Story = {
  render: () => (
    <div
      role="list"
      aria-label="Conversa sobre o PDF"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Message role="listitem" align="end">
        <MessageContent>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="brainz-group-logo.svg" alt="Logo da Brainz Group" />
            </AttachmentMedia>
          </Attachment>
          <Bubble>
            <BubbleContent>
              <span className="sr-only">Você: </span>Aqui está a imagem. Dá para
              colocar no PDF? Use na capa.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message role="listitem">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              <span className="sr-only">Assistente: </span>Pronto. Aqui está o
              PDF com a imagem na capa.
            </BubbleContent>
          </Bubble>
          <Attachment>
            <AttachmentMedia>
              <FileTextIcon aria-hidden="true" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>painel-de-vendas.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 2,4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction
                type="button"
                aria-label="Baixar painel-de-vendas.pdf"
                size="icon-sm"
                variant="secondary"
              >
                <DownloadIcon aria-hidden="true" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </MessageContent>
      </Message>
      <Message role="listitem" align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>
              <span className="sr-only">Você: </span>Valeu. Ficou ótimo.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  ),
}
