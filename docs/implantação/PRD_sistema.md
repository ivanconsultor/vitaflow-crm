# Product Requirements Document (PRD) — Sistema VitaFlow (CRM & Automações)

## 1. Visão Geral (Overview)
O **Sistema VitaFlow** é a inteligência de back-end e atendimento local do ecossistema. Ele centraliza a captura de leads, automação de mensagens, gerenciamento de contatos, relatórios de anúncios e postagens orgânicas em mídias sociais em um ambiente local robusto (Docker) e seguro, que se comunica com o site front-end e com as plataformas de anúncios e redes sociais de forma determinística.

## 2. Pontos de Comunicação com o Site
Embora o Site VitaFlow (USA) e o Sistema VitaFlow sejam projetos independentes, eles se comunicam ativamente nos seguintes pontos:
1.  **Redirecionamento de Tráfego:** As publicações orgânicas nas redes sociais (Pinterest, Instagram, TikTok, YouTube Shorts) geradas automaticamente pelo sistema contêm links com parâmetros UTM direcionados para as páginas de Presell e Hub do site.
2.  **Captura de Leads (Se aplicável):** Formulários de contato ou ofertas de e-books em landing pages secundárias enviam os dados de leads para os webhooks do **n8n** expostos via Cloudflare Tunnel.
3.  **Chat de Atendimento:** O widget do Chatwoot (se configurado) roda nas páginas do site para que leads americanos conversem em tempo real com atendentes ou com o robô (Typebot).

## 3. Requisitos de Integração e Fluxos
*   **Comunicação Externa (Clientes USA):** Envio de SMS e e-mails de marketing e transacionais via Twilio e Systeme.io. Triagem e conversas via Facebook Messenger conectadas ao Chatwoot/Typebot.
*   **Comunicação Interna (Equipe/Operador):** Envio de alertas urgentes de ROAS, relatórios diários de performance de anúncios e alertas do sistema diretamente para o Telegram privado do operador.
*   **Armazenamento de Mídias:** Persistência local de mídias de criativos, áudio e vídeo no MinIO para serem disponibilizados externamente via links públicos do Cloudflare Tunnel.
*   **Automação de Postagens Orgânicas (Auto-Posting):**
    *   O sistema deve orquestrar publicações agendadas no Pinterest, Instagram Reels, YouTube Shorts e TikTok.
    *   O n8n deve monitorar e coletar estatísticas de engajamento (views, curtidas, cliques) dessas postagens diariamente.
    *   Esses dados devem ser salvos no Postgres local para exibição no painel de controle do CRM.

## 4. Diretrizes de Governança
*   Toda a inteligência do sistema deve rodar localmente no Docker sob túneis do Cloudflare antes de ser sincronizada no Git/GitHub ou implantada no staging.
