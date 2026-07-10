import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";

// Mock das Vendas para alimentar o Dashboard Kanban e Visao Geral
export const mockVendas = [
  {
    id: uuidv4(),
    transacao_id: "T1001",
    produto_nome: "Colágeno Premium US",
    plataforma: "BuyGoods",
    valor_comissao_usd: 120.50,
    tipo_evento: "SALE",
    email_cliente: "mary.jane@email.com",
    data_venda: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) // 1 dia atrás
  },
  {
    id: uuidv4(),
    transacao_id: "T1002",
    produto_nome: "Nutra Brain Support",
    plataforma: "ClickBank",
    valor_comissao_usd: 97.00,
    tipo_evento: "SALE",
    email_cliente: "robert.s@email.com",
    data_venda: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 dias atrás
  },
  {
    id: uuidv4(),
    transacao_id: "T1003",
    produto_nome: "Colágeno Premium US",
    plataforma: "BuyGoods",
    valor_comissao_usd: 120.50,
    tipo_evento: "SALE",
    email_cliente: "julia.w@email.com",
    data_venda: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 dias atrás
  },
  {
    id: uuidv4(),
    transacao_id: "T1004",
    produto_nome: "Prostate Health Master",
    plataforma: "Digistore24",
    valor_comissao_usd: 85.00,
    tipo_evento: "SALE",
    email_cliente: "michael.b@email.com",
    data_venda: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
  }
];

export const getVendas = (fastify: FastifyInstance) => async (request: FastifyRequest, reply: FastifyReply) => {
  if (fastify.dbConnected) {
    try {
      // Tentar pegar do DB real caso esteja conectado
      const vendasDB = await fastify.db.vendaAfiliado.findMany({
        include: { produto: true },
        orderBy: { data_venda: 'desc' }
      });
      
      const vendasFormatadas = vendasDB.map((v: any) => ({
        id: v.id,
        transacao_id: v.transacao_id,
        produto_nome: v.produto.nome,
        plataforma: v.produto.plataforma,
        valor_comissao_usd: v.valor_comissao_usd,
        tipo_evento: v.tipo_evento,
        email_cliente: v.email_cliente,
        data_venda: v.data_venda
      }));
      
      return reply.status(200).send(vendasFormatadas.length > 0 ? vendasFormatadas : mockVendas);
    } catch (error) {
      fastify.log.error(error);
      // Fallback para mock
    }
  }

  // Retorna os Mocks
  return reply.status(200).send(mockVendas);
};

export const getVendasInsights = (fastify: FastifyInstance) => async (request: FastifyRequest, reply: FastifyReply) => {
  const { analisarVendasCVS } = await import("../services/ai/agent.js");
  const apiKey = process.env.OPENAI_API_KEY || "sk-proj-placeholder";
  
  let dadosParaAnalise: any[] = mockVendas;
  
  if (fastify.dbConnected) {
    try {
      const vendasDB = await fastify.db.vendaAfiliado.findMany({
        include: { produto: true },
        orderBy: { data_venda: 'desc' },
        take: 50 // Limita o payload para não estourar o token limit da OpenAI
      });
      if (vendasDB.length > 0) {
        dadosParaAnalise = vendasDB.map((v: any) => ({
          transacao_id: v.transacao_id,
          produto_nome: v.produto.nome,
          plataforma: v.produto.plataforma,
          valor_comissao_usd: v.valor_comissao_usd
        }));
      }
    } catch (error) {
      fastify.log.error(error);
    }
  }

  const analysis = await analisarVendasCVS(dadosParaAnalise, apiKey);

  return reply.status(200).send({
    success: true,
    insights: analysis
  });
};
