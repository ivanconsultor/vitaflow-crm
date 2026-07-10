"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, TrendingUp, Calendar, Target, 
  Sparkles, DollarSign, PenTool, BarChart, Link2, Kanban,
  ChevronDown, ChevronRight, Mail, LogOut, Megaphone
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const menuGroups = [
    {
      badge: "C1",
      badgeClass: styles.badgeC1,
      title: "Configuração",
      path: "/c1",
      items: [
        { name: "OKR VFlow", path: "/", icon: Target },
        { name: "Analytics Global", path: "/analytics", icon: BarChart },
        { name: "CRM Leads", path: "/crm", icon: Users },
        { name: "CRM Prospects", path: "/prospectos", icon: Kanban },
        { name: "Integrações", path: "/integracoes", icon: Link2 },
      ]
    },
    {
      badge: "C2",
      badgeClass: styles.badgeC2,
      title: "Captação",
      path: "/c2",
      items: [
        { name: "Gestão de Campanhas", path: "/campanhas", icon: Megaphone },
        { name: "Ads & IA", path: "/ads", icon: Sparkles },
        { name: "Landing Pages", path: "/capture", icon: Target },
      ]
    },
    {
      badge: "C3",
      badgeClass: styles.badgeC3,
      title: "Conexão",
      path: "/c3",
      items: [
        { name: "Newsletter", path: "/newsletter", icon: Mail },
        { name: "Conteúdos", path: "/conteudo", icon: PenTool },
        { name: "Calendário", path: "/editorial", icon: Calendar },
      ]
    },
    {
      badge: "C4",
      badgeClass: styles.badgeC4,
      title: "Conversão",
      path: "/c4",
      items: [
        { name: "Kanban Vendas", path: "/kambam-vendas", icon: Kanban },
        { name: "Funis", path: "/funnels", icon: TrendingUp },
        { name: "Vendas", path: "/vendas", icon: DollarSign },
      ]
    }
  ];

  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  useEffect(() => {
    // Abrir automaticamente o grupo que contém a rota atual
    const activeGroup = menuGroups.find(g => g.items.some(i => i.path === pathname) || g.path === pathname);
    if (activeGroup && !openGroups.includes(activeGroup.title)) {
      setOpenGroups(prev => [...prev, activeGroup.title]);
    }
  }, [pathname]);

  const handleGroupClick = (group: any, e: React.MouseEvent) => {
    // Se clicou na seta, apenas abre/fecha o menu
    if ((e.target as HTMLElement).closest('.group-toggle-icon')) {
      setOpenGroups(prev => 
        prev.includes(group.title) 
          ? prev.filter(g => g !== group.title) 
          : [...prev, group.title]
      );
      return;
    }
    
    // Se clicou no botão principal (badge ou titulo), navega pra rota da capa
    router.push(group.path);
    // E garante que abre
    if (!openGroups.includes(group.title)) {
      setOpenGroups(prev => [...prev, group.title]);
    }
  };

  const handleToggleClick = (title: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita navegar
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title) 
        : [...prev, title]
    );
  };

  if (isLoading || (!isAuthenticated && pathname !== "/login")) {
    return null; // Don't render sidebar while checking auth or if not logged in
  }

  // Se estiver na tela de login, não mostra a sidebar
  if (pathname === "/login") return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <span className={styles.logoText}>VitaFlow</span>
      </div>
      
      <nav className={styles.nav}>
        <div style={{ padding: '0 12px 16px', color: '#8A8A93', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ width: '8px', height: '8px', background: '#374151', borderRadius: '4px' }}></div>
           <span style={{ fontSize: '13px', fontWeight: 600 }}>Introdução</span>
        </div>

        {menuGroups.map((group) => {
          const isOpen = openGroups.includes(group.title);
          const hasActiveItem = group.items.some(i => i.path === pathname) || group.path === pathname;

          return (
            <div key={group.title} className={styles.groupContainer}>
              <button 
                className={`${styles.groupHeader} ${hasActiveItem ? styles.groupHeaderActive : ""} ${hoveredGroup === group.title ? styles.groupHeaderHover : ""}`} 
                onClick={(e) => handleGroupClick(group, e)}
                onMouseEnter={() => setHoveredGroup(group.title)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <div className={styles.groupTitleWrapper}>
                  <span className={`${group.badgeClass}`}>{group.badge}</span>
                  <span className={styles.groupTitle}>{group.title}</span>
                </div>
                
                <div onClick={(e) => handleToggleClick(group.title, e)} className="group-toggle-icon" style={{ padding: '4px' }}>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>

              <div className={`${styles.groupContent} ${isOpen ? styles.groupContentOpen : ""}`}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className={styles.footer} style={{textAlign: 'left', padding: '16px 12px', borderTop: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div style={{color: '#8A8A93', fontSize: '10px', marginBottom: '4px'}}>@vitanews</div>
          <div style={{color: '#8A8A93', fontSize: '10px'}}>vitanews.com</div>
        </div>
        <button 
          onClick={logout} 
          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
          title="Sair do Sistema"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
