import { addons } from "storybook/manager-api"

// Ordem da barra lateral. Com as seções-raiz ligadas (o padrão), o Storybook
// desenha as páginas soltas do topo (Introdução, Instalação, Componentes de
// IA, Temas…) num bloco acima das seções agrupadas, e Componentes e Blocks
// iam parar depois de Skills. Com `showRoots: false`, tudo fica numa árvore
// só, na ordem do `storySort` do preview.tsx.
addons.setConfig({
  sidebar: { showRoots: false },
})
