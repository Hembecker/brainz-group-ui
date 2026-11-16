/*
 * Leitura ao vivo do tema, para as páginas Temas e Tipografia.
 *
 * O decorator do Storybook grava a marca (`data-brand`) e o modo (`.dark`) no
 * <html> quando a barra de ferramentas muda. Estes helpers observam o <html>
 * e releem as variáveis CSS depois de cada troca. Nada toca no DOM no topo
 * do módulo. As leituras (o snapshot do `useSyncExternalStore` e os `useMemo`
 * de `useResolvedTokens` e `useCssVariables`, que usam `getComputedStyle` e
 * uma <span> oculta, inserida e removida na mesma chamada) rodam durante a
 * renderização e são refeitas só quando a chave marca|modo muda, como um
 * seletor de store.
 */
import * as React from "react"

const OBSERVED = ["data-brand", "class"]

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: OBSERVED,
  })
  return () => observer.disconnect()
}

function getSnapshot() {
  const root = document.documentElement
  const brand = root.getAttribute("data-brand") ?? "brainz"
  const mode = root.classList.contains("dark") ? "dark" : "light"
  return `${brand}|${mode}`
}

/** Chave primitiva "<marca>|<modo>", que muda a cada troca no <html>. */
export function useThemeKey(): string {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => "brainz|light")
}

export function parseThemeKey(key: string) {
  const [brand, mode] = key.split("|")
  return { brand, mode: mode === "dark" ? "dark" : "light" } as const
}

export type Rgba = [number, number, number, number]

let canvasContext: CanvasRenderingContext2D | null | undefined

const SLASH_ALPHA = /\s*\/\s*([\d.]+)(%?)\s*\)\s*$/
const LEGACY_RGBA = /^rgba?\(\s*([^,()]+,[^,()]+,[^,()]+),\s*([\d.]+)(%?)\s*\)$/i

/*
 * Alfa escrito na própria cor ("oklch(1 0 0 / 0.1)", "… / 10%)" ou o 4º
 * argumento de "rgba(r, g, b, a)") e a mesma cor opaca. O canvas guarda os
 * pixels pré-multiplicados: com alfa baixo, o RGB lido de volta perde
 * precisão (branco a 10% voltava como #f5ffff1a). Por isso o RGB é lido da
 * cor opaca e o alfa vem do texto.
 */
function splitAlpha(color: string): { opaque: string; alpha: number } | null {
  const slash = color.match(SLASH_ALPHA)
  if (slash) {
    const alpha = Number(slash[1]) / (slash[2] ? 100 : 1)
    return Number.isFinite(alpha)
      ? { opaque: color.replace(SLASH_ALPHA, ")"), alpha }
      : null
  }
  const legacy = color.match(LEGACY_RGBA)
  if (legacy) {
    const alpha = Number(legacy[2]) / (legacy[3] ? 100 : 1)
    return Number.isFinite(alpha) ? { opaque: `rgb(${legacy[1]})`, alpha } : null
  }
  return null
}

/** Converte qualquer cor CSS (hex, rgb, oklch…) em sRGB 0–255 + alfa 0–1. */
export function toRgba(color: string): Rgba | null {
  if (!color || typeof document === "undefined") return null
  if (canvasContext === undefined) {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    canvasContext = canvas.getContext("2d", { willReadFrequently: true })
  }
  const context = canvasContext
  if (!context) return null
  // Sem alfa no texto (hex de 8 dígitos, "transparent"), vale o do canvas.
  const split = splitAlpha(color)
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = "#000000"
  context.fillStyle = split ? split.opaque : color
  context.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
  return [r, g, b, split ? Math.min(Math.max(split.alpha, 0), 1) : a / 255]
}

function hexPart(value: number) {
  return Math.round(value).toString(16).padStart(2, "0")
}

export function toHex([r, g, b, a]: Rgba): string {
  const base = `#${hexPart(r)}${hexPart(g)}${hexPart(b)}`
  return a < 1 ? `${base}${hexPart(a * 255)}` : base
}

/** Compõe uma cor com alfa sobre um fundo opaco. */
function flatten(color: Rgba, background: Rgba): Rgba {
  const [r, g, b, a] = color
  return [
    r * a + background[0] * (1 - a),
    g * a + background[1] * (1 - a),
    b * a + background[2] * (1 - a),
    1,
  ]
}

function luminance([r, g, b]: Rgba) {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/**
 * Razão de contraste WCAG 2.x. Cores com alfa são compostas sobre o fundo
 * (e o fundo, se tiver alfa, sobre `base`).
 */
export function contrast(foreground: Rgba, background: Rgba, base?: Rgba) {
  const opaqueBackground =
    background[3] < 1 ? flatten(background, base ?? [255, 255, 255, 1]) : background
  const opaqueForeground =
    foreground[3] < 1 ? flatten(foreground, opaqueBackground) : foreground
  const l1 = luminance(opaqueForeground)
  const l2 = luminance(opaqueBackground)
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (light + 0.05) / (dark + 0.05)
}

/**
 * "5,2:1", com vírgula decimal e arredondado como as notas do globals.css.
 * Quem decide se atende ao mínimo é a razão exata, não o texto.
 */
export function formatRatio(ratio: number) {
  return `${ratio.toFixed(1).replace(".", ",")}:1`
}

export interface ResolvedToken {
  /** Valor declarado, como o CSS devolve (hex, oklch, var resolvida). */
  raw: string
  rgba: Rgba | null
  hex: string | null
}

function readTokens(names: readonly string[]) {
  const next: Record<string, ResolvedToken> = {}
  if (typeof document === "undefined") return next
  const probe = document.createElement("span")
  probe.style.display = "none"
  document.body.appendChild(probe)
  const rootStyle = getComputedStyle(document.documentElement)
  for (const name of names) {
    const raw = rootStyle.getPropertyValue(name).trim()
    probe.style.color = `var(${name})`
    const rgba = raw ? toRgba(getComputedStyle(probe).color) : null
    next[name] = { raw, rgba, hex: rgba ? toHex(rgba) : null }
  }
  probe.remove()
  return next
}

function readVariables(names: readonly string[]) {
  const next: Record<string, string> = {}
  if (typeof document === "undefined") return next
  const rootStyle = getComputedStyle(document.documentElement)
  for (const name of names) {
    next[name] = rootStyle.getPropertyValue(name).trim()
  }
  return next
}

/*
 * As leituras abaixo dependem só da chave do tema (o estado externo do
 * <html>): são refeitas quando a chave muda, como um seletor de store.
 */

/**
 * Valor atual de cada variável CSS de cor, lido no <html> depois de cada
 * troca de marca ou de modo. `names` precisa ser estável (constante de módulo).
 */
export function useResolvedTokens(names: readonly string[]) {
  const key = useThemeKey()
  // `key` entra nas dependências de propósito: muda quando o <html> muda.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const values = React.useMemo(() => readTokens(names), [key, names])
  return { key, values }
}

/** Valor bruto (texto) de variáveis CSS que não são cor, como a fonte. */
export function useCssVariables(names: readonly string[]) {
  const key = useThemeKey()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const values = React.useMemo(() => readVariables(names), [key, names])
  return { key, values }
}
