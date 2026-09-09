"use client";

import { useEffect, useState } from "react";
import styles from "./funnels.module.css";
import { 
  Filter, Plus, Search, ChevronRight, BarChart2, 
  MousePointer2, DollarSign, Target, Settings, Copy,
  Layers, Users, Zap, RefreshCw, ArrowRight
} from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

interface EtapaFunil {
  id: string;
  nome: string;
  meta_conversao: number;
  conversao_atual: number;
  quantidade: number;
  funil_id: string;
}

interface Funil {
  id: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  etapas: EtapaFunil[];
}

const DEFAULT_FUNNELS: Funil[] = [
  {
    id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1",
    nome: "Funil de Vendas Nutracêuticos EUA",
    tipo: "afiliado",
    ativo: true,
    etapas: [
      {
        id: "e1e1e1e1-1e1e-1e1e-1e1e-e1e1e1e1e1e1",
        nome: "Visitante",
        meta_conversao: 100.0,
        conversao_atual: 100.0,
        quantidade: 10000,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "e2e2e2e2-2e2e-2e2e-2e2e-e2e2e2e2e2e2",
        nome: "Cadastro Isca/Quiz (C2)",
        meta_conversao: 35.0,
        conversao_atual: 38.2,
        quantidade: 3820,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "e3e3e3e3-3e3e-3e3e-3e3e-e3e3e3e3e3e3",
        nome: "Cliques no Link Afiliado (C3)",
        meta_conversao: 15.0,
        conversao_atual: 12.5,
        quantidade: 477,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "e4e4e4e4-4e4e-4e4e-4e4e-e4e4e4e4e4e4",
        nome: "Vendas Nutracêutico (C4)",
        meta_conversao: 2.0,
        conversao_atual: 2.5,
        quantidade: 12,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      }
    ]
  },
  {
    id: "f2f2f2f2-2f2f-2f2f-2f2f-f2f2f2f2f2f2",
    nome: "Funil Newsletter Semanal",
    tipo: "newsletter",
    ativo: true,
    etapas: [
      {
        id: "e5e5e5e5-5e5e-5e5e-5e5e-e5e5e5e5e5e5",
        nome: "Inscritos",
        meta_conversao: 100.0,
        conversao_atual: 100.0,
        quantidade: 1500,
        funil_id: "f2f2f2f2-2f2f-2f2f-2f2f-f2f2f2f2f2f2"
      },
      {
        id: "e6e6e6e6-6e6e-6e6e-6e6e-e6e6e6e6e6e6",
        nome: "Abertura Newsletter (C3)",
        meta_conversao: 30.0,
        conversao_atual: 34.5,
        quantidade: 518,
        funil_id: "f2f2f2f2-2f2f-2f2f-2f2f-f2f2f2f2f2f2"
      }
    ]
  }
];

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funil[]>(DEFAULT_FUNNELS);
  const [loading, setLoading] = useState(false);

  const fetchFunnels = async () => {
    try {
      const res = await fetchWithAuth("/api/funnels");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFunnels(data);
        } else {
          setFunnels(DEFAULT_FUNNELS);
        }
      }
    } catch (err) {
      console.error("Falha ao obter funis", err);
      setFunnels(DEFAULT_FUNNELS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunnels();
  }, []);

  const getConversionColor = (atual: number, meta: number) => {
    if (atual >= meta) return "#10B981"; // Green
    if (atual >= meta * 0.7) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getStageTheme = (idx: number) => {
    const themes = [
      { color: '#4ADE80', rgb: '34, 197, 94' }, // Green
      { color: '#60A5FA', rgb: '59, 130, 246' }, // Blue
      { color: '#FACC15', rgb: '234, 179, 8' }, // Yellow
      { color: '#FB923C', rgb: '249, 115, 22' }, // Orange
      { color: '#F87171', rgb: '239, 68, 68' }  // Red
    ];
    return themes[Math.min(idx, themes.length - 1)];
  };

  return (
    <div className={styles.container}>
      
      {/* ═══ CABEÇALHO ═══ */}
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>Mapeamento de Funis</h1>
          <p className={styles.subTitle}>Análise visual de conversão (C2 - Captação e C4 - Conversão).</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={14} color="#6B7280" />
            <input type="text" placeholder="Buscar funil..." className={styles.searchInput} />
          </div>
          <button className={styles.btnSecondary}><Filter size={16} /> Filtros</button>
          <button className={styles.btnPrimary}>
            <Plus size={16} /> Novo Funil
          </button>
        </div>
      </header>

      {/* ═══ MÉTRICAS GLOBAIS ═══ */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Layers size={18} color="#3B82F6" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Funis Ativos</span>
            <span className={styles.kpiValue}>{funnels.length}</span>
          </div>
        </div>
        
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <Users size={18} color="#10B981" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Tráfego Total (Topo)</span>
            <span className={styles.kpiValue}>
              {funnels.reduce((acc, f) => acc + (f.etapas[0]?.quantidade || 0), 0).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className={styles.kpiCard} style={{ '--kpi-rgb': '217, 70, 239' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(217, 70, 239, 0.1)' }}>
            <Target size={18} color="#D946EF" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Conversão Média (Fundo)</span>
            <span className={styles.kpiValue}>
              {funnels.length > 0 ? '12.4%' : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ PIPELINES DE FUNIL ═══ */}
      <div className={styles.funnelGrid}>
        {loading ? (
          <div className={styles.loading}>Mapeando funis...</div>
        ) : funnels.length === 0 ? (
          <div className={styles.empty}>Nenhum funil construído ainda.</div>
        ) : (
          funnels.map(funnel => (
            <div key={funnel.id} className={styles.funnelCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleWrap}>
                  <Zap size={18} color="#D946EF" />
                  <h3 className={styles.funnelName}>{funnel.nome}</h3>
                  <span className={styles.funnelTypeBadge}>{funnel.tipo}</span>
                </div>
                <button className={styles.btnIcon}><RefreshCw size={14} /></button>
              </div>

              <div className={styles.pipeline}>
                {funnel.etapas.map((etapa, idx) => {
                  const color = getConversionColor(etapa.conversao_atual, etapa.meta_conversao);
                  const isLast = idx === funnel.etapas.length - 1;
                  const maxWidth = 100 - (idx * 15); // visual funnel effect
                  const theme = getStageTheme(idx);

                  return (
                    <div key={etapa.id} className={styles.pipelineStageWrap}>
                      <div className={styles.pipelineStage} style={{ 
                        width: `${maxWidth}%`,
                        '--theme-color': theme.color,
                        '--theme-rgb': theme.rgb
                      } as React.CSSProperties}>
                        <div className={styles.stageInfo}>
                          <span className={styles.stageName}>{etapa.nome}</span>
                          <span className={styles.stageQty}>{etapa.quantidade.toLocaleString('pt-BR')}</span>
                        </div>
                        {idx > 0 && (
                          <div className={styles.stageConversion} style={{ color }}>
                            {etapa.conversao_atual}% (Meta: {etapa.meta_conversao}%)
                          </div>
                        )}
                      </div>
                      {!isLast && (
                        <div className={styles.arrowDown}>
                          <ArrowRight size={16} color="#4B5563" style={{ transform: 'rotate(90deg)' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
