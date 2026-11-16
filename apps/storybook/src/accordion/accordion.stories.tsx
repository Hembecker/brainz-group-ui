import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { DirectionProvider } from "@workspace/ui/components/direction"

/*
 * One story per section of accordion.mdx, in the order of the shadcn/ui page.
 * The shadcn "Borders" example is adapted: this system's Accordion already
 * has the outer border and the dividers (rhea), so the section shows how to
 * go the other way, with only the dividers.
 *
 * The Base UI Accordion keeps a closed panel out of the accessible tree, so
 * each story starts with an item open (`defaultValue`) for axe to measure the
 * panel text too.
 */
const meta = {
  title: "Componentes/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const envio = await canvas.findByRole("button", {
      name: "Quais são as opções de envio?",
    })
    const devolucao = await canvas.findByRole("button", {
      name: "Qual é a política de devolução?",
    })
    const suporte = await canvas.findByRole("button", {
      name: "Como falo com o suporte?",
    })

    // Starts with the first item open, exposed by aria-expanded and tied to
    // its panel by aria-controls.
    await expect(envio).toHaveAttribute("aria-expanded", "true")
    await expect(devolucao).toHaveAttribute("aria-expanded", "false")
    const painel = canvasElement.querySelector(
      `#${CSS.escape(envio.getAttribute("aria-controls") ?? "")}`
    )
    await expect(painel).not.toBeNull()
    await expect(painel).toHaveAttribute("role", "region")

    // Keyboard: Tab reaches the first trigger; Enter and Space toggle it.
    await userEvent.tab()
    await waitFor(() => expect(envio).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(envio).toHaveAttribute("aria-expanded", "false")
    await userEvent.keyboard(" ")
    await expect(envio).toHaveAttribute("aria-expanded", "true")

    // No roving focus (APG update, Base UI 1.9): every trigger is a Tab stop.
    await userEvent.tab()
    await expect(devolucao).toHaveFocus()
    await userEvent.tab()
    await expect(suporte).toHaveFocus()
    await userEvent.tab({ shift: true })
    await userEvent.tab({ shift: true })
    await expect(envio).toHaveFocus()

    // Only one item at a time: opening another closes the first.
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    await expect(devolucao).toHaveAttribute("aria-expanded", "true")
    await expect(envio).toHaveAttribute("aria-expanded", "false")

    // Waits for the height transition before axe measures the panel.
    await waitFor(() =>
      expect(
        canvas.getByText(/Devoluções aceitas em até 30 dias/)
      ).toBeVisible()
    )
    await Promise.allSettled(
      document
        .getAnimations()
        // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
        .filter((animation) => animation.timeline === document.timeline)
        .map((animation) => animation.finished)
    )
  },
  render: () => (
    <Accordion defaultValue={["envio"]} className="max-w-lg">
      <AccordionItem value="envio">
        <AccordionTrigger>Quais são as opções de envio?</AccordionTrigger>
        <AccordionContent>
          Oferecemos envio padrão (5 a 7 dias), expresso (2 a 3 dias) e no dia
          seguinte. O envio internacional é gratuito.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="devolucao">
        <AccordionTrigger>Qual é a política de devolução?</AccordionTrigger>
        <AccordionContent>
          Devoluções aceitas em até 30 dias. Os itens precisam estar sem uso e
          na embalagem original. O reembolso sai em até 7 dias úteis.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="suporte">
        <AccordionTrigger>Como falo com o suporte?</AccordionTrigger>
        <AccordionContent>
          Fale com a gente por e-mail, chat ou telefone. Respondemos em até 24
          horas nos dias úteis.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <Accordion defaultValue={["item-1"]} className="max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>Como redefino minha senha?</AccordionTrigger>
        <AccordionContent>
          Clique em “Esqueci a senha” na página de entrada, informe seu e-mail e
          enviaremos um link para redefinir a senha. O link expira em 24 horas.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Posso mudar de plano?</AccordionTrigger>
        <AccordionContent>
          Sim, você pode subir ou descer de plano quando quiser, nas
          configurações da conta. A mudança vale a partir do próximo ciclo de
          cobrança.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Quais formas de pagamento vocês aceitam?
        </AccordionTrigger>
        <AccordionContent>
          Aceitamos os principais cartões de crédito, Pix e boleto. Todos os
          pagamentos passam por parceiros de pagamento seguros.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiplo: Story = {
  name: "Múltiplo",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const notificacoes = await canvas.findByRole("button", {
      name: "Configurações de notificação",
    })
    const privacidade = await canvas.findByRole("button", {
      name: "Privacidade e segurança",
    })

    // With `multiple`, opening one item keeps the others open.
    await expect(notificacoes).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(privacidade)
    await expect(privacidade).toHaveAttribute("aria-expanded", "true")
    await expect(notificacoes).toHaveAttribute("aria-expanded", "true")
    await Promise.allSettled(
      document
        .getAnimations()
        // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
        .filter((animation) => animation.timeline === document.timeline)
        .map((animation) => animation.finished)
    )
  },
  render: () => (
    <Accordion multiple className="max-w-lg" defaultValue={["notificacoes"]}>
      <AccordionItem value="notificacoes">
        <AccordionTrigger>Configurações de notificação</AccordionTrigger>
        <AccordionContent>
          Escolha como você recebe as notificações: alertas por e-mail para as
          novidades ou notificações push no celular.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="privacidade">
        <AccordionTrigger>Privacidade e segurança</AccordionTrigger>
        <AccordionContent>
          Controle a privacidade e a segurança da conta. Ative a verificação em
          duas etapas, gerencie os dispositivos conectados, revise as sessões
          ativas e defina o compartilhamento de dados. Também dá para baixar
          seus dados ou excluir a conta.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cobranca">
        <AccordionTrigger>Cobrança e assinatura</AccordionTrigger>
        <AccordionContent>
          Veja seu plano atual, o histórico de pagamentos e as próximas faturas.
          Atualize a forma de pagamento, mude de plano ou cancele a assinatura.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Desabilitado: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primeiro = await canvas.findByRole("button", {
      name: "Posso ver o histórico da minha conta?",
    })
    const desabilitado = await canvas.findByRole("button", {
      name: "Informações sobre recursos premium",
    })
    const terceiro = await canvas.findByRole("button", {
      name: "Como atualizo meu e-mail?",
    })

    // The disabled item is exposed as disabled, does not open and is skipped
    // by the Tab key.
    await expect(desabilitado).toBeDisabled()
    await expect(desabilitado).toHaveAttribute("data-disabled")
    await userEvent.click(desabilitado, { pointerEventsCheck: 0 })
    await expect(desabilitado).toHaveAttribute("aria-expanded", "false")
    primeiro.focus()
    await userEvent.tab()
    await expect(terceiro).toHaveFocus()
  },
  render: () => (
    <Accordion defaultValue={["item-1"]} className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Posso ver o histórico da minha conta?
        </AccordionTrigger>
        <AccordionContent>
          Sim, você vê o histórico completo, com transações, mudanças de plano e
          chamados de suporte, na seção Histórico da conta do painel.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Informações sobre recursos premium</AccordionTrigger>
        <AccordionContent>
          Esta seção traz as informações sobre os recursos premium. Mude de
          plano para acessar o conteúdo.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Como atualizo meu e-mail?</AccordionTrigger>
        <AccordionContent>
          Você atualiza o e-mail nas configurações da conta. Enviaremos uma
          mensagem de verificação para o novo endereço para confirmar a mudança.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Bordas: Story = {
  render: () => (
    <Accordion
      className="max-w-lg rounded-none border-0"
      defaultValue={["cobranca"]}
    >
      <AccordionItem value="cobranca">
        <AccordionTrigger>Como funciona a cobrança?</AccordionTrigger>
        <AccordionContent>
          Temos planos mensais e anuais. A cobrança é feita no início de cada
          ciclo e você cancela quando quiser. Todos os planos incluem backup
          automático, suporte 24 horas e membros ilimitados na equipe.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="seguranca">
        <AccordionTrigger>Meus dados estão seguros?</AccordionTrigger>
        <AccordionContent>
          Sim. Usamos criptografia de ponta a ponta, conformidade SOC 2 Tipo II
          e auditorias periódicas de terceiros. Os dados ficam criptografados em
          repouso e em trânsito.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="integracoes">
        <AccordionTrigger>Quais integrações vocês oferecem?</AccordionTrigger>
        <AccordionContent>
          Integramos com mais de 500 ferramentas, como Slack, Zapier, Salesforce
          e HubSpot. Você também cria integrações próprias com nossa API REST e
          webhooks.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const CardStory: Story = {
  name: "Card",
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <h3>Assinatura e cobrança</h3>
        </CardTitle>
        <CardDescription>
          Dúvidas comuns sobre conta, planos, pagamentos e cancelamentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion defaultValue={["planos"]}>
          <AccordionItem value="planos">
            <AccordionTrigger>
              Quais planos de assinatura vocês têm?
            </AccordionTrigger>
            <AccordionContent>
              Temos três planos: Inicial (R$ 49/mês), Profissional (R$ 149/mês)
              e Empresarial (R$ 499/mês). Cada um traz mais armazenamento,
              acesso à API, suporte prioritário e recursos de colaboração.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cobranca">
            <AccordionTrigger>Como funciona a cobrança?</AccordionTrigger>
            <AccordionContent>
              A cobrança é automática no início de cada ciclo. Aceitamos os
              principais cartões, Pix e boleto. Você recebe a fatura por e-mail
              após cada pagamento.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancelar">
            <AccordionTrigger>Como cancelo minha assinatura?</AccordionTrigger>
            <AccordionContent>
              Você cancela quando quiser, nas configurações da conta, sem multa.
              O acesso continua até o fim do período já pago.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primeira = await canvas.findByRole("button", {
      name: "كيف يمكنني إعادة تعيين كلمة المرور؟",
    })
    const segunda = await canvas.findByRole("button", {
      name: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
    })

    // Tab follows the visual order (right to left does not change it for a
    // vertical stack); Enter opens the second item.
    primeira.focus()
    await userEvent.tab()
    await expect(segunda).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(segunda).toHaveAttribute("aria-expanded", "true")
    await Promise.allSettled(
      document
        .getAnimations()
        // As animações guiadas pela rolagem (o scroll-fade das barras) nunca terminam.
        .filter((animation) => animation.timeline === document.timeline)
        .map((animation) => animation.finished)
    )
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Accordion defaultValue={["item-1"]} className="max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              كيف يمكنني إعادة تعيين كلمة المرور؟
            </AccordionTrigger>
            <AccordionContent>
              انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك
              الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي
              صلاحية الرابط خلال 24 ساعة.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              هل يمكنني تغيير خطة الاشتراك الخاصة بي؟
            </AccordionTrigger>
            <AccordionContent>
              نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر
              التغييرات في دورة الفوترة التالية.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>ما هي طرق الدفع التي تقبلونها؟</AccordionTrigger>
            <AccordionContent>
              نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية.
              تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </DirectionProvider>
  ),
}
