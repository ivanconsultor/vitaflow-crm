"use client";

import { useState } from "react";
import styles from "./Quiz.module.css";

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [pergunta1, setPergunta1] = useState("");
  const [pergunta2, setPergunta2] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePergunta1 = (value: string) => {
    setPergunta1(value);
    setStep(2);
  };

  const handlePergunta2 = (value: string) => {
    setPergunta2(value);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          optIn,
          respostas: {
            pergunta1,
            pergunta2
          }
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Erro ao enviar respostas. Tente novamente.");
      }
    } catch (err) {
      alert("Falha de conexao com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.quizContainer}>
        <div className={styles.successState}>
          <h3 className={styles.successTitle}>Avaliação Concluída</h3>
          <p className={styles.successMsg}>
            Seus dados foram registrados com sucesso. Continue rolando a página para desbloquear as suas missões e receber o seu diagnóstico.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      {step === 1 && (
        <div>
          <span className={styles.stepIndicator}>Pergunta 1 de 2</span>
          <h3 className={styles.question}>Qual e o seu principal objetivo de saude atualmente?</h3>
          <div className={styles.optionsGrid}>
            <button
              type="button"
              className={styles.optionBtn}
              onClick={() => handlePergunta1("emagrecer")}
            >
              Perda de Peso e Emagrecimento Saudavel
            </button>
            <button
              type="button"
              className={styles.optionBtn}
              onClick={() => handlePergunta1("energia")}
            >
              Mais Energia e Disposicao no Dia a Dia
            </button>
            <button
              type="button"
              className={styles.optionBtn}
              onClick={() => handlePergunta1("foco")}
            >
              Melhoria de Foco e Performance Cognitiva
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <span className={styles.stepIndicator}>Pergunta 2 de 2</span>
          <h3 className={styles.question}>Voce reside atualmente nos Estados Unidos?</h3>
          <div className={styles.optionsGrid}>
            <button
              type="button"
              className={styles.optionBtn}
              onClick={() => handlePergunta2("eua")}
            >
              Sim, moro nos Estados Unidos
            </button>
            <button
              type="button"
              className={styles.optionBtn}
              onClick={() => handlePergunta2("outro")}
            >
              Nao, resido em outro pais
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <span className={styles.stepIndicator}>Finalizar Cadastro</span>
          <h3 className={styles.question}>Onde devemos enviar o seu resultado e plano personalizado?</h3>
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
              <label className={styles.label}>Mobile Phone (US format)</label>
              <input
                type="tel"
                className={styles.input}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="+1 (XXX) XXX-XXXX"
              />
            </div>

            <div className={styles.formGroup} style={{ flexDirection: "row", alignItems: "flex-start", gap: "10px", marginTop: "1rem" }}>
              <input
                type="checkbox"
                id="optIn"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                required
                style={{ marginTop: "4px" }}
              />
              <label htmlFor="optIn" style={{ fontSize: "0.85rem", color: "#a0aec0", lineHeight: "1.4" }}>
                I agree to receive SMS and emails regarding my health profile and special offers. Data rates may apply. Reply STOP to opt-out.
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting} style={{ marginTop: "1.5rem" }}>
              {submitting ? "Enviando..." : "Ver Meu Resultado"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
