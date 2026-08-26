const required = ["DATABASE_URL"] as const;

export type OmnixEnv = {
  port: number;
  databaseUrl: string;
  whatsappVerifyToken?: string;
  whatsappAppSecret?: string;
  whatsappAppId?: string;
};

export function loadEnv(env: NodeJS.ProcessEnv = process.env): OmnixEnv {
  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0 && env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    port: Number(env.PORT ?? 4000),
    databaseUrl: env.DATABASE_URL ?? "",
    whatsappVerifyToken: env.WHATSAPP_VERIFY_TOKEN,
    whatsappAppSecret: env.WHATSAPP_APP_SECRET,
    whatsappAppId: env.WHATSAPP_APP_ID,
  };
}
