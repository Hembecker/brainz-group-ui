/*
 * Dados estáticos das páginas Temas e Tipografia.
 *
 * Os valores das marcas foram COPIADOS de packages/ui/src/styles/globals.css
 * (camada de marca). Servem só para mostrar as marcas lado a lado, porque os
 * papéis resolvem no :root e uma marca inativa não pode ser lida do CSS.
 * As amostras ao vivo (LiveScale) comparam a marca ativa com esta tabela e
 * avisam quando um valor daqui ficou desatualizado.
 */
import type { BrandId } from "@workspace/ui/brand/brands"

export const scaleSteps = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const

export type ScaleStep = (typeof scaleSteps)[number]

/** Cada marca tem uma cor só: a escala Primária. */
export interface BrandPrimitives {
  primary: Record<ScaleStep, string>
  /** O passo da Primária que guarda a cor da marca. */
  primaryBase: ScaleStep
  ink: string
  fontSans: string
  /** Observação sobre a origem da escala. */
  source: string
}

export const brandPrimitives: Record<BrandId, BrandPrimitives> = {
  brainz: {
    primary: {
      "100": "#dfeafd",
      "200": "#bfd5fb",
      "300": "#97bcf8",
      "400": "#6da1f4",
      "500": "#4787f0",
      "600": "#2568d8",
      "700": "#1e53af",
      "800": "#1b448d",
      "900": "#1b3b74",
    },
    primaryBase: "500",
    ink: "#1d1d1b",
    fontSans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    source:
      "Oficial: brand/paleta-primaria.png (base 500 = #4787F0). Uma cor só; o #305BA3 aparece apenas como fim do gradiente do logo.",
  },
  sesi: {
    primary: {
      "100": "#edf8ea",
      "200": "#cbecc8",
      "300": "#a2dda1",
      "400": "#75c459",
      "500": "#52ae32",
      "600": "#419128",
      "700": "#356e21",
      "800": "#095840",
      "900": "#05483b",
    },
    primaryBase: "500",
    ink: "#262626",
    fontSans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    source:
      "Oficial: SI Design System (Colors/Brand/SESI/100–900, Pure = 500 = #52AE32), lido no Figma em 2026-11-16. A escala não cumpre o contrato por passo (branco na 600 dá 3,96:1), por isso o SESI sobrescreve alguns papéis.",
  },
}

/** Qual passo da escala cada papel de marca usa, no claro e no escuro. */
export interface RoleMapping {
  token: string
  light: string
  dark: string
  usage: string
}

export const brandRoleMap: RoleMapping[] = [
  {
    token: "--primary",
    light: "Primária 600",
    dark: "Primária 600",
    usage: "Ação primária (Button padrão, Switch ligado, Checkbox marcado).",
  },
  {
    token: "--primary-hover",
    light: "Primária 700",
    dark: "Primária 700",
    usage: "Hover da ação primária.",
  },
  {
    token: "--primary-pressed",
    light: "Primária 800",
    dark: "Primária 800",
    usage: "Ação primária pressionada.",
  },
  {
    token: "--secondary",
    light: "Primária 100",
    dark: "Primária 900",
    usage:
      "Superfície secundária (Button e Badge secondary): um tom da própria Primária.",
  },
  {
    token: "--secondary-foreground",
    light: "Primária 800",
    dark: "Primária 100",
    usage: "Texto e ícones sobre o secondary.",
  },
  {
    token: "--secondary-hover",
    light: "Primária 200",
    dark: "Primária 800",
    usage: "Hover do secondary.",
  },
  {
    token: "--ring",
    light: "Primária 600",
    dark: "Primária 400",
    usage:
      "Anel de foco de todos os controles. No claro é a 600 desde 2026-11-16 (a 500 tinha 2,81:1 no fundo do campo).",
  },
  {
    token: "--link",
    light: "Primária 600",
    dark: "Primária 300",
    usage: "Texto de link (Button link, links em texto).",
  },
  {
    token: "--link-hover",
    light: "Primária 800",
    dark: "Primária 200",
    usage: "Hover do link.",
  },
  {
    token: "--chart-1 a --chart-5",
    light: "Primária 500 a 900",
    dark: "Primária 200 a 600",
    usage: "Séries dos gráficos (Chart).",
  },
  {
    token: "--sidebar-primary",
    light: "Primária 600",
    dark: "Primária 600",
    usage:
      "Papel do tema do shadcn para destaque de marca na barra lateral. Nenhum componente nem bloco daqui o usa hoje.",
  },
  {
    token: "--sidebar-ring",
    light: "Primária 600",
    dark: "Primária 400",
    usage: "Anel de foco dentro da barra lateral.",
  },
]

/**
 * Papéis que o SESI sobrescreve no bloco dele (globals.css, "SESI — papéis").
 * Os demais seguem as tabelas acima. "—" = igual à Brainz Group.
 */
export const sesiRoleOverrides: RoleMapping[] = [
  {
    token: "--primary / --sidebar-primary",
    light: "Primária 700, texto branco",
    dark: "Primária 500 (Pure), texto mist 950",
    usage:
      "No claro, branco na Pure dá 2,8:1 e na 600 3,96:1; na 700, 6,17:1. No escuro, a 700 teria só 2,82:1 no card (Checkbox, Switch, dia do Calendar); a Pure com texto escuro dá 7,0:1 de texto e 6,17:1 no card.",
  },
  {
    token: "--primary-hover / --primary-pressed",
    light: "Primária 800 / 900",
    dark: "Primária 400 / 600",
    usage:
      "No claro, 8,46:1 e 10,52:1 com branco; no escuro, 9,2:1 e 4,98:1 com o texto mist 950.",
  },
  {
    token: "--primary-foreground / --sidebar-primary-foreground",
    light: "—",
    dark: "mist 950",
    usage:
      "Texto escuro sobre a Pure, como o --destructive-foreground do escuro.",
  },
  {
    token: "--ring / --sidebar-ring",
    light: "rosa Highlights/600 (#CA588A)",
    dark: "rosa Highlights/300 (#FCC0DA)",
    usage:
      "Rosa, como o foco do SI DS (o #F673AD oficial tem 2,63:1). No claro, 3,92:1 no fundo e 3,98:1 no card; no escuro, 12,9:1 no fundo e 11,3:1 no card.",
  },
  {
    token: "--link / --link-hover",
    light: "Primária 700 / 900",
    dark: "—",
    usage: "6,17:1 e 10,52:1 no branco.",
  },
  {
    token: "--chart-1 a --chart-5",
    light: "Primária 600 a 900 e Neutral/600",
    dark: "—",
    usage:
      "Só 600 a 900 passam de 3:1 no branco; a quinta série é o cinza #646464.",
  },
  {
    token:
      "--foreground, --card-foreground, --popover-foreground, --accent-foreground, --sidebar-foreground, --sidebar-accent-foreground",
    light: "Neutral 900 (#262626)",
    dark: "—",
    usage:
      "Texto principal: 14,9:1 no fundo; 15,1:1 no card; 13,5:1 na Neutral 200.",
  },
  {
    token: "--muted, --accent, --sidebar-accent",
    light: "Neutral 200 (#F2F2F2)",
    dark: "—",
    usage: "Superfícies discretas.",
  },
  {
    token: "--muted-foreground",
    light: "Neutral 600 (#646464)",
    dark: "—",
    usage: "Texto de apoio e placeholder: 5,8:1 no fundo; 5,3:1 na muted.",
  },
  {
    token: "--border, --sidebar-border",
    light: "Neutral 300 (#DFDFDF)",
    dark: "—",
    usage: "Bordas decorativas (1,33:1), como no SI DS.",
  },
  {
    token: "--background",
    light: "Background/SESI/500 (#F9FFF9)",
    dark: "—",
    usage: "O fundo esverdeado do SI DS; card, popover e campo seguem brancos.",
  },
  {
    token: "--field / --field-border",
    light: "branco / Neutral 300 (#DFDFDF)",
    dark: "—",
    usage:
      "Campo branco com a borda oficial do SI DS: 1,33:1 no branco, abaixo dos 3:1 de um limite de campo (escolha do usuário, como o campo da Brainz).",
  },
  {
    token: "--input",
    light: "Neutral 600 (#646464)",
    dark: "—",
    usage:
      "Borda de controle (Button outline, Toggle, InputOTP): 5,8:1 no fundo.",
  },
  {
    token: "--destructive / --destructive-hover",
    light: "Error 700 / 800",
    dark: "—",
    usage:
      "A Error/Dark do SI DS (#FC4242) dá 3,5:1 com branco; a 700, 4,69:1.",
  },
  {
    token: "--radius",
    light: "0.1389rem",
    dark: "0.1389rem",
    usage:
      "4px nos campos e nos botões (rounded-2xl); o raio é um só, então o Card fica com ~5,8px.",
  },
]

export const neutralRoleMap: RoleMapping[] = [
  {
    token: "--background",
    light: "branco",
    dark: "mist 950",
    usage: "Fundo da página.",
  },
  {
    token: "--foreground",
    light: "mist 950",
    dark: "mist 50",
    usage: "Texto principal.",
  },
  {
    token: "--card / --popover",
    light: "branco",
    dark: "mist 900",
    usage: "Cartões, menus e diálogos.",
  },
  {
    token: "--muted / --accent",
    light: "mist 100",
    dark: "mist 800",
    usage: "Superfícies discretas e destaque de itens de menu.",
  },
  {
    token: "--muted-foreground",
    light: "mist 600 (A11Y)",
    dark: "mist 400",
    usage: "Texto de apoio (descrições, placeholders).",
  },
  {
    token: "--border",
    light: "mist 200",
    dark: "branco a 10%",
    usage: "Bordas decorativas.",
  },
  {
    token: "--input",
    light: "mist 500 (A11Y)",
    dark: "branco a 40% (A11Y)",
    usage: "Borda de controle (Button outline, Toggle, InputOTP, Progress).",
  },
  {
    token: "--field",
    light: "mist 200",
    dark: "mist 800",
    usage: "Fundo dos campos (Input, Select, Textarea).",
  },
  {
    token: "--field-border",
    light: "transparente",
    dark: "transparente",
    usage:
      "Borda dos campos. Transparente na Brainz Group (campo preenchido, sem borda); o SESI a usa.",
  },
  {
    token: "--destructive",
    light: "red 600",
    dark: "red 400",
    usage: "Ações destrutivas e erros (PROVISÓRIO).",
  },
  {
    token: "--sidebar",
    light: "mist 50",
    dark: "mist 900",
    usage: "Fundo da barra lateral.",
  },
]

/**
 * Pares medidos ao vivo na tabela de tokens semânticos. `against` é o fundo
 * (ou o texto) contra o qual o papel é medido; `min` é o mínimo WCAG
 * (4,5 texto, 3 não texto); sem `min`, o papel é decorativo ou foi uma escolha
 * anotada no globals.css. `notes` traz os números anotados no globals.css para
 * a Brainz Group (claro / escuro).
 */
export interface ContrastPair {
  token: string
  against: string
  label: string
  min?: number
  /** Texto exibido no lugar de "decorativo" quando o par não tem mínimo. */
  status?: string
  notes: string
}

export const contrastPairs: ContrastPair[] = [
  {
    token: "--foreground",
    against: "--background",
    label: "texto no fundo",
    min: 4.5,
    notes: "19,7:1 / 19,0:1",
  },
  {
    token: "--muted-foreground",
    against: "--background",
    label: "texto de apoio no fundo",
    min: 4.5,
    notes: "7,4:1 / 8,1:1",
  },
  {
    token: "--muted-foreground",
    against: "--muted",
    label: "texto de apoio na muted",
    min: 4.5,
    notes: "6,6:1 / 6,1:1",
  },
  {
    token: "--primary-foreground",
    against: "--primary",
    label: "texto na primary",
    min: 4.5,
    notes: "5,2:1 / 5,2:1",
  },
  {
    token: "--primary-foreground",
    against: "--primary-hover",
    label: "texto na primary-hover",
    min: 4.5,
    notes: "7,2:1 / 7,2:1",
  },
  {
    token: "--secondary-foreground",
    against: "--secondary",
    label: "texto na secondary",
    min: 4.5,
    notes: "7,7:1 / 9,0:1",
  },
  {
    token: "--secondary-foreground",
    against: "--secondary-hover",
    label: "texto na secondary-hover",
    min: 4.5,
    notes: "6,3:1 / 7,7:1",
  },
  {
    token: "--primary",
    against: "--card",
    label: "primária no card (Checkbox marcado, Switch ligado)",
    min: 3,
    notes: "5,2:1 / 3,35:1",
  },
  {
    token: "--link",
    against: "--background",
    label: "link no fundo",
    min: 4.5,
    notes: "5,2:1 / 10,2:1",
  },
  {
    token: "--ring",
    against: "--background",
    label: "anel de foco no fundo",
    min: 3,
    notes: "5,2:1 / 7,6:1",
  },
  {
    token: "--ring",
    against: "--card",
    label: "anel de foco no card",
    min: 3,
    notes: "5,2:1 / 6,7:1",
  },
  {
    token: "--sidebar-ring",
    against: "--sidebar",
    label: "anel de foco na barra lateral",
    min: 3,
    notes: "5,0:1 / 6,7:1",
  },
  {
    token: "--input",
    against: "--background",
    label: "borda de controle no fundo",
    min: 3,
    notes: "4,6:1 / 3,8:1",
  },
  {
    token: "--destructive",
    against: "--background",
    label: "texto de erro no fundo (FieldError)",
    min: 4.5,
    notes: "4,8:1 / 6,8:1",
  },
  {
    token: "--chart-1",
    against: "--background",
    label: "série 1 no fundo",
    min: 3,
    notes: "3,5:1 / 13,3:1",
  },
  {
    token: "--chart-2",
    against: "--background",
    label: "série 2 no fundo",
    min: 3,
    notes: "5,2:1 / 10,2:1",
  },
  {
    token: "--chart-3",
    against: "--background",
    label: "série 3 no fundo",
    min: 3,
    notes: "7,2:1 / 7,6:1",
  },
  {
    token: "--chart-4",
    against: "--background",
    label: "série 4 no fundo",
    min: 3,
    notes: "9,3:1 / 5,6:1",
  },
  {
    token: "--chart-5",
    against: "--background",
    label: "série 5 no fundo",
    min: 3,
    notes: "10,9:1 / 3,8:1",
  },
  {
    token: "--sidebar-primary-foreground",
    against: "--sidebar-primary",
    label: "papel do tema, sem uso hoje",
    min: 4.5,
    notes: "5,2:1 / 5,2:1",
  },
  {
    token: "--border",
    against: "--background",
    label: "borda decorativa",
    notes: "1,2:1 / ~1,25:1 (decorativa)",
  },
  {
    token: "--field",
    against: "--background",
    label: "limite do campo preenchido",
    status: "escolha do usuário (A11Y)",
    notes: "1,25:1 / 1,33:1 (escolha do usuário, A11Y)",
  },
  {
    token: "--field-border",
    against: "--background",
    label: "borda do campo (o limite quando o campo não tem preenchimento)",
    status: "escolha do usuário (A11Y)",
    notes:
      "transparente nos dois modos (SESI claro: 1,31:1, escolha do usuário)",
  },
]
