"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { ChevronDown, RefreshCcw, Sparkles } from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

export default function VendasDashboard() {
  const [activeTab, setActiveTab] = useState("planilha");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePill, setActivePill] = useState("consolidado");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [categoriaFilter, setCategoriaFilter] = useState("Todos");
  
  // AI Insights State
  const [cvsInsights, setCvsInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  React.useEffect(() => {
    if (activeTab === "metricas" && activePill === "cvs_ai") {
      const fetchInsights = async () => {
        setIsLoadingInsights(true);
        try {
          const res = await fetchWithAuth("http://localhost:3001/api/vendas/insights");
          const data = await res.json();
          if (data.success) {
            setCvsInsights(data.insights);
          } else {
            setCvsInsights("Erro ao carregar insights.");
          }
        } catch (e) {
          setCvsInsights("Falha de conexão com a API de insights.");
        } finally {
          setIsLoadingInsights(false);
        }
      };
      if (!cvsInsights) fetchInsights();
    }
  }, [activeTab, activePill, cvsInsights]);

  // ── Mock: Campanhas de Vendas Semanais (CVS) ──
  const initialCampanhas = [
    {
      mes: "Jan 2026", key: "jan", qtdCampanhas: 2, rowClass: styles.rowMonthJan,
      totais: { vendas: 124, est: 95, varPct: "+30.5%", dif: "+8.702,77", fatBruto: "R$ 116.668,00", fatura: "R$ 3.763,48", orderBump: "R$ 3.686,00", anuncio: "R$ 0,00", ir: "R$ 14.000,16", gateway: "R$ 5.821,73", fatLiquido: "R$ 96.846,11", suaPartePct: "50.0%", lucro: "R$ 48.423,05", margem: "41.5%" },
      itens: [
        { id: 1, codigo: "C02", dot: styles.dotCyan, produto: "Workshop Viver d...", catLetra: "T", catClass: styles.catT, dias: 15, inicio: "01/01", fim: "15/01", preco: "47,00", vendas: 106, est: 80, varPct: "+32.5%", dif: "+1.231,87", fatBruto: "8.668,00", fatura: "332,13", orderBump: "3.686,00", anuncio: "-", ir: "1.040,16", gateway: "432,53", fatLiquido: "7.195,31", suaPartePct: "50.0%", lucro: "3.597,65", margem: "41.5%", status: "Concluída" },
        { id: 2, codigo: "C02", dot: styles.dotCyan, produto: "Grupo de Impleme...", catLetra: "M", catClass: styles.catM, dias: 5, inicio: "16/01", fim: "20/01", preco: "6.000,00", vendas: 18, est: 15, varPct: "+20.0%", dif: "+7.470,90", fatBruto: "108.000,00", fatura: "21.600,00", orderBump: "-", anuncio: "-", ir: "12.960,00", gateway: "5.389,20", fatLiquido: "89.650,80", suaPartePct: "50.0%", lucro: "44.825,40", margem: "41.5%", status: "Concluída" }
      ]
    },
    {
      mes: "Fev 2026", key: "fev", qtdCampanhas: 3, rowClass: styles.rowMonthFev,
      totais: { vendas: 107, est: 20, varPct: "-15.0%", dif: "1.252,50", fatBruto: "R$ 74.149,00", fatura: "R$ 2.648,18", orderBump: "R$ 1.940,00", anuncio: "R$ 3.000,00", ir: "R$ 8.897,88", gateway: "R$ 2.899,42", fatLiquido: "R$ 59.351,70", suaPartePct: "56.0%", lucro: "R$ 33.224,85", margem: "44.8%" },
      itens: [
        { id: 3, codigo: "C01", dot: styles.dotCyan, produto: "Curso Viver de Ne...", catLetra: "C", catClass: styles.catC, dias: 12, inicio: "01/02", fim: "12/02", preco: "497,00", vendas: 17, est: 20, varPct: "-15.0%", dif: "1.252,50", fatBruto: "8.449,00", fatura: "704,08", orderBump: "-", anuncio: "-", ir: "1.013,88", gateway: "337,12", fatLiquido: "7.098,00", suaPartePct: "100.0%", lucro: "7.098,00", margem: "84.0%", status: "Concluída" },
        { id: 4, codigo: "C03", dot: styles.dotCyan, produto: "Workshop Viver d...", catLetra: "T", catClass: styles.catT, dias: 12, inicio: "15/02", fim: "26/02", preco: "47,00", vendas: 80, est: 80, varPct: "-", dif: "-", fatBruto: "5.700,00", fatura: "313,33", orderBump: "1.940,00", anuncio: "2.000,00", ir: "684,00", gateway: "222,30", fatLiquido: "2.793,70", suaPartePct: "50.0%", lucro: "1.396,85", margem: "24.5%", status: "Planejada" },
        { id: 5, codigo: "C03", dot: styles.dotCyan, produto: "Grupo de Impleme...", catLetra: "M", catClass: styles.catM, dias: 11, inicio: "27/02", fim: "09/03", preco: "6.000,00", vendas: 10, est: 10, varPct: "-", dif: "-", fatBruto: "60.000,00", fatura: "5.454,55", orderBump: "-", anuncio: "1.000,00", ir: "7.200,00", gateway: "2.340,00", fatLiquido: "49.460,00", suaPartePct: "50.0%", lucro: "24.730,00", margem: "41.2%", status: "Planejada" }
      ]
    },
    {
      mes: "Mar 2026", key: "mar", qtdCampanhas: 2, rowClass: styles.rowMonthMar,
      totais: { vendas: 10, est: 10, varPct: "-", dif: "-", fatBruto: "R$ 210.000,00", fatura: "R$ 6.774,19", orderBump: "-", anuncio: "R$ 4.000,00", ir: "R$ 25.200,00", gateway: "R$ 8.190,00", fatLiquido: "R$ 172.610,00", suaPartePct: "38.0%", lucro: "R$ 65.571,95", margem: "31.2%" },
      itens: [
        { id: 6, codigo: "C01", dot: styles.dotPink, produto: "Mastermind Heroes", catLetra: "M", catClass: styles.catM, dias: 10, inicio: "10/03", fim: "19/03", preco: "30.000,00", vendas: 5, est: 5, varPct: "-", dif: "-", fatBruto: "150.000,00", fatura: "15.000,00", orderBump: "-", anuncio: "2.000,00", ir: "18.000,00", gateway: "5.850,00", fatLiquido: "124.150,00", suaPartePct: "33.3%", lucro: "41.341,95", margem: "27.6%", status: "Planejada" },
        { id: 7, codigo: "C01", dot: styles.dotPurple, produto: "Mentoria Viver de ...", catLetra: "M", catClass: styles.catM, dias: 12, inicio: "22/03", fim: "02/04", preco: "12.000,00", vendas: 5, est: 5, varPct: "-", dif: "-", fatBruto: "60.000,00", fatura: "5.000,00", orderBump: "-", anuncio: "2.000,00", ir: "7.200,00", gateway: "2.340,00", fatLiquido: "48.460,00", suaPartePct: "50.0%", lucro: "24.230,00", margem: "40.4%", status: "Planejada" }
      ]
    },
    {
      mes: "Abr 2026", key: "abr", qtdCampanhas: 2, rowClass: styles.rowMonthAbr,
      totais: { vendas: 30, est: 0, varPct: "-", dif: "-", fatBruto: "R$ 309.940,00", fatura: "R$ 10.331,33", orderBump: "-", anuncio: "R$ 12.000,00", ir: "R$ 37.192,80", gateway: "R$ 12.087,66", fatLiquido: "R$ 248.659,54", suaPartePct: "35.0%", lucro: "R$ 87.045,44", margem: "28.1%" },
      itens: [
        { id: 8, codigo: "C02", dot: styles.dotCyan, produto: "Curso Viver de Ne...", catLetra: "C", catClass: styles.catC, dias: 12, inicio: "05/04", fim: "16/04", preco: "497,00", vendas: 20, est: 20, varPct: "-", dif: "-", fatBruto: "9.940,00", fatura: "828,33", orderBump: "-", anuncio: "2.000,00", ir: "1.192,80", gateway: "387,66", fatLiquido: "6.359,54", suaPartePct: "100.0%", lucro: "6.359,54", margem: "64.0%", status: "Planejada" },
        { id: 9, codigo: "C01", dot: styles.dotPink, produto: "Heroes", catLetra: "M", catClass: styles.catM, dias: 13, inicio: "19/04", fim: "01/05", preco: "30.000,00", vendas: 10, est: 10, varPct: "-", dif: "-", fatBruto: "300.000,00", fatura: "23.076,92", orderBump: "-", anuncio: "10.000,00", ir: "36.000,00", gateway: "11.700,00", fatLiquido: "242.300,00", suaPartePct: "33.3%", lucro: "80.685,90", margem: "26.9%", status: "Planejada" }
      ]
    },
    {
      mes: "Mai 2026", key: "mai", qtdCampanhas: 4, rowClass: styles.rowMonthMai,
      totais: { vendas: 100, est: 0, varPct: "-", dif: "-", fatBruto: "R$ 275.700,00", fatura: "R$ 8.893,55", orderBump: "R$ 1.940,00", anuncio: "R$ 16.000,00", ir: "R$ 33.084,00", gateway: "R$ 10.752,30", fatLiquido: "R$ 215.863,70", suaPartePct: "40.6%", lucro: "R$ 87.699,80", margem: "31.8%" },
      itens: [
        { id: 10, codigo: "C04", dot: styles.dotCyan, produto: "Workshop Viver d...", catLetra: "T", catClass: styles.catT, dias: 5, inicio: "03/05", fim: "07/05", preco: "47,00", vendas: 80, est: 80, varPct: "-", dif: "-", fatBruto: "5.700,00", fatura: "752,00", orderBump: "1.940,00", anuncio: "4.000,00", ir: "684,00", gateway: "222,30", fatLiquido: "793,70", suaPartePct: "50.0%", lucro: "396,85", margem: "7.0%", status: "Planejada" },
        { id: 11, codigo: "C04", dot: styles.dotCyan, produto: "Grupo de Impleme...", catLetra: "M", catClass: styles.catM, dias: 5, inicio: "08/05", fim: "12/05", preco: "6.000,00", vendas: 10, est: 10, varPct: "-", dif: "-", fatBruto: "60.000,00", fatura: "12.000,00", orderBump: "-", anuncio: "2.000,00", ir: "7.200,00", gateway: "2.340,00", fatLiquido: "48.460,00", suaPartePct: "50.0%", lucro: "24.230,00", margem: "40.4%", status: "Planejada" },
        { id: 12, codigo: "C02", dot: styles.dotPink, produto: "Mastermind Heroes", catLetra: "M", catClass: styles.catM, dias: 10, inicio: "13/05", fim: "22/05", preco: "30.000,00", vendas: 5, est: 5, varPct: "-", dif: "-", fatBruto: "150.000,00", fatura: "15.000,00", orderBump: "-", anuncio: "5.000,00", ir: "18.000,00", gateway: "5.850,00", fatLiquido: "121.150,00", suaPartePct: "33.3%", lucro: "40.342,95", margem: "26.9%", status: "Planejada" },
        { id: 13, codigo: "C02", dot: styles.dotPurple, produto: "Mentoria Viver de ...", catLetra: "M", catClass: styles.catM, dias: 12, inicio: "24/05", fim: "04/06", preco: "12.000,00", vendas: 5, est: 5, varPct: "-", dif: "-", fatBruto: "60.000,00", fatura: "5.000,00", orderBump: "-", anuncio: "5.000,00", ir: "7.200,00", gateway: "2.340,00", fatLiquido: "45.460,00", suaPartePct: "50.0%", lucro: "22.730,00", margem: "37.9%", status: "Planejada" }
      ]
    },
    {
      mes: "Jun 2026", key: "jun", qtdCampanhas: 3, rowClass: styles.rowMonthJun,
      totais: { vendas: 105, est: 0, varPct: "-", dif: "-", fatBruto: "R$ 45.640,00", fatura: "R$ 1.521,33", orderBump: "R$ 1.940,00", anuncio: "R$ 11.000,00", ir: "R$ 5.476,80", gateway: "R$ 1.779,96", fatLiquido: "R$ 27.383,24", suaPartePct: "50.0%", lucro: "R$ 13.691,62", margem: "30.0%" },
      itens: [
        { id: 14, codigo: "C03", dot: styles.dotCyan, produto: "Curso Viver de Ne...", catLetra: "C", catClass: styles.catC, dias: 6, inicio: "07/06", fim: "12/06", preco: "497,00", vendas: 20, est: 20, varPct: "-", dif: "-", fatBruto: "9.940,00", fatura: "1.656,67", orderBump: "-", anuncio: "5.000,00", ir: "1.192,80", gateway: "387,66", fatLiquido: "3.359,54", suaPartePct: "100.0%", lucro: "3.359,54", margem: "33.8%", status: "Planejada" },
        { id: 15, codigo: "C05", dot: styles.dotCyan, produto: "Workshop Viver d...", catLetra: "T", catClass: styles.catT, dias: 12, inicio: "14/06", fim: "25/06", preco: "47,00", vendas: 80, est: 80, varPct: "-", dif: "-", fatBruto: "5.700,00", fatura: "313,33", orderBump: "1.940,00", anuncio: "4.000,00", ir: "684,00", gateway: "222,30", fatLiquido: "793,70", suaPartePct: "50.0%", lucro: "396,85", margem: "7.0%", status: "Planejada" },
        { id: 16, codigo: "C05", dot: styles.dotCyan, produto: "Grupo de Impleme...", catLetra: "M", catClass: styles.catM, dias: 5, inicio: "26/06", fim: "30/06", preco: "6.000,00", vendas: 5, est: 5, varPct: "-", dif: "-", fatBruto: "30.000,00", fatura: "6.000,00", orderBump: "-", anuncio: "2.000,00", ir: "3.600,00", gateway: "1.170,00", fatLiquido: "23.230,00", suaPartePct: "50.0%", lucro: "11.615,00", margem: "38.7%", status: "Planejada" }
      ]
    }
  ];

  const [campanhasData, setCampanhasData] = useState(initialCampanhas);

  // ── Mock: E-mails de Inteligência ──
  const emailMocks = [
    { num: 1, data: "02/01", assunto: "Janeiro Dourado começou", enviados: "13.479", or: "21.77%", ctr: "0.80%", insight: "Abertura consistente (21.77%) para inicio de campanha", isOrHigh: true, isCtrHigh: false },
    { num: 2, data: "03/01", assunto: "50 mil seguidores x 3 mil leads", enviados: "13.467", or: "21.32%", ctr: "0.89%", insight: "Prova social mantendo a atencao da audiencia.", isOrHigh: true, isCtrHigh: false },
    { num: 3, data: "05/01", assunto: "Voce vai odiar este email", enviados: "13.439", or: "21.71%", ctr: "1.95%", insight: "Campeao de cliques absoluto (1.95%). A polarizacao funciona.", isOrHigh: true, isCtrHigh: true },
    { num: 4, data: "05/01", assunto: "Restam 73 (matematica simples)", enviados: "13.423", or: "20.58%", ctr: "1.47%", insight: "Escassez numerica gerou excelente CTR (1.47%).", isOrHigh: false, isCtrHigh: true },
    { num: 5, data: "06/01", assunto: "A Grande Eracao de 2026 ja Comecou", enviados: "13.408", or: "21.86%", ctr: "0.73%", insight: "Curiosidade gerou alta abertura, mas clique baixo.", isOrHigh: true, isCtrHigh: false },
    { num: 6, data: "07/01", assunto: "\"Nao tenho tempo para newsletter\"", enviados: "13.380", or: "21.33%", ctr: "0.86%", insight: "Quebra de objecao manteve metricas estaveis.", isOrHigh: true, isCtrHigh: false },
    { num: 7, data: "08/01", assunto: "R$ 12,50 por hora (a verdade)", enviados: "13.353", or: "22.89%", ctr: "0.97%", insight: "Maior taxa de abertura da sequencia inicial (22.89%).", isOrHigh: true, isCtrHigh: false },
    { num: 8, data: "09/01", assunto: "Voce tem 4 horas livres?", enviados: "13.331", or: "19.97%", ctr: "1.15%", insight: "Pergunta direta qualificou o clique (1.15% CTR).", isOrHigh: false, isCtrHigh: true },
    { num: 9, data: "10/01", assunto: "A Pergunta Que Ninguem Quer Resposta", enviados: "13.315", or: "20.51%", ctr: "0.71%", insight: "Titulo misterioso teve o menor CTR (0.71%).", isOrHigh: false, isCtrHigh: false },
    { num: 10, data: "12/01", assunto: "Por que cobrei tao barato?", enviados: "13.294", or: "19.54%", ctr: "1.45%", insight: "Justificativa de preco converteu bem em cliques (1.45%).", isOrHigh: false, isCtrHigh: true },
    { num: 11, data: "13/01", assunto: "Meu maior erro em 2015...", enviados: "13.280", or: "21.84%", ctr: "0.95%", insight: "Storytelling de vulnerabilidade com boa abertura (21.84%).", isOrHigh: true, isCtrHigh: false },
    { num: 12, data: "14/01", assunto: "Dois homens escrevem emails por 4 horas", enviados: "13.256", or: "19.36%", ctr: "1.66%", insight: "Excelente CTR (1.66%) com narrativa comparativa.", isOrHigh: false, isCtrHigh: true },
    { num: 13, data: "15/01", assunto: "A antropologia da procrastinacao decisoria", enviados: "13.239", or: "22.10%", ctr: "0.87%", insight: "Recuperacao impressionante na abertura (22.1%).", isOrHigh: true, isCtrHigh: false },
    { num: 14, data: "16/01", assunto: "Instrucoes finais antes do fim", enviados: "13.221", or: "19.46%", ctr: "1.11%", insight: "Aviso pratico gerou bom engajamento de clique.", isOrHigh: false, isCtrHigh: true },
    { num: 15, data: "16/01", assunto: "Encerra as 23h59", enviados: "13.203", or: "19.92%", ctr: "0.70%", insight: "Urgencia final focou na abertura, cliques mais baixos.", isOrHigh: false, isCtrHigh: false },
    { num: 16, data: "16/01", assunto: "Acao Necessaria", enviados: "13.196", or: "22.08%", ctr: "1.82%", insight: "Performance estelar no encerramento. Alta abertura e CTR massivo.", isOrHigh: true, isCtrHigh: true }
  ];

  const handleSave = () => {
    if (!editingItem) {
      setIsModalOpen(false);
      return;
    }
    
    // Calculate dynamic values
    const precoStr = String(editingItem.preco || "0");
    const precoFloat = parseFloat(precoStr.replace(/\./g, '').replace(',', '.')) || 0;
    const vendasVal = Number(editingItem.vendas) || 0;
    const estVal = Number(editingItem.est) || 0;
    
    const fatBruto = (precoFloat * vendasVal).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    let varPctStr = "-";
    if (estVal > 0) {
      const varPctVal = ((vendasVal / estVal) - 1) * 100;
      varPctStr = (varPctVal > 0 ? "+" : "") + varPctVal.toFixed(1) + "%";
    }
    
    const difVal = vendasVal - estVal;
    const difStr = difVal > 0 ? "+" + difVal : (difVal === 0 ? "-" : String(difVal));

    const updatedItem = {
      ...editingItem,
      vendas: vendasVal,
      est: estVal,
      fatBruto,
      varPct: varPctStr,
      dif: difStr
    };

    const newData = campanhasData.map(grupo => {
      if (grupo.key === editingItem.grupoKey) {
        return {
          ...grupo,
          itens: grupo.itens.map(it => it.id === editingItem.id ? updatedItem : it)
        };
      }
      return grupo;
    });
    setCampanhasData(newData);
    setIsModalOpen(false);
  };

  // ── LÓGICA REATIVA (MOCK) DE AFILIADOS ──
  const metricasSimuladas = React.useMemo(() => {
    // Valores Base (ClickBank)
    let cbFat = 52340;
    let cbCliques = 14850;
    let cbEpc = 3.52;
    let cbChekouts = 4250;
    let cbFESales = 520;
    let cbUpsells = 145;

    // Valores Base (BuyGoods)
    let bgFat = 32252;
    let bgCliques = 8410;
    let bgEpc = 3.83;
    let bgCheckouts = 2354;
    let bgFESales = 325;
    let bgUpsells = 95;

    // Fator de Status
    if (statusFilter === "Planejada") {
      cbFat *= 0.2; cbCliques *= 0.2; cbChekouts *= 0.2; cbFESales *= 0.2; cbUpsells *= 0.2;
      bgFat *= 0.2; bgCliques *= 0.2; bgCheckouts *= 0.2; bgFESales *= 0.2; bgUpsells *= 0.2;
    } else if (statusFilter === "Concluída") {
      cbFat *= 0.8; cbCliques *= 0.8; cbChekouts *= 0.8; cbFESales *= 0.8; cbUpsells *= 0.8;
      bgFat *= 0.8; bgCliques *= 0.8; bgCheckouts *= 0.8; bgFESales *= 0.8; bgUpsells *= 0.8;
    }

    // Fator de Categoria
    if (categoriaFilter === "Encapsulados (Físico)") {
      cbFat *= 1.2; cbEpc *= 1.1;
      bgFat *= 1.3; bgEpc *= 1.15;
    } else if (categoriaFilter === "InfoProduto (Digital)") {
      cbFat *= 0.6; cbEpc *= 0.8;
      bgFat *= 0.4; bgEpc *= 0.7;
    }

    return {
      cb: {
        fat: cbFat, cliques: cbCliques, epc: cbEpc, checkouts: cbChekouts, fe: cbFESales, up: cbUpsells,
        pctCheckout: ((cbChekouts / cbCliques) * 100).toFixed(1),
        pctFE: ((cbFESales / cbCliques) * 100).toFixed(1),
        pctUp: ((cbUpsells / cbFESales) * 100).toFixed(1)
      },
      bg: {
        fat: bgFat, cliques: bgCliques, epc: bgEpc, checkouts: bgCheckouts, fe: bgFESales, up: bgUpsells,
        pctCheckout: ((bgCheckouts / bgCliques) * 100).toFixed(1),
        pctFE: ((bgFESales / bgCliques) * 100).toFixed(1),
        pctUp: ((bgUpsells / bgFESales) * 100).toFixed(1)
      },
      consolidado: {
        fat: cbFat + bgFat,
        aov: ((cbFat + bgFat) / (cbFESales + bgFESales)).toFixed(2)
      }
    };
  }, [statusFilter, categoriaFilter]);

  // ── Render ──
  return (
    <div className={styles.container}>
      <div className={styles.dashboardWrapper}>

        {/* ═══ HEADER ═══ */}
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.mainTitle}>Dashboard CVS</h1>
            <span className={styles.subTitle}>Campanhas de Vendas Semanais</span>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.updatedText}>Atualizado: 14:01:20</span>
            <button className={styles.btnRefresh}><RefreshCcw size={12} /> Atualizar</button>
            <button className={styles.btnPrimary} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
              <Sparkles size={12} /> Nova Campanha
            </button>
          </div>
        </header>

        {/* ═══ MODAL EDITAR CAMPANHA ═══ */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <span role="img" aria-label="edit">📝</span> {editingItem ? 'Editar Campanha' : 'Nova Campanha'}
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <div className={styles.modalHeaderSummary}>
                    <span>Faturamento Total: <span className={styles.textTeal}>R$ {editingItem?.fatBruto || '0,00'}</span></span>
                    <span style={{color: '#4ADE80'}}>Lucro Total: R$ {editingItem?.lucro || '0,00'}</span>
                  </div>
                  <button className={styles.btnCancel} style={{padding: 0, fontSize: 16}} onClick={() => setIsModalOpen(false)}>✕</button>
                </div>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>NOME DO PRODUTO</span>
                  <input className={styles.inputField} type="text" value={editingItem?.produto || "Nova Campanha"} onChange={e => setEditingItem({...editingItem, produto: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>CÓDIGO</span>
                  <input className={styles.inputField} type="text" value={editingItem?.codigo || ""} onChange={e => setEditingItem({...editingItem, codigo: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>CATEGORIA</span>
                  <div style={{position: 'relative'}}>
                    <select className={styles.inputField} style={{width: '100%', appearance: 'none'}} defaultValue="Treinamentos">
                      <option value="Treinamentos">Treinamentos</option>
                    </select>
                    <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 12, pointerEvents: 'none'}} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>DATA INÍCIO</span>
                  <input className={styles.inputField} type="date" defaultValue="2026-01-02" />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>DATA FIM</span>
                  <input className={styles.inputField} type="date" defaultValue="2026-01-16" />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>STATUS</span>
                  <div style={{position: 'relative'}}>
                    <select className={styles.inputField} style={{width: '100%', appearance: 'none', paddingLeft: 28}}>
                      <option>Concluída</option>
                    </select>
                    <div style={{position: 'absolute', left: 10, top: 12, width: 10, height: 10, background: '#4ADE80', borderRadius: 2}}></div>
                    <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 12, pointerEvents: 'none'}} />
                  </div>
                </div>
                <div className={styles.inputGroup} style={{gridColumn: '1 / -1', marginTop: -8}}>
                  <span className={styles.inputLabel}>LINK DE MÉTRICAS</span>
                  <input className={styles.inputField} type="text" defaultValue="https://dash-ws-jan-2026.vitaflow.com" />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>PREÇO</span>
                  <input className={styles.inputField} type="text" value={editingItem?.preco || ""} onChange={e => setEditingItem({...editingItem, preco: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>INVESTIMENTO ADS</span>
                  <input className={styles.inputField} type="text" defaultValue="0.00" />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>GATEWAY</span>
                  <div style={{position: 'relative'}}>
                    <select className={styles.inputField} style={{width: '100%', appearance: 'none'}}>
                      <option>InfinitePay (4.99%)</option>
                    </select>
                    <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 12, pointerEvents: 'none'}} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>IMPOSTO DE RENDA (%)</span>
                  <input className={styles.inputField} type="text" defaultValue="12" />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>VENDAS ESTIMADAS</span>
                  <input className={styles.inputField} type="text" value={editingItem?.est || ""} onChange={e => setEditingItem({...editingItem, est: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>VENDAS REAIS</span>
                  <input className={styles.inputField} type="text" value={editingItem?.vendas || ""} onChange={e => setEditingItem({...editingItem, vendas: e.target.value})} />
                </div>
                <div className={styles.inputGroupFull}>
                  <span className={styles.inputLabel} style={{display: 'flex', alignItems: 'center', gap: 6}}>
                    <span role="img" aria-label="box">📦</span> ORDER BUMP (OFERTA ADICIONAL NO CHECKOUT)
                  </span>
                  <span className={styles.inputLabel} style={{marginTop: 8}}>POSSUI ORDER BUMP?</span>
                  <div style={{position: 'relative', width: '33%'}}>
                    <select className={styles.inputField} style={{width: '100%', appearance: 'none'}}>
                      <option>Não</option>
                    </select>
                    <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 12, pointerEvents: 'none'}} />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnDelete}>Excluir</button>
                <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button className={styles.btnPrimary} onClick={handleSave}>Salvar Alterações</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FILTROS ═══ */}
        <div className={styles.controlsRow}>
          <div className={styles.controlGroup}>
            <span className={styles.inputLabel}>Visualização</span>
            <div style={{position: 'relative'}}>
              <select className={styles.selectInput} value={activeTab} onChange={e => setActiveTab(e.target.value)}>
                <option value="planilha">Planilha</option>
                <option value="cards">Cards</option>
                <option value="calendario">Calendário</option>
                <option value="graficos">Gráficos</option>
                <option value="projecao">Projeção</option>
                <option value="metricas">Métricas Detalhadas (VitaFlow)</option>
              </select>
              <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 10, pointerEvents: 'none'}} />
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.inputLabel}>Status</span>
            <div style={{position: 'relative'}}>
              <select className={styles.selectInput} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="Todas">Todas</option>
                <option value="Concluída">Concluída</option>
                <option value="Planejada">Planejada</option>
              </select>
              <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 10, pointerEvents: 'none'}} />
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.inputLabel}>Categoria</span>
            <div style={{position: 'relative'}}>
              <select className={styles.selectInput} value={categoriaFilter} onChange={e => setCategoriaFilter(e.target.value)}>
                <option value="Todos">Todos</option>
                <option value="Encapsulados (Físico)">Encapsulados (Físico)</option>
                <option value="InfoProduto (Digital)">InfoProduto (Digital)</option>
                <option value="Treinamentos">Treinamentos</option>
                <option value="Mentorias">Mentorias</option>
              </select>
              <ChevronDown size={12} color="#6B7280" style={{position: 'absolute', right: 12, top: 10, pointerEvents: 'none'}} />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            ABA 1: PLANILHA CVS (Tabela Financeira)
        ═══════════════════════════════════════════════ */}
        {activeTab === "planilha" && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>MES</th><th>CODIGO</th><th>PRODUTO</th><th>CAT</th><th>DIAS</th>
                  <th>INICIO</th><th>FIM</th><th>PRECO</th><th>VENDAS</th><th>EST.</th>
                  <th>VAR %</th><th>DIF</th><th>FAT. BRUTO</th><th>FATURA</th><th>ORDER BUMP</th>
                  <th>ANUNCIO</th><th>IR</th><th>GATEWAY</th><th>FAT. LIQUIDO</th><th>SUA PARTE %</th>
                  <th>LUCRO LIQUIDO</th><th>MARGEM LIQUIDA</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {campanhasData.map((grupo) => (
                  <React.Fragment key={grupo.key}>
                    <tr className={`${styles.groupHeader} ${grupo.rowClass}`}>
                      <td colSpan={4}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <div className={styles.btnCollapse}>-</div>
                          {grupo.mes}
                          <span style={{marginLeft: 24, fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 500}}>
                            {grupo.qtdCampanhas} campanha(s)
                          </span>
                        </div>
                      </td>
                      <td></td><td></td><td></td><td></td>
                      <td className={styles.textWhite}>{grupo.totais.vendas}</td>
                      <td style={{color: 'rgba(255,255,255,0.5)'}}>{grupo.totais.est}</td>
                      <td className={grupo.totais.varPct.includes('+') ? styles.textGreen : (grupo.totais.varPct === '-' ? '' : styles.textRed)}>{grupo.totais.varPct}</td>
                      <td className={grupo.totais.dif.includes('+') ? styles.textGreen : ''}>{grupo.totais.dif}</td>
                      <td className={styles.textTeal}>{grupo.totais.fatBruto}</td>
                      <td className={styles.textWhite}>{grupo.totais.fatura}</td>
                      <td style={{color: 'rgba(255,255,255,0.5)'}}>{grupo.totais.orderBump}</td>
                      <td style={{color: 'rgba(255,255,255,0.5)'}}>{grupo.totais.anuncio}</td>
                      <td style={{color: 'rgba(255,255,255,0.5)'}}>{grupo.totais.ir}</td>
                      <td style={{color: 'rgba(255,255,255,0.5)'}}>{grupo.totais.gateway}</td>
                      <td className={styles.textWhite}>{grupo.totais.fatLiquido}</td>
                      <td style={{color: 'rgba(255,255,255,0.5)'}}>{grupo.totais.suaPartePct}</td>
                      <td className={styles.textGreen}>{grupo.totais.lucro}</td>
                      <td className={styles.textWhite}>{grupo.totais.margem}</td>
                      <td></td>
                    </tr>
                    {grupo.itens.map(item => (
                      <tr key={item.id} className={styles.rowItem} onClick={() => {
                        setEditingItem({ grupoKey: grupo.key, ...item });
                        setIsModalOpen(true);
                      }} style={{cursor: 'pointer'}}>
                        <td></td>
                        <td className={styles.textMuted}>{item.codigo}</td>
                        <td>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <span className={`${styles.productDot} ${item.dot}`}></span>
                            <span className={styles.textWhite}>{item.produto}</span>
                          </div>
                        </td>
                        <td><span className={`${styles.catBadge} ${item.catClass}`}>{item.catLetra}</span></td>
                        <td className={styles.textMuted}>{item.dias}</td>
                        <td className={styles.textMuted}>{item.inicio}</td>
                        <td className={styles.textMuted}>{item.fim}</td>
                        <td className={styles.textWhite}>{item.preco}</td>
                        <td className={styles.textWhite}>{item.vendas}</td>
                        <td className={styles.textMuted}>{item.est}</td>
                        <td className={item.varPct.includes('+') ? styles.textGreen : (item.varPct === '-' ? styles.textMuted : styles.textRed)}>{item.varPct}</td>
                        <td className={item.dif.includes('+') ? styles.textGreen : styles.textMuted}>{item.dif}</td>
                        <td className={styles.textTeal}>{item.fatBruto}</td>
                        <td className={styles.textWhite}>{item.fatura}</td>
                        <td className={styles.textMuted}>{item.orderBump}</td>
                        <td className={styles.textMuted}>{item.anuncio}</td>
                        <td className={styles.textMuted}>{item.ir}</td>
                        <td className={styles.textMuted}>{item.gateway}</td>
                        <td className={styles.textWhite}>{item.fatLiquido}</td>
                        <td className={styles.textMuted}>{item.suaPartePct}</td>
                        <td className={styles.textGreen}>{item.lucro}</td>
                        <td className={styles.textWhite}>{item.margem}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.status === 'Concluída' ? styles.statusConcluida : styles.statusPlanejada}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                {/* TOTAL GERAL */}
                <tr className={styles.rowTotal}>
                  <td colSpan={4}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                      <span className={styles.totalLabel}>TOTAL GERAL</span>
                      <div style={{lineHeight: 1.1}}>
                        <span className={styles.totalLabel}>16 campanhas</span>
                        <span className={styles.totalSubLabel}>(181 dias de operação)</span>
                      </div>
                    </div>
                  </td>
                  <td></td><td></td><td></td><td></td>
                  <td>476</td>
                  <td className={styles.textMuted}>115</td>
                  <td className={styles.textGreen}>+22.6%</td>
                  <td className={styles.textGreen}>+7.450,18</td>
                  <td className={styles.textTeal}>R$ 1.032.097,00</td>
                  <td>R$ 5.702,19</td>
                  <td className={styles.textMuted}>R$ 9.506,00</td>
                  <td className={styles.textMuted}>R$ 46.000,00</td>
                  <td className={styles.textMuted}>R$ 123.851,64</td>
                  <td className={styles.textMuted}>R$ 41.531,07</td>
                  <td>R$ 820.714,29</td>
                  <td></td>
                  <td className={styles.textGreen}>R$ 380.595,03</td>
                  <td>36.8%</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {/* ═══════════════════════════════════════════════
            ABA 1.1: CARDS
        ═══════════════════════════════════════════════ */}
        {activeTab === "cards" && (
          <div className={styles.cardsTabContainer}>
            {campanhasData.map(grupo => (
              <div key={grupo.key} className={styles.monthGroup}>
                <div className={styles.monthHeaderRow}>
                  <div className={styles.monthTitleBox}>
                    <span role="img" aria-label="calendar">📅</span>
                    <span className={styles.monthName}>{grupo.mes}</span>
                    <span className={styles.monthCount}>{grupo.qtdCampanhas} campanha(s)</span>
                  </div>
                  <div className={styles.monthTotalVal}>{grupo.totais.fatBruto}</div>
                </div>
                
                <div className={styles.cardsGrid}>
                  {grupo.itens.map(item => (
                    <div key={item.id} className={styles.campaignCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardTypeLabel}>{item.catLetra === 'T' || item.catLetra === 'C' ? 'TREINAMENTOS' : 'SERVIÇOS'}</span>
                        <span className={`${styles.statusBadge} ${item.status === 'Concluída' ? styles.statusConcluida : styles.statusPlanejada}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.cardTitleLine}>
                        {item.produto}
                      </div>
                      <div className={styles.cardDates}>
                        {item.inicio} <span style={{margin: '0 4px', color: '#6B7280'}}>→</span> {item.fim}
                      </div>
                      <div className={styles.cardFaturamentoBox}>
                        <span className={styles.cardFaturamentoLabel}>FATURAMENTO</span>
                        <div className={styles.cardFaturamentoValue}>R$ {item.fatBruto}</div>
                      </div>
                      <div className={styles.cardFooter}>
                        <a href="#" className={styles.cardLink}>Ver Resultados <span style={{fontSize: 10}}>↗</span></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* ═══════════════════════════════════════════════
            ABA 1.2: GRÁFICOS
        ═══════════════════════════════════════════════ */}
        {activeTab === "graficos" && (
          <div className={styles.chartsTabContainer}>
            {/* Top Cards */}
            <div className={styles.chartsTopCards}>
              <div className={styles.chartMetricCard} style={{ '--kpi-rgb': '45, 212, 191' } as React.CSSProperties}>
                <div className={styles.chartMetricHeader}>
                  <span role="img" aria-label="calendar">📅</span>
                  <span className={styles.chartMetricBadge} style={{background: 'rgba(45, 212, 191, 0.2)', color: '#2DD4BF'}}>TOTAL</span>
                </div>
                <div className={styles.chartMetricValue}>{campanhasData.length}</div>
                <div className={styles.chartMetricLabel}>MESES ANALISADOS</div>
              </div>
              <div className={styles.chartMetricCard} style={{ '--kpi-rgb': '74, 222, 128' } as React.CSSProperties}>
                <div className={styles.chartMetricHeader}>
                  <span role="img" aria-label="money">💰</span>
                  <span className={styles.chartMetricBadge} style={{background: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80'}}>RECEITA</span>
                </div>
                <div className={styles.chartMetricValue}>R$ 1.032.097,00</div>
                <div className={styles.chartMetricLabel}>FATURAMENTO TOTAL</div>
              </div>
              <div className={styles.chartMetricCard} style={{ '--kpi-rgb': '217, 70, 239' } as React.CSSProperties}>
                <div className={styles.chartMetricHeader}>
                  <span role="img" aria-label="target">🎯</span>
                  <span className={styles.chartMetricBadge} style={{background: 'rgba(217, 70, 239, 0.2)', color: '#D946EF'}}>MÉDIA</span>
                </div>
                <div className={styles.chartMetricValue}>R$ 172.016,17</div>
                <div className={styles.chartMetricLabel}>RECEITA POR MÊS</div>
              </div>
              <div className={styles.chartMetricCard} style={{ '--kpi-rgb': '249, 115, 22' } as React.CSSProperties}>
                <div className={styles.chartMetricHeader}>
                  <span role="img" aria-label="rocket">🚀</span>
                  <span className={styles.chartMetricBadge} style={{background: 'rgba(249, 115, 22, 0.2)', color: '#F97316'}}>VENDAS</span>
                </div>
                <div className={styles.chartMetricValue}>476</div>
                <div className={styles.chartMetricLabel}>TOTAL DE VENDAS</div>
              </div>
            </div>

            {/* Configurações do Gráfico */}
            <div className={styles.chartConfigBox}>
              <div className={styles.chartSectionTitle}>
                <div className={styles.titleLine}></div>
                Configurações do Gráfico
              </div>
              <div className={styles.chartSelectRow}>
                <div className={styles.chartSelectGroup}>
                  <span className={styles.chartSelectLabel}>VARIÁVEL 1 (EIXO Y)</span>
                  <div className={styles.chartSelectWrapper}>
                    <select className={styles.chartSelect}>
                      <option>Faturamento Bruto</option>
                    </select>
                    <div className={styles.chartSelectIndicator} style={{background: '#2DD4BF'}}></div>
                  </div>
                </div>
                <div className={styles.chartSelectGroup}>
                  <span className={styles.chartSelectLabel}>VARIÁVEL 2 (EIXO Y)</span>
                  <div className={styles.chartSelectWrapper}>
                    <select className={styles.chartSelect}>
                      <option>Receita Líquida</option>
                    </select>
                    <div className={styles.chartSelectIndicator} style={{background: '#4ADE80'}}></div>
                  </div>
                </div>
              </div>
              <div className={styles.chartSelectGroup} style={{marginTop: 16}}>
                <span className={styles.chartSelectLabel}>PERÍODO DE ANÁLISE</span>
                <div className={styles.chartPeriodNav}>
                  <button className={`${styles.periodBtn} ${styles.periodActive}`}>
                    <span role="img" aria-label="calendar">🗓️</span> Período Total
                  </button>
                  <button className={styles.periodBtn}>Últimos 12 Meses</button>
                  <button className={styles.periodBtn}>Últimos 6 Meses</button>
                  <button className={styles.periodBtn}>Q1 (Jan-Mar)</button>
                  <button className={styles.periodBtn}>Q2 (Abr-Jun)</button>
                  <button className={styles.periodBtn}>Q3 (Jul-Set)</button>
                  <button className={styles.periodBtn}>Q4 (Out-Dez)</button>
                </div>
              </div>
            </div>

            {/* Gráfico (Mock SVG) */}
            <div className={styles.chartBox}>
              <div className={styles.chartSectionTitle} style={{marginBottom: 32, justifyContent: 'space-between', display: 'flex'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div className={styles.titleLine}></div>
                  Análise Comparativa
                </div>
                <div style={{display: 'flex', gap: 16, fontSize: 10, color: '#9CA3AF'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, borderRadius: 4, background: '#2DD4BF'}}></div> Faturamento Bruto</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, borderRadius: 4, background: '#4ADE80'}}></div> Receita Líquida</div>
                </div>
              </div>
              <div className={styles.chartMockArea}>
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  
                  {/* Curva 1 (Faturamento) */}
                  <path d="M 0 200 Q 150 250 300 150 T 600 50 T 1000 250" fill="none" stroke="#2DD4BF" strokeWidth="3" />
                  {/* Curva 2 (Receita) */}
                  <path d="M 0 220 Q 150 260 300 170 T 600 80 T 1000 270" fill="none" stroke="#4ADE80" strokeWidth="2" strokeDasharray="5,5" />
                  
                  {/* Pontos */}
                  <circle cx="0" cy="200" r="4" fill="#2DD4BF" />
                  <circle cx="300" cy="150" r="4" fill="#2DD4BF" />
                  <circle cx="600" cy="50" r="4" fill="#2DD4BF" />
                  <circle cx="1000" cy="250" r="4" fill="#2DD4BF" />
                </svg>
                {/* Eixos */}
                <div className={styles.chartAxisY}>
                  <span>320k</span><span>240k</span><span>160k</span><span>80k</span><span>0k</span>
                </div>
                <div className={styles.chartAxisX}>
                  <span>Jan/2026</span><span>Fev/2026</span><span>Mar/2026</span><span>Abr/2026</span><span>Mai/2026</span><span>Jun/2026</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ═══════════════════════════════════════════════
            ABA 1.3: CALENDÁRIO
        ═══════════════════════════════════════════════ */}
        {activeTab === "calendario" && (
          <div className={styles.calendarTabContainer}>
            <div className={styles.calendarHeaderRow}>
              <div className={styles.calendarDayHeader}>SEG</div>
              <div className={styles.calendarDayHeader}>TER</div>
              <div className={styles.calendarDayHeader}>QUA</div>
              <div className={styles.calendarDayHeader}>QUI</div>
              <div className={styles.calendarDayHeader}>SEX</div>
              <div className={styles.calendarDayHeader}>SÁB</div>
              <div className={styles.calendarDayHeader}>DOM</div>
            </div>
            <div className={styles.calendarGrid}>
              <div className={styles.calendarRow}>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarBar} style={{left: '5%', width: '90%', background: '#6366F1'}}>
                  <span role="img" aria-label="course" style={{marginRight: 6}}>📘</span> Curso VFlow
                </div>
              </div>
              <div className={styles.calendarRow}>
                <div className={styles.calendarCell}>14</div>
                <div className={styles.calendarCell}>15</div>
                <div className={styles.calendarCell}>16</div>
                <div className={styles.calendarCell}>17</div>
                <div className={styles.calendarCell}>18</div>
                <div className={styles.calendarCell}>19</div>
                <div className={styles.calendarCell}>20</div>
                <div className={styles.calendarBar} style={{left: '15%', width: '40%', background: '#2DD4BF'}}>
                  <span role="img" aria-label="course" style={{marginRight: 6}}>📗</span> Workshop VFlow
                </div>
              </div>
              <div className={styles.calendarRow}>
                <div className={styles.calendarCell}>21</div>
                <div className={styles.calendarCell}>22</div>
                <div className={styles.calendarCell}>23</div>
                <div className={styles.calendarCell}>24</div>
                <div className={styles.calendarCell}>25</div>
                <div className={styles.calendarCell}>26</div>
                <div className={styles.calendarCell}>27</div>
                <div className={styles.calendarBar} style={{left: '80%', width: '15%', background: '#14B8A6'}}>
                  <span role="img" aria-label="course" style={{marginRight: 6}}>💎</span> Grupo de Implementação VFlow
                </div>
                <div className={styles.calendarBar} style={{left: '0%', width: '30%', background: '#2DD4BF', top: 38}}>
                  Workshop VFlow
                </div>
              </div>
              <div className={styles.calendarRow}>
                <div className={styles.calendarCell}>28</div>
                <div className={styles.calendarCell}>29</div>
                <div className={styles.calendarCell}>30</div>
                <div className={styles.calendarCell}>31</div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarBar} style={{left: '0%', width: '100%', background: '#14B8A6'}}>
                  <span role="img" aria-label="course" style={{marginRight: 6}}>💎</span> Grupo de Implementação VFlow
                </div>
              </div>
              <div className={styles.calendarRow}>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarCell}></div>
                <div className={styles.calendarBar} style={{left: '0%', width: '50%', background: '#14B8A6'}}>
                  <span role="img" aria-label="course" style={{marginRight: 6}}>💎</span> Grupo de Implementação VFlow
                </div>
                <div className={styles.calendarBar} style={{left: '52%', width: '40%', background: '#EC4899', top: 38}}>
                  <span role="img" aria-label="course" style={{marginRight: 6}}>🚀</span> Mastermind Heroes
                </div>
              </div>
            </div>
            
            <div className={styles.calendarLegendRow}>
              <div style={{display: 'flex', gap: 12}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, background: '#2DD4BF'}}></div> Workshop VFlow</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, background: '#6366F1'}}></div> Curso VFlow</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, background: '#8B5CF6'}}></div> Mentoria</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, background: '#EC4899'}}></div> Heroes</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><div style={{width: 8, height: 8, background: '#14B8A6'}}></div> Grupo VFlow</div>
              </div>
              <div style={{display: 'flex', gap: 12}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{color: '#8B5CF6'}}>■</span> Planejada</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{color: '#F59E0B'}}>■</span> Em Execução</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{color: '#10B981'}}>■</span> Concluída</div>
              </div>
            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════
            ABA 2: MÉTRICAS DETALHADAS VFlow
        ═══════════════════════════════════════════════ */}
        {activeTab === "metricas" && (
          <div className={styles.metricsContainer}>

            {/* Header + Pills */}
            <div className={styles.metricsHeader}>
              <div>
                <h2 className={styles.metricsTitle}>
                  <div className={styles.metricsTitleDot}></div>
                  Métricas Afiliados (USA)
                </h2>
                <div className={styles.metricsSubtitle}>
                  VitaFlow — Performance Global
                  <span style={{color: '#4B5563', marginLeft: 8}}>ClickBank + BuyGoods (Valores em USD)</span>
                </div>
              </div>
              <div className={styles.pillNav}>
                <button className={`${styles.pillBtn} ${activePill === "consolidado" ? styles.pillActive : ""}`} onClick={() => setActivePill("consolidado")}>Consolidado</button>
                <button className={`${styles.pillBtn} ${activePill === "clickbank" ? styles.pillActive : ""}`} onClick={() => setActivePill("clickbank")}>ClickBank</button>
                <button className={`${styles.pillBtn} ${activePill === "buygoods" ? styles.pillActive : ""}`} onClick={() => setActivePill("buygoods")}>BuyGoods</button>
                <button className={`${styles.pillBtn} ${activePill === "ads" ? styles.pillActive : ""}`} onClick={() => setActivePill("ads")}>Inteligência Ads</button>
                <button className={`${styles.pillBtn} ${activePill === "cvs_ai" ? styles.pillActive : ""}`} onClick={() => setActivePill("cvs_ai")}>
                  <Sparkles size={12} style={{marginRight: 4, display: 'inline-block'}} />
                  CVS AI (CFO)
                </button>
              </div>
            </div>

            {/* ── SEÇÃO: CONSOLIDADO ── */}
            {activePill === "consolidado" && (
              <>
                {/* Mega Card: Faturamento */}
                <div className={styles.megaCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                  <span className={styles.cardTitle}>Faturamento Total do Projeto (USD)</span>
                  <div className={styles.megaCardValue}>$ {metricasSimuladas.consolidado.fat.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div className={styles.megaCardLegend}>
                    <div className={styles.legendItem}>
                      <span className={`${styles.productDot} ${styles.dotPurple}`}></span>
                      ClickBank: $ {metricasSimuladas.cb.fat.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                    <div className={styles.legendItem}>
                      <span className={`${styles.productDot} ${styles.dotCyan}`}></span>
                      BuyGoods: $ {metricasSimuladas.bg.fat.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                  </div>
                </div>

                {/* KPIs 4 colunas */}
                <div className={styles.kpiGrid4}>
                  <div className={styles.kpiCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                    <span className={styles.cardTitle}>Vendas Totais (Front-End)</span>
                    <div className={styles.cardValueSmall}>{metricasSimuladas.cb.fe + metricasSimuladas.bg.fe}</div>
                    <div className={styles.cardSubtext}>{metricasSimuladas.cb.fe} (CB) + {metricasSimuladas.bg.fe} (BG)</div>
                  </div>
                  <div className={styles.kpiCard} style={{ '--kpi-rgb': '251, 191, 36' } as React.CSSProperties}>
                    <span className={`${styles.cardTitle} ${styles.cardTitleHighlight}`}>Upsell Take Rate</span>
                    <div className={styles.cardValueSmall}>
                      {(((metricasSimuladas.cb.up + metricasSimuladas.bg.up) / (metricasSimuladas.cb.fe + metricasSimuladas.bg.fe)) * 100).toFixed(1)}%
                    </div>
                    <div className={styles.cardSubtext}>Média global de esteira</div>
                  </div>
                  <div className={styles.kpiCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                    <span className={styles.cardTitle}>Ticket Médio (AOV)</span>
                    <div className={styles.cardValueSmall}>$ {metricasSimuladas.consolidado.aov}</div>
                    <div className={styles.cardSubtext}>Por transação final</div>
                  </div>
                  <div className={styles.kpiCard} style={{ '--kpi-rgb': '74, 222, 128' } as React.CSSProperties}>
                    <span className={styles.cardTitle}>ROI Global</span>
                    <div className={styles.cardValueSmall} style={{color: '#4ADE80'}}>142%</div>
                    <div className={styles.cardSubtext}>Retorno sobre o Ad Spend</div>
                  </div>
                </div>

                {/* Grid 2 colunas: Distribuição + Funil */}
                <div className={styles.kpiGrid2}>
                  {/* Esquerda */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                    <div className={styles.kpiCard} style={{flex: 1, '--kpi-rgb': '45, 212, 191'} as React.CSSProperties}>
                      <span className={styles.cardTitle}>Distribuição de Receita</span>
                      <div className={styles.distBarWrapper}>
                        <div className={styles.distBarF1} style={{width: '7.4%'}}>7.4%</div>
                        <div className={styles.distBarF2} style={{width: '92.6%'}}>92.6%</div>
                      </div>
                      <div className={styles.distLegend}>
                        <div className={styles.distLegendRow}>
                          <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
                            <div className={styles.productDot} style={{background: '#A855F7'}}></div>
                            Fase 1 (Workshop)
                          </span>
                          <span className={styles.distLegendVal}>7.4%</span>
                        </div>
                        <div className={styles.distLegendRow}>
                          <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
                            <div className={styles.productDot} style={{background: '#2DD4BF'}}></div>
                            Fase 2 (GDI)
                          </span>
                          <span className={`${styles.distLegendVal} ${styles.textTeal}`}>92.6%</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.kpiCard} style={{ '--kpi-rgb': '168, 85, 247' } as React.CSSProperties}>
                      <div className={styles.faseHeader}>
                        <div className={styles.faseTitle}>Fase 1: Workshop VFlow</div>
                        <div className={styles.faseDesc}>Evento Online (4h)</div>
                      </div>
                      <table className={styles.faseTable}>
                        <tbody>
                          <tr><td>Ingresso Workshop</td><td>106 x R$ 47</td></tr>
                          <tr><td>Order Bump (Gravação)</td><td>38 x R$ 97</td></tr>
                          <tr><td className={styles.textPurple}>Total Fase 1</td><td className={styles.textPurple}>R$ 8.668,00</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Direita */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                    <div className={styles.kpiCard} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                      <span className={styles.cardTitle}>Jornada do Cliente</span>
                      <div className={styles.funnelWrapper}>
                        <div className={styles.funnelStep} style={{background: 'rgba(255,255,255,0.05)', '--kpi-rgb': '255, 255, 255'} as React.CSSProperties}>
                          <div>
                            <span className={styles.funnelLabel}>Leads Iniciais</span>
                            <span className={styles.funnelValue}>941</span>
                          </div>
                          <span className={styles.funnelConv}>11.3%</span>
                        </div>
                        <div className={styles.funnelArrow}>↓</div>
                        <div className={styles.funnelStep} style={{background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)', '--kpi-rgb': '168, 85, 247'} as React.CSSProperties}>
                          <div>
                            <span className={styles.funnelLabel}>Compradores Workshop</span>
                            <span className={styles.funnelValue}>106</span>
                          </div>
                          <span className={styles.funnelConv}>17.0%</span>
                        </div>
                        <div className={styles.funnelArrow}>↓</div>
                        <div className={styles.funnelStep} style={{background: 'rgba(45, 212, 191, 0.15)', borderColor: 'rgba(45, 212, 191, 0.3)', '--kpi-rgb': '45, 212, 191'} as React.CSSProperties}>
                          <div>
                            <span className={styles.funnelLabel}>Compradores GDI</span>
                            <span className={styles.funnelValue}>18</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.kpiCard} style={{ '--kpi-rgb': '45, 212, 191' } as React.CSSProperties}>
                      <div className={styles.faseHeader}>
                        <div className={styles.faseTitle}>Fase 2: Grupo de Implementação VFlow (T2)</div>
                        <div className={styles.faseDesc}>Programa High-Ticket</div>
                      </div>
                      <table className={styles.faseTable}>
                        <tbody>
                          <tr><td>Acesso ao Grupo</td><td>18 x R$ 6.000</td></tr>
                          <tr><td className={styles.textTeal}>Total Fase 2</td><td className={styles.textTeal}>R$ 108.000,00</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── SEÇÃO: CVS AI (CFO VIRTUAL) ── */}
            {activePill === "cvs_ai" && (
              <div className={styles.aulaContainer} style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(168, 85, 247, 0.3)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' }}>
                <div className={styles.aulaHeader}>
                  <div className={styles.aulaHeaderSubtitle} style={{ color: '#A855F7' }}>INTELIGÊNCIA ARTIFICIAL</div>
                  <div className={styles.aulaHeaderTitle}>Insights Financeiros (CFO Virtual)</div>
                  <div className={styles.aulaHeaderMeta}>
                    <span>Analisando Campanhas (CVS) e Margens</span>
                  </div>
                </div>

                <div style={{ padding: 24 }}>
                  {isLoadingInsights ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40 }}>
                      <div className={styles.spinner} style={{ borderColor: '#A855F7', borderTopColor: 'transparent', width: 32, height: 32, borderRadius: '50%', borderWidth: 3, borderStyle: 'solid', animation: 'spin 1s linear infinite' }}></div>
                      <div style={{ color: '#A855F7', fontSize: 14 }}>Processando dados financeiros no modelo GPT-4o...</div>
                      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                      {cvsInsights?.split('\\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h2 key={i} style={{color: '#fff', marginTop: 16, marginBottom: 8}}>{line.replace('# ', '')}</h2>;
                        if (line.startsWith('## ')) return <h3 key={i} style={{color: '#A855F7', marginTop: 24, marginBottom: 8}}>{line.replace('## ', '')}</h3>;
                        if (line.startsWith('* ')) return <div key={i} style={{display: 'flex', gap: 8, marginBottom: 8}}><span style={{color: '#A855F7'}}>•</span> <span>{line.replace('* ', '')}</span></div>;
                        return <p key={i} style={{marginBottom: 8}}>{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OLD INTELIGENCIA HAS BEEN REPLACED BY ADS */}

            {/* ── SEÇÃO: CLICKBANK ── */}
            {activePill === "clickbank" && (
              <div className={styles.aulaContainer}>
                <div className={styles.aulaHeader}>
                  <div className={styles.aulaHeaderSubtitle}>PLATAFORMA INTERNACIONAL</div>
                  <div className={styles.aulaHeaderTitle}>ClickBank - Relatório de Performance</div>
                  <div className={styles.aulaHeaderMeta}>
                    <span>Produto Principal: Puravive / LivPure</span>
                    <span>•</span>
                    <span style={{color: '#4ADE80'}}>Status: Escalando (Top 100 CB)</span>
                  </div>
                </div>

                <div className={styles.aulaTopCards}>
                  <div className={styles.aulaTopCard} style={{ '--kpi-rgb': '45, 212, 191' } as React.CSSProperties}>
                    <div className={styles.aulaTopCardLabel} style={{color: '#2DD4BF'}}>FATURAMENTO (GROSS)</div>
                    <div className={styles.aulaTopCardValue}>$ {metricasSimuladas.cb.fat.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div className={styles.aulaTopCardSub}>Últimos 30 dias na plataforma</div>
                  </div>
                  <div className={styles.aulaTopCard} style={{ '--kpi-rgb': '167, 139, 250' } as React.CSSProperties}>
                    <div className={styles.aulaTopCardLabel} style={{color: '#A78BFA'}}>TOTAL DE CLIQUES (HOPLINKS)</div>
                    <div className={styles.aulaTopCardValue}>{metricasSimuladas.cb.cliques.toLocaleString('en-US')}</div>
                    <div className={styles.aulaTopCardSub}>Cliques limpos registrados</div>
                  </div>
                  <div className={styles.aulaTopCard} style={{ '--kpi-rgb': '251, 146, 60' } as React.CSSProperties}>
                    <div className={styles.aulaTopCardLabel} style={{color: '#FB923C'}}>EPC (EARNINGS PER CLICK)</div>
                    <div className={styles.aulaTopCardValue}>$ {metricasSimuladas.cb.epc.toFixed(2)}</div>
                    <div className={styles.aulaTopCardSub}>Excelente média p/ tráfego frio</div>
                  </div>
                </div>

                <div className={styles.aulaBottomGrid}>
                  <div className={styles.aulaFunnelBox} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                    <div className={styles.aulaSectionTitle} style={{marginBottom: 24}}>Funil VSL (EUA)</div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>HopLink (Cliques)</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: '100%', background: '#A78BFA'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{Math.round(metricasSimuladas.cb.cliques / 1000)}k</div>
                    </div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Initial Impressions (Checkout)</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: `${metricasSimuladas.cb.pctCheckout}%`, background: '#EC4899'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{metricasSimuladas.cb.checkouts.toLocaleString('en-US')}<span className={styles.aulaFunnelPct}>{metricasSimuladas.cb.pctCheckout}%</span></div>
                    </div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Front-End Sales (FE)</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: `${metricasSimuladas.cb.pctFE}%`, background: '#F59E0B'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{metricasSimuladas.cb.fe}<span className={styles.aulaFunnelPct}>{metricasSimuladas.cb.pctFE}%</span></div>
                    </div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Upsell 1 Taken (Oto1)</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: `${Math.min(Number(metricasSimuladas.cb.pctUp), 100)}%`, background: '#2DD4BF'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{metricasSimuladas.cb.up}<span className={styles.aulaFunnelPct}>{metricasSimuladas.cb.pctUp}%</span></div>
                    </div>
                  </div>

                  <div className={styles.aulaMetricsBox} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                    <div className={styles.aulaSectionTitle} style={{marginBottom: 24}}>Métricas de Conversão (CB)</div>
                    
                    <div className={styles.aulaMetricItem}>
                      <div className={styles.aulaMetricHeader}>
                        <span>HopLink $\rightarrow$ Front End Sale</span>
                        <span style={{color: '#4ADE80'}}>{metricasSimuladas.cb.pctFE}%</span>
                      </div>
                      <div className={styles.aulaMetricBarBg}>
                        <div className={styles.aulaMetricBarFill} style={{width: `${Math.min(Number(metricasSimuladas.cb.pctFE) * 10, 100)}%`, background: '#4ADE80'}}></div>
                      </div>
                      <div className={styles.aulaMetricSub}>{metricasSimuladas.cb.fe} vendas em {metricasSimuladas.cb.cliques.toLocaleString('en-US')} cliques totais</div>
                    </div>
                    
                    <div className={styles.aulaMetricItem}>
                      <div className={styles.aulaMetricHeader}>
                        <span>Checkout $\rightarrow$ Sale (Conversion Rate)</span>
                        <span style={{color: '#F59E0B'}}>{((metricasSimuladas.cb.fe / metricasSimuladas.cb.checkouts) * 100).toFixed(1)}%</span>
                      </div>
                      <div className={styles.aulaMetricBarBg}>
                        <div className={styles.aulaMetricBarFill} style={{width: `${Math.min(((metricasSimuladas.cb.fe / metricasSimuladas.cb.checkouts) * 100) * 4, 100)}%`, background: '#F59E0B'}}></div>
                      </div>
                      <div className={styles.aulaMetricSub}>{((metricasSimuladas.cb.fe / metricasSimuladas.cb.checkouts) * 100).toFixed(1)}% das pessoas no checkout fecharam a compra</div>
                    </div>
                    
                    <div className={styles.aulaMetricItem}>
                      <div className={styles.aulaMetricHeader}>
                        <span>Refund Rate (Taxa de Reembolso)</span>
                        <span style={{color: '#EF4444'}}>4.2%</span>
                      </div>
                      <div className={styles.aulaMetricBarBg}>
                        <div className={styles.aulaMetricBarFill} style={{width: '20%', background: '#EF4444'}}></div>
                      </div>
                      <div className={styles.aulaMetricSub}>Aceitável (Média do mercado é 5-8%)</div>
                    </div>
                    
                    <div className={styles.aulaInsightBox} style={{ '--kpi-rgb': '45, 212, 191' } as React.CSSProperties}>
                      <div className={styles.aulaInsightTitle}>Insight de Otimização</div>
                      <div className={styles.aulaInsightText}>O Upsell 1 (Oto1) está convertendo a <strong>27.8%</strong>. Essa é uma métrica fortíssima para ofertas nutra no CB. Sugiro aumentar o volume de tráfego direto para essa página.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SEÇÃO: BUYGOODS ── */}
            {activePill === "buygoods" && (
              <div className={styles.aulaContainer}>
                <div className={styles.aulaHeader}>
                  <div className={styles.aulaHeaderSubtitle}>PLATAFORMA INTERNACIONAL</div>
                  <div className={styles.aulaHeaderTitle}>BuyGoods - Relatório de Performance</div>
                  <div className={styles.aulaHeaderMeta}>
                    <span>Produto Principal: Sugar Defender</span>
                    <span>•</span>
                    <span style={{color: '#3B82F6'}}>Status: Escalando (Top 50 BG)</span>
                  </div>
                </div>

                <div className={styles.aulaTopCards}>
                  <div className={styles.aulaTopCard} style={{ '--kpi-rgb': '59, 130, 246' } as React.CSSProperties}>
                    <div className={styles.aulaTopCardLabel} style={{color: '#3B82F6'}}>FATURAMENTO (GROSS)</div>
                    <div className={styles.aulaTopCardValue}>$ {metricasSimuladas.bg.fat.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div className={styles.aulaTopCardSub}>Últimos 30 dias na plataforma</div>
                  </div>
                  <div className={styles.aulaTopCard} style={{ '--kpi-rgb': '249, 115, 22' } as React.CSSProperties}>
                    <div className={styles.aulaTopCardLabel} style={{color: '#F97316'}}>TOTAL DE CLIQUES</div>
                    <div className={styles.aulaTopCardValue}>{metricasSimuladas.bg.cliques.toLocaleString('en-US')}</div>
                    <div className={styles.aulaTopCardSub}>Cliques limpos registrados</div>
                  </div>
                  <div className={styles.aulaTopCard} style={{ '--kpi-rgb': '16, 185, 129' } as React.CSSProperties}>
                    <div className={styles.aulaTopCardLabel} style={{color: '#10B981'}}>EPC (EARNINGS PER CLICK)</div>
                    <div className={styles.aulaTopCardValue}>$ {metricasSimuladas.bg.epc.toFixed(2)}</div>
                    <div className={styles.aulaTopCardSub}>Alta retenção de oferta</div>
                  </div>
                </div>

                <div className={styles.aulaBottomGrid}>
                  <div className={styles.aulaFunnelBox} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                    <div className={styles.aulaSectionTitle} style={{marginBottom: 24}}>Funil VSL (BuyGoods)</div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Clicks</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: '100%', background: '#3B82F6'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{Math.round(metricasSimuladas.bg.cliques / 1000)}k</div>
                    </div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Initial Impressions (Checkout)</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: `${metricasSimuladas.bg.pctCheckout}%`, background: '#F97316'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{metricasSimuladas.bg.checkouts.toLocaleString('en-US')}<span className={styles.aulaFunnelPct}>{metricasSimuladas.bg.pctCheckout}%</span></div>
                    </div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Front-End Sales (FE)</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: `${metricasSimuladas.bg.pctFE}%`, background: '#10B981'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{metricasSimuladas.bg.fe}<span className={styles.aulaFunnelPct}>{metricasSimuladas.bg.pctFE}%</span></div>
                    </div>
                    
                    <div className={styles.aulaFunnelRow}>
                      <div className={styles.aulaFunnelLabel}>Upsell 1 Taken</div>
                      <div className={styles.aulaFunnelBarArea}>
                        <div className={styles.aulaFunnelBar} style={{width: `${Math.min(Number(metricasSimuladas.bg.pctUp), 100)}%`, background: '#8B5CF6'}}></div>
                      </div>
                      <div className={styles.aulaFunnelVal}>{metricasSimuladas.bg.up}<span className={styles.aulaFunnelPct}>{metricasSimuladas.bg.pctUp}%</span></div>
                    </div>
                  </div>

                  <div className={styles.aulaMetricsBox} style={{ '--kpi-rgb': '255, 255, 255' } as React.CSSProperties}>
                    <div className={styles.aulaSectionTitle} style={{marginBottom: 24}}>Métricas de Conversão (BG)</div>
                    
                    <div className={styles.aulaMetricItem}>
                      <div className={styles.aulaMetricHeader}>
                        <span>Click $\rightarrow$ Front End Sale</span>
                        <span style={{color: '#10B981'}}>{metricasSimuladas.bg.pctFE}%</span>
                      </div>
                      <div className={styles.aulaMetricBarBg}>
                        <div className={styles.aulaMetricBarFill} style={{width: `${Math.min(Number(metricasSimuladas.bg.pctFE) * 10, 100)}%`, background: '#10B981'}}></div>
                      </div>
                      <div className={styles.aulaMetricSub}>{metricasSimuladas.bg.fe} vendas em {metricasSimuladas.bg.cliques.toLocaleString('en-US')} cliques totais</div>
                    </div>
                    
                    <div className={styles.aulaMetricItem}>
                      <div className={styles.aulaMetricHeader}>
                        <span>Checkout $\rightarrow$ Sale (Conversion Rate)</span>
                        <span style={{color: '#F97316'}}>{((metricasSimuladas.bg.fe / metricasSimuladas.bg.checkouts) * 100).toFixed(1)}%</span>
                      </div>
                      <div className={styles.aulaMetricBarBg}>
                        <div className={styles.aulaMetricBarFill} style={{width: `${Math.min(((metricasSimuladas.bg.fe / metricasSimuladas.bg.checkouts) * 100) * 4, 100)}%`, background: '#F97316'}}></div>
                      </div>
                      <div className={styles.aulaMetricSub}>{((metricasSimuladas.bg.fe / metricasSimuladas.bg.checkouts) * 100).toFixed(1)}% das pessoas no checkout fecharam a compra</div>
                    </div>
                    
                    <div className={styles.aulaMetricItem}>
                      <div className={styles.aulaMetricHeader}>
                        <span>Refund Rate (Taxa de Reembolso)</span>
                        <span style={{color: '#EF4444'}}>5.1%</span>
                      </div>
                      <div className={styles.aulaMetricBarBg}>
                        <div className={styles.aulaMetricBarFill} style={{width: '25%', background: '#EF4444'}}></div>
                      </div>
                      <div className={styles.aulaMetricSub}>Pequeno aumento nos últimos 7 dias</div>
                    </div>
                    
                    <div className={styles.aulaInsightBox} style={{ '--kpi-rgb': '45, 212, 191' } as React.CSSProperties}>
                      <div className={styles.aulaInsightTitle}>Insight de Otimização</div>
                      <div className={styles.aulaInsightText}>A rede da BuyGoods tem mostrado um EPC superior (<strong>$ {metricasSimuladas.bg.epc.toFixed(2)}</strong>) devido a uma maior adesão no Upsell. O Lifetime Value aqui costuma esticar mais no Backend.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SEÇÃO: INTELIGÊNCIA ADS ── */}
            {activePill === "ads" && (
              <div className={styles.aulaContainer}>
                <div className={styles.aulaHeader}>
                  <div className={styles.aulaHeaderSubtitle}>AQUISIÇÃO DE TRÁFEGO</div>
                  <div className={styles.aulaHeaderTitle}>Inteligência Ads (Tráfego Direto)</div>
                  <div className={styles.aulaHeaderMeta}>
                    <span>Meta Ads + Google Ads</span>
                    <span>•</span>
                    <span style={{color: '#D946EF'}}>Janeiro 2026</span>
                  </div>
                </div>

                <div className={styles.kpiGrid4} style={{marginTop: 24, marginBottom: 32}}>
                  <div className={styles.kpiCard}>
                    <span className={styles.cardTitle}>Investimento Total (Ad Spend)</span>
                    <div className={styles.cardValueSmall} style={{color: '#EF4444'}}>$ 34,955.00</div>
                    <div className={styles.cardSubtext}>Gastos nos últimos 30 dias</div>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={`${styles.cardTitle} ${styles.cardTitleHighlight}`}>ROAS Global</span>
                    <div className={styles.cardValueSmall} style={{color: '#10B981'}}>2.42x</div>
                    <div className={styles.cardSubtext}>Retorno sobre $ Investido</div>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.cardTitle}>CPA Médio (FE)</span>
                    <div className={styles.cardValueSmall}>$ 41.36</div>
                    <div className={styles.cardSubtext}>Meta de CPA: $ 45.00</div>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.cardTitle}>Impressões Totais</span>
                    <div className={styles.cardValueSmall} style={{color: '#3B82F6'}}>1.2M</div>
                    <div className={styles.cardSubtext}>Alcance da marca no período</div>
                  </div>
                </div>

                <div className={styles.aulaSectionTitle} style={{marginBottom: 16}}>Top Campanhas (Escala)</div>
                <div style={{background: '#151724', border: '1px solid #2A2D43', borderRadius: 8, overflow: 'hidden'}}>
                  <table className={styles.emailTable}>
                    <thead>
                      <tr>
                        <th style={{paddingLeft: 16}}>Origem</th>
                        <th>Campanha / Produto</th>
                        <th>Investimento</th>
                        <th>CPC</th>
                        <th>CTR</th>
                        <th>CPA</th>
                        <th>ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{paddingLeft: 16}}>
                          <span style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700}}>META</span>
                        </td>
                        <td className={styles.textWhite}>[CB] Puravive - Lookalike 1%</td>
                        <td className={styles.textRed}>$ 12,450.00</td>
                        <td>$ 1.12</td>
                        <td className={styles.textGreen}>2.4%</td>
                        <td>$ 38.40</td>
                        <td className={styles.textGreen}>2.8x</td>
                      </tr>
                      <tr>
                        <td style={{paddingLeft: 16}}>
                          <span style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700}}>META</span>
                        </td>
                        <td className={styles.textWhite}>[BG] Sugar Defender - Broad</td>
                        <td className={styles.textRed}>$ 9,800.00</td>
                        <td>$ 0.95</td>
                        <td className={styles.textGreen}>1.8%</td>
                        <td>$ 42.10</td>
                        <td className={styles.textTeal}>2.1x</td>
                      </tr>
                      <tr>
                        <td style={{paddingLeft: 16}}>
                          <span style={{background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700}}>GOOGLE</span>
                        </td>
                        <td className={styles.textWhite}>[CB] LivPure - Search Brand</td>
                        <td className={styles.textRed}>$ 4,120.00</td>
                        <td>$ 2.45</td>
                        <td className={styles.textGreen}>8.5%</td>
                        <td>$ 28.50</td>
                        <td className={styles.textGreen}>4.5x</td>
                      </tr>
                      <tr>
                        <td style={{paddingLeft: 16}}>
                          <span style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700}}>META</span>
                        </td>
                        <td className={styles.textWhite}>[CB] Puravive - Retargeting 7d</td>
                        <td className={styles.textRed}>$ 2,500.00</td>
                        <td>$ 1.80</td>
                        <td className={styles.textGreen}>3.1%</td>
                        <td>$ 22.10</td>
                        <td className={styles.textGreen}>5.1x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}          </div>
        )}

      </div>
    </div>
  );
}
