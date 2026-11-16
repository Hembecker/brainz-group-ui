/*
 * Marca ativa: lê o atributo `data-brand` do <html> e acompanha as trocas.
 *
 * As cores e a fonte trocam sozinhas pelo CSS (a camada de marca do
 * globals.css). O que o CSS não troca, como o logo e as imagens dos blocos,
 * sai do registro de marcas (brands.tsx) pela marca que este hook devolve.
 * Sem atributo, ou com um valor desconhecido, vale a marca padrão.
 */
import * as React from "react"

import { brands, defaultBrandId, type BrandId } from "./brands"

const ATTRIBUTE = "data-brand"

function readBrand(): BrandId {
  if (typeof document === "undefined") return defaultBrandId
  const value = document.documentElement.getAttribute(ATTRIBUTE)
  // `Object.hasOwn`, e não `in`: o `in` aceitaria chaves herdadas do
  // Object.prototype ("toString", "constructor"), que não são marcas.
  return value && Object.hasOwn(brands, value)
    ? (value as BrandId)
    : defaultBrandId
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ATTRIBUTE],
  })
  return () => observer.disconnect()
}

/** Id da marca ativa no <html>. */
export function useBrandId(): BrandId {
  return React.useSyncExternalStore(subscribe, readBrand, () => defaultBrandId)
}

/** Definição completa da marca ativa (nome, logo, símbolo, imagem). */
export function useBrand() {
  return brands[useBrandId()]
}

/** Troca a marca ativa: grava `data-brand` no <html>. */
export function setBrand(id: BrandId) {
  document.documentElement.setAttribute(ATTRIBUTE, id)
}
