import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

/*
 * One story per section of chart.mdx, in the order of the shadcn/ui page.
 * The shadcn examples are in English with a fixed palette: these use the
 * Portuguese months and the system's own `--chart-*` tokens.
 *
 * Every chart is a `figure` named by its `figcaption` (title + description)
 * and its `svg` gets `title`/`desc` from Recharts, plus the keyboard layer
 * (`accessibilityLayer`). Two series use `--chart-1` and `--chart-4`, far
 * apart in each mode: neighbouring steps (500 and 600) are hard to tell
 * apart. Each ChartContainer has a fixed height and a unique `id`
 * (`data-chart` carries it, and the Docs page renders every story at once).
 *
 * Recharts draws on the first measure and animates the bars in, so every
 * `play` waits for the bars and for the animation to end before axe runs.
 * "Opções de configuração" and "Tema" have no preview on the shadcn page
 * and live in the MDX as snippets.
 */
const meta = {
  title: "Componentes/Chart",
  component: ChartContainer,
} satisfies Meta

export default meta
// Sem `typeof meta`: o `config` do ChartContainer é obrigatório e as stories
// não usam `args` (cada uma escreve o JSX completo).
type Story = StoryObj

async function graficoPronto(canvasElement: HTMLElement, barras: number) {
  await waitFor(() =>
    expect(
      canvasElement.querySelectorAll(".recharts-bar-rectangle path").length
    ).toBeGreaterThanOrEqual(barras)
  )
  // The bars must be painted with the token color, not the default black.
  const barra = canvasElement.querySelector(".recharts-bar-rectangle path")!
  const cor = getComputedStyle(barra).fill
  await expect(cor).not.toBe("rgb(0, 0, 0)")
  await expect(cor).not.toBe("none")
  // Wait for the bars' enter animation.
  await new Promise((resolve) => setTimeout(resolve, 900))
}

function superficie(canvasElement: HTMLElement) {
  return canvasElement.querySelector<SVGElement>("svg.recharts-surface")!
}

const dadosInterativo = [
  { data: "2026-10-01", desktop: 222, celular: 150 },
  { data: "2026-10-02", desktop: 97, celular: 180 },
  { data: "2026-10-03", desktop: 167, celular: 120 },
  { data: "2026-10-04", desktop: 242, celular: 260 },
  { data: "2026-10-05", desktop: 373, celular: 290 },
  { data: "2026-10-06", desktop: 301, celular: 340 },
  { data: "2026-10-07", desktop: 245, celular: 180 },
  { data: "2026-10-08", desktop: 409, celular: 320 },
  { data: "2026-10-09", desktop: 59, celular: 110 },
  { data: "2026-10-10", desktop: 261, celular: 190 },
  { data: "2026-10-11", desktop: 327, celular: 350 },
  { data: "2026-10-12", desktop: 292, celular: 210 },
]

function GraficoInterativo() {
  const [ativo, setAtivo] = React.useState<"desktop" | "celular">("desktop")
  const config = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    celular: { label: "Celular", color: "var(--chart-4)" },
  }
  const total = {
    desktop: dadosInterativo.reduce((soma, dia) => soma + dia.desktop, 0),
    celular: dadosInterativo.reduce((soma, dia) => soma + dia.celular, 0),
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          <h3>Visitantes por dia</h3>
        </CardTitle>
        <CardDescription role="status">
          Mostrando os visitantes de {config[ativo].label.toLowerCase()} nos
          primeiros 12 dias de outubro.
        </CardDescription>
        <div className="flex gap-2 pt-2" role="group" aria-label="Série exibida">
          {(["desktop", "celular"] as const).map((chave) => (
            <Button
              key={chave}
              variant={ativo === chave ? "default" : "outline"}
              aria-pressed={ativo === chave}
              onClick={() => setAtivo(chave)}
            >
              {config[chave].label}: {total[chave].toLocaleString("pt-BR")}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ChartContainer
          id="demo"
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            title="Visitantes por dia"
            desc="Gráfico de barras com os visitantes de cada um dos primeiros 12 dias de outubro."
            data={dadosInterativo}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="data"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(valor) =>
                new Date(`${valor}T12:00:00`).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey={ativo}
                  labelFormatter={(valor) =>
                    new Date(`${valor}T12:00:00`).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey={ativo} fill={`var(--color-${ativo})`} radius={4} />
          </BarChart>
        </ChartContainer>
        <details>
          <summary className="w-fit cursor-pointer rounded-md text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            Ver os dados em tabela
          </summary>
          <Table className="mt-2">
            <TableCaption>Visitantes por dia, de 1 a 12 de outubro</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Desktop</TableHead>
                <TableHead>Celular</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosInterativo.map((dia) => (
                <TableRow key={dia.data}>
                  <TableCell>
                    {new Date(`${dia.data}T12:00:00`).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TableCell>
                  <TableCell>{dia.desktop}</TableCell>
                  <TableCell>{dia.celular}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </details>
      </CardContent>
    </Card>
  )
}

export const Demo: Story = {
  parameters: {
    docs: {
      source: {
        code: `const dados = [
  { data: "2026-10-01", desktop: 222, celular: 150 },
  { data: "2026-10-02", desktop: 97, celular: 180 },
  { data: "2026-10-03", desktop: 167, celular: 120 },
  { data: "2026-10-04", desktop: 242, celular: 260 },
  { data: "2026-10-05", desktop: 373, celular: 290 },
  { data: "2026-10-06", desktop: 301, celular: 340 },
  { data: "2026-10-07", desktop: 245, celular: 180 },
  { data: "2026-10-08", desktop: 409, celular: 320 },
  { data: "2026-10-09", desktop: 59, celular: 110 },
  { data: "2026-10-10", desktop: 261, celular: 190 },
  { data: "2026-10-11", desktop: 327, celular: 350 },
  { data: "2026-10-12", desktop: 292, celular: 210 },
]

const [ativo, setAtivo] = React.useState<"desktop" | "celular">("desktop")
const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  celular: { label: "Celular", color: "var(--chart-4)" },
}
const total = {
  desktop: dados.reduce((soma, dia) => soma + dia.desktop, 0),
  celular: dados.reduce((soma, dia) => soma + dia.celular, 0),
}


<Card className="w-full max-w-2xl">
  <CardHeader>
    <CardTitle>
      <h3>Visitantes por dia</h3>
    </CardTitle>
    <CardDescription role="status">
      Mostrando os visitantes de {config[ativo].label.toLowerCase()} nos
      primeiros 12 dias de outubro.
    </CardDescription>
    <div className="flex gap-2 pt-2" role="group" aria-label="Série exibida">
      {(["desktop", "celular"] as const).map((chave) => (
        <Button
          key={chave}
          variant={ativo === chave ? "default" : "outline"}
          aria-pressed={ativo === chave}
          onClick={() => setAtivo(chave)}
        >
          {config[chave].label}: {total[chave].toLocaleString("pt-BR")}
        </Button>
      ))}
    </div>
  </CardHeader>
  <CardContent className="grid gap-4">
    <ChartContainer
      id="demo"
      config={config}
      className="aspect-auto h-[250px] w-full"
    >
      <BarChart
        accessibilityLayer
        title="Visitantes por dia"
        desc="Gráfico de barras com os visitantes de cada um dos primeiros 12 dias de outubro."
        data={dados}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="data"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(valor) =>
            new Date(\`\${valor}T12:00:00\`).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
            })
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[160px]"
              nameKey={ativo}
              labelFormatter={(valor) =>
                new Date(\`\${valor}T12:00:00\`).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }
            />
          }
        />
        <Bar dataKey={ativo} fill={\`var(--color-\${ativo})\`} radius={4} />
      </BarChart>
    </ChartContainer>
    <details>
      <summary className="w-fit cursor-pointer rounded-md text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Ver os dados em tabela
      </summary>
      <Table className="mt-2">
        <TableCaption>Visitantes por dia, de 1 a 12 de outubro</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Dia</TableHead>
            <TableHead>Desktop</TableHead>
            <TableHead>Celular</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((dia) => (
            <TableRow key={dia.data}>
              <TableCell>
                {new Date(\`\${dia.data}T12:00:00\`).toLocaleDateString(
                  "pt-BR"
                )}
              </TableCell>
              <TableCell>{dia.desktop}</TableCell>
              <TableCell>{dia.celular}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </details>
  </CardContent>
</Card>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await graficoPronto(canvasElement, 12)
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "visitantes de desktop"
    )

    // The toggle buttons expose their state and swap the series.
    const desktop = canvas.getByRole("button", { name: /^Desktop/ })
    const celular = canvas.getByRole("button", { name: /^Celular/ })
    await expect(desktop).toHaveAttribute("aria-pressed", "true")
    await expect(celular).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(celular)
    await expect(celular).toHaveAttribute("aria-pressed", "true")
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "visitantes de celular"
    )
    await graficoPronto(canvasElement, 12)

    // The data table is the text alternative to the chart.
    await userEvent.click(canvas.getByText("Ver os dados em tabela"))
    await expect(
      canvas.getByRole("table", { name: /Visitantes por dia/ })
    ).toBeVisible()
  },
  render: () => <GraficoInterativo />,
}

export const PrimeiroGrafico: Story = {
  name: "Primeiro gráfico",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 12)
    const grafico = within(canvasElement).getByRole("figure", {
      name: "Visitantes por mês",
    })
    await expect(grafico).toBeVisible()
  },
  render: () => (
    <figure
      aria-labelledby="primeiro-titulo"
      className="grid w-full max-w-xl gap-3"
    >
      <figcaption className="grid gap-1">
        <h3 id="primeiro-titulo" className="font-medium">
          Visitantes por mês
        </h3>
        <p className="text-sm text-muted-foreground">
          De janeiro a junho, em desktop e em celular.
        </p>
      </figcaption>
      <ChartContainer
        id="primeiro"
        config={{
          desktop: { label: "Desktop", color: "var(--chart-1)" },
          celular: { label: "Celular", color: "var(--chart-4)" },
        }}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          title="Visitantes por mês"
          desc="Gráfico de barras com os visitantes de desktop e de celular, de janeiro a junho."
          data={[
            { mes: "Janeiro", desktop: 186, celular: 80 },
            { mes: "Fevereiro", desktop: 305, celular: 200 },
            { mes: "Março", desktop: 237, celular: 120 },
            { mes: "Abril", desktop: 73, celular: 190 },
            { mes: "Maio", desktop: 209, celular: 130 },
            { mes: "Junho", desktop: 214, celular: 140 },
          ]}
        >
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="celular" fill="var(--color-celular)" radius={4} />
        </BarChart>
      </ChartContainer>
    </figure>
  ),
}

export const Grade: Story = {
  name: "Grade",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 12)
    await expect(
      canvasElement.querySelectorAll(".recharts-cartesian-grid-horizontal line")
        .length
    ).toBeGreaterThan(0)
  },
  render: () => (
    <figure
      aria-labelledby="grade-titulo"
      className="grid w-full max-w-xl gap-3"
    >
      <figcaption className="grid gap-1">
        <h3 id="grade-titulo" className="font-medium">
          Visitantes por mês, com grade
        </h3>
        <p className="text-sm text-muted-foreground">
          As linhas horizontais ajudam a ler os valores.
        </p>
      </figcaption>
      <ChartContainer
        id="grade"
        config={{
          desktop: { label: "Desktop", color: "var(--chart-1)" },
          celular: { label: "Celular", color: "var(--chart-4)" },
        }}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          title="Visitantes por mês, com grade"
          desc="Gráfico de barras com grade horizontal, com os visitantes de desktop e de celular, de janeiro a junho."
          data={[
            { mes: "Janeiro", desktop: 186, celular: 80 },
            { mes: "Fevereiro", desktop: 305, celular: 200 },
            { mes: "Março", desktop: 237, celular: 120 },
            { mes: "Abril", desktop: 73, celular: 190 },
            { mes: "Maio", desktop: 209, celular: 130 },
            { mes: "Junho", desktop: 214, celular: 140 },
          ]}
        >
          <CartesianGrid vertical={false} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="celular" fill="var(--color-celular)" radius={4} />
        </BarChart>
      </ChartContainer>
    </figure>
  ),
}

export const Eixo: Story = {
  name: "Eixo",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 12)
    // The month names are the x axis ticks (abbreviated to 3 letters).
    await expect(
      canvasElement.querySelector(".recharts-cartesian-axis-tick-value")!
        .textContent
    ).toBe("Jan")
  },
  render: () => (
    <figure
      aria-labelledby="eixo-titulo"
      className="grid w-full max-w-xl gap-3"
    >
      <figcaption className="grid gap-1">
        <h3 id="eixo-titulo" className="font-medium">
          Visitantes por mês, com eixo
        </h3>
        <p className="text-sm text-muted-foreground">
          O eixo X mostra o mês abreviado.
        </p>
      </figcaption>
      <ChartContainer
        id="eixo"
        config={{
          desktop: { label: "Desktop", color: "var(--chart-1)" },
          celular: { label: "Celular", color: "var(--chart-4)" },
        }}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          title="Visitantes por mês, com eixo"
          desc="Gráfico de barras com os meses no eixo horizontal, com os visitantes de desktop e de celular, de janeiro a junho."
          data={[
            { mes: "Janeiro", desktop: 186, celular: 80 },
            { mes: "Fevereiro", desktop: 305, celular: 200 },
            { mes: "Março", desktop: 237, celular: 120 },
            { mes: "Abril", desktop: 73, celular: 190 },
            { mes: "Maio", desktop: 209, celular: 130 },
            { mes: "Junho", desktop: 214, celular: 140 },
          ]}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="mes"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(valor) => valor.slice(0, 3)}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="celular" fill="var(--color-celular)" radius={4} />
        </BarChart>
      </ChartContainer>
    </figure>
  ),
}

export const Tooltip: Story = {
  name: "Tooltip",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 12)

    // The tooltip is invisible until the chart is active: hovering the chart
    // opens it, and its text (label, series names, values) is what axe checks.
    const canvas = within(canvasElement)
    const area = superficie(canvasElement).getBoundingClientRect()
    await userEvent.pointer({
      target: superficie(canvasElement),
      coords: {
        clientX: area.left + area.width * 0.3,
        clientY: area.top + area.height * 0.4,
      },
    })
    await waitFor(async () => {
      await expect(canvas.getByText("Desktop")).toBeVisible()
    })
    await expect(canvas.getByText("Celular")).toBeVisible()
    await new Promise((resolve) => setTimeout(resolve, 600))
  },
  render: () => (
    <figure
      aria-labelledby="tooltip-titulo"
      className="grid w-full max-w-xl gap-3"
    >
      <figcaption className="grid gap-1">
        <h3 id="tooltip-titulo" className="font-medium">
          Visitantes por mês, com tooltip
        </h3>
        <p className="text-sm text-muted-foreground">
          Passe o mouse numa barra, ou use as setas com o gráfico em foco.
        </p>
      </figcaption>
      <ChartContainer
        id="tooltip"
        config={{
          desktop: { label: "Desktop", color: "var(--chart-1)" },
          celular: { label: "Celular", color: "var(--chart-4)" },
        }}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          title="Visitantes por mês, com tooltip"
          desc="Gráfico de barras com os visitantes de desktop e de celular, de janeiro a junho. Ao passar o mouse ou usar as setas, um tooltip mostra os valores do mês."
          data={[
            { mes: "Janeiro", desktop: 186, celular: 80 },
            { mes: "Fevereiro", desktop: 305, celular: 200 },
            { mes: "Março", desktop: 237, celular: 120 },
            { mes: "Abril", desktop: 73, celular: 190 },
            { mes: "Maio", desktop: 209, celular: 130 },
            { mes: "Junho", desktop: 214, celular: 140 },
          ]}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="mes"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(valor) => valor.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="celular" fill="var(--color-celular)" radius={4} />
        </BarChart>
      </ChartContainer>
    </figure>
  ),
}

export const Legenda: Story = {
  name: "Legenda",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 12)
    // The legend names each series in text, so the color is not the only cue.
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Desktop")).toBeVisible()
    await expect(canvas.getByText("Celular")).toBeVisible()
  },
  render: () => (
    <figure
      aria-labelledby="legenda-titulo"
      className="grid w-full max-w-xl gap-3"
    >
      <figcaption className="grid gap-1">
        <h3 id="legenda-titulo" className="font-medium">
          Visitantes por mês, com legenda
        </h3>
        <p className="text-sm text-muted-foreground">
          A legenda diz o nome de cada série, além da cor.
        </p>
      </figcaption>
      <ChartContainer
        id="legenda"
        config={{
          desktop: { label: "Desktop", color: "var(--chart-1)" },
          celular: { label: "Celular", color: "var(--chart-4)" },
        }}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          title="Visitantes por mês, com legenda"
          desc="Gráfico de barras com os visitantes de desktop e de celular, de janeiro a junho, com legenda."
          data={[
            { mes: "Janeiro", desktop: 186, celular: 80 },
            { mes: "Fevereiro", desktop: 305, celular: 200 },
            { mes: "Março", desktop: 237, celular: 120 },
            { mes: "Abril", desktop: 73, celular: 190 },
            { mes: "Maio", desktop: 209, celular: 130 },
            { mes: "Junho", desktop: 214, celular: 140 },
          ]}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="mes"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(valor) => valor.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="celular" fill="var(--color-celular)" radius={4} />
        </BarChart>
      </ChartContainer>
    </figure>
  ),
}

export const Indicador: Story = {
  name: "Indicador do tooltip",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 6)
    // `defaultIndex` keeps one tooltip open in each chart, so the three
    // indicators (and their text) are on screen for axe.
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getAllByText("Fevereiro")).toHaveLength(3))
    await new Promise((resolve) => setTimeout(resolve, 400))
  },
  render: () => (
    <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      <figure aria-labelledby="indicador-ponto-titulo" className="grid gap-2">
        <figcaption>
          <h3 id="indicador-ponto-titulo" className="text-sm font-medium">
            indicator=&quot;dot&quot;
          </h3>
        </figcaption>
        <ChartContainer
          id="indicador-ponto"
          config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}
          className="aspect-auto h-[160px] w-full"
        >
          <BarChart
            accessibilityLayer
            title="Indicador de ponto"
            desc="Gráfico de barras de desktop, com o tooltip aberto no mês de fevereiro e o indicador em ponto."
            data={[
              { mes: "Janeiro", desktop: 186 },
              { mes: "Fevereiro", desktop: 305 },
              { mes: "Março", desktop: 237 },
            ]}
          >
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(valor) => valor.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={1}
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </figure>
      <figure aria-labelledby="indicador-linha-titulo" className="grid gap-2">
        <figcaption>
          <h3 id="indicador-linha-titulo" className="text-sm font-medium">
            indicator=&quot;line&quot;
          </h3>
        </figcaption>
        <ChartContainer
          id="indicador-linha"
          config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}
          className="aspect-auto h-[160px] w-full"
        >
          <BarChart
            accessibilityLayer
            title="Indicador de linha"
            desc="Gráfico de barras de desktop, com o tooltip aberto no mês de fevereiro e o indicador em linha."
            data={[
              { mes: "Janeiro", desktop: 186 },
              { mes: "Fevereiro", desktop: 305 },
              { mes: "Março", desktop: 237 },
            ]}
          >
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(valor) => valor.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={1}
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </figure>
      <figure aria-labelledby="indicador-tracejado-titulo" className="grid gap-2">
        <figcaption>
          <h3 id="indicador-tracejado-titulo" className="text-sm font-medium">
            indicator=&quot;dashed&quot;
          </h3>
        </figcaption>
        <ChartContainer
          id="indicador-tracejado"
          config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}
          className="aspect-auto h-[160px] w-full"
        >
          <BarChart
            accessibilityLayer
            title="Indicador tracejado"
            desc="Gráfico de barras de desktop, com o tooltip aberto no mês de fevereiro e o indicador tracejado."
            data={[
              { mes: "Janeiro", desktop: 186 },
              { mes: "Fevereiro", desktop: 305 },
              { mes: "Março", desktop: 237 },
            ]}
          >
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(valor) => valor.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={1}
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </figure>
    </div>
  ),
}

export const Acessibilidade: Story = {
  name: "Acessibilidade",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(".recharts-line-dots circle").length
      ).toBeGreaterThanOrEqual(6)
    )
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // The `accessibilityLayer` makes the chart focusable, named by title/desc.
    const svg = superficie(canvasElement)
    await expect(svg).toHaveAttribute("tabindex", "0")
    await expect(svg).toHaveAccessibleName("Visitantes por mês")

    // Keyboard only: Tab reaches the chart and the arrows open the tooltip.
    for (let i = 0; i < 5 && document.activeElement !== svg; i++) {
      await userEvent.tab()
    }
    await expect(svg).toHaveFocus()
    // The focused chart shows the solid ring (not the registry's outline-hidden).
    await expect(getComputedStyle(svg).boxShadow).not.toBe("none")
    await userEvent.keyboard("{ArrowRight}")
    const tooltip = canvasElement.querySelector<HTMLElement>(
      ".recharts-tooltip-wrapper"
    )!
    await waitFor(async () => {
      await expect(within(tooltip).getByText("Desktop")).toBeVisible()
    })

    // The same data as a table, for screen readers.
    await expect(
      canvas.getByRole("table", { name: "Visitantes por mês" })
    ).toBeInTheDocument()
  },
  render: () => (
    <figure
      aria-labelledby="acessibilidade-titulo"
      className="grid w-full max-w-xl gap-3"
    >
      <figcaption className="grid gap-1">
        <h3 id="acessibilidade-titulo" className="font-medium">
          Visitantes por mês
        </h3>
        <p className="text-sm text-muted-foreground">
          Use Tab para entrar no gráfico e as setas para percorrer os meses.
        </p>
      </figcaption>
      <ChartContainer
        id="acessibilidade"
        config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}
        className="aspect-auto h-[250px] w-full"
      >
        <LineChart
          accessibilityLayer
          title="Visitantes por mês"
          desc="Gráfico de linha com os visitantes de desktop, de janeiro a junho. Os mesmos dados estão na tabela abaixo."
          data={[
            { mes: "Janeiro", desktop: 186 },
            { mes: "Fevereiro", desktop: 305 },
            { mes: "Março", desktop: 237 },
            { mes: "Abril", desktop: 73 },
            { mes: "Maio", desktop: 209 },
            { mes: "Junho", desktop: 214 },
          ]}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="mes"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(valor) => valor.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{ fill: "var(--color-desktop)" }}
          />
        </LineChart>
      </ChartContainer>
      <table className="sr-only">
        <caption>Visitantes por mês</caption>
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Desktop</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Janeiro</th>
            <td>186</td>
          </tr>
          <tr>
            <th scope="row">Fevereiro</th>
            <td>305</td>
          </tr>
          <tr>
            <th scope="row">Março</th>
            <td>237</td>
          </tr>
          <tr>
            <th scope="row">Abril</th>
            <td>73</td>
          </tr>
          <tr>
            <th scope="row">Maio</th>
            <td>209</td>
          </tr>
          <tr>
            <th scope="row">Junho</th>
            <td>214</td>
          </tr>
        </tbody>
      </table>
    </figure>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await graficoPronto(canvasElement, 12)
    const canvas = within(canvasElement)
    await expect(canvas.getByText("سطح المكتب")).toBeVisible()
    await expect(canvas.getByText("الجوال")).toBeVisible()

    // The x axis is reversed: January (first) is at the right edge.
    const barras = canvasElement.querySelectorAll(
      ".recharts-bar-rectangle path"
    )
    const primeira = barras[0].getBoundingClientRect()
    const ultima = barras[10].getBoundingClientRect()
    await expect(primeira.left).toBeGreaterThan(ultima.left)
  },
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <figure
          aria-labelledby="rtl-titulo"
          className="grid w-full max-w-xl gap-3"
        >
          <figcaption className="grid gap-1">
            <h3 id="rtl-titulo" className="font-medium">
              الزوار الشهريون
            </h3>
            <p className="text-sm text-muted-foreground">
              من يناير إلى يونيو: سطح المكتب والجوال
            </p>
          </figcaption>
          <ChartContainer
            id="rtl"
            config={{
              desktop: { label: "سطح المكتب", color: "var(--chart-1)" },
              celular: { label: "الجوال", color: "var(--chart-4)" },
            }}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              title="الزوار الشهريون"
              desc="مخطط أعمدة لزوار سطح المكتب والجوال من يناير إلى يونيو"
              data={[
                { mes: "يناير", desktop: 186, celular: 80 },
                { mes: "فبراير", desktop: 305, celular: 200 },
                { mes: "مارس", desktop: 237, celular: 120 },
                { mes: "أبريل", desktop: 73, celular: 190 },
                { mes: "مايو", desktop: 209, celular: 130 },
                { mes: "يونيو", desktop: 214, celular: 140 },
              ]}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                reversed
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="celular" fill="var(--color-celular)" radius={4} />
            </BarChart>
          </ChartContainer>
        </figure>
      </div>
    </DirectionProvider>
  ),
}
