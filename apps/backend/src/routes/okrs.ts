import { FastifyInstance } from "fastify";
import { getAllOkrs, createOkr, deleteOkr } from "../controllers/okrs";

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/okrs", getAllOkrs(fastify));
  fastify.post("/api/okrs", createOkr(fastify));
  fastify.delete("/api/okrs/:id", deleteOkr(fastify));
}
