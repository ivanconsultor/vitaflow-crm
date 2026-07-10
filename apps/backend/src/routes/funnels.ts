import { FastifyInstance } from "fastify";
import { getAllFunnels, createFunnel, deleteFunnel } from "../controllers/funnels";

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/funnels", getAllFunnels(fastify));
  fastify.post("/api/funnels", createFunnel(fastify));
  fastify.delete("/api/funnels/:id", deleteFunnel(fastify));
}
