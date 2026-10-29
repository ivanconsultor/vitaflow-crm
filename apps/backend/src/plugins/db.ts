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

  // O Postgres roda em outra stack e pode levar ate ~1 min para aceitar conexoes
  // quando sobe sujo (recuperacao automatica). Insistimos em vez de desistir na
  // primeira tentativa, senao o backend fica preso em mock com o banco no ar.
  const MAX_TENTATIVAS = 20;
  const INTERVALO_MS = 5000;

  let dbConnected = false;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      // Tenta executar uma consulta simples para validar a conexao com o banco
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
      fastify.log.info(
        `Conexao com o banco de dados PostgreSQL estabelecida com sucesso (tentativa ${tentativa}).`
      );
      break;
    } catch (error) {
      if (tentativa === MAX_TENTATIVAS) {
        fastify.log.error(error, "Erro ao conectar ao banco via Prisma");
        fastify.log.warn("Nao foi possivel conectar ao PostgreSQL via Prisma. Utilizando mocks em memoria (Fallback).");
        break;
      }

      fastify.log.warn(
        `Banco ainda indisponivel (tentativa ${tentativa}/${MAX_TENTATIVAS}). Nova tentativa em ${INTERVALO_MS / 1000}s.`
      );
      await new Promise((resolve) => setTimeout(resolve, INTERVALO_MS));
    }
  }

  fastify.decorate("db", prisma);
  fastify.decorate("dbConnected", dbConnected);

  fastify.addHook("onClose", async (server) => {
    await server.db.$disconnect();
  });
});
