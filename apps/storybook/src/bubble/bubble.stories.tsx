import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, ChevronDownIcon, InfoIcon } from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@workspace/ui/components/bubble"
import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

/*
 * One story per section of bubble.mdx, in the order of the shadcn/ui page
 * (Composition has no preview: it is a text tree in the MDX).
 * Differences from the shadcn examples:
 * - a list of bubbles is a `role="log"` with a name, and the conversation
 *   stories add a `sr-only` author ("Você:", "Lia:") inside each bubble, so a
 *   screen reader says who wrote what. The variants story is a showcase, with
 *   no authors;
 * - every row of reactions is a single image: `role="img"` + `aria-label`
 *   (two of the shadcn examples leave the role out, and an `aria-label` on a
 *   `div` without a role is ignored);
 * - the link/button bubbles do nothing else (no toast); the icon-only buttons
 *   of the Tooltip, Popover and Reactions sections have their own name, and
 *   the tooltip only repeats the information;
 * - the ghost variant uses literal JSX instead of the Markdown helper of the
 *   site.
 * The Tooltip, Popover and Collapsible stories have a `play` that opens them,
 * because axe cannot see closed content. Ids are prefixed with the story name.
 */
const meta = {
  title: "Componentes/Bubble",
  component: Bubble,
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj<typeof meta>

async function esperarAnimacoes() {
  await Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.effect?.getComputedTiming().iterations !== Infinity
      )
      .map((animation) => animation.finished)
  )
}

export const Demo: Story = {
  render: () => (
    <div
      role="log"
      aria-label="Conversa com a Lia"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Bubble align="end">
        <BubbleContent>
          <span className="sr-only">Você: </span>Oi! Tudo bem?
        </BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>
            <span className="sr-only">Lia: </span>Oi! Quer ver os balões de
            conversa?
          </BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            <span className="sr-only">Lia: </span>Dá para agrupar mensagens,
            trocar de lado e manter a conversa fácil de ler.
          </BubbleContent>
          <BubbleReactions role="img" aria-label="Reação: joinha">
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>
          <span className="sr-only">Você: </span>Claro. Mostre sua melhor
          demonstração.
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          <span className="sr-only">Lia: </span>Você está lendo uma demonstração
          que demonstra a si mesma. Bem meta.
        </BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reações: joinha, fogo, olhos e mais 2"
        >
          <span>👍</span>
          <span>🔥</span>
          <span>👀</span>
          <span>+2</span>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const Variantes: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble>
        <BubbleContent>Este é o balão primário, o padrão.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>Esta é a variante secundária.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Este é o balão discreto, com uma cor de menos destaque.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reação: joinha">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>
          Este é o balão com tom: uma cor mais suave, derivada da primária.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Também há a variante com contorno.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>
          Erro: não foi possível enviar. A variante destrutiva, com uma reação.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reação: fogo">
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <p>
            Os balões fantasma servem para o texto do assistente, para{" "}
            <strong>markdown</strong> e para outros conteúdos que não precisam
            de moldura.
          </p>
          <p className="mt-3">
            São ideais para respostas que ocupam a largura toda do contêiner.
            Também dá para mostrar <code>código</code> nele.
          </p>
          <p className="mt-3">
            Os balões fantasma ocupam a largura toda do contêiner.
          </p>
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

export const Alinhamento: Story = {
  render: () => (
    <div
      role="log"
      aria-label="Exemplo de alinhamento"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Bubble variant="muted">
        <BubbleContent>
          <span className="sr-only">Lia: </span>Este balão fica no início da
          conversa. É o alinhamento padrão.
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          <span className="sr-only">Você: </span>Este balão fica no fim da
          conversa. Use para as mensagens de quem usa o app.
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

export const GrupoDeBaloes: Story = {
  name: "Grupo de balões",
  render: () => (
    <div
      role="log"
      aria-label="Conversa com a Lia"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Bubble variant="muted">
        <BubbleContent>
          <span className="sr-only">Lia: </span>Você pode me dizer qual é o
          problema?
        </BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>
            <span className="sr-only">Você: </span>Diga você!
          </BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>
            <span className="sr-only">Você: </span>Funcionava ontem. Você
            quebrou!
          </BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>
            <span className="sr-only">Você: </span>Ache o erro e corrija.
          </BubbleContent>
          <BubbleReactions role="img" aria-label="Reação: olhos" align="start">
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>
          <span className="sr-only">Lia: </span>Quer que eu compare o você de
          ontem com o de hoje? É meio constrangedor.
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

export const LinksEBotoes: Story = {
  name: "Links e botões",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primeiro = await canvas.findByRole("button", {
      name: "Esqueci minha senha",
    })
    // Tab reaches the first button bubble and shows the focus ring on it.
    for (let i = 0; i < 5 && document.activeElement !== primeiro; i++) {
      await userEvent.tab()
    }
    await expect(primeiro).toHaveFocus()
    await expect(
      canvas.getByRole("link", { name: "Ver os planos disponíveis" })
    ).toHaveAttribute("href", "#planos")
  },
  render: () => (
    <div
      role="log"
      aria-label="Conversa com o suporte"
      className="flex w-full max-w-sm flex-col gap-8 py-12"
    >
      <Bubble variant="muted">
        <BubbleContent>
          <span className="sr-only">Suporte: </span>Como posso ajudar você hoje?
        </BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="tinted" align="end">
          <BubbleContent render={<button type="button" />}>
            Esqueci minha senha
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent render={<button type="button" />}>
            Preciso de ajuda com a minha assinatura
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent render={<a href="#planos" />}>
            Ver os planos disponíveis
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  ),
}

export const Reacoes: Story = {
  name: "Reações",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble variant="muted" align="end">
        <BubbleContent>
          Não preciso de testes, sei que meu código funciona.
        </BubbleContent>
        <BubbleReactions
          align="start"
          role="img"
          aria-label="Reações: joinha, surpresa"
        >
          <span>👍</span>
          <span>😮</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Ousado. Tudo bem, vou escrever alguns testes e aviso quando terminar.
        </BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reações: olhos, foguete e mais 2"
        >
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>
          Os testes passaram de primeira. Os 142! Está ótimo!
        </BubbleContent>
        <BubbleReactions
          side="top"
          align="start"
          role="img"
          aria-label="Reações: festa, palmas"
        >
          <span>🎉</span>
          <span>👏</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>
          Tem certeza de que posso rodar este comando?
        </BubbleContent>
        <BubbleReactions>
          <Button variant="ghost" size="xs" type="button">
            Sim, rodar o comando
          </Button>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const MostrarMais: Story = {
  name: "Mostrar mais",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", { name: "Mostrar mais" })
    await expect(gatilho).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(gatilho)
    await waitFor(() =>
      expect(gatilho).toHaveAttribute("aria-expanded", "true")
    )
    await esperarAnimacoes()
    await expect(canvas.getByText(/Também recomendo/)).toBeVisible()
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>Como posso ajudar você hoje?</BubbleContent>
      </Bubble>
      <Bubble variant="muted" align="end">
        <BubbleContent>
          <Collapsible>
            <p>
              A revisão de acessibilidade encontrou dois estados de foco sutis
              demais no modo escuro.
            </p>
            <CollapsibleContent>
              <p className="mt-3">
                Conferi os caminhos do diálogo, do menu e da gaveta, porque cada
                um tem controles focáveis dentro de uma superfície em camadas.
              </p>
              <p className="mt-3">
                O diálogo e a gaveta estão certos. O menu precisa separar os
                tokens de hover e de foco, para o foco do teclado continuar
                visível quando o ponteiro não está em uso.
              </p>
              <p className="mt-3">
                Também recomendo manter a mudança no arquivo de estilo, e não no
                primitivo, para que outros temas escolham o próprio foco.
              </p>
            </CollapsibleContent>
            <CollapsibleTrigger
              render={
                <Button
                  type="button"
                  variant="link"
                  className="gap-1 p-0 text-muted-foreground"
                />
              }
            >
              <span className="group-data-panel-open/button:hidden">
                Mostrar mais
              </span>
              <span className="hidden group-data-panel-open/button:inline">
                Mostrar menos
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                data-icon="inline-end"
                className="group-data-panel-open/button:rotate-180"
              />
            </CollapsibleTrigger>
          </Collapsible>
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

export const TooltipDoBalao: Story = {
  name: "Tooltip",
  play: async ({ canvasElement }) => {
    const botao = await within(canvasElement).findByRole("button", {
      name: "Mensagem lida",
    })
    // The tooltip opens on keyboard focus (Tab), and stays open for axe.
    for (let i = 0; i < 10 && document.activeElement !== botao; i++) {
      await userEvent.tab()
    }
    await expect(botao).toHaveFocus()
    const conteudo = await screen.findByText("Lida em 5 jan. 2026 às 16:32")
    await esperarAnimacoes()
    await waitFor(() => expect(conteudo).toBeVisible())
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble variant="secondary">
        <BubbleContent>Você removeu a rota antiga?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Sim, tirei do registro.</BubbleContent>
        <BubbleReactions>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Mensagem lida"
                />
              }
            >
              <CheckIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>Lida em 5 jan. 2026 às 16:32</TooltipContent>
          </Tooltip>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const PopoverDoBalao: Story = {
  name: "Popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Ver detalhes do erro" })
    )
    const popover = await screen.findByRole("dialog", {
      name: "O comando falhou com o código 1",
    })
    await esperarAnimacoes()
    await waitFor(() => expect(popover).toBeVisible())
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble align="end">
        <BubbleContent>Rode o script de build.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>Não foi possível rodar o comando.</BubbleContent>
        <BubbleReactions>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Ver detalhes do erro"
                />
              }
            >
              <InfoIcon aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle className="text-sm">
                  O comando falhou com o código 1
                </PopoverTitle>
                <PopoverDescription className="text-sm">
                  ENOENT: arquivo ou pasta não encontrado, open pnpm-lock.yaml
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}
