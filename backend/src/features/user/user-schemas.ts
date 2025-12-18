import { z } from "zod";

export const $user = z.object({
  id: z.uuid().trim(),
  version: z.number().default(0),
  name: z.string().min(2).max(50).trim(),
  email: z.email("Invalid email").toLowerCase().trim(),
  status: z
    .enum(["PENDING", "ACTIVE", "INACTIVE", "BLOCKED", "SUSPENDED", "DELETED"])
    .default("PENDING"),
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

export type User = z.infer<typeof $user>;
export type NewUser = z.infer<typeof $newUser>;
