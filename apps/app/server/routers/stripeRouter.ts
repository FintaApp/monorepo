import moment from "moment-timezone";
import Stripe from "stripe";
import { z } from "zod";
import { calculateTrialEndsAt, createBillingPortalSession, createCheckoutPortalSession, getCustomer, getCustomerSubscription, getPrices } from "~/lib/stripe";
import { router, protectedProcedure, stripeCustomerProcedure } from "../trpc";

export const stripeRouter = router({
  getPrices: protectedProcedure
    .query(async () => {
      return getPrices({ active: true })
        .then(response => response.data)
    }),
  
  getSubscription: stripeCustomerProcedure
    .query(async ({ ctx: { session, logger }}) => {
      const customerId = session?.user.stripeCustomerId!;

      const [ customer, subscription ] = await Promise.all([
        getCustomer({ customerId }).then(({ lastResponse, ...customerData }) => {
          logger.info("Get customer", { customer: customerData })
          return customerData as Stripe.Customer
        }),
        getCustomerSubscription({ customerId }).then(subscription => {
          logger.info("Get subscription", { subscription })
          return subscription
        })
      ]);

      const trialEndsAt = calculateTrialEndsAt({
        subscriptionTrialEndsAt: subscription?.trial_end,
        customer
      });

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

      const formattedCustomer = { id: customer!.id, createdAt: moment.unix(customer!.created).toDate() }

      const hasAppAccess = subscription 
      ? [ "active", "incomplete", "past_due", "trialing"].includes(subscription.status)
      : moment(trialEndsAt).isSameOrAfter(moment());

      return { customer: formattedCustomer, subscription: formattedSubscription, hasAppAccess, trialEndsAt }
    }),

  createBillingPortalSession: stripeCustomerProcedure
    .input(
      z.object({
        returnUrl: z.string()
      })
    )
    .mutation(async ({ ctx: { session, logger }, input: { returnUrl }}) => {
      const customerId = session?.user.stripeCustomerId!;

      return createBillingPortalSession({ customerId, returnUrl })
        .then(response => {
          logger.info("Created billing portal", { response });
          return { url: response.url }
        })
    }),

  createCheckoutPortalSession: stripeCustomerProcedure
    .input(
      z.object({
        successUrl: z.string(),
        cancelUrl: z.string(),
        priceId: z.string()
      })
    )
    .mutation(async ({ ctx: { session, logger }, input }) => {
      const customerId = session?.user.stripeCustomerId!;

      const [ customer, subscription ] = await Promise.all([
        getCustomer({ customerId }).then(({ lastResponse, ...customerData }) => {
          logger.info("Get customer", { customer: customerData })
          return customerData as Stripe.Customer
        }),
        getCustomerSubscription({ customerId }).then(subscription => {
          logger.info("Get subscription", { subscription })
          return subscription
        })
      ]);

      const trialEndsAt = calculateTrialEndsAt({
        subscriptionTrialEndsAt: subscription?.trial_end,
        customer
      });

      const trialEnd = moment(trialEndsAt).isSameOrAfter(moment().add(48, 'hour')) ? moment(trialEndsAt).unix() : undefined;
      const trialPeriodDays = moment(trialEndsAt).isSameOrAfter(moment().add(12, 'hour')) && moment(trialEndsAt).isBefore(moment().add(48, 'hour'))
        ? 1
        : undefined
      
      return createCheckoutPortalSession({ 
        customerId, 
        priceId: input.priceId,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        trialEnd,
        trialPeriodDays
      })
      .then(response => {
        logger.info("Created checkout portal", { response });
        return { url: response.url }
      })
    })
})