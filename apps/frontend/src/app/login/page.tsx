"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("gsd_token", data.token);
        router.push("/");
      } else {
        setError(data.error || "Credenciais inválidas");
      }
    } catch (err) {
      setError("Erro ao conectar no servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ background: 'rgba(168,85,247,0.1)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={24} color="#A855F7" />
          </div>
          <h1 className={styles.title}>VitaFlow</h1>
          <p className={styles.subtitle}>GSD Security - Acesso Restrito</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Mestre</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className={styles.input}
                placeholder="admin@vitaflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={16} color="#64748B" style={{ position: 'absolute', right: 16, top: 16 }} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha Mestre</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}
