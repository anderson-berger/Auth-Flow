import z from "zod";

const $tokenPayload = z.object({
  userId: z.uuid(),
  email: z.email(),
});

export type TokenPayload = z.infer<typeof $tokenPayload>;
