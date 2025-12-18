import { config } from "dotenv";
import path from "path";

// Load .env file from backend directory
config({ path: path.resolve(__dirname, "../../.env") });

// Export for convenience
export const env = {
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-in-production",
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
};
