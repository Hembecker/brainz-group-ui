import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Clock2Icon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { arSA, ptBR } from "react-day-picker/locale"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import {
  Calendar,
  CalendarDayButton,
} from "@workspace/ui/components/calendar"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

/*
 * One story per section of calendar.mdx, in the order of the shadcn/ui page
 * (About, Date Picker, Persian/Hijri, TimeZone and Custom Cell Size's text are
 * only text in the MDX; Hijri needs `next/font` and a copy of the component,
 * so it is not rendered).
 * Fixed dates: every example passes `today` (12 June 2025, a Thursday) and the
 * visible month, so the "today" style, the accessible names ("Hoje, …") and
 * the dropdown years do not drift with the real date. In your own code, omit
 * `today`. The stories with a selection keep it in `useState`, so each has a
 * helper component here and the copyable snippet in `docs.source.code`.
 * Portuguese examples use the `ptBR` of `react-day-picker/locale` (the
 * date-fns `ptBR` plus the translated accessibility labels), and RTL uses the
 * `arSA` of the same package. Ids are prefixed with the story name.
 */
const meta = {
  title: "Componentes/Calendar",
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function CalendarioDemo() {
  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 5, 15)
  )

  return (
    <Calendar
      mode="single"
      selected={data}
      onSelect={setData}
      locale={ptBR}
      today={new Date(2025, 5, 12)}
      captionLayout="dropdown"
      className="rounded-lg border"
    />
  )
}

export const Demo: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [data, setData] = React.useState<Date | undefined>(
  new Date(2025, 5, 15)
)

<Calendar
  mode="single"
  selected={data}
  onSelect={setData}
  locale={ptBR}
  today={new Date(2025, 5, 12)}
  captionLayout="dropdown"
  className="rounded-lg border"
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const mes = () => canvas.getByRole("status")
    await expect(mes()).toHaveTextContent(/junho.*2025/)

    // A day is a button with a full, specific name; the selected and the
    // current day say so in the name, not only by color.
    await expect(
      canvas.getByRole("button", {
        name: "Hoje, quinta-feira, 12 de junho de 2025",
      })
    ).toHaveAttribute("aria-current", "date")
    await expect(
      canvas.getByRole("button", {
        name: "domingo, 15 de junho de 2025, selecionado",
      })
    ).toBeVisible()

    // Click a day, then move with the keyboard. Focus moves in an effect,
    // hence waitFor.
    await userEvent.click(
      canvas.getByRole("button", { name: /^segunda-feira, 16 de junho/ })
    )
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: /^segunda-feira, 16 de junho/ })
      ).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: /^segunda-feira, 23 de junho/ })
      ).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowUp}")
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: /^segunda-feira, 16 de junho/ })
      ).toHaveFocus()
    )

    // Page Down / Page Up change the month, keep the focus on a day and the
    // live region announces the new month.
    await userEvent.keyboard("{PageDown}")
    await waitFor(() => expect(mes()).toHaveTextContent(/julho.*2025/))
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: /^quarta-feira, 16 de julho/ })
      ).toHaveFocus()
    )
    await userEvent.keyboard("{PageUp}")
    await waitFor(() => expect(mes()).toHaveTextContent(/junho.*2025/))
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: /^segunda-feira, 16 de junho/ })
      ).toHaveFocus()
    )

    // The focus ring is solid, never `none`.
    const emFoco = canvas.getByRole("button", {
      name: /^segunda-feira, 16 de junho/,
    })
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: /^segunda-feira, 23 de junho/ })
      ).toHaveFocus()
    )
    const anel = getComputedStyle(
      canvas.getByRole("button", { name: /^segunda-feira, 23 de junho/ })
    ).boxShadow
    await expect(anel).not.toBe("none")
    await expect(emFoco).toBeInTheDocument()
  },
  render: () => <CalendarioDemo />,
}

export const Basico: Story = {
  name: "Básico",
  render: () => (
    <Calendar
      mode="single"
      locale={ptBR}
      today={new Date(2025, 5, 12)}
      className="rounded-lg border"
    />
  ),
}

function CalendarioIntervalo() {
  const [periodo, setPeriodo] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 16),
    to: new Date(2025, 6, 16),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={periodo?.from}
      selected={periodo}
      onSelect={setPeriodo}
      numberOfMonths={2}
      locale={ptBR}
      today={new Date(2025, 5, 12)}
      className="rounded-lg border"
    />
  )
}

export const Intervalo: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [periodo, setPeriodo] = React.useState<DateRange | undefined>({
  from: new Date(2025, 5, 16),
  to: new Date(2025, 6, 16),
})

<Calendar
  mode="range"
  defaultMonth={periodo?.from}
  selected={periodo}
  onSelect={setPeriodo}
  numberOfMonths={2}
  locale={ptBR}
  today={new Date(2025, 5, 12)}
  className="rounded-lg border"
/>`,
      },
    },
  },
  render: () => <CalendarioIntervalo />,
}

export const SeletorDeMesEAno: Story = {
  name: "Seletor de mês e ano",
  render: () => (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      locale={ptBR}
      today={new Date(2025, 5, 12)}
      className="rounded-lg border"
    />
  ),
}

function CalendarioAtalhos() {
  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 1, 12)
  )
  const [mes, setMes] = React.useState<Date>(new Date(2025, 1, 1))

  function escolher(dias: number) {
    const nova = new Date(2025, 5, 12 + dias)
    setData(nova)
    setMes(new Date(nova.getFullYear(), nova.getMonth(), 1))
  }

  return (
    <Card className="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          mode="single"
          selected={data}
          onSelect={setData}
          month={mes}
          onMonthChange={setMes}
          fixedWeeks
          locale={ptBR}
          today={new Date(2025, 5, 12)}
          className="p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => escolher(0)}
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => escolher(1)}
        >
          Amanhã
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => escolher(3)}
        >
          Em 3 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => escolher(7)}
        >
          Em uma semana
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => escolher(14)}
        >
          Em 2 semanas
        </Button>
      </CardFooter>
    </Card>
  )
}

export const Atalhos: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [data, setData] = React.useState<Date | undefined>(
  new Date(2025, 1, 12)
)
const [mes, setMes] = React.useState<Date>(new Date(2025, 1, 1))

// "Hoje" aqui é 12 de junho de 2025; no seu código, use new Date().
function escolher(dias: number) {
  const nova = new Date(2025, 5, 12 + dias)
  setData(nova)
  setMes(new Date(nova.getFullYear(), nova.getMonth(), 1))
}

<Card className="mx-auto w-fit max-w-[300px]" size="sm">
  <CardContent>
    <Calendar
      mode="single"
      selected={data}
      onSelect={setData}
      month={mes}
      onMonthChange={setMes}
      fixedWeeks
      locale={ptBR}
      today={new Date(2025, 5, 12)}
      className="p-0 [--cell-size:--spacing(9.5)]"
    />
  </CardContent>
  <CardFooter className="flex flex-wrap gap-2 border-t">
    <Button variant="outline" size="sm" className="flex-1" onClick={() => escolher(0)}>
      Hoje
    </Button>
    <Button variant="outline" size="sm" className="flex-1" onClick={() => escolher(1)}>
      Amanhã
    </Button>
    <Button variant="outline" size="sm" className="flex-1" onClick={() => escolher(3)}>
      Em 3 dias
    </Button>
    <Button variant="outline" size="sm" className="flex-1" onClick={() => escolher(7)}>
      Em uma semana
    </Button>
    <Button variant="outline" size="sm" className="flex-1" onClick={() => escolher(14)}>
      Em 2 semanas
    </Button>
  </CardFooter>
</Card>`,
      },
    },
  },
  render: () => <CalendarioAtalhos />,
}

function CalendarioComHora() {
  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 5, 16)
  )

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
          mode="single"
          selected={data}
          onSelect={setData}
          locale={ptBR}
          today={new Date(2025, 5, 12)}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="dataehora-inicio">Hora de início</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="dataehora-inicio"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon
                  aria-hidden="true"
                  className="text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="dataehora-fim">Hora de término</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="dataehora-fim"
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon
                  aria-hidden="true"
                  className="text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}

export const DataEHora: Story = {
  name: "Data e hora",
  parameters: {
    docs: {
      source: {
        code: `const [data, setData] = React.useState<Date | undefined>(
  new Date(2025, 5, 16)
)

<Card size="sm" className="mx-auto w-fit">
  <CardContent>
    <Calendar
      mode="single"
      selected={data}
      onSelect={setData}
      locale={ptBR}
      today={new Date(2025, 5, 12)}
      className="p-0"
    />
  </CardContent>
  <CardFooter className="border-t bg-card">
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="dataehora-inicio">Hora de início</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="dataehora-inicio"
            type="time"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <InputGroupAddon>
            <Clock2Icon aria-hidden="true" className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="dataehora-fim">Hora de término</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="dataehora-fim"
            type="time"
            step="1"
            defaultValue="12:30:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <InputGroupAddon>
            <Clock2Icon aria-hidden="true" className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  </CardFooter>
</Card>`,
      },
    },
  },
  render: () => <CalendarioComHora />,
}

function CalendarioReservado() {
  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 0, 6)
  )
  const reservadas = Array.from(
    { length: 15 },
    (_, i) => new Date(2025, 0, 12 + i)
  )

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={data}
          selected={data}
          onSelect={setData}
          disabled={reservadas}
          modifiers={{ reservada: reservadas }}
          modifiersClassNames={{
            reservada: "[&>button]:line-through opacity-100",
          }}
          locale={ptBR}
          today={new Date(2025, 0, 6)}
        />
      </CardContent>
    </Card>
  )
}

export const DatasReservadas: Story = {
  name: "Datas reservadas",
  parameters: {
    docs: {
      source: {
        code: `const [data, setData] = React.useState<Date | undefined>(
  new Date(2025, 0, 6)
)
const reservadas = Array.from(
  { length: 15 },
  (_, i) => new Date(2025, 0, 12 + i)
)

<Card className="mx-auto w-fit p-0">
  <CardContent className="p-0">
    <Calendar
      mode="single"
      defaultMonth={data}
      selected={data}
      onSelect={setData}
      disabled={reservadas}
      modifiers={{ reservada: reservadas }}
      modifiersClassNames={{
        reservada: "[&>button]:line-through opacity-100",
      }}
      locale={ptBR}
      today={new Date(2025, 0, 6)}
    />
  </CardContent>
</Card>`,
      },
    },
  },
  render: () => <CalendarioReservado />,
}

function CalendarioTamanhoDaCelula() {
  const [periodo, setPeriodo] = React.useState<DateRange | undefined>({
    from: new Date(2025, 11, 8),
    to: new Date(2025, 11, 18),
  })

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={periodo?.from}
          selected={periodo}
          onSelect={setPeriodo}
          numberOfMonths={1}
          captionLayout="dropdown"
          locale={ptBR}
          today={new Date(2025, 11, 1)}
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date) =>
              date.toLocaleString("pt-BR", { month: "long" }),
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const fimDeSemana =
                day.date.getDay() === 0 || day.date.getDay() === 6
              const preco = fimDeSemana ? "R$ 120" : "R$ 100"

              return (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  locale={ptBR}
                  {...props}
                  data-price={modifiers.outside ? undefined : preco}
                  className="data-price:after:text-xs data-price:after:content-[attr(data-price)]"
                  aria-label={
                    modifiers.outside
                      ? props["aria-label"]
                      : `${props["aria-label"]}, ${preco}`
                  }
                >
                  {children}
                </CalendarDayButton>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

export const TamanhoDaCelula: Story = {
  name: "Tamanho da célula",
  parameters: {
    docs: {
      source: {
        code: `const [periodo, setPeriodo] = React.useState<DateRange | undefined>({
  from: new Date(2025, 11, 8),
  to: new Date(2025, 11, 18),
})

<Card className="mx-auto w-fit p-0">
  <CardContent className="p-0">
    <Calendar
      mode="range"
      defaultMonth={periodo?.from}
      selected={periodo}
      onSelect={setPeriodo}
      numberOfMonths={1}
      captionLayout="dropdown"
      locale={ptBR}
      today={new Date(2025, 11, 1)}
      className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("pt-BR", { month: "long" }),
      }}
      components={{
        DayButton: ({ children, modifiers, day, ...props }) => {
          const fimDeSemana = day.date.getDay() === 0 || day.date.getDay() === 6
          const preco = fimDeSemana ? "R$ 120" : "R$ 100"

          return (
            <CalendarDayButton
              day={day}
              modifiers={modifiers}
              locale={ptBR}
              {...props}
              data-price={modifiers.outside ? undefined : preco}
              className="data-price:after:text-xs data-price:after:content-[attr(data-price)]"
              aria-label={
                modifiers.outside
                  ? props["aria-label"]
                  : \`\${props["aria-label"]}, \${preco}\`
              }
            >
              {children}
            </CalendarDayButton>
          )
        },
      }}
    />
  </CardContent>
</Card>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // The price is drawn by CSS (axe cannot see it, and it is not in the DOM
    // text): check that it renders and that the name carries it.
    const canvas = within(canvasElement)
    const dia = await canvas.findByRole("button", {
      name: "sábado, 13 de dezembro de 2025, selecionado, R$ 120",
    })
    await expect(getComputedStyle(dia, "::after").content).toBe('"R$ 120"')
    await expect(
      getComputedStyle(
        canvas.getByRole("button", {
          name: "terça-feira, 9 de dezembro de 2025, selecionado, R$ 100",
        }),
        "::after"
      ).content
    ).toBe('"R$ 100"')
  },
  render: () => <CalendarioTamanhoDaCelula />,
}

function CalendarioSemanas() {
  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 0, 12)
  )

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={data}
          selected={data}
          onSelect={setData}
          showWeekNumber
          locale={ptBR}
          today={new Date(2025, 0, 6)}
        />
      </CardContent>
    </Card>
  )
}

export const NumerosDeSemana: Story = {
  name: "Números de semana",
  parameters: {
    docs: {
      source: {
        code: `const [data, setData] = React.useState<Date | undefined>(
  new Date(2025, 0, 12)
)

<Card className="mx-auto w-fit p-0">
  <CardContent className="p-0">
    <Calendar
      mode="single"
      defaultMonth={data}
      selected={data}
      onSelect={setData}
      showWeekNumber
      locale={ptBR}
      today={new Date(2025, 0, 6)}
    />
  </CardContent>
</Card>`,
      },
    },
  },
  render: () => <CalendarioSemanas />,
}

function CalendarioRtl() {
  const [data, setData] = React.useState<Date | undefined>(
    new Date(2025, 5, 15)
  )

  return (
    <Calendar
      mode="single"
      selected={data}
      onSelect={setData}
      className="rounded-lg border [--cell-size:--spacing(9)]"
      captionLayout="dropdown"
      dir="rtl"
      locale={arSA}
      today={new Date(2025, 5, 12)}
    />
  )
}

export const Rtl: Story = {
  name: "RTL",
  parameters: {
    docs: {
      source: {
        code: `const [data, setData] = React.useState<Date | undefined>(
  new Date(2025, 5, 15)
)

<DirectionProvider direction="rtl">
  <div dir="rtl" lang="ar">
    <Calendar
      mode="single"
      selected={data}
      onSelect={setData}
      className="rounded-lg border [--cell-size:--spacing(9)]"
      captionLayout="dropdown"
      dir="rtl"
      locale={arSA}
      today={new Date(2025, 5, 12)}
    />
  </div>
</DirectionProvider>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    // In RTL the arrows follow the reading direction: "right" goes to the
    // previous day. The cell carries the ISO date in `data-day`.
    const selecionado = canvasElement.querySelector<HTMLElement>(
      '[aria-selected="true"] button'
    )!
    await userEvent.click(selecionado)
    const diaEmFoco = () =>
      document.activeElement?.closest("td")?.getAttribute("data-day")
    await waitFor(() => expect(diaEmFoco()).toBe("2025-06-15"))
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(diaEmFoco()).toBe("2025-06-14"))
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(diaEmFoco()).toBe("2025-06-15"))
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <CalendarioRtl />
      </div>
    </DirectionProvider>
  ),
}
