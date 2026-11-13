import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowUpRightIcon,
  BellIcon,
  CloudIcon,
  FolderCodeIcon,
  PlusIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@workspace/ui/components/avatar"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Kbd } from "@workspace/ui/components/kbd"

/*
 * One story per section of empty.mdx, in the order of the shadcn/ui page.
 * The shadcn examples use Tabler icons (lucide here) and photos from GitHub
 * (avatars with the fallback here, named with `role="img"` + `aria-label`).
 * EmptyTitle is a <div>, so each title has a heading inside it. Links are
 * plain <a> with `buttonVariants`, not `<Button render={<a />}>`. The
 * Background example uses a gradient from `muted` to `background` instead of
 * `bg-muted/30`: a solid `bg-muted` would swallow the icon square.
 */
const meta = {
  title: "Componentes/Empty",
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          <h3>Nenhum projeto ainda</h3>
        </EmptyTitle>
        <EmptyDescription>
          Você ainda não criou nenhum projeto. Comece criando o seu primeiro
          projeto.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Criar projeto</Button>
        <Button variant="outline">Importar projeto</Button>
      </EmptyContent>
      <a
        href="#saiba-mais"
        className={buttonVariants({
          variant: "link",
          size: "sm",
          className: "text-muted-foreground",
        })}
      >
        Saiba mais
        <ArrowUpRightIcon
          aria-hidden="true"
          data-icon="inline-end"
          className="rtl:-rotate-90"
        />
      </a>
    </Empty>
  ),
}

export const Contorno: Story = {
  render: () => (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          <h3>Armazenamento vazio</h3>
        </EmptyTitle>
        <EmptyDescription>
          Envie arquivos para a nuvem e acesse de qualquer lugar.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Enviar arquivos
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const Fundo: Story = {
  render: () => (
    <Empty className="min-h-72 bg-linear-to-b from-muted to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          <h3>Nenhuma notificação</h3>
        </EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          Você está em dia. As novas notificações aparecem aqui.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <RefreshCcwIcon aria-hidden="true" data-icon="inline-start" />
          Atualizar
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const AvatarExample: Story = {
  name: "Avatar",
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar className="size-12" role="img" aria-label="Lucas Ribeiro">
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>
          <h3>Usuário offline</h3>
        </EmptyTitle>
        <EmptyDescription>
          Lucas Ribeiro está offline. Deixe uma mensagem para avisá-lo ou tente
          de novo mais tarde.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Deixar mensagem</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const GrupoDeAvatares: Story = {
  name: "Grupo de avatares",
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup
            role="group"
            aria-label="Pessoas sugeridas"
            className="*:data-[slot=avatar]:size-12"
          >
            <Avatar role="img" aria-label="Carlos Nunes">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar role="img" aria-label="Lucas Ribeiro">
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar role="img" aria-label="Eduarda Rocha">
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>
          <h3>Nenhum membro na equipe</h3>
        </EmptyTitle>
        <EmptyDescription>
          Convide a sua equipe para colaborar neste projeto.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon aria-hidden="true" data-icon="inline-start" />
          Convidar membros
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const GrupoDeCampo: Story = {
  name: "InputGroup",
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>
          <h3>404 - Página não encontrada</h3>
        </EmptyTitle>
        <EmptyDescription>
          A página que você procura não existe. Tente buscar o que precisa
          abaixo.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Field className="sm:w-3/4">
          <FieldLabel htmlFor="grupo-de-campo-busca">Buscar páginas</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="grupo-de-campo-busca"
              placeholder="Ex.: relatórios, faturas"
            />
            <InputGroupAddon>
              <SearchIcon
                aria-hidden="true"
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <EmptyDescription>
          Precisa de ajuda? <a href="#suporte">Fale com o suporte</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderCodeIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>
            <h3>لا توجد مشاريع بعد</h3>
          </EmptyTitle>
          <EmptyDescription>
            لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button>إنشاء مشروع</Button>
          <Button variant="outline">استيراد مشروع</Button>
        </EmptyContent>
        <a
          href="#saiba-mais-rtl"
          className={buttonVariants({
            variant: "link",
            size: "sm",
            className: "text-muted-foreground",
          })}
        >
          تعرف على المزيد
          <ArrowUpRightIcon
            aria-hidden="true"
            data-icon="inline-end"
            className="rtl:-rotate-90"
          />
        </a>
      </Empty>
    </div>
  ),
}
