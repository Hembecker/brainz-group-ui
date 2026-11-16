"use client"

import * as React from "react"
import { cn } from "cn"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@workspace/ui/components/button"
import { useDirection } from "@workspace/ui/components/direction"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react"

/*
 * Calendar — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/calendar
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o React DayPicker 10 (`react-day-picker`, com o
 *   `date-fns` por baixo): a API é a dele (`mode`, `selected`, `onSelect`,
 *   `numberOfMonths`, `captionLayout`, `disabled`, `modifiers`, `locale`,
 *   `dir`…). O Calendar só troca as classes e o botão do dia.
 * - Idioma: passe `locale` com o `ptBR` de `react-day-picker/locale` (é o
 *   `ptBR` do date-fns mais as traduções dos rótulos de acessibilidade:
 *   "Ir para o próximo mês", "Hoje, …", "…, selecionado"). Com o `ptBR` do
 *   próprio date-fns, os nomes dos controles ficam em inglês. Em RTL use também um
 *   locale como o `arSA`; o `dir` é opcional (veja RTL abaixo).
 * - Teclado (do DayPicker): setas movem o foco entre os dias, Page Up/Down
 *   mudam o mês, Shift + Page Up/Down mudam o ano, Home/End vão ao início e
 *   ao fim da semana. O rótulo do mês é uma região viva (`role="status"`,
 *   `aria-live="polite"`) que o DayPicker mantém montada: o leitor de tela
 *   anuncia o mês novo.
 * - Estados do dia, todos com papel cheio: selecionado `primary` com
 *   `primary-foreground` (5,2:1 no claro e 3,8:1 contra o fundo no escuro,
 *   acima dos 3:1 de um controle); hoje `muted` com `foreground`; fora do mês
 *   `muted-foreground` (no botão, porque a variante ghost fixa o `text-foreground`) (7,4:1 no branco, 6,6:1 sobre `muted`); intervalo
 *   `muted`. No escuro, as pontas do intervalo e o dia de hoje selecionado
 *   (que fica sobre o `muted` de hoje) ganham uma borda de 2px na cor do
 *   fundo: sem ela, a primária tinha só 2,8:1 contra a faixa; com ela, 3,8:1.
 *   A faixa não escurece porque, no escuro, `card` e `popover` são a mesma
 *   mist 900 e ela sumiria num Date Picker. O dia de hoje também leva `aria-current="date"` (acrescentado aqui, o
 *   DayPicker não põe) e "Hoje" no nome.
 * - Anel de foco do dia e dos botões de mês: o sólido de sempre (3px, `ring`,
 *   afastado 2px pela cor do fundo). No seletor de mês e ano (`captionLayout`
 *   "dropdown"), o `<select>` é invisível e o anel aparece no contêiner
 *   (`has-focus-visible`).
 * - Opacidade: o `opacity-70` do texto auxiliar do dia (`[&>span]`) saiu, porque
 *   sobre o `primary` e o `muted` derrubava o contraste. `disabled` mantém o
 *   `opacity-50` do registro (texto desabilitado é isento de contraste).
 * - O botão do dia recebe o `ref` que o efeito de foco usa (`modifiers.focused`).
 *   O registro cria o `ref` mas não o liga ao botão: ao trocar de mês com Page
 *   Up/Down, o foco ia para o `body`.
 * - Número da semana: é um `<th scope="row">`, como no DayPicker (o registro usa
 *   `<td>` com `scope`, o que o axe reprova, e vaza a prop `week` no DOM).
 * - RTL: o `dir` vem da prop ou, sem ela, do `DirectionProvider` quando ele é
 *   `rtl` (com `ltr` ou sem provedor, o atributo não é escrito e o calendário
 *   herda o `dir` do ancestral, como no registro). É o `dir` que o DayPicker
 *   usa para inverter as setas do teclado (a seta para a direita vai ao dia
 *   anterior); o registro só olhava a prop. As setas dos botões de mês giram
 *   por CSS (`rtl:rotate-180` no ícone e as regras na raiz): o `Nav` padrão do
 *   DayPicker sempre manda "left" e "right".
 * - Cantos e posições lógicos (`rounded-s/e`, `after:end-0`).
 */

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  dir,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  const direction = useDirection()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-3 [--cell-radius:var(--radius-2xl)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      dir={dir ?? (direction === "rtl" ? "rtl" : undefined)}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius) has-focus-visible:ring-3 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-s-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-e-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4 rtl:rotate-180", className)}
                {...props}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4 rtl:rotate-180", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        // `week` é um objeto do DayPicker: não pode ir para o DOM.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        WeekNumber: ({ children, week, ...props }) => {
          return (
            <th {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center font-normal">
                {children}
              </div>
            </th>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      aria-current={modifiers.today ? "date" : undefined}
      data-outside={modifiers.outside && !modifiers.selected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring group-data-[focused=true]/day:ring-offset-2 group-data-[focused=true]/day:ring-offset-background data-[outside=true]:text-muted-foreground data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-e-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-s-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground dark:data-[range-end=true]:border-2 dark:data-[range-end=true]:border-background dark:data-[range-start=true]:border-2 dark:data-[range-start=true]:border-background dark:data-[selected-single=true]:aria-[current=date]:border-2 dark:data-[selected-single=true]:aria-[current=date]:border-background [&>span]:text-xs",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
