import Stripe from "stripe";

import * as baremetrics from "../baremetrics";
import * as stripe from "../stripe";
import { backendIdentify as identify, trackSubscriptionInvoicePaid } from "../analytics";
import { logRevenue, logUnhandledEvent, logsnagInsight } from "../logsnag";

export const handleInvoicePaymentSucceeded = async (
  { invoice, customerId, userId, userName, timestamp }: 
  { userName: string; invoice: Stripe.Invoice; customerId: string; userId: string; timestamp: Date }
) => {
  const subscriptionId = invoice.subscription?.toString();
  if ( !subscriptionId ) { return; }

  const revenue = invoice.amount_paid / 100.0;
  if ( revenue === 0 ) { return; }

  const [ subscription, lifetimeRevenue ] = await Promise.all([
    stripe.getSubscription({ subscriptionId }),
    stripe.getLifetimeRevenue({ customerId })
  ]);

  const identifyPromise = identify({
    userId,
    traits: { lifetime_revenue: lifetimeRevenue },
    timestamp
  });

  const trackPromise = trackSubscriptionInvoicePaid({ 
    userId, 
    revenue, 
    plan: subscription.items.data[0]!.plan.interval,
    timestamp
  });

  const logPromise = logRevenue({ userId, userName, lifetimeRevenue, revenue });

  const insightsPromise = baremetrics.metrics()
    .then(({ arr, mrr, net_revenue }) => {
      return Promise.all([
        logsnagInsight({ title: 'ARR', value: `$${arr.toLocaleString()}`, icon: 'chart' }),
        logsnagInsight({ title: 'MRR', value: `$${mrr.toLocaleString()}`, icon: 'chart' }),
        logsnagInsight({ title: 'Net Revenue', value: `$${net_revenue.toLocaleString()}`, icon: 'revenue' })
      ])
    })
    .catch(err => logUnhandledEvent(err))
  
  await Promise.all([ identifyPromise, trackPromise, logPromise, insightsPromise ])
}