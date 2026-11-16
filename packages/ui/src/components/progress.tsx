"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "cn"

/*
 * Progress — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/progress
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Construído sobre o Progress do Base UI: o Root tem `role="progressbar"`
 *   com `aria-valuenow`, `aria-valuemin`, `aria-valuemax` e `aria-valuetext`
 *   ("56%"). `value` é obrigatório; com `value={null}` a barra é indeterminada e o
 *   `aria-valuenow` some. O ProgressValue é `aria-hidden`: o valor lido vem do
 *   Root.
 * - Nome acessível: o ProgressLabel liga o rótulo ao Root por `aria-labelledby`
 *   sozinho. Sem rótulo visível, passe `aria-label` no Progress.
 * - Contraste não textual (WCAG 1.4.11, mínimo 3:1). O registro usava o trilho
 *   `bg-muted` (1,1:1 no branco), que não aparecia como forma. Agora o trilho é
 *   `bg-background` com contorno `border-input`:
 *   - contorno do trilho, claro: `input` (mist 500), 4,6:1 no branco;
 *   - contorno do trilho, escuro: `input` (branco a 40%), 3,8:1 no fundo e no
 *     card;
 *   - preenchimento (`primary` 600) sobre o trilho, claro: 5,2:1;
 *   - preenchimento sobre o trilho, escuro: 3,8:1. O trilho é sempre o
 *     `background`, também dentro de um card (o fundo mais escuro que o card).
 *   Com `bg-muted` no escuro o preenchimento daria só 2,9:1 contra o trilho.
 *   A borda tira 2px da altura útil do preenchimento (h-2 = 8px, 6px livres).
 *   O Indicator do Base UI tem `height: inherit` e passa desses 6px, então o
 *   trilho corta os dois eixos (`overflow-hidden`): com só `overflow-x-hidden`
 *   o eixo vertical virava `auto` e o Chromium punha o trilho no Tab, sem nome.
 * - Movimento: a largura do preenchimento anima (`transition-all`) e para com
 *   movimento reduzido (`motion-reduce:transition-none`).
 * - O texto do ProgressValue usa `muted-foreground` (7,4:1 no branco, 8,1:1 no
 *   fundo escuro). Posição lógica: `ms-auto` e a barra cresce a partir do
 *   início, que em RTL é a direita. Para os números seguirem o idioma, passe
 *   `locale` no Progress.
 */
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-2 w-full items-center overflow-hidden rounded-2xl border border-input bg-background",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full bg-primary transition-all motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ms-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
