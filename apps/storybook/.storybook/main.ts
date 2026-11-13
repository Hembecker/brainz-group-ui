import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  // brand/ (logo e paleta) servido na raiz, para os exemplos com imagem.
  staticDirs: ["../../../brand"],
  core: { disableTelemetry: true },
}

export default config
