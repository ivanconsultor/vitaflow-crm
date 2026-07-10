import { FastifyInstance } from "fastify";
import { getAnalytics } from "../controllers/analytics.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/analytics", getAnalytics(fastify));
}
