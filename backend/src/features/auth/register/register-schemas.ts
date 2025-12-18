import { $user } from "@src/features/user/user-schemas";
import { z } from "zod";

/**
 * register Request validation schema
 */
export const $registerRequest = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.email("Invalid email").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters").trim(),
});

/**
 * register Response validation schema
 */
export const $registerResponse = z.object({
  message: z.string(),
  email: z.email(),
});

/**
 * Types inferred from schemas
 */
export type RegisterRequest = z.infer<typeof $registerRequest>;
export type RegisterResponse = z.infer<typeof $registerResponse>;
