import Fastify from "fastify";
import cors from "@fastify/cors";
import configPlugin from "./plugins/config";
import dbPlugin from "./plugins/db";
import jwtPlugin from "./plugins/jwt";
import leadsRoutes from "./routes/leads";
import authRoutes from "./routes/auth.routes";
import okrsRoutes from "./routes/okrs";
import funnelsRoutes from "./routes/funnels";
import editorialRoutes from "./routes/editorial";
import webhooksRoutes from "./routes/webhooks";
import adsRoutes from "./routes/ads";
import campaignsRoutes from "./routes/campaigns.routes";
import contentRoutes from "./routes/content.routes";
import smsRoutes from "./routes/sms.routes";
import messengerRoutes from "./routes/messenger.routes";
import systemeioRoutes from "./routes/systemeio.routes";
import analyticsRoutes from "./routes/analytics.routes";
import trackingRoutes from "./routes/tracking.routes";
import vendasRoutes from "./routes/vendas.routes";

const startServer = async () => {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname"
        }
      }
    }
  });

  try {
    // 1. Registrar o plugin de configuracao (carrega .env)
    await fastify.register(configPlugin);

    // 2. Registrar o plugin do banco de dados (Prisma)
    await fastify.register(dbPlugin);

    // 3. Registrar o plugin CORS
    await fastify.register(cors, {
      origin: true, // Em desenvolvimento permite qualquer origem, para producao pode ser restrito
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    });

    // 3.5 Registrar plugin JWT
    await fastify.register(jwtPlugin);

    // 4. Registrar as rotas da aplicacao
    await fastify.register(authRoutes);
    await fastify.register(leadsRoutes);
    await fastify.register(okrsRoutes);
    await fastify.register(funnelsRoutes);
    await fastify.register(editorialRoutes);
    await fastify.register(webhooksRoutes);
    await fastify.register(adsRoutes);
    await fastify.register(campaignsRoutes);
    await fastify.register(contentRoutes);
    await fastify.register(smsRoutes);
    await fastify.register(messengerRoutes);
    await fastify.register(systemeioRoutes);
    await fastify.register(analyticsRoutes);
    await fastify.register(trackingRoutes);
    await fastify.register(vendasRoutes);

    // Rota basica de status da API (Healthcheck)
    fastify.get("/api/health", async (request, reply) => {
      return reply.send({
        status: "ok",
        database: fastify.dbConnected ? "connected" : "fallback_mock",
        timestamp: new Date().toISOString()
      });
    });

    const port = parseInt(fastify.config.PORT || "3001", 10);
    const host = "0.0.0.0"; // Importante para rodar no Docker e aceitar conexoes de rede

    await fastify.listen({ port, host });
    fastify.log.info(`Servidor backend rodando em http://${host}:${port}`);
  } catch (error) {
    console.error("Erro ao iniciar o servidor backend:", error);
    process.exit(1);
  }
};

startServer();
