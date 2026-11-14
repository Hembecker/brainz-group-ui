import * as React from "react"
import { cn } from "cn"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

/*
 * InputOTP — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/input-otp
 * Construído sobre o `input-otp` (https://input-otp.rodz.dev), que renderiza UM
 * `<input>` real, invisível e sobreposto às casas, com `autoComplete="one-time-code"`
 * e `inputMode="numeric"` por padrão. As casas (`InputOTPSlot`) são só desenho.
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - O nome acessível vem do `<input>` real: ponha o `id` no `InputOTP` e ligue
 *   `FieldLabel htmlFor` a ele. `required`, `disabled`, `aria-describedby`,
 *   `aria-errormessage` e `aria-invalid` também vão no `InputOTP`, que os
 *   repassa ao input. O placeholder não existe; o rótulo é sempre visível.
 * - Casas preenchidas com o papel `field`, com a borda `input` (mist 500 no
 *   claro, 4,6:1; branco a 40% no escuro, 3,8:1), para as casas vazias e
 *   desligadas se destacarem do fundo. O registro usava `bg-input/50`, sem
 *   contraste suficiente. O dígito é sempre `text-foreground`, para não herdar
 *   a cor de um ancestral (um `Field data-invalid` já pintou o texto de
 *   vermelho, 3,8:1 sobre o `field`); só a borda e a mensagem ficam vermelhas.
 * - Casa ativa (a que recebe o próximo dígito): borda e anel sólidos, 3px, no
 *   `ring`, afastados 2px pela cor do fundo, como no Input, com `z-10` para o
 *   anel passar por cima das casas vizinhas.
 * - Inválido: `aria-invalid` nas casas é o gancho do estilo (borda `destructive`
 *   cheia e, na casa ativa, anel `destructive`); para a tecnologia assistiva,
 *   marque também o `InputOTP`. O registro usava `ring-destructive/20` no
 *   grupo e na casa ativa e, no escuro, `/40`; foram trocados por papéis
 *   cheios. A cor não basta: ligue uma mensagem por `aria-describedby` e
 *   `aria-errormessage`.
 * - Escala do estilo rhea: casas `size-8` e cantos `rounded-2xl` nas pontas de
 *   cada grupo. As bordas e os cantos são lógicos (`border-s`/`border-e`,
 *   `rounded-s`/`rounded-e`), então o componente funciona em RTL.
 * - Desabilitado: o container fica em `opacity-50` e o input sai do Tab.
 * - `defaultValue` é guardado aqui, e a biblioteca recebe só `value`: o
 *   `input-otp` repassava `defaultValue` e `value` juntos ao <input>, e o React
 *   avisava no console (controlado e não controlado ao mesmo tempo).
 */

function InputOTP({
  className,
  containerClassName,
  value,
  defaultValue,
  onChange,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  const [interno, setInterno] = React.useState(() =>
    defaultValue === undefined ? "" : String(defaultValue)
  )
  const controlado = value !== undefined
  return (
    <OTPInput
      value={controlado ? value : interno}
      onChange={(novo: string) => {
        if (!controlado) setInterno(novo)
        onChange?.(novo)
      }}
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center rounded-2xl", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-8 items-center justify-center border-y border-e border-input bg-field text-sm text-foreground transition-[color,box-shadow] duration-200 outline-none first:rounded-s-2xl first:border-s last:rounded-e-2xl aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-background data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
