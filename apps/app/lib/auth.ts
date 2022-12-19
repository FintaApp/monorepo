import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { formatSubscriptionForIdentify, trackUserSignedIn, trackUserSignedUp } from "./analytics";
import { log } from "next-axiom";
import crypto from "crypto";

import { EMAIL_TEMPLATES, sendTransactionalEmail } from "./cio";
import { db } from "./db";
import { User } from "@prisma/client";
import { calculateTrialEndsAt, getCustomerSubscription, updateCustomer } from "./stripe";
import { logUserSignedUp } from "./logsnag";
import { backendIdentify as identify } from "./analytics";
import { upsertJob } from "./easyCron";

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
    EmailProvider({
      from: "noreply@finta.io",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const user = await db.user.findUnique({ 
          where: { email },
          select: { emailVerified: true, id: true }
        })
        
        const templateId = user?.emailVerified
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

      const { email, name, id: userId, stripeCustomerId: customerId, createdAt, timezone, isSubsribedGeneral, isSubscribedPeriodicUpdates, periodicUpdatesFrequency, periodicUpdatesJobId } = dbUser;
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
        unsubscribed: !isSubsribedGeneral,
        is_subscribed_periodic_updates: isSubscribedPeriodicUpdates,
        periodic_updates_frequency: periodicUpdatesFrequency
      }

      const identifyPromise = identify({
        userId,
        traits
      })
      .then(() => logger.info("Identified user with traits", { traits }));


      const logPromise = logUserSignedUp({ name: name || undefined, email: email!, userId });

      const easyCronPromise = upsertJob({ 
        jobId: periodicUpdatesJobId || undefined, 
        job: {
          userId,
          frequency: periodicUpdatesFrequency,
          timezone: timezone,
          isEnabled: true
        } 
      })
      .then(async response => {
        logger.info("Upserted job", { response })
        return db.user.update({ where: { id: userId }, data: { periodicUpdatesJobId: response.cron_job_id }})
          .then(response => logger.info("Updated user with jobId", { response }))
      })

      await Promise.all([
        logPromise,
        easyCronPromise,
        identifyPromise
      ])
    }
  }
}