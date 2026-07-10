import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

interface MessengerInput {
  recipientId: string;
  messageText: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.post("/api/messenger/send", async (request: FastifyRequest<{ Body: MessengerInput }>, reply: FastifyReply) => {
    const { recipientId, messageText } = request.body;

    if (!recipientId || !messageText) {
      return reply.status(400).send({ error: "Parâmetros 'recipientId' e 'messageText' são obrigatórios." });
    }

    const isMock = !process.env.MESSENGER_PAGE_ACCESS_TOKEN || process.env.MESSENGER_PAGE_ACCESS_TOKEN.startsWith("placeholder");
    
    if (isMock) {
      fastify.log.info(`[MOCK MESSENGER] Para: ${recipientId} | Mensagem: ${messageText}`);
      return reply.send({ success: true, mock: true, recipientId, messageId: `mock_fb_${Date.now()}` });
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.MESSENGER_PAGE_ACCESS_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: messageText }
        })
      });

      if (!response.ok) {
        const errData = await response.json() as any;
        throw new Error(errData.error?.message || `Status ${response.status}`);
      }

      const data = await response.json() as any;
      return reply.send({ success: true, recipientId, messageId: data.message_id || `real_fb_${Date.now()}` });
    } catch (err: any) {
      fastify.log.error(err, "Erro ao enviar mensagem via Facebook Messenger");
      return reply.status(500).send({ error: `Erro ao enviar mensagem via Messenger: ${err.message}` });
    }
  });

  fastify.get("/api/messenger/webhook", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"];

    const verifyToken = process.env.MESSENGER_VERIFY_TOKEN || "my_secure_token";

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        return reply.status(200).send(challenge);
      } else {
        return reply.status(403).send();
      }
    }
    return reply.status(400).send();
  });

  fastify.post("/api/messenger/webhook", async (request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.info({ webhook: "Facebook Messenger", body: request.body });
    // Processamento das mensagens recebidas
    return reply.status(200).send("EVENT_RECEIVED");
  });
}
