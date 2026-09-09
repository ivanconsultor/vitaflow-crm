"use client";

import { useEffect, useState } from "react";
import styles from "./crm.module.css";
import { fetchWithAuth } from "../../utils/api";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  messenger_id: string | null;
  status: string;
  segmento_email: string;
  fonte_captacao: string | null;
  data_cadastro: string;
  ultima_interacao: string | null;
  tags: string[];
  notas: string | null;
}

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fonte, setFonte] = useState("Facebook Ads");
  const [status, setStatus] = useState("lead");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetchWithAuth("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;

    setSubmitting(true);
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const res = await fetchWithAuth("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          telefone: telefone || undefined,
          fonte_captacao: fonte,
          status,
          tags
        })
      });

      if (res.ok) {
        // Limpar form e atualizar listagem
        setNome("");
        setEmail("");
        setTelefone("");
        setTagsInput("");
        await fetchLeads();
      } else {
        const errData = await res.json();
        alert(errData.error || "Erro ao cadastrar lead.");
      }
    } catch (err) {
      alert("Falha de conexao com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;

    try {
      const res = await fetchWithAuth(`/api/leads/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await fetchLeads();
      } else {
        alert("Erro ao excluir lead.");
      }
    } catch (err) {
      alert("Falha de conexao com o servidor.");
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetchWithAuth("/api/systemeio/sync", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Sincronização concluída com sucesso.");
        await fetchLeads();
      } else {
        alert("Erro ao sincronizar com Systeme.io.");
      }
    } catch (err) {
      alert("Falha ao comunicar com a API de sincronização.");
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadgeClass = (leadStatus: string) => {
    switch (leadStatus) {
      case "lead":
        return styles.badgeLead;
      case "cliente":
        return styles.badgeCliente;
      case "inativo":
        return styles.badgeInativo;
      default:
        return "";
    }
  };

  const getStatusLabel = (leadStatus: string) => {
    switch (leadStatus) {
      case "lead":
        return "Lead";
      case "cliente":
        return "Cliente";
      case "inativo":
        return "Inativo";
      default:
        return leadStatus;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.crmLayout}>
        {/* Form Column */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Adicionar Novo Lead</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Completo</label>
              <input
                type="text"
                className={styles.input}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: John Doe"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Endereço de E-mail</label>
              <input
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ex: john.doe@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Telefone (Opcional)</label>
              <input
                type="tel"
                className={styles.input}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: +15550199"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Fonte de Captação</label>
              <select
                className={styles.select}
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
              >
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Organic Pinterest">Pinterest Organico</option>
                <option value="Systeme.io Capture">Landing Page (Systeme.io)</option>
                <option value="Presell BordaVita">Presell (BordaVita)</option>
                <option value="Direct">Direto</option>
                <option value="Email Marketing">Email Marketing</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status do Lead</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="lead">Lead</option>
                <option value="cliente">Cliente</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tags (Separadas por virgula)</label>
              <input
                type="text"
                className={styles.input}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: nutraceuticos, vip, eua"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Cadastrando..." : "Cadastrar Lead"}
            </button>
          </form>
        </section>

        {/* Table Column */}
        <section className={styles.cardMain || styles.card}>
          <div className={styles.tableHeaderBar}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Base de Leads Cadastrados</h2>
            <button 
              onClick={handleSync} 
              disabled={syncing}
              className={styles.syncBtn}
            >
              {syncing ? "Sincronizando..." : "Sincronizar Agora (Systeme.io)"}
            </button>
          </div>
          {loading ? (
            <div className={styles.loading}>Buscando contatos...</div>
          ) : error ? (
            <div className={styles.errorState}>Falha ao obter base de leads do servidor.</div>
          ) : leads.length === 0 ? (
            <div className={styles.emptyState}>Nenhum lead encontrado na base.</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Nome / E-mail</th>
                    <th className={styles.th}>Telefone</th>
                    <th className={styles.th}>Fonte de Captação</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Segmento E-mail</th>
                    <th className={styles.th}>Tags</th>
                    <th className={styles.th}>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.leadNameInfo}>
                          <span className={styles.leadName}>{lead.nome}</span>
                          <span className={styles.leadEmail}>{lead.email}</span>
                        </div>
                      </td>
                      <td className={styles.td}>{lead.telefone || "-"}</td>
                      <td className={styles.td}>
                        <span style={{ fontSize: "0.85rem", color: "#a0aec0" }}>
                          {lead.fonte_captacao || "-"}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.badge} ${getStatusBadgeClass(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                          {lead.fonte_captacao || "-"}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.badgeSegmento}>{lead.segmento_email}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.tagList}>
                          {lead.tags.map((tag, idx) => (
                            <span key={idx} className={styles.tagItem}>
                              {tag}
                            </span>
                          ))}
                          {lead.tags.length === 0 && "-"}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(lead.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
