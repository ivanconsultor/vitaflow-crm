import { FastifyInstance } from "fastify";
import { getAllPublicacoes, createPublicacao, deletePublicacao } from "../controllers/editorial";

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/editorial", getAllPublicacoes(fastify));
  fastify.post("/api/editorial", createPublicacao(fastify));
  fastify.delete("/api/editorial/:id", deletePublicacao(fastify));
}
