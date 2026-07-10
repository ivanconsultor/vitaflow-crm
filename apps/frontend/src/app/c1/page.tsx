"use client";

import Link from "next/link";
import { ArrowRight, Target, BarChart, Users, Kanban, Link2 } from "lucide-react";
import styles from "./page.module.css";

export default function C1Page() {
  return (
    <div className={styles.hubContainer}>
      <div className={styles.hubHeader}>
        <div className={styles.badgeC1}>MÓDULO C1</div>
        <h1 className={styles.title}>Configuração</h1>
        <p className={styles.subtitle}>
          O alicerce do seu ecossistema. Gerencie suas conexões, integrações e dados vitais.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.shortcutsCol}>
          <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
          
          <Link href="/" className={styles.megaCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)' }}><Target size={22} /></div>
            <div className={styles.megaCardContent}>
              <h3>OKR VFlow</h3>
              <p>Metas estratégicas, OKRs e resultados-chave da empresa.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/analytics" className={styles.megaCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)' }}><BarChart size={22} /></div>
            <div className={styles.megaCardContent}>
              <h3>Analytics Global</h3>
              <p>Painel unificado de métricas globais e performance.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/crm" className={styles.megaCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)' }}><Users size={22} /></div>
            <div className={styles.megaCardContent}>
              <h3>CRM Leads</h3>
              <p>Base de Leads, tags e histórico unificado.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/prospectos" className={styles.megaCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)' }}><Kanban size={22} /></div>
            <div className={styles.megaCardContent}>
              <h3>CRM Prospects</h3>
              <p>Gestão ativa de oportunidades em formato Kanban.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/integracoes" className={styles.megaCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)' }}><Link2 size={22} /></div>
            <div className={styles.megaCardContent}>
              <h3>Integrações</h3>
              <p>Webhooks, APIs, plataformas e conexões externas.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>
        </div>

        <div className={styles.reportCol}>
          <div className={styles.reportWidget} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
            <div className={styles.reportHeader}>
              <h3>Status do Ecossistema</h3>
              <span className={styles.statusOk}>Operacional</span>
            </div>
            
            <div className={styles.reportList}>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Leads na Base</span>
                <span className={styles.reportVal}>24.502</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Webhooks Ativos</span>
                <span className={styles.reportVal}>8</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Último Backup</span>
                <span className={styles.reportVal}>Hoje, 03:00</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Saúde da API</span>
                <span className={styles.reportVal} style={{color: '#10B981'}}>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
