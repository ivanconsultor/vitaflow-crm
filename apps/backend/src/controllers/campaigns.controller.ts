import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";

interface CampanhaInput {
  nome: string;
  produto: string;
  preco: number;
  inicio: string;
  fim: string;
  investimento_ads?: number;
  meta_vendas: number;
  vendas_realizadas?: number;
  faturamento_bruto?: number;
}

interface Campanha {
  id: string;
  nome: string;
  produto: string;
  preco: number;
  inicio: Date;
  fim: Date;
  investimento_ads: number;
  meta_vendas: number;
  vendas_realizadas: number;
  faturamento_bruto: number;
  criado_em: Date;
}

// Campanhas mockadas para fallback
const mockCampaigns: Campanha[] = [
  {
    id: "c1a1a1a1-1111-1111-1111-111111111111",
    nome: "Black Friday Nutraceuticos",
    produto: "Colageno Premium",
    preco: 97.00,
    inicio: new Date("2026-11-01T00:00:00Z"),
    fim: new Date("2026-11-30T23:59:59Z"),
    investimento_ads: 1500.00,
    meta_vendas: 100,
    vendas_realizadas: 45,
    faturamento_bruto: 4365.00,
    criado_em: new Date("2026-06-20T10:00:00Z"),
  },
];

export const getAllCampaigns = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (fastify.dbConnected) {
    try {
      const campaigns = await fastify.db.campanha.findMany({
        orderBy: { criado_em: "desc" },
        include: { emails: true }
      });
      return reply.send(campaigns);
    } catch (error) {
      fastify.log.error(error);
    }
  }

  // Fallback para mock
  return reply.send(mockCampaigns);
};

export const createCampaign = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: CampanhaInput }>,
  reply: FastifyReply
) => {
  const {
    nome,
    produto,
    preco,
    inicio,
    fim,
    investimento_ads = 0,
    meta_vendas,
    vendas_realizadas = 0,
    faturamento_bruto = 0
  } = request.body;

  if (!nome || !produto || !preco || !inicio || !fim || !meta_vendas) {
    return reply.status(400).send({ error: "Campos obrigatórios faltando." });
  }

  if (fastify.dbConnected) {
    try {
      const campaign = await fastify.db.campanha.create({
        data: {
          nome,
          produto: { connect: { id: produto } },
          inicio: new Date(inicio),
          fim: new Date(fim),
          investimento_ads_usd: investimento_ads,
          faturamento_bruto_usd: faturamento_bruto
        }
      });
      return reply.status(201).send(campaign);
    } catch (error) {
      fastify.log.error(error);
    }
  }

  // Fallback para mock
  const newCampaign = {
    id: uuidv4(),
    nome,
    produto,
    preco,
    inicio: new Date(inicio),
    fim: new Date(fim),
    investimento_ads,
    meta_vendas,
    vendas_realizadas,
    faturamento_bruto,
    criado_em: new Date()
  };

  mockCampaigns.push(newCampaign);
  return reply.status(201).send(newCampaign);
};
