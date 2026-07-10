"use client";

import Link from "next/link";
import { ArrowRight, Mail, PenTool, MessageCircle } from "lucide-react";
import styles from "../c1/page.module.css";

export default function C3Page() {
  return (
    <div className={styles.hubContainer}>
      <div className={styles.hubHeader}>
        <div className={styles.badgeC1} style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
          MÓDULO C3
        </div>
        <h1 className={styles.title}>Conexão</h1>
        <p className={styles.subtitle}>
          Relacionamento, aquecimento de leads e autoridade. Nutra sua base.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.shortcutsCol}>
          <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
          
          <Link href="/emails" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '6, 182, 212' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)' }}>
              <Mail size={24} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Disparos E-mail (Systeme.io)</h3>
              <p>Newsletters, automações e broadcast.</p>
            </div>
            <ArrowRight size={20} className={styles.arrow} />
          </Link>

          <Link href="/conteudo" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '6, 182, 212' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)' }}>
              <PenTool size={24} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Produção de Conteúdo</h3>
              <p>Cronograma editorial e assets.</p>
            </div>
            <ArrowRight size={20} className={styles.arrow} />
          </Link>
          
          <Link href="/whatsapp" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '6, 182, 212' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)' }}>
              <MessageCircle size={24} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Mensageria (WhatsApp/SMS)</h3>
              <p>Automações via Manychat / Twilio.</p>
            </div>
            <ArrowRight size={20} className={styles.arrow} />
          </Link>
        </div>

        <div className={styles.reportCol}>
          <div className={styles.reportWidget} style={{ '--kpi-rgb': '6, 182, 212' } as React.CSSProperties}>
            <div className={styles.reportHeader}>
              <h3>Resumo do Mês (Conexão)</h3>
              <span className={styles.statusOk} style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)' }}>Saudável</span>
            </div>
            
            <div className={styles.reportList}>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>E-mails Enviados</span>
                <span className={styles.reportVal}>108.902</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Taxa de Abertura</span>
                <span className={styles.reportVal}>22.4%</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Cliques (CTR)</span>
                <span className={styles.reportVal}>4.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
