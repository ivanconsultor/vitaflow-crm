import React, { useState } from "react";
import styles from "./KanbanBoard.module.css";
import { DollarSign, CheckCircle2, XCircle, Mail, MessageSquare } from "lucide-react";
import { fetchWithAuth } from "../utils/api";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: string;
  valor_potencial: number | null;
}

interface KanbanProps {
  leads: Lead[];
}

const COLUMNS = [
  "Novo Lead",
  "Perfil Analisado",
  "Oferta Enviada",
  "Follow-up",
  "Fechado",
  "Perdido"
];

export default function KanbanBoard({ leads: initialLeads }: KanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [leadToClose, setLeadToClose] = useState<Lead | null>(null);

  const getRevenue = (statuses: string[]) => {
    return leads
      .filter((l) => statuses.includes(l.status))
      .reduce((acc, curr) => acc + (curr.valor_potencial || 0), 0);
  };

  const receitaAberta = getRevenue(["Novo Lead", "Perfil Analisado", "Oferta Enviada", "Follow-up"]);
  const receitaFechada = getRevenue(["Fechado"]);
  const receitaPerdida = getRevenue(["Perdido"]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const handleConfirmClose = async () => {
    if (!leadToClose) return;
    
    try {
      const response = await fetchWithAuth(`/api/leads/${leadToClose.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "Fechado"
        })
      });

      if (response.ok) {
        setLeads(leads.map(l => l.id === leadToClose.id ? { ...l, status: "Fechado" } : l));
      } else {
        alert("Erro ao atualizar o status do lead no servidor.");
      }
    } catch (err) {
      alert("Falha de conexão ao atualizar o status do lead.");
    } finally {
      setLeadToClose(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Modal de Fechamento */}
      {leadToClose && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-card)', padding: '24px', borderRadius: '12px',
            border: '1px solid var(--border-color)', width: '400px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#00FF7F', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} /> Registrar Venda Manual
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Fechamento com o lead: <strong>{leadToClose.nome}</strong>
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Produto</label>
              <select style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}>
                <option>Workshop Viver de News</option>
                <option>Grupo de Implementação VFlow</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Canal de Fechamento (USA)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                  <input type="radio" name="canal" value="email" defaultChecked /> <Mail size={14}/> E-mail
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                  <input type="radio" name="canal" value="sms" /> <MessageSquare size={14}/> SMS
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setLeadToClose(null)}
                style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmClose}
                style={{ padding: '8px 16px', background: '#00FF7F', border: 'none', color: '#000', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Confirmar Venda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards de Métricas Topo */}
      <div className={styles.metricsHeader}>
        <div className={styles.metricCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
          <div className={styles.metricIconWrap} style={{ color: "#3B82F6" }}>
            <DollarSign size={20} />
          </div>
          <div>
            <p className={styles.metricLabel}>Receita em Aberto</p>
            <h3 className={styles.metricValue}>{formatCurrency(receitaAberta)}</h3>
          </div>
        </div>
        <div className={styles.metricCard} style={{ '--kpi-rgb': '0, 255, 127' } as React.CSSProperties}>
          <div className={styles.metricIconWrap} style={{ color: "#00FF7F" }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className={styles.metricLabel}>Receita Fechada</p>
            <h3 className={styles.metricValue}>{formatCurrency(receitaFechada)}</h3>
          </div>
        </div>
        <div className={styles.metricCard} style={{ '--kpi-rgb': '244, 63, 94' } as React.CSSProperties}>
          <div className={styles.metricIconWrap} style={{ color: "#F43F5E" }}>
            <XCircle size={20} />
          </div>
          <div>
            <p className={styles.metricLabel}>Receita Perdida</p>
            <h3 className={styles.metricValue}>{formatCurrency(receitaPerdida)}</h3>
          </div>
        </div>
      </div>

      {/* Colunas do Kanban */}
      <div className={styles.board}>
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col);
          return (
             <div key={col} className={styles.column}>
              <div className={styles.columnHeader}>
                <h4 className={styles.columnTitle}>{col}</h4>
                <span className={styles.columnCount}>{colLeads.length}</span>
              </div>
              <div className={styles.columnBody}>
                {colLeads.map((lead) => (
                  <div key={lead.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardName}>{lead.nome}</span>
                      {lead.valor_potencial && (
                        <span className={styles.cardValue}>{formatCurrency(lead.valor_potencial)}</span>
                      )}
                    </div>
                    <div className={styles.cardEmail}>{lead.email}</div>
                    
                    {col !== "Fechado" && col !== "Perdido" && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => setLeadToClose(lead)}
                          style={{ flex: 1, padding: '4px 0', fontSize: '11px', background: 'rgba(0, 255, 127, 0.1)', color: '#00FF7F', border: '1px solid rgba(0, 255, 127, 0.2)', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Fechar Venda
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
