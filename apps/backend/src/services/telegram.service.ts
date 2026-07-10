import TelegramBot from "node-telegram-bot-api";
import type { FastifyBaseLogger } from "fastify";

const token = process.env.TELEGRAM_BOT_TOKEN || "MOCK_BOT_TOKEN";
const chatId = process.env.TELEGRAM_CHAT_ID || "MOCK_CHAT_ID";

// Polling false pois vamos apenas enviar mensagens proativamente
const bot = new TelegramBot(token, { polling: false });

export const sendLeadNotification = async (leadInfo: { nome: string; telefone: string; email: string }, logger: FastifyBaseLogger) => {
  const message = `🚀 *Novo Lead Capturado!*\n\n*Nome:* ${leadInfo.nome}\n*Telefone:* ${leadInfo.telefone || "Não informado"}\n*Email:* ${leadInfo.email}`;

  try {
    if (token.includes("MOCK")) {
      logger.info(`[MOCK TELEGRAM] Simulando notificacao: ${message.replace(/\n/g, ' ')}`);
      return { success: true, mocked: true };
    }

    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    logger.info(`[TELEGRAM] Notificacao enviada com sucesso para o Chat ID ${chatId}`);
    return { success: true };
  } catch (error) {
    logger.error(`[TELEGRAM] Erro ao enviar notificacao: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};

export const sendAdsReportNotification = async (relatorio: string, logger: FastifyBaseLogger) => {
  const formattedMessage = `📊 *Relatório de Performance de Ads - IA*\n\n${relatorio}`;

  try {
    if (token.includes("MOCK")) {
      logger.info(`[MOCK TELEGRAM] Simulando envio de relatorio de Ads no Telegram.`);
      return { success: true, mocked: true };
    }

    const safeMessage = formattedMessage.length > 4000 
      ? formattedMessage.substring(0, 3950) + "\n\n...(Relatório muito longo, truncado)..."
      : formattedMessage;

    await bot.sendMessage(chatId, safeMessage, { parse_mode: "Markdown" });
    logger.info(`[TELEGRAM] Relatório de Ads enviado com sucesso para o Chat ID ${chatId}`);
    return { success: true };
  } catch (error) {
    logger.error(`[TELEGRAM] Erro ao enviar relatório de Ads: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};
