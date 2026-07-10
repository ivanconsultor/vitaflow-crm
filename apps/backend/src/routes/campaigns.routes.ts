import { FastifyInstance } from "fastify";
import { getAllCampaigns, createCampaign } from "../controllers/campaigns.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/campaigns", getAllCampaigns(fastify));
  fastify.post("/api/campaigns", createCampaign(fastify));
}
