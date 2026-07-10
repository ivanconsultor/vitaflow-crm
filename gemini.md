# Constituicao do Projeto - Sistema de Gestao de Negocio Digital com IA

## 1. Esquemas de Dados (Schemas)

### 1.1 Leads (CRM)
Esquema JSON para criacao e atualizacao de leads.
* **Input JSON (POST /api/leads):**
```json
{
  "nome": "String (obrigatorio)",
  "email": "String (obrigatorio, unico)",
  "telefone": "String (opcional)",
  "messenger_id": "String (opcional)",
  "status": "String (opcional, padrao: 'lead', valores: 'lead' | 'cliente' | 'inativo')",
  "segmento_email": "String (opcional, padrao: 'investigador', valores: 'vazio' | 'investigador' | 'regular' | 'ativo' | 'leal')",
  "fonte_captacao": "String (opcional)",
  "tags": "Array of Strings (opcional)",
  "notas": "String (opcional)"
}
```

* **Output JSON (GET /api/leads):**
```json
{
  "id": "String (UUID)",
  "nome": "String",
  "email": "String",
  "telefone": "String | null",
  "messenger_id": "String | null",
  "status": "String",
  "segmento_email": "String",
  "fonte_captacao": "String | null",
  "data_cadastro": "String (ISO DateTime)",
  "ultima_interacao": "String (ISO DateTime) | null",
  "tags": ["String"],
  "notas": "String | null"
}
```

### 1.2 OKRs (Metas e Resultados-Chave)
* **Input JSON (POST /api/okrs):**
```json
{
  "periodo": "String (obrigatorio, ex: 'Q1_2026', 'mensal')",
  "objetivo": "String (obrigatorio)",
  "area": "String (obrigatorio, ex: 'Marketing', 'Vendas', 'Financeiro')",
  "resultados": [
    {
      "metrica": "String (obrigatorio)",
      "meta": "Float (obrigatorio)",
      "atual": "Float (obrigatorio)",
      "unidade": "String (obrigatorio, ex: 'USD', 'unidades', '%')",
      "status": "String (opcional, padrao: 'no_prazo', valores: 'no_prazo' | 'atrasado' | 'concluido')"
    }
  ]
}
```

* **Output JSON (GET /api/okrs):**
```json
{
  "id": "String (UUID)",
  "periodo": "String",
  "objetivo": "String",
  "area": "String",
  "criado_em": "String (ISO DateTime)",
  "resultados": [
    {
      "id": "String (UUID)",
      "metrica": "String",
      "meta": "Float",
      "atual": "Float",
      "unidade": "String",
      "status": "String",
      "okr_id": "String (UUID)"
    }
  ]
}
```

### 1.3 Funis (FuNews)
* **Input JSON (POST /api/funnels):**
```json
{
  "nome": "String (obrigatorio)",
  "tipo": "String (obrigatorio, valores: 'newsletter' | 'isca' | 'treinamento' | 'servico' | 'afiliado')",
  "ativo": "Boolean (opcional, padrao: true)",
  "etapas": [
    {
      "nome": "String (obrigatorio)",
      "meta_conversao": "Float (obrigatorio, percentual)",
      "conversao_atual": "Float (opcional, padrao: 0)",
      "quantidade": "Int (opcional, padrao: 0)"
    }
  ]
}
```

* **Output JSON (GET /api/funnels):**
```json
{
  "id": "String (UUID)",
  "nome": "String",
  "tipo": "String",
  "ativo": "Boolean",
  "etapas": [
    {
      "id": "String (UUID)",
      "nome": "String",
      "meta_conversao": "Float",
      "conversao_atual": "Float",
      "quantidade": "Int",
      "funil_id": "String (UUID)"
    }
  ]
}
```

### 1.4 Vendas (Campanhas CVS)
* **Input JSON (POST /api/vendas/campanhas):**
```json
{
  "nome": "String (obrigatorio)",
  "codigo": "String (obrigatorio)",
  "categoria": "String (obrigatorio)",
  "data_inicio": "String (ISO Date, obrigatorio)",
  "data_fim": "String (ISO Date, obrigatorio)",
  "status": "String (obrigatorio, valores: 'Planejada' | 'Concluida')",
  "link_metricas": "String (opcional)",
  "preco": "Float (obrigatorio)",
  "investimento_ads": "Float (obrigatorio)",
  "gateway": "String (obrigatorio, ex: 'InfinitePay (4.99%)')",
  "imposto_renda_pct": "Float (obrigatorio)",
  "vendas_estimadas": "Int (opcional)",
  "vendas_reais": "Int (opcional)",
  "possui_order_bump": "Boolean (obrigatorio)"
}
```

* **Output JSON (GET /api/vendas/campanhas):**
```json
{
  "id": "String (UUID)",
  "mes_agrupamento": "String (ex: 'Jan 2026')",
  "nome": "String",
  "codigo": "String",
  "categoria": "String",
  "dias": "Int",
  "data_inicio": "String",
  "data_fim": "String",
  "preco": "Float",
  "vendas_realizadas": "Int",
  "vendas_estimadas": "Int",
  "variacao_pct": "Float",
  "diferenca_valor": "Float",
  "faturamento_bruto": "Float",
  "fatura": "Float",
  "order_bump": "Float",
  "anuncio": "Float",
  "imposto_renda": "Float",
  "custo_gateway": "Float",
  "faturamento_liquido": "Float",
  "sua_parte_pct": "Float",
  "lucro_liquido": "Float",
  "margem_liquida": "Float",
  "status": "String"
}
```

---

## 2. Regras Comportamentais do Sistema

### 2.1 Interface e Visual
1. O design do frontend Next.js deve seguir o esquema de Dark Mode como padrao estrito.
2. A paleta de cores deve utilizar as seguintes Custom Properties (CSS Variables):
   * Fundo principal: Preto ou Azul Marinho escuro.
   * Destaques de IA: Roxo (#A855F7).
   * KPIs Positivos: Azul Eletrico (#3B82F6).
   * Acoes e Call-to-Actions (CTAs): Amarelo Dourado (#FACC15).
   * Metas Atingidas / Sucesso: Verde (#22C55E).
   * Alertas / Performance abaixo da meta: Vermelho (#EF4444).
3. Todas as acoes principais do dashboard devem ser acessiveis com no maximo um clique.

### 2.2 Proibicao de Emojis
1. Fica expressamente proibido o uso de emojis em toda a interface do usuario (frontend), em qualquer log de backend e em toda a documentacao tecnica interna do sistema.

### 2.3 IA (LangChain Agent)
1. O tom de voz da IA em todas as recomendacoes e relatorios gerados deve ser estritamente profissional, tecnico e analitico, focado de forma objetiva em ROAS e CPA.
2. A IA nao deve fazer suposicoes vazias; se houver falta de dados, a IA devera relatar que os dados estao incompletos e indicar as metricas ausentes.

---

## 3. Invariantes Arquiteturais

1. **Separacao de Responsabilidades:** O projeto deve ser estruturado como monorepo. O frontend (Next.js) e o backend (Fastify 5.x) devem residir em pastas isoladas (`apps/frontend` e `apps/backend`).
2. **Seguranca de Chaves:** Nenhuma chave de API ou credencial deve ser versionada no Git. O arquivo `.env` na raiz do projeto deve centralizar todas as credenciais e ser adicionado ao `.gitignore`.
3. **Persistencia de Dados:** Todas as consultas e escritas de banco de dados devem passar pelo Prisma ORM com tipagem estrita (TypeScript), utilizando as tabelas definidas em `schema.prisma`.
4. **Determinismo:** Toda a logica de roteamento, validacao e execucao de tarefas deve ser deterministica. O agente de IA deve ser invocado em endpoints dedicados que retornem payloads estruturados.
5. **Rate Limiting e Cache:** Chamadas externas para APIs de anuncios (Meta e Google Ads) devem passar por uma camada de cache via Redis para evitar limites de requisicoes (Rate Limiting).
6. **Seguranca de Webhooks de Afiliados:** Todas as rotas de postback de afiliados (ClickBank, BuyGoods, Digistore24, MaxWeb e GuruMedia) devem obrigatoriamente validar tokens secretos de autenticacao. As chaves devem vir das variaveis de ambiente correspondentes.
