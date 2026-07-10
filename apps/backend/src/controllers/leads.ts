import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";

interface LeadInput {
  nome: string;
  email: string;
  telefone?: string;
  messenger_id?: string;
  status?: string;
  segmento_email?: string;
  fonte_captacao?: string;
  valor_potencial?: number;
  tags?: string[];
  notas?: string;
}

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  messenger_id: string | null;
  status: string;
  segmento_email: string;
  fonte_captacao: string | null;
  valor_potencial: number | null;
  data_cadastro: Date;
  ultima_interacao: Date | null;
  tags: string[];
  notas: string | null;
}

// Leads mockados para fallback em caso de falta de conexao com o banco
export const mockLeads: Lead[] = [
  {
    id: "e6f49f50-5712-4eb4-b91b-b4662d515a45",
    nome: "John Doe",
    email: "john.doe@example.com",
    telefone: "+15550199",
    messenger_id: "messenger-12345",
    status: "lead",
    segmento_email: "ativo",
    fonte_captacao: "Facebook Ads",
    valor_potencial: 47,
    data_cadastro: new Date("2026-04-10T10:00:00Z"),
    ultima_interacao: new Date("2026-04-20T15:30:00Z"),
    tags: ["nutraceuticos", "eua"],
    notas: "Interessado em produtos de longevidade."
  },
  {
    id: "f8b91c90-21a4-44d4-bd17-91a5e12f6a78",
    nome: "Jane Smith",
    email: "jane.smith@example.com",
    telefone: "+15550299",
    messenger_id: null,
    status: "cliente",
    segmento_email: "leal",
    fonte_captacao: "Google Ads",
    valor_potencial: 997,
    data_cadastro: new Date("2026-03-01T08:00:00Z"),
    ultima_interacao: new Date("2026-04-24T12:00:00Z"),
    tags: ["vip", "recorrente"],
    notas: "Comprou 3 frascos de colageno."
  }
];

export const getAllLeads = (fastify: FastifyInstance) => async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (fastify.dbConnected) {
    try {
      const leads = await fastify.db.lead.findMany({
        orderBy: { data_cadastro: "desc" }
      });
      return reply.send(leads);
    } catch (error) {
      fastify.log.error(error);
    }
  }

  // Fallback para mock
  return reply.send(mockLeads);
};

export const createLead = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: LeadInput }>,
  reply: FastifyReply
) => {
  const {
    nome,
    email,
    telefone,
    messenger_id,
    status = "Novo Lead",
    segmento_email = "investigador",
    fonte_captacao,
    valor_potencial,
    tags = [],
    notas
  } = request.body;

  if (!nome || !email) {
    return reply.status(400).send({ error: "Nome e email sao obrigatorios." });
  }

  if (fastify.dbConnected) {
    try {
      const existing = await fastify.db.lead.findUnique({ where: { email } });
      if (existing) {
        return reply.status(409).send({ error: "Email ja cadastrado." });
      }

      const lead = await fastify.db.lead.create({
        data: {
          nome,
          email,
          telefone,
          messenger_id,
          status,
          segmento_email,
          fonte_captacao,
          tags,
          notas
        }
      });
      return reply.status(211).send(lead); // Use status 211 ou 201 conforme a resposta convencional. A SPEC especifica retorno simples.
    } catch (error) {
      fastify.log.error(error);
    }
  }

  // Fallback para mock
  const existingMock = mockLeads.find((l) => l.email === email);
  if (existingMock) {
    return reply.status(409).send({ error: "Email ja cadastrado." });
  }

  const newLead = {
    id: uuidv4(),
    nome,
    email,
    telefone: telefone || null,
    messenger_id: messenger_id || null,
    status,
    segmento_email,
    fonte_captacao: fonte_captacao || null,
    valor_potencial: valor_potencial || null,
    data_cadastro: new Date(),
    ultima_interacao: new Date(),
    tags,
    notas: notas || null
  };

  mockLeads.push(newLead);
  return reply.status(201).send(newLead);
};

export const updateLead = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Params: { id: string }; Body: LeadInput }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const {
    nome,
    email,
    telefone,
    messenger_id,
    status,
    segmento_email,
    fonte_captacao,
    tags,
    notas
  } = request.body;

  if (fastify.dbConnected) {
    try {
      const lead = await fastify.db.lead.update({
        where: { id },
        data: {
          nome,
          email,
          telefone,
          messenger_id,
          status,
          segmento_email,
          fonte_captacao,
          tags,
          notas,
          ultima_interacao: new Date()
        }
      });
      return reply.send(lead);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(404).send({ error: "Lead nao encontrado ou erro ao atualizar." });
    }
  }

  // Fallback para mock
  const leadIndex = mockLeads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return reply.status(404).send({ error: "Lead nao encontrado." });
  }

  const updatedLead = {
    ...mockLeads[leadIndex],
    nome: nome !== undefined ? nome : mockLeads[leadIndex].nome,
    email: email !== undefined ? email : mockLeads[leadIndex].email,
    telefone: telefone !== undefined ? telefone : mockLeads[leadIndex].telefone,
    messenger_id: messenger_id !== undefined ? messenger_id : mockLeads[leadIndex].messenger_id,
    status: status !== undefined ? status : mockLeads[leadIndex].status,
    segmento_email: segmento_email !== undefined ? segmento_email : mockLeads[leadIndex].segmento_email,
    fonte_captacao: fonte_captacao !== undefined ? fonte_captacao : mockLeads[leadIndex].fonte_captacao,
    tags: tags !== undefined ? tags : mockLeads[leadIndex].tags,
    notas: notas !== undefined ? notas : mockLeads[leadIndex].notas,
    ultima_interacao: new Date()
  };

  mockLeads[leadIndex] = updatedLead;
  return reply.send(updatedLead);
};

export const deleteLead = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (fastify.dbConnected) {
    try {
      await fastify.db.lead.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(404).send({ error: "Lead nao encontrado." });
    }
  }

  // Fallback para mock
  const leadIndex = mockLeads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return reply.status(404).send({ error: "Lead nao encontrado." });
  }

  mockLeads.splice(leadIndex, 1);
  return reply.status(204).send();
};
