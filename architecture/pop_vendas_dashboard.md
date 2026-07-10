# POP: Dashboard de Vendas (Campanhas CVS)

## 1. Objetivo
Apresentar de forma analítica e gerencial todas as Campanhas de Vendas Semanais (CVS) e Funis de Produtos High-Ticket, garantindo que o faturamento bruto, líquido, variações percentuais e métricas de funil (Open Rate, CTR) sejam visualizados com precisão e clareza.

## 2. Entradas de Dados (Mocks Iniciais)
- As entradas devem respeitar estritamente o Schema JSON definido em `gemini.md` (Seção 1.4).
- O backend Mock fornecerá agrupamentos lógicos de tempo (ex: "Jan 2026", "Fev 2026") e as métricas calculadas ou pré-definidas (Faturamento Bruto = Vendas * Preço).

## 3. Lógica de UI / Regras de Negócio (Frontend)
- **Tabela CVS (Visão Planilha)**:
  - O agrupamento mensal ("MÊS") funciona como um header de linha expansível (ou fixo), contendo o totalizador de campanhas daquele mês.
  - Variações Percentuais (VAR %): Positivas em Verde, Negativas em Vermelho.
  - Status: "Concluída" (badge verde text-only ou outline), "Planejada" (badge roxa outline).
- **Métricas VDN (Inteligência de E-mail)**:
  - Exibe um funil de conversão linear (Jornada do Cliente) baseado em % decrescente.
  - Barras horizontais de CTR (Rosa/Pink) e Open Rate (Roxo).

## 4. Casos de Borda (Edge Cases)
- Campanhas com 0 vendas devem evitar divisões por zero nas colunas de "Margem Líquida".
- O Modal de "Nova Campanha" deve bloquear submissão se campos obrigatórios (Código, Produto) estiverem em branco.

## 5. Invariantes
- A página *NUNCA* usa fundo branco; o background será o Dark Mode premium `#0F111A` ou `#131520`.
- É proibido o uso de emojis, com exceção de contextos pré-aprovados, mas de forma geral a regra 2.2 de `gemini.md` barra emojis.
