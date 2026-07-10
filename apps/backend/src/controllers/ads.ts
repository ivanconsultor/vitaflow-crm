import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { fetchAdCampaigns } from "../services/ads/meta";
import { analisarCampanhas } from "../services/ai/agent";

export const getCampaigns = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const campaigns = await fetchAdCampaigns();
    return reply.send(campaigns);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Erro ao buscar campanhas de anuncios." });
  }
};

export const analyzeCampaigns = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const campaigns = await fetchAdCampaigns();
    const apiKey = fastify.config.OPENAI_API_KEY;
    
    const relatorio = await analisarCampanhas(campaigns, apiKey);
    return reply.send({ relatorio });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Erro ao processar relatorio com agente de IA." });
  }
};
