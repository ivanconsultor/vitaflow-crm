# SPEC — Technical Specifications
## VitaFlow — Sistema de Gestão para Afiliados (Mercado USA)

**Versão:** 3.0  
**Data:** Junho / 2026  
**Status:** Atualizado (Revisão Completa)  

---

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND / UI                            │
│              Next.js (TypeScript) — Dashboard Web               │
│            Lucide Icons · CSS Modules · Dark Mode Premium       │
│            Porta: 3005                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP / REST
┌──────────────────────────▼──────────────────────────────────────┐
│               BACKEND — Fastify 5.x (Node.js + TypeScript)      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              AI AGENT — LangChain JS (langchain/core)      │  │
│  │   Facebook Ads API Analysis · Webhook Analytics           │  │
│  └────────────────────────────────────────────────────────────┘  │
│  Endpoints REST · pino-pretty logger · .env para chaves de API  │
│  Porta: 3001                                                     │
└──────────┬──────────────┬──────────────┬──────────────┬─────────┘
           │              │              │              │
┌──────────▼──┐   ┌───────▼──────┐  ┌───▼─────────────────────────────────────┐  ┌────▼────────┐
│ PostgreSQL  │   │  Meta Ads /  │  │ ClickBank / BuyGoods / Digistore24 /    │  │ Systeme.io  │
│ via Prisma  │   │  Google Ads  │  │ MaxWeb / GuruMedia — Webhooks           │  │ (E-mail/LP) │
│ ORM         │   │  APIs        │  └─────────────────────────────────────────┘  └─────────────┘
└─────────────┘   └──────────────┘  └───────────┘
```

---

## 2. Estrutura de Diretórios

```
AG 02 Sistema/
├── apps/
│   ├── frontend/                        # Next.js (porta 3005)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx           # Layout global (Sidebar + Header)
│   │       │   ├── layout.module.css    # CSS do layout principal
│   │       │   ├── page.tsx             # Home — Dashboard OKRs
│   │       │   ├── page.module.css
│   │       │   ├── ads/                 # C2: Ads & IA
│   │       │   ├── analytics/           # Visão Geral: Analytics
│   │       │   ├── c1/                  # Capa C1: Configuração
│   │       │   ├── c2/                  # Capa C2: Captação
│   │       │   ├── c3/                  # Capa C3: Conexão
│   │       │   ├── c4/                  # Capa C4: Conversão
│   │       │   ├── campanhas/           # C4: Campanhas
│   │       │   ├── capture/             # C2: Landing Pages
│   │       │   ├── conteudo/            # C3: Conteúdos IA
│   │       │   ├── crm/                 # C1: CRM Leads
│   │       │   ├── editorial/           # C3: Calendário Editorial
│   │       │   ├── funnels/             # C4: Funis de Venda
│   │       │   ├── integracoes/         # C1: Integrações
│   │       │   ├── newsletter/          # C3: Newsletter
│   │       │   ├── prospectos/          # C4: Kanban CRM Vendas
│   │       │   └── vendas/              # C4: Dashboard CVS + Métricas VDN
│   │       │       ├── page.tsx         # Componente principal (714 linhas)
│   │       │       └── page.module.css  # Estilos (812 linhas)
│   │       ├── components/
│   │       │   ├── Sidebar.tsx          # Menu lateral com 4Cs
│   │       │   ├── Sidebar.module.css
│   │       │   └── Header.tsx           # Cabeçalho global
│   │       └── styles/
│   │           └── globals.css          # Variáveis CSS globais
│   └── backend/                         # Fastify (porta 3001)
│       ├── prisma/
│       │   └── schema.prisma            # 14 modelos (200 linhas)
│       └── src/
│           ├── index.ts                 # Entry point Fastify
│           ├── controllers/             # Lógica de negócio
│           ├── routes/                  # 14 arquivos de rotas
│           │   ├── ads.ts
│           │   ├── analytics.routes.ts
│           │   ├── campaigns.routes.ts
│           │   ├── content.routes.ts
│           │   ├── editorial.ts
│           │   ├── funnels.ts
│           │   ├── leads.ts
│           │   ├── messenger.routes.ts
│           │   ├── okrs.ts
│           │   ├── sms.routes.ts
│           │   ├── systemeio.routes.ts
│           │   ├── tracking.routes.ts
│           │   ├── vendas.routes.ts     # Inclui endpoint /insights para IA CVS
│           │   └── webhooks.ts          # Postbacks ClickBank/BuyGoods
│           ├── services/
│           │   ├── ai/agent.ts          # Agente LangChain (inclui analisarVendasCVS)
│           │   ├── telegram.service.ts
│           │   └── twilio.service.ts
│           └── plugins/
├── PRD_metodo_4cs.md                    # Este PRD
├── SPEC_metodo_4cs.md                   # Esta SPEC
└── architecture/
    └── pop_vendas_dashboard.md
```

---

## 3. Prisma Schema — Modelos de Dados

O banco PostgreSQL possui **14 modelos**:

| Modelo | Propósito |
|---|---|
| `Lead` | Base de leads com tags, segmentação e histórico |
| `LeadProduto` | Relação M:N entre Lead e Produtos |
| `OKR` | Metas trimestrais/mensais |
| `ResultadoChave` | Key Results vinculados aos OKRs |
| `ProdutoAfiliado` | Produtos de afiliação (ClickBank, BuyGoods, Digistore24, MaxWeb, GuruMedia) |
| `Campanha` | Campanhas de vendas com investimento e faturamento |
| `EmailCampanha` | Emails individuais com Open Rate, CTR e Insight IA |
| `VendaAfiliado` | Transações de venda via webhook (comissão em USD) |
| `Funil` | Funis de venda (newsletter, isca, treinamento, afiliado) |
| `EtapaFunil` | Etapas do funil com meta e conversão atual |
| `SmsLog` | Registros de SMS enviados via Twilio |
| `Publicacao` | Conteúdos agendados (newsletter, pinterest, instagram, etc.) |
| `AdsCampaign` | Campanhas de anúncios (Meta/Google) com métricas agregadas |
| `AdsDailyMetric` | Métricas diárias por campanha de anúncio |
| `AdsCreative` | Criativos individuais com Insight IA |

---

## 4. Rotas do Backend (14 arquivos)

### 4.1 Postbacks (Webhooks)
```
POST /api/webhooks/clickbank    → Processa venda ClickBank
POST /api/webhooks/buygoods     → Processa venda BuyGoods
POST /api/webhooks/digistore24  → Processa venda Digistore24
POST /api/webhooks/maxweb       → Processa venda MaxWeb
POST /api/webhooks/gurumedia    → Processa venda GuruMedia
```

### 4.2 CRUD e APIs
```
GET/POST /api/leads             → CRM de Leads
GET/POST /api/okrs              → OKRs (Metas)
GET/POST /api/campaigns         → Campanhas de Vendas
GET/POST /api/funnels           → Funis de Venda
GET/POST /api/content           → Conteúdos
GET/POST /api/editorial         → Calendário Editorial
GET      /api/analytics         → Analytics consolidado
GET/POST /api/ads               → Dados de Anúncios
GET      /api/vendas            → Dashboard CVS
GET      /api/vendas/insights   → IA: Análise de lucros/CVS via LangChain
POST     /api/sms               → Envio de SMS (Twilio)
POST     /api/messenger         → Mensagens Messenger
POST     /api/systemeio         → Sync Systeme.io
GET/POST /api/tracking          → Tracking de links
```

---

## 5. Frontend — Mapeamento de Páginas (16 rotas)

| Rota | Módulo | Página | Componentes Principais |
|---|---|---|---|
| `/` | Visão Geral | Dashboard OKRs | Cards de KR com barras de progresso |
| `/analytics` | Visão Geral | Analytics (YouTube, Newsletter, Financeiro) | Gráficos e métricas |
| `/c1` | C1 | Capa Configuração | Tela de boas-vindas roxa |
| `/c2` | C2 | Capa Captação | Tela de boas-vindas verde |
| `/c3` | C3 | Capa Conexão | Tela de boas-vindas ciana |
| `/c4` | C4 | Capa Conversão | Tela de boas-vindas laranja |
| `/crm` | C1 | CRM Leads | Tabela com filtros, tags e histórico |
| `/integracoes` | C1 | Integrações | Painéis de conexão com APIs |

| `/ads` | C2 | Ads & IA | Dashboard de anúncios + LangChain |
| `/capture` | C2 | Landing Pages | Gestão de pre-sells e advertorials |
| `/newsletter` | C3 | Newsletter | Editor + Métricas |
| `/conteudo` | C3 | Conteúdos | Geração de copy com IA |
| `/editorial` | C3 | Calendário | Heatmap de publicações |
| `/campanhas` | C4 | Campanhas | Visão financeira por produto |
| `/prospectos` | C4 | Prospectos | Kanban CRM (5 fases) |
| `/funnels` | C4 | Funis de Venda | Mapa visual de fluxos |
| `/vendas` | C4 | **Dashboard CVS + Métricas VDN** | Tabela financeira + Gráficos nativos |

### 5.1 Gerenciamento de Estado
A aplicação utiliza Context API nativa do React junto com `useState` e `useReducer` para gerenciar:
- Fluxos multi-passo de onboarding.
- Navegação entre módulos principais.
- Estado de visibilidade de painéis e filtros de funil/kanban.

---

## 6. UI/UX, Design System e Estilização Frontend

Para refletir com precisão a documentação (PRD), o frontend foi construído utilizando um **Design System reativo, focado na estética "Dark Mode Premium"**.

### 6.1 Estratégia de CSS Modules
A fim de prevenir o vazamento de estilos e assegurar o encapsulamento, utilizamos **CSS Modules** (`*.module.css`) em toda a interface:
- Não utilizamos frameworks CSS engessados (como Tailwind ou Bootstrap). Todas as regras são Vanilla CSS, escritas "from scratch", para conferir singularidade aos componentes.
- A paleta de cores globais foi fixada no arquivo `layout.module.css` (ou global) usando variáveis CSS no `:root`, incluindo:
  - `--bg-primary`: `#0F111A` (Fundo infinito e imersivo)
  - Cores semânticas baseadas na metodologia dos 4 Cs: `--color-c1` (Roxo), `--color-c2` (Verde), `--color-c3` (Ciano), `--color-c4` (Laranja/Amarelo).

### 6.2 Padrões de Layout e Interação
- **Cabeçalho Sticky**: No layout base (e em módulos internos), o cabeçalho emprega `position: sticky; top: 0; z-index: 50;` com um `backdrop-filter: blur(8px)`, assegurando o menu fixo sem perder o charme do fundo desfocado (Glassmorphism) durante o *scroll* de dados.
- **Micro-interações de Hover (Glow Effects)**: Os "cards" financeiros, abas (pills) e itens de Kanban reagem ao mouse (`:hover`) através de uma transição (`transition: all 0.3s ease`). Quando focados, os elementos saltam suavemente (`transform: translateY(-2px)`) e projetam uma sombra colorida (Glow) usando a sintaxe `box-shadow: 0 4px 20px rgba(VAR_COR, 0.2)` e bordas destacadas (`border-color`).
- **Sidebar Dropdown Colorido**: O menu de navegação vertical (`Sidebar.tsx`) emprega "Badges" coloridas para denotar visualmente qual seção dos "4Cs" está ativa, substituindo atalhos textuais por ícones visuais memoráveis.

---

## 6. GSD Data Protection e Segurança
Para blindar o sistema rapidamente (GSD), implementamos:
- **Autenticação Backend:** `@fastify/jwt` configurado via Plugin (`plugins/jwt.ts`). Rotas críticas (`/api/vendas`, `/api/leads`) protegidas pelo hook `fastify.authenticate`. Endpoint de login: `POST /api/auth/login`.
- **Autenticação Frontend:** Componente de rota protegida (`AuthClientWrapper.tsx`) encapsulando o layout raiz do Next.js. Exige token no `localStorage` sob a chave `gsd_token` e redireciona para `/login` (página com estética Premium Glassmorphism) se ausente.
- **Webhooks:** Header `x-webhook-token` validado diretamente na rota `/api/webhooks/systemeio`.

---

## 7. Componente `/vendas` — Especificação Detalhada

### 6.1 Estados do Componente
```typescript
activeTab: "planilha" | "metricas"     // Aba principal
isModalOpen: boolean                    // Modal de Nova Campanha
activePill: "consolidado" | "inteligencia"  // Sub-navegação na aba Métricas
```

### 6.2 Aba "Planilha" — Tabela CVS
- **23 colunas**: MES, CODIGO, PRODUTO, CAT, DIAS, INICIO, FIM, PRECO, VENDAS, EST., VAR%, DIF, FAT.BRUTO, FATURA, ORDER BUMP, ANUNCIO, IR, GATEWAY, FAT.LIQUIDO, SUA PARTE%, LUCRO LIQUIDO, MARGEM LIQUIDA, STATUS
- **6 grupos mensais** (Jan–Jun 2026), cada um com cor de fundo translúcida distinta
- **16 campanhas** mockadas com dados financeiros realistas
- Linha **TOTAL GERAL** na base (R$ 1.032.097,00 de faturamento bruto)
- **Badges de status**: "Concluída" (ciano) e "Planejada" (roxo)

### 6.3 Aba "Métricas" — VDN
- **Consolidado**: Faturamento (R$ 116.668,00), 4 KPIs, Distribuição de Receita (barra horizontal), Funil 3 degraus, Breakdown Fase 1 + Fase 2
- **Inteligência**: Volume (213.284), Open Rate (21.02%), CTR (1.13%), Gráfico de barras (16 emails), Insight IA, Tabela de 16 emails

### 6.4 Modal de Campanha
- Formulário com 12 campos: Nome, Código, Categoria, Datas, Status, Link, Preço, Investimento Ads, Gateway, IR, Vendas Estimadas/Reais
- Seção Order Bump

---

## 7. Design System

### 7.1 Paleta de Cores
| Token | Hex | Uso |
|---|---|---|
| `--bg-primary` | `#0F111A` | Fundo principal do sistema |
| C1 Roxo | `#A855F7` | Módulo Configuração |
| C2 Verde | `#22C55E` | Módulo Captação |
| C3 Ciano | `#06B6D4` / `#2DD4BF` | Módulo Conexão |
| C4 Laranja | `#F97316` | Módulo Conversão |
| Magenta | `#D946EF` | Destaque CVS (Dashboard de Vendas) |
| Teal | `#2DD4BF` | Faturamento Bruto |
| Verde | `#4ADE80` | Lucro / Positivo |
| Vermelho | `#EF4444` | Negativo / Alerta |
| Amarelo | `#FBBF24` | LTV / Destaque |

### 7.2 Tipografia
- **Font Family**: `Inter`, sans-serif
- **Font Variant Numeric**: `tabular-nums` (para alinhamento de colunas financeiras)

---

## 8. Ambientes

**Path local (Windows):**
```
C:\Users\ivanc\Documents\Antigraviry\AG 09 Projetos\AG 02 Sistema\
```

**Comandos de inicialização:**
```powershell
# Frontend (porta 3005)
cd "C:\Users\ivanc\Documents\Antigraviry\AG 09 Projetos\AG 02 Sistema\apps\frontend"
npm run dev

# Backend (porta 3001)
cd "C:\Users\ivanc\Documents\Antigraviry\AG 09 Projetos\AG 02 Sistema\apps\backend"
npm run dev
```

**URLs de acesso:**
- Frontend: `http://localhost:3005`
- Backend API: `http://localhost:3001`
- Dashboard CVS: `http://localhost:3005/vendas`

## Especificacoes Tecnicas de SEO e Sitemap
- **Geracao de Sitemap:** Utilizar bibliotecas nativas do framework (ex: 
ext-sitemap para Next.js ou plugins Vite) para gerar dinamicamente o sitemap.xml no build/deploy.
- **Robots.txt:** Arquivo estatico configurado no diretorio public/robots.txt apontando para a URL absoluta do Sitemap.
- **Componente SEO:** Criar um componente <SEO /> ou utilizar os metadados nativos (ex: Metadata API do Next.js 14) para injetar tags dinamicamente no <head> de cada rota publica.
- **Performance (Core Web Vitals):** Otimizacao de imagens e lazy-loading aplicados para garantir notas altas no Google PageSpeed Insights, favorecendo o algoritmo de SEO.
