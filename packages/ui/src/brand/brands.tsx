/*
 * Registro de marcas. As cores e a fonte de cada marca ficam no globals.css
 * (camada de marca, `:root[data-brand="<id>"]`); aqui fica o que o CSS não
 * carrega: nome, logo, símbolo e se a marca é ilustrativa (cores, fonte ou
 * logo fora do material oficial).
 *
 * Para adicionar uma marca: um bloco `:root[data-brand="<id>"]` no
 * globals.css com a escala Primária (uma cor só) que cumpre o contrato de
 * contraste, e uma entrada aqui. Nenhum componente muda.
 */
import * as React from "react"

import { BrainzLogo, BrainzMark } from "./brainz-logo"
import { SesiLogo, SesiMark } from "./sesi-logo"

export type BrandId = "brainz" | "sesi"

type LogoComponent = React.ComponentType<
  React.ComponentProps<"svg"> & { title?: string }
>

export interface BrandDefinition {
  id: BrandId
  /** Nome exibido (logo, título, seletor de marca). */
  name: string
  /** Uma frase sobre a origem dos valores, para a documentação. */
  description: string
  /** true quando cores, fonte ou logo não vêm de um material oficial. */
  illustrative: boolean
  /** Logo completo; usa currentColor para a parte em tinta. */
  Logo: LogoComponent
  /** Símbolo, para espaços pequenos. */
  Mark: LogoComponent
  /**
   * Como a marca aparece no cabeçalho dos blocos (Dashboard, Login e
   * Cadastro): "mark" é o símbolo com o nome em texto; "logo" é o logo
   * completo, que já traz o nome (o nome continua para o leitor de tela, em
   * texto `sr-only`). Com a barra do Dashboard recolhida, vale o símbolo.
   */
  headerLogo: "mark" | "logo"
}

export const defaultBrandId: BrandId = "brainz"

export const brands: Record<BrandId, BrandDefinition> = {
  brainz: {
    id: "brainz",
    name: "Brainz Group",
    description:
      "Marca padrão. Uma cor só: a Primária da paleta oficial (brand/paleta-primaria.png, base 500 = #4787F0).",
    illustrative: false,
    Logo: BrainzLogo,
    Mark: BrainzMark,
    headerLogo: "mark",
  },
  sesi: {
    id: "sesi",
    name: "SESI",
    description:
      "Tokens oficiais do SI Design System (Sistema Indústria): uma cor só, o verde (Pure #52AE32), neutros, vermelho de erro, Inter, raio de 4px e o fundo da página #F9FFF9. O logo e o símbolo são os oficiais do SI DS (brand/sesi-logo.svg e brand/sesi-simbolo.svg).",
    illustrative: false,
    Logo: SesiLogo,
    Mark: SesiMark,
    // O SESI aparece com o logo colorido completo nos cabeçalhos (pedido do
    // usuário em 2026-11-16); o favicon fica para a barra recolhida.
    headerLogo: "logo",
  },
}

export const brandList = Object.values(brands)
