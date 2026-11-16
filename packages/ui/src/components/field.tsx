/*
 * Field — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/field
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Composição: `FieldSet` (fieldset + `FieldLegend`) > `FieldGroup` > `Field`
 *   (rótulo, controle, `FieldDescription`, `FieldError`). `Field` tem
 *   `role="group"`. O rótulo é sempre persistente e ligado ao controle por
 *   `htmlFor`/`id`; descrição e erro, por `aria-describedby` e
 *   `aria-errormessage` (veja o Input).
 * - Estado inválido: `data-invalid` no `Field` pinta de vermelho só o
 *   `FieldLabel` e o `FieldError`. O registro punha `text-destructive` no
 *   próprio `Field`, e todo o texto que herda a cor ficava vermelho, inclusive
 *   o que se digita nos controles (3,8:1 sobre o `field`, abaixo dos 4,5:1).
 *   Agora o texto dos controles continua em `foreground`. O `FieldTitle`
 *   também fica em `foreground`: ele pode estar sobre o preenchimento de um
 *   choice card. O controle em si usa `aria-invalid` (borda `destructive`).
 *   Contraste do vermelho (`destructive`) no texto de 14px: 4,76:1 sobre
 *   `background` e `card` no claro; 6,82:1 sobre `background` e 6,01:1 sobre
 *   `card` no escuro. Sobre `muted`/`accent` no claro ele cai para 4,28:1 e
 *   sobre `field` para 3,82:1 (5,11:1 no escuro): não ponha rótulo ou erro
 *   inválido sobre essas superfícies (um choice card marcado ou com o mouse
 *   em cima, por exemplo).
 * - Links na `FieldDescription`: sublinhados, hover em `link-hover` e anel de foco
 *   do projeto (`ring-3 ring-ring ring-offset-2 ring-offset-background`,
 *   `rounded-sm`) no lugar do outline do navegador.
 * - `FieldError` é uma região viva sempre montada: `aria-live="polite"` (e
 *   `aria-atomic`), sem `role="alert"`. O registro só montava o erro quando
 *   havia texto, e um `role="alert"` que nasce já com o texto nem sempre é
 *   anunciado e interrompe a leitura. Agora o elemento fica no DOM, vazio
 *   (`empty:sr-only`: sai do fluxo e não cria espaço, mas continua na árvore
 *   de acessibilidade), e só o texto muda. Renderize `<FieldError>` sempre,
 *   passando o texto como filho (ou `errors`), e não `{erro && <FieldError />}`.
 *   Para um erro crítico, passe `aria-live="assertive"` (ou `role="alert"`):
 *   as props do consumidor vêm depois e vencem. A API não mudou.
 * - Cores com opacidade do registro trocadas por papéis cheios: o choice card
 *   marcado (`has-data-checked:bg-accent`) e com o mouse em cima
 *   (`hover:bg-accent`) usa `bg-accent` (mist 100 no claro, 800 no escuro;
 *   o texto tem 15,6:1 e 14,2:1). Como o `input` é um cinza escuro, não serve
 *   de preenchimento sem a opacidade. No escuro, o card marcado usa `bg-card`
 *   (mist 900), inclusive com o mouse em cima: a caixa ou o círculo marcados
 *   (`primary`, Primária 600) têm 3,4:1 sobre ele, e só 2,9:1 sobre o
 *   `accent` (mist 800). No claro continuam 4,7:1 sobre o `accent`. Dentro de
 *   um `Card` (também mist 900) o fundo marcado se confunde com o do card; a
 *   borda do cartão de escolha continua marcando o limite.
 *   Medido no navegador, com hover real, para o controle de dentro do cartão
 *   (Switch, Checkbox e Radio dão os mesmos números): desmarcado, o `input`
 *   tem 4,61:1 em repouso e 4,14:1 com o mouse em cima (`accent`) no claro;
 *   3,78:1 e 3,63:1 no escuro (repouso sobre o fundo; hover sobre o
 *   `accent`). Marcado, a `primary` tem 4,66:1 no claro (`accent`, em repouso
 *   e com hover) e 3,35:1 no escuro (`card`, em repouso e com hover). Todos
 *   acima dos 3:1. Nenhum fundo do cartão usa opacidade.
 * - Anel de foco do choice card (`has-[:focus-visible]`): sólido, 3px, `ring`,
 *   afastado 2px pela cor do fundo, como no Button.
 * - Paddings e margens lógicos (`ms-4`, `text-start`), então funciona em RTL.
 * - Link dentro do FieldDescription: no hover vai para `link-hover`, e não
 *   para `primary` como no registro. A primária 600 tem só 3,8:1 contra o
 *   fundo escuro; `link-hover` tem 9,3:1 no claro e 13,3:1 no escuro.
 * - O texto do `FieldSeparator` recorta a linha com `bg-page` (o fundo da
 *   página da marca), e com `bg-card` dentro de um Card. O registro usava
 *   `bg-background`, que no SESI deixava um retângulo branco na página verde.
 */
import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-6 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-destructive has-data-checked:bg-accent has-[>[data-slot=field]]:rounded-2xl has-[>[data-slot=field]]:border has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-accent has-[>[data-slot=field]]:has-[:focus-visible]:border-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-3 has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-2 has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-background *:data-[slot=field]:p-4 dark:has-data-checked:bg-card dark:has-data-checked:has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-card",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-start text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:rounded-sm [&>a]:underline [&>a]:underline-offset-4 [&>a]:outline-none [&>a]:focus-visible:ring-3 [&>a]:focus-visible:ring-ring [&>a]:focus-visible:ring-offset-2 [&>a]:focus-visible:ring-offset-background [&>a:hover]:text-link-hover",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-page px-2 text-muted-foreground in-data-[slot=card]:bg-card"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      data-slot="field-error"
      className={cn(
        "text-sm font-normal text-destructive empty:sr-only",
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
