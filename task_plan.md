# Plano de Trabalho - Sistema de Gestao de Negocio Digital com IA

## Fases do Projeto

### Fase 1: Fundacao (Semanas 1-3)
* [ ] Setup do ambiente de desenvolvimento Monorepo.
* [ ] Setup do Docker Compose contendo PostgreSQL, Redis, Next.js e Fastify.
* [ ] Configuracao do Prisma ORM e execucao da primeira migration.
* [ ] Implementacao do Backend Fastify 5.x basico (estrutura de pastas, rotas de healthcheck e conexao com banco).
* [ ] Implementacao do Dashboard de OKRs (Backend API e Frontend Next.js com visual Dark Mode e Recharts).
* [ ] Implementacao do CRM basico (Cadastro de Leads, Tags e Pipeline no Backend e UI no Frontend).
* [ ] Implementacao do FuNews (Mapa visual de funis e metas de conversao).

### Fase 2: Captacao e Conteudo (Semanas 4-6)
* [ ] Desenvolvimento de Landing Page estatica e estruturada em Next.js.
* [ ] Criacao do Quiz Interativo com captura de leads integrado ao Systeme.io API.
* [ ] Desenvolvimento do Dashboard de Pressel e visualizacao de métricas no Frontend.
* [ ] Implementacao do Calendario Editorial de Conteudos no Frontend Next.js.

### Fase 3: Trafego e Conversao (Semanas 7-10)
* [ ] Integracao com a API do Meta Ads (Facebook Ads) e API do Google Ads no Backend.
* [ ] Desenvolvimento do Dashboard de Anuncios unificado no Next.js.
* [ ] Implementacao do Agente de IA com LangChain JS para analise de metricas de campanhas e anuncios.
* [ ] Implementacao do Planejador de Campanhas de Vendas (CVS) no modulo de conversao.
* [ ] Pipeline automatico de geracao de conteudos multiplataforma a partir de Newsletter.

### Fase 4: Automacao Avancada (Semanas 11-14)
* [ ] Integracao com a API do Systeme.io para envio de sequencias automaticas de e-mails.
* [ ] Integracao com a API do Twilio para envio automatico de SMS/MMS nos EUA.
* [ ] Integracao com a API do Facebook Messenger para envio de mensagens automáticas de follow-up.
* [ ] Modulo de Analytics unificado para redes sociais (Instagram, Pinterest, YouTube, TikTok).
* [ ] Testes de integracao ponta a ponta e otimizacoes de performance.

---

## Mapeamento de Modulos - Fase 1

### Modulo 1: Setup e Infraestrutura
* [ ] Criar estrutura de diretorios monorepo: `apps/frontend` e `apps/backend`.
* [ ] Criar arquivo `docker-compose.yml` e arquivo `.env` na raiz.
* [ ] Configurar TypeScript no backend e frontend.
* [ ] Configurar schema Prisma com as entidades definidas no SPEC.
* [ ] Validar inicializacao dos containers Docker.

### Modulo 2: Core do Backend Fastify 5.x
* [ ] Inicializar o Fastify 5.x com suporte a TypeScript.
* [ ] Configurar plugins necessarios (CORS, Prisma Client, @fastify/env).
* [ ] Criar rotas CRUD para Leads.
* [ ] Criar rotas CRUD para OKRs e Resultados-Chave.
* [ ] Criar rotas CRUD para Funis e Etapas.

### Modulo 3: Dashboard de OKRs, CRM e FuNews
* [ ] Inicializar Next.js (TypeScript + Tailwind CSS) na pasta `apps/frontend`.
* [ ] Configurar layout base Dark Mode no frontend com Vanilla CSS.
* [ ] Desenvolver componente Sidebar e Header no Frontend.
* [ ] Implementar visualizacao e gerenciamento de OKRs no Frontend.
* [ ] Implementar visualizacao e gerenciamento de CRM (Leads e Pipeline) no Frontend.
* [ ] Implementar componente de FuNews (Mapa visual de funis e barras de progresso) no Frontend.
