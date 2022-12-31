import { createServer } from "@graphql-yoga/node";
import type { Request, Response } from "express";

// TODO: Delete this file after fully moving to nhost

export default createServer<{ req: Request; res: Response }>({
  context: () => {},
  schema: {
    typeDefs: /* Graphql */ `
      scalar uuid
      scalar Date

      type Query {
        stripePrices: [StripePrice!]!
        remoteSchemaUserProfile(userId: uuid!): RemoteSchemaUserProfile!
        checkoutPortalSession(customerId: String!, priceId: String!, successUrl: String!, cancelUrl: String!, trialEnd: Int, trialPeriodDays: Int): CheckoutPortalSession!
        billingPortalSession(customerId: String!, returnUrl: String!): BillingPortalSession!
      }

      type CheckoutPortalSession {
        id: String!
        url: String!
      }

      type BillingPortalSession {
        id: String!
        url: String!
      }

      enum PriceInterval {
        year
        month
        week
        day
      }

      enum SubscriptionStatus {
        active
        past_due
        unpaid
        canceled
        incomplete
        incomplete_expired
        trialing
      }

      enum SyncUpdatesFrequency {
        daily
        monthly
        quarterly
        weekly
        yearly
      }

      type StripePrice {
        id: String!
        interval: PriceInterval!
        unitAmount: Float!
        productId: String!
      }

      type StripeCustomer {
        id: String!
        createdAt: Date!
      }

      type RemoteSchemaUserProfile {
        isSubscribedGeneral: Boolean!
        isSubscribedSyncUpdates: Boolean!
        stripeCustomerId: String!
        syncUpdatesFrequency: SyncUpdatesFrequency!
        syncUpdatesJobId: String
        timezone: String
        stripeData: StripeData!
      }

      type StripeSubscription {
        id: String!
        status: SubscriptionStatus!
        cancelAtPeriodEnd: Boolean!
        trialStartedAt: Date
        trialEndedAt: Date
        startedAt: Date!
        endedAt: Date
        currentPeriodStart: Date!
        currentPeriodEnd: Date!
        interval: PriceInterval!
        canceledAt: Date
      }

      type StripeData {
        trialEndsAt: Date!
        hasAppAccess: Boolean!
        customer: StripeCustomer!
        subscription: StripeSubscription
      }
    `,
    resolvers: { 
      Query: {
        stripePrices: async () => {},
        remoteSchemaUserProfile: async (_, { userId } : { userId: string }) => {},
        checkoutPortalSession: async (_, props: { 
          customerId: string, priceId: string, successUrl: string, cancelUrl: string, trialEnd?: number, trialPeriodDays?: number
        }) => {
          return {}
        },
        billingPortalSession: async (_, props: { customerId: string; returnUrl: string }) => {
          return {}
        }
      },
      RemoteSchemaUserProfile: {
        stripeData: async ({ stripeCustomerId: customerId } : { stripeCustomerId: string }) => {},
      }
    }
  }
})