import { z } from "zod";
import Stripe from "stripe";
import moment from "moment-timezone";

import { router, protectedProcedure } from "../trpc";
import * as stripe from "~/lib/stripe";
import { trackStripePortalViewed } from "~/lib/analytics";

export const stripeRouter = router({
  getPrices: protectedProcedure
    .query(async () => {
      return stripe.getPrices({ active: true })
        .then(response => response.data)
    }),

  getSubscription: protectedProcedure
    .query(async ({ ctx: { user, logger }}) => {
      const customerId = user.stripeCustomerId;
      const [ customer, subscription ] = await Promise.all([
        stripe.getCustomer({ customerId }).then(({ lastResponse, ...customer }: any) => {
          logger.info("Get customer", { customer });
          return customer as Stripe.Customer;
        }),

        stripe.getCustomerSubscription({ customerId }).then(subscription => {
          logger.info("Get subscription", { subscription });
          return subscription
        })
      ]);

      const trialEndsAt = stripe.calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription?.trial_end, customer });
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

      const hasAppAccess = stripe.calculateHasAppAccess({ subscription, trialEndsAt });

      return { customer: formattedCustomer, subscription: formattedSubscription, hasAppAccess, trialEndsAt }
    }),

  createBillingPortalSession: protectedProcedure
    .input(
      z.object({
        returnUrl: z.string()
      })
    )
    .mutation(async ({ ctx: { user, logger }, input: { returnUrl }}) => {
      const customerId = user.stripeCustomerId;

      return stripe.createBillingPortalSession({ customerId, returnUrl })
        .then(async response => {
          await trackStripePortalViewed({ userId: user.id, mode: 'billing' })
          logger.info("Created billing portal", { response });
          return { url: response.url }
        })
    }),

    createCheckoutPortalSession: protectedProcedure
      .input(
        z.object({
          successUrl: z.string(),
          cancelUrl: z.string(),
          priceId: z.string()
        })
      )
      .mutation(async ({ ctx: { user, logger }, input }) => {
        const customerId = user.stripeCustomerId;
  
        const [ customer, subscription ] = await Promise.all([
          stripe.getCustomer({ customerId }).then(({ lastResponse, ...customer }: any) => {
            logger.info("Get customer", { customer })
            return customer as Stripe.Customer
          }),
          stripe.getCustomerSubscription({ customerId }).then(subscription => {
            logger.info("Get subscription", { subscription })
            return subscription
          })
        ]);
  
        const trialEndsAt = stripe.calculateTrialEndsAt({
          subscriptionTrialEndsAt: subscription?.trial_end,
          customer
        });
  
        const trialEnd = moment(trialEndsAt).isSameOrAfter(moment().add(48, 'hour')) ? moment(trialEndsAt).unix() : undefined;
        const trialPeriodDays = moment(trialEndsAt).isSameOrAfter(moment().add(12, 'hour')) && moment(trialEndsAt).isBefore(moment().add(48, 'hour'))
          ? 1
          : undefined
        
        return stripe.createCheckoutPortalSession({ 
          customerId, 
          priceId: input.priceId,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
          trialEnd,
          trialPeriodDays
        })
        .then(async response => {
          await trackStripePortalViewed({ userId: user.id, mode: 'checkout' })
          logger.info("Created checkout portal", { response });
          return { url: response.url }
        })
      })

})