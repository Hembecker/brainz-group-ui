import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"

/*
 * One story per section of alert.mdx, in the order of the shadcn/ui page,
 * plus "Região viva", which shows when to give the Alert a `role` (the
 * component has none by default). Section stories use literal JSX (no args)
 * so "Show code" can be copied as is; Playground is the one with controls.
 */
const meta = {
  title: "Componentes/Alert",
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>Pagamento aprovado</AlertTitle>
        <AlertDescription>
          Seu pagamento de R$ 29,99 foi processado. Enviamos o recibo para o seu
          e-mail.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Novo recurso disponível</AlertTitle>
        <AlertDescription>
          Adicionamos o modo escuro. Você pode ativá-lo nas configurações da sua
          conta.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <Alert className="max-w-md">
      <CheckCircle2Icon aria-hidden="true" />
      <AlertTitle>Conta atualizada</AlertTitle>
      <AlertDescription>
        As informações do seu perfil foram salvas. As mudanças aparecem na hora.
      </AlertDescription>
    </Alert>
  ),
}

export const Destrutivo: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon aria-hidden="true" />
      <AlertTitle>Falha no pagamento</AlertTitle>
      <AlertDescription>
        Não foi possível processar o seu pagamento. Confira a forma de pagamento
        e tente de novo.
      </AlertDescription>
    </Alert>
  ),
}

export const Acao: Story = {
  name: "Ação",
  render: () => (
    <Alert className="max-w-md">
      <AlertTitle>O modo escuro já está disponível</AlertTitle>
      <AlertDescription>
        Ative-o nas configurações do perfil para começar.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" aria-label="Ativar modo escuro">
          Ativar
        </Button>
      </AlertAction>
    </Alert>
  ),
}

export const CoresPersonalizadas: Story = {
  name: "Cores personalizadas",
  render: () => (
    <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon aria-hidden="true" />
      <AlertTitle>Sua assinatura expira em 3 dias.</AlertTitle>
      <AlertDescription>
        Renove agora para não interromper o serviço, ou migre para um plano pago
        para continuar usando.
      </AlertDescription>
    </Alert>
  ),
}

export const RegiaoViva: Story = {
  name: "Região viva",
  render: () => (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert role="status">
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>Rascunho salvo</AlertTitle>
        <AlertDescription>
          Suas alterações foram salvas automaticamente.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive" role="alert">
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>Conexão perdida</AlertTitle>
        <AlertDescription>
          Suas alterações não estão sendo salvas. Verifique a conexão com a
          internet.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar" className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>تم الدفع بنجاح</AlertTitle>
        <AlertDescription>
          تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك
          الإلكتروني.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>ميزة جديدة متاحة</AlertTitle>
        <AlertDescription>
          لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.
        </AlertDescription>
        <AlertAction>
          <Button size="xs" aria-label="تفعيل">
            تفعيل
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    variant: "default",
    className: "max-w-md",
    children: (
      <>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Título do alerta</AlertTitle>
        <AlertDescription>Descrição do alerta.</AlertDescription>
      </>
    ),
  },
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
}
