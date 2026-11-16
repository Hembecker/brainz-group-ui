/*
 * Logo e símbolo da marca ativa, pelo registro de marcas (useBrand). As cores
 * do logo vêm da camada de marca e a parte em tinta usa currentColor, então
 * ele acompanha a marca e o modo da barra de ferramentas.
 */
import { useBrand } from "@workspace/ui/brand/use-brand"

import { DocsSurface } from "./color-scale"

export function BrandLogos() {
  const brand = useBrand()
  const { Logo, Mark } = brand
  return (
    <DocsSurface className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-2">
          <p className="text-sm font-medium">Logo (Logo)</p>
          <Logo title={brand.name} className="h-8 w-auto max-w-full text-foreground" />
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium">Símbolo (Mark)</p>
          <div className="flex items-end gap-3">
            <Mark className="size-12" />
            <Mark className="size-8" />
            <Mark className="size-5" />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {brand.illustrative
          ? `${brand.name}: logo GENÉRICO de exemplo (inicial num quadrado e o nome na fonte da marca). Não é o logo oficial.`
          : `${brand.name}: gerado do SVG oficial (brand/brainz-group-logo.svg). "BRAINZ" usa currentColor; "GROUP" usa a Primária 500 e o símbolo, um gradiente da Primária 500 a #305BA3, como no arquivo.`}
      </p>
    </DocsSurface>
  )
}
