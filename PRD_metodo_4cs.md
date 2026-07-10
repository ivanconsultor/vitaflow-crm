# PRD — Product Requirements Document
## VitaFlow — Sistema de Gestão para Afiliados (Mercado USA)

**Versão:** 3.0  
**Data:** Junho / 2026  
**Status:** Atualizado (Dashboard CVS + Métricas VDN)  

---

## 1. Visão Geral

### 1.1 Problema
Operar como afiliado no mercado americano de nutracêuticos hoje exige lidar com ferramentas dispersas: planilhas de ROI manuais, dashboards de Ads desconectados das plataformas de afiliados (ClickBank, BuyGoods, Digistore24, MaxWeb, GuruMedia) e falta de inteligência na gestão de leads. Isso gera perda de escala, decisões baseadas em achismo e dificuldade de otimizar campanhas de alto investimento.

### 1.2 Solução
Criar a **VitaFlow**, um sistema único e integrado focado especificamente na operação de afiliados no mercado americano. O sistema centraliza a operação em **4 módulos interligados** (Configuração, Captação, Conexão e Conversão), com IA integrada para analisar dados de tráfego (Meta Ads) e cruzar com as conversões em dólar geradas nas plataformas de afiliação.

### 1.3 Stack Tecnológica (v3.0)

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js (TypeScript) — Dashboard Web (porta 3005) |
| **Backend** | Fastify 5.x (Node.js + TypeScript) — API + Agente de IA (porta 3001) |
| **AI Agent** | LangChain JS (`langchain/core`) analisando tráfego e funis |
| **Infra** | Docker Compose — Orquestração dos serviços |
| **Config** | `.env` — Variáveis de ambiente e chaves de API |
| **Database** | PostgreSQL via Prisma ORM (schema + migrations built-in) |

### 1.4 Objetivo do Produto
> Fazer com que **70%+ da operação do afiliado rode com IA e automação**, cruzando dados de investimento em tráfego com o faturamento real em plataformas de afiliação gringas para maximizar o ROI e o lucro em dólar.

---

## 2. Público-Alvo

| Perfil | Descrição |
|---|---|
| **Usuário primário** | Empreendedor digital atuando no mercado americano (Afiliados de Nutracêuticos) |
| **Tamanho** | Negócio solo ou pequena equipe (1–5 pessoas) |
| **Nível técnico** | Avançado em tráfego — usa Meta Ads, Google Ads, e funis de VSL |
| **Dor principal** | Rastrear o ROI exato por campanha quando a plataforma de afiliado e a plataforma de anúncios não conversam perfeitamente. |
| **Canal de venda** | Links de afiliados em ClickBank, BuyGoods, Digistore24, MaxWeb, GuruMedia |

---

## 3. Módulos do Produto (Ecossistema VitaFlow)

A **VitaFlow** é dividida em **4 módulos principais**, cada um com uma **Capa** (tela de boas-vindas) e telas internas.

---

### 🔧 Módulo 1 — CONFIGURAÇÃO (C1 — Roxo `#A855F7`)

**Rota da Capa:** `/c1`  
**Objetivo:** Dar clareza de onde o negócio está e para onde vai no mercado de afiliação.

#### Funcionalidades Implementadas

| ID | Funcionalidade | Rota | Status |
|---|---|---|---|
| C1-01 | Dashboard de OKRs (Metas Trimestrais e Mensais) | `/` (Home) | ✅ Concluída |
| C1-02 | Painel Analytics (YouTube, Newsletter, Financeiro) | `/analytics` | ✅ Concluída |
| C1-03 | CRM de Leads (Tabela com filtros e tags) | `/crm` | ✅ Concluída |
| C1-04 | Integrações centralizadas (Webhooks, APIs) | `/integracoes` | ✅ Concluída |

---

### 📡 Módulo 2 — CAPTAÇÃO (C2 — Verde `#22C55E`)

**Rota da Capa:** `/c2`  
**Objetivo:** Transformar cliques em leads e vendas de forma previsível e barata.

#### Funcionalidades Implementadas

| ID | Funcionalidade | Rota | Status |
|---|---|---|---|
| C2-01 | Gestão de Campanhas — Ativos de tráfego, ROI e metas | `/campanhas` | ✅ Concluída |
| C2-02 | Ads & IA — Dashboard unificado de anúncios com análise LangChain | `/ads` | ✅ Concluída |
| C2-03 | Landing Pages — Gestão de páginas de advertorial e pre-sell | `/capture` | ✅ Concluída |

---

### 🔗 Módulo 3 — CONEXÃO (C3 — Ciano `#06B6D4`)

**Rota da Capa:** `/c3`  
**Objetivo:** Construir relacionamento e re-aquecer a base de leads.

#### Funcionalidades Implementadas

| ID | Funcionalidade | Rota | Status |
|---|---|---|---|
| C3-01 | Dashboard da Newsletter (Editor + Métricas) | `/newsletter` | ✅ Concluída |
| C3-02 | Conteúdos (Geração de Copy com IA) | `/conteudo` | ✅ Concluída |
| C3-03 | Calendário Editorial (Heatmap) | `/editorial` | ✅ Concluída |

---

### 💰 Módulo 4 — CONVERSÃO (C4 — Laranja/Amarelo `#F97316`)

**Rota da Capa:** `/c4`  
**Objetivo:** Transformar relacionamento e cliques na pre-sell em dólares na conta.

#### Funcionalidades Implementadas

| ID | Funcionalidade | Rota | Status |
|---|---|---|---|
| C4-01 | Prospectos — Quadro Kanban ágil focado em fechamento comercial | `/prospectos` | ✅ Concluída |
| C4-02 | Funis de Venda — Mapa visual de fluxos diretos e indiretos | `/funnels` | ✅ Concluída |
| C4-03 | **Vendas (Dashboard CVS)** — Tabela financeira de alta densidade + Métricas VDN | `/vendas` | ✅ Concluída |
| C4-04 | **IA Financeira (CFO Virtual)** — Análise de faturamento e custos para otimização de lucro | `/vendas` | 🔄 Em Implementação |

#### Dashboard CVS (`/vendas`) — Detalhamento

O Dashboard de Vendas é a tela financeira mais complexa do sistema. Possui **2 abas**:

**Aba 1: Planilha CVS**
- Tabela de alta densidade (23 colunas) com agrupamento mensal (Jan–Jun 2026).
- 16 campanhas mapeadas com faturamento bruto, líquido, IR, gateway, order bump, margem e lucro.
- Barra de rodapé "TOTAL GERAL" consolidando todas as campanhas (R$ 1.032.097,00 em faturamento).
- Modal de "Nova Campanha" com formulário completo (nome, datas, preço, gateway, IR, Order Bump).

**Aba 2: Métricas Detalhadas (VDN)**
- Sub-navegação por "pills": Consolidado e Inteligência.
- **Consolidado**: Faturamento total do projeto (R$ 116.668,00), KPIs de LTV (13.5x), Ticket Médio, Taxa de Ascensão, Distribuição de Receita (barra visual Fase 1 vs Fase 2), Funil de Jornada do Cliente (Leads → Workshop → GDI).
- **Inteligência de E-mail**: Volume Disparado (213.284), Open Rate (21.02%), CTR (1.13%), Gráfico de barras nativo (16 emails com Open Rate e CTR), Insight de IA e tabela detalhada dos 16 emails com cores condicionais.
- **Inteligência Financeira (CVS AI)**: Painel integrado gerado dinamicamente via Agente AI que analisa o faturamento bruto, custos (IR, gateway, ads) e margem líquida, sugerindo escalonamento de campanhas rentáveis e cortes de gargalos financeiros.

---

## 4. Experiência do Usuário

### 4.1 Princípios de Design
- **Dark Mode Premium** como padrão (`var(--bg-primary)` / `#0F111A`) — sofisticado e denso em dados.
- **Identidade VitaFlow:** Menu lateral com Badges coloridos por etapa (C1 Roxo, C2 Verde, C3 Ciano, C4 Laranja).
- **Ação em 1 clique** — qualquer dado deve levar à ferramenta nativa com rapidez.
- **Tipografia Inter** — fonte moderna para tabelas financeiras com `font-variant-numeric: tabular-nums`.

### 4.2 Sidebar (Menu Lateral)
O menu lateral carrega "VITAFLOW" no topo e é estruturado em blocos com badges coloridos dos 4Cs, servindo como dropdown e como botão de atalho direto para as Capas de cada módulo.

---

## 4. Design System e Identidade Visual (UX/UI Premium)

O Sistema VitaFlow foi projetado para transmitir uma percepção de alto valor (Premium), distanciando-se de painéis genéricos e adotando um **Design Tátil e Reativo**. A interface não é apenas uma ferramenta, mas um ambiente de trabalho imersivo.

### 4.1. Tema e Paleta de Cores (Dark Mode Premium)
A aplicação opera estritamente no formato Dark Mode.
- **Background Principal**: Fundo escuro imersivo (`#0F111A` ou `#131520`).
- **Navegação Contínua**: Remoção de blocos "quebrados"; os fundos fluem organicamente usando a variável CSS raiz `var(--bg-primary)`.

### 4.2. Padrão Cromático dos Módulos (Os 4 Cs)
Cada módulo base do sistema possui uma cor guia que serve como âncora visual para o usuário:
- **C1 - Configuração (Setup/Integração)**: Tons de Roxo (Purple).
- **C2 - Captação (Tráfego/Leads)**: Tons de Verde (Emerald/Teal).
- **C3 - Conexão (Conteúdo/Mensagens)**: Tons de Ciano (Cyan).
- **C4 - Conversão (Vendas/CRM)**: Tons de Laranja/Magenta/Amarelo.

### 4.3. Design Tátil, Glassmorphism e Glow Effects
O sistema reage aos movimentos do usuário, criando uma experiência tátil:
- **Efeitos de Hover (Glow)**: Ao passar o cursor, cartões e painéis elevam-se sutilmente e ganham um contorno (borda) iluminado com a cor correspondente ao módulo ativo, gerando um efeito de "Neon" sutil (`box-shadow` luminescente).
- **Glassmorphism**: Elementos flutuantes, barras laterais e modais utilizam fundos semitransparentes com efeito de desfoque (blur), permitindo que o fundo escuro do ambiente passe levemente, garantindo sofisticação.
- **Sticky Headers**: O cabeçalho global ("Sistema VitaFlow" ou Títulos de Painéis) é mantido fixo (sticky) durante a rolagem vertical. Isso garante ancoragem mental e rápida navegação.
- **Micro-interações**: Feedback instantâneo em botões, transições suaves de abas e spinners de carregamento integrados visualmente (ex: processamento da IA CFO).

---

## 5. Integrações Críticas e Apoio

| Sistema | Propósito na VitaFlow |
|---|---|
| **Systeme.io** | Páginas de Captura (Advertorials/Pre-sells), E-mail Marketing e Automação de Leads |
| **Meta Ads / Google Ads API** | Coleta de dados de investimento, cliques e impressões por campanha. |
| **ClickBank / BuyGoods / Digistore24 / MaxWeb / GuruMedia** | Envio de webhooks (Postbacks) notificando sempre que uma comissão (Venda/Upsell) for gerada in USD. |
| **Beehiiv** | Métricas de newsletter (Open Rate, CTR) |
| **Twilio / SMS** | Envio de mensagens SMS para leads |

### 5.1. Configurações (Apoio)
- **Integrações (`/configuracoes/integracoes`)**: Gerenciamento de chaves de API (OpenAI, Stripe, Meta, etc).
- **Equipe (`/configuracoes/equipe`)**: Níveis de acesso (Admin, Copy, Tráfego).

---

## 6. GSD Data Protection (Segurança de MVP)
Seguindo a filosofia *Get Shit Done* para entregar máxima segurança com o mínimo de atrito operacional, o sistema adota:
- **Proteção de Rotas Base (JWT):** Acesso às áreas financeiras e de CRM protegido por token `JWT` gerado a partir de uma "Senha Mestre" (Admin).
- **Webhooks Seguros:** Integrações com plataformas externas (Systeme.io, ClickBank, BuyGoods, Digistore24, MaxWeb, GuruMedia) dependem de chaves de assinatura (Secret Tokens) para evitar falsificação de vendas e injeção de leads falsos.

---

## 7. Roadmap de Entrega (Revisado v3.0)

```
FASE 1 — Fundação e Receita ✅ CONCLUÍDA
├── Setup Docker Compose (Next.js + Fastify + PostgreSQL)
├── Rebranding UI (VitaFlow, Sidebar, Capas C1-C4)
├── C1: Dashboard OKR e CRM de Leads
└── C4: Integração de Webhooks (ClickBank/BuyGoods)

FASE 2 — Tráfego Inteligente ✅ CONCLUÍDA
├── C2: Dashboard de Meta Ads com LangChain
├── C2: Landing Pages / Pre-sells
└── Cruzamento de dados: Investimento em Ads x Faturamento

FASE 3 — Retenção e Engajamento ✅ CONCLUÍDA
├── C3: Dashboard de Newsletter e Calendário Editorial
├── C3: Conteúdos com IA
└── Automação de fluxos de remarketing

FASE 4 — Vendas e Métricas ✅ CONCLUÍDA
├── C4: Dashboard CVS (Tabela financeira de alta densidade)
├── C4: Métricas VDN (Consolidado + Inteligência de E-mail)
├── C4: Prospectos (Kanban CRM de Vendas)
└── C4: Funis de Venda
```

## Requisitos de SEO e Descoberta (Google SEO e Sitemap)
- **Sitemap XML:** O sistema deve gerar e manter um sitemap.xml atualizado automaticamente com as rotas publicas para indexacao do Google.
- **Robots.txt:** O arquivo obots.txt deve estar configurado para permitir a varredura do Googlebot nas paginas publicas e bloquear areas sensiveis (ex: /admin, /crm, /api).
- **Meta Tags Globais:** Implementacao de meta tags dinamicas (Title, Description, Keywords) em todas as paginas publicas para melhorar o ranqueamento organico.
- **Open Graph e Twitter Cards:** Configuracao de tags OG para compartilhamento otimizado em redes sociais e WhatsApp.
