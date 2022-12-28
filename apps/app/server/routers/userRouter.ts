import { z } from "zod";
import { hash } from 'bcryptjs';

import { router, publicProcedure } from "../trpc";
import { nhost } from "~/utils/nhost";
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
      const { error, session } = await nhost.auth.signUp({ email, password, options: { displayName: name }});
      logger.info("Attempted to sign user up in nhost", { error, session })
      if ( error ) { return { error }};

      const userId = session?.user.id!;
      const passwordHash = await hash(password, 26);

      const customer = await getCustomerByEmail({ email })
        .then(response => {
          logger.info("Fetched customer", { response });
          if ( response && !response.deleted ) { return response; };
          return createCustomer({ email })
            .then(response => {
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

        trackUserSignedUp({ userId, provider: 'email' }),

        backendIdentify({ 
          userId,
          traits: {
            email,
            name,
            created_at: new Date(session?.user.createdAt!)
          }
        })
      ])

      return { error: null }
    })

})