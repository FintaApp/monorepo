import { z } from "zod";
import { hash } from 'bcryptjs';
import { Frequency } from "@prisma/client";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { backendIdentify as identify, formatUserForIdentify, trackPasswordChanged, trackUserDeleted, trackUserUpdated } from "~/lib/analytics";
import {  getCustomerSubscription, updateCustomer, cancelSubscription } from "~/lib/stripe";
import { removeItem } from "~/lib/plaid";
import { logUserDeleted } from "~/lib/logsnag";

export const userRouter = router({
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.optional(z.string()),
        isSubscribedPeriodicUpdates: z.optional(z.boolean()),
        isSubscribedGeneral: z.optional(z.boolean()),
        periodicUpdatesFrequency: z.optional(z.nativeEnum(Frequency)),
        timezone: z.optional(z.string())
      })
    )
    .mutation(async ({ ctx: { user, logger, db }, input }) => {
      const userId = user.id;
      const originalUser = await db.user.findFirstOrThrow({ where: { id: userId }});
      const updatedUser = await db.user.update({ where: { id: userId }, data: input })
      logger.info("Updated user", { user: updatedUser })

      const field = Object.keys(input)[0];

      const updateStripeNamePromise = field === 'name'
        ? updateCustomer({ customerId: updatedUser.stripeCustomerId, properties: { name: input.name }})
          .then(({ lastResponse, ...customer }) => logger.info("Updated Stripe customer with new name", { customer }))
        : Promise.resolve();

      const trackUserUpdatedPromise = trackUserUpdated({ 
        userId, 
        field, // Should only be able to change one field at a time
        oldValue: originalUser[field as keyof typeof originalUser],
        newValue: input[field as keyof typeof input]
      })
      logger.info("Tracked user updated event", { field });

      // Identify user with new attributes
      const traits = formatUserForIdentify({ user: updatedUser });

      const identifyPromise = identify({
        userId,
        traits
      })
      logger.info("Identified user with new traits", { traits })

      await Promise.all([
        updateStripeNamePromise,
        trackUserUpdatedPromise,
        identifyPromise
      ]);

      return updatedUser
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

        const traits = {
          unsubscribed: true,
          email: "",
          name: "Deleted User",
          deleted_at: new Date()
        }
        const identifyPromise = identify({
          userId,
          traits
        }).then(() => logger.info("Identified user with new traits", { traits }))

        const trackEventPromise = trackUserDeleted({ userId }).then(() => logger.info("Track user deleted event"))

        const logPromise = logUserDeleted({ userId })

        await db.plaidItem.findMany({ where: { userId }})
          .then(items => Promise.all(items.map(item => removeItem({ accessToken: item.accessToken }).catch(() => null))));

        await db.plaidItem.updateMany({ where: { userId }, data: { disabledAt: new Date() }})

        await db.destination.updateMany({ where: { userId }, data: { disabledAt: new Date() }})

        const updateUserPromise = db.user.update({ where: { id: userId }, data: { disabledAt: new Date(), name: null, email: null }})
          .then(response => {
            logger.info("Updated user", { user: response });
            return response
          })

        await Promise.all([
          identifyPromise, 
          logPromise,
          trackEventPromise,
          updateUserPromise
        ])
      }),

    getUser: protectedProcedure
      .query(async ({ ctx: { user, db }}) => {
        const userId = user.id;
        return db.user.findFirstOrThrow({ 
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            isSubscribedGeneral: true,
            isSubscribedPeriodicUpdates: true,
            periodicUpdatesFrequency: true,
            stripeCustomerId: true,
            timezone: true
          }
        })
      }),

    changePassword: protectedProcedure
    .input(
      z.object({
        password: z.string()
      })
    )
    .mutation(async ({ ctx: { user, db, logger }, input: { password }}) => {
      const userId = user.id;
      const passwordHash = await hash(password, 6);
      
      return Promise.all([
        db.user.update({ where: { id: userId }, data: { passwordHash }}).then(() => logger.info("Updated password hash")),

        trackPasswordChanged({ userId }).then(() => logger.info("Tracked password changed event"))
      ])
    })
})