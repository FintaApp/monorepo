import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { trackPlaidLinkInitiated } from "~/lib/analytics";
import { createLinkToken } from "~/lib/plaid";
import { router, protectedProcedure } from "../trpc";

export const plaidRouter = router({
  createLinkToken: protectedProcedure
    .input(
      z.object({
        product: z.optional(z.enum(['transactions', 'investments'])),
        plaidItemId: z.optional(z.string()),
        isAccountSelectionEnabled: z.optional(z.boolean())
      })
    )
    .mutation(async ({ ctx: { req: { headers: { host }}, session, logger, db }, input: { product, plaidItemId, isAccountSelectionEnabled }}) => {
      const mode = plaidItemId
        ? ( isAccountSelectionEnabled ? 'addAccounts' : 'reconnect')
        : 'create'
      const userId = session!.user.id;
      const originUrl = `https://${host}`;
      const webhookURL = `${originUrl}/api/plaid/webhook`;
      const redirectUri = `${originUrl}/plaid-oauth`;

      logger.info("Host", { host });

      // TODO: Uncomment when plaidItem table is available
      // const accessToken = plaidItemId 
      //   ? await db.plaidItem.findFirstOrThrow({ where: { id: plaidItemId }, select: { accessToken: true }})
      //       .then(response => {
      //         logger.info("Get Plaid Item", { response });
      //         return response.accessToken!
      //       })
      //   : undefined;
      const accessToken = undefined;

      const { link_token: token } = await createLinkToken({
        userId,
        products: product ? [ product ] : [],
        webhookURL,
        redirectUri,
        accessToken,
        isAccountSelectionEnabled
      })
      .then(response => {
        logger.info("Link token created", { data: response.data });
        return response.data 
      })
      .catch(error => {
        logger.error(error, { data: error.response.data });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      })

      await db.linkToken.upsert({ 
        where: { userId },
        update: { token },
        create: { token, userId }
      })
      .then(response => logger.info("Link token added to db", { data: response }))

      await trackPlaidLinkInitiated({ userId, mode })
        .then(() => logger.info("Plaid Link initiated event tracked"));

      return { token };
    }),

  removeLinkToken: protectedProcedure
    .mutation(async ({ ctx: { session, logger, db }}) => {
      const userId = session!.user.id;
      return db.linkToken.delete({ where: { userId }})
        .then(response => logger.info("Link token deleted", { response }))
    }),

  getActiveLinkToken: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;
      return db.linkToken.findFirst({ where: { userId }});
    })
})