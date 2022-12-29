import { z } from "zod";
import Stripe from "stripe";
import moment from "moment-timezone";

import { router, protectedProcedure } from "../trpc";
import { calculateTrialEndsAt, getCustomer, getCustomerSubscription } from "~/lib/stripe";

export const stripeRouter = router({
  getSubscription: protectedProcedure
    .input(
      z.object({
        customerId: z.string() //TODO: Remove this after switching to React Auth
      })
    )
    .query(async ({ ctx: { session, logger}, input: { customerId }}) => {
      const userId = session.user.id;
      const [ customer, subscription ] = await Promise.all([
        getCustomer({ customerId }).then(({ lastResponse, ...customer }: (Stripe.Customer & { lastResponse: any })) => {
          logger.info("Get customer", { customer });
          return customer;
        }),

        getCustomerSubscription({ customerId }).then(subscription => {
          logger.info("Get subscription", { subscription });
          return subscription
        })
      ]);

      const trialEndsAt = calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription?.trial_end, customer });
      const formattedSubscription = subscription && {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialStartedAt: subscription.trial_start ? moment.unix(subscription.trial_start).toDate() : undefined,
        trialEndedAt: subscription.trial_end ? moment.unix(subscription.trial_end).toDate() : undefined,
        startedAt: moment.unix(subscription.start_date).toDate(),
        endedAt: subscription.ended_at ? moment.unix(subscription.ended_at).toDate() : undefined,
        currentPeriodStart: moment.unix(subscription.current_period_start).toDate(),
        currentPeriodEnd: moment.unix(subscription.current_period_end).toDate(),
        interval: subscription.items.data[0].plan.interval,
        canceledAt: subscription.canceled_at ? moment.unix(subscription.canceled_at).toDate() : undefined
      }

      const formattedCustomer = { id: customer!.id, createdAt: moment.unix(customer!.created).toDate() };

      const hasAppAccess = subscription 
      ? [ "active", "incomplete", "past_due", "trialing"].includes(subscription.status)
      : moment(trialEndsAt).isSameOrAfter(moment());

      return { customer: formattedCustomer, subscription: formattedSubscription, hasAppAccess, trialEndsAt }
    })

})