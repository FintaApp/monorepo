import Stripe from "stripe";

import { AllBackendUserFieldsFragment } from "~/graphql/backend/sdk"
import * as analytics from "../analytics";
import * as stripe from "../stripe";

export const handleInvoicePaymentSucceeded = async ({ data, customer, user, timestamp }: { data: Stripe.Event.Data; customer: Stripe.Customer; timestamp: Date, user: AllBackendUserFieldsFragment }) => {
  const invoice = data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription?.toString();
  if ( !subscriptionId ) { return; }

  const revenue = invoice.amount_paid / 100.0;

  if ( revenue === 0 ) { return; }

  const [ subscription, lifetimeRevenue ] = await Promise.all([
    stripe.getSubscription({ subscriptionId }),
    stripe.getLifetimeRevenue({ customerId: customer.id })
  ])

  analytics.identify({
    userId: user.id,
    traits: { lifetime_revenue: lifetimeRevenue },
    timestamp
  });

  analytics.trackSubscriptionInvoicePaid({ 
    userId: user.id, 
    revenue, 
    plan: subscription.items.data[0]!.plan.interval,
    timestamp
  });

  // await logger.logRevenue({
  //   userId: user.id,
  //   displayName: user.displayName,
  //   revenue,
  //   lifetimeRevenue
  // })
}