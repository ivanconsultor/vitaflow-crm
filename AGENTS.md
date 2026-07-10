# Regras do Projeto - Sistema VitaFlow

Este subprojeto tem regras exclusivas e independentes:

## Inicialização do Sistema (Frontend e Backend)
Sempre que for necessário iniciar o servidor ou testar funcionalidades no VitaFlow, siga estes padrões:
- **Frontend**: Rodar `npm run dev` na pasta `apps/frontend` (Porta/Acesso: `http://localhost:3005`).
- **Backend**: Rodar `npm run dev` na pasta `apps/backend` (Porta/Acesso: `http://localhost:3001`).
- **Verificação Proativa**: Garanta que o frontend e o backend estejam rodando em background antes de testar para evitar falhas de API (fetch errors).

## Identidade Visual e UI
- **Tema Escuro Premium**: Exclusivo Dark Mode sofisticado.
- **CRM e Lead Management**: Leads organizados em tabelas e prospectos exibidos em formato Kanban, usando o método de 4Cs de cores.

<RULE[dashboard_fidelity]>
Sempre que o usuário fornecer imagens de referência para a construção de um Dashboard ou tela (ex: Dashboard CVS):
1. O agente DEVE mapear e implementar **todas as abas, sub-abas e botões de navegação** visíveis na interface (ex: Consolidado, Workshop, Inteligência, Aula ao Vivo). Não abrevie.
2. Nenhuma aba ou seção visual deve ser omitida para poupar tempo. O agente deve garantir que a navegação interna da página cubra 100% das visões mostradas nas referências.
3. O agente deve se atentar a detalhes estruturais (como a barra superior de métricas "Compras Confirmadas / Order Bump" que deve preceder as tabelas de inteligência).
</RULE[dashboard_fidelity]>

<RULE[no_destruction]>
REGRA CRÍTICA DE INTEGRAÇÃO: O agente é TERMINANTEMENTE PROIBIDO de deletar, simplificar, ocultar ou destruir qualquer layout, design, acordeão, botão, aba ou estrutura de frontend pré-existente para implementar qualquer integração de backend (APIs, webhooks, N8N, bancos de dados, etc.). 
Qualquer integração de dados dinâmicos DEVE ser injetada de forma cirúrgica e invisível dentro do design original rico que o usuário já construiu e testou, mantendo fallbacks estáticos para preservar a integridade visual intacta em qualquer circunstância.
</RULE[no_destruction]>
