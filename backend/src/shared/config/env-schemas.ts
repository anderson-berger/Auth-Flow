import { z } from "zod";

export const $baseEnv = z.object({
  // Core
  STAGE: z.enum(["local", "dev", "prod"]).default("local"),
  TABLE: z.string().min(1),

  // Frontend
  FRONTEND_URL: z.url(),

  // SES
  SES_REGION: z.string().default("sa-east-1"),
  SES_FROM_EMAIL: z.email(),
  SES_FROM_NAME: z.string().default("AuthFlow"),

  // JWT
  JWT_SECRET: z.string().min(16),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  JWT_CONFIRMATION_TOKEN_EXPIRY: z.string().default("15m"),
  JWT_CREDENTIAL_RESET_TOKEN_EXPIRY: z.string().default("5m"),

  // Security
  BCRYPT_ROUNDS: z.coerce
    .number()
    .int("BCRYPT_ROUNDS must be an integer")
    .min(8, "BCRYPT_ROUNDS must be >= 8")
    .max(15, "BCRYPT_ROUNDS must be <= 15"),
});
