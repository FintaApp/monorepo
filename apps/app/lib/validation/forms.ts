import z from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  name: z.optional(z.string()),
  password: z.optional(z.string().min(8))
});

export type IAuthSchema = z.infer<typeof authSchema>;