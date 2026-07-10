import { FastifyInstance } from "fastify";
import { runContentPipeline, getPublicacoes } from "../controllers/content.controller";

export default async function (fastify: FastifyInstance) {
  fastify.post("/api/content/pipeline", runContentPipeline(fastify));
  fastify.get("/api/content/publicacoes", getPublicacoes(fastify));
}
