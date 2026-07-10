import twilio from "twilio";
import type { FastifyBaseLogger } from "fastify";

// Essas variaveis virao do .env
const accountSid = process.env.TWILIO_ACCOUNT_SID || "AC_MOCK_ACCOUNT_SID";
const authToken = process.env.TWILIO_AUTH_TOKEN || "MOCK_AUTH_TOKEN";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890";

const client = twilio(accountSid, authToken);

export const sendWelcomeSMS = async (to: string, name: string, logger: FastifyBaseLogger) => {
  if (!to) return;

  const message = `Hi ${name}, welcome! Your personalized health report is ready. Reply STOP to opt-out.`;

  try {
    // Engatilhado: se for mock, nao envia de verdade
    if (accountSid.includes("MOCK")) {
      logger.info(`[MOCK TWILIO] Simulando envio de SMS para ${to}: "${message}"`);
      return { success: true, mocked: true };
    }

    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });
    
    logger.info(`[TWILIO] SMS enviado com sucesso para ${to}. SID: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    logger.error(`[TWILIO] Erro ao enviar SMS para ${to}: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};
