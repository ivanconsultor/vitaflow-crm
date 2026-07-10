import { FastifyInstance } from "fastify";
import { submitQuiz } from "../controllers/quiz";
import { v4 as uuidv4 } from "uuid";
import { mockLeads } from "../controllers/leads";

async function dispararSmsRecuperacao(
  fastify: any,
  telefone: string | null,
  nomeCliente: string,
  produtoNome: string,
  emailCliente: string | null = null
) {
  const mensagem = `Ola ${nomeCliente}, notamos que voce nao concluiu sua compra do ${produtoNome}. Use o cupom VITAFLOW10 para 10% OFF: https://vitaflow.com/promo`;
  
  // 1. DISPARO DE SMS (TWILIO)
  if (telefone) {
    const isMockSms = !fastify.config.TWILIO_ACCOUNT_SID || fastify.config.TWILIO_ACCOUNT_SID.startsWith("ACplaceholder");
    if (isMockSms) {
      fastify.log.info(`[MOCK SMS RECUPERACAO] Para: ${telefone} | Msg: ${mensagem}`);
    } else {
      try {
        const twilio = require("twilio");
        const client = twilio(fastify.config.TWILIO_ACCOUNT_SID, fastify.config.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: mensagem,
          from: fastify.config.TWILIO_FROM_NUMBER,
          to: telefone
        });
        fastify.log.info(`[Twilio SMS] SMS de recuperacao enviado com sucesso para ${telefone}`);
      } catch (err) {
        fastify.log.error(err, `Erro ao disparar SMS de recuperacao Twilio para ${telefone}`);
      }
    }
  }

  // 2. DISPARO DE EMAIL (SENDGRID)
  if (emailCliente) {
    const isMockEmail = !process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.startsWith("placeholder");
    if (isMockEmail) {
      fastify.log.info(`[MOCK EMAIL RECUPERACAO] Para: ${emailCliente} | Assunto: Recupere seu pedido: ${produtoNome}`);
    } else {
      try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: emailCliente }]
              }
            ],
            from: { email: "recuperacao@vitaflow.com", name: "VitaFlow Support" },
            subject: `Recupere seu pedido: ${produtoNome}`,
            content: [
              {
                type: "text/html",
                value: `<p>Olá ${nomeCliente},</p><p>Notamos que você não concluiu a compra do produto <strong>${produtoNome}</strong>. Use o cupom <strong>VITAFLOW10</strong> para ganhar 10% de desconto:</p><p><a href="https://vitaflow.com/promo">Clique aqui para recuperar seu desconto de 10%</a></p>`
              }
            ]
          })
        });
        if (response.ok) {
          fastify.log.info(`[SendGrid Email] E-mail de recuperação enviado para ${emailCliente}`);
        } else {
          fastify.log.warn(`[SendGrid Email] Status ${response.status} ao enviar e-mail para ${emailCliente}`);
        }
      } catch (err) {
        fastify.log.error(err, `Erro ao disparar E-mail de recuperacao SendGrid para ${emailCliente}`);
      }
    }

    // 3. DISPARO DE EMAIL GRÁTIS AUTO (SYSTEME.IO CAMPANHA)
    const isMockSystemeio = !process.env.SYSTEMEIO_API_KEY || process.env.SYSTEMEIO_API_KEY.startsWith("placeholder");
    if (!isMockSystemeio) {
      try {
        const { SystemeioService } = await import("../services/systemeio.service.js");
        const systemeio = new SystemeioService();
        const campanhaId = "recuperacao_camp";
        const success = await systemeio.inscreverEmCampanha(emailCliente, campanhaId);
        if (success) {
          fastify.log.info(`[Systeme.io] Lead ${emailCliente} inscrito na campanha de e-mails automáticos.`);
        }
      } catch (err) {
        fastify.log.error(err, `Erro ao inscrever lead na campanha do Systeme.io`);
      }
    }
  }
}

interface WebhookSystemeioInput {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  tags?: string[];
}

export default async function (fastify: FastifyInstance) {
  // Rota de submissao do Quiz pelo frontend
  fastify.post("/api/quiz/submit", submitQuiz(fastify));

  // Webhook disparado pelo Systeme.io quando um novo lead se cadastra
  fastify.post("/api/webhooks/systemeio", async (request, reply) => {
    // GSD Webhook Security: Validação de Token de API
    const webhookToken = request.headers["x-webhook-token"];
    const EXPECTED_TOKEN = process.env.WEBHOOK_SECRET || "gsd-webhook-secret";
    
    if (webhookToken !== EXPECTED_TOKEN) {
      fastify.log.warn(`Tentativa de acesso não autorizado ao Webhook. Token fornecido: ${webhookToken}`);
      return reply.status(401).send({ error: "Unauthorized. Invalid webhook token." });
    }

    const { email, first_name = "", last_name = "", phone_number, tags = [] } = request.body as WebhookSystemeioInput;

    if (!email) {
      return reply.status(400).send({ error: "Email e obrigatorio." });
    }

    const nome = `${first_name} ${last_name}`.trim() || "Lead Systeme.io";

    fastify.log.info(`Recebido webhook do Systeme.io para o lead: ${email}`);

    if (fastify.dbConnected) {
      try {
        const lead = await fastify.db.lead.upsert({
          where: { email },
          update: {
            nome,
            telefone: phone_number || undefined,
            status: "lead",
            segmento_email: "investigador",
            fonte_captacao: "Systeme.io Webhook",
            tags: {
              set: [...tags, "systemeio_webhook"]
            },
            ultima_interacao: new Date()
          },
          create: {
            nome,
            email,
            telefone: phone_number,
            status: "lead",
            segmento_email: "investigador",
            fonte_captacao: "Systeme.io Webhook",
            tags: [...tags, "systemeio_webhook"]
          }
        });
        return reply.status(200).send({ success: true, lead });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao sincronizar webhook com o CRM." });
      }
    }

    const simulatedLead = {
      id: uuidv4(),
      nome,
      email,
      telefone: phone_number || null,
      messenger_id: null,
      status: "lead",
      segmento_email: "investigador",
      fonte_captacao: "Systeme.io Webhook",
      tags: [...tags, "systemeio_webhook"],
      data_cadastro: new Date(),
      ultima_interacao: new Date(),
      valor_potencial: null,
      notas: null
    };

    mockLeads.push(simulatedLead);

    return reply.status(200).send({
      success: true,
      message: "Modo de simulacao ativo. Webhook recebido e persistido no mock local.",
      lead: simulatedLead
    });
  });

  // Webhook disparado pela ClickBank (INS)
  fastify.post("/api/webhooks/clickbank", async (request, reply) => {
    // GSD Webhook Security: Validação de Token de API
    const webhookToken = request.headers["x-clickbank-token"];
    if (webhookToken !== fastify.config.WEBHOOK_SECRET_CLICKBANK) {
      fastify.log.warn(`Tentativa de acesso não autorizado ao Webhook da ClickBank.`);
      return reply.status(401).send({ error: "Unauthorized." });
    }

    const data = request.body as any;
    fastify.log.info(`Recebido webhook da ClickBank. Tipo de transacao: ${data.transactionType}`);

    const transacaoId = data.receipt || uuidv4().substring(0, 8).toUpperCase();
    const tipoEvento = data.transactionType || "SALE";
    const comissao = data.totalOrderAmount || 0;
    const email = data.customer?.email || null;

    // Tratamento de Abandono de Checkout ClickBank
    if (tipoEvento === "ABANDON" || tipoEvento === "ABANDONED" || tipoEvento === "checkout_initiated" || tipoEvento === "BILLING") {
      const nome = data.customer?.firstName || "Cliente";
      const telefone = data.customer?.phone || null;

      if (fastify.dbConnected && email) {
        try {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "abandono_checkout_clickbank"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Novo Lead",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        } catch (error) {
          fastify.log.error(error, "Erro ao atualizar lead de abandono da ClickBank no DB");
        }
      }

      if (telefone || email) {
        await dispararSmsRecuperacao(fastify, telefone, nome, "ClickBank Product", email);
      }

      return reply.status(200).send({ success: true, message: "Abandono ClickBank processado." });
    }

    if (fastify.dbConnected) {
      try {
        let produto = await fastify.db.produtoAfiliado.findFirst({ where: { plataforma: "ClickBank" }});
        if (!produto) {
          produto = await fastify.db.produtoAfiliado.create({
            data: { nome: "ClickBank Product", plataforma: "ClickBank", nicho: "Nutra", comissao_media: 100, cpa_meta: 50 }
          });
        }

        const venda = await fastify.db.vendaAfiliado.create({
          data: {
            transacao_id: transacaoId,
            produto_id: produto.id,
            valor_comissao_usd: comissao,
            tipo_evento: tipoEvento,
            email_cliente: email,
          }
        });

        if (email) {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "cliente_clickbank"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Fechado",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        }

        return reply.status(200).send({ success: true, message: "Venda ClickBank persistida na VitaFlow.", venda });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar ClickBank Webhook." });
      }
    }

    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Venda ClickBank recebida sem persistir no banco.",
      data: { receipt: transacaoId, transactionType: tipoEvento, amount: comissao }
    });
  });

  // Webhook disparado pelo BuyGoods (Postback)
  fastify.post("/api/webhooks/buygoods", async (request, reply) => {
    // GSD Webhook Security: Validação de Token de API
    const webhookToken = request.headers["x-buygoods-token"];
    if (webhookToken !== fastify.config.WEBHOOK_SECRET_BUYGOODS) {
      fastify.log.warn(`Tentativa de acesso não autorizado ao Webhook da BuyGoods.`);
      return reply.status(401).send({ error: "Unauthorized." });
    }

    const data = request.body as any;
    fastify.log.info(`Recebido webhook do BuyGoods. Evento: ${data.event_type || 'SALE'}`);

    const transacaoId = data.order_id || uuidv4().substring(0, 8).toUpperCase();
    const tipoEvento = data.event_type || "SALE";
    const comissao = parseFloat(data.commission) || 0;
    const email = data.customer_email || null;

    // Tratamento de Abandono de Checkout BuyGoods
    if (tipoEvento === "cart_abandoned" || tipoEvento === "abandon" || tipoEvento === "abandoned") {
      const nome = data.customer_name || "Cliente";
      const telefone = data.customer_phone || null;

      if (fastify.dbConnected && email) {
        try {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "abandono_checkout_buygoods"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Novo Lead",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        } catch (error) {
          fastify.log.error(error, "Erro ao atualizar lead de abandono da BuyGoods no DB");
        }
      }

      if (telefone || email) {
        await dispararSmsRecuperacao(fastify, telefone, nome, "BuyGoods Product", email);
      }

      return reply.status(200).send({ success: true, message: "Abandono BuyGoods processado." });
    }

    if (fastify.dbConnected) {
      try {
        let produto = await fastify.db.produtoAfiliado.findFirst({ where: { plataforma: "BuyGoods" }});
        if (!produto) {
          produto = await fastify.db.produtoAfiliado.create({
            data: { nome: "BuyGoods Product", plataforma: "BuyGoods", nicho: "Nutra", comissao_media: 120, cpa_meta: 60 }
          });
        }

        const venda = await fastify.db.vendaAfiliado.create({
          data: {
            transacao_id: transacaoId,
            produto_id: produto.id,
            valor_comissao_usd: comissao,
            tipo_evento: tipoEvento,
            email_cliente: email,
          }
        });

        if (email) {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "cliente_buygoods"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Fechado",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        }

        return reply.status(200).send({ success: true, message: "Venda BuyGoods persistida na VitaFlow.", venda });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar BuyGoods Webhook." });
      }
    }

    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Venda BuyGoods recebida sem persistir no banco.",
      data: { order_id: transacaoId, event_type: tipoEvento, commission: comissao }
    });
  });

  // Webhook disparado pela Digistore24
  fastify.post("/api/webhooks/digistore24", async (request, reply) => {
    // GSD Webhook Security: Validação de Token de API
    const webhookToken = request.headers["x-digistore-token"];
    if (webhookToken !== fastify.config.WEBHOOK_SECRET_DIGISTORE) {
      fastify.log.warn(`Tentativa de acesso não autorizado ao Webhook da Digistore24.`);
      return reply.status(401).send({ error: "Unauthorized." });
    }

    const data = request.body as any;
    fastify.log.info(`Recebido webhook da Digistore24. Transação: ${data.transaction_id || 'N/A'}`);

    const transacaoId = data.transaction_id || uuidv4().substring(0, 8).toUpperCase();
    const tipoEvento = data.transaction_type || "SALE";
    const comissao = parseFloat(data.amount) || 0;
    const email = data.customer_email || null;

    // Tratamento de Abandono de Checkout Digistore24
    if (tipoEvento === "checkout_initiated" || tipoEvento === "abandon" || tipoEvento === "abandoned") {
      const nome = data.customer_first_name || "Cliente";
      const telefone = data.customer_phone || null;

      if (fastify.dbConnected && email) {
        try {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "abandono_checkout_digistore24"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Novo Lead",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        } catch (error) {
          fastify.log.error(error, "Erro ao atualizar lead de abandono da Digistore24 no DB");
        }
      }

      if (telefone || email) {
        await dispararSmsRecuperacao(fastify, telefone, nome, "Digistore24 Product", email);
      }

      return reply.status(200).send({ success: true, message: "Abandono Digistore24 processado." });
    }

    if (fastify.dbConnected) {
      try {
        let produto = await fastify.db.produtoAfiliado.findFirst({ where: { plataforma: "Digistore24" }});
        if (!produto) {
          produto = await fastify.db.produtoAfiliado.create({
            data: { nome: "Digistore24 Product", plataforma: "Digistore24", nicho: "Nutra", comissao_media: 80, cpa_meta: 40 }
          });
        }

        const venda = await fastify.db.vendaAfiliado.create({
          data: {
            transacao_id: transacaoId,
            produto_id: produto.id,
            valor_comissao_usd: comissao,
            tipo_evento: tipoEvento,
            email_cliente: email,
          }
        });

        if (email) {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "cliente_digistore24"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Fechado",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        }

        return reply.status(200).send({ success: true, message: "Venda Digistore24 persistida.", venda });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar Digistore24 Webhook." });
      }
    }

    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Venda Digistore24 recebida sem persistir.",
      data: { transaction_id: transacaoId, transaction_type: tipoEvento, amount: comissao }
    });
  });

  // Webhook disparado pela MaxWeb
  fastify.post("/api/webhooks/maxweb", async (request, reply) => {
    // GSD Webhook Security: Validação de Token de API via Query parameter
    const { token } = request.query as any;
    if (token !== fastify.config.WEBHOOK_SECRET_MAXWEB) {
      fastify.log.warn(`Tentativa de acesso não autorizado ao Webhook da MaxWeb.`);
      return reply.status(401).send({ error: "Unauthorized." });
    }

    const data = request.body as any;
    fastify.log.info(`Recebido webhook da MaxWeb. Transação: ${data.txid || 'N/A'}`);

    const transacaoId = data.txid || uuidv4().substring(0, 8).toUpperCase();
    const tipoEvento = data.event || "SALE";
    const comissao = parseFloat(data.payout) || 0;
    const email = data.email || null;

    // Tratamento de Abandono de Checkout MaxWeb
    if (tipoEvento === "abandoned" || tipoEvento === "initiated" || tipoEvento === "checkout_initiated") {
      const nome = data.name || data.first_name || "Cliente";
      const telefone = data.phone || data.telephone || null;

      if (fastify.dbConnected && email) {
        try {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "abandono_checkout_maxweb"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Novo Lead",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        } catch (error) {
          fastify.log.error(error, "Erro ao atualizar lead de abandono da MaxWeb no DB");
        }
      }

      if (telefone || email) {
        await dispararSmsRecuperacao(fastify, telefone, nome, "MaxWeb Product", email);
      }

      return reply.status(200).send({ success: true, message: "Abandono MaxWeb processado." });
    }

    if (fastify.dbConnected) {
      try {
        let produto = await fastify.db.produtoAfiliado.findFirst({ where: { plataforma: "MaxWeb" }});
        if (!produto) {
          produto = await fastify.db.produtoAfiliado.create({
            data: { nome: "MaxWeb Product", plataforma: "MaxWeb", nicho: "Nutra", comissao_media: 90, cpa_meta: 45 }
          });
        }

        const venda = await fastify.db.vendaAfiliado.create({
          data: {
            transacao_id: transacaoId,
            produto_id: produto.id,
            valor_comissao_usd: comissao,
            tipo_evento: tipoEvento,
            email_cliente: email,
          }
        });

        if (email) {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "cliente_maxweb"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Fechado",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        }

        return reply.status(200).send({ success: true, message: "Venda MaxWeb persistida.", venda });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar MaxWeb Webhook." });
      }
    }

    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Venda MaxWeb recebida sem persistir.",
      data: { txid: transacaoId, event: tipoEvento, payout: comissao }
    });
  });

  // Webhook disparado pela GuruMedia
  fastify.post("/api/webhooks/gurumedia", async (request, reply) => {
    // GSD Webhook Security: Validação de Token de API via Query parameter
    const { token } = request.query as any;
    if (token !== fastify.config.WEBHOOK_SECRET_GURUMEDIA) {
      fastify.log.warn(`Tentativa de acesso não autorizado ao Webhook da GuruMedia.`);
      return reply.status(401).send({ error: "Unauthorized." });
    }

    const data = request.body as any;
    fastify.log.info(`Recebido webhook da GuruMedia. Transação: ${data.transaction_id || 'N/A'}`);

    const transacaoId = data.transaction_id || uuidv4().substring(0, 8).toUpperCase();
    const tipoEvento = data.event || "SALE";
    const comissao = parseFloat(data.payout) || 0;
    const email = data.email || null;

    // Tratamento de Abandono de Checkout GuruMedia
    if (tipoEvento === "abandoned" || tipoEvento === "initiated" || tipoEvento === "checkout_initiated") {
      const nome = data.name || data.first_name || "Cliente";
      const telefone = data.phone || data.telephone || null;

      if (fastify.dbConnected && email) {
        try {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "abandono_checkout_gurumedia"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Novo Lead",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        } catch (error) {
          fastify.log.error(error, "Erro ao atualizar lead de abandono da GuruMedia no DB");
        }
      }

      if (telefone || email) {
        await dispararSmsRecuperacao(fastify, telefone, nome, "GuruMedia Product", email);
      }

      return reply.status(200).send({ success: true, message: "Abandono GuruMedia processado." });
    }

    if (fastify.dbConnected) {
      try {
        let produto = await fastify.db.produtoAfiliado.findFirst({ where: { plataforma: "GuruMedia" }});
        if (!produto) {
          produto = await fastify.db.produtoAfiliado.create({
            data: { nome: "GuruMedia Product", plataforma: "GuruMedia", nicho: "Nutra", comissao_media: 100, cpa_meta: 50 }
          });
        }

        const venda = await fastify.db.vendaAfiliado.create({
          data: {
            transacao_id: transacaoId,
            produto_id: produto.id,
            valor_comissao_usd: comissao,
            tipo_evento: tipoEvento,
            email_cliente: email,
          }
        });

        if (email) {
          const leadExistente = await fastify.db.lead.findUnique({ where: { email } });
          if (leadExistente) {
            const novasTags = Array.from(new Set([...leadExistente.tags, "cliente_gurumedia"]));
            await fastify.db.lead.update({
              where: { email },
              data: {
                status: "Fechado",
                ultima_interacao: new Date(),
                tags: novasTags
              }
            });
          }
        }

        return reply.status(200).send({ success: true, message: "Venda GuruMedia persistida.", venda });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar GuruMedia Webhook." });
      }
    }

    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Venda GuruMedia recebida sem persistir.",
      data: { transaction_id: transacaoId, event: tipoEvento, payout: comissao }
    });
  });

  // Webhook disparado pelo n8n contendo os dados de Ads
  fastify.post("/api/webhooks/n8n-ads", async (request, reply) => {
    const data = request.body as any;
    fastify.log.info(`Recebido webhook do n8n para Ads. Plataforma: ${data?.plataforma || 'Desconhecida'}`);

    if (fastify.dbConnected) {
      try {
        const campanhasInput = data.campanhas || [];
        const processadas = [];

        for (const c of campanhasInput) {
          const nomeCampanha = c.campaign_name;
          const spend = parseFloat(c.spend) || 0;
          const revenue = parseFloat(c.revenue) || 0;

          if (!nomeCampanha) continue;

          // Localizar produto padrão ClickBank ou criar para vincular a campanha se for nova
          let produto = await fastify.db.produtoAfiliado.findFirst();
          if (!produto) {
            produto = await fastify.db.produtoAfiliado.create({
              data: { nome: "Produto ClickBank Padrao", plataforma: "ClickBank", nicho: "Nutra", comissao_media: 100, cpa_meta: 50 }
            });
          }

          // Procurar campanha por nome
          let campanha = await fastify.db.campanha.findFirst({
            where: { nome: nomeCampanha }
          });

          if (campanha) {
            // Atualiza os valores
            campanha = await fastify.db.campanha.update({
              where: { id: campanha.id },
              data: {
                investimento_ads_usd: spend,
                faturamento_bruto_usd: revenue
              }
            });
          } else {
            // Cria nova campanha
            campanha = await fastify.db.campanha.create({
              data: {
                nome: nomeCampanha,
                produto_id: produto.id,
                inicio: new Date(),
                fim: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 dias de duração padrão
                investimento_ads_usd: spend,
                faturamento_bruto_usd: revenue
              }
            });
          }
          processadas.push(campanha);
        }

        return reply.status(200).send({ 
          success: true, 
          message: `${processadas.length} campanhas de Ads sincronizadas com sucesso no CRM.`,
          campanhas: processadas
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar n8n-ads Webhook." });
      }
    }

    // Modo Mock
    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Dados de Ads do n8n recebidos sem persistir no banco.",
      payload: data
    });
  });

  // Webhook disparado pelo n8n contendo os produtos ClickBank minerados
  fastify.post("/api/webhooks/n8n-products", async (request, reply) => {
    const data = request.body as any;
    fastify.log.info("Recebido webhook do n8n para mineracao de produtos ClickBank.");

    if (fastify.dbConnected) {
      try {
        const produtosInput = data.produtos || [];
        const processados = [];

        for (const p of produtosInput) {
          const nomeProduto = p.nome;
          const comissao = parseFloat(p.comissao) || 100;

          if (!nomeProduto) continue;

          // Localiza ou cria o produto ClickBank de forma segura pelo nome
          let produto = await fastify.db.produtoAfiliado.findFirst({
            where: { nome: nomeProduto, plataforma: "ClickBank" }
          });

          if (produto) {
            produto = await fastify.db.produtoAfiliado.update({
              where: { id: produto.id },
              data: { comissao_media: comissao }
            });
          } else {
            produto = await fastify.db.produtoAfiliado.create({
              data: {
                nome: nomeProduto,
                plataforma: "ClickBank",
                nicho: "Nutra",
                comissao_media: comissao,
                cpa_meta: comissao / 2
              }
            });
          }
          processados.push(produto);
        }

        return reply.status(200).send({
          success: true,
          message: `${processados.length} produtos ClickBank minerados salvos no CRM.`,
          produtos: processados
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Erro ao processar n8n-products Webhook." });
      }
    }

    return reply.status(200).send({
      success: true,
      message: "Modo simulacao ativo. Produtos do n8n recebidos sem persistir.",
      payload: data
    });
  });
}
