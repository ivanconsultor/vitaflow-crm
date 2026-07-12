"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { ChevronDown, ChevronRight, BarChart2 } from "lucide-react";
import { fetchWithAuth } from "../utils/api";

interface KeyResult {
  id: string;
  metrica: string;
  meta: number;
  atual: number;
  unidade: string;
  status: string;
}

interface OKR {
  id: string;
  periodo: string;
  objetivo: string;
  area: string;
  criado_em: string;
  resultados: KeyResult[];
}

export default function DashboardPage() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    'Financeiro': true,
    'Marketing': true
  });
  
  const [expandedObjectives, setExpandedObjectives] = useState<Record<string, boolean>>({
    'Newsletter': true,
    'YouTube': true
  });

  useEffect(() => {
    const fetchOkrs = async () => {
      try {
        const res = await fetchWithAuth("/api/okrs");
        if (res.ok) {
          const data = await res.json();
          setOkrs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOkrs();
  }, []);

  const calculateProgress = (kr: KeyResult) => {
    if (kr.meta === 0) return 0;
    const pct = (kr.atual / kr.meta) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  const calculateObjectiveProgress = (okr: OKR) => {
    if (!okr.resultados || okr.resultados.length === 0) return 0;
    const total = okr.resultados.reduce((acc, kr) => acc + calculateProgress(kr), 0);
    return total / okr.resultados.length;
  };

  const toggleArea = (area: string) => {
    setExpandedAreas(prev => ({ ...prev, [area]: !prev[area] }));
  };

  const toggleObjective = (obj: string) => {
    setExpandedObjectives(prev => ({ ...prev, [obj]: !prev[obj] }));
  };

  const formatNumber = (num: number, unidade: string) => {
    if (unidade === 'R$') {
      return `R$ ${num.toLocaleString('pt-BR')}`;
    }
    return num.toLocaleString('pt-BR');
  };

  if (loading) {
    return <div className={styles.loading}>Carregando dados de OKRs...</div>;
  }

  // Agrupar por Area -> OKR (Objetivo)
  const groupedByArea: Record<string, OKR[]> = {};
  okrs.forEach(okr => {
    if (!groupedByArea[okr.area]) groupedByArea[okr.area] = [];
    groupedByArea[okr.area].push(okr);
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>OKR VFlow</h1>
          <span className={styles.subTitle}>Dados atualizados até final de Janeiro 2026</span>
        </div>
        
        <div className={styles.headerControls}>
          <div className={styles.controlGroup}>
            <button className={styles.controlBtn} onClick={() => alert('Filtro M')}>M</button>
            <button className={styles.controlBtn} onClick={() => alert('Filtro B')}>B</button>
            <button className={styles.controlBtn} onClick={() => alert('Filtro T')}>T</button>
          </div>
          <div className={styles.controlGroup}>
            <button className={styles.controlBtn} onClick={() => alert('Filtro Q1')}>Q1</button>
            <button className={styles.controlBtn} onClick={() => alert('Filtro Q2')}>Q2</button>
            <button className={styles.controlBtn} onClick={() => alert('Filtro Q3')}>Q3</button>
            <button className={styles.controlBtn} onClick={() => alert('Filtro Q4')}>Q4</button>
          </div>
          <select className={styles.yearSelect}>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
      </header>

      <div className={styles.areasContainer}>
        {Object.keys(groupedByArea).map(area => {
          const areaOkrs = groupedByArea[area];
          const areaAvgProgress = areaOkrs.length > 0 
            ? areaOkrs.reduce((acc, okr) => acc + calculateObjectiveProgress(okr), 0) / areaOkrs.length
            : 0;
            
          const isExpanded = expandedAreas[area];
          
          let colorClass = styles.textPurple;
          let bgClass = styles.bgPurple;
          let borderClass = styles.borderPurple;
          if (area === 'Financeiro') {
            colorClass = styles.textGreen;
            bgClass = styles.bgGreen;
            borderClass = styles.borderGreen;
          }

          return (
            <div key={area} className={`${styles.areaSection} ${isExpanded ? borderClass : ''}`}>
              <div className={styles.areaHeader} onClick={() => toggleArea(area)}>
                <div className={styles.areaHeaderLeft}>
                  <div className={styles.expandIcon}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                  <div className={styles.areaTitle}>
                    <BarChart2 size={16} className={colorClass} /> 
                    {area} <span className={styles.areaOwner}>Henrique</span>
                  </div>
                </div>
                <div className={`${styles.areaProgress} ${colorClass}`}>
                  {areaAvgProgress.toFixed(2).replace('.', ',')}%
                </div>
              </div>

              {isExpanded && (
                <div className={styles.areaContent}>
                  {areaOkrs.map(okr => {
                    const objProgress = calculateObjectiveProgress(okr);
                    const isObjExpanded = expandedObjectives[okr.objetivo] !== false;
                    
                    // Se a area e o objetivo tem o mesmo nome (ex: Financeiro), mostramos os cards diretamente
                    const hideObjHeader = okr.objetivo === area;

                    return (
                      <div key={okr.id} className={styles.objectiveSection}>
                        {!hideObjHeader && (
                          <div className={styles.objectiveHeader} onClick={() => toggleObjective(okr.objetivo)}>
                            <div className={styles.objectiveTitle}>
                              <div className={styles.expandIcon}>
                                {isObjExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </div>
                              📺 {okr.objetivo} <span className={styles.areaOwner}>Henrique</span>
                            </div>
                            <div className={styles.objectiveProgress}>
                              {objProgress.toFixed(2).replace('.', ',')}%
                            </div>
                          </div>
                        )}
                        
                        {(isObjExpanded || hideObjHeader) && (
                          <div className={styles.objectiveContent}>
                            <div className={styles.krsGrid}>
                              {okr.resultados.map(kr => {
                                const progress = calculateProgress(kr);
                                let badgeClass = styles.badgeem_progresso;
                                let barBgClass = styles.bgBlue;
                                let statusText = 'EM PROGRESSO';
                                
                                if (kr.status === 'concluido' || progress >= 100) {
                                  badgeClass = styles.badgeconcluido;
                                  barBgClass = styles.bgGreen;
                                  statusText = 'CONCLUIDO';
                                } else if (kr.status === 'nao_iniciado') {
                                  badgeClass = styles.badgenao_iniciado;
                                  statusText = 'NAO INICIADO';
                                }

                                if (area === 'Financeiro') barBgClass = styles.bgGreen;

                                return (
                                  <div key={kr.id} className={styles.krCard}>
                                    <div className={styles.krHeader}>
                                      <div className={styles.krTitle}>{kr.metrica}</div>
                                      <div className={`${styles.krStatusBadge} ${badgeClass}`}>
                                        {statusText}
                                      </div>
                                    </div>
                                    
                                    <div className={styles.krMeta}>
                                      <div className={styles.krMetaLabel}>REALIZADO (JAN)</div>
                                      <div className={styles.krValues}>
                                        <div className={`${styles.krAtual} ${colorClass}`}>
                                          {formatNumber(kr.atual, kr.unidade)}
                                        </div>
                                        <div className={styles.krTarget}>
                                          / {formatNumber(kr.meta, kr.unidade)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className={styles.krProgressBarContainer}>
                                      <div 
                                        className={`${styles.krProgressBar} ${barBgClass}`} 
                                        style={{ width: `${progress}%` }}
                                      />
                                      <div className={styles.progressLabel}>
                                        {progress.toFixed(2).replace('.', ',')}%
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
