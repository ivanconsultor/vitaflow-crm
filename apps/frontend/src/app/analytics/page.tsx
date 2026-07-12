"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./page.module.css";
import { fetchWithAuth } from "../../utils/api";
import { Mail, Instagram, Youtube, Camera, Phone, Copy, Circle, ChevronLeft, ChevronRight, Video } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'calendario'>('analytics');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetchWithAuth("/api/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getPlatformIcon = (id: string, className: string) => {
    switch (id) {
      case 'email': return <Mail size={14} className={className} />;
      case 'instagram': return <Instagram size={14} className={className} />;
      case 'youtube': return <Youtube size={14} className={className} />;
      case 'tiktok': return <Video size={14} className={className} />;
      case 'pinterest': return <Camera size={14} className={className} />;
      default: return <span className={className}>#</span>;
    }
  };

  const getColorClass = (id: string) => {
    switch (id) {
      case 'email': return styles.colorEmail;
      case 'instagram': return styles.colorInstagram;
      case 'youtube': return styles.colorYouTube;
      case 'tiktok': return styles.colorTikTok;
      case 'pinterest': return styles.colorPinterest;
      default: return '';
    }
  };

  const getPlatformRgb = (id: string) => {
    switch (id) {
      case 'email': return '236, 72, 153';
      case 'instagram': return '168, 85, 247';
      case 'youtube': return '239, 68, 68';
      case 'tiktok': return '105, 201, 208';
      case 'pinterest': return '244, 63, 94';
      default: return '255, 255, 255';
    }
  };

  const getBadgeClass = (platform: string) => {
    switch (platform) {
      case 'email': return styles.bgEmail;
      case 'whatsapp': return styles.bgWhatsApp;
      case 'carrossel': return styles.bgCarrossel;
      case 'tiktok': return styles.bgTikTok;
      case 'pinterest': return styles.bgPinterest;
      case 'story': return styles.bgStory;
      case 'youtube': return styles.bgYouTube;
      default: return '';
    }
  };

  if (loading || !data) {
    return <div className={styles.container}><div className={styles.loading}>Carregando métricas unificadas...</div></div>;
  }

  const { overview, platforms, chartHistory, ranking, calendarMatrix } = data;
  const platformKeys = Object.keys(platforms);

  const totals = {
    posts: 0, impressoes: 0, alcance: 0, curtidas: 0, coments: 0, shares: 0, saves: 0, views: 0, cliques: 0
  };
  
  platformKeys.forEach(k => {
    const p = platforms[k];
    totals.posts += p.posts || 0;
    totals.impressoes += p.impressoes || 0;
    totals.alcance += p.alcance || 0;
    totals.curtidas += p.curtidas || 0;
    totals.coments += p.coments || 0;
    totals.shares += p.shares || 0;
    totals.saves += p.saves || 0;
    totals.views += p.views || 0;
    totals.cliques += p.cliques || 0;
  });

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.navItem}>Vita News</div>
        <div 
          className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </div>
        <div 
          className={`${styles.navItem} ${activeTab === 'calendario' ? styles.navItemActive : ''}`}
          onClick={() => setActiveTab('calendario')}
        >
          Calendário Editorial
        </div>
      </div>

      <div className={styles.headerTitle}>
        <div className={styles.headerTitleBox}>
          {activeTab === 'analytics' ? 'Analytics' : 'Calendário Editorial'}
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <>
          {/* Analytics View */}
          <div className={styles.filtersRow}>
            <div className={styles.dateFilters}>
              <button className={styles.filterBtn} onClick={() => alert('Filtro de 7 dias (Em breve)')}>7 dias</button>
              <button className={`${styles.filterBtn} ${styles.filterBtnActive}`} onClick={() => alert('Filtro de 30 dias (Em breve)')}>30 dias</button>
              <button className={styles.filterBtn} onClick={() => alert('Filtro deste mês (Em breve)')}>Este mês</button>
              <button className={styles.filterBtn} onClick={() => alert('Filtro do mês passado (Em breve)')}>Mês passado</button>
              <button className={styles.filterBtn} onClick={() => alert('Filtro Personalizado (Em breve)')}>Personalizado</button>
              <span className={styles.dateRangeLabel}>26/01/2026 - 25/02/2026</span>
            </div>
            <div className={styles.platformFilters}>
              <button className={`${styles.pillBtn} ${styles.colorTotal}`} onClick={() => alert('Filtrar todas as plataformas')}>Todos</button>
              {platformKeys.map(k => (
                <button key={k} className={styles.pillBtn} onClick={() => alert(`Filtrar dados do ${platforms[k].plataforma}`)}>
                  {getPlatformIcon(k, getColorClass(k))}
                  <span className={getColorClass(k)}>{platforms[k].plataforma}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.miniCardsGrid}>
            {platformKeys.map(k => (
              <div key={k} className={styles.miniCard} style={{ '--kpi-rgb': getPlatformRgb(k) } as React.CSSProperties}>
                <div className={styles.miniCardHeader}>
                  {getPlatformIcon(k, getColorClass(k))}
                  <span className={getColorClass(k)}>{platforms[k].plataforma}</span>
                </div>
                <div className={styles.miniCardValue}>{formatNumber(platforms[k].seguidores)}</div>
                <div className={styles.miniCardLabel}>{platforms[k].labelSeguidores}</div>
              </div>
            ))}
            <div className={styles.miniCard} style={{ '--kpi-rgb': '37, 244, 238' } as React.CSSProperties}>
              <div className={styles.miniCardHeader}>
                <span className={styles.colorTotal}>Total</span>
              </div>
              <div className={styles.miniCardValue}>{formatNumber(overview.seguidores.value)}</div>
              <div className={styles.miniCardLabel}>seguidores</div>
            </div>
          </div>

          <div className={styles.kpisGrid}>
            <div className={styles.kpiGlobalCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
              <div className={styles.kpiGlobalHeader}>👁️ Impressões</div>
              <div className={styles.kpiGlobalValue}>{formatNumber(overview.impressoes.value)}</div>
              <div className={styles.kpiGlobalFooter}>
                <span className={styles.badgeGrowth}>{overview.impressoes.percent}</span>
              </div>
            </div>
            <div className={styles.kpiGlobalCard} style={{ '--kpi-rgb': '239, 68, 68' } as React.CSSProperties}>
              <div className={styles.kpiGlobalHeader}>🚀 Alcance</div>
              <div className={styles.kpiGlobalValue}>{formatNumber(overview.alcance.value)}</div>
              <div className={styles.kpiGlobalFooter}>
                <span className={styles.badgeGrowth}>{overview.alcance.percent}</span>
              </div>
            </div>
            <div className={styles.kpiGlobalCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
              <div className={styles.kpiGlobalHeader}>📊 Taxa de Engaj.</div>
              <div className={styles.kpiGlobalValue}>{overview.taxaEngajamento.value}%</div>
              <div className={styles.kpiGlobalFooter}>
                <span className={styles.badgeGrowth}>{overview.taxaEngajamento.percent}</span>
              </div>
            </div>
            <div className={styles.kpiGlobalCard} style={{ '--kpi-rgb': '249, 115, 22' } as React.CSSProperties}>
              <div className={styles.kpiGlobalHeader}>🔥 Engajamento</div>
              <div className={styles.kpiGlobalValue}>{formatNumber(overview.engajamento.value)}</div>
              <div className={styles.kpiGlobalFooter}>
                <span className={styles.badgeGrowth}>{overview.engajamento.percent}</span>
              </div>
            </div>
            <div className={styles.kpiGlobalCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
              <div className={styles.kpiGlobalHeader}>👥 Seguidores</div>
              <div className={styles.kpiGlobalValue}>{overview.seguidores.percent.includes('-') ? '' : '+'}{formatNumber(overview.seguidores.value)}</div>
              <div className={styles.kpiGlobalFooter}>
                <span className={styles.badgeGrowth}>{overview.seguidores.percent}</span>
              </div>
            </div>
          </div>

          <div className={styles.postsInfoLabel}>103 posts publicados no período</div>

          <div className={styles.chartsSection}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Alcance ao Longo do Tempo</div>
              <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Comparação por Plataforma (Alcance)</div>
              <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={platformKeys.map(k => ({ name: platforms[k].plataforma, value: platforms[k].alcance, fill: k === 'email' ? '#EC4899' : k === 'instagram' ? '#A855F7' : k === 'tiktok' ? '#69C9D0' : '#555' }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                    <XAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#222' }} contentStyle={{ background: '#111', border: '1px solid #333' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableTitle}>Métricas por Plataforma</div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Plataforma</th>
                  <th>Posts</th>
                  <th>Impressões</th>
                  <th>Alcance</th>
                  <th>Curtidas</th>
                  <th>Coments</th>
                  <th>Shares</th>
                  <th>Saves</th>
                  <th>Views</th>
                  <th>Cliques</th>
                </tr>
              </thead>
              <tbody>
                {platformKeys.map(k => (
                  <tr key={k}>
                    <td>
                      {getPlatformIcon(k, getColorClass(k))}
                      <span className={getColorClass(k)}>{platforms[k].plataforma}</span>
                    </td>
                    <td>{platforms[k].posts}</td>
                    <td>{platforms[k].impressoes ? formatNumber(platforms[k].impressoes) : '0'}</td>
                    <td>{platforms[k].alcance ? formatNumber(platforms[k].alcance) : '0'}</td>
                    <td>{platforms[k].curtidas ? formatNumber(platforms[k].curtidas) : '0'}</td>
                    <td>{platforms[k].coments ? formatNumber(platforms[k].coments) : '0'}</td>
                    <td>{platforms[k].shares ? formatNumber(platforms[k].shares) : '0'}</td>
                    <td>{platforms[k].saves ? formatNumber(platforms[k].saves) : '0'}</td>
                    <td>{platforms[k].views ? formatNumber(platforms[k].views) : '0'}</td>
                    <td>{platforms[k].cliques ? formatNumber(platforms[k].cliques) : '0'}</td>
                  </tr>
                ))}
                <tr className={styles.tableTotalRow}>
                  <td><span className={styles.colorTotal}>Total</span></td>
                  <td>{totals.posts}</td>
                  <td>{formatNumber(totals.impressoes)}</td>
                  <td>{formatNumber(totals.alcance)}</td>
                  <td>{formatNumber(totals.curtidas)}</td>
                  <td>{totals.coments}</td>
                  <td>{totals.shares}</td>
                  <td>{totals.saves}</td>
                  <td>{formatNumber(totals.views)}</td>
                  <td>{totals.cliques}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableTitle}>Ranking</div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Plataforma</th>
                  <th>Data</th>
                  <th>Impressões</th>
                  <th>Alcance</th>
                  <th>Curtidas</th>
                  <th>Coments</th>
                  <th>Shares</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((row: any, index: number) => {
                  const pId = row.plataforma.toLowerCase();
                  return (
                    <tr key={row.id}>
                      <td style={{ color: '#8A8A93' }}>{index + 1} &nbsp; {row.id}</td>
                      <td>
                        {getPlatformIcon(pId, getColorClass(pId))}
                        <span className={getColorClass(pId)}>{row.plataforma}</span>
                      </td>
                      <td style={{ color: '#8A8A93' }}>{row.data}</td>
                      <td>{formatNumber(row.impressoes)}</td>
                      <td>{formatNumber(row.alcance)}</td>
                      <td>{row.curtidas}</td>
                      <td>{row.coments}</td>
                      <td>{row.shares}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Calendário Editorial View */}
          <div className={styles.calendarContainer}>
            <div className={styles.calendarNav}>
              <button className={styles.calendarBtn} onClick={() => alert('Mês anterior (Integração)')}><ChevronLeft size={18} /></button>
              <span className={styles.calendarNavDate}>22 fev - 21 mar 2026</span>
              <button className={styles.calendarBtn} onClick={() => alert('Próximo mês (Integração)')}><ChevronRight size={18} /></button>
              <button className={styles.calendarBtnHoje} onClick={() => alert('Ir para Hoje (Integração)')}>Hoje</button>
            </div>
            
            <table className={styles.calendarTable}>
              <thead>
                <tr>
                  <th className={styles.calendarDay}>Dia</th>
                  <th><span className={styles.colorEmail}><Mail size={16} /> E-mail</span></th>
                  <th><span className={styles.colorWhatsApp} style={{color: '#22C55E'}}><Phone size={16} /> WhatsApp</span></th>
                  <th><span className={styles.colorInstagram}><Copy size={16} /> Carrossel</span></th>
                  <th><span className={styles.colorTikTok}><Video size={16} /> TikTok</span></th>
                  <th><span className={styles.colorPinterest}><Camera size={16} /> Pinterest</span></th>
                  <th><span className={styles.colorStory} style={{color: '#8B5CF6'}}><Circle size={16} /> Story</span></th>
                  <th><span className={styles.colorYouTube}><Youtube size={16} /> YouTube</span></th>
                </tr>
              </thead>
              <tbody>
                {calendarMatrix?.map((row: any, i: number) => {
                  const isToday = row.day.includes("25/02");
                  return (
                    <tr key={i} className={isToday ? styles.calRowActive : ''}>
                      <td className={`${styles.calendarDay} ${isToday ? styles.calendarDayActive : ''}`}>{row.day}</td>
                      <td>{row.email && <span className={`${styles.badgePost} ${getBadgeClass('email')}`}>{row.email}</span>}</td>
                      <td>{row.whatsapp && <span className={`${styles.badgePost} ${getBadgeClass('whatsapp')}`}>{row.whatsapp}</span>}</td>
                      <td>{row.carrossel && <span className={`${styles.badgePost} ${getBadgeClass('carrossel')}`}>{row.carrossel}</span>}</td>
                      <td>{row.tiktok && <span className={`${styles.badgePost} ${getBadgeClass('tiktok')}`}>{row.tiktok}</span>}</td>
                      <td>{row.pinterest && <span className={`${styles.badgePost} ${getBadgeClass('pinterest')}`}>{row.pinterest}</span>}</td>
                      <td>{row.story && <span className={`${styles.badgePost} ${getBadgeClass('story')}`}>{row.story}</span>}</td>
                      <td>{row.youtube && <span className={`${styles.badgePost} ${getBadgeClass('youtube')}`}>{row.youtube}</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
