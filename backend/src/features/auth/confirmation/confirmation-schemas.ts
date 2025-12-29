import { z } from "zod";

export const $confirmEmailRequest = z.object({
  token: z.string().min(1, "Token is required"),
});

export const $confirmEmailResponse = z.object({
  message: z.string(),
  email: z.email(),
});

export type ConfirmEmailRequest = z.infer<typeof $confirmEmailRequest>;
export type ConfirmEmailResponse = z.infer<typeof $confirmEmailResponse>;
