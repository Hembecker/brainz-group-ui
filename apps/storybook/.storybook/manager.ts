import { addons } from "storybook/manager-api"
import { themes } from "storybook/theming"

// Ordem da barra lateral. Com as seções-raiz ligadas (o padrão), o Storybook
// desenha as páginas soltas do topo (Introdução, Instalação, Componentes de
// IA, Temas…) num bloco acima das seções agrupadas, e Componentes e Blocks
// iam parar depois de Skills. Com `showRoots: false`, tudo fica numa árvore
// só, na ordem do `storySort` do preview.tsx.
//
// O topo da barra mostra o nome do projeto no lugar do logo do Storybook. O
// tema segue o claro/escuro do sistema (themes.normal); o favicon é o
// public/favicon.svg (o símbolo da Brainz Group).
addons.setConfig({
  sidebar: { showRoots: false },
  theme: { ...themes.normal, brandTitle: "Brainz Group UI" },
})
