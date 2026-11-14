import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

/*
 * One story per section of card.mdx, in the order of the shadcn/ui page.
 * The login form of the shadcn examples has a persistent `FieldLabel` tied to
 * each `Input` by `htmlFor`/`id`; its submit button sits in the footer, so it
 * points at the form with the `form` attribute. Ids are prefixed with the
 * story name: the Docs page renders all stories in the same document.
 *
 * "Espaçamento" needs state (the chosen spacing), so it uses the small
 * component below and gives the Docs page the copyable snippet in
 * `docs.source.code`.
 */
const meta = {
  title: "Componentes/Card",
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

function CardComEspacamento() {
  const opcoesDeEspacamento = [
    { className: "[--card-spacing:--spacing(4)]", label: "16px", value: "4" },
    { className: "[--card-spacing:--spacing(5)]", label: "20px", value: "5" },
    { className: "[--card-spacing:--spacing(6)]", label: "24px", value: "6" },
    { className: "[--card-spacing:--spacing(8)]", label: "32px", value: "8" },
  ]

  const [espacamento, setEspacamento] = React.useState("4")
  const escolhida = opcoesDeEspacamento.find(
    (opcao) => opcao.value === espacamento
  )

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <ToggleGroup
        value={[espacamento]}
        onValueChange={(valor) => {
          if (valor[0]) {
            setEspacamento(valor[0])
          }
        }}
        variant="outline"
        size="sm"
        className="justify-center"
        aria-label="Espaçamento do card"
      >
        {opcoesDeEspacamento.map((opcao) => (
          <ToggleGroupItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Card className={escolhida?.className}>
        <CardHeader>
          <CardTitle>
            <h3>Entre na sua conta</h3>
          </CardTitle>
          <CardDescription>
            Informe o seu e-mail abaixo para entrar na sua conta
          </CardDescription>
          <CardAction>
            <a
              href="#criar-conta"
              className={buttonVariants({ variant: "link" })}
            >
              Criar conta
            </a>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            id="espacamento-login"
            onSubmit={(event) => event.preventDefault()}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="espacamento-email">E-mail</FieldLabel>
                <Input
                  id="espacamento-email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="espacamento-senha">Senha</FieldLabel>
                  <a
                    href="#esqueci-a-senha"
                    className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="espacamento-senha"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" form="espacamento-login" className="w-full">
            Entrar
          </Button>
          <Button variant="outline" className="w-full">
            Entrar com o Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export const Demo: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h3>Entre na sua conta</h3>
        </CardTitle>
        <CardDescription>
          Informe o seu e-mail abaixo para entrar na sua conta
        </CardDescription>
        <CardAction>
          <a
            href="#criar-conta"
            className={buttonVariants({ variant: "link" })}
          >
            Criar conta
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="demo-login" onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="demo-email">E-mail</FieldLabel>
              <Input
                id="demo-email"
                type="email"
                placeholder="nome@exemplo.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="demo-senha">Senha</FieldLabel>
                <a
                  href="#esqueci-a-senha"
                  className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="demo-senha"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="demo-login" className="w-full">
          Entrar
        </Button>
        <Button variant="outline" className="w-full">
          Entrar com o Google
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <Card size="sm" className="mx-auto w-full max-w-xs">
      <CardHeader>
        <CardTitle>
          <h3>Relatórios agendados</h3>
        </CardTitle>
        <CardDescription>
          Resumos semanais. Nada de exportar à mão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 py-2 text-sm">
          <li className="flex gap-2">
            <ChevronRightIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground rtl:rotate-180"
            />
            <span>Escolha a frequência (diária ou semanal).</span>
          </li>
          <li className="flex gap-2">
            <ChevronRightIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground rtl:rotate-180"
            />
            <span>Envie para canais ou para pessoas da equipe.</span>
          </li>
          <li className="flex gap-2">
            <ChevronRightIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground rtl:rotate-180"
            />
            <span>Inclua gráficos, tabelas e os principais indicadores.</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="sm" className="w-full">
          Agendar relatórios
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          Ver as novidades
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Espacamento: Story = {
  name: "Espaçamento",
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `function CardComEspacamento() {
  const opcoesDeEspacamento = [
    { className: "[--card-spacing:--spacing(4)]", label: "16px", value: "4" },
    { className: "[--card-spacing:--spacing(5)]", label: "20px", value: "5" },
    { className: "[--card-spacing:--spacing(6)]", label: "24px", value: "6" },
    { className: "[--card-spacing:--spacing(8)]", label: "32px", value: "8" },
  ]

  const [espacamento, setEspacamento] = React.useState("4")
  const escolhida = opcoesDeEspacamento.find(
    (opcao) => opcao.value === espacamento
  )

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <ToggleGroup
        value={[espacamento]}
        onValueChange={(valor) => {
          if (valor[0]) {
            setEspacamento(valor[0])
          }
        }}
        variant="outline"
        size="sm"
        className="justify-center"
        aria-label="Espaçamento do card"
      >
        {opcoesDeEspacamento.map((opcao) => (
          <ToggleGroupItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Card className={escolhida?.className}>
        <CardHeader>
          <CardTitle>
            <h3>Entre na sua conta</h3>
          </CardTitle>
          <CardDescription>
            Informe o seu e-mail abaixo para entrar na sua conta
          </CardDescription>
          <CardAction>
            <a
              href="#criar-conta"
              className={buttonVariants({ variant: "link" })}
            >
              Criar conta
            </a>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            id="espacamento-login"
            onSubmit={(event) => event.preventDefault()}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="espacamento-email">E-mail</FieldLabel>
                <Input
                  id="espacamento-email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="espacamento-senha">Senha</FieldLabel>
                  <a
                    href="#esqueci-a-senha"
                    className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="espacamento-senha"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" form="espacamento-login" className="w-full">
            Entrar
          </Button>
          <Button variant="outline" className="w-full">
            Entrar com o Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}`,
      },
    },
  },
  render: () => <CardComEspacamento />,
}

export const BordaABorda: Story = {
  name: "Borda a borda",
  render: () => (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h3 id="termos-titulo">Termos de serviço</h3>
        </CardTitle>
        <CardDescription>
          Leia os termos antes de aceitar o acordo.
        </CardDescription>
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div
          role="region"
          aria-labelledby="termos-titulo"
          tabIndex={0}
          className="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted px-(--card-spacing) py-4 text-sm leading-relaxed outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <p>
            Estes termos regem o uso do workspace, incluindo o acesso a
            documentos compartilhados, arquivos de projeto e ferramentas de
            colaboração.
          </p>
          <p>
            Você é responsável pelo conteúdo que envia e por garantir que a sua
            equipe tenha as permissões certas para ver ou editar esse conteúdo.
          </p>
          <p>
            Podemos atualizar recursos ou limites conforme o serviço evolui.
            Quando essas mudanças afetarem o seu trabalho, avisaremos os
            administradores do workspace.
          </p>
          <p>
            Ao continuar, você concorda em manter as suas credenciais seguras e
            em seguir as políticas de uso da sua organização.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="outline">Recusar</Button>
        <Button>Aceitar</Button>
      </CardFooter>
    </Card>
  ),
}

export const Imagem: Story = {
  render: () => (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <img
        src="brainz-group-logo.svg"
        alt="Logo da Brainz Group"
        className="aspect-video w-full bg-muted object-contain p-10"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Destaque</Badge>
        </CardAction>
        <CardTitle>
          <h3>Encontro de design systems</h3>
        </CardTitle>
        <CardDescription>
          Uma conversa prática sobre APIs de componentes, acessibilidade e como
          entregar mais rápido.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Ver o evento</Button>
      </CardFooter>
    </Card>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <Card dir="rtl" lang="ar" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h3>تسجيل الدخول إلى حسابك</h3>
        </CardTitle>
        <CardDescription>
          أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
        </CardDescription>
        <CardAction>
          <a
            href="#إنشاء-حساب"
            className={buttonVariants({ variant: "link" })}
          >
            إنشاء حساب
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="rtl-login" onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="rtl-email">البريد الإلكتروني</FieldLabel>
              <Input
                id="rtl-email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="rtl-senha">كلمة المرور</FieldLabel>
                <a
                  href="#نسيت-كلمة-المرور"
                  className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
              <Input
                id="rtl-senha"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="rtl-login" className="w-full">
          تسجيل الدخول
        </Button>
        <Button variant="outline" className="w-full">
          تسجيل الدخول باستخدام Google
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Playground: Story = {
  args: {
    size: "default",
    className: "w-full max-w-sm",
    children: (
      <>
        <CardHeader>
          <CardTitle>
            <h3>Título do card</h3>
          </CardTitle>
          <CardDescription>Descrição do card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo do card</p>
        </CardContent>
        <CardFooter>
          <p>Rodapé do card</p>
        </CardFooter>
      </>
    ),
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
}
