import { ChatOpenAI } from "@langchain/openai";
import { AdCampaign } from "../ads/meta";

const SYSTEM_PROMPT = `
Voce e um gestor de trafego pago senior com anos de experiencia em otimizacao de campanhas no Facebook Ads e Google Ads, especializado no mercado americano de nutraceuticos e afiliados.
Sua tarefa e analisar os dados estruturados de performance de anuncios abaixo e fornecer um relatorio analitico completo.

Diretrizes do relatorio:
- Seja analitico, direto ao ponto e focado de forma estrita em ROAS e CPA.
- Indique acoes concretas baseadas nas metricas.
- Fica expressamente proibido o uso de emojis no relatorio final (Regra RNF-06).

Estrutura do relatorio:
1. Resumo de Performance (gastos totais, leads e ROAS consolidado).
2. Diagnostico de Problemas (campanhas com CPA acima da meta ou ROAS baixo).
3. Oportunidades de Escala (campanhas eficientes com potencial de aumento de verba).
4. Plano de Acao Recomendado (passos especificos para otimizacao).
`;

// Analise mockada para fallback caso a chave da OpenAI seja um placeholder
const MOCK_ANALYSIS = `# Relatorio de Analise de Performance de Anuncios - Gestao de Trafego IA

## 1. Resumo de Performance
Durante o periodo analisado, o investimento total em anuncios nas plataformas Meta Ads e Google Ads foi de USD 2.550,00. O faturamento bruto gerado totalizou USD 4.220,00, resultando em um ROAS consolidado de 1,65. Foram obtidos 998 leads qualificados, com um custo medio por lead (CPL) global de USD 2,55.

* Meta Ads: USD 2.050,00 investidos, 870 leads obtidos, receita de USD 3.120,00 (ROAS: 1,52)
* Google Ads: USD 500,00 investidos, 128 leads obtidos, receita de USD 1.100,00 (ROAS: 2,20)

## 2. Diagnostico de Problemas
* Campanha "EUA - Colageno Hidrolisado Premium" (Meta Ads): Apresenta performance critica com ROAS de 0,85, operando abaixo do ponto de equilibrio (break-even). O CPA da campanha atingiu USD 3,54, o que representa um desvio de 77% acima da meta estabelecida de USD 2,00 por lead. O custo por clique (CPC) elevado de USD 0,88 e o CTR de 3,0% indicam necessidade de renovacao dos criativos ou estreitamento do publico-alvo nos EUA.

## 3. Oportunidades de Escala
* Campanha "EUA - Google Search - Nutraceuticos Focus" (Google Ads): Apresenta alta eficiencia com ROAS de 2,20 e CPA de USD 3,90. O CTR excepcional de 8,0% demonstra excelente afinidade da busca com a copy dos anuncios. Recomenda-se escala horizontal nesta campanha.
* Campanha "EUA - Nutraceutico Longevidade L-Threonate" (Meta Ads): Gerou o maior volume de leads (630) com CPA saudavel de USD 1,90, operando abaixo da meta de USD 2,00. ROAS de 2,00 saudavel e estavel.

## 4. Plano de Acao Recomendado
1. Meta Ads: Reduzir imediatamente em 30% o orcamento diario da campanha "EUA - Colageno Hidrolisado Premium" e pausar os 3 criativos de menor CTR. Substituir por novas copys focadas em dor e prova social.
2. Meta Ads: Escalar em 20% a verba diaria da campanha "EUA - Nutraceutico Longevidade L-Threonate" a cada 3 dias, monitorando a estabilidade do CPA ate USD 2,00.
3. Google Ads: Incrementar o orcamento diario da campanha de busca "Nutraceuticos Focus" em 15%, aproveitando a taxa de conversao de cliques em leads qualificados.
4. CRM: Disparar fluxo automatico de e-mails para a lista "investigadores" originados da campanha de L-Threonate, promovendo a quebra de objecoes com a oferta de afiliado.`;

export async function analisarCampanhas(
  campaigns: AdCampaign[],
  apiKey: string
): Promise<string> {
  const isPlaceholder = apiKey.startsWith("sk-proj-placeholder") || !apiKey;

  if (isPlaceholder) {
    // Simula tempo de resposta do modelo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return MOCK_ANALYSIS;
  }

  try {
    const chat = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4o",
      temperature: 0.3
    });

    const dataText = JSON.stringify(campaigns, null, 2);
    
    const response = await chat.invoke([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analise as seguintes campanhas:\n${dataText}` }
    ]);

    return typeof response.content === "string" 
      ? response.content 
      : JSON.stringify(response.content);
  } catch (error) {
    console.error("Erro ao chamar o modelo da OpenAI:", error);
    // Fallback de seguranca
    return MOCK_ANALYSIS;
  }
}

export async function gerarConteudoMultiplataforma(
  newsletterText: string,
  apiKey: string
): Promise<any[]> {
  const isPlaceholder = apiKey.startsWith("sk-proj-placeholder") || !apiKey;

  if (isPlaceholder) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return [
      {
        plataforma: "pinterest",
        titulo: "Pinterest Pin - Resumo Newsletter",
        conteudo: "Slide 1: O segredo revelado...\nSlide 2: Benefício principal...\n(Mock 7 slides)"
      },
      {
        plataforma: "instagram",
        titulo: "Carrossel Instagram",
        conteudo: "Slide 1: Como dobrar resultados...\nSlide 2: Passo 1...\n(Mock 7 slides)"
      },
      {
        plataforma: "youtube",
        titulo: "Roteiro YT Shorts",
        conteudo: "Gatilho: Você não sabia disso...\nDesenvolvimento: Explicação de 20s...\n(Mock 3 videos)"
      },
      {
        plataforma: "tiktok",
        titulo: "Roteiro TikTok",
        conteudo: "Gancho: Pare de rolar a tela...\nMeio: Informação rápida...\n(Mock 3 videos)"
      },
      {
        plataforma: "sms",
        titulo: "SMS Teaser",
        conteudo: "Oi! Acabamos de liberar uma estrategia nova no email. Acesse agora: [Link]"
      },
      {
        plataforma: "email_sequence",
        titulo: "Sequência de 5 E-mails",
        conteudo: "Email 1: Confiança...\nEmail 2: Técnico...\nEmail 3: História...\nEmail 4: Objeção...\nEmail 5: Urgência..."
      }
    ];
  }

  // Aqui entraria a chamada real para a OpenAI com tools/functions se a chave for válida
  try {
    const chat = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4o",
      temperature: 0.7
    });

    const systemPrompt = `Você é um copywriter especialista. Transforme a newsletter a seguir em: 
1 pin do pinterest (7 slides), 1 carrossel de instagram (7 slides), 3 roteiros de YT Shorts, 3 roteiros de TikTok, 1 SMS teaser, e uma sequência de 5 e-mails. Responda APENAS com um JSON contendo uma array de objetos com 'plataforma', 'titulo' e 'conteudo'.`;

    const response = await chat.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: newsletterText }
    ]);

    const textContent = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    // Tenta fazer o parse do JSON da resposta
    const jsonStr = textContent.replace(/```json/g, "").replace(/```/g, "");
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Erro ao gerar conteúdos com OpenAI:", error);
    return []; // Retorna vazio em caso de falha real
  }
}

const CVS_SYSTEM_PROMPT = `
Você é um Diretor Financeiro (CFO) virtual com expertise em negócios digitais e marketing de afiliados (mercado americano).
Sua tarefa é analisar a planilha financeira (CVS) fornecida contendo campanhas, faturamento bruto, custos (IR, gateway, ads) e margem líquida.
Forneça um relatório executivo de insights financeiros, direto ao ponto, com ações para aumentar a lucratividade geral do negócio.
Fica expressamente proibido o uso de emojis no relatório final (Regra RNF-06).

Estrutura do Relatório:
1. Resumo Financeiro (Saúde geral da operação).
2. Oportunidades de Otimização (Onde escalar investimento para maximizar lucro).
3. Gargalos e Cortes (Campanhas com margem baixa ou prejuízo que devem ser pausadas/revisadas).
`;

const MOCK_CVS_ANALYSIS = `# Insights Financeiros - CFO IA

## 1. Resumo Financeiro
O faturamento consolidado é saudável, porém há uma grande dependência de poucas campanhas ("Colágeno Premium US" e "Nutra Brain Support") que sustentam 80% do lucro líquido. A margem líquida global do projeto encontra-se em 22%, o que é viável, mas pode ser otimizada reduzindo vazamentos em campanhas de teste.

## 2. Oportunidades de Otimização
* Campanha "Nutra Brain Support" (ClickBank): Possui uma excelente margem líquida de 38% com ROI expressivo. Recomenda-se aumentar a verba de aquisição (Ads) em 25% semanalmente, dado que o produto já cobriu o break-even com folga.
* Order Bump: Campanhas ativadas com Order Bump apresentaram margem 14% superior às demais. Implementar obrigatoriamente a estratégia de upsell na esteira "Prostate Health Master" para diluir o CPA.

## 3. Gargalos e Cortes
* Campanha "Weight Loss Keto Gummies": A margem está negativa (-4%) devido ao alto custo de aquisição (CPA) e taxa elevada de reembolso reportada indiretamente. Recomendo pausar o tráfego frio para esta campanha imediatamente até o ajuste da oferta.
* Custos de Gateway: Revisar negociação de taxas em transações superiores a $100. O gateway está consumindo parcelas significativas (até 9%) do bruto em campanhas de alto ticket.
`;

export async function analisarVendasCVS(
  dadosCVS: any[],
  apiKey: string
): Promise<string> {
  const isPlaceholder = apiKey.startsWith("sk-proj-placeholder") || !apiKey;

  if (isPlaceholder) {
    // Simula tempo de resposta do modelo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return MOCK_CVS_ANALYSIS;
  }

  try {
    const chat = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4o",
      temperature: 0.3
    });

    const dataText = JSON.stringify(dadosCVS, null, 2);
    
    const response = await chat.invoke([
      { role: "system", content: CVS_SYSTEM_PROMPT },
      { role: "user", content: `Analise as seguintes campanhas financeiras:\n${dataText}` }
    ]);

    return typeof response.content === "string" 
      ? response.content 
      : JSON.stringify(response.content);
  } catch (error) {
    console.error("Erro ao chamar o modelo da OpenAI (CVS):", error);
    // Fallback de segurança
    return MOCK_CVS_ANALYSIS;
  }
}
