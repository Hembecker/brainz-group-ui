import * as React from "react"
import {
  createHighlighterCore,
  type GrammarState,
  type HighlighterCore,
} from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

/*
 * Big Brain: the github-light and github-dark themes are tuned for a white
 * and a near-black page, not for our block surfaces. Several of their colors
 * fall below the 4.5:1 text contrast on the block (`muted`) and on the line
 * highlight (`border`, which is the lightest/darkest tint a line can have),
 * and on the red tint of a removed diff line. Each color below is the same
 * hue pushed toward black (light) or white (dark), until it reaches at least
 * 4.6:1 on all three backgrounds, in light and in dark. They are applied
 * through `colorReplacements`, so they also reach the ANSI palette
 * (terminal.ansi* colors of the theme). Re-check them if the `muted`,
 * `border` or `destructive` tokens change.
 */
const colorReplacements = {
  "github-light": {
    "#6a737d": "#596169",
    "#22863a": "#1c6f30",
    "#d73a49": "#b0303c",
    "#e36209": "#9f4506",
    "#0366d6": "#035dc3",
    "#959da5": "#5c6166",
    "#3192aa": "#236879",
    "#cb2431": "#bb212d",
    "#d1d5da": "#5e6062",
    "#b08800": "#785c00",
    "#1b7c83": "#176b71",
    "#28a745": "#1a6e2e",
    "#dbab09": "#765c05",
  },
  "github-dark": {
    "#6a737d": "#a6abb1",
    "#b392f0": "#b99bf1",
    "#f97583": "#fa8793",
    "#586069": "#a6abb0",
    "#2188ff": "#66adff",
    "#959da5": "#a4abb2",
    "#ea4a5a": "#f28d97",
  },
}

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [
      import("shiki/themes/github-light.mjs"),
      import("shiki/themes/github-dark.mjs"),
    ],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  })

  return highlighter
}

function getLanguage(language: string) {
  const name = language.toLowerCase()

  if (name === "ansi") {
    return name
  }

  if (name in languages) {
    return name as keyof typeof languages
  }

  return aliases[name] ?? null
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language)

  if (!lang) {
    return null
  }

  const shiki = await getHighlighter()

  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang])
  }

  return {
    // Returns one React node per line, and the grammar state after the last
    // line. Pass that state back to continue where the code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
          grammarState: state,
          colorReplacements,
        }).tokens

      // ANSI has no grammar state, so each line is tokenized on its own and
      // gets the same colors whether it arrives in one piece or streams.
      const tokens =
        lang === "ansi"
          ? code.split("\n").flatMap((line) => tokenize(line))
          : tokenize(code)

      return {
        lines: tokens.map((line) =>
          line.map((token, index) => {
            const style = (token.htmlStyle ?? {}) as Record<string, string>
            // Big Brain: ANSI "dim" ([2m) makes shiki emit the color at
            // 50% alpha (an 8-digit hex), which does not reach 4.5:1. A dim
            // token takes the muted-foreground role instead (6,6:1 in light,
            // 6,1:1 in dark) and keeps its other styles.
            const dim =
              lang === "ansi" &&
              Object.values(style).some((value) =>
                /^#[0-9a-f]{8}$/i.test(value)
              )

            return (
              <span
                key={index}
                style={
                  dim
                    ? (Object.fromEntries(
                        Object.entries(style).filter(
                          ([key]) => !key.startsWith("--shiki-")
                        )
                      ) as React.CSSProperties)
                    : (style as React.CSSProperties)
                }
                className={
                  dim
                    ? "text-muted-foreground"
                    : "text-(--shiki-light) dark:text-(--shiki-dark)"
                }
              >
                {token.content}
              </span>
            )
          })
        ),
        state: shiki.getLastGrammarState(tokens),
      }
    },
  }
}

// Returns one React node per line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
  const highlighter = await loadHighlighter(language)

  return highlighter ? highlighter.highlight(code).lines : null
}
