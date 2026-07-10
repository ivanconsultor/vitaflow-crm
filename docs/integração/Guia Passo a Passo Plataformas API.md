# Guia Passo a Passo — Plataformas API (Credenciais & Cloudflare Tunnel)

Este guia prático fornece o passo a passo para você obter as credenciais reais de produção das suas contas e expor o seu servidor local para a internet usando o **Cloudflare Tunnel**, permitindo que as plataformas gringas (ClickBank, BuyGoods, etc.) enviem postbacks diretamente para a sua máquina.

---

## 1. Como Obter e Configurar as Credenciais Reais no `.env`

Você precisará editar o arquivo `.env` localizado na raiz do projeto e em `apps/backend/` com as seguintes informações:

### 1.1. Bot do Telegram (Alertas de Ads)
1. No Telegram, converse com o bot oficial `@BotFather`.
2. Envie o comando `/newbot` e defina o nome e o username para o seu bot.
3. Copie o token gerado e salve no `.env` em `TELEGRAM_BOT_TOKEN`.
4. Para obter o `TELEGRAM_CHAT_ID`:
   * Envie uma mensagem inicial para o seu bot criado.
   * Acesse no seu navegador a URL: `https://api.telegram.org/bot<SEU_TELEGRAM_BOT_TOKEN>/getUpdates`
   * No JSON de resposta, localize o ID correspondente ao seu chat (ex: `"chat":{"id":123456789}`). Copie este número e salve no seu `.env` em `TELEGRAM_CHAT_ID`.

### 1.2. Facebook Ads (Meta API) & Google Ads API
* **Meta/Facebook Ads**:
  1. Acesse o portal `developers.facebook.com`, crie uma conta de desenvolvedor e crie um App Empresarial (Business).
  2. Adicione o produto **Marketing API** ao seu App.
  3. No painel, vá em Ferramentas e gere um **Token de Acesso de Longa Duração** (System User Access Token) contendo a permissão `ads_read`. Salve em `META_ACCESS_TOKEN`.
  4. Salve o ID da sua Conta de Anúncios (sempre precedido por `act_`, ex: `act_1234567890`) no seu `.env` em `META_AD_ACCOUNT_ID`.
* **Google Ads**:
  1. Na sua conta de administrador (MCC) do Google Ads, vá em "Ferramentas e Configurações" -> "Central de APIs" e solicite o seu **Token de Desenvolvedor**. Salve em `GOOGLE_ADS_DEVELOPER_TOKEN`.
  2. No Google Cloud Console, crie um projeto e configure as credenciais de ID do Cliente OAuth 2.0. Salve em `GOOGLE_ADS_CLIENT_ID` e `GOOGLE_ADS_CLIENT_SECRET`.
  3. Utilize o OAuth Playground do Google ou um script de geração para obter o seu **Refresh Token** de longa duração autorizando o escopo de AdWords. Salve em `GOOGLE_ADS_REFRESH_TOKEN`.
  4. Salve o ID de cliente da sua conta de anúncios (ex: `1234567890`) em `GOOGLE_ADS_CUSTOMER_ID`.

### 1.3. Twilio (SMS) & SendGrid (E-mail)
* **Twilio (SMS)**:
  1. Crie uma conta em `twilio.com`.
  2. No painel principal (Console), copie o seu `Account SID` e o `Auth Token`. Salve-os em `TWILIO_ACCOUNT_SID` e `TWILIO_AUTH_TOKEN`.
  3. Compre um número de telefone com capacidade de SMS na aba de Numbers e salve-o em `TWILIO_FROM_NUMBER`.
* **SendGrid (E-mail)**:
  1. Crie uma conta em `sendgrid.com`.
  2. Vá em "Settings" -> "API Keys", crie uma chave de API com permissão de envio (Mail Send). Salve-a em `SENDGRID_API_KEY`.

### 1.4. Systeme.io
1. Acesse as configurações da sua conta no Systeme.io.
2. Vá em "Chaves de API públicas", gere uma chave de API e cole em `SYSTEMEIO_API_KEY`.
3. Crie uma campanha de e-mail de recuperação de checkout no seu Systeme.io e salve a ID dela no código (por padrão está configurada no serviço como `"recuperacao_camp"`).

---

## 2. Como Expor o CRM Local à Internet usando o Cloudflare Tunnel (cloudflared)

Como o seu servidor está rodando em `localhost:3001`, as redes de afiliados dos EUA (ClickBank, BuyGoods, etc.) não conseguem enviar requisições de webhook para a sua máquina de forma direta. A melhor forma profissional e gratuita de resolver isso sem abrir portas no seu roteador é utilizando o **Cloudflare Tunnel**.

### Passo 1: Instalação do Cloudflared
Baixe e instale a ferramenta de linha de comando da Cloudflare (`cloudflared`) correspondente ao seu sistema operacional:
* No Windows, você pode baixar o executável oficial em: `https://github.com/cloudflare/cloudflared/releases` ou usar o gerenciador de pacotes do Windows executando no PowerShell:
  ```powershell
  winget install cloudflare.cloudflared
  ```

### Passo 2: Login na sua Conta Cloudflare
Autentique o terminal com o seu domínio cadastrado na Cloudflare executando:
```bash
cloudflared tunnel login
```
*Uma janela do navegador será aberta. Selecione o domínio que deseja usar e autorize o acesso.*

### Passo 3: Criar o Túnel Seguro
Crie o túnel executando o comando abaixo (substitua `vitaflow-tunnel` pelo nome de sua preferência):
```bash
cloudflared tunnel create vitaflow-tunnel
```
*Este comando retornará um arquivo de credenciais JSON e a ID única do seu túnel.*

### Passo 4: Mapear o DNS para o Túnel
Direcione um subdomínio seu para apontar para o túnel criado (substitua `api.seudominio.com` pelo seu subdomínio real):
```bash
cloudflared tunnel route dns vitaflow-tunnel api.seudominio.com
```

### Passo 5: Rodar o Túnel Direcionado para o Backend
Inicie o túnel mapeando todo o tráfego que bate na Cloudflare direto para a porta do seu backend Fastify (`localhost:3001`):
```bash
cloudflared tunnel run --url http://localhost:3001 vitaflow-tunnel
```

---

## 3. Como Testar e Configurar os Webhooks nas Redes de Afiliados

Com o túnel rodando, o seu backend Fastify local passa a ser acessível publicamente via `https://api.seudominio.com`. Agora você pode configurar os webhooks:

1. **ClickBank**:
   * No painel da ClickBank, vá em "Vendor Settings" -> "My Site" -> "Instant Notification Services".
   * Cadastre a URL: `https://api.seudominio.com/api/webhooks/clickbank`.
   * Insira a chave secreta gerada pela ClickBank no seu `.env` na variável `WEBHOOK_SECRET_CLICKBANK`.
2. **BuyGoods**:
   * Solicite ao gerente de contas da BuyGoods para cadastrar a URL de Postback:
     `https://api.seudominio.com/api/webhooks/buygoods`.
   * Insira o token secreto da BuyGoods no seu `.env` na variável `WEBHOOK_SECRET_BUYGOODS`.
3. **Outras Redes (Digistore24, MaxWeb, GuruMedia)**:
   * Siga o mesmo procedimento cadastrando a URL correspondente (ex: `https://api.seudominio.com/api/webhooks/digistore24`) e preenchendo as variáveis de chave secreta no `.env`.
