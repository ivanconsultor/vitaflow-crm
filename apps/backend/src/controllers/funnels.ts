import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";

interface FunnelStepInput {
  nome: string;
  meta_conversao: number;
  conversao_atual?: number;
  quantidade?: number;
}

interface FunnelInput {
  nome: string;
  tipo: string;
  ativo?: boolean;
  etapas?: FunnelStepInput[];
}

const mockFunnels = [
  {
    id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1",
    nome: "Funil de Vendas Nutraceuticos EUA",
    tipo: "afiliado",
    ativo: true,
    etapas: [
      {
        id: "e1e1e1e1-1e1e-1e1e-1e1e-e1e1e1e1e1e1",
        nome: "Visitante",
        meta_conversao: 100.0,
        conversao_atual: 100.0,
        quantidade: 10000,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "e2e2e2e2-2e2e-2e2e-2e2e-e2e2e2e2e2e2",
        nome: "Cadastro Isca/Quiz (C2)",
        meta_conversao: 35.0,
        conversao_atual: 38.2,
        quantidade: 3820,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "e3e3e3e3-3e3e-3e3e-3e3e-e3e3e3e3e3e3",
        nome: "Cliques no Link Afiliado (C3)",
        meta_conversao: 15.0,
        conversao_atual: 12.5,
        quantidade: 477,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "e4e4e4e4-4e4e-4e4e-4e4e-e4e4e4e4e4e4",
        nome: "Vendas Nutraceutico (C4)",
        meta_conversao: 2.0,
        conversao_atual: 2.5,
        quantidade: 12,
        funil_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      }
    ]
  },
  {
    id: "f2f2f2f2-2f2f-2f2f-2f2f-f2f2f2f2f2f2",
    nome: "Funil Newsletter Semanal",
    tipo: "newsletter",
    ativo: true,
    etapas: [
      {
        id: "e5e5e5e5-5e5e-5e5e-5e5e-e5e5e5e5e5e5",
        nome: "Inscritos",
        meta_conversao: 100.0,
        conversao_atual: 100.0,
        quantidade: 1500,
        funil_id: "f2f2f2f2-2f2f-2f2f-2f2f-f2f2f2f2f2f2"
      },
      {
        id: "e6e6e6e6-6e6e-6e6e-6e6e-e6e6e6e6e6e6",
        nome: "Abertura Newsletter (C3)",
        meta_conversao: 30.0,
        conversao_atual: 34.5,
        quantidade: 518,
        funil_id: "f2f2f2f2-2f2f-2f2f-2f2f-f2f2f2f2f2f2"
      }
    ]
  }
];

export const getAllFunnels = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (fastify.dbConnected) {
    try {
      const funnels = await fastify.db.funil.findMany({
        include: { etapas: true },
        orderBy: { nome: "asc" }
      });
      if (funnels && funnels.length > 0) {
        return reply.send(funnels);
      }
    } catch (error) {
      fastify.log.error(error);
    }
  }

  // Fallback para mock
  return reply.send(mockFunnels);
};

export const createFunnel = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: FunnelInput }>,
  reply: FastifyReply
) => {
  const { nome, tipo, ativo = true, etapas = [] } = request.body;

  if (!nome || !tipo) {
    return reply.status(400).send({ error: "Nome e tipo sao obrigatorios." });
  }

  if (fastify.dbConnected) {
    try {
      const funnel = await fastify.db.funil.create({
        data: {
          nome,
          tipo,
          ativo,
          etapas: {
            create: etapas.map((e) => ({
              nome: e.nome,
              meta_conversao: e.meta_conversao,
              conversao_atual: e.conversao_atual || 0,
              quantidade: e.quantidade || 0
            }))
          }
        },
        include: { etapas: true }
      });
      return reply.status(201).send(funnel);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Erro ao criar funil." });
    }
  }

  // Fallback para mock
  const funnelId = uuidv4();
  const createdSteps = etapas.map((e) => ({
    id: uuidv4(),
    nome: e.nome,
    meta_conversao: e.meta_conversao,
    conversao_atual: e.conversao_atual || 0,
    quantidade: e.quantidade || 0,
    funil_id: funnelId
  }));

  const newFunnel = {
    id: funnelId,
    nome,
    tipo,
    ativo,
    etapas: createdSteps
  };

  mockFunnels.push(newFunnel);
  return reply.status(201).send(newFunnel);
};

export const deleteFunnel = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (fastify.dbConnected) {
    try {
      await fastify.db.etapaFunil.deleteMany({ where: { funil_id: id } });
      await fastify.db.funil.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(404).send({ error: "Funil nao encontrado." });
    }
  }

  // Fallback para mock
  const funnelIndex = mockFunnels.findIndex((f) => f.id === id);
  if (funnelIndex === -1) {
    return reply.status(404).send({ error: "Funil nao encontrado." });
  }

  mockFunnels.splice(funnelIndex, 1);
  return reply.status(204).send();
};
