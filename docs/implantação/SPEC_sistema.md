# Especificação Técnica (SPEC) — Sistema VitaFlow (CRM & Automações)

## 1. Stack Tecnológica Local (Docker)
A infraestrutura roda localmente utilizando containers Docker e gerenciamento via Portainer:
*   **n8n:** Orquestrador central de fluxos e chamadas HTTP.
*   **Chatwoot:** Centralização de canais de atendimento (Facebook Messenger, Twilio).
*   **Typebot:** Motor de chatbot de texto para qualificação de leads.
*   **Evolution GO:** Instância de gateway do WhatsApp para testes.
*   **Postgres:** Banco de dados relacional para persistência de leads, cliques, relatórios e controle de postagens.
*   **Redis:** Cache rápido e controle de filas das automações.
*   **MinIO:** Armazenamento compatível com AWS S3 para mídias de áudio, vídeo e imagem.
*   **Cloudflare Tunnels:** Túneis para expor endpoints internos locais (porta 5678 para n8n, porta 3000 para Chatwoot, porta 9000 para MinIO console/API) com conexões seguras HTTPS de URLs amigáveis.

## 2. Padrões de Dados de Comunicação (Site ↔ Sistema)
A comunicação é efetuada por meio de APIs JSON nativas.

### A. Webhook de Captura de Lead (Site → n8n)
*   **Endpoint:** `https://n8n.seu-tunel.com/webhook/v1/capture-lead`
*   **Método:** `POST`
*   **Payload JSON:**
```json
{
  "lead_name": "John Doe",
  "lead_email": "john@example.com",
  "lead_phone": "+15551234567",
  "source_page": "presell.html",
  "product_interest": "alpilean",
  "device": "mobile"
}
```

### B. Webhook de Rastreamento de Cliques (Site → n8n)
*   **Endpoint:** `https://n8n.seu-tunel.com/webhook/v1/track-click`
*   **Método:** `POST`
*   **Payload JSON:**
```json
{
  "click_id": "clk_xxxxxxxx",
  "product": "javaburn",
  "source_domain": "vitaflow.com",
  "referrer": "pinterest",
  "timestamp": "2026-07-01T12:00:00Z"
}
```

## 3. Fluxo de Salvamento no MinIO
1.  Os arquivos de criativos (imagens, vídeos) são enviados pelo painel local ou gerados e salvos no MinIO.
2.  O MinIO gera um link público (exposto via Cloudflare Tunnel) no formato: `https://media.seu-tunel.com/criativos/imagem_vsl1.webp`.
3.  Este link público é utilizado para preencher os payloads de upload de anúncios para o Facebook Ads (MOD-04) e Google Ads (MOD-05) e para as postagens orgânicas em redes sociais (MOD-11).

## 4. Estrutura do Banco de Dados Postgres (Social Posting)
Para gerenciar o auto-posting, usaremos duas tabelas adicionais no banco local Postgres:

### A. Tabela `social_posts`
```sql
CREATE TABLE social_posts (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- 'pinterest', 'instagram', 'tiktok', 'youtube'
    title VARCHAR(255),
    caption TEXT,
    destination_url VARCHAR(255), -- Link de afiliado com tags UTM
    media_url VARCHAR(255) NOT NULL, -- Link público do MinIO
    scheduled_at TIMESTAMP NOT NULL,
    posted_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'posted', 'failed'
    error_message TEXT
);
```

### B. Tabela `social_metrics`
```sql
CREATE TABLE social_metrics (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES social_posts(id) ON DELETE CASCADE,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    clicks INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. Integração com APIs de Redes Sociais
*   **Pinterest API:** Endpoint `/v5/pins` para criação de Pins com imagem ou vídeo.
*   **Instagram Content Publishing API:** Envia requisições de upload de mídia e criação de contêineres para posts do tipo Reel/Imagem.
*   **YouTube Data API v3:** Endpoint `/upload` definindo a flag de vídeo curto para a aba Shorts.
*   **TikTok Video Content API:** Endpoint de publicação direta para envio de vídeos curtos.
