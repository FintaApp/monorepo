import { z } from "zod";
import { hash, compare } from 'bcryptjs';
import Stripe from "stripe";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { auth as nhostAuth } from "~/utils/backend/nhost";
import { createCustomer, getCustomerByEmail } from "~/lib/stripe";
import { logUserSignedUp } from "~/lib/logsnag";
import { backendIdentify, trackUserSignedIn, trackUserSignedUp } from "~/lib/analytics";
import { parseAuthError } from "~/lib/parseAuthError";

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
      })

})