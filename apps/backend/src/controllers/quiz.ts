import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { mockLeads } from "./leads";
import { sendWelcomeSMS } from "../services/twilio.service";
import { sendLeadNotification } from "../services/telegram.service";

interface QuizSubmitInput {
  nome: string;
  email: string;
  telefone?: string;
  optIn?: boolean;
  respostas: {
    pergunta1: string; // Ex: Objetivo (emagrecer, energia, foco)
    pergunta2: string; // Ex: Localizacao (eua, outro)
  };
}

export const submitQuiz = (fastify: FastifyInstance) => async (
  request: FastifyRequest<{ Body: QuizSubmitInput }>,
  reply: FastifyReply
) => {
  const { nome, email, telefone, optIn, respostas } = request.body;

  if (!nome || !email || !respostas) {
    return reply.status(400).send({ error: "Nome, email e respostas sao obrigatorios." });
  }

  // Define as tags de segmentacao com base nas respostas
  const tags: string[] = ["isca_quiz"];
  if (respostas.pergunta1 === "emagrecer") tags.push("nutraceuticos_perda_peso");
  if (respostas.pergunta1 === "energia") tags.push("nutraceuticos_energia");
  if (respostas.pergunta1 === "foco") tags.push("nutraceuticos_foco");
  
  if (respostas.pergunta2 === "eua") {
    tags.push("mercado_eua");
  } else {
    tags.push("mercado_internacional");
  }

  // Simula a integracao com a API do Systeme.io
  fastify.log.info(`Enviando dados do lead para Systeme.io com as tags: ${tags.join(", ")}`);
  
  if (fastify.dbConnected) {
    try {
      // Cria ou atualiza o lead no CRM
      const lead = await fastify.db.lead.upsert({
        where: { email },
        update: {
          nome,
          telefone: telefone || undefined,
          status: "lead",
          segmento_email: "investigador",
          fonte_captacao: "Systeme.io Quiz",
          tags: {
            set: tags // Substitui as tags antigas pelas novas
          },
          ultima_interacao: new Date()
        },
        create: {
          nome,
          email,
          telefone,
          status: "lead",
          segmento_email: "investigador",
          fonte_captacao: "Systeme.io Quiz",
          tags
        }
      });
      
      // Dispara notificacao interna
      sendLeadNotification({ nome, email, telefone: telefone || "" }, fastify.log);
      
      // Envia SMS se tiver telefone e opt-in
      if (telefone && optIn) {
        sendWelcomeSMS(telefone, nome, fastify.log);
      }
      
      return reply.send({ success: true, lead });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Erro ao salvar lead no CRM." });
    }
  }

  // Fallback para mock
  const mockLead = {
    id: uuidv4(),
    nome,
    email,
    telefone: telefone || null,
    messenger_id: null,
    status: "lead",
    segmento_email: "investigador",
    fonte_captacao: "Systeme.io Quiz",
    data_cadastro: new Date(),
    ultima_interacao: new Date(),
    tags,
    notas: optIn ? "Lead concordou em receber SMS/Email (Opt-In)." : "Sem opt-in explícito."
  };

  mockLeads.unshift(mockLead as any); // Adiciona no comeco para aparecer primeiro na lista

  sendLeadNotification({ nome, email, telefone: telefone || "" }, fastify.log);
  if (telefone && optIn) {
    sendWelcomeSMS(telefone, nome, fastify.log);
  }

  return reply.send({ success: true, lead: mockLead });
};
