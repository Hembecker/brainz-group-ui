"use client"

/*
 * Login — o modelo padrão de autenticação. Estrutura do bloco login-02 do
 * shadcn/ui: https://ui.shadcn.com/blocks/login#login-02
 * As cores, o contraste e os tamanhos são os da Big Brain.
 *
 * Decisões:
 * - `LoginForm` é só o formulário; `LoginPage` = `AuthLayout` (formulário no
 *   início, coluna da marca ou imagem no fim) + `LoginForm`. Nenhum dado de
 *   projeto nem regra de negócio: o bloco não chama API. Ele valida só o
 *   preenchimento (e-mail obrigatório e no formato certo, senha obrigatória)
 *   e entrega os valores no `onSubmit`.
 * - Textos em português, com `labels` para trocar qualquer um (outro idioma,
 *   outro tom). O botão "Login with GitHub" do bloco virou a lista genérica
 *   `socialProviders`; sem ela, o separador e os botões não aparecem.
 * - Links só existem com a prop: sem `forgotPasswordHref` não há "Esqueceu a
 *   senha?", sem `signupHref` não há "Cadastre-se". O bloco não inventa
 *   `href="#"`.
 * - Ids derivados de `React.useId()`: dois formulários na mesma página não
 *   colidem.
 * - `autoComplete` `email` e `current-password`, para o navegador e o
 *   gerenciador de senhas preencherem.
 *
 * Acessibilidade:
 * - Rótulos persistentes (o placeholder só dá o formato). Erros por campo num
 *   `FieldError` sempre montado (`aria-live="polite"`), ligado ao campo por
 *   `aria-describedby` e `aria-errormessage` só enquanto há erro; inválido =
 *   `data-invalid` no Field e `aria-invalid` no Input.
 * - Validação própria (`noValidate`): no envio com erro, o foco vai para o
 *   primeiro campo inválido, e a mensagem é lida com ele. Os balões nativos
 *   do navegador não seguem o idioma da página nem o visual.
 * - Erro do formulário (`error`, como "E-mail ou senha incorretos"): texto
 *   `destructive` sobre o fundo (4,76:1 no claro, 6,82:1 no escuro), numa
 *   região `aria-live="polite"` sempre montada, logo abaixo do título. É
 *   polite e não assertive: a pessoa acabou de enviar e está esperando a
 *   resposta, então a mensagem não precisa interromper nada. Sem caixa
 *   tingida: o vermelho cai abaixo de 4,5:1 sobre `muted` e `field`.
 * - Enviando (`pending`): o botão fica desabilitado com um Spinner, mas
 *   continua focável (`focusableWhenDisabled`), para o foco não cair no
 *   <body>; o formulário ganha `aria-busy`. Um Enter num campo enquanto envia
 *   é ignorado. O texto do botão muda ("Entrando…"); o Spinner é decorativo.
 * - Links com sublinhado e anel de foco sólido. Ordem do Tab = ordem do
 *   bloco: e-mail, "Esqueceu a senha?", senha, Entrar, provedores, Cadastre-se.
 */
import * as React from "react"
import { cn } from "cn"

import {
  AuthField,
  AuthHeading,
  AuthLayout,
  AuthProviders,
  authLinkClassName,
  useAuthFieldErrors,
  type AuthLayoutProps,
  type AuthProvider,
} from "@workspace/ui/blocks/auth-layout"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field"
import { Spinner } from "@workspace/ui/components/spinner"

export interface LoginValues {
  email: string
  password: string
}

export type LoginField = keyof LoginValues

export interface LoginFormLabels {
  email: string
  emailPlaceholder: string
  password: string
  forgotPassword: string
  submit: string
  pending: string
  separator: string
  noAccount: string
  signup: string
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
}

export const loginFormLabels: LoginFormLabels = {
  email: "E-mail",
  emailPlaceholder: "nome@exemplo.com",
  password: "Senha",
  forgotPassword: "Esqueceu a senha?",
  submit: "Entrar",
  pending: "Entrando…",
  separator: "Ou continue com",
  noAccount: "Não tem conta?",
  signup: "Cadastre-se",
  emailRequired: "Informe o e-mail.",
  emailInvalid: "Informe um e-mail completo, como nome@exemplo.com.",
  passwordRequired: "Informe a senha.",
}

export interface LoginFormProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "title" | "defaultValue" | "children"
> {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Recebe os valores já validados. O bloco chama `preventDefault` antes. */
  onSubmit?: (
    values: LoginValues,
    event: React.FormEvent<HTMLFormElement>
  ) => void
  defaultValues?: Partial<LoginValues>
  forgotPasswordHref?: string
  signupHref?: string
  socialProviders?: AuthProvider[]
  /** Erro do formulário inteiro, como "E-mail ou senha incorretos." */
  error?: string
  /** Erros por campo vindos de fora (do servidor, por exemplo). */
  errors?: Partial<Record<LoginField, string>>
  labels?: Partial<LoginFormLabels>
  pending?: boolean
}

function LoginForm({
  title = "Entrar na sua conta",
  description = "Digite seu e-mail abaixo para entrar na sua conta",
  onSubmit,
  defaultValues,
  forgotPasswordHref,
  signupHref,
  socialProviders,
  error,
  errors,
  labels: labelOverrides,
  pending = false,
  className,
  ...props
}: LoginFormProps) {
  const labels = { ...loginFormLabels, ...labelOverrides }
  const id = React.useId()
  const ids = {
    email: `${id}-email`,
    password: `${id}-senha`,
    error: `${id}-erro-formulario`,
  }
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const { errorFor, clear, setClientErrors, markSubmitted } =
    useAuthFieldErrors<LoginField>(errors, pending)

  function validate(): Partial<Record<LoginField, string>> {
    const found: Partial<Record<LoginField, string>> = {}
    const email = emailRef.current
    if (email) {
      if (!email.value.trim()) found.email = labels.emailRequired
      else if (email.validity.typeMismatch) found.email = labels.emailInvalid
    }
    if (passwordRef.current && !passwordRef.current.value) {
      found.password = labels.passwordRequired
    }
    return found
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      event.preventDefault()
      return
    }
    const found = validate()
    setClientErrors(found)
    const firstInvalid = (["email", "password"] as const).find(
      (field) => found[field]
    )
    if (firstInvalid) {
      event.preventDefault()
      const refs = { email: emailRef, password: passwordRef }
      refs[firstInvalid].current?.focus()
      return
    }
    // Um envio válido volta ao servidor: um erro que a resposta repetir (um
    // `errors` novo, ou o `pending` que volta a false) aparece de novo.
    markSubmitted()
    if (onSubmit) {
      event.preventDefault()
      onSubmit(
        {
          email: emailRef.current?.value.trim() ?? "",
          password: passwordRef.current?.value ?? "",
        },
        event
      )
    }
  }

  return (
    <form
      data-slot="login-form"
      noValidate
      aria-busy={pending || undefined}
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <AuthHeading title={title} description={description} />
        <FieldError id={ids.error} className="text-center">
          {error}
        </FieldError>
        <AuthField
          id={ids.email}
          ref={emailRef}
          name="email"
          type="email"
          label={labels.email}
          placeholder={labels.emailPlaceholder}
          autoComplete="email"
          required
          defaultValue={defaultValues?.email}
          error={errorFor("email")}
          onChange={() => clear("email")}
        />
        <AuthField
          id={ids.password}
          ref={passwordRef}
          name="password"
          type="password"
          label={labels.password}
          autoComplete="current-password"
          required
          defaultValue={defaultValues?.password}
          error={errorFor("password")}
          onChange={() => clear("password")}
          labelAction={
            forgotPasswordHref ? (
              <a href={forgotPasswordHref} className={authLinkClassName}>
                {labels.forgotPassword}
              </a>
            ) : undefined
          }
        />
        <Field>
          <Button type="submit" disabled={pending} focusableWhenDisabled>
            {pending ? (
              <Spinner data-icon="inline-start" aria-hidden="true" />
            ) : null}
            {pending ? labels.pending : labels.submit}
          </Button>
        </Field>
        <AuthProviders
          providers={socialProviders}
          separator={labels.separator}
          disabled={pending}
        />
        {signupHref ? (
          <FieldDescription className="text-center [&>a:hover]:text-link-hover">
            {labels.noAccount}{" "}
            <a href={signupHref} className={authLinkClassName}>
              {labels.signup}
            </a>
          </FieldDescription>
        ) : null}
      </FieldGroup>
    </form>
  )
}

export type LoginPageProps = Pick<
  AuthLayoutProps,
  "brand" | "aside" | "image" | "footer"
> &
  LoginFormProps & {
    /** Classe do contêiner do layout (a do formulário vai em `className`). */
    layoutClassName?: string
  }

/** Página de login pronta: `AuthLayout` + `LoginForm`. */
function LoginPage({
  brand,
  aside,
  image,
  footer,
  layoutClassName,
  ...formProps
}: LoginPageProps) {
  return (
    <AuthLayout
      brand={brand}
      aside={aside}
      image={image}
      footer={footer}
      className={layoutClassName}
    >
      <LoginForm {...formProps} />
    </AuthLayout>
  )
}

export { LoginForm, LoginPage }
