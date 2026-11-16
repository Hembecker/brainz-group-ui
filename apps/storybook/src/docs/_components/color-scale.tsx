/*
 * Amostras de cor da página Temas.
 *
 * Estes helpers DOCUMENTAM os tokens, então usam a paleta --bb-* e os hex
 * copiados do globals.css nas amostras. O resto (texto, bordas, fundo) usa só
 * papéis semânticos. A raiz leva `sb-unstyled` para o CSS das páginas Docs
 * não restilizar o conteúdo.
 */
import * as React from "react"

import { Badge } from "@workspace/ui/components/badge"
import { brandList, brands, type BrandId } from "@workspace/ui/brand/brands"
import { useBrand } from "@workspace/ui/brand/use-brand"
import { cn } from "@workspace/ui/lib/utils"

import {
  brandPrimitives,
  scaleSteps,
} from "./theme-data"
import {
  contrast,
  formatRatio,
  parseThemeKey,
  toRgba,
  useResolvedTokens,
  useThemeKey,
  type Rgba,
} from "./use-theme"

/** Fundo das páginas Docs com o tema do sistema, fora do decorator. */
export function DocsSurface({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sb-unstyled my-6 rounded-2xl border border-border bg-background p-4 font-sans text-foreground sm:p-6",
        className
      )}
      {...props}
    />
  )
}

/** Marca e modo ativos, com o logo da marca. Atualiza com a barra de ferramentas. */
export function ActiveTheme() {
  const brand = useBrand()
  const { mode } = parseThemeKey(useThemeKey())
  const { Logo } = brand
  return (
    <DocsSurface className="flex flex-wrap items-center gap-4">
      <Logo className="h-6 w-auto text-foreground" />
      <p className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span>
          Marca ativa: <strong className="font-semibold">{brand.name}</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>Modo {mode === "dark" ? "escuro" : "claro"}</span>
        {brand.illustrative ? (
          <Badge variant="outline">Marca ilustrativa</Badge>
        ) : null}
      </p>
      <p className="w-full text-sm text-muted-foreground">
        Troque a marca em <strong className="font-medium text-foreground">Marca</strong>{" "}
        e o modo em <strong className="font-medium text-foreground">Modo</strong>, na
        barra de ferramentas do Storybook: tudo nesta página acompanha.
      </p>
    </DocsSurface>
  )
}

const WHITE = "#ffffff"
// Mist 950, o fundo do modo escuro (referência do contrato de contraste).
const MIST_950 = "oklch(0.148 0.004 228.8)"

const primaryNames = scaleSteps.map((step) => `--bb-primary-${step}`)

function ratioText(color: Rgba | null, against: Rgba | null) {
  return color && against ? formatRatio(contrast(color, against)) : "—"
}

/**
 * Escala Primária da marca ATIVA, lida ao vivo do CSS. Mostra o hex atual e o
 * contraste com o branco e com a mist 950, os fundos do contrato.
 */
export function LiveScale() {
  const { key, values } = useResolvedTokens(primaryNames)
  const { brand } = parseThemeKey(key)
  const brandId: BrandId = brand in brands ? (brand as BrandId) : "brainz"
  const primitives = brandPrimitives[brandId]
  const expected = primitives.primary
  const references = React.useMemo(
    () => ({ white: toRgba(WHITE), dark: toRgba(MIST_950) }),
    []
  )

  const stale = scaleSteps.filter((step) => {
    const live = values[`--bb-primary-${step}`]?.hex
    return live && live !== expected[step]
  })

  return (
    <DocsSurface>
      <p className="mb-3 text-sm font-medium">
        Primária · {brands[brandId].name}
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-3">
        {scaleSteps.map((step) => {
          const token = values[`--bb-primary-${step}`]
          return (
            <li key={step} className="grid gap-1 text-xs">
              <span
                aria-hidden="true"
                className="h-12 rounded-lg border border-border"
                style={{ background: `var(--bb-primary-${step})` }}
              />
              <span className="font-medium">
                {step}
                {step === primitives.primaryBase ? " (base)" : ""}
              </span>
              <code className="font-mono text-muted-foreground">
                {token?.hex ?? "…"}
              </code>
              <span className="text-muted-foreground">
                branco {ratioText(token?.rgba ?? null, references.white)}
              </span>
              <span className="text-muted-foreground">
                mist 950 {ratioText(token?.rgba ?? null, references.dark)}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        {stale.length
          ? `Atenção: os passos ${stale.join(", ")} diferem da tabela estática desta página (theme-data.ts). Atualize a tabela com os valores do globals.css.`
          : "Valores lidos agora do CSS carregado (globals.css)."}
      </p>
    </DocsSurface>
  )
}

/** O gradiente da marca ativa (--bb-gradient), usado no símbolo do logo. */
export function GradientSwatch() {
  return (
    <DocsSurface className="grid gap-2">
      <span
        aria-hidden="true"
        className="h-16 rounded-xl"
        style={{ background: "var(--bb-gradient)" }}
      />
      <p className="text-sm text-muted-foreground">
        <code className="font-mono">--bb-gradient</code>, de cima para baixo: na
        Brainz Group, o gradiente do logo (Primária 500 → #305BA3, o fim do
        gradiente no SVG oficial); no SESI, Primária 500 (Pure) → 700. Decorativo (não
        carrega texto); disponível para fundos, sem uso nos componentes.
      </p>
    </DocsSurface>
  )
}

function PrimaryRow({ id }: { id: BrandId }) {
  const { primary: values, primaryBase: base, source } = brandPrimitives[id]
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">Primária</p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(3.75rem,1fr))] gap-2">
        {scaleSteps.map((step) => (
          <li key={step} className="grid gap-1 text-xs">
            <span
              aria-hidden="true"
              className="h-9 rounded-md border border-border"
              style={{ background: values[step] }}
            />
            <span className="font-medium">
              {step}
              {step === base ? " (base)" : ""}
            </span>
            <code className="font-mono text-muted-foreground">{values[step]}</code>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  )
}

/**
 * Todas as marcas instaladas lado a lado, com os hex copiados do globals.css
 * (uma marca inativa não pode ser lida do CSS, porque os papéis resolvem no
 * :root).
 */
export function BrandScales() {
  return (
    <div className="sb-unstyled my-6 grid gap-4 font-sans lg:grid-cols-2">
      {brandList.map((brand) => {
        const primitives = brandPrimitives[brand.id]
        return (
          <section
            key={brand.id}
            aria-labelledby={`marca-${brand.id}`}
            className="grid content-start gap-4 rounded-2xl border border-border bg-background p-4 text-foreground"
          >
            <div className="grid gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 id={`marca-${brand.id}`} className="text-base font-semibold">
                  {brand.name}
                </h3>
                <code className="font-mono text-xs text-muted-foreground">
                  data-brand="{brand.id}"
                </code>
                {brand.illustrative ? (
                  <Badge variant="outline">Ilustrativo</Badge>
                ) : (
                  <Badge variant="secondary">Padrão</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{brand.description}</p>
            </div>
            <PrimaryRow id={brand.id} />
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <dt className="font-medium">--bb-ink</dt>
              <dd className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-sm border border-border"
                  style={{ background: primitives.ink }}
                />
                <code className="font-mono text-muted-foreground">{primitives.ink}</code>
              </dd>
              <dt className="font-medium">--bb-font-sans</dt>
              <dd>
                <code className="font-mono break-all text-muted-foreground">
                  {primitives.fontSans}
                </code>
              </dd>
            </dl>
          </section>
        )
      })}
    </div>
  )
}
