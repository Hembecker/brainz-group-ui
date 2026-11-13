"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Tabs — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/tabs
 * As cores, o contraste e a escala (lista `h-8`, `rounded-2xl`) são os da Big Brain.
 * - Construído sobre o Tabs do Base UI: a lista tem `role="tablist"`, cada aba
 *   `role="tab"` com `aria-selected` e `aria-controls`, e o painel
 *   `role="tabpanel"` com `aria-labelledby`. Dê um nome à lista com
 *   `aria-label`. ← → (↑ ↓ na vertical) movem o foco, Home e End vão às
 *   pontas, e em RTL as setas se invertem; Enter e Espaço ativam a aba
 *   focada (a menos que a lista use `activateOnFocus`).
 * - O `orientation` precisa chegar ao Base UI (`orientation={orientation}` na raiz):
 *   o registro o separava das props sem repassar, e as abas verticais seguiam
 *   as setas horizontais e ficavam sem `aria-orientation`.
 * - Variantes `default` (fundo `muted`) e `line` (sublinhado); `orientation`
 *   horizontal ou vertical, exposta em `data-orientation`.
 * - Texto das abas: o registro usava `text-foreground/60`. Agora é
 *   `text-muted-foreground` (mist 600): 6,6:1 sobre `muted` e 7,4:1 sobre o
 *   fundo no claro; no escuro, 6,1:1 sobre `muted` e 8,1:1 sobre o fundo. A aba ativa usa
 *   `bg-background` e `text-foreground` nos dois modos; no lugar do
 *   `dark:bg-input/30` do registro, o papel cheio basta (fundo mist 950
 *   sobre a lista mist 800). Na `line` a aba ativa ganha o sublinhado.
 * - O estado ativo não depende só do fundo: a cor do texto muda
 *   (`foreground` contra `muted-foreground`) e o `aria-selected` o expõe.
 * - Aba desabilitada: o Base UI usa `aria-disabled` e `data-disabled` (não o atributo
 *   `disabled`), então ela continua focável pelas setas, mas não ativa; fica
 *   apagada a 50% e sem contraste mínimo.
 * - Anel de foco sólido de 3px no `ring`, afastado 2px pelo fundo, nas abas
 *   e também no painel (o painel entra na ordem do Tab, e o registro o
 *   deixava com `outline-none` sem anel).
 */

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-2xl p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:p-1 data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-transparent! px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:px-3 group-data-vertical/tabs:py-0.5 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-end-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-2xl text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
