import { createServer } from "@graphql-yoga/node";
import type { Request, Response } from "express";
import Stripe from "stripe";
import moment from "moment-timezone"; 

import * as analytics from "~/utils/backend/analytics";
import * as stripe from "~/lib/stripe";
import { graphql } from "~/graphql/backend";

import { AllUserProfileFieldsFragment, Frequencies_Enum } from "~/graphql/backend/sdk";

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
        stripePrices: async () => {
          // const logger = new Logger({});
          // logger.info("stripePrices graphql request started");

          return stripe.getPrices({ active: true })
          .then(async response => {
            // logger.info("Stripe prices retrieved", { response });
            const data = response.data.map(price => ({
              id: price.id,
              interval: price.recurring?.interval,
              unitAmount: (price.unit_amount || 0) / 100.0,
              productId: price.product.toString()
            }))

            // await logger.info("stripePrices graphql request finished", { data })
            return data;
          })
          .catch(async error => {
            // await logger.error(error).then(async () => logger.info("stripePrices graphql request finished"));
            throw error
          })
        },
        remoteSchemaUserProfile: async (_, { userId } : { userId: string }) => { 
          // const logger = new Logger({ context: {user: { id: userId }}});
          // logger.info("user profile graphql request started");
          try {
            let userProfile: AllUserProfileFieldsFragment;
            let customer: Stripe.Customer;

            const [ user, getUserProfileResponse ] = await Promise.all([
              graphql.GetBaseUser({ userId }).then(response => {
                // logger.debug("Get user request response", { response });
                return response.user!
              }),
              graphql.GetUserProfile({ userId }).then(response => {
                // logger.debug("Get user profile request response", { response });
                return response;
              })
            ])
            if ( getUserProfileResponse.userProfile && !!getUserProfileResponse.userProfile.stripeCustomerId ) {
              userProfile = getUserProfileResponse.userProfile;
              customer = await stripe.getCustomer({ customerId: userProfile.stripeCustomerId!})
              .then(response => {
                // logger.debug("Get customer response", { response })
                if ( response?.deleted ) {
                  return stripe.upsertCustomer({ userId, email: user.email, name: user.displayName })
                  .then(resp => {
                    // logger.debug("Old customer deleted. New customer upserted", { customer: resp })
                    return graphql.UpdateUserProfile({ userId, _set: { stripeCustomerId: resp.id }})
                    .then(() => resp)
                  })
                }
                return response as Stripe.Customer;
              })
            } else {
              customer = await stripe.upsertCustomer({ userId: userId, email: user.email, name: user.displayName });
              // logger.debug("Customer upserted", { customer });

              userProfile = await graphql.UpsertUserProfile({ userProfile: {
                userId: userId,
                timezone: user.metadata.timezone || 'America/New_York',
                stripeCustomerId: customer.id,
                isSubscribedGeneral: true,
                isSubscribedSyncUpdates: true,
                syncUpdatesFrequency: Frequencies_Enum.Weekly
              }}).then(response => response.userProfile! )
              // logger.debug("userProfile upserted", { userProfile })
            }
            const data = {
              isSubscribedGeneral: userProfile.isSubscribedGeneral,
              isSubscribedSyncUpdates: userProfile.isSubscribedSyncUpdates,
              stripeCustomerId: customer.id,
              syncUpdatesFrequency: userProfile.syncUpdatesFrequency,
              syncUpdatesJobId: userProfile.syncUpdatesJobId,
              timezone: userProfile.timezone
            }
            // await logger.info("user profile graphql request finished", { data });
            return data;
          } catch (error) {
            // logger.error(error)
          }
        },
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
        stripeData: async ({ stripeCustomerId: customerId } : { stripeCustomerId: string }) => {
          // const logger = new Logger({ context: { customerId }});
          // logger.info("stripeData graphql request started");

          try {
            const customer = await stripe.getCustomer({ customerId }).then(response => {
              // logger.info("Customer fetched", { response })
              return response as Stripe.Customer // stripeData should always be called after fetching profile, so can assume customer isn't deleted
            })

            const subscription = await stripe.getCustomerSubscription({ customerId })
            .then(subscription => {
              // logger.info("Subscriptions fetched", { response });
              return {
                id: subscription.id,
                status: subscription.status,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                trialStartedAt: subscription.trial_start ? moment.unix(subscription.trial_start).toDate() : undefined,
                trialEndedAt: subscription.trial_end ? moment.unix(subscription.trial_end).toDate() : undefined,
                startedAt: moment.unix(subscription.start_date).toDate(),
                endedAt: subscription.ended_at ? moment.unix(subscription.ended_at).toDate() : undefined,
                currentPeriodStart: moment.unix(subscription.current_period_start).toDate(),
                currentPeriodEnd: moment.unix(subscription.current_period_end).toDate(),
                interval: subscription.items.data[0]?.plan.interval,
                canceledAt: subscription.canceled_at ? moment.unix(subscription.canceled_at).toDate() : undefined,
                trial_end: subscription.trial_end
              }
            });

            const trialEndsAt = stripe.calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription?.trial_end, customer })

            const data = {
              hasAppAccess: subscription 
                ? [ "active", "incomplete", "past_due", "trialing"].includes(subscription.status)
                : moment(trialEndsAt).isSameOrAfter(moment()),
              trialEndsAt,
              customer: { id: customer!.id, createdAt: moment.unix(customer!.created).toDate() },
              subscription 
            }

            await analytics.flushAnalytics();
            // await logger.info("stripeData graphql request finished", { data })
            return data
          } catch (error) {
            await analytics.flushAnalytics()
            // await logger.error(error)
            throw error;
          }
        },
      }
    }
  }
})