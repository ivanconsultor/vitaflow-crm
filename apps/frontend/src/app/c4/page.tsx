"use client";

import Link from "next/link";
import { ArrowRight, DollarSign, Target, Briefcase } from "lucide-react";
import styles from "../c1/page.module.css";

export default function C4Page() {
  return (
    <div className={styles.hubContainer}>
      <div className={styles.hubHeader}>
        <div className={styles.badgeC1} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          MÓDULO C4
        </div>
        <h1 className={styles.title}>Conversão</h1>
        <p className={styles.subtitle}>
          Vendas, funis de alta conversão e recuperação de faturamento.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.shortcutsCol}>
          <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
          
          <Link href="/kambam-vendas" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '245, 158, 11' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
              <Briefcase size={24} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Kanban Vendas</h3>
              <p>Fechamento ativo de vendas e CRM comercial.</p>
            </div>
            <ArrowRight size={20} className={styles.arrow} />
          </Link>

          <Link href="/funnels" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '245, 158, 11' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
              <Target size={24} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Funil</h3>
              <p>Visualização das etapas de conversão e gargalos.</p>
            </div>
            <ArrowRight size={20} className={styles.arrow} />
          </Link>

          <Link href="/vendas" className={`${styles.megaCard}`} style={{ '--kpi-rgb': '245, 158, 11' } as React.CSSProperties}>
            <div className={styles.megaCardIcon} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
              <DollarSign size={24} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Vendas</h3>
              <p>Faturamento, comissões, gateways e ROI.</p>
            </div>
            <ArrowRight size={20} className={styles.arrow} />
          </Link>
        </div>

        <div className={styles.reportCol}>
          <div className={styles.reportWidget} style={{ '--kpi-rgb': '245, 158, 11' } as React.CSSProperties}>
            <div className={styles.reportHeader}>
              <h3>Resumo do Mês (Conversão)</h3>
              <span className={styles.statusOk} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>Em Crescimento</span>
            </div>
            
            <div className={styles.reportList}>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Faturamento</span>
                <span className={styles.reportVal}>R$ 380.595,03</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Vendas Realizadas</span>
                <span className={styles.reportVal}>476</span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>Ticket Médio</span>
                <span className={styles.reportVal}>R$ 799,56</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
