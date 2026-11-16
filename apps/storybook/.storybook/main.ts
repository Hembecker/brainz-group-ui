import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    // Testes visuais do Chromatic (painel "Visual tests"). Só envia capturas
    // ao chromatic.com depois de entrar com uma conta e rodar pelo painel.
    "@chromatic-com/storybook",
  ],
  // brand/ (logo e paleta) servido na raiz, para os exemplos com imagem.
  // brand/ (o material da marca, servido na raiz) e public/ (o favicon).
  staticDirs: ["../../../brand", "../public"],
  core: { disableTelemetry: true },
  // Desempenho (2026-11-16): no `storybook dev`, o Vite pré-transforma todas
  // as stories e MDX ao subir o servidor, e a primeira visita a cada arquivo
  // não espera a transformação (o Dashboard caía de ~800 ms para ~200 ms).
  // Fica aqui, e não no vite.config.ts, porque o builder do Storybook troca a
  // chave `server` de lá. Fora do Vitest e do `storybook build`.
  viteFinal: (viteConfig, { configType }) =>
    configType === "DEVELOPMENT" && !process.env.VITEST
      ? mergeConfig(viteConfig, {
          server: {
            warmup: {
              clientFiles: [
                "./src/**/*.stories.tsx",
                "./src/**/*.mdx",
                "./.storybook/preview.tsx",
              ],
            },
          },
        })
      : viteConfig,
}

export default config
