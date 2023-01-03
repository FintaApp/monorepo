import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { formatSubscriptionForIdentify, trackUserSignedIn, trackUserSignedUp } from "./analytics";
import { log } from "next-axiom";
import crypto from "crypto";
import { hash, compare } from 'bcryptjs';
import { auth as nhostAuth } from "~/utils/backend/nhost";

import * as baremetrics from "./baremetrics";
import { EMAIL_TEMPLATES, sendTransactionalEmail } from "./cio";
import { db } from "./db";
import { User } from "@prisma/client";
import { calculateTrialEndsAt, createCustomer, getCustomerByEmail, getCustomerSubscription, updateCustomer } from "./stripe";
import { logsnagInsight, logUnhandledEvent, logUserSignedUp } from "./logsnag";
import { backendIdentify as identify } from "./analytics";
import { parseAuthError } from "./parseAuthError";
import Stripe from "stripe";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: "/login"
  },
  debug: true,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
        name: { type: 'string' },
        mode: { type: 'string'}
      },
      authorize: async (credentials, req) => {
        if ( !credentials ) { throw new Error("Missing credentials")}
        const { email, password, name, mode } = credentials;

        const user = await db.user.findFirst({ where: { email }});
        const passwordHash = await hash(password, 6);
        
        if ( mode === 'login' ) {
          if ( !user ) { throw new Error("Incorrect credentials") };
          if ( user.passwordHash ) {
            const isPasswordValid = await compare(password, user.passwordHash);
            if ( isPasswordValid ) { 
              await trackUserSignedIn({ userId: user.id, provider: 'credentials' }); 
              return user; 
            } else { throw new Error("Incorrect credentials") }
          }

          // Check nhost
          await nhostAuth.signOut(); // Make sure user is logged out
          const { error } = await nhostAuth.signIn({ email, password });
          if ( error ) {
            const parsedError = parseAuthError(error);
            throw new Error(parsedError.message)
          }

          return Promise.all([
            trackUserSignedIn({ userId: user.id, provider: 'credentials' }),
            db.user.update({ where: { id: user.id }, data: { passwordHash }})
          ]).then(responses => responses[1])
        }

        // Mode === 'signup'
        const customer = await getCustomerByEmail({ email })
          .then(response => {
            if ( response && !(response as any as Stripe.DeletedCustomer).deleted ) { return response; };
            return createCustomer({ email })
              .then(({ lastResponse, ...response }) => { return response;})
          })
        
        const subscription = await getCustomerSubscription({ customerId: customer.id });
        
        return db.user.create({
          data: {
            name,
            email,
            passwordHash,
            stripeCustomerId: customer.id,
          }
        }).then(async newUser => {
          const trialEndsAt = calculateTrialEndsAt({
            subscriptionTrialEndsAt: subscription?.trial_end,
            customer
          });

          const traits = {
            name: newUser.name || undefined,
            email: newUser.email!,
            created_at: new Date(newUser.createdAt),
            ...( subscription ? formatSubscriptionForIdentify({ subscription }) : {}),
            trial_ends_at: trialEndsAt,
            timezone: newUser.timezone,
            unsubscribed: !newUser.isSubscribedGeneral,
            is_subscribed_periodic_updates: newUser.isSubscribedPeriodicUpdates,
            periodic_updates_frequency: newUser.periodicUpdatesFrequency
          }

          await Promise.all([
            logUserSignedUp({ name, email, userId: newUser.id }),

            trackUserSignedUp({ userId: newUser.id, provider: 'credentials' }),

            identify({ userId: newUser.id, traits }),

            updateCustomer({ customerId: customer.id, properties: { name: name || undefined, metadata: { user_id: newUser.id }} })
          ]);
          return newUser;
        })
      }
    }),

    EmailProvider({
      from: "noreply@finta.io",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const user = await db.user.findUnique({ 
          where: { email },
          select: { emailVerified: true, id: true }
        })
        
        const templateId = user
          ? EMAIL_TEMPLATES.SIGN_IN
          : EMAIL_TEMPLATES.ACTIVATE_ACCOUNT
        
        await sendTransactionalEmail({
          templateId,
          userId: user?.id,
          email,
          data: { url }
        })
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // TODO: Figure out why user is undefined after first jwt callback

      if ( user ) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email

        if ( (user as User).stripeCustomerId ) {
          token.stripeCustomerId = (user as User).stripeCustomerId
        }
      }
      
      return token;
    },
    session: async ({ token, session }) => {
      if ( token ) {
       session.user.id = token.id;
       session.user.name = token.name;
       session.user.email = token.email;
       session.user.stripeCustomerId = token.stripeCustomerId
      }

      return session;
    }
  },
  secret: process.env.JWT_SECRET,
  events: {
    signIn: async ({ user, isNewUser, account }) => {
      const userId = user.id;
      const provider = account?.provider;
      console.log(provider)
      if ( provider === 'credentials' ) { return; }
      if ( isNewUser ) { 
        await trackUserSignedUp({ userId, provider })
      } else {
        await trackUserSignedIn({ userId, provider })
      }
    },
    createUser: async ({ user }) => {
      const logger = log.with({ requestId: crypto.randomUUID(), userId: user.id });
      logger.info("User created", { user });

      const dbUser = user as User; // need to re-type since createUser user model only has email, id and name

      const { email, name, id: userId, stripeCustomerId: customerId, createdAt, timezone, isSubscribedGeneral, isSubscribedPeriodicUpdates, periodicUpdatesFrequency, periodicUpdatesJobId } = dbUser;
      // Update Stripe Customer
      const customer = await updateCustomer({ customerId, properties: { name: name || undefined, metadata: { user_id: userId }} });

      const subscription = await getCustomerSubscription({ customerId })
      .then(response => {
        logger.info("Fetched subscription", { response })
        return response;
      });
      const trialEndsAt = calculateTrialEndsAt({
        subscriptionTrialEndsAt: subscription?.trial_end,
        customer
      });

      const traits = {
        name: user.name || undefined,
        email: user.email!,
        created_at: new Date(createdAt),
        ...( subscription ? formatSubscriptionForIdentify({ subscription }) : {}),
        trial_ends_at: trialEndsAt,
        timezone: timezone,
        unsubscribed: !isSubscribedGeneral,
        is_subscribed_periodic_updates: isSubscribedPeriodicUpdates,
        periodic_updates_frequency: periodicUpdatesFrequency
      }

      const identifyPromise = identify({
        userId,
        traits
      })
      .then(() => logger.info("Identified user with traits", { traits }));


      const logPromise = logUserSignedUp({ name: name || undefined, email: email!, userId });

      const insightsPromise = Promise.all([
        baremetrics.metrics(),
        db.user.aggregate({ where: { disabledAt: null }, _count: true })
      ])
        .then(([{ subscriptions }, { _count: totalUsers }]) => {
          return Promise.all([
            logsnagInsight({ title: 'Trials', value: totalUsers - subscriptions.month - subscriptions.year, icon: 'hourglass'}),
            logsnagInsight({ title: 'Total Users', value: totalUsers, icon: 'user'})
          ])
        })
        .catch(err => logUnhandledEvent(err))

      await Promise.all([
        logPromise,
        identifyPromise,
        insightsPromise
      ])
    }
  }
}