import { z } from "zod";

export const $requestCredentialResetRequest = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
});

export const $requestCredentialResetResponse = z.object({
  message: z.string(),
  email: z.string().email(),
});

export const $confirmCredentialResetRequest = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const $confirmCredentialResetResponse = z.object({
  message: z.string(),
});

export type RequestCredentialResetRequest = z.infer<typeof $requestCredentialResetRequest>;
export type RequestCredentialResetResponse = z.infer<typeof $requestCredentialResetResponse>;
export type ConfirmCredentialResetRequest = z.infer<typeof $confirmCredentialResetRequest>;
export type ConfirmCredentialResetResponse = z.infer<typeof $confirmCredentialResetResponse>;
