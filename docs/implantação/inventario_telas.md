# Inventário Visual e Mapeamento de Telas — VitaFlow CRM

Este documento é a **Trava de Segurança Visual** definitiva do sistema. Ele mapeia cada tela do CRM, seu respectivo arquivo de código e referências visuais, impedindo que futuros agentes de IA alterem ou simplifiquem as interfaces existentes ao realizar integrações de backend.

---

## Regra de Ouro (Blindagem Visual)
> [!IMPORTANT]
> **NÃO DESTRUA NEM SIMPLIFIQUE NENHUM LAYOUT.**
> Toda e qualquer integração com APIs, webhooks ou bancos de dados deve ocorrer por trás da interface gráfica, preservando 100% dos estilos, gráficos, tabelas e estruturas que o usuário projetou. Mantenha dados de simulação (mocks) como fallback para exibição caso as chaves de API não estejam configuradas.

---

## Mapeamento das Telas (Tela a Tela)

### 1. Login (Acesso Restrito)
* **Rota do Navegador**: `/login`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/login/page.tsx)
* **Descrição**: Tela de autenticação mestre do CRM para acesso seguro.
* **Credenciais de Desenvolvimento**: E-mail `admin@vitaflow.com` / Senha `vitaflow2026`.

### 2. CRM & Leads Hub (Painel de Vendas e Kanban)
* **Rota do Navegador**: `/crm`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/crm/page.tsx)
* **Visual de Referência**: ![Leads Hub](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/crm_leads_1783641447707.png)
* **Descrição**: Gerenciamento de leads ativos com colunas detalhadas por status de funil e métricas de conversão.

### 3. Kanban de Prospectos
* **Rota do Navegador**: `/prospectos`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/prospectos/page.tsx)
* **Visual de Referência**: ![Kanban Prospectos](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/kanban_prospectos_1783641453010.png)
* **Descrição**: Visualização em colunas Kanban (Método de 4Cs de cores) para arrastar e gerenciar prospectos.

### 4. Ads Analytics (Painel de Tráfego)
* **Rota do Navegador**: `/ads`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/ads/page.tsx)
* **Visual de Referência**: ![Ads Analytics](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/ads_panel_1783643829858.png)
* **Descrição**: Painel rico de tráfego com gráficos Recharts de dupla linha (gasto/conversoes), KPIs e acordeões de detalhamento diário de Leads, Aplicações e Vendas.

### 5. Ranking e IA de Criativos
* **Rota do Navegador**: `/ads/criativos`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/ads/criativos/page.tsx)
* **Visual de Referência**: ![IA Criativos](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/criativos_panel_1783643854705.png)
* **Descrição**: Tela para testar ganchos (hooks) e gerar scripts de VSL/Advertorials com IA do Claude, com botão para subir campanhas pausadas direto no Meta/Google.

### 6. OKR Dashboard
* **Rota do Navegador**: `/c1`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/c1/page.tsx)
* **Visual de Referência**: ![OKR Dashboard](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/dashboard_okr_1783641442171.png)
* **Descrição**: Acompanhamento de objetivos estratégicos e resultados-chave do negócio digital.

### 7. CFO Virtual
* **Rota do Navegador**: `/c2`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/c2/page.tsx)
* **Visual de Referência**: ![CFO Virtual](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/cfo_virtual_1783641464505.png)
* **Descrição**: Visualização e inteligência financeira para controle de despesas de anúncios e receitas de afiliados.

### 8. Calendário Editorial & Conteúdo
* **Rota do Navegador**: `/editorial`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/editorial/page.tsx)
* **Visual de Referência**: ![Conteúdo e Calendário](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/criacao_conteudo_1783641470911.png)
* **Descrição**: Agendamento de postagens e e-mails de campanhas em formato de calendário interativo.

### 9. Central de Integrações
* **Rota do Navegador**: `/integracoes`
* **Arquivo Físico**: [page.tsx](file:///c:/Users/ivanc/Documents/Antigraviry/AG%2005%20Web/AG%2003.1%20Sistema%20VitaFlow/apps/frontend/src/app/integracoes/page.tsx)
* **Visual de Referência**: ![Integrações](file:///C:/Users/ivanc/.gemini/antigravity-ide/brain/827dc94d-4501-4f90-b30e-13e758901f08/integracoes_grid_1783628924655.png)
* **Descrição**: Grade visual para configurar e monitorar o status das conexões (WhatsApp, Telegram, ClickBank, Twilio, SendGrid, etc.).
