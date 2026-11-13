import * as React from "react"

/*
 * useIsMobile — hook do registro do shadcn, reescrito com
 * useSyncExternalStore: o original chamava setState dentro de um efeito, o
 * que a regra react-hooks/set-state-in-effect reprova.
 */
const MOBILE_BREAKPOINT = 768
const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
