import type { AxeReporter, AxeResults, Result } from "axe-core"

/*
 * axe report used by addon-a11y (parameters.a11y.config.reporter).
 *
 * Why: in a full run from the Storybook panel with Accessibility on,
 * addon-vitest resends the whole run state to the Storybook server every
 * 500 ms, with every axe report gathered so far, twice (`a11yReports` and
 * `reports`). Most of each report is the list of rules that passed or did
 * not apply. At 73 of 544 stories one message was already 3.7 MB; the
 * server reached Node's 4 GB heap limit and died ("JavaScript heap out of
 * memory") or froze the 16 GB machine, although all 544 tests passed.
 *
 * Measured on one story: 34 KB per report even without the elements, of
 * which 25 KB were the descriptions of the inapplicable rules and 8 KB the
 * passes.
 *
 * What it does: the standard axe report (`v1`), with violations and
 * "incomplete" (items to review by hand) unchanged. Passes keep only the
 * rule (id, name, link), without description, tags or elements. The
 * inapplicable list goes empty: the Accessibility tab does not show it.
 * The test result does not change: the test fails on violations, and they
 * are complete. In the Accessibility tab, Passes still names every rule
 * that passed, without the elements of each one.
 */
const summarize = (rules: Result[] = []): Result[] =>
  rules.map(({ id, help, helpUrl, impact }) => ({
    id,
    help,
    helpUrl,
    impact,
    description: "",
    tags: [],
    nodes: [],
  }))

export const slimA11yReporter: AxeReporter<AxeResults> = (
  rawResults,
  options,
  resolve,
  reject
) => {
  // axe-core puts itself on window when it loads (axe.js: window.axe = axe).
  const axe = (globalThis as { axe?: typeof import("axe-core") }).axe
  if (!axe) {
    reject(new Error("axe-core not loaded"))
    return
  }
  axe.getReporter<AxeResults>("v1")(
    rawResults,
    options,
    (results) =>
      resolve({
        ...results,
        passes: summarize(results.passes),
        inapplicable: [],
      }),
    reject
  )
}
