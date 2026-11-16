import * as React from "react"

import { LoginPage } from "@workspace/ui/blocks/login"
import { SignupPage } from "@workspace/ui/blocks/signup"

import { href, navigate } from "@/lib/use-hash-route"

/*
 * Os blocos só validam o preenchimento e entregam os valores no `onSubmit`.
 * Aqui a "autenticação" é simulada: espera um instante (`pending`) e entra
 * no dashboard. Num projeto real, chame a API do projeto e passe `error` ou
 * `errors` com a resposta.
 */
function useFakeSubmit() {
  const [pending, setPending] = React.useState(false)
  const timeout = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timeout.current), [])

  const submit = React.useCallback(() => {
    setPending(true)
    timeout.current = window.setTimeout(() => navigate("/"), 800)
  }, [])

  return { pending, submit }
}

export function DemoLoginPage() {
  const { pending, submit } = useFakeSubmit()

  return (
    <LoginPage
      signupHref={href("/cadastro")}
      pending={pending}
      onSubmit={submit}
    />
  )
}

export function DemoSignupPage() {
  const { pending, submit } = useFakeSubmit()

  return (
    <SignupPage
      loginHref={href("/login")}
      pending={pending}
      onSubmit={submit}
    />
  )
}
