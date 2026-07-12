"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

interface HealthStatus {
  status: string;
  database: string;
}

export default function Header() {
  const pathname = usePathname();
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        } else {
          setHealth({ status: "error", database: "offline" });
        }
      } catch (error) {
        setHealth({ status: "error", database: "offline" });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return { title: "Dashboard Geral", subtitle: "Gestao de metas e OKRs do negocio" };
      case "/crm":
        return { title: "CRM Leads", subtitle: "Modulo 1 - Captacao e gestao de leads (C1)" };
      case "/funnels":
        return { title: "FuNews", subtitle: "Modulo 4 - Mapa visual e conversao de funis (C4)" };
      default:
        return { title: "Sistema", subtitle: "Metodo 4Cs com IA" };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{pageInfo.title}</h1>
        <span className={styles.subtitle}>{pageInfo.subtitle}</span>
      </div>

      <div className={styles.statusSection}>
        <div className={styles.aiIndicator}>
          <div className={styles.pulseDot}></div>
          <span>Operacao 70% com IA</span>
        </div>

        {health && (
          <div className={styles.dbStatus}>
            <div
              className={`${styles.dbDot} ${
                health.database === "connected"
                  ? styles.dbConnected
                  : styles.dbFallback
              }`}
            ></div>
            <span>
              {health.database === "connected"
                ? "PostgreSQL Ativo"
                : health.database === "fallback_mock"
                ? "Modo Simulacao"
                : "API Offline"}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
