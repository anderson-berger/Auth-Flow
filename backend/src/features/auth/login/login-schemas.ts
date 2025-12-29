import { $user } from "@src/features/user/user-schemas";
import { z } from "zod";

export const $loginRequest = z.object({
  email: z.email("Invalid email").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

export const $loginResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: $user,
});

export type LoginRequest = z.infer<typeof $loginRequest>;
export type LoginResponse = z.infer<typeof $loginResponse>;
