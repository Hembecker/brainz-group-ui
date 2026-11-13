import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react"

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"

/* One story per section of button-group.mdx, in the order of the shadcn/ui page. */
const meta = {
  title: "Componentes/Button Group",
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <ButtonGroup aria-label="Ações da mensagem">
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          aria-label="Voltar para a caixa de entrada"
        >
          <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Arquivar</Button>
        <Button variant="outline">Denunciar</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Adiar</Button>
        <Button variant="outline" size="icon" aria-label="Mais opções">
          <ChevronDownIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Orientacao: Story = {
  name: "Orientação",
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Controles de zoom">
      <Button variant="outline" size="icon" aria-label="Aumentar o zoom">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Diminuir o zoom">
        <MinusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
}

export const Tamanho: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Pequeno
        </Button>
        <Button variant="outline" size="sm">
          Botão
        </Button>
        <Button variant="outline" size="sm">
          Grupo
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Adicionar item">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Padrão</Button>
        <Button variant="outline">Botão</Button>
        <Button variant="outline">Grupo</Button>
        <Button variant="outline" size="icon" aria-label="Adicionar item">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="lg">
          Grande
        </Button>
        <Button variant="outline" size="lg">
          Botão
        </Button>
        <Button variant="outline" size="lg">
          Grupo
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Adicionar item">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  ),
}

export const Aninhado: Story = {
  render: () => (
    <ButtonGroup aria-label="Paginação">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Página anterior">
          <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Próxima página">
          <ArrowRightIcon aria-hidden="true" className="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Separador: Story = {
  render: () => (
    <ButtonGroup aria-label="Área de transferência">
      <Button variant="secondary" size="sm">
        Copiar
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Colar
      </Button>
    </ButtonGroup>
  ),
}

export const Dividido: Story = {
  name: "Dividido",
  render: () => (
    <ButtonGroup aria-label="Criar">
      <Button variant="secondary">Botão</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="Mais opções">
        <PlusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
}

export const Texto: Story = {
  render: () => (
    <ButtonGroup aria-label="Visualização">
      <ButtonGroupText>Página 2 de 10</ButtonGroupText>
      <Button variant="outline" size="icon" aria-label="Página anterior">
        <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Próxima página">
        <ArrowRightIcon aria-hidden="true" className="rtl:rotate-180" />
      </Button>
    </ButtonGroup>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <ButtonGroup aria-label="إجراءات الرسالة">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="رجوع">
            <ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">أرشفة</Button>
          <Button variant="outline">تقرير</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">تأجيل</Button>
          <Button variant="outline" size="icon" aria-label="خيارات إضافية">
            <MoreHorizontalIcon aria-hidden="true" />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  ),
}
