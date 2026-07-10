"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './newsletter.module.css';
import { 
  BarChart3, FileText, Users, Send, CheckCircle, 
  BookOpen, MousePointer2, UserMinus, AlertTriangle,
  ChevronDown, Check, ArrowLeft, Heart, Share2, Trophy, Mail,
  Flame, Star, Search, Trash2, Sparkles, Smartphone
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// Configuração das métricas mapeadas para os gráficos (DataKeys)
const METRIC_CONFIG = {
  'Taxa de Abertura': { key: 'taxaAbertura', isPercent: true },
  'Taxa de Cliques': { key: 'taxaCliques', isPercent: true },
  'Entregabilidade': { key: 'entregabilidade', isPercent: true },
  'Enviados': { key: 'enviados', isPercent: false },
  'Aberturas Totais': { key: 'aberturas', isPercent: false },
  'Cliques Totais': { key: 'cliques', isPercent: false },
};

// Mock Data - Linhas Duplas (Expandido com todas as chaves)
const mockEdicoesData = Array.from({length: 30}).map((_, i) => ({
  name: `Ed ${30-i}`,
  taxaAbertura: 30 + Math.random() * 30,
  taxaCliques: 2 + Math.random() * 8,
  entregabilidade: 95 + Math.random() * 5,
  enviados: 10000 + Math.random() * 5000,
  aberturas: 3000 + Math.random() * 2000,
  cliques: 500 + Math.random() * 800,
})).reverse();

// Mock Data - Mensal (Barras longas)
const mockMensalData = Array.from({length: 24}).map((_, i) => ({
  name: `Mes ${i+1}`,
  valor: Math.random() * 12000 + 3000
}));

// Mock Data - Ranking Top 10
const mockTop10 = [
  { id: 1, title: 'Como Viver de Newsletter', envios: 15400, aberturas: 6500, cliques: 221, unsubs: 5, spam: 0 },
  { id: 2, title: 'Os 4 Tipos de Audiência', envios: 15350, aberturas: 6420, cliques: 213, unsubs: 6, spam: 0 },
  { id: 3, title: 'A Anatomia da Obsessão...', envios: 14800, aberturas: 5900, cliques: 183, unsubs: 8, spam: 1 },
  { id: 4, title: 'Seu NetWork é seu NetWorth', envios: 14750, aberturas: 5800, cliques: 169, unsubs: 9, spam: 0 },
  { id: 5, title: 'Retrospectiva de 2024', envios: 14500, aberturas: 5750, cliques: 165, unsubs: 12, spam: 2 },
  { id: 6, title: '10 livros que mudaram mi...', envios: 14200, aberturas: 5600, cliques: 157, unsubs: 11, spam: 1 },
  { id: 7, title: 'O Método A.I.D.A Morreu', envios: 14150, aberturas: 5500, cliques: 154, unsubs: 15, spam: 1 },
  { id: 8, title: 'O preço do sucesso', envios: 14100, aberturas: 5450, cliques: 154, unsubs: 10, spam: 0 },
  { id: 9, title: 'Os 5 Níveis de Consciência', envios: 14000, aberturas: 5400, cliques: 154, unsubs: 14, spam: 1 },
  { id: 10, title: 'A Nova Era', envios: 13900, aberturas: 5200, cliques: 146, unsubs: 16, spam: 0 },
];

// Mock Data - Tabela de Posts
const mockPosts = [
  { id: 1, title: 'Todo Mestre Já Foi um Iniciante...', edicao: 125, date: '23/11/2025', enviados: 7717, entregues: 7682, t_entrega: 99.5, aberturas: 3107, t_abertura: 40.4, cliques: 89, t_clique: 2.9, unsubs: 15, t_unsub: 0.20, spam: 1, t_spam: 0.01 },
  { id: 2, title: 'Você é Só Mais Um Tijolo No Muro...', edicao: 124, date: '16/11/2025', enviados: 7783, entregues: 7729, t_entrega: 99.3, aberturas: 3181, t_abertura: 41.2, cliques: 93, t_clique: 2.9, unsubs: 14, t_unsub: 0.18, spam: 1, t_spam: 0.01 },
  { id: 3, title: 'O Perfume Que Ninguém Queria (E...', edicao: 123, date: '09/11/2025', enviados: 14297, entregues: 13943, t_entrega: 97.5, aberturas: 3598, t_abertura: 25.8, cliques: 115, t_clique: 3.2, unsubs: 19, t_unsub: 0.14, spam: 1, t_spam: 0.01 },
  { id: 4, title: 'Como Esculpir um Texto C.L.A.R.O...', edicao: 122, date: '02/11/2025', enviados: 14335, entregues: 13999, t_entrega: 97.7, aberturas: 3442, t_abertura: 24.6, cliques: 98, t_clique: 2.8, unsubs: 25, t_unsub: 0.18, spam: 1, t_spam: 0.01 },
];

export default function NewsletterDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard'); // 'Dashboard' ou 'Posts'
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [viewingPost, setViewingPost] = useState<any>(null);
  
  // Controles dos Gráficos Customizados
  const [leftMetric, setLeftMetric] = useState('Taxa de Abertura');
  const [rightMetric, setRightMetric] = useState('Entregabilidade');
  const metricOptions = Object.keys(METRIC_CONFIG);

  // Estados dos Novos Gráficos
  const [rankingFilter, setRankingFilter] = useState<'envios' | 'aberturas' | 'cliques' | 'unsubs' | 'spam'>('cliques');
  const [openDropdownMonthly, setOpenDropdownMonthly] = useState(false);
  const [monthlyMetric, setMonthlyMetric] = useState('Emails Enviados');
  const monthlyOptions = ['Emails Enviados', 'Taxa de Entregabilidade', 'Taxa de Abertura', 'Taxa de Cliques', 'Quantidade de Aberturas', 'Quantidade de Cliques'];

  // Controle de Menu Dropdown aberto
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Dados de KPI Dinâmicos baseados no filtro
  const kpiOptions: Record<string, any> = {
    'Todos': { enviados: '843.426', entregues: '827.770', t_entregue: '98.1%', aberturas: '307.184', t_abertura: '37.1%', cliques: '13.153', t_clique: '4.3%' },
    'Newsletter': { enviados: '750.000', entregues: '730.000', t_entregue: '97.3%', aberturas: '280.000', t_abertura: '38.3%', cliques: '11.000', t_clique: '3.9%' },
    'Clientes': { enviados: '93.426', entregues: '92.000', t_entregue: '98.4%', aberturas: '50.000', t_abertura: '54.3%', cliques: '5.153', t_clique: '10.3%' }
  };
  const kpiData = kpiOptions[activeFilter] || kpiOptions['Todos'];
  
  // Ref para fechar o clique fora
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (side: 'left' | 'right' | 'bar', value: string) => {
    if (side === 'left') setLeftMetric(value);
    if (side === 'right') setRightMetric(value);
    setOpenDropdown(null);
  };

  const leftKey = METRIC_CONFIG[leftMetric as keyof typeof METRIC_CONFIG]?.key || 'taxaAbertura';
  const rightKey = METRIC_CONFIG[rightMetric as keyof typeof METRIC_CONFIG]?.key || 'taxaCliques';

  return (
    <div className={styles.container}>
      {/* Header Premium */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <span>🌙</span> VITA NEWS
          </div>
          <h1 className={styles.title}>Newsletter Analytics Dashboard</h1>
          <div className={styles.subtitle}>
            <div className={styles.statusDot}></div>
            DADOS ATUALIZADOS 25/02 às 04:21
          </div>
        </div>
        
        <div className={styles.headerNav}>
          <button className={`${styles.navBtn} ${activeTab === 'Dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('Dashboard')}>
            <BarChart3 size={16} /> Dashboard
          </button>
          <button className={`${styles.navBtn} ${activeTab === 'Posts' ? styles.active : ''}`} onClick={() => setActiveTab('Posts')}>
            <FileText size={16} /> Posts
          </button>
          <button className={`${styles.navBtn} ${activeTab === 'Segmentos' ? styles.active : ''}`} onClick={() => setActiveTab('Segmentos')}>
            <Users size={16} /> Segmentos
          </button>
        </div>
      </div>

      {activeTab === 'Dashboard' && (
        <>
          {/* Sub Filtros */}
          <div className={styles.subFilters}>
            <div className={styles.filterGroup}>
              <button className={`${styles.filterBtn} ${activeFilter === 'Todos' ? styles.active : ''}`} onClick={() => setActiveFilter('Todos')}>
                Todos
              </button>
              <button className={`${styles.filterBtn} ${activeFilter === 'Newsletter' ? styles.active : ''}`} onClick={() => setActiveFilter('Newsletter')}>
                🔥 Newsletter
              </button>
              <button className={`${styles.filterBtn} ${activeFilter === 'Clientes' ? styles.active : ''}`} onClick={() => setActiveFilter('Clientes')}>
                💎 Clientes
              </button>
            </div>
          </div>

          {/* KPIs Grid */}
          <div className={styles.kpiWrapper}>
            <select className={styles.periodSelect}>
              <option>Todo período</option>
              <option>Últimos 30 dias</option>
            </select>
            
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
                <div className={styles.kpiHeader}>
                  <div className={`${styles.kpiIcon} ${styles.iconBlue}`}><Send size={12}/></div>
                  ENVIADOS
                </div>
                <div className={styles.kpiMain}>{kpiData.enviados}</div>
                <div className={styles.kpiSub}>Total de emails</div>
              </div>
              <div className={styles.kpiCard} style={{ '--kpi-rgb': '34, 197, 94' } as React.CSSProperties}>
                <div className={styles.kpiHeader}>
                  <div className={`${styles.kpiIcon} ${styles.iconGreen}`}><CheckCircle size={12}/></div>
                  ENTREGABILIDADE
                </div>
                <div className={`${styles.kpiMain} ${styles.kpiGreen}`}>{kpiData.t_entregue}</div>
                <div className={styles.kpiSub}>{kpiData.entregues} entregues</div>
              </div>
              <div className={styles.kpiCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                <div className={styles.kpiHeader}>
                  <div className={`${styles.kpiIcon} ${styles.iconWhite}`}><BookOpen size={12}/></div>
                  TAXA ABERTURA
                </div>
                <div className={styles.kpiMain}>{kpiData.t_abertura}</div>
                <div className={styles.kpiSub}>{kpiData.aberturas} aberturas</div>
              </div>
              <div className={styles.kpiCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
                <div className={styles.kpiHeader}>
                  <div className={`${styles.kpiIcon} ${styles.iconPurple}`}><MousePointer2 size={12}/></div>
                  TAXA CLIQUES
                </div>
                <div className={styles.kpiMain}>{kpiData.t_clique}</div>
                <div className={styles.kpiSub}>{kpiData.cliques} cliques</div>
              </div>
              <div className={styles.kpiCard} style={{ '--kpi-rgb': '249, 115, 22' } as React.CSSProperties}>
                <div className={styles.kpiHeader}>
                  <div className={`${styles.kpiIcon} ${styles.iconOrange}`}><UserMinus size={12}/></div>
                  UNSUBSCRIBES
                </div>
                <div className={styles.kpiMain}>0.19%</div>
                <div className={styles.kpiSub}>1.541 unsubs</div>
              </div>
              <div className={styles.kpiCard} style={{ '--kpi-rgb': '234, 179, 8' } as React.CSSProperties}>
                <div className={styles.kpiHeader}>
                  <div className={`${styles.kpiIcon} ${styles.iconYellow}`}><AlertTriangle size={12}/></div>
                  SPAM
                </div>
                <div className={styles.kpiMain}>0.010%</div>
                <div className={styles.kpiSub}>86 reports</div>
              </div>
            </div>
          </div>

          {/* Gráfico 1: Performance 30 Edições */}
          <div className={styles.chartSection} ref={dropdownRef}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                📊 Performance das Últimas 30 Edições <span style={{fontSize: '12px', color: '#8A8A93', fontWeight: 'normal'}}>(Newsletter)</span>
              </div>
            </div>
            
            <div className={styles.chartControls}>
              {/* Dropdown Customizado Esquerda */}
              <div className={styles.customDropdownWrapper}>
                <button 
                  className={styles.customDropdownTrigger} 
                  onClick={() => setOpenDropdown(openDropdown === 'left' ? null : 'left')}
                >
                  <div className={styles.indicatorLeft}></div>
                  {leftMetric} <ChevronDown size={14} />
                </button>
                {openDropdown === 'left' && (
                  <div className={styles.customDropdownMenu}>
                    {metricOptions.map(opt => (
                      <div 
                        key={`L-${opt}`} 
                        className={`${styles.dropdownItem} ${leftMetric === opt ? styles.selected : ''}`}
                        onClick={() => handleSelect('left', opt)}
                      >
                        {leftMetric === opt && <Check size={14} />}
                        <span style={{marginLeft: leftMetric === opt ? 0 : 22}}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Dropdown Customizado Direita */}
              <div className={styles.customDropdownWrapper}>
                <button 
                  className={styles.customDropdownTrigger} 
                  onClick={() => setOpenDropdown(openDropdown === 'right' ? null : 'right')}
                >
                  <div className={styles.indicatorRight}></div>
                  {rightMetric} <ChevronDown size={14} />
                </button>
                {openDropdown === 'right' && (
                  <div className={`${styles.customDropdownMenu} ${styles.rightAligned}`}>
                    {metricOptions.map(opt => (
                      <div 
                        key={`R-${opt}`} 
                        className={`${styles.dropdownItem} ${rightMetric === opt ? styles.selected : ''}`}
                        onClick={() => handleSelect('right', opt)}
                      >
                        {rightMetric === opt && <Check size={14} />}
                        <span style={{marginLeft: rightMetric === opt ? 0 : 22}}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEdicoesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeft" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  
                  <YAxis yAxisId="left" stroke="#A855F7" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => METRIC_CONFIG[leftMetric as keyof typeof METRIC_CONFIG]?.isPercent ? `${val}%` : val} />
                  <YAxis yAxisId="right" orientation="right" stroke="#4ADE80" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => METRIC_CONFIG[rightMetric as keyof typeof METRIC_CONFIG]?.isPercent ? `${val}%` : val} />
                  
                  <XAxis dataKey="name" stroke="#8A8A93" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1C23', border: '1px solid #333' }} />
                  
                  <Area yAxisId="left" type="monotone" dataKey={leftKey} stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorLeft)" />
                  <Area yAxisId="right" type="monotone" dataKey={rightKey} stroke="#4ADE80" strokeWidth={2} fillOpacity={1} fill="url(#colorRight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MÉTRICAS MENSAIS */}
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <BarChart3 size={16} /> Métricas Mensais <span style={{color: '#666', fontSize: 12, marginLeft: 8}}>(Newsletter)</span>
              </div>
              
              {/* Dropdown Customizado Mensal */}
              <div className={styles.customDropdownWrapper}>
                <button 
                  className={styles.customDropdownTrigger} 
                  style={{background: '#3B82F6', color: '#fff'}}
                  onClick={() => setOpenDropdownMonthly(!openDropdownMonthly)}
                >
                  <Mail size={14} />
                  {monthlyMetric} <ChevronDown size={14} />
                </button>
                {openDropdownMonthly && (
                  <div className={`${styles.customDropdownMenu} ${styles.rightAligned}`}>
                    {monthlyOptions.map(opt => (
                      <div 
                        key={`M-${opt}`} 
                        className={`${styles.dropdownItem} ${monthlyMetric === opt ? styles.selected : ''}`}
                        onClick={() => { setMonthlyMetric(opt); setOpenDropdownMonthly(false); }}
                      >
                        {monthlyMetric === opt && <Check size={14} />}
                        <span style={{marginLeft: monthlyMetric === opt ? 0 : 22}}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.chartContainer} style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMensalData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <YAxis stroke="#8A8A93" fontSize={10} tickLine={false} axisLine={false} />
                  <XAxis dataKey="name" stroke="#8A8A93" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1C23', border: '1px solid #333' }} />
                  <Bar dataKey="valor" fill="#A855F7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RANKING TOP 10 */}
          <div className={styles.rankingSection}>
            <div className={styles.rankingHeader}>
              <Trophy size={16} color="#EAB308" /> Top 10 Melhores Edicoes <span style={{color: '#666', fontSize: 12}}>(Newsletter)</span>
            </div>
            
            <div className={styles.rankingFilters}>
              <span style={{fontWeight: 600, marginRight: 8}}>RANKING POR:</span>
              <button 
                className={`${styles.rankingFilterBtn} ${rankingFilter === 'envios' ? styles.active : ''}`}
                onClick={() => setRankingFilter('envios')}
              >
                <Send size={14} color="#3B82F6" /> Envios
              </button>
              <button 
                className={`${styles.rankingFilterBtn} ${rankingFilter === 'aberturas' ? styles.active : ''}`}
                onClick={() => setRankingFilter('aberturas')}
              >
                <BookOpen size={14} color="#E5E7EB" /> Aberturas
              </button>
              <button 
                className={`${styles.rankingFilterBtn} ${rankingFilter === 'cliques' ? styles.active : ''}`}
                onClick={() => setRankingFilter('cliques')}
              >
                <MousePointer2 size={14} color="#22C55E" /> Cliques
              </button>
              <button 
                className={`${styles.rankingFilterBtn} ${rankingFilter === 'unsubs' ? styles.active : ''}`}
                onClick={() => setRankingFilter('unsubs')}
              >
                <UserMinus size={14} color="#F97316" /> Unsubscribes
              </button>
              <button 
                className={`${styles.rankingFilterBtn} ${rankingFilter === 'spam' ? styles.active : ''}`}
                onClick={() => setRankingFilter('spam')}
              >
                <AlertTriangle size={14} color="#EAB308" /> Spam Reports
              </button>
            </div>

            <div className={styles.rankingList}>
              {[...mockTop10]
                .sort((a, b) => b[rankingFilter] - a[rankingFilter])
                .slice(0, 10)
                .map((post, index) => {
                  const maxValue = Math.max(...mockTop10.map(p => p[rankingFilter]));
                  const percent = maxValue > 0 ? (post[rankingFilter] / maxValue) * 100 : 0;
                  
                  let barColorClass = styles.bgGreen;
                  if (rankingFilter === 'envios') barColorClass = styles.bgBlue;
                  if (rankingFilter === 'aberturas') barColorClass = styles.bgWhite;
                  if (rankingFilter === 'unsubs') barColorClass = styles.bgOrange;
                  if (rankingFilter === 'spam') barColorClass = styles.bgYellow;

                  return (
                    <div key={post.id} className={styles.rankingItem}>
                      <div className={styles.rankingRank}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>
                      <div className={styles.rankingTitle}>{post.title}</div>
                      <div className={styles.rankingBarContainer}>
                        <div className={`${styles.rankingBarFill} ${barColorClass}`} style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className={styles.rankingValue}>{post[rankingFilter]}</div>
                    </div>
                  );
              })}
            </div>
          </div>
        </>
      )}

      {/* ABA DE POSTS */}
      {activeTab === 'Posts' && (
        <div className={styles.tableSection}>
          <div className={styles.tableWrapper}>
            <table className={styles.postsTable}>
              <thead>
                <tr>
                  <th>Newsletters</th>
                  <th>Data</th>
                  <th>Enviados</th>
                  <th>Entregues</th>
                  <th>Tx. Entreg.</th>
                  <th>Aberturas</th>
                  <th>Tx. Aber.</th>
                  <th>Cliques</th>
                  <th>Tx. Cliq.</th>
                  <th>Unsubs</th>
                  <th>Spam</th>
                </tr>
              </thead>
              <tbody>
                {mockPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className={styles.postTitleCol}>
                        <a href="#" className={styles.postTitleLink} onClick={(e) => { e.preventDefault(); setViewingPost(post); }}>
                          {post.title}
                        </a>
                        <span className={styles.postSubTitle}>
                          🔥 Vita News - Edição #{post.edicao}
                        </span>
                      </div>
                    </td>
                    <td>{post.date}</td>
                    <td>{post.enviados.toLocaleString()}</td>
                    <td>{post.entregues.toLocaleString()}</td>
                    <td><span className={styles.pillGreen}>{post.t_entrega}%</span></td>
                    <td>{post.aberturas.toLocaleString()}</td>
                    <td><span className={styles.pillBlue}>{post.t_abertura}%</span></td>
                    <td>{post.cliques}</td>
                    <td><span className={styles.pillYellow}>{post.t_clique}%</span></td>
                    <td>
                      {post.unsubs}
                      <span className={`${styles.pillBlue} ${styles.miniPill}`}>{post.t_unsub}%</span>
                    </td>
                    <td>
                      {post.spam}
                      <span className={`${styles.pillBlue} ${styles.miniPill}`}>{post.t_spam}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TELA DO EDITOR BRANCO */}
      {viewingPost && (
        <div className={styles.editorContainer}>
          <div className={styles.editorSidebar}>
            <button className={styles.sidebarBtn} onClick={() => setViewingPost(null)}>
              <ArrowLeft size={20} />
            </button>
            <button className={styles.sidebarBtn} onClick={() => alert('Favoritar (Integração em breve)')}>
              <Heart size={20} />
            </button>
            <button className={styles.sidebarBtn} onClick={() => alert('Compartilhar (Integração em breve)')}>
              <Share2 size={20} />
            </button>
          </div>
          
          <div className={styles.editorMain}>
            <div className={styles.editorContent}>
              <h1 className={styles.editorTitle}>{viewingPost.title}</h1>
              
              <div className={styles.editorImage}>
                <span style={{ fontSize: '12px' }}>[ Imagem: Escravo daquele que te prometeu liberdade ]</span>
              </div>
              
              <div className={styles.editorText}>
                <p>Lembra a promessa?</p>
                <p>Não ter chefe.<br/>Controlar seu tempo.<br/>Viver do seu jeito.<br/>Acordar quando quiser.<br/>Viajar quando decidir.</p>
                
                <h3>Liberdade.</h3>
                <p>Essa era a palavra mágica que te fez largar o emprego.<br/>Que te fez investir suas economias.<br/>Que te fez apostar tudo num sonho.</p>
                
                <p>E agora?</p>
                <p>Você trabalha mais que muitos CLTs.<br/>Seu chefe virou o algoritmo.<br/>Seu patrão virou o dashboard.<br/>Sua jornada virou 24/7.</p>
                
                <p>Espera aí... como foi que isso aconteceu?</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA DE SEGMENTOS (FUNIL) */}
      {activeTab === 'Segmentos' && (
        <div className={styles.segmentsSection}>
          
          <div className={styles.segmentsHeader}>
            <div className={styles.segmentsTitle}>
              <BarChart3 size={18} color="#A855F7" /> Distribuição de Audiência
            </div>
            <div className={styles.segmentsTotal}>
              TOTAL DE LEADS
              <div className={styles.segmentsTotalValue}>17.121</div>
            </div>
          </div>

          {/* FUNIL INVERTIDO */}
          <div className={styles.funnelContainer}>
            
            <div className={`${styles.funnelLayer} ${styles.funnelLeais}`}>
              <div className={styles.funnelLayerTitle}><Flame size={14}/> Leais</div>
              <div className={styles.funnelLayerDesc}>FREQUÊNCIA ALTA + CLIQUES CONSTANTES</div>
              <div className={styles.funnelLayerValue}>1.904 <span>11.1%</span></div>
            </div>

            <div className={`${styles.funnelLayer} ${styles.funnelAtivos}`}>
              <div className={styles.funnelLayerTitle}><Star size={14}/> Ativos</div>
              <div className={styles.funnelLayerDesc}>FREQUÊNCIA MÉDIA + CLIQUES ATIVOS</div>
              <div className={styles.funnelLayerValue}>5.078 <span>29.7%</span></div>
            </div>

            <div className={`${styles.funnelLayer} ${styles.funnelRegulares}`}>
              <div className={styles.funnelLayerTitle}><Smartphone size={14}/> Regulares</div>
              <div className={styles.funnelLayerDesc}>LEEM TUDO, MAS NUNCA CLICAM</div>
              <div className={styles.funnelLayerValue}>1.381 <span>8.1%</span></div>
            </div>

            <div className={`${styles.funnelLayer} ${styles.funnelInvestigadores}`}>
              <div className={styles.funnelLayerTitle}><Search size={14}/> Investigadores</div>
              <div className={styles.funnelLayerDesc}>ABERTURA ESPORÁDICA + SEM CLIQUES</div>
              <div className={styles.funnelLayerValue}>5.334 <span>31.2%</span></div>
            </div>

            <div className={`${styles.funnelLayer} ${styles.funnelVazios}`}>
              <div className={styles.funnelLayerTitle}><Trash2 size={14}/> Vazios</div>
              <div className={styles.funnelLayerDesc}>INATIVOS OU DESENGAJADOS TOTAIS</div>
              <div className={styles.funnelLayerValue}>3.424 <span>20.0%</span></div>
            </div>

          </div>

          {/* ACTION CARDS (LIMPEZA, NUTRIÇÃO, CLICANTES) */}
          <div className={styles.actionGrid}>
            
            <div className={styles.actionCard}>
              <div className={styles.actionCardTop}>
                <div className={styles.actionIconBox} style={{color: '#F87171'}}><Trash2 size={16}/></div>
                <div className={styles.actionStats}>
                  <div className={styles.actionStatsTitle}>LIMPEZA</div>
                  <div className={styles.actionStatsValue}>3.424 <span style={{fontSize: 14, color: '#F87171'}}>20.0%</span></div>
                </div>
              </div>
              <div className={styles.actionDesc}>
                Estratégia de <span style={{color: '#F87171', fontWeight: 600}}>28 emails</span> automáticos para recuperação ou descarte de bounces.
              </div>
              <div className={styles.actionTags}>
                <span className={styles.actionPill} style={{color: '#F87171'}}><Trash2 size={10}/> VAZIOS</span>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionCardTop}>
                <div className={styles.actionIconBox} style={{color: '#FACC15'}}><Sparkles size={16}/></div>
                <div className={styles.actionStats}>
                  <div className={styles.actionStatsTitle}>NUTRIÇÃO</div>
                  <div className={styles.actionStatsValue}>6.715 <span style={{fontSize: 14, color: '#FACC15'}}>39.2%</span></div>
                </div>
              </div>
              <div className={styles.actionDesc}>
                Fluxo de <span style={{color: '#FACC15', fontWeight: 600}}>14 disparos</span> de alto valor para converter leitores em clicantes.
              </div>
              <div className={styles.actionTags}>
                <span className={styles.actionPill} style={{color: '#FB923C'}}><Search size={10}/> INVESTIGADORES</span>
                <span className={styles.actionPill} style={{color: '#FACC15'}}><Smartphone size={10}/> REGULARES</span>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionCardTop}>
                <div className={styles.actionIconBox} style={{color: '#4ADE80'}}><MousePointer2 size={16}/></div>
                <div className={styles.actionStats}>
                  <div className={styles.actionStatsTitle}>CLICANTES</div>
                  <div className={styles.actionStatsValue}>6.982 <span style={{fontSize: 14, color: '#4ADE80'}}>40.8%</span></div>
                </div>
              </div>
              <div className={styles.actionDesc}>
                Público de alta intenção pronto para receber <span style={{color: '#4ADE80', fontWeight: 600}}>campanhas de vendas</span> diretas.
              </div>
              <div className={styles.actionTags}>
                <span className={styles.actionPill} style={{color: '#60A5FA'}}><Star size={10}/> ATIVOS</span>
                <span className={styles.actionPill} style={{color: '#4ADE80'}}><Flame size={10}/> LEAIS</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
