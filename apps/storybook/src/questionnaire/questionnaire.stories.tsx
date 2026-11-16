import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@workspace/ui/components/questionnaire"

/*
 * One story per section of questionnaire.mdx, in the order of the shadcn/ui
 * page ("Composition" and "Server Rendering" are text and code only, so they
 * live in the MDX; the page has no RTL section, so there is no `Rtl` story:
 * the RTL test run still renders every story with `dir="rtl"`).
 *
 * The shadcn examples show the answers in a Sonner toast, validate with Zod
 * and use `aria-label` alone on the free-text input. None of that is here:
 * the form only calls `preventDefault` (a real form handles the submit), the
 * cross-field validation is written by hand, and the free-text input has a
 * visible `Label` (a placeholder is not a label).
 *
 * `items` is written inline and has to match the rendered items: the
 * primitive warns in the console when a name, a `required` or a choice
 * differs. Stories with `shortcuts` list the `choices` too, because the
 * primitive only assigns shortcuts to choices it finds in `items`.
 *
 * The inactive items are `hidden`, so axe only sees the active one: every
 * `play` ends on the state that is worth auditing (a checked choice, an
 * error, an open dialog). `esperarAnimacoes` waits for the transitions to end
 * before that. Ids are prefixed with the story name: the Docs page renders
 * all stories in the same document.
 */
const meta = {
  title: "Componentes/Questionnaire",
  component: Questionnaire,
} satisfies Meta<typeof Questionnaire>

export default meta
type Story = StoryObj<typeof meta>

// Waits for the transitions to end (finite animations on the document
// timeline only: scroll-driven and looping animations never finish).
async function esperarAnimacoes() {
  await Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.timeline instanceof DocumentTimeline &&
          animation.effect?.getComputedTiming().iterations !== Infinity
      )
      .map((animation) => animation.finished)
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Step 1: the item is a named group and the progress is a progressbar.
    await expect(
      await canvas.findByRole("group", {
        name: "O que devemos construir a seguir?",
      })
    ).toBeVisible()
    const progresso = canvas.getByRole("progressbar", {
      name: "Progresso do questionário",
    })
    await expect(progresso).toHaveAttribute("aria-valuetext", "Pergunta 1 de 3")
    await expect(progresso).toHaveTextContent("Pergunta 1 de 3")

    // Next without an answer: the item turns invalid, the error is text and
    // an alert, and the focus goes to an answer.
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))
    const erro = await canvas.findByRole("alert")
    await expect(erro).toHaveTextContent("Escolha uma resposta para continuar.")
    await expect(
      canvas.getByRole("group", { name: "O que devemos construir a seguir?" })
    ).toHaveAttribute("aria-invalid", "true")
    await waitFor(() =>
      expect(
        canvas.getByRole("radio", { name: /Linha do tempo/ })
      ).toHaveFocus()
    )

    // The shortcut selects the choice (letters, outside the text field).
    await userEvent.keyboard("b")
    await expect(
      canvas.getByRole("radio", { name: /Pontos de aprovação/ })
    ).toBeChecked()
    await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull())

    // Next goes to step 2 and the progress follows.
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))
    await expect(
      await canvas.findByRole("group", {
        name: "O que toda atualização de progresso deve incluir?",
      })
    ).toBeVisible()
    await expect(
      canvas.getByRole("progressbar", { name: "Progresso do questionário" })
    ).toHaveAttribute("aria-valuetext", "Pergunta 2 de 3")

    // Step 2 is optional: Skip goes on to step 3.
    await userEvent.click(canvas.getByRole("button", { name: "Pular" }))
    await expect(
      await canvas.findByRole("group", {
        name: "Quando o trabalho deve começar?",
      })
    ).toBeVisible()

    // Step 3 is the last one: Submit replaces Next. Stays on a checked
    // choice, for axe.
    await expect(canvas.queryByRole("button", { name: "Próxima" })).toBeNull()
    await userEvent.click(canvas.getByRole("radio", { name: /Agora/ }))
    await expect(canvas.getByRole("radio", { name: /Agora/ })).toBeChecked()
    await expect(
      canvas.getByRole("button", { name: "Salvar plano" })
    ).toBeVisible()
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="direcao"
      items={[
        {
          name: "direcao",
          required: true,
          choices: [
            { value: "linha-do-tempo" },
            { value: "aprovacoes" },
            { value: "delegacao" },
          ],
        },
        {
          name: "sinais",
          choices: [
            { value: "progresso" },
            { value: "decisoes" },
            { value: "riscos" },
            { value: "proximo-passo" },
          ],
        },
        {
          name: "prazo",
          required: true,
          choices: [
            { value: "agora" },
            { value: "proximo-ciclo" },
            { value: "backlog" },
          ],
        },
      ]}
      shortcuts="letters"
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="direcao" required>
        <QuestionnaireTitle>
          O que devemos construir a seguir?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha uma direção ou descreva outra ideia.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="linha-do-tempo">
            <span className="font-medium">Linha do tempo de ações</span>
            <span className="text-muted-foreground">
              Mostra o que o assistente executou e o que voltou.
            </span>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="aprovacoes">
            <span className="font-medium">Pontos de aprovação</span>
            <span className="text-muted-foreground">
              Pergunta antes de ações sensíveis ou destrutivas.
            </span>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="delegacao">
            <span className="font-medium">Passagem entre agentes</span>
            <span className="text-muted-foreground">
              Deixa o trabalho delegado mais fácil de acompanhar.
            </span>
          </QuestionnaireChoice>
          <div className="grid gap-2">
            <Label htmlFor="demo-outra-ideia">Outra funcionalidade</Label>
            <QuestionnaireInput
              id="demo-outra-ideia"
              placeholder="Descreva outra funcionalidade…"
            />
          </div>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="sinais" multiple>
        <QuestionnaireTitle>
          O que toda atualização de progresso deve incluir?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Marque todas que se aplicam ou pule esta pergunta.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="progresso">Progresso</QuestionnaireChoice>
          <QuestionnaireChoice value="decisoes">Decisões</QuestionnaireChoice>
          <QuestionnaireChoice value="riscos">Riscos</QuestionnaireChoice>
          <QuestionnaireChoice value="proximo-passo">
            Próximo passo
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="prazo" required>
        <QuestionnaireTitle>Quando o trabalho deve começar?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha quando o assistente deve começar.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="agora">Agora</QuestionnaireChoice>
          <QuestionnaireChoice value="proximo-ciclo">
            No próximo ciclo de desenvolvimento
          </QuestionnaireChoice>
          <QuestionnaireChoice value="backlog">
            Adicionar ao backlog
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Salvar plano</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

export const SelecaoMultipla: Story = {
  name: "Seleção múltipla",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // `multiple` renders checkboxes: more than one can be checked.
    const codigo = await canvas.findByRole("checkbox", {
      name: "Arquivos de código relevantes",
    })
    const testes = canvas.getByRole("checkbox", { name: "Testes existentes" })
    await userEvent.click(codigo)
    await userEvent.click(testes)
    await expect(codigo).toBeChecked()
    await expect(testes).toBeChecked()
    await expect(
      canvas.getByRole("checkbox", { name: "Histórico de commits recentes" })
    ).not.toBeChecked()
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      items={[
        {
          name: "contexto",
          required: true,
          choices: [
            { value: "codigo" },
            { value: "testes" },
            { value: "docs" },
            { value: "historico" },
          ],
        },
      ]}
      shortcuts="letters"
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireItem name="contexto" multiple required>
        <QuestionnaireTitle>
          Que contexto o assistente deve consultar?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Marque todas as fontes que podem afetar a implementação.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="codigo">
            Arquivos de código relevantes
          </QuestionnaireChoice>
          <QuestionnaireChoice value="testes">
            Testes existentes
          </QuestionnaireChoice>
          <QuestionnaireChoice value="docs">
            Documentação de arquitetura
          </QuestionnaireChoice>
          <QuestionnaireChoice value="historico">
            Histórico de commits recentes
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit>Compartilhar contexto</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

export const RespostaLivre: Story = {
  name: "Resposta livre",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The free-text input has a visible label that names it.
    const campo = await canvas.findByRole("textbox", {
      name: "Outra abordagem de refatoração",
    })
    await userEvent.type(campo, "Extrair a regra de negócio primeiro")
    await expect(campo).toHaveValue("Extrair a regra de negócio primeiro")
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      items={[
        {
          name: "abordagem",
          required: true,
          choices: [
            { value: "incremental" },
            { value: "modulo" },
            { value: "reescrita" },
          ],
        },
      ]}
      shortcuts="letters"
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireItem name="abordagem" required>
        <QuestionnaireTitle>
          Como o assistente deve abordar esta refatoração?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha uma estratégia ou escreva uma instrução mais específica.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental">
            Fazer a menor mudança segura
          </QuestionnaireChoice>
          <QuestionnaireChoice value="modulo">
            Refatorar um módulo por vez
          </QuestionnaireChoice>
          <QuestionnaireChoice value="reescrita">
            Substituir a implementação por completo
          </QuestionnaireChoice>
          <div className="grid gap-2">
            <Label htmlFor="livre-outra-abordagem">
              Outra abordagem de refatoração
            </Label>
            <QuestionnaireInput
              id="livre-outra-abordagem"
              placeholder="Descreva outra abordagem…"
            />
          </div>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit>Usar esta abordagem</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

export const PularExplicitamente: Story = {
  name: "Pular explicitamente",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Step 1 is required: there is no Skip button.
    await canvas.findByRole("group", { name: "Que tipo de mudança é esta?" })
    await expect(canvas.queryByRole("button", { name: "Pular" })).toBeNull()
    await userEvent.click(
      canvas.getByRole("radio", { name: "Correção de bug" })
    )
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))

    // Step 2 is optional: Skip shows up and moves on without an answer.
    await canvas.findByRole("group", {
      name: "Há restrições de implementação?",
    })
    await userEvent.click(await canvas.findByRole("button", { name: "Pular" }))
    await canvas.findByRole("group", {
      name: "Como o trabalho deve ser revisado?",
    })

    // Back on step 2 the skipped question has no answer.
    await userEvent.click(canvas.getByRole("button", { name: "Anterior" }))
    await canvas.findByRole("group", {
      name: "Há restrições de implementação?",
    })
    for (const radio of canvas.getAllByRole("radio")) {
      await expect(radio).not.toBeChecked()
    }

    // Stays on step 2 with one constraint checked, for axe.
    await userEvent.click(
      canvas.getByRole("radio", { name: "Preservar a API pública" })
    )
    await expect(
      canvas.getByRole("radio", { name: "Preservar a API pública" })
    ).toBeChecked()
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="tarefa"
      items={[
        { name: "tarefa", required: true },
        { name: "restricoes" },
        { name: "revisao", required: true },
      ]}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="tarefa" required>
        <QuestionnaireTitle>Que tipo de mudança é esta?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha a categoria que melhor descreve o trabalho.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="funcionalidade">
            Nova funcionalidade
          </QuestionnaireChoice>
          <QuestionnaireChoice value="correcao">
            Correção de bug
          </QuestionnaireChoice>
          <QuestionnaireChoice value="refatoracao">
            Refatoração
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="restricoes">
        <QuestionnaireTitle>Há restrições de implementação?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Responda se for preciso ou pule esta pergunta de propósito.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="sem-dependencias">
            Não adicionar dependências
          </QuestionnaireChoice>
          <QuestionnaireChoice value="sem-migracoes">
            Não alterar o banco de dados
          </QuestionnaireChoice>
          <QuestionnaireChoice value="preservar-api">
            Preservar a API pública
          </QuestionnaireChoice>
          <div className="grid gap-2">
            <Label htmlFor="pular-outra-restricao">
              Outra restrição de implementação
            </Label>
            <QuestionnaireInput
              id="pular-outra-restricao"
              placeholder="Descreva outra restrição…"
            />
          </div>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="revisao" required>
        <QuestionnaireTitle>
          Como o trabalho deve ser revisado?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha as verificações antes da entrega.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="testes">
            Rodar a suíte de testes
          </QuestionnaireChoice>
          <QuestionnaireChoice value="diff">
            Revisar o diff final
          </QuestionnaireChoice>
          <QuestionnaireChoice value="ambos">
            Testes e revisão do diff
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Enviar briefing</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

export const Atalhos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Each choice shows its key (hidden from assistive tech, which gets
    // aria-keyshortcuts on the input instead).
    const inspecionar = await canvas.findByRole("radio", {
      name: /Inspecionar a implementação/,
    })
    await expect(inspecionar).toHaveAttribute("aria-keyshortcuts", "A")
    await expect(canvas.getByText("A")).toBeVisible()
    await expect(canvas.getByText("B")).toBeVisible()

    // The shortcuts work while the focus is inside the questionnaire: Tab
    // gets in, and pressing the key selects that choice.
    await userEvent.tab()
    await userEvent.keyboard("b")
    await expect(
      canvas.getByRole("radio", { name: /Rodar os testes relevantes/ })
    ).toBeChecked()
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      items={[
        {
          name: "acao",
          required: true,
          choices: [
            { value: "inspecionar" },
            { value: "testes" },
            { value: "patch" },
          ],
        },
      ]}
      shortcuts="letters"
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireItem name="acao" required>
        <QuestionnaireTitle>
          O que o assistente deve fazer agora?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Use o atalho mostrado ao lado de cada opção ou navegue pelo teclado.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="inspecionar">
            Inspecionar a implementação
          </QuestionnaireChoice>
          <QuestionnaireChoice value="testes">
            Rodar os testes relevantes
          </QuestionnaireChoice>
          <QuestionnaireChoice value="patch">
            Preparar o patch
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit>Confirmar ação</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

function ValidacaoPersonalizadaExemplo() {
  const [item, setItem] = React.useState("detalhe")
  const [erros, setErros] = React.useState<{ detalhe?: string }>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const respostas = new FormData(event.currentTarget)

    // Cross-field rule: a public answer needs the complete version.
    if (
      respostas.get("publico") === "publico" &&
      respostas.get("detalhe") === "resumo"
    ) {
      setErros({
        detalhe:
          "Respostas públicas precisam de contexto suficiente. Escolha uma resposta completa.",
      })
      setItem("detalhe")
      return
    }
    setErros({})
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={[
        { name: "detalhe", required: true },
        { name: "publico", required: true },
      ]}
      onItemChange={setItem}
      onSubmit={handleSubmit}
    >
      <Card className="w-full">
        <QuestionnaireItem
          aria-labelledby="validacao-detalhe-titulo"
          invalid={Boolean(erros.detalhe)}
          name="detalhe"
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id="validacao-detalhe-titulo"
              render={<CardTitle />}
            >
              Quanto detalhe a resposta deve ter?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Escolha a profundidade da resposta.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="resumo" onChange={() => setErros({})}>
                Resumo curto
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="completa"
                onChange={() => setErros({})}
              >
                Resposta completa
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>{erros.detalhe}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>
        <QuestionnaireItem
          aria-labelledby="validacao-publico-titulo"
          name="publico"
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id="validacao-publico-titulo"
              render={<CardTitle />}
            >
              Quem vai ler a resposta?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Respostas públicas exigem contexto completo.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="equipe">
                Minha equipe
              </QuestionnaireChoice>
              <QuestionnaireChoice value="publico">
                Público externo
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>
        <CardFooter>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext />
            <QuestionnaireSubmit>Validar respostas</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}

export const ValidacaoPersonalizada: Story = {
  name: "Validação personalizada",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [item, setItem] = React.useState("detalhe")
  const [erros, setErros] = React.useState<{ detalhe?: string }>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const respostas = new FormData(event.currentTarget)

    // Cross-field rule: a public answer needs the complete version.
    if (
      respostas.get("publico") === "publico" &&
      respostas.get("detalhe") === "resumo"
    ) {
      setErros({
        detalhe:
          "Respostas públicas precisam de contexto suficiente. Escolha uma resposta completa.",
      })
      setItem("detalhe")
      return
    }
    setErros({})
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={[
        { name: "detalhe", required: true },
        { name: "publico", required: true },
      ]}
      onItemChange={setItem}
      onSubmit={handleSubmit}
    >
      <Card className="w-full">
        <QuestionnaireItem
          aria-labelledby="validacao-detalhe-titulo"
          invalid={Boolean(erros.detalhe)}
          name="detalhe"
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id="validacao-detalhe-titulo"
              render={<CardTitle />}
            >
              Quanto detalhe a resposta deve ter?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Escolha a profundidade da resposta.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice
                value="resumo"
                onChange={() => setErros({})}
              >
                Resumo curto
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="completa"
                onChange={() => setErros({})}
              >
                Resposta completa
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>{erros.detalhe}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>
        <QuestionnaireItem
          aria-labelledby="validacao-publico-titulo"
          name="publico"
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id="validacao-publico-titulo"
              render={<CardTitle />}
            >
              Quem vai ler a resposta?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Respostas públicas exigem contexto completo.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="equipe">Minha equipe</QuestionnaireChoice>
              <QuestionnaireChoice value="publico">
                Público externo
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>
        <CardFooter>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext />
            <QuestionnaireSubmit>Validar respostas</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // "Resumo curto" + "Público externo" breaks the rule.
    await userEvent.click(
      await canvas.findByRole("radio", { name: "Resumo curto" })
    )
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))
    await userEvent.click(
      await canvas.findByRole("radio", { name: "Público externo" })
    )
    await userEvent.click(
      canvas.getByRole("button", { name: "Validar respostas" })
    )

    // The host sends the user back to the invalid item and shows the error
    // as text; the item and its answers expose aria-invalid.
    const grupo = await canvas.findByRole("group", {
      name: "Quanto detalhe a resposta deve ter?",
    })
    await expect(grupo).toHaveAttribute("aria-invalid", "true")
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Respostas públicas precisam de contexto suficiente."
    )
    await expect(
      canvas.getByRole("radio", { name: "Resumo curto" })
    ).toBeChecked()
    await waitFor(() =>
      expect(
        canvas.getByRole("radio", { name: "Resumo curto" })
      ).toHaveAttribute("aria-invalid", "true")
    )
    await esperarAnimacoes()
  },
  render: () => <ValidacaoPersonalizadaExemplo />,
}

function ControladoExemplo() {
  const [item, setItem] = React.useState("escopo")

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <p className="text-sm text-muted-foreground" role="status">
        Ponto atual: {item === "escopo" ? "Escopo da mudança" : null}
        {item === "verificacao" ? "Verificação" : null}
        {item === "entrega" ? "Entrega final" : null}
      </p>
      <Questionnaire
        item={item}
        items={[
          { name: "escopo", required: true },
          { name: "verificacao", required: true },
          { name: "entrega", required: true },
        ]}
        onItemChange={setItem}
        onSubmit={(event) => event.preventDefault()}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="escopo" required>
          <QuestionnaireTitle>
            O que o assistente pode alterar?
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            O host guarda o ponto ativo enquanto o Questionnaire navega.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="componente">
              Só o componente alvo
            </QuestionnaireChoice>
            <QuestionnaireChoice value="testes">
              O componente e os testes dele
            </QuestionnaireChoice>
            <QuestionnaireChoice value="area">
              A área inteira da funcionalidade
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="verificacao" required>
          <QuestionnaireTitle>
            Que nível de verificação deve usar?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="direcionada">
              Testes direcionados
            </QuestionnaireChoice>
            <QuestionnaireChoice value="pacote">
              Testes do pacote e verificação de tipos
            </QuestionnaireChoice>
            <QuestionnaireChoice value="completa">
              Verificação completa do workspace
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="entrega" required>
          <QuestionnaireTitle>
            O que deve voltar ao terminar?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="resumo">
              Resumo curto
            </QuestionnaireChoice>
            <QuestionnaireChoice value="arquivos">
              Resumo com os arquivos alterados
            </QuestionnaireChoice>
            <QuestionnaireChoice value="relatorio">
              Relatório detalhado da implementação
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Salvar fluxo</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

export const Controlado: Story = {
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [item, setItem] = React.useState("escopo")

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <p className="text-sm text-muted-foreground" role="status">
        Ponto atual: {item === "escopo" ? "Escopo da mudança" : null}
        {item === "verificacao" ? "Verificação" : null}
        {item === "entrega" ? "Entrega final" : null}
      </p>
      <Questionnaire
        item={item}
        items={[
          { name: "escopo", required: true },
          { name: "verificacao", required: true },
          { name: "entrega", required: true },
        ]}
        onItemChange={setItem}
        onSubmit={(event) => event.preventDefault()}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="escopo" required>
          <QuestionnaireTitle>O que o assistente pode alterar?</QuestionnaireTitle>
          <QuestionnaireDescription>
            O host guarda o ponto ativo enquanto o Questionnaire navega.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="componente">
              Só o componente alvo
            </QuestionnaireChoice>
            <QuestionnaireChoice value="testes">
              O componente e os testes dele
            </QuestionnaireChoice>
            <QuestionnaireChoice value="area">
              A área inteira da funcionalidade
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="verificacao" required>
          <QuestionnaireTitle>
            Que nível de verificação deve usar?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="direcionada">
              Testes direcionados
            </QuestionnaireChoice>
            <QuestionnaireChoice value="pacote">
              Testes do pacote e verificação de tipos
            </QuestionnaireChoice>
            <QuestionnaireChoice value="completa">
              Verificação completa do workspace
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="entrega" required>
          <QuestionnaireTitle>O que deve voltar ao terminar?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="resumo">Resumo curto</QuestionnaireChoice>
            <QuestionnaireChoice value="arquivos">
              Resumo com os arquivos alterados
            </QuestionnaireChoice>
            <QuestionnaireChoice value="relatorio">
              Relatório detalhado da implementação
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Salvar fluxo</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The host state follows the navigation; the status is a live region.
    const status = await canvas.findByRole("status")
    await expect(status).toHaveTextContent("Ponto atual: Escopo da mudança")
    await userEvent.click(
      canvas.getByRole("radio", { name: "O componente e os testes dele" })
    )
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))
    await waitFor(() =>
      expect(status).toHaveTextContent("Ponto atual: Verificação")
    )
    await expect(
      canvas.getByRole("progressbar", { name: "Progresso do questionário" })
    ).toHaveAttribute("aria-valuetext", "Pergunta 2 de 3")
    await userEvent.click(
      canvas.getByRole("radio", { name: "Testes direcionados" })
    )
    await esperarAnimacoes()
  },
  render: () => <ControladoExemplo />,
}

export const Retomar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Starts on the saved item, with the saved answers checked.
    await canvas.findByRole("group", {
      name: "Como a migração deve ser verificada?",
    })
    const testes = canvas.getByRole("checkbox", {
      name: "Rodar os testes de migração",
    })
    await expect(testes).toBeChecked()
    await expect(
      canvas.getByRole("checkbox", { name: "Rodar a verificação de tipos" })
    ).toBeChecked()

    // Change an answer, then reset: the saved state comes back.
    await userEvent.click(testes)
    await expect(testes).not.toBeChecked()
    await userEvent.click(
      canvas.getByRole("button", { name: "Desfazer alterações" })
    )
    await waitFor(() => expect(testes).toBeChecked())
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="verificacao"
      items={[
        { name: "mudanca", required: true },
        { name: "verificacao", required: true },
        { name: "notas" },
      ]}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="mudanca" required>
        <QuestionnaireTitle>Que tipo de migração é esta?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Esta resposta foi salva na sessão anterior.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental" defaultChecked>
            Migração incremental
          </QuestionnaireChoice>
          <QuestionnaireChoice value="virada">Virada única</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="verificacao" multiple required>
        <QuestionnaireTitle>
          Como a migração deve ser verificada?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Estas verificações foram marcadas na sessão anterior.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="testes" defaultChecked>
            Rodar os testes de migração
          </QuestionnaireChoice>
          <QuestionnaireChoice value="tipos" defaultChecked>
            Rodar a verificação de tipos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="manual">
            Fazer um teste manual rápido
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="notas">
        <QuestionnaireTitle>
          Mais alguma coisa que o assistente deve lembrar?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Esta nota foi salva junto com o rascunho.
        </QuestionnaireDescription>
        <div className="grid gap-2">
          <Label htmlFor="retomar-nota">Nota sobre a migração</Label>
          <QuestionnaireInput
            id="retomar-nota"
            defaultValue="Manter a API pública estável."
          />
        </div>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <Button type="reset" variant="outline">
          Desfazer alterações
        </Button>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Atualizar rascunho</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

function ItensCondicionaisExemplo() {
  const [ambiente, setAmbiente] = React.useState("local")
  const items = React.useMemo(
    () => [
      { name: "ambiente", required: true },
      { name: "nuvem", required: true, disabled: ambiente !== "nuvem" },
      { name: "aprovacao", required: true },
    ],
    [ambiente]
  )

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="ambiente"
      items={items}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="ambiente" required>
        <QuestionnaireTitle>Onde o assistente deve rodar?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Rodar na nuvem acrescenta uma pergunta sobre o ambiente.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice
            checked={ambiente === "local"}
            value="local"
            onChange={() => setAmbiente("local")}
          >
            Workspace local
          </QuestionnaireChoice>
          <QuestionnaireChoice
            checked={ambiente === "nuvem"}
            value="nuvem"
            onChange={() => setAmbiente("nuvem")}
          >
            Workspace na nuvem
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem disabled={ambiente !== "nuvem"} name="nuvem" required>
        <QuestionnaireTitle>Qual ambiente de nuvem usar?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
          <QuestionnaireChoice value="homologacao">
            Homologação
          </QuestionnaireChoice>
          <QuestionnaireChoice value="isolado">
            Sandbox isolado
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="aprovacao" required>
        <QuestionnaireTitle>
          Quando o assistente deve pedir aprovação?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="escrita">
            Antes de gravar arquivos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="comandos">
            Antes de executar comandos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="sensivel">
            Só em ações sensíveis
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Salvar plano de execução</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export const ItensCondicionais: Story = {
  name: "Itens condicionais",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [ambiente, setAmbiente] = React.useState("local")
  const items = React.useMemo(
    () => [
      { name: "ambiente", required: true },
      { name: "nuvem", required: true, disabled: ambiente !== "nuvem" },
      { name: "aprovacao", required: true },
    ],
    [ambiente]
  )

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="ambiente"
      items={items}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="ambiente" required>
        <QuestionnaireTitle>Onde o assistente deve rodar?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Rodar na nuvem acrescenta uma pergunta sobre o ambiente.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice
            checked={ambiente === "local"}
            value="local"
            onChange={() => setAmbiente("local")}
          >
            Workspace local
          </QuestionnaireChoice>
          <QuestionnaireChoice
            checked={ambiente === "nuvem"}
            value="nuvem"
            onChange={() => setAmbiente("nuvem")}
          >
            Workspace na nuvem
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem
        disabled={ambiente !== "nuvem"}
        name="nuvem"
        required
      >
        <QuestionnaireTitle>Qual ambiente de nuvem usar?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
          <QuestionnaireChoice value="homologacao">Homologação</QuestionnaireChoice>
          <QuestionnaireChoice value="isolado">
            Sandbox isolado
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="aprovacao" required>
        <QuestionnaireTitle>
          Quando o assistente deve pedir aprovação?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="escrita">
            Antes de gravar arquivos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="comandos">
            Antes de executar comandos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="sensivel">
            Só em ações sensíveis
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Salvar plano de execução</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const progresso = () =>
      canvas.getByRole("progressbar", { name: "Progresso do questionário" })

    // Local: the cloud question does not apply, so there are 2 questions.
    await canvas.findByRole("group", { name: "Onde o assistente deve rodar?" })
    await expect(progresso()).toHaveAttribute(
      "aria-valuetext",
      "Pergunta 1 de 2"
    )

    // Cloud: the question is enabled and the count changes to 3.
    await userEvent.click(
      canvas.getByRole("radio", { name: "Workspace na nuvem" })
    )
    await waitFor(() =>
      expect(progresso()).toHaveAttribute("aria-valuetext", "Pergunta 1 de 3")
    )
    await esperarAnimacoes()
  },
  render: () => <ItensCondicionaisExemplo />,
}

function EstadoDeNavegacaoExemplo() {
  const [item, setItem] = React.useState("permissao")
  const [status, setStatus] = React.useState({
    permissao: "unanswered",
    verificacao: "unanswered",
  })
  const semResposta =
    status[item as "permissao" | "verificacao"] === "unanswered"

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={[
        { name: "permissao", required: true },
        { name: "verificacao", required: true },
      ]}
      onItemChange={setItem}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem
        name="permissao"
        required
        onStatusChange={(valor) =>
          setStatus((atual) => ({ ...atual, permissao: valor }))
        }
      >
        <QuestionnaireTitle>
          O que o assistente pode modificar?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          O botão Próxima fica desabilitado até uma resposta ser escolhida.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="arquivos">
            Arquivos do projeto
          </QuestionnaireChoice>
          <QuestionnaireChoice value="testes">
            Arquivos do projeto e testes
          </QuestionnaireChoice>
          <QuestionnaireChoice value="config">
            Arquivos, testes e configuração
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem
        name="verificacao"
        required
        onStatusChange={(valor) =>
          setStatus((atual) => ({ ...atual, verificacao: valor }))
        }
      >
        <QuestionnaireTitle>
          O que deve passar antes de concluir?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="testes">Testes</QuestionnaireChoice>
          <QuestionnaireChoice value="tipos">
            Testes e tipos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="tudo">
            Testes, tipos e revisão visual
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext disabled={semResposta} variant="secondary" />
        <QuestionnaireSubmit disabled={semResposta}>
          Salvar permissões
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export const EstadoDeNavegacao: Story = {
  name: "Estado de navegação",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [item, setItem] = React.useState("permissao")
  const [status, setStatus] = React.useState({
    permissao: "unanswered",
    verificacao: "unanswered",
  })
  const semResposta = status[item as "permissao" | "verificacao"] === "unanswered"

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={[
        { name: "permissao", required: true },
        { name: "verificacao", required: true },
      ]}
      onItemChange={setItem}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem
        name="permissao"
        required
        onStatusChange={(valor) =>
          setStatus((atual) => ({ ...atual, permissao: valor }))
        }
      >
        <QuestionnaireTitle>O que o assistente pode modificar?</QuestionnaireTitle>
        <QuestionnaireDescription>
          O botão Próxima fica desabilitado até uma resposta ser escolhida.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="arquivos">
            Arquivos do projeto
          </QuestionnaireChoice>
          <QuestionnaireChoice value="testes">
            Arquivos do projeto e testes
          </QuestionnaireChoice>
          <QuestionnaireChoice value="config">
            Arquivos, testes e configuração
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem
        name="verificacao"
        required
        onStatusChange={(valor) =>
          setStatus((atual) => ({ ...atual, verificacao: valor }))
        }
      >
        <QuestionnaireTitle>O que deve passar antes de concluir?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="testes">Testes</QuestionnaireChoice>
          <QuestionnaireChoice value="tipos">Testes e tipos</QuestionnaireChoice>
          <QuestionnaireChoice value="tudo">
            Testes, tipos e revisão visual
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext disabled={semResposta} variant="secondary" />
        <QuestionnaireSubmit disabled={semResposta}>
          Salvar permissões
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Without an answer, Next is disabled; choosing one enables it.
    const proxima = await canvas.findByRole("button", { name: "Próxima" })
    await expect(proxima).toBeDisabled()
    await userEvent.click(
      canvas.getByRole("radio", { name: "Arquivos do projeto e testes" })
    )
    await waitFor(() => expect(proxima).toBeEnabled())
    await esperarAnimacoes()
  },
  render: () => <EstadoDeNavegacaoExemplo />,
}

export const ProgressoPersonalizado: Story = {
  name: "Progresso personalizado",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The segments are decorative; the text and aria-valuetext carry the
    // progress.
    const progresso = await canvas.findByRole("progressbar", {
      name: "Progresso do questionário",
    })
    await expect(progresso).toHaveTextContent("Pergunta 1 de 4")
    await userEvent.click(canvas.getByRole("radio", { name: "Pequeno ajuste" }))
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))
    await waitFor(() =>
      expect(
        canvas.getByRole("progressbar", { name: "Progresso do questionário" })
      ).toHaveTextContent("Pergunta 2 de 4")
    )
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="tamanho"
      items={[
        { name: "tamanho", required: true },
        { name: "commits", required: true },
        { name: "testes", required: true },
        { name: "entrega", required: true },
      ]}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress
        className="w-full"
        render={(props, state) => (
          <div {...props}>
            <div className="mb-2 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: state.total }, (_, index) => (
                <span
                  key={index}
                  className={
                    index < state.current
                      ? "h-1.5 flex-1 rounded-full bg-primary"
                      : "h-1.5 flex-1 rounded-full bg-muted"
                  }
                />
              ))}
            </div>
            <span>
              Pergunta {state.current} de {state.total}
            </span>
          </div>
        )}
      />
      <QuestionnaireItem name="tamanho" required>
        <QuestionnaireTitle>Qual o tamanho da mudança?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="pequeno">
            Pequeno ajuste
          </QuestionnaireChoice>
          <QuestionnaireChoice value="medio">
            Mudança do tamanho de uma funcionalidade
          </QuestionnaireChoice>
          <QuestionnaireChoice value="grande">
            Mudança entre pacotes
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="commits" required>
        <QuestionnaireTitle>Como organizar os commits?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="unico">
            Um único commit
          </QuestionnaireChoice>
          <QuestionnaireChoice value="logicos">
            Commits lógicos
          </QuestionnaireChoice>
          <QuestionnaireChoice value="squash">
            Squash antes da revisão
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="testes" required>
        <QuestionnaireTitle>Quais testes devem rodar?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="direcionados">
            Testes direcionados
          </QuestionnaireChoice>
          <QuestionnaireChoice value="pacote">
            Suíte do pacote
          </QuestionnaireChoice>
          <QuestionnaireChoice value="workspace">
            Workspace completo
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="entrega" required>
        <QuestionnaireTitle>Como entregar o trabalho?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="patch">Só o patch</QuestionnaireChoice>
          <QuestionnaireChoice value="commit">Commit local</QuestionnaireChoice>
          <QuestionnaireChoice value="branch">
            Enviar uma branch para revisão
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Concluir plano</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

export const ItensAnimados: Story = {
  name: "Itens animados",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole("group", { name: "O que o assistente deve fazer?" })
    await userEvent.click(
      canvas.getByRole("radio", { name: "Implementar a mudança pedida" })
    )
    await userEvent.click(canvas.getByRole("button", { name: "Próxima" }))
    await canvas.findByRole("group", {
      name: "Como o trabalho deve ser revisado?",
    })
    // axe must not run in the middle of the fade-in.
    await esperarAnimacoes()
    await userEvent.click(
      canvas.getByRole("radio", { name: "Verificações direcionadas" })
    )
    await expect(
      canvas.getByRole("radio", { name: "Verificações direcionadas" })
    ).toBeChecked()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="tarefa"
      items={[
        { name: "tarefa", required: true },
        { name: "revisao", required: true },
        { name: "entrega", required: true },
      ]}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem
        className="motion-reduce:animate-none data-active:animate-in data-active:duration-300 data-active:fade-in-0 data-active:slide-in-from-bottom-2"
        name="tarefa"
        required
      >
        <QuestionnaireTitle>O que o assistente deve fazer?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha a tarefa desta execução.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="implementar">
            Implementar a mudança pedida
          </QuestionnaireChoice>
          <QuestionnaireChoice value="depurar">
            Depurar o comportamento atual
          </QuestionnaireChoice>
          <QuestionnaireChoice value="revisar">
            Revisar a implementação
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem
        className="motion-reduce:animate-none data-active:animate-in data-active:duration-300 data-active:fade-in-0 data-active:slide-in-from-bottom-2"
        name="revisao"
        required
      >
        <QuestionnaireTitle>
          Como o trabalho deve ser revisado?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha a profundidade da verificação.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="direcionada">
            Verificações direcionadas
          </QuestionnaireChoice>
          <QuestionnaireChoice value="completa">
            Suíte de testes completa
          </QuestionnaireChoice>
          <QuestionnaireChoice value="manual">
            Testes e QA manual
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem
        className="motion-reduce:animate-none data-active:animate-in data-active:duration-300 data-active:fade-in-0 data-active:slide-in-from-bottom-2"
        name="entrega"
        required
      >
        <QuestionnaireTitle>Como entregar o resultado?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Escolha o formato da entrega final.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="resumo">Resumo curto</QuestionnaireChoice>
          <QuestionnaireChoice value="diff">
            Resumo e arquivos alterados
          </QuestionnaireChoice>
          <QuestionnaireChoice value="relatorio">
            Relatório detalhado para revisão
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Salvar fluxo</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  ),
}

export const CardComQuestionnaire: Story = {
  name: "Card",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The legend is inside the CardHeader, so aria-labelledby names the group.
    await expect(
      await canvas.findByRole("group", {
        name: "No que o assistente deve trabalhar?",
      })
    ).toBeVisible()

    // Numbers as shortcuts: with the focus inside, "2" selects the second
    // choice.
    await userEvent.tab()
    await userEvent.keyboard("2")
    await expect(
      canvas.getByRole("radio", { name: "Refatorar a camada de dados" })
    ).toBeChecked()
    await esperarAnimacoes()
  },
  render: () => (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="tarefa"
      items={[
        {
          name: "tarefa",
          required: true,
          choices: [
            { value: "correcao" },
            { value: "refatoracao" },
            { value: "docs" },
          ],
        },
        {
          name: "entrega",
          required: true,
          choices: [
            { value: "resumo" },
            { value: "arquivos" },
            { value: "relatorio" },
          ],
        },
      ]}
      shortcuts="numbers"
      onSubmit={(event) => event.preventDefault()}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby="card-tarefa-titulo"
          name="tarefa"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id="card-tarefa-titulo" render={<CardTitle />}>
              No que o assistente deve trabalhar?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Escolha a tarefa que deve ser tratada a seguir.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="correcao">
                Corrigir os testes que falham
              </QuestionnaireChoice>
              <QuestionnaireChoice value="refatoracao">
                Refatorar a camada de dados
              </QuestionnaireChoice>
              <QuestionnaireChoice value="docs">
                Atualizar o guia de integração
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>
        <QuestionnaireItem
          aria-labelledby="card-entrega-titulo"
          name="entrega"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id="card-entrega-titulo" render={<CardTitle />}>
              O que a entrega final deve incluir?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Escolha o nível de detalhe necessário para a revisão.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="resumo">
                Só o resumo
              </QuestionnaireChoice>
              <QuestionnaireChoice value="arquivos">
                Resumo e arquivos alterados
              </QuestionnaireChoice>
              <QuestionnaireChoice value="relatorio">
                Relatório completo para revisão
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>
        <CardFooter>
          <QuestionnaireActions className="w-full">
            <QuestionnairePrevious />
            <QuestionnaireNext />
            <QuestionnaireSubmit>Criar tarefa</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  ),
}

function DialogoExemplo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Abrir esclarecimento
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Esclarecimento sobre a tarefa</DialogTitle>
          <DialogDescription>
            Responda às perguntas para o assistente continuar.
          </DialogDescription>
        </DialogHeader>
        <Questionnaire
          defaultItem="escopo"
          items={[
            { name: "escopo", required: true },
            { name: "testes", required: true },
          ]}
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <QuestionnaireProgress />
          <QuestionnaireItem name="escopo" required>
            <QuestionnaireTitle>
              Quais arquivos entram no escopo?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              Escolha o quanto o assistente pode atualizar no workspace.
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="componente">
                Só o componente
              </QuestionnaireChoice>
              <QuestionnaireChoice value="funcionalidade">
                O diretório inteiro da funcionalidade
              </QuestionnaireChoice>
              <QuestionnaireChoice value="workspace">
                Qualquer arquivo relacionado do workspace
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <QuestionnaireItem name="testes" required>
            <QuestionnaireTitle>
              Quanta verificação é necessária?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              Escolha as verificações que o assistente roda antes da entrega.
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="direcionados">
                Testes direcionados
              </QuestionnaireChoice>
              <QuestionnaireChoice value="pacote">
                Testes do pacote
              </QuestionnaireChoice>
              <QuestionnaireChoice value="completa">
                Verificação completa do workspace
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <QuestionnaireActions className="w-auto">
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit>Enviar resposta</QuestionnaireSubmit>
            </QuestionnaireActions>
          </DialogFooter>
        </Questionnaire>
      </DialogContent>
    </Dialog>
  )
}

export const DialogComQuestionnaire: Story = {
  name: "Dialog",
  parameters: {
    docs: {
      source: {
        code: `import * as React from "react"

export function Exemplo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Abrir esclarecimento
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Esclarecimento sobre a tarefa</DialogTitle>
          <DialogDescription>
            Responda às perguntas para o assistente continuar.
          </DialogDescription>
        </DialogHeader>
        <Questionnaire
          defaultItem="escopo"
          items={[
            { name: "escopo", required: true },
            { name: "testes", required: true },
          ]}
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <QuestionnaireProgress />
          <QuestionnaireItem name="escopo" required>
            <QuestionnaireTitle>Quais arquivos entram no escopo?</QuestionnaireTitle>
            <QuestionnaireDescription>
              Escolha o quanto o assistente pode atualizar no workspace.
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="componente">
                Só o componente
              </QuestionnaireChoice>
              <QuestionnaireChoice value="funcionalidade">
                O diretório inteiro da funcionalidade
              </QuestionnaireChoice>
              <QuestionnaireChoice value="workspace">
                Qualquer arquivo relacionado do workspace
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <QuestionnaireItem name="testes" required>
            <QuestionnaireTitle>Quanta verificação é necessária?</QuestionnaireTitle>
            <QuestionnaireDescription>
              Escolha as verificações que o assistente roda antes da entrega.
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="direcionados">
                Testes direcionados
              </QuestionnaireChoice>
              <QuestionnaireChoice value="pacote">
                Testes do pacote
              </QuestionnaireChoice>
              <QuestionnaireChoice value="completa">
                Verificação completa do workspace
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <QuestionnaireActions className="w-auto">
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit>Enviar resposta</QuestionnaireSubmit>
            </QuestionnaireActions>
          </DialogFooter>
        </Questionnaire>
      </DialogContent>
    </Dialog>
  )
}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("button", {
      name: "Abrir esclarecimento",
    })

    // Opens: the dialog has its own stable name; each question is a named
    // group (the legend is the first child of its fieldset).
    await userEvent.click(gatilho)
    const dialogo = await screen.findByRole("dialog", {
      name: "Esclarecimento sobre a tarefa",
    })
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    )
    await esperarAnimacoes()
    await waitFor(() => expect(dialogo).toBeVisible())
    const dentro = within(dialogo)
    await expect(
      dentro.getByRole("group", { name: "Quais arquivos entram no escopo?" })
    ).toBeVisible()

    // Next: step 2 of 2, and the dialog keeps its name.
    await userEvent.click(
      dentro.getByRole("radio", { name: "Só o componente" })
    )
    await userEvent.click(dentro.getByRole("button", { name: "Próxima" }))
    await expect(
      await dentro.findByRole("group", {
        name: "Quanta verificação é necessária?",
      })
    ).toBeVisible()
    await expect(dialogo).toHaveAccessibleName("Esclarecimento sobre a tarefa")

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open, for axe.
    await userEvent.click(gatilho)
    const reaberto = await screen.findByRole("dialog")
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    )
    await esperarAnimacoes()
    await waitFor(() => expect(reaberto).toBeVisible())
  },
  render: () => <DialogoExemplo />,
}
