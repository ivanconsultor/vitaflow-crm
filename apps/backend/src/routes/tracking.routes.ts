import { FastifyInstance } from "fastify";
import { v4 as uuidv4 } from "uuid";

export default async function (fastify: FastifyInstance) {
  // O endpoint que o script do Pixel na Presell vai chamar
  fastify.post("/api/tracking/pixel", async (request, reply) => {
    // Para aceitar CORS adequadamente em rotas de tracking (Opcional se configurado globalmente)
    reply.header("Access-Control-Allow-Origin", "*");

    const data = request.body as any;
    const ip = request.ip;
    const userAgent = request.headers["user-agent"] || "unknown";

    fastify.log.info(`[Pixel Tracking] Novo Hit recebido de ${data.url || 'URL Desconhecida'}`);

    const trackingEvent = {
      id: uuidv4(),
      event_type: data.event_type || "pageview",
      url: data.url,
      referrer: data.referrer,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      ip,
      user_agent: userAgent,
      timestamp: new Date()
    };

    if (fastify.dbConnected) {
      // Salvar evento no DB real
      try {
        // Exemplo: fastify.db.trackingEvent.create(...)
        return reply.status(200).send({ success: true, trackingEvent });
      } catch (error) {
        fastify.log.error(error, "Erro ao salvar tracking event no DB");
        return reply.status(500).send({ error: "Tracking server error" });
      }
    }

    // Modo Mock
    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Evento de pixel capturado.",
      trackingEvent
    });
  });
}
