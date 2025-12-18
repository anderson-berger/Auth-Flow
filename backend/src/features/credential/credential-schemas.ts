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

export type Credential = z.infer<typeof $credential>;
export type NewCredential = z.infer<typeof $newCredential>;
