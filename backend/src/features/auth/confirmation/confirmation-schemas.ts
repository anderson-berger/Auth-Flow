// backend/src/features/auth/confirmation/confirmation-schemas.ts
import { z } from "zod";

/**
 * Confirm Email Request validation schema
 */
export const $confirmEmailRequest = z.object({
  token: z.string().min(1, "Token is required"),
});

/**
 * Confirm Email Response validation schema
 */
export const $confirmEmailResponse = z.object({
  message: z.string(),
  email: z.string().email(),
});

/**
 * Types inferred from schemas
 */
export type ConfirmEmailRequest = z.infer<typeof $confirmEmailRequest>;
export type ConfirmEmailResponse = z.infer<typeof $confirmEmailResponse>;
