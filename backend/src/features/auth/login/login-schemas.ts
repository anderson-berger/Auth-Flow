import { z } from "zod";

/**
 * Login Request validation schema
 */
export const $loginRequest = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

/**
 * Login Response validation schema
 */
export const $loginResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
  }),
});

/**
 * Types inferred from schemas
 */
export type LoginRequest = z.infer<typeof $loginRequest>;
export type LoginResponse = z.infer<typeof $loginResponse>;
export type LoginUser = LoginResponse["user"];
