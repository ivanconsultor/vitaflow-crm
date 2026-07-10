# Regras e Diretrizes para Agentes de IA - Sistema VitaFlow

Este arquivo define as diretrizes exclusivas para desenvolvimento e manutenção no ecossistema do **Sistema VitaFlow (CRM & Automações)**.

## 1. Ambiente Local de Desenvolvimento (Docker)
- **Local First:** Qualquer modificação de código, teste de banco de dados ou integração deve ser executado no ambiente de containers local (Postgres, Redis, n8n, MinIO).
- **Sem Deploy Direto:** Não realizar deploys ou conexões diretas a servidores de produção sem prévia homologação local.
- **Portas de Serviços:** Respeitar o mapeamento de portas locais e a exposição via túneis Cloudflare.

## 2. Padrões de Código e Integração
- **Expressões n8n:** Utilizar a sintaxe moderna de expressões do n8n (`$json`, `$node["NodeName"].json`).
- **Valores Padrão:** Nunca confiar em parâmetros padrão de nós. Configurar explicitamente todas as opções de autenticação, recursos e operações (especialmente em nós de HTTP Request, Postgres e Telegram).
- **Tratamento de Erros:** Todos os fluxos n8n devem possuir nós ou fluxos de tratamento de erro para notificar falhas no Telegram privado do operador.
- **MinIO:** Todas as URLs de arquivos de mídia passadas para APIs externas (Meta Graph, Google Ads) devem ser servidas por meio dos buckets públicos expostos do MinIO local.

## 3. Comunicação Site ↔ Sistema
- Lembre-se sempre de que o **Site** e o **Sistema** são projetos isolados no Windows.
- O site é apenas um front-end estático Vanilla (HTML/CSS/JS) rodando na Hostinger.
- O sistema é o back-end (Docker) rodando localmente.
- A comunicação entre ambos ocorre exclusivamente através de requisições de API de rede (Webhooks) expostas pelo Cloudflare Tunnel. Nunca tentar ler ou gravar arquivos diretamente da pasta de um projeto no outro via código do sistema.
