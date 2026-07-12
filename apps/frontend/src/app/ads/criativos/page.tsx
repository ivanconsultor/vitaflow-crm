"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle2, ChevronRight, Play, FileText, Image as ImageIcon, Layers, RefreshCw } from "lucide-react";
import styles from "./page.module.css";

interface Hook {
  tipo: string;
  headline: string;
  primary_text: string;
  cta: string;
}

interface VslScript {
  titulo: string;
  abertura: string;
  problema: string;
  solucao: string;
  prova: string;
  oferta: string;
  cta: string;
}

interface Advertorial {
  titulo: string;
  subtitulo: string;
  corpo_completo: string;
}

interface CreativeData {
  hooks: Hook[];
  vsl_scripts: VslScript[];
  advertorials: Advertorial[];
  sugestoes_imagem: string[];
}

export default function CriativosPage() {
  const [produto, setProduto] = useState("");
  const [nicho, setNicho] = useState("Emagrecimento");
  const [avatar, setAvatar] = useState("");
  const [plataforma, setPlataforma] = useState("meta");
  const [loading, setLoading] = useState(false);
  const [creativeData, setCreativeData] = useState<CreativeData | null>(null);
  const [activeTab, setActiveTab] = useState<"hooks" | "vsl" | "advertorial" | "imagens">("hooks");
  const [launchingIndex, setLaunchingIndex] = useState<number | null>(null);
  const [launchStatus, setLaunchStatus] = useState<{ message: string; campaign_id: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto || !avatar) return;

    setLoading(true);
    setCreativeData(null);
    setLaunchStatus(null);

    try {
      const response = await fetch("/api/ads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produto, nicho, avatar, plataforma })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCreativeData(result.data);
        }
      }
    } catch (error) {
      console.error("Erro ao comunicar com a API do CRM:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchCampaign = async (hook: Hook, index: number) => {
    setLaunchingIndex(index);
    setLaunchStatus(null);

    try {
      const response = await fetch("/api/ads/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plataforma,
          campanhaName: `VitaFlow_${produto}_${hook.tipo}_${new Date().toLocaleDateString('pt-BR')}`,
          headline: hook.headline,
          adBody: hook.primary_text,
          finalUrl: "https://vitaflow-seunegocio.com/capture", // Rota do Quiz integrada
          creativeImageUrl: "https://vitaflow-seunegocio.com/assets/campaign-image.jpg"
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setLaunchStatus({
            message: result.message || "Campanha criada com sucesso!",
            campaign_id: result.data?.campaign_id || "act_unknown"
          });
        }
      }
    } catch (error) {
      console.error("Erro ao despachar campanha:", error);
    } finally {
      setLaunchingIndex(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitleArea}>
          <Sparkles className={styles.headerIcon} size={28} />
          <h1 className={styles.title}>Gerador & Lançador de Campanhas</h1>
        </div>
        <p className={styles.subtitle}>
          Crie criativos de Direct Response de alto impacto com Claude IA e lance campanhas pausadas nas fontes de tráfego com 1 clique.
        </p>
      </div>

      <div className={styles.contentGrid}>
        {/* Formulário de Configuração */}
        <div className={styles.formCard}>
          <h2 className={styles.sectionTitle}>1. Definir Oferta e Público</h2>
          <form onSubmit={handleGenerate} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Nome do Produto (ClickBank/Redes)</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Ex: Alpilean, ProDentim, Puravive"
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Nicho da Oferta</label>
                <select 
                  className={styles.select}
                  value={nicho}
                  onChange={(e) => setNicho(e.target.value)}
                >
                  <option value="Emagrecimento">Emagrecimento (Weight Loss)</option>
                  <option value="Rejuvenescimento">Rejuvenescimento (Anti-Aging)</option>
                  <option value="Saude Geral">Saúde Geral & Nutra</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Plataforma de Tráfego</label>
                <select 
                  className={styles.select}
                  value={plataforma}
                  onChange={(e) => setPlataforma(e.target.value)}
                >
                  <option value="meta">Meta Ads (Facebook/Instagram)</option>
                  <option value="google">Google Ads (Search)</option>
                  <option value="native">Native Ads (Taboola/Outbrain)</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Avatar / Dores e Desejos do Público</label>
              <textarea 
                className={styles.textarea}
                placeholder="Descreva quem é o cliente ideal (ex: Mulheres, 45+ anos, lutando com ganho de peso pós-menopausa, cansadas de dietas rigorosas e procurando um segredo de metabolismo natural...)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.btnGenerate} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className={styles.spinner} size={20} />
                  Processando Inteligência de Cópia...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Gerar Criativos 4Cs com Claude
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resultados */}
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h2 className={styles.sectionTitle}>2. Peças Criadas pela IA</h2>
            {creativeData && (
              <div className={styles.tabList}>
                <button 
                  className={`${styles.tabBtn} ${activeTab === "hooks" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("hooks")}
                >
                  <Layers size={16} /> Hooks
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === "vsl" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("vsl")}
                >
                  <Play size={16} /> Roteiro VSL
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === "advertorial" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("advertorial")}
                >
                  <FileText size={16} /> Advertorial
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === "imagens" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("imagens")}
                >
                  <ImageIcon size={16} /> Sugestões Visuais
                </button>
              </div>
            )}
          </div>

          <div className={styles.resultBody}>
            {/* Mensagem quando não há dados */}
            {!creativeData && !loading && (
              <div className={styles.emptyState}>
                <Sparkles className={styles.emptyStateIcon} size={48} />
                <p className={styles.emptyStateText}>Preencha os dados à esquerda e gere criativos estratégicos para estruturar sua máquina de tráfego.</p>
              </div>
            )}

            {/* Spinner de Carregamento */}
            {loading && (
              <div className={styles.loadingArea}>
                <RefreshCw className={styles.bigSpinner} size={40} />
                <p className={styles.loadingText}>O Claude está minerando os melhores ângulos de neuromarketing e gerando copies de alta conversão...</p>
              </div>
            )}

            {/* Exibição de Hooks */}
            {creativeData && activeTab === "hooks" && (
              <div className={styles.hooksGrid}>
                {creativeData.hooks.map((hook, index) => (
                  <div key={index} className={styles.hookCard}>
                    <div className={styles.hookCardHeader}>
                      <span className={styles.hookBadge}>{hook.tipo}</span>
                      <button 
                        className={styles.btnLaunch}
                        onClick={() => handleLaunchCampaign(hook, index)}
                        disabled={launchingIndex !== null}
                      >
                        {launchingIndex === index ? (
                          <RefreshCw className={styles.spinner} size={14} />
                        ) : (
                          <Send size={14} />
                        )}
                        Lançar Anúncio
                      </button>
                    </div>
                    <h3 className={styles.hookTitle}>{hook.headline}</h3>
                    <p className={styles.hookText}>{hook.primary_text}</p>
                    <div className={styles.hookFooter}>
                      <span className={styles.hookCtaLabel}>Botão CTA recomendado: <strong>{hook.cta}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Exibição do Roteiro VSL */}
            {creativeData && activeTab === "vsl" && (
              <div className={styles.vslContainer}>
                {creativeData.vsl_scripts.map((script, index) => (
                  <div key={index} className={styles.vslSection}>
                    <h3 className={styles.vslTitle}>{script.titulo}</h3>
                    
                    <div className={styles.vslBlock}>
                      <span className={styles.vslBlockLabel}>Gancho & Abertura (0-15s)</span>
                      <p className={styles.vslBlockContent}>{script.abertura}</p>
                    </div>
                    <div className={styles.vslBlock}>
                      <span className={styles.vslBlockLabel}>Agitação do Problema</span>
                      <p className={styles.vslBlockContent}>{script.problema}</p>
                    </div>
                    <div className={styles.vslBlock}>
                      <span className={styles.vslBlockLabel}>Apresentação da Solução</span>
                      <p className={styles.vslBlockContent}>{script.solucao}</p>
                    </div>
                    <div className={styles.vslBlock}>
                      <span className={styles.vslBlockLabel}>Apresentação da Oferta</span>
                      <p className={styles.vslBlockContent}>{script.oferta}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Exibição de Advertorial */}
            {creativeData && activeTab === "advertorial" && (
              <div className={styles.editorialContainer}>
                {creativeData.advertorials.map((adv, index) => (
                  <div key={index} className={styles.editorialArticle}>
                    <h3 className={styles.editorialTitle}>{adv.titulo}</h3>
                    <h4 className={styles.editorialSubtitle}>{adv.subtitulo}</h4>
                    <div className={styles.editorialBody}>
                      <p>{adv.corpo_completo}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Exibição de Sugestões Visuais */}
            {creativeData && activeTab === "imagens" && (
              <div className={styles.imageSuggestions}>
                <h3 className={styles.imageTitle}>Direcionamento Criativo de Imagem / Vídeo</h3>
                <ul className={styles.imageList}>
                  {creativeData.sugestoes_imagem.map((img, index) => (
                    <li key={index} className={styles.imageListItem}>
                      <ChevronRight size={18} className={styles.listIcon} />
                      <span>{img}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status do Lançamento */}
            {launchStatus && (
              <div className={styles.launchAlert}>
                <CheckCircle2 className={styles.alertIcon} size={24} />
                <div className={styles.alertTextWrap}>
                  <p className={styles.alertMessage}>{launchStatus.message}</p>
                  <span className={styles.alertSub}>ID da Campanha Criada: <strong>{launchStatus.campaign_id}</strong> (Status: PAUSED)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
