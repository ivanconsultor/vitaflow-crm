"use client";

import Link from "next/link";
import { ArrowRight, Megaphone, Sparkles, Target } from "lucide-react";
import styles from "../c1/page.module.css";

export default function C2Page() {
  return (
    <div className={styles.hubContainer}>
      <div className={styles.hubHeader}>
        <div className={styles.badgeC1} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          MÓDULO C2
        </div>
        <h1 className={styles.title}>Captação</h1>
        <p className={styles.subtitle}>
          Atração, anúncios e geração de tráfego. Construa sua audiência com previsibilidade.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.shortcutsCol}>
          <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
          
          <Link href="/campanhas" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
              <Megaphone size={22} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Gestão de Campanhas</h3>
              <p>Planejamento de anúncios, metas e ativos de tráfego.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/ads" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
              <Sparkles size={22} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Ads & IA</h3>
              <p>Métricas de tráfego, ROI e inteligência automatizada.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/capture" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
              <Target size={22} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Landing Pages</h3>
              <p>Páginas de captura, opt-ins, quiz e presell.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>
        </div>

        <div className={styles.reportCol}>
          <div className={styles.reportWidget} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
            <div className={styles.reportHeader}>
              <h3>Resumo do Mês (Captação)</h3>
              <span className={styles.statusOk} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>Ativo</span>
            </div>
            
            <div className={styles.reportList}>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Leads Gerados</span>
                <span className={styles.reportVal}>4.250</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Custo Médio (CPL)</span>
                <span className={styles.reportVal}>R$ 3,45</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Investimento Ads</span>
                <span className={styles.reportVal}>R$ 14.662,50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
