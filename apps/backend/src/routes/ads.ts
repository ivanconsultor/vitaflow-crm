import { FastifyInstance } from "fastify";
import { getCampaigns, analyzeCampaigns } from "../controllers/ads";

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/ads/campaigns", getCampaigns(fastify));
  fastify.post("/api/ads/agent/analyze", analyzeCampaigns(fastify));
}
