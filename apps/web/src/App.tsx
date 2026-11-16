import * as React from "react"

import { demoPages } from "@/data/sample"
import { useHashPath } from "@/lib/use-hash-route"
import { DashboardPage } from "@/pages/dashboard-page"
import { DemoLoginPage, DemoSignupPage } from "@/pages/auth-pages"

/*
 * Demonstração dos blocos do @workspace/ui em Vite, com navegação por hash:
 * `#/` e as outras páginas da área logada → Dashboard; `#/login` → Login;
 * `#/cadastro` → Cadastro. O modo escuro é o do ThemeProvider
 * (Alt+Shift+D).
 *
 * Foco: a cada troca de página (não na primeira carga), o foco vai para o
 * título (`h1`) da página nova, com `tabIndex=-1`. Sem isso, entrar pelo
 * Login desmontaria o botão focado e o foco cairia no <body>, sem nada que
 * anunciasse a página nova. O anel é o do navegador: o título não é um
 * controle. No celular, o Sheet da barra fecha e devolve o foco ao gatilho.
 */
export function App() {
  const path = useHashPath()
  // O caminho anterior, e não um "primeira vez": no StrictMode o efeito roda
  // duas vezes na montagem com o mesmo caminho.
  const previousPath = React.useRef<string | null>(null)

  React.useEffect(() => {
    const title =
      path === "/login"
        ? "Entrar"
        : path === "/cadastro"
          ? "Criar conta"
          : (demoPages[path]?.title ?? "Página não encontrada")
    document.title = `${title} · Brainz Group UI`

    const previous = previousPath.current
    previousPath.current = path
    if (previous === null || previous === path) return

    window.scrollTo(0, 0)
    const heading = document.querySelector<HTMLElement>("main h1")
    if (heading) {
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
    }
  }, [path])

  if (path === "/login") return <DemoLoginPage />
  if (path === "/cadastro") return <DemoSignupPage />
  return <DashboardPage path={path} />
}
