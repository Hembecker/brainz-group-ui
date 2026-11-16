/*
 * Amostras da página Tipografia. Tudo usa `font-sans`, que aponta para
 * --bb-font-sans: a fonte troca junto com a marca da barra de ferramentas.
 * As classes ficam escritas por inteiro nos dados, porque o Tailwind só gera
 * as classes que aparecem literalmente no código.
 */
import { brands, type BrandId } from "@workspace/ui/brand/brands"
import { FieldDescription } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { DocsSurface } from "./color-scale"
import { ScrollTable } from "./token-table"
import { parseThemeKey, useCssVariables } from "./use-theme"

const fontNames = ["--bb-font-sans"] as const

/** Pangrama em português (usa todas as letras). */
const PANGRAM = "Jovem craque belga prediz falhas no xote."

/** A pilha de fontes declarada pela marca ativa. */
export function FontFamilyCard() {
  const { key, values } = useCssVariables(fontNames)
  const { brand } = parseThemeKey(key)
  const definition = brand in brands ? brands[brand as BrandId] : brands.brainz
  const stack = values["--bb-font-sans"] ?? ""
  return (
    // minmax(0, 1fr): the track may shrink below the min-content width of
    // the samples, so the card fits a 320px viewport and the text wraps.
    <DocsSurface className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Marca ativa: <strong className="font-medium text-foreground">{definition.name}</strong>
      </p>
      <p className="text-3xl leading-tight font-semibold tracking-tight">{PANGRAM}</p>
      <p className="text-base wrap-anywhere">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 áéíóú ãõ ç
      </p>
      <dl className="grid gap-1 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-4">
        <dt className="font-medium">--bb-font-sans</dt>
        <dd>
          <code className="font-mono text-xs break-all text-muted-foreground">
            {stack || "…"}
          </code>
        </dd>
      </dl>
      <p className="text-xs text-muted-foreground">
        É a pilha declarada: o navegador usa a primeira família disponível nela.
      </p>
    </DocsSurface>
  )
}

const weights = [
  {
    className: "font-normal",
    value: "400",
    name: "Regular",
    usage: "Corpo de texto, descrições (FieldDescription).",
    sample: "font-normal",
  },
  {
    className: "font-medium",
    value: "500",
    name: "Medium",
    usage: "Rótulos, botões, títulos de Card e Dialog (o mais usado).",
    sample: "font-medium",
  },
  {
    className: "font-semibold",
    value: "600",
    name: "Semibold",
    usage: "Título do Questionnaire; h2 a h4 de página.",
    sample: "font-semibold",
  },
  {
    className: "font-bold",
    value: "700",
    name: "Bold",
    usage: "Título dos blocos de login e cadastro (text-2xl font-bold).",
    sample: "font-bold",
  },
] as const

export function WeightSpecimen() {
  return (
    <DocsSurface className="p-0 sm:p-0">
      <ul className="divide-y divide-border">
        {weights.map((weight) => (
          <li
            key={weight.value}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-4"
          >
            <span className="text-sm text-muted-foreground">
              {weight.value} · {weight.name}
            </span>
            <span className="grid gap-1">
              <span className={`text-xl ${weight.className}`}>{PANGRAM}</span>
              <span className="text-xs text-muted-foreground">
                <code className="font-mono">{weight.sample}</code>: {weight.usage}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </DocsSurface>
  )
}

const sizes = [
  {
    className: "text-xs",
    size: "12px (0,75rem)",
    lineHeight: "16px (1rem)",
    usage: "Usado: Badge, Kbd, legendas e metadados.",
  },
  {
    className: "text-sm",
    size: "14px (0,875rem)",
    lineHeight: "20px (1,25rem)",
    usage: "Usado: o padrão dos componentes (Button, Label, Card, Input a partir de md).",
  },
  {
    className: "text-base",
    size: "16px (1rem)",
    lineHeight: "24px (1,5rem)",
    usage:
      "Usado: títulos de Card, Dialog, Sheet e Drawer; Input e Textarea abaixo de md (text-base md:text-sm, evita o zoom do iOS).",
  },
  {
    className: "text-lg",
    size: "18px (1,125rem)",
    lineHeight: "28px (1,75rem)",
    usage: "Usado: títulos de AlertDialog e Empty.",
  },
  {
    className: "text-xl",
    size: "20px (1,25rem)",
    lineHeight: "28px (1,75rem)",
    usage: "Disponível: h4 de página, texto de destaque (lead).",
  },
  {
    className: "text-2xl",
    size: "24px (1,5rem)",
    lineHeight: "32px (2rem)",
    usage: "Disponível: h3 de página; título dos blocos de login e cadastro.",
  },
  {
    className: "text-3xl",
    size: "30px (1,875rem)",
    lineHeight: "36px (2,25rem)",
    usage: "Disponível: h2 de página.",
  },
  {
    className: "text-4xl",
    size: "36px (2,25rem)",
    lineHeight: "40px (2,5rem)",
    usage: "Disponível: h1 de página.",
  },
] as const

const th = "border-b border-border px-3 py-2 text-start font-medium whitespace-nowrap"
const td = "border-b border-border px-3 py-2 align-middle"

export function TypeScaleTable() {
  return (
    <DocsSurface className="p-0 sm:p-0">
      <ScrollTable label="Escala de tamanhos do Tailwind">
        <table className="w-full border-collapse text-sm" style={{ display: "table" }}>
          <caption className="px-3 pt-3 text-start text-sm text-muted-foreground">
            Tamanhos e alturas de linha padrão do Tailwind 4 (theme.css).
          </caption>
          <thead>
            <tr>
              <th scope="col" className={th}>
                Classe
              </th>
              <th scope="col" className={th}>
                Tamanho
              </th>
              <th scope="col" className={th}>
                Altura de linha
              </th>
              <th scope="col" className={th}>
                Amostra
              </th>
              <th scope="col" className={th}>
                Onde
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((row) => (
              <tr key={row.className}>
                <th scope="row" className={`${td} text-start font-normal`}>
                  <code className="font-mono text-xs">{row.className}</code>
                </th>
                <td className={`${td} whitespace-nowrap`}>{row.size}</td>
                <td className={`${td} whitespace-nowrap`}>{row.lineHeight}</td>
                <td className={`${td} min-w-64`}>
                  <span className={row.className}>Relatório mensal</span>
                </td>
                <td className={`${td} min-w-56 text-muted-foreground`}>{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
    </DocsSurface>
  )
}

const headings = [
  {
    tag: "h1",
    className: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
    text: "Painel de indicadores",
  },
  {
    tag: "h2",
    className: "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight",
    text: "Resumo do trimestre",
  },
  {
    tag: "h3",
    className: "scroll-m-20 text-2xl font-semibold tracking-tight",
    text: "Receita por região",
  },
  {
    tag: "h4",
    className: "scroll-m-20 text-xl font-semibold tracking-tight",
    text: "Detalhes da fatura",
  },
] as const

/**
 * Títulos de página. As amostras são parágrafos com a aparência de cada
 * nível, para não criar títulos falsos na estrutura desta página.
 */
export function HeadingSpecimen() {
  return (
    <DocsSurface className="grid gap-5">
      {headings.map((heading) => (
        <div key={heading.tag} className="grid gap-1">
          <p className={heading.className}>{heading.text}</p>
          <code className="font-mono text-xs break-all text-muted-foreground">
            {`<${heading.tag} className="${heading.className}">`}
          </code>
        </div>
      ))}
    </DocsSurface>
  )
}

/** Corpo, destaque, rótulo, texto de apoio e código, como os componentes usam. */
export function TextRolesSpecimen() {
  return (
    <DocsSurface className="grid gap-6">
      <div className="grid gap-1">
        <p className="text-xl text-muted-foreground">
          Acompanhe as metas da equipe e os resultados de cada projeto.
        </p>
        <code className="font-mono text-xs text-muted-foreground">
          Destaque (lead): text-xl text-muted-foreground
        </code>
      </div>
      <div className="grid gap-1">
        <p className="text-base leading-7">
          O relatório reúne as vendas do mês, a comparação com o mês anterior e
          as metas de cada região. Os valores são atualizados todo dia às 6h.
        </p>
        <code className="font-mono text-xs text-muted-foreground">
          Corpo: text-base leading-7 (ou text-sm, o padrão dos componentes)
        </code>
      </div>
      <div className="grid max-w-sm gap-2">
        <Label htmlFor="tipografia-email">E-mail de contato</Label>
        <Input
          id="tipografia-email"
          type="email"
          placeholder="nome@exemplo.com"
          autoComplete="off"
          aria-describedby="tipografia-email-descricao"
        />
        <FieldDescription id="tipografia-email-descricao">
          Usamos este e-mail só para avisos da conta.
        </FieldDescription>
        <code className="font-mono text-xs text-muted-foreground">
          Rótulo (Label): text-sm leading-none font-medium · Apoio (FieldDescription):
          text-sm leading-normal text-muted-foreground
        </code>
      </div>
      <div className="grid gap-1">
        <p className="text-sm text-muted-foreground">
          Atualizado há 5 minutos · 128 registros
        </p>
        <code className="font-mono text-xs text-muted-foreground">
          Texto de apoio: text-sm text-muted-foreground (claro: 7,4:1 na Brainz Group,
          5,9:1 no SESI; escuro: 8,1:1)
        </code>
      </div>
      <div className="grid gap-1">
        <p className="text-sm">
          Rode{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm font-semibold">
            npm.cmd run build
          </code>{" "}
          antes de publicar.
        </p>
        <code className="font-mono text-xs text-muted-foreground">
          Código em linha: rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm
          font-semibold
        </code>
      </div>
    </DocsSurface>
  )
}
