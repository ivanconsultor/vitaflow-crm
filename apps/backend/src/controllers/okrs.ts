import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";

interface KeyResultInput {
  metrica: string;
  meta: number;
  atual: number;
  unidade: string;
  status?: string;
}

interface OkrInput {
  periodo: string;
  objetivo: string;
  area: string;
  resultados?: KeyResultInput[];
}

const mockOkrs = [
  {
    id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1",
    periodo: "Q1",
    objetivo: "Financeiro", // Will be used as the Area group, or we can just group by area
    area: "Financeiro",
    criado_em: new Date("2026-01-01T00:00:00Z"),
    resultados: [
      {
        id: "kr-fin-1",
        metrica: "Faturar R$ 100.000",
        meta: 100000.0,
        atual: 118282.0,
        unidade: "R$",
        status: "concluido",
        okr_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "kr-fin-2",
        metrica: "Lucrar R$50k",
        meta: 50000.0,
        atual: 78352.0,
        unidade: "R$",
        status: "concluido",
        okr_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      },
      {
        id: "kr-fin-3",
        metrica: "Retirada Sócios 40k",
        meta: 40000.0,
        atual: 60000.0,
        unidade: "R$",
        status: "concluido",
        okr_id: "f1f1f1f1-1f1f-1f1f-1f1f-f1f1f1f1f1f1"
      }
    ]
  },
  {
    id: "m1m1m1m1-1m1m-1m1m-1m1m-m1m1m1m1m1m1",
    periodo: "Q1",
    objetivo: "Newsletter",
    area: "Marketing",
    criado_em: new Date("2026-01-01T00:00:00Z"),
    resultados: [
      {
        id: "kr-news-1",
        metrica: "Leads totais: 18.000",
        meta: 18000.0,
        atual: 17500.0,
        unidade: "",
        status: "em_progresso",
        okr_id: "m1m1m1m1-1m1m-1m1m-1m1m-m1m1m1m1m1m1"
      },
      {
        id: "kr-news-2",
        metrica: "Clicadores Totais: 7.000",
        meta: 7000.0,
        atual: 6982.0,
        unidade: "",
        status: "em_progresso",
        okr_id: "m1m1m1m1-1m1m-1m1m-1m1m-m1m1m1m1m1m1"
      },
      {
        id: "kr-news-3",
        metrica: "Aberturas por Edição: 3.500",
        meta: 3500.0,
        atual: 3112.0,
        unidade: "",
        status: "em_progresso",
        okr_id: "m1m1m1m1-1m1m-1m1m-1m1m-m1m1m1m1m1m1"
      }
    ]
  },
  {
    id: "m2m2m2m2-2m2m-2m2m-2m2m-m2m2m2m2m2m2",
    periodo: "Q1",
    objetivo: "YouTube",
    area: "Marketing",
    criado_em: new Date("2026-01-01T00:00:00Z"),
    resultados: [
      {
        id: "kr-yt-1",
        metrica: "Views em um video: 300",
        meta: 300.0,
        atual: 228.0,
        unidade: "",
        status: "em_progresso",
        okr_id: "m2m2m2m2-2m2m-2m2m-2m2m-m2m2m2m2m2m2"
      },
      {
        id: "kr-yt-2",
        metrica: "Inscritos no Canal: 200.000",
        meta: 200000.0,
        atual: 200352.0,
        unidade: "",
        status: "concluido",
        okr_id: "m2m2m2m2-2m2m-2m2m-2m2m-m2m2m2m2m2m2"
      },
      {
        id: "kr-yt-3",
        metrica: "QTD de videos postados no mês: 4",
        meta: 4.0,
        atual: 0.0,
        unidade: "",
        status: "nao_iniciado",
        okr_id: "m2m2m2m2-2m2m-2m2m-2m2m-m2m2m2m2m2m2"
      }
    ]
  },
  {
    id: "m3m3m3m3-3m3m-3m3m-3m3m-m3m3m3m3m3m3",
    periodo: "Q1",
    objetivo: "Instagram",
    area: "Marketing",
    criado_em: new Date("2026-01-01T00:00:00Z"),
    resultados: [
      {
        id: "kr-ig-1",
        metrica: "Crescer 5k Seguidores",
        meta: 5000.0,
        atual: 4700.0,
        unidade: "",
        status: "em_progresso",
        okr_id: "m3m3m3m3-3m3m-3m3m-3m3m-m3m3m3m3m3m3"
      },
      {
        id: "kr-ig-2",
        metrica: "Postar 30 Reels",
        meta: 30.0,
        atual: 30.0,
        unidade: "",
        status: "concluido",
        okr_id: "m3m3m3m3-3m3m-3m3m-3m3m-m3m3m3m3m3m3"
      },
      {
        id: "kr-ig-3",
        metrica: "Fazer 15 Lives",
        meta: 15.0,
        atual: 4.0,
        unidade: "",
        status: "em_progresso",
        okr_id: "m3m3m3m3-3m3m-3m3m-3m3m-m3m3m3m3m3m3"
      }
    ]
  }
];

export const getAllOkrs = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (fastify.dbConnected) {
    try {
      const okrs = await fastify.db.oKR.findMany({
        include: { resultados: true },
        orderBy: { criado_em: "desc" }
      });
      if (okrs.length > 0) {
        return reply.send(okrs);
      }
      // Se o banco estiver vazio, usa os mocks para apresentacao
      return reply.send(mockOkrs);
    } catch (error) {
      fastify.log.error(error);
    }
  }

  // Fallback para mock
  return reply.send(mockOkrs);
};

export const createOkr = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: OkrInput }>,
  reply: FastifyReply
) => {
  const { periodo, objetivo, area, resultados = [] } = request.body;

  if (!periodo || !objetivo || !area) {
    return reply.status(400).send({ error: "Periodo, objetivo e area sao obrigatorios." });
  }

  if (fastify.dbConnected) {
    try {
      const okr = await fastify.db.oKR.create({
        data: {
          periodo,
          objetivo,
          area,
          resultados: {
            create: resultados.map((r) => ({
              metrica: r.metrica,
              meta: r.meta,
              atual: r.atual,
              unidade: r.unidade,
              status: r.status || "no_prazo"
            }))
          }
        },
        include: { resultados: true }
      });
      return reply.status(201).send(okr);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Erro ao criar OKR." });
    }
  }

  // Fallback para mock
  const okrId = uuidv4();
  const createdResults = resultados.map((r) => ({
    id: uuidv4(),
    metrica: r.metrica,
    meta: r.meta,
    atual: r.atual,
    unidade: r.unidade,
    status: r.status || "no_prazo",
    okr_id: okrId
  }));

  const newOkr = {
    id: okrId,
    periodo,
    objetivo,
    area,
    criado_em: new Date(),
    resultados: createdResults
  };

  mockOkrs.push(newOkr);
  return reply.status(201).send(newOkr);
};

export const deleteOkr = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (fastify.dbConnected) {
    try {
      // Prisma delete cascade deleta automaticamente se onDelete for Cascade na modelagem.
      // Porem no schema.prisma nao especificamos onDelete Cascade para Resultados-Chave, logo precisamos excluir os resultados primeiro.
      await fastify.db.resultadoChave.deleteMany({ where: { okr_id: id } });
      await fastify.db.oKR.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(404).send({ error: "OKR nao encontrado." });
    }
  }

  // Fallback para mock
  const okrIndex = mockOkrs.findIndex((o) => o.id === id);
  if (okrIndex === -1) {
    return reply.status(404).send({ error: "OKR nao encontrado." });
  }

  mockOkrs.splice(okrIndex, 1);
  return reply.status(204).send();
};
