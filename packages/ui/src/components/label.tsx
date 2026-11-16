"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Label — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/label
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - É um <label> nativo, que aceita todas as props dele (`htmlFor`, `form`…).
 *   Não usa um primitivo do Base UI (a página do shadcn aponta para a API do
 *   Base UI, mas o código do registro é um <label> comum). Liga ao controle por
 *   `htmlFor` ↔ `id`, ou envolvendo o controle. O rótulo é sempre visível: o
 *   placeholder nunca o substitui.
 * - Para campos de formulário, prefira o `FieldLabel` (veja o Field), que
 *   acrescenta o vermelho do estado inválido e o estilo de choice card.
 * - Cor herdada: o texto fica em `foreground` (19,7:1 no claro e 19,0:1 no
 *   escuro sobre o fundo; 15,8:1 e 14,3:1 sobre o `field`). Nenhuma cor com
 *   opacidade.
 * - Desabilitado: apaga em 50% quando o controle é irmão anterior (`peer`) e
 *   está desabilitado: um controle nativo por `peer-disabled` (`:disabled`) e
 *   a raiz do Checkbox, do Switch ou do RadioGroupItem do Base UI (um <span>
 *   com `data-disabled`) por `peer-data-disabled`. Dentro de um grupo com
 *   `data-disabled`, por `group-data-[disabled=true]:opacity-50`. Texto
 *   desabilitado não precisa cumprir contraste, mas explique o motivo numa
 *   descrição.
 * - `flex items-center gap-2` e `leading-none`: um ícone ou badge ao lado do
 *   texto fica alinhado, e gaps são lógicos, então funciona em RTL. Em rótulos
 *   de várias linhas o `leading-none` aperta as linhas: use o `FieldLabel`
 *   (`leading-snug`) nesses casos.
 * - Expõe `data-slot="label"`.
 */

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
