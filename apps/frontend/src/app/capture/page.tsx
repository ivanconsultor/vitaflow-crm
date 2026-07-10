"use client";

import Quiz from "@/components/Quiz";
import styles from "./capture.module.css";
import { Lock, FileText, CheckCircle, Heart, Shield, Sparkles } from "lucide-react";

export default function CapturePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <span className={styles.tagline}>AVALIAÇÃO CLÍNICA RESTRITA</span>
        <h2 className={`${styles.title} serifFont`}>
          Descubra o Inimigo Oculto que Está Travando o Seu Metabolismo
        </h2>
      </section>

      {/* Storytelling & Empatia (Hook & Story) */}
      <section className={styles.storySection}>
        <div className={styles.storyText}>
          <p>
            Você já sentiu que a sua mente continua jovem, cheia de planos e vontade de viver, mas o seu corpo simplesmente não acompanha mais?
          </p>
          <p>
            Nós sabemos exatamente como é a frustração de tentar de tudo — dietas radicais, treinos exaustivos, pílulas mágicas — e ver a energia e a autoestima irem ralo abaixo. Mas aqui está o que a indústria não te conta: <strong>a culpa não é sua.</strong>
          </p>
          <p>
            O verdadeiro responsável por roubar o seu vigor é um inimigo silencioso e inflamatório, escondido na sua rotina. Nosso projeto educacional foi desenhado justamente para resgatar a sua melhor versão através de escolhas clínicas e inteligentes, sem promessas mirabolantes.
          </p>
        </div>

        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <Heart size={24} className={styles.pillarIcon} />
            <h4 className={styles.pillarTitle}>Filosofia Positiva</h4>
            <p>O envelhecimento não precisa ser um fardo. É possível envelhecer com beleza, força e brilho no olhar.</p>
          </div>
          <div className={styles.pillarCard}>
            <Shield size={24} className={styles.pillarIcon} />
            <h4 className={styles.pillarTitle}>Prática Segura</h4>
            <p>Sem dietas malucas. Apenas hábitos validados pela ciência que desativam o inimigo oculto no seu corpo.</p>
          </div>
          <div className={styles.pillarCard}>
            <Sparkles size={24} className={styles.pillarIcon} />
            <h4 className={styles.pillarTitle}>Comunidade Restrita</h4>
            <p>Faça parte de um ecossistema de pessoas maduras focadas na longevidade e no resgate da autoestima.</p>
          </div>
        </div>
      </section>

      {/* Quiz Section (Offer) */}
      <section className={styles.offerSection}>
        <h3 className={`${styles.offerTitle} serifFont`}>Dê o Primeiro Passo</h3>
        <p className={styles.offerDescription}>
          Responda ao nosso questionário confidencial de 60 segundos e receba um diagnóstico exclusivo para neutralizar o que está drenando sua energia.
        </p>
        <div className={styles.quizWrapper}>
          <Quiz />
        </div>
      </section>

      {/* Missions Section (Always Visible) */}
      <section className={styles.missionsState}>
        <div className={styles.missionsHeader}>
          <h3 className={`${styles.missionsTitle} serifFont`}>O Que Te Aguarda Após o Diagnóstico</h3>
          <p className={styles.missionsDesc}>Uma prévia das 3 missões que preparamos para resgatar a sua vitalidade.</p>
        </div>
        
        <div className={styles.missionCard}>
          <div className={styles.missionHeader}>
            <span className={styles.missionTag}>Missão 1/3: E-mail</span>
            <p>Confirme a sua inscrição clicando no botão do seu provedor de e-mail preferido.</p>
          </div>
          <div className={styles.emailButtons}>
            <a href="https://mail.google.com/" target="_blank" rel="noreferrer" className={styles.emailBtn}>GMAIL</a>
            <a href="https://outlook.live.com/" target="_blank" rel="noreferrer" className={styles.emailBtn}>HOTMAIL</a>
            <a href="https://mail.yahoo.com/" target="_blank" rel="noreferrer" className={styles.emailBtn}>YAHOO</a>
          </div>
        </div>

        <div className={styles.missionCard}>
          <div className={styles.missionHeader}>
            <span className={styles.missionTag}>Missão 2/3: VIP SMS Alerts</span>
            <p>Cadastre seu número para receber ofertas relâmpago e lembretes exclusivos direto no seu celular.</p>
          </div>
          <button onClick={() => alert('Integração SMS (Twilio) em breve')} className={styles.smsBtn}>Ativar Alertas por SMS</button>
        </div>

        <div className={styles.missionCard}>
          <div className={styles.missionHeader}>
            <span className={styles.missionTag}>Missão 3/3: Vídeo Secreto</span>
            <p>Assista aos passos iniciais fundamentais que preparamos para você.</p>
          </div>
          <div className={styles.missionVideoWrapper}>
            <iframe 
              width="100%" height="100%" 
              src="https://www.youtube.com/embed/ScMzIvxBSi4?si=r7EStE2Nix6s5s4a&controls=0" 
              title="Video Boas Vindas" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustBadges}>
        <div className={styles.badge}>
          <CheckCircle size={16} />
          <span>Mais de 17.000 perfis mapeados</span>
        </div>
        <div className={styles.badge}>
          <FileText size={16} />
          <span>Baseado em evidências clínicas</span>
        </div>
        <div className={styles.badge}>
          <Lock size={16} />
          <span>Privacidade médica 100% garantida</span>
        </div>
      </section>
    </div>
  );
}
