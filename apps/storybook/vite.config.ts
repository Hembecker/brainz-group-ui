/// <reference types="vitest/config" />
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vite"

const dirname = import.meta.dirname

// Used by Storybook (builder-vite reads this file) and by `npm run test`,
// which runs every story as a Vitest test in Chromium, with axe.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Coverage of the library (the panel's "Coverage" and `--coverage`).
    // The components live in packages/ui, outside this project's root, and
    // Vitest only measures files inside the root unless `allowExternal` is on;
    // without it the report showed only .storybook/preview.tsx.
    coverage: {
      allowExternal: true,
      include: ["../../packages/ui/src/**/*.{ts,tsx}"],
    },
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          // At most 4 story files at once. With the default (CPUs - 1, 11 on
          // the 12-thread dev machine) a run from the Storybook panel with
          // coverage and a11y used ~8 GB across Vitest, the Storybook server
          // and 9 headless Chromium processes, and froze at 181/544 on a
          // 16 GB machine.
          maxWorkers: 4,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
