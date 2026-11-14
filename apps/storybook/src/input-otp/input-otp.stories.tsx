import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"

/*
 * One story per section of input-otp.mdx, in the order of the shadcn/ui page.
 * The OTP is ONE real <input> (invisible, laid over the slots): the label,
 * `id`, `required`, `disabled`, `aria-describedby`, `aria-errormessage` and
 * `aria-invalid` all go on <InputOTP>. The slots are only drawing, so
 * `aria-invalid` on them is just the style hook. Every example has a visible
 * label. Ids are prefixed with the story name: the Docs page renders all
 * stories in the same document.
 *
 * "Controlado" needs state, which a literal `render: () => (…)` cannot hold
 * (and eslint forbids hooks in `render`), so it uses the small component
 * below and gives the Docs page the copyable snippet in `docs.source.code`.
 */
// `maxLength` is a required prop of InputOTP, so the usual `satisfies
// Meta<typeof InputOTP>` would force `args` on every story (they use literal
// JSX instead): the meta is typed loosely.
const meta: Meta = {
  title: "Componentes/Input OTP",
  component: InputOTP,
}

export default meta
type Story = StoryObj

async function esperarAnimacoes() {
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
}

// The computed color of a token, serialized the same way as in box-shadow.
function corDoToken(token: string) {
  const sonda = document.createElement("span")
  sonda.style.color = `var(${token})`
  document.body.appendChild(sonda)
  const cor = getComputedStyle(sonda).color
  sonda.remove()
  return cor
}

// The input is invisible and laid over the slots, so axe cannot read their
// text and borders: these checks prove them with the computed styles.
async function casaAtivaAposTab(canvasElement: HTMLElement, rotulo: string) {
  const canvas = within(canvasElement)
  const campo = await canvas.findByLabelText(rotulo)
  await userEvent.tab()
  await expect(campo).toHaveFocus()
  await esperarAnimacoes()
  let ativa: HTMLElement | null = null
  await waitFor(() => {
    ativa = canvasElement.querySelector<HTMLElement>(
      '[data-slot="input-otp-slot"][data-active="true"]'
    )
    expect(ativa).not.toBeNull()
  })
  return {
    ativa: ativa as unknown as HTMLElement,
    casas: [
      ...canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="input-otp-slot"]'
      ),
    ],
  }
}

function OtpControlado() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex w-fit flex-col gap-2">
      <Field className="w-fit">
        <FieldLabel htmlFor="controlado-codigo">Senha de uso único</FieldLabel>
        <InputOTP
          id="controlado-codigo"
          maxLength={6}
          value={value}
          onChange={(novo) => setValue(novo)}
          aria-describedby="controlado-codigo-estado"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <div
        id="controlado-codigo-estado"
        aria-live="polite"
        className="text-sm text-muted-foreground"
      >
        {value === ""
          ? "Digite a sua senha de uso único."
          : `Você digitou: ${value}`}
      </div>
    </div>
  )
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    // Off: every slot has the `input` border (4,6:1 in light, 3,8:1 in dark).
    const desligadas = await within(canvasElement).findAllByText("1")
    await expect(desligadas.length).toBeGreaterThan(0)
    for (const casa of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="input-otp-slot"]'
    )) {
      await expect(getComputedStyle(casa).borderTopColor).toBe(
        corDoToken("--input")
      )
    }

    const { ativa, casas } = await casaAtivaAposTab(
      canvasElement,
      "Código de verificação"
    )

    // The digit is `foreground`.
    for (const casa of casas) {
      await expect(getComputedStyle(casa).color).toBe(
        corDoToken("--foreground")
      )
    }

    // The active slot: solid `ring` (3px + 2px offset in the background color).
    const sombra = getComputedStyle(ativa).boxShadow
    await expect(sombra).toContain(corDoToken("--ring"))
    await expect(sombra).toContain(corDoToken("--background"))
    await expect(sombra).toMatch(/\b5px\b/)
    await expect(getComputedStyle(ativa).borderTopColor).toBe(
      corDoToken("--ring")
    )
  },
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="demo-codigo">Código de verificação</FieldLabel>
      <InputOTP id="demo-codigo" maxLength={6} defaultValue="123456">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  ),
}

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const campo = await canvas.findByLabelText("Somente dígitos")
    // The pattern drops the letters and keeps the digits.
    await userEvent.click(campo)
    await userEvent.keyboard("a1b2c3")
    await expect(campo).toHaveValue("123")
  },
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="padrao-digitos">Somente dígitos</FieldLabel>
      <InputOTP id="padrao-digitos" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  ),
}

export const Separador: Story = {
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="separador-codigo">Código de acesso</FieldLabel>
      <InputOTP id="separador-codigo" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <Field data-disabled className="w-fit">
      <FieldLabel htmlFor="desabilitado-codigo">
        Código de verificação
      </FieldLabel>
      <InputOTP
        id="desabilitado-codigo"
        maxLength={6}
        disabled
        defaultValue="123456"
        aria-describedby="desabilitado-codigo-descricao"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription id="desabilitado-codigo-descricao">
        A verificação está desabilitada no momento.
      </FieldDescription>
    </Field>
  ),
}

export const Controlado: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = React.useState("")

<div className="flex w-fit flex-col gap-2">
  <Field className="w-fit">
    <FieldLabel htmlFor="codigo">Senha de uso único</FieldLabel>
    <InputOTP
      id="codigo"
      maxLength={6}
      value={value}
      onChange={(novo) => setValue(novo)}
      aria-describedby="codigo-estado"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  </Field>
  <div id="codigo-estado" aria-live="polite" className="text-sm text-muted-foreground">
    {value === ""
      ? "Digite a sua senha de uso único."
      : \`Você digitou: \${value}\`}
  </div>
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const campo = await canvas.findByLabelText("Senha de uso único")
    await userEvent.click(campo)
    await userEvent.keyboard("4821")
    await expect(
      await canvas.findByText("Você digitou: 4821")
    ).toBeInTheDocument()
  },
  render: () => <OtpControlado />,
}

export const Invalido: Story = {
  name: "Inválido",
  play: async ({ canvasElement }) => {
    const { ativa, casas } = await casaAtivaAposTab(
      canvasElement,
      "Código de verificação"
    )

    // Inside a `Field data-invalid` the digit stays `foreground` (not red),
    // and every slot border is `destructive`.
    for (const casa of casas) {
      await expect(getComputedStyle(casa).color).toBe(
        corDoToken("--foreground")
      )
      await expect(getComputedStyle(casa).borderTopColor).toBe(
        corDoToken("--destructive")
      )
    }

    // The active slot's ring is solid `destructive`, not the `ring` blue.
    const sombra = getComputedStyle(ativa).boxShadow
    await expect(sombra).toContain(corDoToken("--destructive"))
    await expect(sombra).not.toContain(corDoToken("--ring"))
  },
  render: () => (
    <Field data-invalid className="w-fit">
      <FieldLabel htmlFor="invalido-codigo">Código de verificação</FieldLabel>
      <InputOTP
        id="invalido-codigo"
        maxLength={6}
        defaultValue="000000"
        aria-invalid
        aria-describedby="invalido-codigo-erro"
        aria-errormessage="invalido-codigo-erro"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} aria-invalid />
          <InputOTPSlot index={1} aria-invalid />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} aria-invalid />
          <InputOTPSlot index={3} aria-invalid />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} aria-invalid />
          <InputOTPSlot index={5} aria-invalid />
        </InputOTPGroup>
      </InputOTP>
      <FieldError id="invalido-codigo-erro">
        O código está incorreto ou expirou. Peça um novo código.
      </FieldError>
    </Field>
  ),
}

export const QuatroDigitos: Story = {
  name: "Quatro dígitos",
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="quatro-pin">PIN de acesso</FieldLabel>
      <InputOTP
        id="quatro-pin"
        maxLength={4}
        pattern={REGEXP_ONLY_DIGITS}
        aria-describedby="quatro-pin-descricao"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription id="quatro-pin-descricao">
        Use 4 dígitos.
      </FieldDescription>
    </Field>
  ),
}

export const Alfanumerico: Story = {
  name: "Alfanumérico",
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="alfanumerico-codigo">Código do convite</FieldLabel>
      <InputOTP
        id="alfanumerico-codigo"
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode="text"
        aria-describedby="alfanumerico-codigo-descricao"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription id="alfanumerico-codigo-descricao">
        Letras e números.
      </FieldDescription>
    </Field>
  ),
}

export const Formulario: Story = {
  name: "Formulário",
  render: () => (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Confirme o seu acesso</CardTitle>
        <CardDescription>
          Digite o código de verificação que enviamos para o seu e-mail:{" "}
          <span className="font-medium">m@exemplo.com</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="formulario-verificacao">
              Código de verificação
            </FieldLabel>
            <Button type="button" variant="outline" size="xs">
              <RefreshCwIcon aria-hidden="true" data-icon="inline-start" />
              Reenviar código
            </Button>
          </div>
          <InputOTP
            id="formulario-verificacao"
            maxLength={6}
            required
            aria-describedby="formulario-verificacao-descricao"
          >
            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-2" />
            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription id="formulario-verificacao-descricao">
            <a href="#">Não tenho mais acesso a este e-mail.</a>
          </FieldDescription>
        </Field>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="submit" className="w-full">
            Verificar
          </Button>
          <div className="text-sm text-muted-foreground">
            Está com dificuldade para entrar?{" "}
            <a
              href="#"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Fale com o suporte
            </a>
          </div>
        </Field>
      </CardFooter>
    </Card>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar">
      <Field className="mx-auto max-w-xs">
        <FieldLabel htmlFor="rtl-codigo">رمز التحقق</FieldLabel>
        <InputOTP id="rtl-codigo" maxLength={6} defaultValue="123456" dir="rtl">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  ),
}
