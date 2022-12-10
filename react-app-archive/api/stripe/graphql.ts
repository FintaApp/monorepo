import { createServer } from "@graphql-yoga/node";
import type { Request, Response } from "express";
import moment from "moment-timezone";
import Stripe from "stripe";

import { stripe, graphql, logsnag, Sentry } from "../_lib";

type StripeDataProps = { user_id: string; };

export default createServer<{ req: Request; res: Response; }>({ 
  context: () => {},
  schema: {
    typeDefs: /* Graphql */ `
      scalar uuid
      scalar Date

      type Query {
        stripePrices: [StripePrice!]!
        stripeData(user_id: uuid!): StripeData!
      }

      enum Interval {
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

      type StripePrice {
        id: String!
        interval: Interval!
        unitAmount: Float!
        productId: String!
      }

      type StripeCustomer {
        id: String!
        createdAt: Date!
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
        interval: Interval!
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
          return stripe.getPrices({ active: true })
          .then(response => response.data.map(price => ({
            id: price.id,
            interval: price.recurring?.interval,
            unitAmount: (price.unit_amount || 0) / 100.0,
            productId: price.product.toString()
          }))) 
        },
        stripeData: async (_, { user_id }: StripeDataProps) => {
          const scope = new Sentry.Scope();
          scope.setUser({ id: user_id })
          try {
            let customer: Stripe.Customer;

            const user = await graphql.GetBaseUser({ user_id }).then(response => response.user)
            if ( !user ) { throw new Error("Not Found") }
            
            const customerId = user.metadata?.stripe_customer_id
            if ( customerId ) {
              customer = await stripe.getCustomer({ customerId }).then(response => response as Stripe.Customer)
            } else {
              customer = await stripe.upsertCustomer({ userId: user.id, email: user.email, name: user.display_name });
            }

            if ( customer.deleted as unknown as boolean === true ) { // TODO: Fix this
              customer = await stripe.upsertCustomer({ userId: user.id, email: user.email, name: user.display_name });
            }
            scope.setContext("Customer", { id: customer.id, deleted: customer.deleted });

            const subscription = await stripe.getSubscriptions({ status: 'all', customer: customer.id, limit: 1})
            .then(response => response.data.map(subscription => ({
              id: subscription.id,
              status: subscription.status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              trialStartedAt: subscription.trial_start ? moment.unix(subscription.trial_start).toDate() : undefined,
              trialEndedAt: subscription.trial_end ? moment.unix(subscription.trial_end).toDate() : undefined,
              startedAt: moment.unix(subscription.start_date).toDate(),
              endedAt: subscription.ended_at ? moment.unix(subscription.ended_at).toDate() : undefined,
              currentPeriodStart: moment.unix(subscription.current_period_start).toDate(),
              currentPeriodEnd: moment.unix(subscription.current_period_end).toDate(),
              interval: subscription.items.data[0].plan.interval
            }))[0]);
            scope.setContext("Subscription", { id: subscription?.id })
            const trialEndsAt = subscription?.trialEndedAt || (customer.metadata.trial_ends_at 
              ? moment.unix(parseInt(customer!.metadata.trial_ends_at)).toDate() 
              : moment.unix(customer!.created).add(14, 'days').toDate());
            scope.setContext("Trial ends at", { date: trialEndsAt })
            return {
              hasAppAccess: subscription 
                ? [ "active", "incomplete", "past_due", "trialing"].includes(subscription.status)
                : moment(trialEndsAt).isSameOrAfter(moment()),
              trialEndsAt,
              customer: { id: customer!.id, createdAt: moment.unix(customer!.created).toDate() },
              subscription 
            }
          } catch (error) {
            await logsnag.logError({ operation: 'get stripe data', error, tags: {[logsnag.LogSnagTags.USER_ID]: user_id }, scope })
            throw error;
          }
        }
      }
    }
  },
})