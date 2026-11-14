/*
 * Direction — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/direction
 * Não tem estilo: reexporta `DirectionProvider` e `useDirection` do Base UI
 * (`@base-ui/react/direction-provider`), sem mudar nada.
 * - `DirectionProvider direction="ltr" | "rtl"` diz aos primitivos do Base UI
 *   a direção do texto. Isso muda o que o CSS não alcança: o teclado (setas
 *   do Slider, dos menus, das Tabs, do Calendar) e as posições calculadas
 *   (`side="inline-start"` e `"inline-end"` de popups em portal).
 * - Ele não escreve o atributo `dir`: ponha `dir` (e `lang`) no `<html>` ou num
 *   ancestral, que é o que inverte o layout e vale para o CSS (`rtl:`, `ps-*`,
 *   `ms-*`). Os dois andam juntos. `useDirection()` devolve a direção do
 *   provider mais próximo, e `"ltr"` quando não há nenhum.
 * - Portais (Dialog, Popover, Menu…) vão para o `body`: o `dir` de um ancestral
 *   do gatilho não chega lá; o do `<html>` chega. Num exemplo RTL isolado,
 *   passe `dir` e `lang` ao conteúdo do portal.
 * - O preview do Storybook já envolve cada story num `DirectionProvider` que
 *   segue a barra de ferramentas "Direção" e o `dir` do `<html>`.
 */
export {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider"
