import { FastifyInstance } from "fastify";
import { getVendas, getVendasInsights } from "../controllers/vendas";

export default async function (fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/api/vendas", getVendas(fastify));
  fastify.get("/api/vendas/insights", getVendasInsights(fastify));
}
