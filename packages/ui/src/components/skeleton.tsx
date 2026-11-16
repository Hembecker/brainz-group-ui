import { cn } from "cn"

/*
 * Skeleton — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/skeleton
 * As cores e o raio são os da Big Brain.
 * - Um <div> vazio com `animate-pulse`, o papel `muted` e o raio `rounded-2xl`
 *   (escala rhea); o tamanho e o formato vêm da `className` (`h-4 w-40`,
 *   `size-10 rounded-full`). Expõe `data-slot="skeleton"`.
 * - Sem cor com opacidade. O bloco é só um espaço reservado, sem texto:
 *   não precisa de contraste de texto, e um <div> vazio não é anunciado.
 * - Quem avisa o carregamento é o contêiner, não o Skeleton: `aria-busy="true"`
 *   nele e um texto `sr-only` com `role="status"` dentro (veja a página Docs).
 * - O pulso para com movimento reduzido (`motion-reduce:animate-none`), como
 *   no Spinner.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-2xl bg-muted motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
