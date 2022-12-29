import { z } from "zod";
import { hash } from 'bcryptjs';
import Stripe from "stripe";

import { router, publicProcedure } from "../trpc";
import { auth as nhostAuth } from "~/utils/backend/nhost";
import { createCustomer, getCustomerByEmail } from "~/lib/stripe";
import { logUserSignedUp } from "~/lib/logsnag";
import { backendIdentify, trackUserSignedUp } from "~/lib/analytics";

export const userRouter = router({
  onSignUp: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string()
      })
    )
    .mutation(async ({ ctx: { logger, db }, input: { email, password, name }}) => {
      const { error, session } = await nhostAuth.signUp({ email, password, options: { displayName: name }});
      logger.info("Attempted to sign user up in nhost", { error, session: !!session })
      if ( error ) { return { error, session: null }};
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
    })

})