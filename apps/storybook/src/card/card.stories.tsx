import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon } from "lucide-react"

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

/*
 * One story per section of card.mdx, in the order of the shadcn/ui page.
 * The shadcn examples use Input, Label, ToggleGroup and Badge, which this
 * system does not have yet: these keep the structure with Button only.
 */
const meta = {
  title: "Componentes/Card",
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h3>Relatórios agendados</h3>
        </CardTitle>
        <CardDescription>
          Receba um resumo semanal sem exportar nada à mão.
        </CardDescription>
        <CardAction>
          <a href="#novidades" className={buttonVariants({ variant: "link" })}>
            Novidades
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          Escolha a frequência, os destinatários e os indicadores que entram em
          cada relatório.
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Agendar relatório</Button>
        <Button variant="outline" className="w-full">
          Ver exemplo
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
  render: () => (
    <Card className="mx-auto w-full max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle>
          <h3>Convite para o workspace</h3>
        </CardTitle>
        <CardDescription>
          Você foi convidado para o workspace da equipe de produto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>O convite expira em 7 dias.</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Aceitar convite</Button>
        <Button variant="outline" className="w-full">
          Recusar
        </Button>
      </CardFooter>
    </Card>
  ),
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
          <a href="#إنشاء-حساب" className={buttonVariants({ variant: "link" })}>
            إنشاء حساب
          </a>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">تسجيل الدخول</Button>
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
