"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import styles from "./Sidebar.module.css";
import { useAuth } from "../hooks/useAuth";
import { menuGroups } from "../config/menu";

export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

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
    onClose?.();
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
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
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
                  <span className={styles[`badge${group.badge}`] ?? styles.badgeDefault}>{group.badge}</span>
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
                      onClick={() => onClose?.()}
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

      <div className={styles.footer} style={{padding: '16px 12px', borderTop: 'none', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
        <button 
          onClick={logout} 
          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}
          title="Sair do Sistema"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
