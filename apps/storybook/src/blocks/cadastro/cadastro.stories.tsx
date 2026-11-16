import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { SignupPage } from "@workspace/ui/blocks/signup"

/*
 * One story per section of cadastro.mdx. Same setup as the Login stories:
 * "fullscreen" layout, rendered inline on the Docs page (in a bordered box
 * with a fixed minimum height, so the previews follow the toolbar), tests at
 * 1200x900 (the end column is visible; see `conferirColunaLateral`).
 *
 * Interactions live in `Validacao` (keyboard path, required errors, short
 * password, mismatch) and `Playground` (valid values reach `onSubmit`, a
 * `fn()` spy in its args). The other stories only make assertions. How a
 * dismissed server error comes back is the same hook as the Login and is
 * tested there (`ErroRepetido`, `SemNovaResposta`).
 */
const meta = {
  title: "Blocks/Cadastro",
  component: SignupPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, context) =>
      context.viewMode === "docs" ? (
        // Inline, the previews share the Docs page: a link or a valid submit
        // (these stories pass no `onSubmit`) would navigate the whole page.
        // The block's own validation still runs.
        <div
          className="overflow-hidden rounded-2xl border border-border **:data-[slot=auth-layout]:min-h-[47.5rem]"
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
} satisfies Meta<typeof SignupPage>

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
    await conferirColunaLateral(canvasElement)
    // Each hint is the field's description.
    await expect(canvas.getByLabelText("Senha")).toHaveAccessibleDescription(
      "Use pelo menos 8 caracteres."
    )
    await expect(
      canvas.getByLabelText("Confirmar senha")
    ).toHaveAccessibleDescription("Digite a mesma senha de novo.")
    await expect(canvas.getByLabelText("Senha")).toHaveAttribute(
      "autocomplete",
      "new-password"
    )
    await expect(canvas.getByLabelText("Nome completo")).toHaveAttribute(
      "autocomplete",
      "name"
    )
  },
  render: () => (
    <SignupPage
      loginHref="/entrar"
      socialProviders={[
        {
          id: "github",
          label: "Cadastrar com GitHub",
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

export const SenhasDiferentes: Story = {
  name: "Senhas diferentes",
  play: async ({ canvasElement }) => {
    const confirmar = within(canvasElement).getByLabelText("Confirmar senha")
    await expect(confirmar).toHaveAttribute("aria-invalid", "true")
    await expect(confirmar).toHaveAccessibleErrorMessage(
      "As senhas não coincidem."
    )
    // The error joins the hint in the description.
    await expect(confirmar).toHaveAccessibleDescription(
      "Digite a mesma senha de novo. As senhas não coincidem."
    )
    await expect(confirmar.closest("[data-slot=field]")).toHaveAttribute(
      "data-invalid",
      "true"
    )
  },
  render: () => (
    <SignupPage
      loginHref="/entrar"
      defaultValues={{
        name: "Joana Lima",
        email: "joana@exemplo.com",
        password: "senha-secreta",
        confirmPassword: "senha-secrta",
      }}
      errors={{ confirmPassword: "As senhas não coincidem." }}
    />
  ),
}

export const ComErro: Story = {
  name: "Com erro",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The form-level error is inside the polite region that stays mounted.
    const regiao = canvasElement.querySelector("[id$=-erro-formulario]")
    await expect(regiao).toHaveAttribute("aria-live", "polite")
    await expect(regiao).toHaveTextContent(
      "Não foi possível criar a conta. Confira os dados e tente de novo."
    )
    // The field error is linked to the field and marks it invalid.
    const email = canvas.getByLabelText("E-mail")
    await expect(email).toHaveAttribute("aria-invalid", "true")
    await expect(email).toHaveAccessibleErrorMessage(
      "Este e-mail já tem conta."
    )
    await expect(email.closest("[data-slot=field]")).toHaveAttribute(
      "data-invalid",
      "true"
    )
  },
  render: () => (
    <SignupPage
      loginHref="/entrar"
      defaultValues={{ name: "Joana Lima", email: "joana@exemplo.com" }}
      error="Não foi possível criar a conta. Confira os dados e tente de novo."
      errors={{ email: "Este e-mail já tem conta." }}
    />
  ),
}

export const Enviando: Story = {
  play: async ({ canvasElement }) => {
    const botao = within(canvasElement).getByRole("button", {
      name: "Criando conta…",
    })
    await expect(botao).toHaveAttribute("aria-disabled", "true")
    await expect(canvasElement.querySelector("form")).toHaveAttribute(
      "aria-busy",
      "true"
    )
    // The providers are disabled too, and also stay focusable.
    const provedor = within(canvasElement).getByRole("button", {
      name: "Cadastrar com GitHub",
    })
    await expect(provedor).toHaveAttribute("aria-disabled", "true")
    await expect(provedor).not.toHaveAttribute("disabled")
  },
  render: () => (
    <SignupPage
      loginHref="/entrar"
      defaultValues={{
        name: "Joana Lima",
        email: "joana@exemplo.com",
        password: "senha-secreta",
        confirmPassword: "senha-secreta",
      }}
      socialProviders={[
        {
          id: "github",
          label: "Cadastrar com GitHub",
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

export const SemColunaLateral: Story = {
  name: "Sem coluna lateral",
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("[data-slot=auth-layout-aside]")
    ).toBeNull()
  },
  render: () => (
    <SignupPage
      aside={false}
      brand={{ name: "Portal do Cliente", href: "/" }}
      loginHref="/entrar"
      minPasswordLength={12}
    />
  ),
}

export const Validacao: Story = {
  name: "Validação e teclado",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nome = canvas.getByLabelText("Nome completo")
    const email = canvas.getByLabelText("E-mail")
    const senha = canvas.getByLabelText("Senha")
    const confirmar = canvas.getByLabelText("Confirmar senha")
    const criar = canvas.getByRole("button", { name: "Criar conta" })

    // Keyboard path, in the order of the block.
    nome.focus()
    await userEvent.tab()
    await expect(email).toHaveFocus()
    await userEvent.tab()
    await expect(senha).toHaveFocus()
    await userEvent.tab()
    await expect(confirmar).toHaveFocus()
    await userEvent.tab()
    await expect(criar).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Entrar" })).toHaveFocus()

    // Empty submit: every field is flagged, the focus goes to the first.
    await userEvent.click(criar)
    await expect(nome).toHaveFocus()
    await expect(nome).toHaveAccessibleErrorMessage("Informe o nome completo.")
    await expect(email).toHaveAccessibleErrorMessage("Informe o e-mail.")
    await expect(senha).toHaveAccessibleErrorMessage("Crie uma senha.")
    await expect(confirmar).toHaveAccessibleErrorMessage("Confirme a senha.")

    // Short password, then a mismatch: the focus follows the first error.
    await userEvent.type(nome, "Joana Lima")
    await userEvent.type(email, "joana@exemplo.com")
    await userEvent.type(senha, "curta")
    await userEvent.type(confirmar, "curta")
    await userEvent.click(criar)
    await expect(senha).toHaveFocus()
    await expect(senha).toHaveAccessibleErrorMessage(
      "A senha precisa ter pelo menos 8 caracteres."
    )
    await userEvent.type(senha, "-e-segura")
    await userEvent.click(criar)
    await expect(confirmar).toHaveFocus()
    await expect(confirmar).toHaveAttribute("aria-invalid", "true")
    await expect(confirmar).toHaveAccessibleErrorMessage(
      "As senhas não coincidem."
    )
  },
  render: () => <SignupPage aside={false} loginHref="/entrar" />,
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <SignupPage
        title="أنشئ حسابك"
        description="املأ النموذج أدناه لإنشاء حسابك"
        loginHref="/entrar"
        labels={{
          name: "الاسم الكامل",
          namePlaceholder: "جوانا ليما",
          email: "البريد الإلكتروني",
          emailPlaceholder: "name@example.com",
          emailDescription:
            "سنستخدم هذا البريد للتواصل معك. لن نشاركه مع أي أحد.",
          password: "كلمة المرور",
          passwordDescription: "يجب ألا تقل عن 8 أحرف.",
          confirmPassword: "تأكيد كلمة المرور",
          confirmPasswordDescription: "أدخل كلمة المرور نفسها مرة أخرى.",
          submit: "إنشاء حساب",
          pending: "جارٍ إنشاء الحساب…",
          separator: "أو تابع باستخدام",
          hasAccount: "لديك حساب بالفعل؟",
          login: "تسجيل الدخول",
          nameRequired: "أدخل الاسم الكامل.",
          emailRequired: "أدخل البريد الإلكتروني.",
          emailInvalid: "أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.",
          passwordRequired: "أنشئ كلمة مرور.",
          passwordTooShort: "يجب ألا تقل كلمة المرور عن 8 أحرف.",
          confirmPasswordRequired: "أكد كلمة المرور.",
          passwordMismatch: "كلمتا المرور غير متطابقتين.",
        }}
      />
    </div>
  ),
}

export const Playground: Story = {
  args: {
    title: "Crie sua conta",
    description: "Preencha o formulário abaixo para criar sua conta",
    loginHref: "/entrar",
    minPasswordLength: 8,
    pending: false,
    error: "",
    onSubmit: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText("Nome completo"), "Joana Lima")
    await userEvent.type(canvas.getByLabelText("E-mail"), "joana@exemplo.com")
    await userEvent.type(canvas.getByLabelText("Senha"), "senha-secreta")
    await userEvent.type(
      canvas.getByLabelText("Confirmar senha"),
      "senha-secreta"
    )
    await userEvent.click(canvas.getByRole("button", { name: "Criar conta" }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      {
        name: "Joana Lima",
        email: "joana@exemplo.com",
        password: "senha-secreta",
        confirmPassword: "senha-secreta",
      },
      expect.anything()
    )
  },
}
