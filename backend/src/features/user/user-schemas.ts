import { z } from "zod";

export const $userStatus = z.enum([
  "PENDING", // Email não confirmado
  "ACTIVE", // Conta ativa, pode fazer login
  "INACTIVE", // Desativada temporariamente pelo usuário
  "BLOCKED", // Bloqueada por admin
  "SUSPENDED", // Suspensa temporariamente
  "DELETED", // Soft delete
]);

export const $user = z.object({
  id: z.uuid(),
  version: z.number().default(1),
  name: z.string().min(2).max(50).trim(),
  email: z.email().toLowerCase().trim(),
  status: $userStatus.default("PENDING"),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $newUser = $user.omit({
  id: true,
  version: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type UserStatus = z.infer<typeof $userStatus>;
export type User = z.infer<typeof $user>;
export type NewUser = z.infer<typeof $newUser>;
