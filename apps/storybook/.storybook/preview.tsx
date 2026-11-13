import * as React from "react"
import type { Decorator, Preview } from "@storybook/react-vite"

import { DirectionProvider } from "@workspace/ui/components/direction"

import "@workspace/ui/globals.css"

type Mode = "light" | "dark"
type Direction = "ltr" | "rtl"

/*
 * Applies the chosen mode (`.dark`) and direction (`dir`) to <html>, so the
 * whole Docs page follows them, and paints each story on the system's own
 * background. The surface matters on Docs pages, where the story blocks
 * would otherwise sit on Storybook's white page in dark mode.
 * A component (not the decorator itself) owns the effect, so the hook rules
 * hold. The DirectionProvider makes the Base UI primitives follow the
 * direction in their keyboard handling too (Slider, menus, Tabs).
 */
function Surface({
  mode,
  direction,
  children,
}: {
  mode: Mode
  direction: Direction
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", mode === "dark")
    root.setAttribute("dir", direction)
    root.setAttribute("lang", "pt-BR")
  }, [mode, direction])

  return (
    <div
      dir={direction}
      className={mode === "dark" ? "dark" : undefined}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
        padding: "1.5rem",
        borderRadius: "0.5rem",
      }}
    >
      <DirectionProvider direction={direction}>{children}</DirectionProvider>
    </div>
  )
}

const withSurface: Decorator = (Story, context) => (
  <Surface
    mode={context.globals.mode === "dark" ? "dark" : "light"}
    direction={context.globals.direction === "rtl" ? "rtl" : "ltr"}
  >
    <Story />
  </Surface>
)

/*
 * "Show code" for section stories: keep only the JSX returned by
 * `render: () => …`, dedented, so the snippet can be pasted as is
 * (like the code blocks on the shadcn/ui pages).
 */
function renderBodyOnly(code: string): string {
  const match = code
    .replace(/\r/g, "")
    .match(/render:\s*\(\)\s*=>\s*([\s\S]*?)\s*,?\s*\}\s*$/)
  if (!match) return code
  const lines = match[1]
    .replace(/^\(\s*\n?/, "")
    .replace(/\n?\s*\)$/, "")
    .split("\n")
  const rest = lines.slice(1).filter((line) => line.trim() !== "")
  const indent = rest.length
    ? Math.min(...rest.map((line) => line.match(/^ */)![0].length))
    : 0
  const lastIndent =
    lines.length > 1 ? lines[lines.length - 1].match(/^ */)![0].length : 0
  const cut = Math.min(indent, lastIndent)
  return [
    lines[0].trim(),
    ...lines.slice(1).map((line) => line.slice(cut)),
  ].join("\n")
}

const preview: Preview = {
  globalTypes: {
    mode: {
      description: "Modo de cor",
      toolbar: {
        title: "Modo",
        icon: "mirror",
        items: [
          { value: "light", title: "Claro", icon: "sun" },
          { value: "dark", title: "Escuro", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Direção do texto",
      toolbar: {
        title: "Direção",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR (esquerda para a direita)" },
          { value: "rtl", title: "RTL (direita para a esquerda)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  // The test run uses these globals. `npm run test` runs every story three
  // times: light (`test:light`), then with Vite's `--mode dark` and
  // `--mode rtl` (`test:dark`, `test:rtl`), so axe also checks dark mode and
  // RTL. In `storybook dev` the mode is "development", so it opens in light/LTR.
  initialGlobals: {
    mode: import.meta.env.MODE === "dark" ? "dark" : "light",
    direction: import.meta.env.MODE === "rtl" ? "rtl" : "ltr",
  },
  decorators: [withSurface],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    docs: { source: { transform: renderBodyOnly } },
    // axe runs on every story in `npm run test`. "error" fails the test on any
    // violation: accessibility is a requirement here, not a warning.
    // The only spans left out are Base UI focus guards
    // (`data-base-ui-focus-guard`): aria-hidden, focusable on purpose, they
    // redirect the focus as soon as they receive it, and axe flags them as
    // `aria-hidden-focus` on non-modal popups (Drawer, NavigationMenu…).
    // Every rule stays on for everything else.
    a11y: {
      test: "error",
      context: { exclude: ["[data-base-ui-focus-guard]"] },
    },
  },
  // No global autodocs: each component has an MDX page (<nome>.mdx) that
  // follows the section order of its shadcn/ui page.
}

export default preview
