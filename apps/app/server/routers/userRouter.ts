import { z } from "zod";
import { hash, compare } from 'bcryptjs';
import Stripe from "stripe";
import { Frequency } from "@prisma/client";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { auth as nhostAuth } from "~/utils/backend/nhost";
import { backendIdentify as identify, formatUserForIdentify, trackPasswordChanged, trackUserDeleted, trackUserUpdated } from "~/lib/analytics";
import { createCustomer, getCustomerByEmail, getCustomerSubscription, updateCustomer, cancelSubscription } from "~/lib/stripe";
import { logUserSignedUp } from "~/lib/logsnag";
import { backendIdentify, trackUserSignedIn, trackUserSignedUp } from "~/lib/analytics";
import { parseAuthError } from "~/lib/parseAuthError";
import { TRPCError } from "@trpc/server";
import { upsertJob, deleteJob } from "~/lib/easyCron";

export const userRouter = router({
  onLogIn: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx: { logger, db }, input: { email, password }}) => {
      await nhostAuth.signOut(); // Make sure user is logged out
      const { error, session } = await nhostAuth.signIn({ email, password });
      logger.info("Attempted to sign user in in nhost", { error, session: !!session })
      if ( error ) { return { error: parseAuthError(error), session: null }};

      const { id: userId, displayName: name, createdAt } = session.user;

      const dbUser = await db.user.findFirst({ where: { OR: { id: userId, email }}});
      logger.info("Searched for user in db", { result: dbUser });

      const passwordHash = await hash(password, 6);

      if ( !dbUser ) {
        const customer = await getCustomerByEmail({ email })
        .then(response => {
          logger.info("Fetched customer", { response });
          if ( response && !(response as any as Stripe.DeletedCustomer).deleted ) { return response; };
          return createCustomer({ email })
            .then(({ lastResponse, ...response }) => {
              logger.info("Created customer", { response });
              return response;
            })
        });

        await db.user.create({
          data: {
            id: userId,
            name,
            email,
            passwordHash,
            stripeCustomerId: customer.id,
            createdAt
          }
        }).then(user => logger.info("User created", { user }))
      }

      if ( dbUser ) {
        const doesPasswordMatch = dbUser.passwordHash 
          ? (await compare(password, dbUser.passwordHash)) 
          : false;
        
        if ( !doesPasswordMatch ) {
          if ( dbUser.passwordHash ) { logger.info("DB User has password, but its hash doesn't match") };
          await db.user.update({
            where: { id: userId },
            data: { passwordHash }
          }).then(response => logger.info("Updated user", { response }));
        }
      }

      await trackUserSignedIn({ userId, provider: 'credentials' });
      return { session, error: null }
    }),

  onSignUp: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string()
      })
    )
    .mutation(async ({ ctx: { logger, db }, input: { email, password, name }}) => {
      await nhostAuth.signOut(); // Make sure user is logged out
      const { error, session } = await nhostAuth.signUp({ email, password, options: { displayName: name }});
      logger.info("Attempted to sign user up in nhost", { error, session: !!session })
      if ( error ) { return { error: parseAuthError(error), session: null }};
      const userId = session?.user.id!;

      const passwordHash = await hash(password, 6);
      const customer = await getCustomerByEmail({ email })
        .then(response => {
          logger.info("Fetched customer", { response });
          if ( response && !(response as any as Stripe.DeletedCustomer).deleted ) { return response; };
          return createCustomer({ email })
            .then(({ lastResponse, ...response }) => {
              logger.info("Created customer", { response });
              return response;
            })
        })

      await Promise.all([
          db.user.create({
          data: {
            id: userId,
            name,
            email,
            passwordHash,
            stripeCustomerId: customer.id,
            createdAt: session?.user.createdAt
          }
        }).then(user => logger.info("User created", { user })),

        logUserSignedUp({ name, email, userId }),

        trackUserSignedUp({ userId, provider: 'credentials' }),

        backendIdentify({ 
          userId,
          traits: {
            email,
            name,
            created_at: new Date(session?.user.createdAt!)
          }
        })
      ])

      return { error: null, session }
    }),

    getUser: protectedProcedure
      .query(async ({ ctx: { session, db }}) => {
        const userId = session.user.id;
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
    .mutation(async ({ ctx: { session, logger, db }, input }) => {
      const userId = session!.user.id;
      const originalUser = await db.user.findFirstOrThrow({ where: { id: userId }});
      const user = await db.user.update({ where: { id: userId }, data: input })
      logger.info("Updated user", { user })
      if ( !user ) { throw new TRPCError({ code: 'NOT_FOUND' })};

      const field = Object.keys(input)[0];

      const updateStripeNamePromise = field === 'name'
        ? updateCustomer({ customerId: user.stripeCustomerId, properties: { name: input.name }})
          .then(({ lastResponse, ...customer }) => logger.info("Updated Stripe customer with new name", { customer }))
        : Promise.resolve();

      const trackUserUpdatedPromise = trackUserUpdated({ 
        userId, 
        field, // Should only be able to change one field at a time
        oldValue: originalUser[field],
        newValue: input[field]
      })
      logger.info("Tracked user updated event", { field });

      const upsertJobPromise = ['isSubscribedPeriodicUpdates', 'periodicUpdatesFrequency', 'timezone'].includes(field)
        ? upsertJob({ 
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
        : Promise.resolve()

      // Identify user with new attributes
      const traits = formatUserForIdentify({ user });

      const identifyPromise = identify({
        userId,
        traits
      })
      logger.info("Identified user with new traits", { traits })

      await Promise.all([
        updateStripeNamePromise,
        trackUserUpdatedPromise,
        upsertJobPromise,
        identifyPromise
      ])
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

        const traits = {
          unsubscribed: true,
          email: "",
          name: "",
          deleted_at: new Date()
        }
        const identifyPromise = identify({
          userId,
          traits
        }).then(() => logger.info("Identified user with new traits", { traits }))

        const trackEventPromise = trackUserDeleted({ userId }).then(() => logger.info("Track user deleted event"))

        // TODO: Disable Plaid Items

        // TODO: Disable Destinations

        const updateUserPromise = db.user.update({ where: { id: userId }, data: { disabledAt: new Date(), name: null, email: null }})
          .then(response => {
            logger.info("Updated user", { user: response });
            return response
          })

        await Promise.all([
          identifyPromise, 
          trackEventPromise,
          updateUserPromise
        ])
      }),

    changePassword: publicProcedure
    .input(
      z.object({
        password: z.string()
      })
    )
    .mutation(async ({ ctx: { session, db, logger }, input: { password }}) => {
      const userId = session!.user.id;
      const passwordHash = await hash(password, 6);
      
      return Promise.all([
        db.user.update({ where: { id: userId }, data: { passwordHash }}).then(() => logger.info("Updated password hash")),

        trackPasswordChanged({ userId }).then(() => logger.info("Tracked password changed event"))
      ])
    })
})