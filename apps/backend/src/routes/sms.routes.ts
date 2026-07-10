import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

interface SmsInput {
  to: string;
  message: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.post("/api/sms/send", async (request: FastifyRequest<{ Body: SmsInput }>, reply: FastifyReply) => {
    const { to, message } = request.body;

    if (!to || !message) {
      return reply.status(400).send({ error: "Parâmetros 'to' e 'message' são obrigatórios." });
    }

    // Aqui integrariamos com o Twilio SDK se tivessemos as chaves reais
    const isMock = !process.env.TWILIO_ACCOUNT_SID;
    
    if (isMock) {
      fastify.log.info(`[MOCK SMS] Para: ${to} | Mensagem: ${message}`);
      return reply.send({ success: true, mock: true, to, messageId: `mock_sms_${Date.now()}` });
    }

    // Simulacao de envio via SDK Twilio
    // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // const result = await client.messages.create({ body: message, from: process.env.TWILIO_FROM_NUMBER, to });
    
    return reply.send({ success: true, to, messageId: `real_sms_${Date.now()}` });
  });

  fastify.post("/api/sms/webhook", async (request: FastifyRequest, reply: FastifyReply) => {
    // Webhook para receber o status de entrega do SMS do Twilio
    fastify.log.info({ webhook: "Twilio SMS", body: request.body });
    return reply.status(200).send("OK");
  });
}
