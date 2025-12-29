// backend/src/features/email/email-schemas.ts
import { z } from "zod";

// ===== Base Schemas =====
export const $emailType = z.enum(["CONFIRMATION", "PASSWORD_RESET", "WELCOME"]);

// ===== Template Data Schemas =====

// Dados para email de confirmação
export const $emailConfirmationData = z.object({
  userName: z.string().min(1),
  confirmationToken: z.string().min(1),
  confirmationUrl: z.url(),
});

export const $passwordResetData = z.object({
  userName: z.string().min(1),
  resetToken: z.string().min(1),
  resetUrl: z.url(),
});

export const $welcomeData = z.object({
  userName: z.string().min(1),
});

export const $emailResult = z.object({
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().min(1),
});

export const $emailPayload = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("CONFIRMATION"),
    to: z.email(),
    data: $emailConfirmationData,
  }),
  z.object({
    type: z.literal("PASSWORD_RESET"),
    to: z.email(),
    data: $passwordResetData,
  }),
  z.object({
    type: z.literal("WELCOME"),
    to: z.email(),
    data: $welcomeData,
  }),
]);

// ===== Types =====
export type EmailType = z.infer<typeof $emailType>;
export type EmailConfirmationData = z.infer<typeof $emailConfirmationData>;
export type PasswordResetData = z.infer<typeof $passwordResetData>;
export type WelcomeData = z.infer<typeof $welcomeData>;
export type EmailResult = z.infer<typeof $emailResult>;
export type EmailPayload = z.infer<typeof $emailPayload>;
