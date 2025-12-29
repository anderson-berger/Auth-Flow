import { z } from "zod";

export const $refreshTokenRequest = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const $refreshTokenResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof $refreshTokenRequest>;
export type RefreshTokenResponse = z.infer<typeof $refreshTokenResponse>;
