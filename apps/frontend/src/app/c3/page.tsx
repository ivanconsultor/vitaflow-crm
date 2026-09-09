"use client";

import Link from "next/link";
import {
  ArrowRight, Mail, PenTool, Calendar, BarChart3,
  Flame, Star, Smartphone, Search, Trash2, Sparkles,
  MousePointer2, Send, BookOpen, CheckCircle, UserMinus,
  AlertTriangle
} from "lucide-react";
import styles from "./page.module.css";

export default function C3Page() {
  return (
    <div className={styles.container}>

      {/* ═══ HEADER DO MÓDULO ═══ */}
      <div className={styles.moduleHeader}>
        <div className={styles.badgeC3}>MÓDULO C3</div>
        <h1 className={styles.title}>Conexão</h1>
        <p className={styles.subtitle}>
          Relacionamento, aquecimento de leads e autoridade. Nutra sua base com estratégia.
        </p>
      </div>

      {/* ═══ GRID PRINCIPAL: ATALHOS + KPIs ═══ */}
      <div className={styles.topGrid}>

        {/* Coluna Esquerda: Atalhos Rápidos */}
        <div className={styles.shortcutsCol}>
          <h2 className={styles.sectionTitle}>Acesso Rápido</h2>

          <Link href="/newsletter" className={styles.megaCard}>
            <div className={styles.megaCardIcon}>
              <Mail size={22} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Newsletter Analytics</h3>
              <p>Dashboard completo, posts e segmentos da Vita News.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/conteudo" className={styles.megaCard}>
            <div className={styles.megaCardIcon}>
              <PenTool size={22} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Produção de Conteúdo</h3>
              <p>Cronograma editorial, assets e biblioteca criativa.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>

          <Link href="/editorial" className={styles.megaCard}>
            <div className={styles.megaCardIcon}>
              <Calendar size={22} />
            </div>
            <div className={styles.megaCardContent}>
              <h3>Calendário Editorial</h3>
              <p>Planejamento mensal de publicações e newsletter.</p>
            </div>
            <ArrowRight size={18} className={styles.arrow} />
          </Link>
        </div>

        {/* Coluna Direita: KPIs Resumo */}
        <div className={styles.kpiCol}>
          <div className={styles.kpiWidget}>
            <div className={styles.kpiWidgetHeader}>
              <h3>Resumo do Mês (Conexão)</h3>
              <span className={styles.statusBadge}>Saudável</span>
            </div>
            <div className={styles.kpiList}>
              <div className={styles.kpiItem}>
                <div className={styles.kpiItemIcon}><Send size={12} /></div>
                <span className={styles.kpiLabel}>E-mails Enviados</span>
                <span className={styles.kpiValue}>108.902</span>
              </div>
              <div className={styles.kpiItem}>
                <div className={styles.kpiItemIcon}><BookOpen size={12} /></div>
                <span className={styles.kpiLabel}>Taxa de Abertura</span>
                <span className={styles.kpiValue} style={{ color: '#4ADE80' }}>37.1%</span>
              </div>
              <div className={styles.kpiItem}>
                <div className={styles.kpiItemIcon}><MousePointer2 size={12} /></div>
                <span className={styles.kpiLabel}>Cliques (CTR)</span>
                <span className={styles.kpiValue}>4.3%</span>
              </div>
              <div className={styles.kpiItem}>
                <div className={styles.kpiItemIcon}><CheckCircle size={12} /></div>
                <span className={styles.kpiLabel}>Entregabilidade</span>
                <span className={styles.kpiValue} style={{ color: '#4ADE80' }}>98.1%</span>
              </div>
              <div className={styles.kpiItem}>
                <div className={styles.kpiItemIcon}><UserMinus size={12} /></div>
                <span className={styles.kpiLabel}>Unsubscribes</span>
                <span className={styles.kpiValue} style={{ color: '#F97316' }}>0.19%</span>
              </div>
              <div className={styles.kpiItem}>
                <div className={styles.kpiItemIcon}><AlertTriangle size={12} /></div>
                <span className={styles.kpiLabel}>Spam Reports</span>
                <span className={styles.kpiValue}>0.010%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FUNIL DE SEGMENTOS DE AUDIÊNCIA ═══ */}
      <div className={styles.funnelSection}>
        <div className={styles.funnelHeader}>
          <div className={styles.funnelTitle}>
            <BarChart3 size={18} /> Distribuição de Audiência
          </div>
          <div className={styles.funnelTotal}>
            TOTAL DE LEADS
            <div className={styles.funnelTotalValue}>17.121</div>
          </div>
        </div>

        <div className={styles.funnelContainer}>

          <div className={`${styles.funnelLayer} ${styles.funnelLeais}`}>
            <div className={styles.funnelLayerIcon}><Flame size={14} /></div>
            <div className={styles.funnelLayerInfo}>
              <div className={styles.funnelLayerTitle}>Leais</div>
              <div className={styles.funnelLayerDesc}>FREQUÊNCIA ALTA + CLIQUES CONSTANTES</div>
            </div>
            <div className={styles.funnelLayerValue}>1.904 <span>11.1%</span></div>
          </div>

          <div className={`${styles.funnelLayer} ${styles.funnelAtivos}`}>
            <div className={styles.funnelLayerIcon}><Star size={14} /></div>
            <div className={styles.funnelLayerInfo}>
              <div className={styles.funnelLayerTitle}>Ativos</div>
              <div className={styles.funnelLayerDesc}>FREQUÊNCIA MÉDIA + CLIQUES ATIVOS</div>
            </div>
            <div className={styles.funnelLayerValue}>5.078 <span>29.7%</span></div>
          </div>

          <div className={`${styles.funnelLayer} ${styles.funnelRegulares}`}>
            <div className={styles.funnelLayerIcon}><Smartphone size={14} /></div>
            <div className={styles.funnelLayerInfo}>
              <div className={styles.funnelLayerTitle}>Regulares</div>
              <div className={styles.funnelLayerDesc}>LEEM TUDO, MAS NUNCA CLICAM</div>
            </div>
            <div className={styles.funnelLayerValue}>1.381 <span>8.1%</span></div>
          </div>

          <div className={`${styles.funnelLayer} ${styles.funnelInvestigadores}`}>
            <div className={styles.funnelLayerIcon}><Search size={14} /></div>
            <div className={styles.funnelLayerInfo}>
              <div className={styles.funnelLayerTitle}>Investigadores</div>
              <div className={styles.funnelLayerDesc}>ABERTURA ESPORÁDICA + SEM CLIQUES</div>
            </div>
            <div className={styles.funnelLayerValue}>5.334 <span>31.2%</span></div>
          </div>

          <div className={`${styles.funnelLayer} ${styles.funnelVazios}`}>
            <div className={styles.funnelLayerIcon}><Trash2 size={14} /></div>
            <div className={styles.funnelLayerInfo}>
              <div className={styles.funnelLayerTitle}>Vazios</div>
              <div className={styles.funnelLayerDesc}>INATIVOS OU DESENGAJADOS TOTAIS</div>
            </div>
            <div className={styles.funnelLayerValue}>3.424 <span>20.0%</span></div>
          </div>

        </div>
      </div>

      {/* ═══ ACTION CARDS: LIMPEZA, NUTRIÇÃO, CLICANTES ═══ */}
      <div className={styles.actionGrid}>

        <div className={styles.actionCard}>
          <div className={styles.actionCardTop}>
            <div className={styles.actionIconBox} style={{ color: '#F87171' }}><Trash2 size={16} /></div>
            <div className={styles.actionStats}>
              <div className={styles.actionStatsTitle}>LIMPEZA</div>
              <div className={styles.actionStatsValue}>3.424 <span style={{ fontSize: 14, color: '#F87171' }}>20.0%</span></div>
            </div>
          </div>
          <div className={styles.actionDesc}>
            Estratégia de <span style={{ color: '#F87171', fontWeight: 600 }}>28 emails</span> automáticos para recuperação ou descarte de bounces.
          </div>
          <div className={styles.actionTags}>
            <span className={styles.actionPill} style={{ color: '#F87171' }}><Trash2 size={10} /> VAZIOS</span>
          </div>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionCardTop}>
            <div className={styles.actionIconBox} style={{ color: '#FACC15' }}><Sparkles size={16} /></div>
            <div className={styles.actionStats}>
              <div className={styles.actionStatsTitle}>NUTRIÇÃO</div>
              <div className={styles.actionStatsValue}>6.715 <span style={{ fontSize: 14, color: '#FACC15' }}>39.2%</span></div>
            </div>
          </div>
          <div className={styles.actionDesc}>
            Fluxo de <span style={{ color: '#FACC15', fontWeight: 600 }}>14 disparos</span> de alto valor para converter leitores em clicantes.
          </div>
          <div className={styles.actionTags}>
            <span className={styles.actionPill} style={{ color: '#FB923C' }}><Search size={10} /> INVESTIGADORES</span>
            <span className={styles.actionPill} style={{ color: '#FACC15' }}><Smartphone size={10} /> REGULARES</span>
          </div>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionCardTop}>
            <div className={styles.actionIconBox} style={{ color: '#4ADE80' }}><MousePointer2 size={16} /></div>
            <div className={styles.actionStats}>
              <div className={styles.actionStatsTitle}>CLICANTES</div>
              <div className={styles.actionStatsValue}>6.982 <span style={{ fontSize: 14, color: '#4ADE80' }}>40.8%</span></div>
            </div>
          </div>
          <div className={styles.actionDesc}>
            Público de alta intenção pronto para receber <span style={{ color: '#4ADE80', fontWeight: 600 }}>campanhas de vendas</span> diretas.
          </div>
          <div className={styles.actionTags}>
            <span className={styles.actionPill} style={{ color: '#60A5FA' }}><Star size={10} /> ATIVOS</span>
            <span className={styles.actionPill} style={{ color: '#4ADE80' }}><Flame size={10} /> LEAIS</span>
          </div>
        </div>

      </div>

    </div>
  );
}
