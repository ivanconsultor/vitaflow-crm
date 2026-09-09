import {
  Users, TrendingUp, Calendar, Target,
  Sparkles, DollarSign, PenTool, BarChart, Link2, Kanban,
  Mail, Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MenuItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export type MenuGroup = {
  badge: "C1" | "C2" | "C3" | "C4";
  title: string;
  path: string;
  items: MenuItem[];
};

/**
 * Estrutura unica do menu. A Sidebar desenha a navegacao a partir daqui e o
 * Header tira daqui o titulo de cada tela — assim uma tela nova entra no menu
 * e ja aparece com o nome certo na barra de cima, sem lista paralela pra manter.
 */
export const menuGroups: MenuGroup[] = [
  {
    badge: "C1",
    title: "Configuração",
    path: "/c1",
    items: [
      { name: "OKR", path: "/", icon: Target },
      { name: "Analytics Global", path: "/analytics", icon: BarChart },
      { name: "CRM Leads", path: "/crm", icon: Users },
      { name: "CRM Prospects", path: "/prospectos", icon: Kanban },
      { name: "Integrações", path: "/integracoes", icon: Link2 },
    ],
  },
  {
    badge: "C2",
    title: "Captação",
    path: "/c2",
    items: [
      { name: "Gestão de Campanhas", path: "/campanhas", icon: Megaphone },
      { name: "Ads & IA", path: "/ads", icon: Sparkles },
      { name: "Landing Pages", path: "/capture", icon: Target },
    ],
  },
  {
    badge: "C3",
    title: "Conexão",
    path: "/c3",
    items: [
      { name: "Newsletter", path: "/newsletter", icon: Mail },
      { name: "Conteúdos", path: "/conteudo", icon: PenTool },
      { name: "Calendário", path: "/editorial", icon: Calendar },
    ],
  },
  {
    badge: "C4",
    title: "Conversão",
    path: "/c4",
    items: [
      { name: "Kanban Vendas", path: "/kambam-vendas", icon: Kanban },
      { name: "Funil", path: "/funnels", icon: TrendingUp },
      { name: "Vendas", path: "/vendas", icon: DollarSign },
    ],
  },
];

export type PageInfo = { title: string; subtitle: string };

/**
 * Titulos que nao vem do nome do link no menu.
 * - "/" e "/funnels" ja tinham titulo proprio no Header e foram preservados.
 * - "/ads/criativos" nao esta no menu; o texto vem do proprio <h1> da pagina.
 */
const titulosProprios: Record<string, PageInfo> = {
  "/": { title: "Dashboard Geral", subtitle: "Gestao de metas e OKRs do negocio" },
  "/funnels": { title: "Funil", subtitle: "Modulo 4 - Mapa visual e conversao de funis (C4)" },
  "/ads/criativos": { title: "Gerador & Lançador de Campanhas", subtitle: "Módulo C2 · Captação" },
};

const PADRAO: PageInfo = { title: "Sistema", subtitle: "Metodo 4Cs com IA" };

export function getPageInfo(pathname: string | null): PageInfo {
  if (!pathname) return PADRAO;

  const proprio = titulosProprios[pathname];
  if (proprio) return proprio;

  // Capa de modulo: /c1, /c2, /c3, /c4
  const grupo = menuGroups.find((g) => g.path === pathname);
  if (grupo) {
    return { title: grupo.title, subtitle: `Módulo ${grupo.badge} · Visão geral` };
  }

  // Tela do menu
  for (const g of menuGroups) {
    const item = g.items.find((i) => i.path === pathname);
    if (item) {
      return { title: item.name, subtitle: `Módulo ${g.badge} · ${g.title}` };
    }
  }

  // Sub-rota (ex.: /ads/xyz): herda o nome da tela pai
  for (const g of menuGroups) {
    const pai = g.items.find((i) => i.path !== "/" && pathname.startsWith(`${i.path}/`));
    if (pai) {
      return { title: pai.name, subtitle: `Módulo ${g.badge} · ${g.title}` };
    }
  }

  return PADRAO;
}
