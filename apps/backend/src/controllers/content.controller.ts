import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { gerarConteudoMultiplataforma } from "../services/ai/agent";

interface PipelineInput {
  newsletterText: string;
}

export const runContentPipeline = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: PipelineInput }>,
  reply: FastifyReply
) => {
  const { newsletterText } = request.body;

  if (!newsletterText) {
    return reply.status(400).send({ error: "Texto da newsletter é obrigatório." });
  }

  const apiKey = process.env.OPENAI_API_KEY || "";
  
  try {
    // 1. Chama o agente LangChain
    const conteudosGerados = await gerarConteudoMultiplataforma(newsletterText, apiKey);

    // 2. Salva no banco (se disponivel)
    if (fastify.dbConnected) {
      const savedContents = await Promise.all(
        conteudosGerados.map((item: any) => 
          fastify.db.publicacao.create({
            data: {
              titulo: item.titulo,
              conteudo: item.conteudo,
              plataforma: item.plataforma,
              data_agenda: new Date(), // agendamento base
              status: "rascunho"
            }
          })
        )
      );
      return reply.status(201).send(savedContents);
    }

    // Fallback: retorna o que gerou
    return reply.status(201).send(conteudosGerados);

  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Falha ao executar pipeline de conteudo." });
  }
};

export const getPublicacoes = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (fastify.dbConnected) {
    try {
      const pubs = await fastify.db.publicacao.findMany({
        orderBy: { criado_em: "desc" }
      });
      return reply.send(pubs);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Erro ao buscar publicacoes." });
    }
  }

  return reply.send([]); // Fallback vazio
};
