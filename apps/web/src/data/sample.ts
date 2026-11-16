import {
  BellIcon,
  ChartColumnIcon,
  FrameIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MapIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react"

import type {
  DashboardMenuGroup,
  DashboardNavItem,
  DashboardProject,
  DashboardUser,
} from "@workspace/ui/blocks/dashboard"

import { href } from "@/lib/use-hash-route"

/*
 * Dados de exemplo do app de demonstração. Ficam só aqui: os blocos do
 * @workspace/ui não têm dados nem regras de negócio.
 */

export interface DemoPage {
  title: string
  description: string
}

/** Páginas da área logada, pelo caminho do hash. */
export const demoPages: Record<string, DemoPage> = {
  "/": {
    title: "Visão geral",
    description: "Um resumo do que aconteceu na sua conta nesta semana.",
  },
  "/relatorios/vendas": {
    title: "Vendas",
    description: "Relatório de vendas por período.",
  },
  "/relatorios/financeiro": {
    title: "Financeiro",
    description: "Entradas, saídas e saldo do mês.",
  },
  "/equipe": {
    title: "Equipe",
    description: "As pessoas que têm acesso a esta conta.",
  },
  "/configuracoes": {
    title: "Configurações",
    description: "Preferências da conta e das notificações.",
  },
  "/projetos/site": {
    title: "Site institucional",
    description: "Projeto de exemplo.",
  },
  "/projetos/aplicativo": {
    title: "Aplicativo",
    description: "Projeto de exemplo.",
  },
  "/suporte": {
    title: "Suporte",
    description: "Fale com a equipe de suporte.",
  },
  "/notificacoes": {
    title: "Notificações",
    description: "Avisos recentes da sua conta.",
  },
}

/** Navegação principal; `isActive` marca a página atual. */
export function demoNavMain(path: string): DashboardNavItem[] {
  return [
    { title: "Início", url: href("/"), icon: HomeIcon, isActive: path === "/" },
    {
      title: "Relatórios",
      url: href("/relatorios/vendas"),
      icon: ChartColumnIcon,
      items: [
        {
          title: "Vendas",
          url: href("/relatorios/vendas"),
          isActive: path === "/relatorios/vendas",
        },
        {
          title: "Financeiro",
          url: href("/relatorios/financeiro"),
          isActive: path === "/relatorios/financeiro",
        },
      ],
    },
    {
      title: "Equipe",
      url: href("/equipe"),
      icon: UsersIcon,
      isActive: path === "/equipe",
    },
    {
      title: "Configurações",
      url: href("/configuracoes"),
      icon: Settings2Icon,
      isActive: path === "/configuracoes",
    },
  ]
}

export function demoProjects(path: string): DashboardProject[] {
  return [
    {
      name: "Site institucional",
      url: href("/projetos/site"),
      icon: FrameIcon,
      isActive: path === "/projetos/site",
    },
    {
      name: "Aplicativo",
      url: href("/projetos/aplicativo"),
      icon: MapIcon,
      isActive: path === "/projetos/aplicativo",
    },
  ]
}

export function demoNavSecondary(path: string): DashboardNavItem[] {
  return [
    {
      title: "Suporte",
      url: href("/suporte"),
      icon: LifeBuoyIcon,
      isActive: path === "/suporte",
    },
  ]
}

export const demoUser: DashboardUser = {
  name: "Maria Souza",
  email: "maria@example.com",
}

export const demoUserMenu: DashboardMenuGroup[] = [
  [{ label: "Notificações", icon: BellIcon, href: href("/notificacoes") }],
  [{ label: "Sair", icon: LogOutIcon, href: href("/login") }],
]

/** Números do resumo da Visão geral. */
export const demoSummary = [
  {
    label: "Pedidos na semana",
    value: "128",
    detail: "12 a mais que na anterior",
  },
  { label: "Clientes ativos", value: "86", detail: "4 novos nesta semana" },
  {
    label: "Tíquete médio",
    value: "R$ 214",
    detail: "Estável em relação ao mês",
  },
]
