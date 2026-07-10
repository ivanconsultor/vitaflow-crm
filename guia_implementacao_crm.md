# Guia de Implementação Operacional — CRM VitaFlow (Roteiro Centralizado de Integrações)

Este guia estabelece o roteiro técnico passo a passo e numerado para colocar o **CRM do VitaFlow** em produção total, integrando banco de dados real, APIs de tráfego, plataformas de afiliados e automações.

---

## Roteiro Sequencial de Integrações (Passo a Passo de 1 a 9)

### [Passo 1] Banco de Dados Real & Persistência (Prisma ORM + PostgreSQL)
* **Objetivo**: Substituir mocks na listagem de leads e vendas por tabelas físicas do banco de dados PostgreSQL.
* **Status**: ✅ CONCLUÍDO (Prisma migrado e persistência em `/crm` ativa).

---

### [Passo 2] Segurança de Webhooks (GSD Data Protection)
* **Objetivo**: Proteger as rotas de postbacks com chaves de assinatura (Secret Tokens) das 5 redes de afiliados.
* **Status**: ✅ CONCLUÍDO (Validações de assinatura ativas no backend Fastify).

---

### [Passo 3] Persistência de Fechamento de Vendas no Kanban (`/prospectos`)
* **Objetivo**: Integrar o botão "Confirmar Venda" do Kanban à API para atualizar o status do lead no banco e evitar perda de estado.
* **Status**: ✅ CONCLUÍDO (Rota `PUT /api/leads/:id` integrada e persistindo no banco Postgres).

---

### [Passo 4] Sincronização Real de Leads via API do Systeme.io
* **Objetivo**: Chamar a API oficial do Systeme.io (`GET /contacts`) no botão "Sincronizar Agora" para ler os contatos reais.
* **Status**: ✅ CONCLUÍDO (Serviço `SystemeioService` integrado e build testado com sucesso).

---

### [Passo 5] Envio de Mensagens Reais via Facebook Messenger Graph API
* **Objetivo**: Substituir o mock do Meta Messenger na rota `POST /api/messenger/send` por chamadas HTTP Graph API usando o token `MESSENGER_PAGE_ACCESS_TOKEN`.
* **Status**: ✅ CONCLUÍDO (Implementação real via Fetch na Graph API v19.0).

---

### [Passo 6] Bot de Alertas no Telegram para Relatórios de Anúncios de IA
* **Objetivo**: Modificar a rota `/api/ads/agent/analyze` para enviar o relatório analítico markdown gerado pelo agente de IA do Meta/Google direto para o chat do Telegram configurado.
* **Status**: ✅ CONCLUÍDO (Função `sendAdsReportNotification` integrada de forma assíncrona ao controller de Ads).

---

### [Passo 7] Recuperação de Vendas via Twilio SendGrid (E-mail) & Twilio SMS
* **Objetivo**: Disparar e-mails automáticos de recuperação no checkout abandonado em paralelo com o SMS e inscrição em campanhas do Systeme.io.
* **Status**: ✅ CONCLUÍDO (Central de Recuperação de Checkout estendida em `webhooks.ts` integrando SMS Twilio, E-mail SendGrid e inscrição automática em campanha do Systeme.io).

---

### [Passo 8] Conexão Real com a Meta Ads API (Facebook Ads)
* **Objetivo**: Substituir a lista estática de campanhas e puxar dados em tempo real da Graph API (`GET /act_{AD_ACCOUNT_ID}/insights`) utilizando o token de acesso.
* **Status**: ✅ CONCLUÍDO (Consultas à API de insights de campanhas com fallback de segurança).

---

### [Passo 9] Conexão Real com a Google Ads API (REST)
* **Objetivo**: Realizar a renovação do token de acesso via OAuth a partir do refresh token e extrair as métricas de campanha via consulta GAQL.
* **Status**: ✅ CONCLUÍDO (Renovação dinâmica de token e consulta de campanhas ativas implementadas).
