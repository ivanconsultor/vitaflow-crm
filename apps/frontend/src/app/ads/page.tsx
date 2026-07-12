"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ads.module.css';
import { ChevronDown, ChevronRight, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: '19/02', gasto: 67, conversoes: 2 },
  { name: '20/02', gasto: 102, conversoes: 5 },
  { name: '21/02', gasto: 206, conversoes: 15 },
  { name: '22/02', gasto: 201, conversoes: 20 },
  { name: '23/02', gasto: 284, conversoes: 35 },
  { name: '24/02', gasto: 301, conversoes: 36 },
];

export default function AdsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('7dias');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // Controle de estado dos acordeões (iniciam fechados)
  const [isLeadsOpen, setIsLeadsOpen] = useState(false);
  const [isAplicacoesOpen, setIsAplicacoesOpen] = useState(false);
  const [isVendasOpen, setIsVendasOpen] = useState(false);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/ads/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch (err) {
        console.error("Erro ao carregar campanhas da API no front:", err);
      }
    };
    fetchCampaigns();
  }, []);

  const totalSpend = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.spend, 0) : 1163.45;
  const totalLeads = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.conversions, 0) : 167;
  const avgCpl = campaigns.length > 0 && totalLeads > 0 ? totalSpend / totalLeads : 6.97;
  const totalClicks = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.clicks, 0) : 1170;
  const totalImpressions = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.impressions, 0) : 32700;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 3.57;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0.99;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>VFlow — <span className={styles.titleHighlight}>ADS Analytics</span></h1>
        
        <div className={styles.headerFilters}>
          <Link href="/ads/criativos" className={styles.dateBtn} style={{textDecoration: 'none'}}>Criativos &gt;</Link>
          
          <div className={styles.dateFilter}>
            <button className={`${styles.dateBtn} ${activeTab === 'hoje' ? styles.active : ''}`} onClick={() => setActiveTab('hoje')}>Hoje</button>
            <button className={`${styles.dateBtn} ${activeTab === 'ontem' ? styles.active : ''}`} onClick={() => setActiveTab('ontem')}>Ontem</button>
            <button className={`${styles.dateBtn} ${activeTab === '7dias' ? styles.active : ''}`} onClick={() => setActiveTab('7dias')}>7 dias</button>
            <button className={`${styles.dateBtn} ${activeTab === '30dias' ? styles.active : ''}`} onClick={() => setActiveTab('30dias')}>30 dias</button>
          </div>
        </div>
      </div>

      {/* KPIs Globais */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
          <span className={styles.kpiLabel}>Gasto Total</span>
          <span className={styles.kpiValue}>R$ {totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`${styles.kpiChange} ${styles.changeNegative}`}>↑ 10087.8%</span>
        </div>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '34, 197, 94' } as React.CSSProperties}>
          <span className={styles.kpiLabel}>Leads Totais</span>
          <span className={styles.kpiValue}>{totalLeads}</span>
        </div>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
          <span className={styles.kpiLabel}>CPL Médio</span>
          <span className={styles.kpiValue}>R$ {avgCpl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '234, 179, 8' } as React.CSSProperties}>
          <span className={styles.kpiLabel}>Clicks Totais</span>
          <span className={styles.kpiValue}>{totalClicks.toLocaleString('pt-BR')}</span>
          <span className={`${styles.kpiChange} ${styles.changePositive}`}>↑ 7700.0%</span>
        </div>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '249, 115, 22' } as React.CSSProperties}>
          <span className={styles.kpiLabel}>CTR Médio</span>
          <span className={styles.kpiValue}>{avgCtr.toFixed(2)}%</span>
          <span className={`${styles.kpiChange} ${styles.changePositive}`}>↑ 38.8%</span>
        </div>
        <div className={styles.kpiCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
          <span className={styles.kpiLabel}>CPC Médio</span>
          <span className={styles.kpiValue}>R$ {avgCpc.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`${styles.kpiChange} ${styles.changeNegative}`}>↑ 30.6%</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className={styles.chartSection}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#8A8A93" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8A8A93" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val}`} />
            <Tooltip contentStyle={{ backgroundColor: '#1A1C23', border: '1px solid #333' }} />
            <Area type="monotone" dataKey="gasto" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorGasto)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Campaigns Table */}
      <div className={styles.tableSection}>
        <div className={styles.sectionTitle}>
          <span>Performance por Campanha</span>
          <span>{campaigns.length > 0 ? campaigns.length : 6} campanhas</span>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Campanha</th>
              <th>Tipo</th>
              <th>Gasto</th>
              <th>Impressões</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>Conv.</th>
              <th>CPL/CPA</th>
              <th>Receita</th>
              <th>ROAS</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((camp) => (
                <tr key={camp.id}>
                  <td className={styles.campName}>
                    <a 
                      href={camp.plataforma === "facebook" ? `https://adsmanager.facebook.com/adsmanager/manage/campaigns?selected_campaign_ids=${camp.id}` : `https://ads.google.com/aw/campaigns`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {camp.nome} <ExternalLink size={12} style={{ color: '#8A8A93' }} />
                    </a>
                  </td>
                  <td>
                    <span className={`${styles.badgeType} ${camp.plataforma === "facebook" ? styles.badgeLeads : styles.badgeVendas}`}>
                      {camp.plataforma === "facebook" ? "Leads" : "Vendas"}
                    </span>
                  </td>
                  <td style={{ color: '#EF4444' }}>R$ {camp.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>{camp.impressions.toLocaleString('pt-BR')}</td>
                  <td>{camp.clicks.toLocaleString('pt-BR')}</td>
                  <td style={{ color: '#22C55E' }}>{camp.ctr.toFixed(2)}%</td>
                  <td>R$ {camp.cpc.toFixed(2)}</td>
                  <td>{camp.conversions}</td>
                  <td>R$ {camp.cpa.toFixed(2)}</td>
                  <td>{camp.revenue > 0 ? `R$ ${camp.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td style={{ color: camp.roas >= 1.5 ? '#22C55E' : '#EF4444' }}>{camp.roas.toFixed(2)}x</td>
                  <td>
                    <span className={`${styles.statusDot} ${camp.roas >= 1.0 ? styles.statusGreen : styles.statusRed}`}></span>
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td className={styles.campName}>Ebook VFlow</td>
                  <td><span className={`${styles.badgeType} ${styles.badgeLeads}`}>Leads</span></td>
                  <td>R$ 270,29</td>
                  <td>12.258</td>
                  <td>392</td>
                  <td>3.20%</td>
                  <td>R$ 0,69</td>
                  <td>98</td>
                  <td>R$ 2,76</td>
                  <td>-</td>
                  <td>-</td>
                  <td><span className={`${styles.statusDot} ${styles.statusGreen}`}></span></td>
                </tr>
                <tr>
                  <td className={styles.campName}>News ALQ</td>
                  <td><span className={`${styles.badgeType} ${styles.badgeLeads}`}>Leads</span></td>
                  <td>R$ 265,67</td>
                  <td>7.063</td>
                  <td>286</td>
                  <td>4.05%</td>
                  <td>R$ 0,93</td>
                  <td>62</td>
                  <td>R$ 4,29</td>
                  <td>-</td>
                  <td>-</td>
                  <td><span className={`${styles.statusDot} ${styles.statusYellow}`}></span></td>
                </tr>
                <tr>
                  <td className={styles.campName}>Workshop VFlow</td>
                  <td><span className={`${styles.badgeType} ${styles.badgeVendas}`}>Vendas</span></td>
                  <td>R$ 209,06</td>
                  <td>4.063</td>
                  <td>118</td>
                  <td>2.90%</td>
                  <td>R$ 1,77</td>
                  <td>1</td>
                  <td>R$ 209,06</td>
                  <td>R$ 47,00</td>
                  <td>0.22x</td>
                  <td><span className={`${styles.statusDot} ${styles.statusRed}`}></span></td>
                </tr>
                <tr>
                  <td className={styles.campName}>Mentoria VFlow</td>
                  <td><span className={`${styles.badgeType} ${styles.badgeAplicacoes}`}>Aplicações</span></td>
                  <td>R$ 91,38</td>
                  <td>2.216</td>
                  <td>141</td>
                  <td>6.36%</td>
                  <td>R$ 0,65</td>
                  <td>6</td>
                  <td>R$ 15,23</td>
                  <td>-</td>
                  <td>-</td>
                  <td><span className={`${styles.statusDot} ${styles.statusYellow}`}></span></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Accordion: Leads */}
      <div className={styles.accordion}>
        <div 
          className={`${styles.accordionHeader} ${styles.leads}`}
          onClick={() => setIsLeadsOpen(!isLeadsOpen)}
        >
          {isLeadsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span>Leads</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#8A8A93' }}>2 campanhas</span>
        </div>
        
        {isLeadsOpen && (
          <div className={styles.accordionBody}>
            <div className={styles.goalCard} style={{ '--kpi-rgb': '96, 165, 250' } as React.CSSProperties}>
              <div className={styles.goalCardHeader}>
                <span className={styles.goalCampName}>EBOOK VFlow</span>
                <span className={styles.goalBadge}><Sparkles size={10}/> Estável</span>
              </div>
              <div className={styles.goalValueBox}>
                <div className={styles.goalMainValue}>98</div>
                <div className={styles.goalSubLabel}>Downloads Totais</div>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressLabels}>
                  <span>CPL</span>
                  <span className={styles.progressMetaValue}>META: R$ 3,00</span>
                  <span>R$ 2,76</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            <div className={styles.goalCard} style={{ '--kpi-rgb': '239, 68, 68' } as React.CSSProperties}>
              <div className={styles.goalCardHeader}>
                <span className={styles.goalCampName}>NEWS VFlow</span>
                <span className={styles.goalBadge}><Sparkles size={10}/> Estável</span>
              </div>
              <div className={styles.goalValueBox}>
                <div className={styles.goalMainValue}>62</div>
                <div className={styles.goalSubLabel}>Leads Totais</div>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressLabels}>
                  <span>CPL</span>
                  <span className={styles.progressMetaValue}>META: R$ 4,00</span>
                  <span>R$ 4,29</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '100%', background: '#EF4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion: Aplicações */}
      <div className={styles.accordion}>
        <div 
          className={`${styles.accordionHeader} ${styles.aplicacoes}`}
          onClick={() => setIsAplicacoesOpen(!isAplicacoesOpen)}
        >
          {isAplicacoesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span>Aplicações</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#8A8A93' }}>1 campanha</span>
        </div>
        
        {isAplicacoesOpen && (
          <div className={styles.accordionBody}>
            <div className={styles.goalCard} style={{ '--kpi-rgb': '251, 191, 36' } as React.CSSProperties}>
              <div className={styles.goalCardHeader}>
                <span className={styles.goalCampName}>MENTORIA VFlow</span>
                <span className={styles.goalBadge} style={{color: '#C084FC', background: 'rgba(168, 85, 247, 0.1)'}}><Sparkles size={10}/> Estável</span>
              </div>
              <div className={styles.goalValueBox}>
                <div className={styles.goalMainValue}>6</div>
                <div className={styles.goalSubLabel}>Aplicações Totais</div>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressLabels}>
                  <span>CPA</span>
                  <span className={styles.progressMetaValue} style={{color: '#C084FC'}}>META: R$ 15,00</span>
                  <span>R$ 15,23</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '100%', background: '#FBBF24', boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion: Vendas */}
      <div className={styles.accordion}>
        <div 
          className={`${styles.accordionHeader} ${styles.vendas}`}
          onClick={() => setIsVendasOpen(!isVendasOpen)}
        >
          {isVendasOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span>Vendas</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#8A8A93' }}>3 campanhas</span>
        </div>
        
        {isVendasOpen && (
          <div className={styles.accordionBody}>
             {/* Vendas Content */}
             <div className={styles.goalCard} style={{ '--kpi-rgb': '239, 68, 68' } as React.CSSProperties}>
              <div className={styles.goalCardHeader}>
                <span className={styles.goalCampName}>WORKSHOP VFlow</span>
                <span className={styles.goalBadge} style={{color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)'}}><AlertTriangle size={10}/> Atenção</span>
              </div>
              <div className={styles.goalValueBox}>
                <div className={styles.goalMainValue}>R$ 47,00</div>
                <div className={styles.goalSubLabel}>Receita</div>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressLabels}>
                  <span>ROAS</span>
                  <span className={styles.progressMetaValue} style={{color: '#EF4444'}}>META: 1.0X</span>
                  <span>0.22X</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '22%', background: '#EF4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion: Detalhamento Diário */}
      <div className={styles.accordion}>
        <div 
          className={styles.accordionHeader}
          style={{ borderLeft: '3px solid #8A8A93' }}
          onClick={() => setIsDetalhesOpen(!isDetalhesOpen)}
        >
          {isDetalhesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span>Detalhamento Diário</span>
        </div>
        
        {isDetalhesOpen && (
          <div style={{ padding: '20px' }}>
            <div className={styles.dailyFilter}>
              Filtrar por campanha: <strong style={{ color: '#fff', cursor: 'pointer' }}>Todas as Campanhas ▾</strong>
            </div>
            <div className={styles.dailyTableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>GASTO</th>
                    <th>IMPRESSÕES</th>
                    <th>ALCANCE</th>
                    <th>CLICKS</th>
                    <th>CTR</th>
                    <th style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.5)', paddingLeft: '8px' }}>LEADS</th>
                    <th>CPL</th>
                    <th style={{ borderLeft: '2px solid rgba(34, 197, 94, 0.5)', paddingLeft: '8px' }}>VENDAS</th>
                    <th>CPV</th>
                    <th style={{ borderLeft: '2px solid rgba(168, 85, 247, 0.5)', paddingLeft: '8px' }}>APPS</th>
                    <th>CPA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24/02</td>
                    <td>R$ 301,15</td>
                    <td>7.615</td>
                    <td>6.268</td>
                    <td>275</td>
                    <td>3.61%</td>
                    <td style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.2)', paddingLeft: '8px' }}>36</td>
                    <td>R$ 2,95</td>
                    <td style={{ borderLeft: '2px solid rgba(34, 197, 94, 0.2)', paddingLeft: '8px' }}>1</td>
                    <td>R$ 164,00</td>
                    <td style={{ borderLeft: '2px solid rgba(168, 85, 247, 0.2)', paddingLeft: '8px' }}>1</td>
                    <td>R$ 30,79</td>
                  </tr>
                  <tr>
                    <td>23/02</td>
                    <td>R$ 284,43</td>
                    <td>7.670</td>
                    <td>6.406</td>
                    <td>220</td>
                    <td>2.87%</td>
                    <td style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.2)', paddingLeft: '8px' }}>37</td>
                    <td>R$ 2,65</td>
                    <td style={{ borderLeft: '2px solid rgba(34, 197, 94, 0.2)', paddingLeft: '8px' }}>-</td>
                    <td>-</td>
                    <td style={{ borderLeft: '2px solid rgba(168, 85, 247, 0.2)', paddingLeft: '8px' }}>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Glossário */}
      <div className={styles.glossary}>
        <div><strong>Glossário de Siglas</strong></div>
        <div>
          <div className={styles.glossaryItem}><strong>CTR</strong> - Click-Through Rate (Taxa de Cliques)</div>
          <div className={styles.glossaryItem}><strong>CPL</strong> - Custo Por Lead</div>
        </div>
        <div>
          <div className={styles.glossaryItem}><strong>CPM</strong> - Custo Por Mil Impressões</div>
          <div className={styles.glossaryItem}><strong>CPV</strong> - Custo Por Venda</div>
        </div>
        <div>
          <div className={styles.glossaryItem}><strong>CPC</strong> - Custo Por Clique</div>
          <div className={styles.glossaryItem}><strong>CPA</strong> - Custo Por Aplicação</div>
        </div>
      </div>

    </div>
  );
}
