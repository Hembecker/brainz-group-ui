import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

/*
 * Slider — estrutura e API do shadcn/ui (versão Base UI):
 * https://ui.shadcn.com/docs/components/base/slider
 * As cores, o contraste e os tamanhos são os da Big Brain.
 * - Trilho e polegar com `rounded-full`: a forma não depende do raio da marca
 *   (com os 4px do SESI, o `rounded-2xl` do rhea deixava o polegar quadrado).
 * - Construído sobre o Slider do Base UI. Cada polegar é um `<input
 *   type="range">` oculto dentro de um `div`, com setas, Home/End e
 *   PageUp/PageDown de graça.
 * - Texto do valor (`aria-valuetext`): num intervalo de dois valores, o padrão
 *   do Base UI é "25 start range"/"50 end range", em inglês numa página pt-BR
 *   (WCAG 3.1.2). Aqui o padrão de dois valores é em português: "25 (início)"
 *   e "50 (fim)". Com um ou com três ou mais valores, vale o padrão do Base UI
 *   (o número, ou o `format`).
 * - `getAriaLabel` e `getAriaValueText`: acréscimo da Big Brain à API do
 *   shadcn, repassados a cada polegar (`Slider.Thumb` do Base UI). O
 *   `getAriaValueText` substitui o padrão acima (por exemplo, numa página em
 *   outra língua ou para "75%"). O `getAriaLabel` dá um nome por polegar e
 *   substitui o nome que viria do `aria-labelledby`: inclua nele o nome do
 *   campo ("Preço mínimo").
 * - Nome acessível: o polegar herda o nome do `aria-labelledby` do Slider.
 *   Aponte-o para um rótulo visível (`Label` com `id`). Um `aria-label` no
 *   Slider nomearia só o grupo, não o polegar.
 * - Contraste não textual (WCAG 1.4.11, mínimo 3:1). O registro pintava o
 *   trilho com `bg-input/90`; foi trocado pelo papel cheio `bg-input`:
 *   - trilho, claro: `input` (mist 500) 4,6:1 no branco (com /90 seria 3,8:1);
 *   - trilho, escuro: `input` (branco a 40%) 3,8:1 no fundo e no card;
 *   - polegar, claro: branco com contorno `input` (4,6:1 no branco). O registro
 *     usava `ring-black/10`, que não separava o polegar branco do fundo branco
 *     (1,1:1); sobre o trilho o polegar branco tem 4,6:1;
 *   - polegar, escuro: branco, 19,7:1 no fundo e 5,2:1 sobre o trilho;
 *   - preenchimento (`primary` 600): 5,2:1 no branco, 3,8:1 no fundo escuro e
 *     3,4:1 no card escuro. A diferença entre o trecho preenchido e o vazio é
 *     só de cor (1,1:1 entre eles): quem marca o valor é o polegar.
 * - Hover: contorno `primary` cheio de 2px (o registro usava `ring-ring/30`).
 * - Anel de foco sólido, 3px, no `ring`, afastado 2px pela cor do fundo, como no
 *   Button. O foco real está no `<input>` dentro do polegar, então o estilo usa
 *   `has-focus-visible:` (o `focus-visible:` do registro nunca disparava no
 *   `div`).
 * - Desabilitado: o `Control` apaga tudo em 50% (`data-disabled:opacity-50`) e o
 *   polegar só perde o ponteiro (`data-disabled:pointer-events-none`). O
 *   `disabled:opacity-50` do registro nunca disparava no `div`; trocá-lo por
 *   `data-disabled:` somaria 25% no polegar.
 * - RTL: o Base UI só inverte o eixo (setas, arraste e posição do polegar) pelo
 *   `DirectionProvider` (`@workspace/ui/components/direction`). O `dir` num
 *   ancestral espelha só o CSS: envolva o Slider no provider.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  getAriaValueText,
  ...props
}: SliderPrimitive.Root.Props &
  Pick<SliderPrimitive.Thumb.Props, "getAriaLabel" | "getAriaValueText">) {
  // Um número solto em `value`/`defaultValue` é um polegar só; o registro
  // caía em [min, max] e desenhava dois. Sem `value` nem `defaultValue`, o
  // Base UI guarda um valor só, em `min`, então também é um polegar só.
  const _values = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : Array.isArray(defaultValue)
        ? defaultValue
        : typeof defaultValue === "number"
          ? [defaultValue]
          : [min]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-input select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            getAriaLabel={getAriaLabel}
            getAriaValueText={
              getAriaValueText ??
              (_values.length === 2
                ? (formatado, _valor, i) =>
                    `${formatado} (${i === 0 ? "início" : "fim"})`
                : undefined)
            }
            className="block size-4 shrink-0 rounded-full bg-white shadow-md ring-1 ring-input transition-[color,box-shadow] duration-200 select-none not-dark:bg-clip-padding hover:ring-2 hover:ring-primary has-focus-visible:ring-3 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background data-disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
