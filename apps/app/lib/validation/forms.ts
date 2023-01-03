import z from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  name: z.optional(z.string()),
  password: z.optional(z.string().min(8))
});

export const supportTicketSchema = z.object({
  body: z.string().min(1),
  subject: z.string().min(1)
})

export const changePasswordSchema = z.object({
  password: z.string().min(8)
})

export type IAuthSchema = z.infer<typeof authSchema>;
export type ISupportTicketSchema = z.infer<typeof supportTicketSchema>;
export type IChangePasswordSchema = z.infer<typeof changePasswordSchema>;