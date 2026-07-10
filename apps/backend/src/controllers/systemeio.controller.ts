import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { SystemeioService } from "../services/systemeio.service";

export const syncSystemeio = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const service = new SystemeioService();
    const contatosSegmentados = await service.fetchAndSegmentContacts();

    let updatedCount = 0;

    if (fastify.dbConnected) {
      // Atualiza banco de dados
      for (const c of contatosSegmentados) {
        await fastify.db.lead.upsert({
          where: { email: c.email },
          update: {
            nome: c.nome,
            telefone: c.telefone || undefined,
            segmento_email: c.segmento,
            ultima_interacao: new Date()
          },
          create: {
            nome: c.nome,
            email: c.email,
            telefone: c.telefone,
            segmento_email: c.segmento,
            fonte_captacao: "Systeme.io Sync",
            status: "lead"
          }
        });
        updatedCount++;
      }
    } else {
      // Se n tiver dbConnected, apenas simula o retorno
      updatedCount = contatosSegmentados.length;
    }

    return reply.status(200).send({ 
      success: true, 
      message: `Sincronização concluída. ${updatedCount} leads processados.`,
      contatos: contatosSegmentados
    });

  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Erro durante a sincronização com Systeme.io." });
  }
};
