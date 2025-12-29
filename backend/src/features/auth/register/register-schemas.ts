import { z } from "zod";

export const $registerRequest = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.email("Invalid email").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters").trim(),
});

export const $registerResponse = z.object({
  message: z.string(),
  email: z.email(),
});

export type RegisterRequest = z.infer<typeof $registerRequest>;
export type RegisterResponse = z.infer<typeof $registerResponse>;
