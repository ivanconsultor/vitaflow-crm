import { FastifyInstance } from "fastify";
import { getAllLeads, createLead, updateLead, deleteLead } from "../controllers/leads";

export default async function (fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/api/leads", getAllLeads(fastify));
  fastify.post("/api/leads", createLead(fastify));
  fastify.put("/api/leads/:id", updateLead(fastify));
  fastify.delete("/api/leads/:id", deleteLead(fastify));
}
