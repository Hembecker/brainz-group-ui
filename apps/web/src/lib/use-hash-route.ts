import * as React from "react"

/*
 * Navegação por hash, sem roteador: `#/` (dashboard), `#/login`,
 * `#/cadastro`. O caminho vem do `location.hash`; sem hash, vale "/".
 * Num projeto real, troque por um roteador e passe o `Link` dele aos blocos
 * (`renderLink` no Dashboard).
 */
function readPath() {
  const path = window.location.hash.replace(/^#/, "")
  return path.startsWith("/") ? path : "/"
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

/** Caminho atual da navegação por hash ("/", "/login", "/cadastro"…). */
export function useHashPath() {
  return React.useSyncExternalStore(subscribe, readPath, () => "/")
}

/** Navega para um caminho ("/login" vira `#/login`). */
export function navigate(path: string) {
  window.location.hash = path
}

/** `href` de um caminho, para os links dos blocos. */
export function href(path: string) {
  return `#${path}`
}
