"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { fetchWithAuth } from "../../utils/api";
import { Plus, Settings, TrendingUp, DollarSign, Target, Activity, Search, Filter, X } from "lucide-react";

interface Campanha {
  id: string;
  nome: string;
  produto: string;
  preco: number;
  inicio: string;
  fim: string;
  investimento_ads: number;
  meta_vendas: number;
  vendas_realizadas: number;
  faturamento_bruto: number;
  criado_em: string;
}

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [produto, setProduto] = useState("");
  const [preco, setPreco] = useState(97.0);
  const [metaVendas, setMetaVendas] = useState(100);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCampanhas = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:3001/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampanhas(data);
      }
    } catch (err) {
      console.error("Falha ao carregar campanhas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetchWithAuth("http://localhost:3001/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          produto,
          preco: Number(preco),
          meta_vendas: Number(metaVendas),
          inicio,
          fim
        })
      });

      if (res.ok) {
        setNome("");
        setProduto("");
        setIsModalOpen(false);
        await fetchCampanhas();
      } else {
        alert("Erro ao criar campanha.");
      }
    } catch (err) {
      alert("Falha de conexao com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className={styles.container}>
      
      {/* ═══ CABEÇALHO ═══ */}
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>Gestão de Campanhas</h1>
          <p className={styles.subTitle}>Ativos de tráfego, ROI e performance em tempo real.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={14} color="#6B7280" />
            <input type="text" placeholder="Buscar campanha..." className={styles.searchInput} />
          </div>
          <button className={styles.btnSecondary}><Filter size={16} /> Filtros</button>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Nova Campanha
          </button>
        </div>
      </header>

      {/* ═══ MÉTRICAS GLOBAIS ═══ */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '217, 70, 239' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(217, 70, 239, 0.1)' }}>
            <Activity size={18} color="#D946EF" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Campanhas Ativas</span>
            <span className={styles.kpiValue}>{campanhas.length}</span>
          </div>
        </div>
        
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <DollarSign size={18} color="#10B981" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Faturamento Total</span>
            <span className={styles.kpiValue}>
              {formatCurrency(campanhas.reduce((acc, c) => acc + c.faturamento_bruto, 0))}
            </span>
          </div>
        </div>

        <div className={styles.kpiCard} style={{ '--kpi-rgb': '245, 158, 11' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <TrendingUp size={18} color="#F59E0B" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Investimento Total (Ads)</span>
            <span className={styles.kpiValue}>
              {formatCurrency(campanhas.reduce((acc, c) => acc + c.investimento_ads, 0))}
            </span>
          </div>
        </div>

        <div className={styles.kpiCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Target size={18} color="#3B82F6" />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Conversão Média</span>
            <span className={styles.kpiValue}>4.2%</span>
          </div>
        </div>
      </div>

      {/* ═══ GRID DE CAMPANHAS ═══ */}
      <div className={styles.campaignGrid}>
        {loading ? (
          <div className={styles.loading}>Carregando ativos...</div>
        ) : campanhas.length === 0 ? (
          <div className={styles.empty}>Nenhuma campanha rodando. Crie sua primeira oferta.</div>
        ) : (
          campanhas.map(camp => {
            const perc = Math.min((camp.vendas_realizadas / camp.meta_vendas) * 100, 100);
            const lucro = camp.faturamento_bruto - camp.investimento_ads;
            const isPositive = lucro >= 0;
            const cardRgb = isPositive ? '16, 185, 129' : '217, 70, 239';

            return (
              <div key={camp.id} className={styles.campaignCard} style={{ '--kpi-rgb': cardRgb } as React.CSSProperties}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.campName}>{camp.nome}</h3>
                    <span className={styles.campProduct}>{camp.produto}</span>
                  </div>
                  <button className={styles.btnSettings}><Settings size={14} /></button>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Faturamento</span>
                    <span className={styles.dataValueHighlight}>{formatCurrency(camp.faturamento_bruto)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Custo Ads</span>
                    <span className={styles.dataValue}>{formatCurrency(camp.investimento_ads)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Lucro Líquido</span>
                    <span className={styles.dataValue} style={{ color: isPositive ? '#10B981' : '#EF4444' }}>
                      {isPositive ? '+' : ''}{formatCurrency(lucro)}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.progressTop}>
                    <span className={styles.progressText}>Meta: {camp.vendas_realizadas}/{camp.meta_vendas}</span>
                    <span className={styles.progressPerc}>{perc.toFixed(0)}%</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${perc}%`, backgroundColor: isPositive ? '#10B981' : '#D946EF' }}></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══ MODAL NOVA CAMPANHA ═══ */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Nova Campanha</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Nome da Campanha</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Black Friday" required />
              </div>

              <div className={styles.formGroup}>
                <label>Produto de Destino</label>
                <input type="text" value={produto} onChange={e => setProduto(e.target.value)} placeholder="Ex: Masterclass VFlow" required />
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label>Ticket (Preço)</label>
                  <input type="number" value={preco} onChange={e => setPreco(Number(e.target.value))} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Meta de Vendas</label>
                  <input type="number" value={metaVendas} onChange={e => setMetaVendas(Number(e.target.value))} required />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label>Data Início</label>
                  <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Data Fim</label>
                  <input type="date" value={fim} onChange={e => setFim(e.target.value)} required />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting ? 'Criando...' : 'Lançar Campanha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
