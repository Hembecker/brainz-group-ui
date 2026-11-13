import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

/*
 * Spinner — estrutura do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/spinner
 * - `role="status"` com o rótulo em português ("Carregando"); passe
 *   `aria-label` para dizer o que está carregando.
 * - Tamanho com classes `size-*`; a cor acompanha o texto (`currentColor`).
 * - Parado com movimento reduzido (`motion-reduce:animate-none`).
 * - Dentro de um Button, use `data-icon="inline-start"` ou `"inline-end"`.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Carregando"
      className={cn(
        "size-4 animate-spin motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
