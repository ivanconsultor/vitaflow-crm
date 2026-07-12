import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
    dbConnected: boolean;
  }
}

export default fp(async (fastify) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: fastify.config.DATABASE_URL
      }
    }
  });

  let dbConnected = false;

  try {
    // Tenta executar uma consulta simples para validar a conexao com o banco
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
    fastify.log.info("Conexao com o banco de dados PostgreSQL estabelecida com sucesso.");
  } catch (error) {
    fastify.log.error(error, "Erro ao conectar ao banco via Prisma");
    fastify.log.warn("Nao foi possivel conectar ao PostgreSQL via Prisma. Utilizando mocks em memoria (Fallback).");
  }

  fastify.decorate("db", prisma);
  fastify.decorate("dbConnected", dbConnected);

  fastify.addHook("onClose", async (server) => {
    await server.db.$disconnect();
  });
});
