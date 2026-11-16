"use client"

/*
 * Cadastro (Signup) — o modelo de registro, para quando o projeto pede
 * cadastro. Estrutura do bloco signup-02 do shadcn/ui:
 * https://ui.shadcn.com/blocks/signup#signup-02
 * As cores, o contraste e os tamanhos são os da Big Brain.
 *
 * Decisões:
 * - `SignupForm` é só o formulário; `SignupPage` = `AuthLayout` (o mesmo
 *   layout do Login) + `SignupForm`. Os campos do bloco: nome completo,
 *   e-mail, senha e confirmação. Nenhuma regra de negócio: o bloco valida só
 *   o preenchimento, o formato do e-mail, o tamanho mínimo da senha e se as
 *   duas senhas coincidem, e entrega os valores no `onSubmit`.
 * - O tamanho mínimo vem de uma prop só (`minPasswordLength`, padrão 8): a
 *   dica do campo e a validação usam o mesmo número.
 * - O bloco punha `bg-background` nos campos, o que apagava o preenchimento
 *   `field` do Input da Big Brain: removido.
 * - Textos em português, com `labels` para trocar qualquer um. O "Sign up
 *   with GitHub" virou a lista genérica `socialProviders`. Sem `loginHref`
 *   não há "Já tem conta? Entrar" (o bloco não inventa `href="#"`).
 * - `autoComplete` `name`, `email` e `new-password` nos dois campos de senha,
 *   para o gerenciador de senhas sugerir e guardar uma senha nova.
 *
 * Acessibilidade:
 * - Rótulos persistentes; cada dica (`FieldDescription`) ligada ao campo por
 *   `aria-describedby`. Erros num `FieldError` sempre montado
 *   (`aria-live="polite"`), ligados por `aria-describedby` e
 *   `aria-errormessage` só enquanto há erro; inválido = `data-invalid` no
 *   Field e `aria-invalid` no Input.
 * - Senhas diferentes: o erro fica na confirmação ("As senhas não
 *   coincidem."), com o mesmo tratamento de qualquer erro de campo, e some
 *   também quando a pessoa edita a Senha (ela pode corrigir por qualquer um
 *   dos dois campos).
 * - Validação própria (`noValidate`): no envio com erro, o foco vai para o
 *   primeiro campo inválido.
 * - Erro do formulário (`error`): texto `destructive` sobre o fundo numa
 *   região `aria-live="polite"` sempre montada (veja o Login).
 * - Enviando (`pending`): botão desabilitado e focável, com Spinner
 *   decorativo e o texto "Criando conta…"; `aria-busy` no formulário.
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

export interface SignupValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type SignupField = keyof SignupValues

export interface SignupFormLabels {
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  emailDescription: string
  password: string
  /** Padrão: "Use pelo menos {minPasswordLength} caracteres." */
  passwordDescription: string
  confirmPassword: string
  confirmPasswordDescription: string
  submit: string
  pending: string
  separator: string
  hasAccount: string
  login: string
  nameRequired: string
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
  /** Padrão: "A senha precisa ter pelo menos {minPasswordLength} caracteres." */
  passwordTooShort: string
  confirmPasswordRequired: string
  passwordMismatch: string
}

/** Textos padrão; os que citam o tamanho mínimo dependem dele. */
export function signupFormLabels(minPasswordLength = 8): SignupFormLabels {
  return {
    name: "Nome completo",
    namePlaceholder: "Joana Lima",
    email: "E-mail",
    emailPlaceholder: "nome@exemplo.com",
    emailDescription:
      "Vamos usar este e-mail para falar com você. Ele não será compartilhado.",
    password: "Senha",
    passwordDescription: `Use pelo menos ${minPasswordLength} caracteres.`,
    confirmPassword: "Confirmar senha",
    confirmPasswordDescription: "Digite a mesma senha de novo.",
    submit: "Criar conta",
    pending: "Criando conta…",
    separator: "Ou continue com",
    hasAccount: "Já tem conta?",
    login: "Entrar",
    nameRequired: "Informe o nome completo.",
    emailRequired: "Informe o e-mail.",
    emailInvalid: "Informe um e-mail completo, como nome@exemplo.com.",
    passwordRequired: "Crie uma senha.",
    passwordTooShort: `A senha precisa ter pelo menos ${minPasswordLength} caracteres.`,
    confirmPasswordRequired: "Confirme a senha.",
    passwordMismatch: "As senhas não coincidem.",
  }
}

export interface SignupFormProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "title" | "defaultValue" | "children"
> {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Recebe os valores já validados. O bloco chama `preventDefault` antes. */
  onSubmit?: (
    values: SignupValues,
    event: React.FormEvent<HTMLFormElement>
  ) => void
  defaultValues?: Partial<SignupValues>
  loginHref?: string
  socialProviders?: AuthProvider[]
  /** Tamanho mínimo da senha, usado na dica e na validação. */
  minPasswordLength?: number
  /** Erro do formulário inteiro, como "Este e-mail já tem conta." */
  error?: string
  /** Erros por campo vindos de fora (do servidor, por exemplo). */
  errors?: Partial<Record<SignupField, string>>
  labels?: Partial<SignupFormLabels>
  pending?: boolean
}

const FIELD_ORDER: SignupField[] = [
  "name",
  "email",
  "password",
  "confirmPassword",
]

function SignupForm({
  title = "Crie sua conta",
  description = "Preencha o formulário abaixo para criar sua conta",
  onSubmit,
  defaultValues,
  loginHref,
  socialProviders,
  minPasswordLength = 8,
  error,
  errors,
  labels: labelOverrides,
  pending = false,
  className,
  ...props
}: SignupFormProps) {
  const labels = { ...signupFormLabels(minPasswordLength), ...labelOverrides }
  const id = React.useId()
  const ids = {
    name: `${id}-nome`,
    email: `${id}-email`,
    password: `${id}-senha`,
    confirmPassword: `${id}-confirmar-senha`,
    error: `${id}-erro-formulario`,
  }
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null)
  const { errorFor, clear, setClientErrors, markSubmitted } =
    useAuthFieldErrors<SignupField>(errors, pending)

  function read(): SignupValues {
    return {
      name: nameRef.current?.value.trim() ?? "",
      email: emailRef.current?.value.trim() ?? "",
      password: passwordRef.current?.value ?? "",
      confirmPassword: confirmPasswordRef.current?.value ?? "",
    }
  }

  function validate(values: SignupValues) {
    const found: Partial<Record<SignupField, string>> = {}
    if (!values.name) found.name = labels.nameRequired
    if (!values.email) found.email = labels.emailRequired
    else if (emailRef.current?.validity.typeMismatch) {
      found.email = labels.emailInvalid
    }
    if (!values.password) found.password = labels.passwordRequired
    else if (values.password.length < minPasswordLength) {
      found.password = labels.passwordTooShort
    }
    if (!values.confirmPassword) {
      found.confirmPassword = labels.confirmPasswordRequired
    } else if (values.password && values.confirmPassword !== values.password) {
      found.confirmPassword = labels.passwordMismatch
    }
    return found
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      event.preventDefault()
      return
    }
    const values = read()
    const found = validate(values)
    setClientErrors(found)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      event.preventDefault()
      const refs = {
        name: nameRef,
        email: emailRef,
        password: passwordRef,
        confirmPassword: confirmPasswordRef,
      }
      refs[firstInvalid].current?.focus()
      return
    }
    // Um envio válido volta ao servidor: um erro que a resposta repetir (um
    // `errors` novo, ou o `pending` que volta a false) aparece de novo.
    markSubmitted()
    if (onSubmit) {
      event.preventDefault()
      onSubmit(values, event)
    }
  }

  return (
    <form
      data-slot="signup-form"
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
          id={ids.name}
          ref={nameRef}
          name="name"
          type="text"
          label={labels.name}
          placeholder={labels.namePlaceholder}
          autoComplete="name"
          required
          defaultValue={defaultValues?.name}
          error={errorFor("name")}
          onChange={() => clear("name")}
        />
        <AuthField
          id={ids.email}
          ref={emailRef}
          name="email"
          type="email"
          label={labels.email}
          placeholder={labels.emailPlaceholder}
          description={labels.emailDescription}
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
          description={labels.passwordDescription}
          autoComplete="new-password"
          required
          minLength={minPasswordLength}
          defaultValue={defaultValues?.password}
          error={errorFor("password")}
          onChange={() => {
            clear("password")
            // O erro de senhas diferentes fica na confirmação: editar a senha
            // também o tira (os outros erros da confirmação ficam).
            if (errorFor("confirmPassword") === labels.passwordMismatch) {
              clear("confirmPassword")
            }
          }}
        />
        <AuthField
          id={ids.confirmPassword}
          ref={confirmPasswordRef}
          name="confirmPassword"
          type="password"
          label={labels.confirmPassword}
          description={labels.confirmPasswordDescription}
          autoComplete="new-password"
          required
          defaultValue={defaultValues?.confirmPassword}
          error={errorFor("confirmPassword")}
          onChange={() => clear("confirmPassword")}
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
        {loginHref ? (
          <FieldDescription className="text-center [&>a:hover]:text-link-hover">
            {labels.hasAccount}{" "}
            <a href={loginHref} className={authLinkClassName}>
              {labels.login}
            </a>
          </FieldDescription>
        ) : null}
      </FieldGroup>
    </form>
  )
}

export type SignupPageProps = Pick<
  AuthLayoutProps,
  "brand" | "aside" | "image" | "footer"
> &
  SignupFormProps & {
    /** Classe do contêiner do layout (a do formulário vai em `className`). */
    layoutClassName?: string
  }

/** Página de cadastro pronta: `AuthLayout` + `SignupForm`. */
function SignupPage({
  brand,
  aside,
  image,
  footer,
  layoutClassName,
  ...formProps
}: SignupPageProps) {
  return (
    <AuthLayout
      brand={brand}
      aside={aside}
      image={image}
      footer={footer}
      className={layoutClassName}
    >
      <SignupForm {...formProps} />
    </AuthLayout>
  )
}

export { SignupForm, SignupPage }
