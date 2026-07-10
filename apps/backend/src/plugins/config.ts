import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

const schema = {
  type: "object",
  required: ["DATABASE_URL", "JWT_SECRET"],
  properties: {
    PORT: { type: "string", default: "3001" },
    DATABASE_URL: { type: "string" },
    JWT_SECRET: { type: "string" },
    OPENAI_API_KEY: { type: "string" },
    META_APP_ID: { type: "string" },
    META_APP_SECRET: { type: "string" },
    META_ACCESS_TOKEN: { type: "string" },
    META_AD_ACCOUNT_ID: { type: "string" },
    MESSENGER_PAGE_ACCESS_TOKEN: { type: "string" },
    MESSENGER_VERIFY_TOKEN: { type: "string" },
    TWILIO_ACCOUNT_SID: { type: "string" },
    TWILIO_AUTH_TOKEN: { type: "string" },
    TWILIO_FROM_NUMBER: { type: "string" },
    SYSTEMEIO_API_KEY: { type: "string" },
    WEBHOOK_SECRET_CLICKBANK: { type: "string" },
    WEBHOOK_SECRET_BUYGOODS: { type: "string" },
    WEBHOOK_SECRET_DIGISTORE: { type: "string" },
    WEBHOOK_SECRET_MAXWEB: { type: "string" },
    WEBHOOK_SECRET_GURUMEDIA: { type: "string" },
    GOOGLE_ADS_CLIENT_ID: { type: "string" },
    GOOGLE_ADS_CLIENT_SECRET: { type: "string" },
    GOOGLE_ADS_DEVELOPER_TOKEN: { type: "string" },
    GOOGLE_ADS_REFRESH_TOKEN: { type: "string" },
    REDIS_URL: { type: "string" },
    NODE_ENV: { type: "string", default: "development" }
  }
};

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      OPENAI_API_KEY: string;
      META_APP_ID: string;
      META_APP_SECRET: string;
      META_ACCESS_TOKEN: string;
      META_AD_ACCOUNT_ID: string;
      MESSENGER_PAGE_ACCESS_TOKEN: string;
      MESSENGER_VERIFY_TOKEN: string;
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      TWILIO_FROM_NUMBER: string;
      SYSTEMEIO_API_KEY: string;
      WEBHOOK_SECRET_CLICKBANK: string;
      WEBHOOK_SECRET_BUYGOODS: string;
      WEBHOOK_SECRET_DIGISTORE: string;
      WEBHOOK_SECRET_MAXWEB: string;
      WEBHOOK_SECRET_GURUMEDIA: string;
      GOOGLE_ADS_CLIENT_ID: string;
      GOOGLE_ADS_CLIENT_SECRET: string;
      GOOGLE_ADS_DEVELOPER_TOKEN: string;
      GOOGLE_ADS_REFRESH_TOKEN: string;
      REDIS_URL: string;
      NODE_ENV: string;
    };
  }
}

export default fp(async (fastify) => {
  await fastify.register(fastifyEnv, {
    confKey: "config",
    schema: schema,
    dotenv: {
      path: "../../.env"
    }
  });
});
