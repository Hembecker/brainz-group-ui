"use client"

/*
 * AuthLayout — o layout das páginas de autenticação (Login e Cadastro).
 * Estrutura dos blocos do shadcn/ui:
 * https://ui.shadcn.com/blocks/login#login-02 e
 * https://ui.shadcn.com/blocks/signup#signup-02
 * As cores, o contraste e os tamanhos são os da Big Brain.
 *
 * Decisões:
 * - Grade de duas colunas a partir de `lg` (1024px), como no login-02: o
 *   formulário fica no início (esquerda em LTR, direita em RTL) e a coluna
 *   lateral, no fim. Abaixo de `lg` a coluna lateral some e o formulário
 *   ocupa a tela toda, como no bloco.
 * - Marca no topo: por padrão, o símbolo (`Mark`) e o nome da marca ativa
 *   (`useBrand()`, que segue o `data-brand` do <html>). O símbolo é
 *   decorativo (`aria-hidden`), e o nome em texto é o que nomeia. Sem
 *   `brand.href` a marca é só texto: o bloco não inventa um `href="#"`.
 * - Coluna lateral (`aside`), em ordem de prioridade: `aside={false}` remove a
 *   coluna (o formulário fica centralizado na tela toda); um ReactNode
 *   substitui o conteúdo; `image` mostra uma imagem de capa; sem nada, vale o
 *   painel da marca.
 * - Painel da marca: o logo grande sobre o papel `secondary`, com a tinta do
 *   logo em `secondary-foreground` (Primária 800 sobre 100 no claro, 7,7:1;
 *   100 sobre 900 no escuro, 9,0:1, na Brainz Group). Sem texto pequeno
 *   sobre o gradiente da marca: branco sobre a ponta 500 do gradiente daria
 *   só ~3,5:1. O painel é decorativo (`aria-hidden`): o nome da marca já está
 *   no topo. Não há papel semântico de gradiente; o bloco não usa a paleta
 *   `--bb-*` direto.
 * - Imagem: `alt` obrigatório (vazio quando decorativa). `dimInDark` repete o
 *   escurecimento do login-02 no modo escuro (`brightness-[0.2] grayscale`),
 *   opcional porque apaga imagens com conteúdo.
 * - Marcos: o topo é um <header>, o formulário fica num <main> e o rodapé
 *   opcional num <footer>. A coluna lateral é um <aside> quando tem conteúdo
 *   que se lê (um `aside` próprio ou uma imagem com `alt`); com o painel da
 *   marca ou uma imagem decorativa, é um div, sem ponto de referência vazio. É um layout de página inteira: não o coloque
 *   dentro de outro <main>.
 * - Paddings e alinhamentos lógicos (`md:justify-start`, `text-start`):
 *   funciona em RTL sem prop. Nenhuma cor com opacidade.
 * - Foco do link da marca: anel sólido de 3px no `ring`, afastado 2px pela
 *   cor do fundo, como no Button.
 *
 * Também exporta as peças que o LoginForm e o SignupForm compartilham
 * (`AuthField`, `AuthHeading`, `AuthProviders`, `useAuthFieldErrors`). Elas
 * servem para montar outro formulário de autenticação com as mesmas regras.
 */
import * as React from "react"
import { cn } from "cn"

import { useBrand } from "@workspace/ui/brand/use-brand"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

/* ------------------------------------------------------------------------ */
/* Layout                                                                   */
/* ------------------------------------------------------------------------ */

export interface AuthBrand {
  /** Nome da marca, sempre visível ao lado do logo. */
  name: string
  /** Logo ou símbolo (decorativo: use `aria-hidden` num SVG). */
  logo?: React.ReactNode
  /** Página inicial. Sem `href`, a marca não é um link. */
  href?: string
}

export interface AuthImage {
  src: string
  /** Texto alternativo. Use "" quando a imagem for só decorativa. */
  alt: string
  /** Escurece a imagem no modo escuro, como no login-02. */
  dimInDark?: boolean
}

export interface AuthLayoutProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Marca do topo. Padrão: símbolo e nome da marca ativa. */
  brand?: AuthBrand
  /** O formulário (LoginForm, SignupForm ou outro). */
  children: React.ReactNode
  /** Coluna do fim. `false` remove a coluna; um nó substitui o painel. */
  aside?: React.ReactNode | false
  /** Atalho para uma imagem de capa na coluna do fim. */
  image?: AuthImage
  /** Rodapé abaixo do formulário (termos, ajuda, versão). */
  footer?: React.ReactNode
}

function AuthBrandLink({ brand }: { brand?: AuthBrand }) {
  const active = useBrand()
  const name = brand?.name ?? active.name
  const logo =
    brand?.logo !== undefined ? (
      brand.logo
    ) : brand ? null : (
      <active.Mark className="size-6 shrink-0" />
    )
  const content = (
    <>
      {logo}
      <span>{name}</span>
    </>
  )
  const classes = "flex items-center gap-2 font-medium"
  if (brand?.href) {
    return (
      <a
        href={brand.href}
        data-slot="auth-layout-brand"
        className={cn(
          classes,
          "-m-1 rounded-md p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {content}
      </a>
    )
  }
  return (
    <span data-slot="auth-layout-brand" className={classes}>
      {content}
    </span>
  )
}

function AuthBrandPanel() {
  const { Logo } = useBrand()
  return (
    <div
      aria-hidden="true"
      data-slot="auth-layout-brand-panel"
      className="flex h-full items-center justify-center bg-secondary p-10 text-secondary-foreground"
    >
      <Logo className="h-auto w-full max-w-sm" />
    </div>
  )
}

function AuthLayout({
  brand,
  children,
  aside,
  image,
  footer,
  className,
  ...props
}: AuthLayoutProps) {
  const hasAside = aside !== false
  let asideContent: React.ReactNode = null
  // A coluna só é um <aside> (ponto de referência) quando tem conteúdo para a
  // tecnologia assistiva: um conteúdo próprio ou uma imagem com `alt`. O
  // painel da marca e uma imagem decorativa (`alt=""`) ficam num div.
  let asideIsLandmark = false
  if (hasAside) {
    if (aside !== undefined && aside !== null && aside !== true) {
      asideContent = aside
      asideIsLandmark = true
    } else if (image) {
      asideIsLandmark = image.alt.trim() !== ""
      asideContent = (
        <img
          src={image.src}
          alt={image.alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            image.dimInDark && "dark:brightness-[0.2] dark:grayscale"
          )}
        />
      )
    } else {
      asideContent = <AuthBrandPanel />
    }
  }

  const AsideColumn = asideIsLandmark ? "aside" : "div"

  return (
    <div
      data-slot="auth-layout"
      data-aside={hasAside ? "" : undefined}
      className={cn(
        "grid min-h-svh bg-background text-foreground",
        hasAside && "lg:grid-cols-2",
        className
      )}
      {...props}
    >
      <div
        data-slot="auth-layout-content"
        className="flex flex-col gap-4 p-6 md:p-10"
      >
        <header className="flex justify-center gap-2 md:justify-start">
          <AuthBrandLink brand={brand} />
        </header>
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </main>
        {footer ? (
          <footer
            data-slot="auth-layout-footer"
            className="text-center text-sm text-muted-foreground md:text-start"
          >
            {footer}
          </footer>
        ) : null}
      </div>
      {hasAside ? (
        <AsideColumn
          data-slot="auth-layout-aside"
          className="relative hidden bg-muted lg:block"
        >
          {asideContent}
        </AsideColumn>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Peças compartilhadas pelos formulários                                    */
/* ------------------------------------------------------------------------ */

/**
 * Erros por campo: os da validação no navegador (`client`) e os que chegam
 * de fora pela prop `errors` (do servidor, por exemplo). Um erro de fora some
 * do campo assim que a pessoa edita aquele campo, e volta se a prop trouxer
 * outro texto ou quando chega a resposta de um envio válido: o formulário
 * chama `markSubmitted()` no envio, e o erro dispensado volta só depois,
 * quando chega um objeto `errors` novo ou o `pending` volta a `false`. Nunca
 * no próprio envio: enquanto a resposta não chega, o leitor de tela não
 * anuncia de novo um erro antigo. Quem usa o bloco passa um `errors` sem o
 * campo (ou vazio) quando a resposta não tem erro.
 */
export function useAuthFieldErrors<TField extends string>(
  external?: Partial<Record<TField, string>>,
  pending = false
) {
  const [client, setClient] = React.useState<Partial<Record<TField, string>>>(
    {}
  )
  const [dismissed, setDismissed] = React.useState<
    Partial<Record<TField, string>>
  >({})
  const [awaiting, setAwaiting] = React.useState(false)
  const [prevExternal, setPrevExternal] = React.useState(external)
  const [prevPending, setPrevPending] = React.useState(pending)

  // Ajuste de estado durante a renderização (padrão do React para reagir a
  // uma prop): a resposta chegou quando o `errors` muda de identidade ou o
  // `pending` passa de true para false. Mudanças durante o `pending` esperam.
  if (external !== prevExternal || pending !== prevPending) {
    const answered = external !== prevExternal || (prevPending && !pending)
    setPrevExternal(external)
    setPrevPending(pending)
    if (awaiting && answered && !pending) {
      setAwaiting(false)
      setDismissed({})
    }
  }

  const errorFor = React.useCallback(
    (field: TField): string | undefined => {
      if (client[field]) return client[field]
      const fromProps = external?.[field]
      return fromProps && dismissed[field] !== fromProps ? fromProps : undefined
    },
    [client, dismissed, external]
  )

  const clear = React.useCallback(
    (field: TField) => {
      setClient((current) => {
        if (!current[field]) return current
        const next = { ...current }
        delete next[field]
        return next
      })
      const fromProps = external?.[field]
      if (fromProps) {
        setDismissed((current) => ({ ...current, [field]: fromProps }))
      }
    },
    [external]
  )

  const markSubmitted = React.useCallback(() => setAwaiting(true), [])

  return { errorFor, clear, setClientErrors: setClient, markSubmitted }
}

export interface AuthFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "id" | "name"> {
  id: string
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  error?: string
  /** Um link ao lado do rótulo (por exemplo, "Esqueceu a senha?"). */
  labelAction?: React.ReactNode
}

/**
 * Um campo com rótulo persistente, descrição e erro ligados por
 * `aria-describedby` e `aria-errormessage`. O erro (`FieldError`) fica sempre
 * montado, como região `aria-live="polite"`; inválido = `data-invalid` no
 * Field e `aria-invalid` no Input.
 */
export function AuthField({
  id,
  name,
  label,
  description,
  error,
  labelAction,
  ...props
}: AuthFieldProps) {
  const descriptionId = `${id}-descricao`
  const errorId = `${id}-erro`
  const describedBy =
    [description ? descriptionId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined
  const fieldLabel = <FieldLabel htmlFor={id}>{label}</FieldLabel>

  return (
    <Field data-invalid={error ? true : undefined}>
      {labelAction ? (
        <div className="flex items-center gap-2">
          {fieldLabel}
          <span className="ms-auto text-sm">{labelAction}</span>
        </div>
      ) : (
        fieldLabel
      )}
      <Input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-errormessage={error ? errorId : undefined}
        {...props}
      />
      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  )
}

/** Título (h1) e descrição do formulário, centralizados como nos blocos. */
export function AuthHeading({
  title,
  description,
}: {
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description ? (
        <p className="text-sm text-balance text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export interface AuthProvider {
  id: string
  /** Nome específico do botão, como "Entrar com GitHub". */
  label: string
  /** Ícone decorativo (fica com `aria-hidden`). */
  icon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

/** O separador "Ou continue com" e um botão por provedor. */
export function AuthProviders({
  providers,
  separator,
  disabled,
}: {
  providers?: AuthProvider[]
  separator: React.ReactNode
  disabled?: boolean
}) {
  if (!providers?.length) return null
  return (
    <>
      <FieldSeparator>{separator}</FieldSeparator>
      <Field>
        {providers.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            disabled={disabled}
            focusableWhenDisabled
            onClick={provider.onClick}
          >
            {provider.icon ? (
              <span
                aria-hidden="true"
                data-icon="inline-start"
                className="flex shrink-0"
              >
                {provider.icon}
              </span>
            ) : null}
            {provider.label}
          </Button>
        ))}
      </Field>
    </>
  )
}

/** Classe dos links de texto dos formulários (sublinhado e anel sólido). */
export const authLinkClassName =
  "rounded-sm text-link underline underline-offset-4 outline-none hover:text-link-hover focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export { AuthLayout }
