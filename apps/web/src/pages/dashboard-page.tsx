import * as React from "react"
import { MoonIcon, PaletteIcon } from "lucide-react"

import { authLinkClassName } from "@workspace/ui/blocks/auth-layout"
import { DashboardLayout } from "@workspace/ui/blocks/dashboard"
import { brands } from "@workspace/ui/brand/brands"
import { setBrand, useBrandId } from "@workspace/ui/brand/use-brand"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { useSidebar } from "@workspace/ui/components/sidebar"

import { useTheme } from "@/components/theme-provider"
import {
  demoNavMain,
  demoNavSecondary,
  demoPages,
  demoProjects,
  demoSummary,
  demoUser,
  demoUserMenu,
} from "@/data/sample"
import { href } from "@/lib/use-hash-route"

/*
 * No celular a barra é um Sheet, e a navegação por hash não remonta o
 * layout: fecha o Sheet quando o caminho muda (o bloco não fecha sozinho).
 */
function CloseMobileSidebarOnNavigate({ path }: { path: string }) {
  const { setOpenMobile } = useSidebar()
  React.useEffect(() => {
    setOpenMobile(false)
  }, [path, setOpenMobile])
  return null
}

/* Modo escuro e marca, para ver os blocos seguirem o tema. */
function DemoControls() {
  const { setTheme } = useTheme()
  const brandId = useBrandId()
  const nextBrand = brandId === "brainz" ? brands.sesi : brands.brainz

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setTheme(
            document.documentElement.classList.contains("dark")
              ? "light"
              : "dark"
          )
        }
      >
        <MoonIcon aria-hidden="true" data-icon="inline-start" />
        Alternar modo escuro
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setBrand(nextBrand.id)}
      >
        <PaletteIcon aria-hidden="true" data-icon="inline-start" />
        Usar a marca {nextBrand.name}
      </Button>
    </div>
  )
}

export function DashboardPage({ path }: { path: string }) {
  const page = demoPages[path]
  const title = page?.title ?? "Página não encontrada"

  return (
    <DashboardLayout
      brand={{ href: href("/") }}
      navMain={demoNavMain(path)}
      projects={demoProjects(path)}
      navSecondary={demoNavSecondary(path)}
      user={demoUser}
      userMenu={demoUserMenu}
      breadcrumbs={
        path === "/"
          ? [{ label: title }]
          : [{ label: "Início", href: href("/") }, { label: title }]
      }
    >
      <CloseMobileSidebarOnNavigate path={path} />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {page?.description ?? (
            <>
              Este endereço não existe na demonstração.{" "}
              <a href={href("/")} className={authLinkClassName}>
                Voltar para a visão geral
              </a>
              .
            </>
          )}
        </p>
      </div>
      {path === "/" ? (
        <div className="grid gap-4 md:grid-cols-3">
          {demoSummary.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-3xl">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Sobre esta demonstração</CardTitle>
          <CardDescription>
            Os blocos do @workspace/ui com dados de exemplo do apps/web.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p>
            A navegação usa o hash do endereço, sem roteador. Veja também as
            páginas de{" "}
            <a href={href("/login")} className={authLinkClassName}>
              login
            </a>{" "}
            e de{" "}
            <a href={href("/cadastro")} className={authLinkClassName}>
              cadastro
            </a>
            .
          </p>
          <p className="text-muted-foreground">
            Pressione <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> (no Mac,{" "}
            <kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>) para alternar o
            modo escuro.
          </p>
          <DemoControls />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
