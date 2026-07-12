# Regras do Projeto & Guia Operacional — Sistema VitaFlow

Este arquivo centraliza as regras exclusivas, topologia de arquitetura, guias de deploy e roteiro de integrações do **Sistema VitaFlow (CRM & Automações)**.

---

## 🟢 1. Inicialização do Sistema (Frontend e Backend)
- **Frontend**: Rodar `npm run dev` na pasta `apps/frontend` (Porta/Acesso: `http://localhost:3005`).
- **Backend**: Rodar `npm run dev` na pasta `apps/backend` (Porta/Acesso: `http://localhost:3001`).
- **Verificação Proativa**: Garanta que o frontend e o backend estejam rodando antes de realizar testes de navegação para evitar falhas de comunicação com a API.

---

## 🐳 2. Diretrizes de Infraestrutura (Docker & Portainer)
- **Invariante Crítico de Modificação**: O agente de IA está TERMINANTEMENTE PROIBIDO de iniciar contêineres, reconstruir imagens ou modificar stacks no Docker/Portainer do usuário de forma automática. 
- **Criação Manual**: Todas as novas stacks e contêineres devem ser criados e iniciados exclusivamente de forma manual pelo usuário. A função do agente é apenas gerar e entregar os códigos (Dockerfiles, docker-compose.yml) e as instruções passo a passo.
- **Isolamento de Portas**:
  - PostgreSQL VitaFlow: Porta host `5441` (interno `5432`).
  - Redis VitaFlow: Porta host `6383` (interno `6379`).
  - Backend VitaFlow: Porta host `3001` (interno `3001`).
  - Frontend VitaFlow: Porta host `3005` (interno `3005`).
  - *Nota:* Nunca misture portas ou recursos com o projeto de finanças (Postgres na porta `5442`).

---

## 🎨 3. Identidade Visual, UI & UX Premium
- **Aparência**: Interface escura (Dark Mode sofisticado) com micro-animações, layouts fluidos e visual moderno que impressione o usuário.
- **CRM e Lead Management**: Leads organizados em tabelas e prospectos exibidos em formato Kanban, usando o método de 4Cs de cores.

<RULE[dashboard_fidelity]>
Sempre que o usuário fornecer imagens de referência para a construção de um Dashboard ou tela (ex: Dashboard CVS):
1. O agente DEVE mapear e implementar todas as abas, sub-abas e botões de navegação visíveis na interface. Não abrevie.
2. Nenhuma aba ou seção visual deve ser omitida para poupar tempo. O agente deve garantir que a navegação interna da página cubra 100% das visões mostradas nas referências.
3. O agente deve se atentar a detalhes estruturais (como a barra superior de métricas "Compras Confirmadas / Order Bump" que deve preceder as tabelas de inteligência).
</RULE[dashboard_fidelity]>

<RULE[no_destruction]>
REGRA CRÍTICA DE INTEGRAÇÃO: O agente é TERMINANTEMENTE PROIBIDO de deletar, simplificar, ocultar ou destruir qualquer layout, design, acordeão, botão, aba ou estrutura de frontend pré-existente para implementar qualquer integração de backend (APIs, webhooks, N8N, bancos de dados, etc.). 
Qualquer integração de dados dinâmicos DEVE ser injetada de forma cirúrgica e invisível dentro do design original rico que o usuário já construiu e testou, mantendo fallbacks estáticos para preservar a integridade visual intacta em qualquer circunstância.
</RULE[no_destruction]>

---

## 🗺️ 4. Topologia de Arquitetura

```mermaid
graph TD
    %% Fontes de Tráfego e Cliente
    Cliente[Cliente/Lead USA] -->|Email / SMS| Twilio[Twilio / Systeme.io]
    Cliente -->|Messenger| FBMessenger[Facebook Messenger]
    
    %% Gateway e Atendimento
    FBMessenger -->|Túnel Cloudflare| Chatwoot[Chatwoot Local]
    Twilio -->|Túnel Cloudflare| Chatwoot
    Chatwoot -->|Integração| Typebot[Typebot Local]
    
    %% Orquestrador e Serviços Auxiliares
    N8N[N8N Local] -->|Orquestração| Chatwoot
    N8N -->|Notificação Equipe| Telegram[Telegram - Interno]
    N8N -->|Disparo de Mensagens| EvolutionGO[Evolution GO Local]
    N8N -->|Persistência| Postgres[(Postgres Local)]
    N8N -->|Cache| Redis[(Redis Local)]
    N8N -->|IA| ChatGPT[ChatGPT API]
    
    %% Armazenamento de Arquivos
    N8N -->|Upload de Mídia| MinIO[(MinIO Local - S3)]
    EvolutionGO -->|Download de Mídia| MinIO
    Chatwoot -->|Armazenamento| MinIO

    %% Mídias Sociais Orgânicas & CRM
    CRM[CRM / App NextJS] -->|Agendar Posts| Postgres
    N8N -->|1. Publicação Orgânica| Pinterest[Pinterest API]
    N8N -->|2. Publicação Orgânica| Instagram[Instagram Reels API]
    N8N -->|3. Publicação Orgânica| YouTube[YouTube Shorts API]
    N8N -->|4. Publicação Orgânica| TikTok[TikTok API]
    
    Pinterest -->|Métricas de Views/Likes| N8N
    Instagram -->|Métricas de Views/Likes| N8N
    YouTube -->|Métricas de Views/Likes| N8N
    TikTok -->|Métricas de Views/Likes| N8N
```

### Detalhes dos Fluxos
- **n8n**: Responsável por ler agendamentos, fazer uploads de criativos em APIs de anúncios e enviar estatísticas diárias de performance para o banco local.
- **MinIO**: Serve como repositório de criativos (imagens, áudios e vídeos) que as APIs externas precisam ler.
- **Comunicação Site ↔ Sistema**: O Site (Vanilla HTML/CSS/JS na Hostinger) e o Sistema (Docker local) são isolados e se comunicam exclusivamente via requisições de API (Webhooks) expostas pelo Cloudflare Tunnel.

---

## 🔑 5. Configuração Operacional de Credenciais no `.env`

Você precisará configurar as seguintes informações reais no arquivo `.env` da raiz e de `apps/backend/`:
- **Telegram Alert Bot**: Token gerado via `@BotFather` (`TELEGRAM_BOT_TOKEN`) e ID de chat obtido via API getUpdates (`TELEGRAM_CHAT_ID`).
- **Facebook Ads (Meta API)**: Token de acesso do usuário do sistema (`META_ACCESS_TOKEN`) e ID de conta de anúncios (`META_AD_ACCOUNT_ID`).
- **Google Ads**: Token de desenvolvedor (`GOOGLE_ADS_DEVELOPER_TOKEN`), Client ID/Secret OAuth (`GOOGLE_ADS_CLIENT_ID` / `GOOGLE_ADS_CLIENT_SECRET`) e Refresh Token (`GOOGLE_ADS_REFRESH_TOKEN`).
- **Twilio & SendGrid**: Account SID e Auth Token da Twilio (`TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`), número de saída (`TWILIO_FROM_NUMBER`) e chave de API do SendGrid (`SENDGRID_API_KEY`).
- **Systeme.io**: Chave de API pública (`SYSTEMEIO_API_KEY`) para automação de checkout.

---

## 🌐 6. Configuração do Cloudflare Tunnel (cloudflared)

Para expor o servidor local (`localhost:3001` / `localhost:3005`) à internet de forma segura:
1. **Instalação**: `winget install cloudflare.cloudflared` no Windows.
2. **Login**: `cloudflared tunnel login`.
3. **Criação do Túnel**: `cloudflared tunnel create vitaflow-tunnel`.
4. **Mapeamento DNS**: `cloudflared tunnel route dns vitaflow-tunnel api.seudominio.com`.
5. **Execução**:
   - Redirecionar tráfego para a API: `cloudflared tunnel run --url http://localhost:3001 vitaflow-tunnel`
   - Redirecionar tráfego para o Frontend: `cloudflared tunnel run --url http://localhost:3005 vitaflow-tunnel`

---

## 📈 7. Roteiro Sequencial de Integrações (Status do Desenvolvimento)

- **[Passo 1] Banco de Dados Real & Persistência**: ✅ CONCLUÍDO (Prisma migrado e persistência ativa).
- **[Passo 2] Segurança de Webhooks**: ✅ CONCLUÍDO (Validações de assinatura ativas no backend Fastify).
- **[Passo 3] Persistência de Fechamento de Vendas no Kanban**: ✅ CONCLUÍDO (Rota `PUT /api/leads/:id` integrada e persistindo no banco Postgres).
- **[Passo 4] Sincronização Real de Leads via API do Systeme.io**: ✅ CONCLUÍDO (Serviço `SystemeioService` integrado e build testado com sucesso).
- **[Passo 5] Envio de Mensagens Reais via Facebook Messenger Graph API**: ✅ CONCLUÍDO (Implementação real via Fetch na Graph API v19.0).
- **[Passo 6] Bot de Alertas no Telegram para Relatórios de Anúncios de IA**: ✅ CONCLUÍDO (Função `sendAdsReportNotification` integrada ao de Ads).
- **[Passo 7] Recuperação de Vendas via Twilio SendGrid (E-mail) & Twilio SMS**: ✅ CONCLUÍDO (SMS Twilio, E-mail SendGrid e inscrição Systeme.io integrados).
- **[Passo 8] Conexão Real com a Meta Ads API (Facebook Ads)**: ✅ CONCLUÍDO (Consultas à API de insights de campanhas com fallback de segurança).
- **[Passo 9] Conexão Real com a Google Ads API (REST)**: ✅ CONCLUÍDO (Renovação dinâmica de token e consulta de campanhas ativas implementadas).
