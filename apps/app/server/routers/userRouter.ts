import { Frequency } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { formatUserForIdentify, backendIdentify as identify, trackUserUpdated } from "~/lib/analytics";
import { deleteJob, upsertJob } from "~/lib/easyCron";
import { cancelSubscription, getCustomerSubscription } from "~/lib/stripe";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = router({
  getUser: protectedProcedure
    .query(async ({ ctx: { session, db } }) => {
      const userId = session!.user.id;
      return db.user.findFirstOrThrow({ where: { id: userId }})
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.optional(z.string()),
        isSubscribedPeriodicUpdates: z.optional(z.boolean()),
        isSubsribedGeneral: z.optional(z.boolean()),
        periodicUpdatesFrequency: z.optional(z.nativeEnum(Frequency)),
        timezone: z.optional(z.string())
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input }) => {
      const userId = session!.user.id;
      const user = await db.user.update({ where: { id: userId }, data: input })
      logger.info("Updated user", { user })
      if ( !user ) { throw new TRPCError({ code: 'NOT_FOUND' })}

      const field = Object.keys(input)[0];
      await trackUserUpdated({ 
        userId, 
        field // Should only be able to change one field at a time
      })
      logger.info("Tracked user updated event", { field })

      // Update cron job if needed
      if ( ['isSubscribedPeriodicUpdates', 'periodicUpdatesFrequency', 'timezone'].includes(field) ) {
        await upsertJob({ 
          jobId: user.periodicUpdatesJobId || undefined, 
          job: {
            userId,
            frequency: user.periodicUpdatesFrequency,
            timezone: user.timezone,
            isEnabled: user.isSubscribedPeriodicUpdates
          } 
        })
        .then(async response => {
          logger.info("Upserted job", { response })
          if ( !user.periodicUpdatesJobId ) {
            return db.user.update({ where: { id: userId }, data: { periodicUpdatesJobId: response.cron_job_id }})
            .then(response => logger.info("Updated user with jobId", { response }))
          }
        })
      }

      // Identify user with new attributes
      const traits = formatUserForIdentify({ user });

      await identify({
        userId,
        traits
      })
      logger.info("Identified user with new traits", { traits })
      return user
    }),

  disableUser: publicProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .mutation(async ({ ctx: { db, logger }, input: { userId }}) => {
      const user = await db.user.findFirstOrThrow({ where: { id: userId }});
      logger.info("Fetched user", { user });

      const subscription = await getCustomerSubscription({ customerId: user.stripeCustomerId });
      logger.info("Get subscription", { subscription })

      // Cancel subscription
      if ( subscription && !['canceled', 'incomplete_expired'].includes(subscription.status) ) {
        await cancelSubscription({ subscriptionId: subscription.id })
          .then(({ lastResponse, ...response }) => logger.info("Canceled subscription", { response }))
      }

      // Delete sync job
      if ( user.periodicUpdatesJobId ) {
        await deleteJob({ jobId: user.periodicUpdatesJobId })
          .then(response => logger.info("Deleted EasyCron job", { response }))
          .catch(error => console.log(error))
      }

      // TODO: Disable Plaid Items

      // TODO: Disable Destinations

      // TODO: Remove Destination Accounts

      await db.user.update({ where: { id: userId }, data: { disabledAt: new Date(), name: null, email: null }})
        .then(response => {
          logger.info("Updated user", { user: response });
          return response
        })
    })
});