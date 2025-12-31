import { z } from "zod";

export const $credential = z.object({
  id: z.uuid(),
  version: z.number().default(1),
  userId: z.uuid(),
  passwordHash: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $newCredential = z.object({
  userId: z.uuid(),
  password: z.string().min(8),
});

export const $requestCredentialReset = z.object({
  email: z.email("Invalid email").toLowerCase().trim(),
});

export const $requestCredentialResetResponse = z.object({
  message: z.string(),
  email: z.email(),
});

export const $resetCredential = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const $resetCredentialResponse = z.object({
  message: z.string(),
});

// Types
export type Credential = z.infer<typeof $credential>;
export type NewCredential = z.infer<typeof $newCredential>;
export type RequestCredentialReset = z.infer<typeof $requestCredentialReset>;
export type RequestCredentialResetResponse = z.infer<typeof $requestCredentialResetResponse>;
export type ResetCredential = z.infer<typeof $resetCredential>;
export type ResetCredentialResponse = z.infer<typeof $resetCredentialResponse>;
