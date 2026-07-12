"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { 
  FileText, Sparkles, Filter, MoreVertical, Plus, 
  Calendar, Check, ChevronRight, Edit3, MessageSquare
} from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

interface Publicacao {
  id: string;
  titulo: string;
  conteudo: string;
  plataforma: string;
  data_agenda: string;
  status: string;
}

export default function ConteudoPage() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form states
  const [newsletterText, setNewsletterText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPublicacoes = async () => {
    try {
      const res = await fetchWithAuth("/api/content/publicacoes");
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

  const handlePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetchWithAuth("/api/content/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterText })
      });

      if (res.ok) {
        setNewsletterText("");
        await fetchPublicacoes();
      } else {
        alert("Erro ao executar pipeline de conteúdo.");
      }
    } catch (err) {
      alert("Falha na conexao com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPlataforma = (plat: string) => {
    const map: any = {
      pinterest: "Pinterest Pin",
      instagram: "Instagram Carrossel",
      youtube: "YouTube Shorts",
      tiktok: "TikTok Video",
      sms: "SMS Teaser",
      email_sequence: "Sequência de E-mails"
    };
    return map[plat] || plat;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pipeline de Conteúdo Automático</h1>
        <p className={styles.subtitle}>Transforme 1 Newsletter em múltiplos formatos utilizando IA (GPT-4o).</p>
      </div>

      <div className={styles.layout}>
        {/* Form Column */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Gerar Multiplataforma</h2>
          <form className={styles.form} onSubmit={handlePipeline}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Texto da Newsletter (Pressel base)</label>
              <textarea
                className={styles.textarea}
                value={newsletterText}
                onChange={(e) => setNewsletterText(e.target.value)}
                required
                placeholder="Cole o texto da sua newsletter aqui..."
                rows={12}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Processando com IA..." : "Gerar Conteúdos (Explodir)"}
            </button>
          </form>
        </section>

        {/* List Column */}
        <section className={styles.cardMain}>
          <h2 className={styles.cardTitle}>Calendário Editorial / Rascunhos</h2>
          {loading ? (
            <div className={styles.loading}>Carregando publicações...</div>
          ) : error ? (
            <div className={styles.errorState}>Falha ao obter dados.</div>
          ) : publicacoes.length === 0 ? (
            <div className={styles.emptyState}>Nenhum conteúdo gerado ainda.</div>
          ) : (
            <div className={styles.gridList}>
              {publicacoes.map((pub, idx) => (
                <div key={pub.id || idx} className={styles.pubCard}>
                  <div className={styles.pubHeader}>
                    <span className={styles.platformBadge}>{formatPlataforma(pub.plataforma)}</span>
                    <span className={`${styles.statusBadge} ${pub.status === "rascunho" ? styles.statusDraft : styles.statusScheduled}`}>
                      {pub.status}
                    </span>
                  </div>
                  <h3 className={styles.pubTitle}>{pub.titulo}</h3>
                  <div className={styles.pubContentPreview}>
                    {pub.conteudo}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
