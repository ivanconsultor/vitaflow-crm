# Descobertas e Restricoes - Sistema de Gestao de Negocio Digital com IA

## 1. Restricoes de Ambiente e Diretórios
* **Diretorio do Projeto:** O projeto deve ser desenvolvido e gerenciado estritamente na pasta `C:\Users\Administrador\Documents\Antigravity\AG 09 Projetos\AG 02 Sistema`.
* **Ambiente Local:** O backend e o frontend rodam localmente, comunicando-se via HTTP/REST.
* **Docker Compose:** O banco de dados PostgreSQL e o Redis serao executados via Docker Compose localmente.

## 2. Restricoes de APIs e Dependências
* **Meta Ads API:** Exige tokens de acesso de longa duracao (Long-lived tokens) e revisao de aplicativo.
* **Systeme.io:** A integracao de contatos e tags deve utilizar a chave de API fornecida na variavel `SYSTEMEIO_API_KEY`.
* **Twilio (SMS nos EUA):** O envio de SMS nos EUA requer registro A2P 10DLC aprovado para evitar bloqueios de operadoras.
* **LangChain JS:** A analise automatica de tráfego dependera de chamadas de ferramentas estruturadas integrando o modelo GPT-4o da OpenAI.
* **Prisma CLI e Monorepo:** Para comandos locais do Prisma CLI (como `validate` ou `migrate`) funcionarem de forma independente na pasta `apps/backend/`, e necessario um arquivo `.env` local contendo a variavel `DATABASE_URL` apontando para o host `localhost`. O `.env` da raiz continua sendo a referencia principal para a orquestracao via Docker Compose (onde o host do banco de dados e `postgres`).

## 3. Diretrizes de Codificacao
* **Sem Emojis:** Fica proibido o uso de emojis no sistema, logs e documentacao.
* **Fastify 5.x:** Utilizar a versao mais recente do Fastify no backend.
* **Vanilla CSS:** Toda estilizacao no frontend Next.js deve ser modularizada e baseada em CSS customizado (evitando frameworks como Tailwind CSS no projeto "Sistema" de acordo com a stack do SPEC que indica "Recharts · Tailwind CSS · Dark Mode" mas nas especificacoes do modulo 5 diz "Vanilla CSS / CSS Modules: Toda a estilizacao sera feita utilizando arquivos .module.css dedicados... dispensando frameworks utilitarios como Tailwind CSS").
  * *Observacao:* O SPEC do "Sistema de Gestao de Negocio Digital" menciona no diagrama e na stack "Tailwind CSS", mas no texto tambem fala de Vanilla CSS. Seguiremos a orientacao de usar Tailwind CSS se estiver na stack principal e no layout do Next.js, mantendo a consistência do design dark.
