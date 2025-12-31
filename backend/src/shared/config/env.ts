import { config } from "dotenv";
import path from "path";
import { $baseEnv } from "@src/shared/config/env-schemas";

const stage = process.env.STAGE ?? "local";

if (stage === "local") {
  config({
    path: path.resolve(process.cwd(), "./src/shared/config/.env.local"),
  });
}

const parsed = $baseEnv.safeParse({
  ...process.env,
  STAGE: stage,
});

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
