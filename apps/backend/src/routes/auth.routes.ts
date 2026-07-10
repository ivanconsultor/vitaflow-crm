import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post("/api/auth/login", async (request, reply) => {
    const { email, password } = request.body as any;

    // GSD Authentication MVP: Hardcoded master password for immediate security
    const MASTER_PASSWORD = process.env.ADMIN_PASSWORD || "vitaflow2026";
    const MASTER_EMAIL = process.env.ADMIN_EMAIL || "admin@vitaflow.com";

    if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
      const token = fastify.jwt.sign({ role: "admin", email });
      return reply.send({ success: true, token });
    }

    return reply.status(401).send({ success: false, error: "Credenciais inválidas" });
  });
}
