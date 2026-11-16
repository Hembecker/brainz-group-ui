/*
 * Resizable — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/resizable
 * Construído sobre o react-resizable-panels v4 (`Group`, `Panel`,
 * `Separator`); a API de props é a dele. As cores e os tamanhos são os da
 * Big Brain.
 * - O handle é um `role="separator"` focável (Tab), com `aria-valuenow`, e
 *   as setas redimensionam. Ele precisa de nome:
 *   `aria-label` tem o padrão "Redimensionar painéis" (texto fixo do
 *   componente em português), antes do spread, e deve ser trocado por um nome
 *   específico ("Redimensionar a barra lateral") quando houver mais de um.
 * - Anel de foco: sólido, 3px, no `ring`, afastado 2px pela cor do fundo. O
 *   handle ganha `z-10` ao focar, para o anel não ficar por baixo do conteúdo
 *   dos painéis vizinhos. A linha de 1px é `bg-border` (decorativa); a
 *   pegada (`withHandle`) é `bg-input`, para ter 3:1 como algo que se
 *   arrasta (4,6:1 no branco, 3,8:1 no escuro).
 * - A pegada (`withHandle`) leva `aria-hidden`.
 */
"use client"

import { cn } from "cn"
import * as ResizablePrimitive from "react-resizable-panels"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  "aria-label": ariaLabel = "Redimensionar painéis",
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      aria-label={ariaLabel}
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:start-1/2 after:w-1 after:-translate-x-1/2 focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:start-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 rtl:after:translate-x-1/2 rtl:aria-[orientation=horizontal]:after:-translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          aria-hidden="true"
          className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-input"
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
