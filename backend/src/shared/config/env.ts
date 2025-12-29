import { config } from "dotenv";
import path from "path";

// Load .env file from backend directory
config({ path: path.resolve(__dirname, "../../.env") });

// Required environment variables
const requiredEnvVars = ["TABLE", "STAGE"] as const;

// Validate required environment variables
function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please check your .env file or environment configuration.`
    );
  }

  // Warn if using default JWT_SECRET in production
  if (
    process.env.STAGE === "prod" &&
    (!process.env.JWT_SECRET || process.env.JWT_SECRET === "dev-secret-change-in-production")
  ) {
    throw new Error(
      "JWT_SECRET must be set to a secure value in production environment.\n" +
        "Using default secret is a critical security vulnerability."
    );
  }
}

// Run validation
validateEnv();

// Export for convenience
export const env = {
  TABLE: process.env.TABLE!,
  STAGE: process.env.STAGE!,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-in-production",
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
  JWT_CONFIRMATION_TOKEN_EXPIRY: process.env.JWT_CONFIRMATION_TOKEN_EXPIRY || "15m",
  JWT_CREDENTIAL_RESET_TOKEN_EXPIRY: process.env.JWT_CREDENTIAL_RESET_TOKEN_EXPIRY || "5m",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
