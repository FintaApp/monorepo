import Stripe from "stripe";

import * as segment from "../segment";
import * as stripe from "../stripe";
import * as logsnag from "../logsnag";
import { graphql } from "../graphql";

export const handleInvoicePaymentSucceeded = async ({ invoice, timestamp }: { invoice: Stripe.Invoice, timestamp: Date }) => {
  const customerId = invoice.customer?.toString();
  const subscriptionId = invoice.subscription?.toString();

  if ( invoice.amount_paid === 0 || !subscriptionId || !customerId ) { return true };
  const userId = await stripe.getCustomerUserId({ customerId });
  if ( !userId ) { return; }
  const user = await graphql.GetUser({ user_id: userId }).then(response => response.user!);
  const subscription = await stripe.getSubscription({ subscriptionId })

  const trackPromise = segment.track({
    userId,
    event: segment.Events.SUBSCRIPTION_INVOICE_PAID,
    properties: {
      revenue: invoice.amount_paid / 100.0,
      plan: subscription.items.data[0].plan.interval
    }
  })

  const identifyPromise = stripe.getLifetimeRevenue(customerId)
  .then(revenue => {
    return segment.identify({
      userId,
      traits: { lifetime_revenue: revenue },
      timestamp
    })
  });

  const logsnagPromise = logsnag.publish({
    channel: logsnag.LogSnagChannel.ACTIVITY,
    event: logsnag.LogSnagEvent.REVENUE,
    description: `${user.display_name} paid $${invoice.amount_paid / 100.0}`,
    icon: "💰",
    notify: true,
    tags: {
      [logsnag.LogSnagTags.USER_ID]: userId
    }
  });

  return Promise.all([trackPromise, identifyPromise, logsnagPromise])
}