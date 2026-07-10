"use client";

import { useState } from "react";
import { Check, Copy, Code, Link2 } from "lucide-react";
import styles from "./page.module.css";

export default function IntegracoesPage() {
  const [copied, setCopied] = useState(false);

  const pixelCode = `<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://your-system-4cs.com/pixel.js');
  fbq('init', 'SEU_ID_AQUI');
  fbq('track', 'PageView');
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixelCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Integrações & Rastreamento</h1>
        <p className={styles.subtitle}>
          Conecte ferramentas externas (ClickBank, BuyGoods, Digistore24, MaxWeb, GuruMedia) ao seu Quartel General 4Cs.
        </p>
      </div>

      <div className={styles.integrationGrid}>
        {/* ClickBank Integration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Link2 size={24} />
            </div>
            <h2 className={styles.cardTitle}>ClickBank Webhook (INS)</h2>
            <span className={styles.badge}>Ativo</span>
          </div>
          <p className={styles.description}>
            Use a URL abaixo no painel da ClickBank (Instant Notification Service) para receber as vendas em tempo real no seu CRM.
          </p>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>URL do Webhook (Copie e cole na ClickBank):</label>
            <input 
              className={styles.input}
              type="text" 
              readOnly 
              value="https://api.seusistema4cs.com/api/webhooks/clickbank"
            />
          </div>
        </div>

        {/* BuyGoods Integration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Link2 size={24} />
            </div>
            <h2 className={styles.cardTitle}>BuyGoods Postback</h2>
            <span className={styles.badge}>Ativo</span>
          </div>
          <p className={styles.description}>
            Use a URL abaixo no painel da BuyGoods (Postback URL) para receber as vendas em tempo real no seu CRM.
          </p>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>URL do Postback (Copie e cole na BuyGoods):</label>
            <input 
              className={styles.input}
              type="text" 
              readOnly 
              value="https://api.seusistema4cs.com/api/webhooks/buygoods"
            />
          </div>
        </div>

        {/* Digistore24 Integration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Link2 size={24} />
            </div>
            <h2 className={styles.cardTitle}>Digistore24 Webhook (IPN)</h2>
            <span className={styles.badge}>Ativo</span>
          </div>
          <p className={styles.description}>
            Use a URL abaixo no painel da Digistore24 (Instant Payment Notification) para receber as vendas em tempo real no seu CRM.
          </p>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>URL do Webhook (Copie e cole na Digistore24):</label>
            <input 
              className={styles.input}
              type="text" 
              readOnly 
              value="https://api.seusistema4cs.com/api/webhooks/digistore24"
            />
          </div>
        </div>

        {/* MaxWeb Integration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Link2 size={24} />
            </div>
            <h2 className={styles.cardTitle}>MaxWeb Postback</h2>
            <span className={styles.badge}>Ativo</span>
          </div>
          <p className={styles.description}>
            Use a URL abaixo no painel da MaxWeb (Postback URL) para receber as comissões de vendas em tempo real no seu CRM.
          </p>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>URL do Postback (Substitua pelo seu token):</label>
            <input 
              className={styles.input}
              type="text" 
              readOnly 
              value="https://api.seusistema4cs.com/api/webhooks/maxweb?token=SEU_TOKEN_AQUI"
            />
          </div>
        </div>

        {/* GuruMedia Integration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Link2 size={24} />
            </div>
            <h2 className={styles.cardTitle}>GuruMedia Postback</h2>
            <span className={styles.badge}>Ativo</span>
          </div>
          <p className={styles.description}>
            Use a URL abaixo no painel da GuruMedia (Postback URL) para enviar as notificações de conversões de vendas ao seu CRM.
          </p>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>URL do Postback (Substitua pelo seu token):</label>
            <input 
              className={styles.input}
              type="text" 
              readOnly 
              value="https://api.seusistema4cs.com/api/webhooks/gurumedia?token=SEU_TOKEN_AQUI"
            />
          </div>
        </div>

        {/* Tracking Pixel */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Code size={24} />
            </div>
            <h2 className={styles.cardTitle}>Pixel de Rastreamento 4Cs</h2>
          </div>
          <p className={styles.description}>
            Cole o script abaixo na tag <strong>&lt;head&gt;</strong> da sua página de Presell externa (ex: WordPress, Elementor) para capturar as visitas e rastrear os UTMs.
          </p>
          
          <div className={styles.codeBlock}>
            {pixelCode}
          </div>

          <button onClick={copyToClipboard} className={styles.copyButton}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copiado!" : "Copiar Script do Pixel"}
          </button>
        </div>
      </div>
    </div>
  );
}
