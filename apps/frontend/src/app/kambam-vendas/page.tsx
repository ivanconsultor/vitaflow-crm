"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "../../components/KanbanBoard";
import styles from "./page.module.css";
import { Calendar, DollarSign, Target, ShoppingCart, ChevronDown, RefreshCw, Plus } from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: string;
  valor_potencial: number | null;
}

export default function ProspectosPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetchWithAuth("/api/leads");
        if (!response.ok) {
          throw new Error("Falha ao obter leads");
        }
        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setError("Falha ao conectar com a API de Leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* 1. SEÇÃO OPERACIONAL (KANBAN) */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Kanban Vendas</h1>
          <p className={styles.subtitle}>Gestão de vendas vindas da Presell do site.</p>
        </div>
      </header>

      {loading ? (
        <p className={styles.loading}>Carregando prospectos...</p>
      ) : error ? (
        <div className={styles.errorContainer}>{error}</div>
      ) : (
        <main className={styles.main}>
          <KanbanBoard leads={leads} />
        </main>
      )}

    </div>
  );
}

