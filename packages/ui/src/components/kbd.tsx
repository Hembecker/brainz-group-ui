import { cn } from "cn"

/*
 * Kbd — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/kbd
 * As cores, o contraste e o raio são os da Big Brain.
 * - Um <kbd> com `data-slot="kbd"`; o KbdGroup agrupa várias teclas
 *   (`data-slot="kbd-group"`). Estático, sem papel próprio.
 * - Padrão: `muted-foreground` sobre `muted`, 6,6:1 no claro e 6,1:1 no
 *   escuro. Dentro de um Button, o chip `muted` mantém esse contraste em
 *   qualquer variante.
 * - Dentro de um InputGroup: `bg-muted` no claro (o `bg-background` sumia no
 *   campo branco do SESI, 1:1; escolha do usuário em 2026-11-16) e
 *   `bg-background` no escuro (lá a `muted` é a mesma mist 800 do `field`).
 *   Texto `muted-foreground`: 6,6:1 na muted da Brainz, 5,3:1 na do SESI e
 *   8,1:1 no escuro. O registro usava `bg-input`, que dá 1,6:1 e 2,1:1 com
 *   esse texto. O `InputGroupAddon` aplica as mesmas cores nas teclas dele.
 * - Dentro de um Tooltip (fundo `foreground`): `bg-muted-foreground` com
 *   `text-background`, 7,4:1 no claro e 8,1:1 no escuro, um papel cheio nos
 *   dois modos. O registro usava `bg-background/20` e `/10`, com a variante
 *   `dark:`. O chip contra o tooltip tem 2,7:1 e 2,4:1: decorativo, o texto
 *   é que vale.
 * - Símbolos (⌘ ⇧ ⏎) são lidos de forma imprevisível: veja a página Docs.
 */

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-lg bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=input-group]:bg-muted in-data-[slot=tooltip-content]:bg-muted-foreground in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=input-group]:bg-background [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
