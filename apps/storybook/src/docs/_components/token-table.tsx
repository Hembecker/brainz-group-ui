/*
 * Tabelas de tokens da página Temas: o mapa papel → passo da escala (estático,
 * transcrito do globals.css) e a tabela ao vivo dos papéis semânticos, com o
 * valor e o contraste medidos agora, na marca e no modo ativos.
 */
import * as React from "react"

import { brands, type BrandId } from "@workspace/ui/brand/brands"
import { cn } from "@workspace/ui/lib/utils"

import { DocsSurface } from "./color-scale"
import { contrastPairs, type RoleMapping } from "./theme-data"
import {
  contrast,
  formatRatio,
  parseThemeKey,
  useResolvedTokens,
} from "./use-theme"

/**
 * Rolagem horizontal da tabela em telas estreitas, alcançável pelo teclado.
 * Só vira região focável (role="region", nome e Tab) quando a tabela de fato
 * transborda: uma tabela que cabe não ganha parada de Tab nem landmark.
 */
export function ScrollTable({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = React.useState(false)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () =>
      setOverflows(element.scrollWidth > element.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      role={overflows ? "region" : undefined}
      aria-label={overflows ? label : undefined}
      tabIndex={overflows ? 0 : undefined}
      className={cn(
        "overflow-x-auto rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {children}
    </div>
  )
}

const th =
  "border-b border-border px-3 py-2 text-start font-medium whitespace-nowrap"
const td = "border-b border-border px-3 py-2 align-top"

/** Papel → passo da escala no claro e no escuro. */
export function RoleMapTable({
  rows,
  caption,
}: {
  rows: RoleMapping[]
  caption: string
}) {
  return (
    <DocsSurface className="p-0 sm:p-0">
      <ScrollTable label={caption}>
        <table
          className="w-full border-collapse text-sm"
          style={{ display: "table" }}
        >
          <caption className="px-3 pt-3 text-start text-sm text-muted-foreground">
            {caption}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={th}>
                Papel
              </th>
              <th scope="col" className={th}>
                Claro
              </th>
              <th scope="col" className={th}>
                Escuro
              </th>
              <th scope="col" className={th}>
                Uso
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.token}>
                <th scope="row" className={cn(td, "text-start font-normal")}>
                  <code className="font-mono text-xs whitespace-nowrap">
                    {row.token}
                  </code>
                </th>
                <td className={cn(td, "whitespace-nowrap")}>{row.light}</td>
                <td className={cn(td, "whitespace-nowrap")}>{row.dark}</td>
                <td className={cn(td, "min-w-56 text-muted-foreground")}>
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
    </DocsSurface>
  )
}

const pairNames = Array.from(
  new Set(contrastPairs.flatMap((pair) => [pair.token, pair.against]))
)

/**
 * Papéis semânticos com o valor atual e o contraste medido agora. A coluna
 * "Anotado" traz os números do globals.css para a Brainz Group.
 */
export function LiveTokenTable() {
  const { key, values } = useResolvedTokens(pairNames)
  const { brand, mode } = parseThemeKey(key)
  const brandName = brand in brands ? brands[brand as BrandId].name : brand
  const background = values["--background"]?.rgba ?? undefined

  return (
    <DocsSurface className="p-0 sm:p-0">
      <ScrollTable label="Papéis semânticos com valor e contraste atuais">
        <table
          className="w-full border-collapse text-sm"
          style={{ display: "table" }}
        >
          <caption className="px-3 pt-3 text-start text-sm text-muted-foreground">
            Medido agora em {brandName}, modo{" "}
            {mode === "dark" ? "escuro" : "claro"}. “Anotado” são os números do
            globals.css para a Brainz Group (claro / escuro).
          </caption>
          <thead>
            <tr>
              <th scope="col" className={th}>
                Papel
              </th>
              <th scope="col" className={th}>
                Valor atual
              </th>
              <th scope="col" className={th}>
                Medido contra
              </th>
              <th scope="col" className={th}>
                Contraste
              </th>
              <th scope="col" className={th}>
                Mínimo
              </th>
              <th scope="col" className={th}>
                Anotado (Brainz)
              </th>
            </tr>
          </thead>
          <tbody>
            {contrastPairs.map((pair) => {
              const token = values[pair.token]
              const against = values[pair.against]
              // Token transparente (a borda do campo na Brainz Group): não há
              // limite a medir nesta marca, então não vale aprovar nem reprovar.
              const transparent = token?.rgba?.[3] === 0
              const ratio =
                token?.rgba && against?.rgba && !transparent
                  ? contrast(token.rgba, against.rgba, background)
                  : null
              const passes =
                ratio !== null && pair.min !== undefined && ratio >= pair.min
              return (
                <tr key={`${pair.token}-${pair.against}`}>
                  <th scope="row" className={cn(td, "text-start font-normal")}>
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-4 shrink-0 rounded-sm border border-border"
                        style={{ background: `var(${pair.token})` }}
                      />
                      <code className="font-mono text-xs whitespace-nowrap">
                        {pair.token}
                      </code>
                    </span>
                  </th>
                  <td className={td}>
                    <code className="font-mono text-xs whitespace-nowrap">
                      {token?.hex ?? "…"}
                    </code>
                    {token && token.raw && !token.raw.startsWith("#") ? (
                      <span className="block text-xs whitespace-nowrap text-muted-foreground">
                        {token.raw}
                      </span>
                    ) : null}
                  </td>
                  <td className={td}>
                    <code className="font-mono text-xs whitespace-nowrap">
                      {pair.against}
                    </code>
                    <span className="block text-xs text-muted-foreground">
                      {pair.label}
                    </span>
                  </td>
                  <td className={cn(td, "whitespace-nowrap")}>
                    <span className="font-medium tabular-nums">
                      {transparent
                        ? "—"
                        : ratio === null
                          ? "…"
                          : formatRatio(ratio)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {transparent
                        ? "não usado nesta marca (transparente)"
                        : ratio === null
                          ? "medindo"
                          : pair.min === undefined
                            ? (pair.status ?? "decorativo")
                            : passes
                              ? "atende"
                              : "abaixo do mínimo"}
                    </span>
                  </td>
                  <td className={cn(td, "whitespace-nowrap")}>
                    {pair.min === undefined || transparent
                      ? "—"
                      : `${String(pair.min).replace(".", ",")}:1`}
                  </td>
                  <td className={cn(td, "min-w-40 text-muted-foreground")}>
                    {pair.notes}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </ScrollTable>
    </DocsSurface>
  )
}
