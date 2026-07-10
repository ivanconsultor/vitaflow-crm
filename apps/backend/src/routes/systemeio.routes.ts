import { FastifyInstance } from "fastify";
import { syncSystemeio } from "../controllers/systemeio.controller";

export default async function (fastify: FastifyInstance) {
  fastify.post("/api/systemeio/sync", syncSystemeio(fastify));
}
