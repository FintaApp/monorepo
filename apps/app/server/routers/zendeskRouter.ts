import { z } from "zod";

import { createTicket } from "~/lib/zendesk";
import { trackSupportTicketCreated } from "~/lib/analytics";
import { router, protectedProcedure } from "../trpc";

export const zendeskRouter = router({
  createSupportTicket: protectedProcedure
    .input(
      z.object({
        body: z.string(),
        subject: z.string()
      })
    )
    .mutation(async ({ ctx: { db, user, logger }, input: { subject, body }}) => {
      const { id: userId, name, email } = user;
      await createTicket({ subject, body, user: { name: name || "", email: email! }})
        .then(response => logger.info("Created support ticket", { response: response.data }))
      await trackSupportTicketCreated({ userId })
        .then(() => logger.info("Tracked support ticket created event"));

      return "OK"
    })
})