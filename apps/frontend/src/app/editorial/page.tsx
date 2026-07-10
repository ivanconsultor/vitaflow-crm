"use client";

import { useEffect, useState } from "react";
import styles from "./editorial.module.css";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Filter, Youtube, Mail, FileText, Check, Clock
} from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

interface Publicacao {
  id: string;
  titulo: string;
  conteudo: string;
  plataforma: string;
  data_agenda: string;
  status: string;
  criado_em: string;
}

export default function EditorialPage() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form states
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [plataforma, setPlataforma] = useState("newsletter");
  const [dataAgenda, setDataAgenda] = useState("");
  const [status, setStatus] = useState("rascunho");
  const [submitting, setSubmitting] = useState(false);

  const fetchPublicacoes = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:3001/api/editorial");
      if (res.ok) {
        const data = await res.json();
        setPublicacoes(data);
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
    fetchPublicacoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !conteudo || !plataforma || !dataAgenda) return;

    setSubmitting(true);
    try {
      const res = await fetchWithAuth("http://localhost:3001/api/editorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titulo,
          conteudo,
          plataforma,
          data_agenda: new Date(dataAgenda).toISOString(),
          status
        })
      });

      if (res.ok) {
        setTitulo("");
        setConteudo("");
        setDataAgenda("");
        setStatus("rascunho");
        await fetchPublicacoes();
      } else {
        alert("Erro ao agendar publicacao.");
      }
    } catch (err) {
      alert("Falha de conexao com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta publicacao?")) return;

    try {
      const res = await fetchWithAuth(`http://localhost:3001/api/editorial/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await fetchPublicacoes();
      } else {
        alert("Erro ao excluir publicacao.");
      }
    } catch (err) {
      alert("Falha de conexao com o servidor.");
    }
  };

  const getPlatformLabel = (plat: string) => {
    switch (plat) {
      case "newsletter":
        return "Newsletter";
      case "pinterest":
        return "Pinterest";
      case "instagram":
        return "Instagram";
      case "youtube":
        return "YouTube Shorts";
      case "tiktok":
        return "TikTok";
      default:
        return plat;
    }
  };

  const getPlatformClass = (plat: string) => {
    switch (plat) {
      case "newsletter":
        return styles.platNewsletter;
      case "pinterest":
        return styles.platPinterest;
      case "instagram":
        return styles.platInstagram;
      case "youtube":
        return styles.platYoutube;
      case "tiktok":
        return styles.platTiktok;
      default:
        return "";
    }
  };

  const getStatusLabel = (pubStatus: string) => {
    switch (pubStatus) {
      case "rascunho":
        return "Rascunho";
      case "agendado":
        return "Agendado";
      case "publicado":
        return "Publicado";
      default:
        return pubStatus;
    }
  };

  const getStatusClass = (pubStatus: string) => {
    switch (pubStatus) {
      case "rascunho":
        return styles.statusRascunho;
      case "agendado":
        return styles.statusAgendado;
      case "publicado":
        return styles.statusPublicado;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Form Column */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Agendar Conteudo</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Titulo do Post / Assunto</label>
              <input
                type="text"
                className={styles.input}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                placeholder="Ex: 5 Beneficios do Magnesium L-Threonate"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Conteudo / Roteiro da IA</label>
              <textarea
                className={styles.textarea}
                rows={5}
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
                placeholder="Insira o texto base do post ou o roteiro gerado..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Plataforma de Destino</label>
              <select
                className={styles.select}
                value={plataforma}
                onChange={(e) => setPlataforma(e.target.value)}
              >
                <option value="newsletter">Newsletter (Systeme.io)</option>
                <option value="pinterest">Pinterest</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube Shorts</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Data e Hora do Agendamento</label>
              <input
                type="datetime-local"
                className={styles.input}
                value={dataAgenda}
                onChange={(e) => setDataAgenda(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status Inicial</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="rascunho">Rascunho</option>
                <option value="agendado">Agendado</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Agendando..." : "Agendar Publicacao"}
            </button>
          </form>
        </section>

        {/* List Column */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Cronograma Editorial</h2>
          {loading ? (
            <div className={styles.loading}>Buscando calendario...</div>
          ) : error ? (
            <div className={styles.errorState}>Falha ao obter calendario editorial do servidor.</div>
          ) : publicacoes.length === 0 ? (
            <div className={styles.emptyState}>Nenhuma publicacao agendada no momento.</div>
          ) : (
            <div className={styles.editorialList}>
              {publicacoes.map((pub) => (
                <div key={pub.id} className={styles.pubCard}>
                  <div className={styles.pubInfo}>
                    <div className={styles.pubHeader}>
                      <span className={`${styles.pubPlatform} ${getPlatformClass(pub.plataforma)}`}>
                        {getPlatformLabel(pub.plataforma)}
                      </span>
                      <span className={styles.pubDate}>
                        Agendado para: {new Date(pub.data_agenda).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <h3 className={styles.pubTitle}>{pub.titulo}</h3>
                    <p className={styles.pubContent}>{pub.conteudo}</p>
                    <div className={styles.pubFooter}>
                      <span className={`${styles.statusTag} ${getStatusClass(pub.status)}`}>
                        {getStatusLabel(pub.status)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(pub.id)}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
