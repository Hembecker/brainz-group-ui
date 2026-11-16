/*
 * Logo e símbolo da marca ativa, pelo registro de marcas (useBrand). Cada logo
 * segue o arquivo oficial da marca, com currentColor onde ele precisa
 * acompanhar o texto em volta (a tinta da Brainz Group; o SESI inteiro no
 * escuro), então acompanha a marca e o modo da barra de ferramentas.
 */
import type { BrandId } from "@workspace/ui/brand/brands"
import { useBrand } from "@workspace/ui/brand/use-brand"

import { DocsSurface } from "./color-scale"

/** De onde vem o logo oficial de cada marca e como ele usa as cores. */
const logoNotes: Record<BrandId, string> = {
  brainz:
    'gerado do SVG oficial (brand/brainz-group-logo.svg). "BRAINZ" usa currentColor; "GROUP" usa a Primária 500. O símbolo (brand/brainz-group-icon.svg) tem duas formas: uma com o gradiente da Primária 500 a #305BA3 e uma contornada na Primária 500.',
  sesi: 'gerado dos componentes oficiais do SI Design System (brand/sesi-logo.svg e brand/sesi-simbolo.svg). No claro, as cores do arquivo: "SESI" em #164194, o ponto do "I" na Pure #52AE32 e a assinatura em #575756. No escuro, a versão oficial Branco, em currentColor. O símbolo é o favicon oficial e mantém as cores nos dois modos.',
}

export function BrandLogos() {
  const brand = useBrand()
  const { Logo, Mark } = brand
  return (
    <DocsSurface className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-2">
          <p className="text-sm font-medium">Logo (Logo)</p>
          <Logo
            title={brand.name}
            className="h-8 w-auto max-w-full text-foreground"
          />
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
          : `${brand.name}: ${logoNotes[brand.id]}`}
      </p>
    </DocsSurface>
  )
}
