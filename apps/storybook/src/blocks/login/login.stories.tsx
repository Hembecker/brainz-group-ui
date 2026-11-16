import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { LoginForm, LoginPage } from "@workspace/ui/blocks/login"

/*
 * One story per section of login.mdx. The block is a full page
 * (`min-h-svh`), so the stories use the "fullscreen" layout. The Docs page
 * renders them inline, like the Dashboard page, so they follow the Marca,
 * Modo and Direção toolbar (an iframe of the Docs page gets no globals and
 * stayed Brainz/light). There the decorator puts each one in a bordered box
 * and swaps `min-h-svh` for a fixed minimum height; the `lg` breakpoint then
 * follows the width of the Docs page. Docs does not run the plays of inline
 * stories.
 *
 * The tests run at 1200x900, above `lg` (1024px): the end column is visible
 * and axe checks it (see `conferirColunaLateral`).
 *
 * Interactions live in `Validacao` (keyboard path and required errors),
 * `ErroRepetido` (an external error hidden by an edit stays hidden while the
 * submit is pending and comes back when the response repeats it),
 * `SemNovaResposta` (without a new `errors`, it stays hidden) and
 * `Playground` (valid values reach
 * `onSubmit`, a `fn()` spy in its args: the only story with args, as in the
 * other pages). None of them is on the Docs page; the other stories only make
 * assertions.
 */
const meta = {
  title: "Blocks/Login",
  component: LoginPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, context) =>
      context.viewMode === "docs" ? (
        // Inline, the previews share the Docs page: a link or a valid submit
        // (these stories pass no `onSubmit`) would navigate the whole page.
        // The block's own validation still runs.
        <div
          className="overflow-hidden rounded-2xl border border-border **:data-[slot=auth-layout]:min-h-[40rem]"
          onClick={(event) => {
            if ((event.target as Element).closest("a[href]")) {
              event.preventDefault()
            }
          }}
          onSubmit={(event) => event.preventDefault()}
        >
          <Story />
        </div>
      ) : (
        <Story />
      ),
  ],
} satisfies Meta<typeof LoginPage>

export default meta
type Story = StoryObj<typeof meta>

/*
 * The end column only shows from `lg` (1024px) up. The tests run at 1200x900,
 * so there it must be on screen (axe checks it): a smaller test viewport fails
 * here instead of passing without the column. Outside the tests (`storybook
 * dev` and the static build, where a story can open in a narrow window) the
 * check only asserts that the column follows the breakpoint.
 */
async function conferirColunaLateral(canvasElement: HTMLElement) {
  const desktop = window.matchMedia("(min-width: 64rem)").matches
  if (!["development", "production"].includes(import.meta.env.MODE)) {
    await expect(desktop).toBe(true)
  }
  const aside = canvasElement.querySelector("[data-slot=auth-layout-aside]")
  if (desktop) await expect(aside).toBeVisible()
  else await expect(aside).not.toBeVisible()
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The brand panel (decorative) is on screen from `lg` up.
    await conferirColunaLateral(canvasElement)
    await expect(
      canvasElement.querySelector("[data-slot=auth-layout-brand-panel]")
    ).toHaveAttribute("aria-hidden", "true")
    // Persistent labels and landmarks.
    await expect(canvas.getByLabelText("E-mail")).toHaveAttribute(
      "autocomplete",
      "email"
    )
    await expect(canvas.getByLabelText("Senha")).toHaveAttribute(
      "autocomplete",
      "current-password"
    )
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Entrar na sua conta" })
    ).toBeInTheDocument()
    // The form-level error region is mounted (empty) before any error.
    const regiao = canvasElement.querySelector("[id$=-erro-formulario]")
    await expect(regiao).toHaveAttribute("aria-live", "polite")
    await expect(regiao).toBeEmptyDOMElement()
  },
  render: () => (
    <LoginPage
      forgotPasswordHref="/recuperar-senha"
      signupHref="/cadastro"
      socialProviders={[
        {
          id: "github",
          label: "Entrar com GitHub",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
          ),
        },
      ]}
    />
  ),
}

export const ComImagem: Story = {
  name: "Com imagem",
  play: async ({ canvasElement }) => {
    await conferirColunaLateral(canvasElement)
    await expect(
      canvasElement.querySelector("[data-slot=auth-layout-aside] img")
    ).toHaveAttribute(
      "alt",
      "Tabela da escala Primária da Brainz Group, com os códigos de cor do 50 ao 950"
    )
  },
  render: () => (
    <LoginPage
      forgotPasswordHref="/recuperar-senha"
      signupHref="/cadastro"
      image={{
        src: "paleta-primaria.png",
        alt: "Tabela da escala Primária da Brainz Group, com os códigos de cor do 50 ao 950",
      }}
    />
  ),
}

export const SemColunaLateral: Story = {
  name: "Sem coluna lateral",
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("[data-slot=auth-layout-aside]")
    ).toBeNull()
  },
  render: () => (
    <LoginPage
      aside={false}
      brand={{ name: "Portal do Cliente", href: "/" }}
      forgotPasswordHref="/recuperar-senha"
      signupHref="/cadastro"
      footer={
        <>
          Ao entrar, você aceita os{" "}
          <a
            href="/termos"
            className="rounded-sm underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            termos de uso
          </a>
          .
        </>
      }
    />
  ),
}

export const ComErro: Story = {
  name: "Com erro",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector("[id$=-erro-formulario]")
    ).toHaveTextContent("Não foi possível entrar.")
    // The field error is linked to the field and marks it invalid.
    const senha = canvas.getByLabelText("Senha")
    await expect(senha).toHaveAttribute("aria-invalid", "true")
    await expect(senha).toHaveAccessibleErrorMessage(
      "A senha não confere com este e-mail."
    )
    await expect(senha.closest("[data-slot=field]")).toHaveAttribute(
      "data-invalid",
      "true"
    )
  },
  render: () => (
    <LoginPage
      forgotPasswordHref="/recuperar-senha"
      signupHref="/cadastro"
      defaultValues={{ email: "joana@exemplo.com" }}
      error="Não foi possível entrar. Confira os dados e tente de novo."
      errors={{ password: "A senha não confere com este e-mail." }}
    />
  ),
}

export const Enviando: Story = {
  play: async ({ canvasElement }) => {
    const botao = within(canvasElement).getByRole("button", {
      name: "Entrando…",
    })
    // Disabled but still focusable, so the focus never drops to <body>.
    await expect(botao).toHaveAttribute("aria-disabled", "true")
    await expect(botao).not.toHaveAttribute("disabled")
    await expect(canvasElement.querySelector("form")).toHaveAttribute(
      "aria-busy",
      "true"
    )
    // The providers are disabled too, and also stay focusable.
    const provedor = within(canvasElement).getByRole("button", {
      name: "Entrar com GitHub",
    })
    await expect(provedor).toHaveAttribute("aria-disabled", "true")
    await expect(provedor).not.toHaveAttribute("disabled")
  },
  render: () => (
    <LoginPage
      forgotPasswordHref="/recuperar-senha"
      signupHref="/cadastro"
      defaultValues={{ email: "joana@exemplo.com", password: "senha-secreta" }}
      socialProviders={[
        {
          id: "github",
          label: "Entrar com GitHub",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
          ),
        },
      ]}
      pending
    />
  ),
}

export const SomenteOFormulario: Story = {
  name: "Somente o formulário",
  render: () => (
    <div className="mx-auto w-full max-w-xs py-10">
      <LoginForm
        title="Bem-vinda de volta"
        description="Entre com o e-mail da sua equipe"
        forgotPasswordHref="/recuperar-senha"
      />
    </div>
  ),
}

export const Validacao: Story = {
  name: "Validação e teclado",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const email = canvas.getByLabelText("E-mail")
    const senha = canvas.getByLabelText("Senha")
    const entrar = canvas.getByRole("button", { name: "Entrar" })

    // Keyboard path, in the order of the block.
    email.focus()
    await userEvent.tab()
    await expect(
      canvas.getByRole("link", { name: "Esqueceu a senha?" })
    ).toHaveFocus()
    await userEvent.tab()
    await expect(senha).toHaveFocus()
    await userEvent.tab()
    await expect(entrar).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Cadastre-se" })).toHaveFocus()

    // Empty submit: the focus goes to the first invalid field.
    await userEvent.click(entrar)
    await expect(email).toHaveFocus()
    await expect(email).toHaveAttribute("aria-invalid", "true")
    await expect(email).toHaveAccessibleErrorMessage("Informe o e-mail.")
    await expect(senha).toHaveAccessibleErrorMessage("Informe a senha.")

    // Typing clears that field's error; a malformed e-mail gets its own.
    await userEvent.type(email, "joana")
    await expect(email).not.toHaveAttribute("aria-invalid")
    await userEvent.keyboard("{Enter}")
    await expect(email).toHaveFocus()
    await expect(email).toHaveAccessibleErrorMessage(
      "Informe um e-mail completo, como nome@exemplo.com."
    )

    // With a valid e-mail, the next invalid field takes the focus.
    await userEvent.type(email, "@exemplo.com{Enter}")
    await expect(email).not.toHaveAttribute("aria-invalid")
    await expect(senha).toHaveFocus()
    await expect(senha).toHaveAttribute("aria-invalid", "true")
  },
  render: () => (
    <LoginPage
      aside={false}
      forgotPasswordHref="/recuperar-senha"
      signupHref="/cadastro"
    />
  ),
}

// A server that answers each submit after a short delay: `pending` while it
// waits, then a new `errors` object with the same message.
function ServidorQueRepeteOErro() {
  const [pending, setPending] = React.useState(false)
  const [errors, setErrors] = React.useState<{ password?: string }>({
    password: "A senha não confere com este e-mail.",
  })

  return (
    <LoginPage
      aside={false}
      defaultValues={{ email: "joana@exemplo.com" }}
      errors={errors}
      pending={pending}
      onSubmit={() => {
        setPending(true)
        window.setTimeout(() => {
          setPending(false)
          setErrors({ password: "A senha não confere com este e-mail." })
        }, 400)
      }}
    />
  )
}

export const ErroRepetido: Story = {
  name: "Erro repetido do servidor",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const senha = canvas.getByLabelText("Senha")
    await expect(senha).toHaveAccessibleErrorMessage(
      "A senha não confere com este e-mail."
    )
    // Editing the field hides the external error...
    await userEvent.type(senha, "outra-senha")
    await expect(senha).not.toHaveAttribute("aria-invalid")
    await expect(senha).not.toHaveAttribute("aria-errormessage")
    // ...the submit alone does not bring it back: while the request is in
    // flight, the stale error is not announced again...
    await userEvent.click(canvas.getByRole("button", { name: "Entrar" }))
    await expect(
      canvas.getByRole("button", { name: "Entrando…" })
    ).toBeInTheDocument()
    await expect(canvasElement.querySelector("form")).toHaveAttribute(
      "aria-busy",
      "true"
    )
    await expect(senha).not.toHaveAttribute("aria-invalid")
    await expect(senha).not.toHaveAttribute("aria-errormessage")
    // ...and the response brings it back when it repeats the error.
    await waitFor(
      () => expect(senha).toHaveAttribute("aria-invalid", "true"),
      { timeout: 5000 }
    )
    await expect(senha).toHaveAccessibleErrorMessage(
      "A senha não confere com este e-mail."
    )
    await expect(canvasElement.querySelector("form")).not.toHaveAttribute(
      "aria-busy"
    )
  },
  render: () => <ServidorQueRepeteOErro />,
}

export const SemNovaResposta: Story = {
  name: "Erro sem nova resposta",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const senha = canvas.getByLabelText("Senha")
    await userEvent.type(senha, "outra-senha")
    await expect(senha).not.toHaveAttribute("aria-invalid")
    // `onSubmit` never sends `errors` again: the dismissed error stays hidden.
    await userEvent.click(canvas.getByRole("button", { name: "Entrar" }))
    await expect(senha).not.toHaveAttribute("aria-invalid")
    await expect(senha).not.toHaveAttribute("aria-errormessage")
  },
  render: () => (
    <LoginPage
      aside={false}
      defaultValues={{ email: "joana@exemplo.com" }}
      errors={{ password: "A senha não confere com este e-mail." }}
      onSubmit={() => {}}
    />
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <LoginPage
        title="تسجيل الدخول إلى حسابك"
        description="أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك"
        forgotPasswordHref="/recuperar-senha"
        signupHref="/cadastro"
        labels={{
          email: "البريد الإلكتروني",
          emailPlaceholder: "name@example.com",
          password: "كلمة المرور",
          forgotPassword: "نسيت كلمة المرور؟",
          submit: "تسجيل الدخول",
          pending: "جارٍ تسجيل الدخول…",
          separator: "أو تابع باستخدام",
          noAccount: "ليس لديك حساب؟",
          signup: "إنشاء حساب",
          emailRequired: "أدخل البريد الإلكتروني.",
          emailInvalid: "أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.",
          passwordRequired: "أدخل كلمة المرور.",
        }}
      />
    </div>
  ),
}

export const Playground: Story = {
  args: {
    title: "Entrar na sua conta",
    description: "Digite seu e-mail abaixo para entrar na sua conta",
    forgotPasswordHref: "/recuperar-senha",
    signupHref: "/cadastro",
    pending: false,
    error: "",
    onSubmit: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText("E-mail"), "joana@exemplo.com")
    await userEvent.type(canvas.getByLabelText("Senha"), "senha-secreta")
    await userEvent.click(canvas.getByRole("button", { name: "Entrar" }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      { email: "joana@exemplo.com", password: "senha-secreta" },
      expect.anything()
    )
  },
}
