import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";

interface PublicacaoInput {
  titulo: string;
  conteudo: string;
  plataforma: string;
  data_agenda: string;
  status?: string;
}

interface Publicacao {
  id: string;
  titulo: string;
  conteudo: string;
  plataforma: string;
  data_agenda: Date;
  status: string;
  criado_em: Date;
}

const mockPublicacoes: Publicacao[] = [
  {
    id: "p1p1p1p1-1p1p-1p1p-1p1p-p1p1p1p1p1p1",
    titulo: "Metodo 4Cs - Como estruturar seu negocio digital",
    conteudo: "Aprenda as 4 etapas essenciais (Configuracao, Captacao, Conexao, Conversao) para rodar sua operacao.",
    plataforma: "newsletter",
    data_agenda: new Date("2026-06-25T08:00:00Z"),
    status: "agendado",
    criado_em: new Date("2026-06-24T10:00:00Z")
  },
  {
    id: "p2p2p2p2-2p2p-2p2p-2p2p-p2p2p2p2p2p2",
    titulo: "3 Frutos Tropicais para Aumentar a Imunidade",
    conteudo: "Pin de divulgacao de produto nutraceutico focado no mercado americano.",
    plataforma: "pinterest",
    data_agenda: new Date("2026-06-26T14:00:00Z"),
    status: "rascunho",
    criado_em: new Date("2026-06-24T11:30:00Z")
  }
];

export const getAllPublicacoes = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (fastify.dbConnected) {
    try {
      const publicacoes = await fastify.db.publicacao.findMany({
        orderBy: { data_agenda: "asc" }
      });
      return reply.send(publicacoes);
    } catch (error) {
      fastify.log.error(error);
    }
  }

  return reply.send(mockPublicacoes);
};

export const createPublicacao = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: PublicacaoInput }>,
  reply: FastifyReply
) => {
  const { titulo, conteudo, plataforma, data_agenda, status = "rascunho" } = request.body;

  if (!titulo || !conteudo || !plataforma || !data_agenda) {
    return reply.status(400).send({ error: "Titulo, conteudo, plataforma e data de agenda sao obrigatorios." });
  }

  if (fastify.dbConnected) {
    try {
      const pub = await fastify.db.publicacao.create({
        data: {
          titulo,
          conteudo,
          plataforma,
          data_agenda: new Date(data_agenda),
          status
        }
      });
      return reply.status(201).send(pub);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Erro ao criar publicacao." });
    }
  }

  const newPub = {
    id: uuidv4(),
    titulo,
    conteudo,
    plataforma,
    data_agenda: new Date(data_agenda),
    status,
    criado_em: new Date()
  };

  mockPublicacoes.push(newPub);
  return reply.status(201).send(newPub);
};

export const deletePublicacao = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (fastify.dbConnected) {
    try {
      await fastify.db.publicacao.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(404).send({ error: "Publicacao nao encontrada." });
    }
  }

  const pubIndex = mockPublicacoes.findIndex((p) => p.id === id);
  if (pubIndex === -1) {
    return reply.status(404).send({ error: "Publicacao nao encontrada." });
  }

  mockPublicacoes.splice(pubIndex, 1);
  return reply.status(204).send();
};
