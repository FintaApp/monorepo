import Stripe from "stripe";

import * as segment from "../segment";
import * as stripe from "../stripe";
import * as logsnag from "../logsnag";

export const handleCustomerSubscriptionDeleted = async ({ subscription, timestamp }: { subscription: Stripe.Subscription, timestamp: Date }) => {
  const { items } = subscription;
  const userId = await stripe.getCustomerUserId({ customerId: subscription.customer.toString() });
  if ( !userId ) { return; }

  const billing_interval = items.data[0].plan.interval;

  const trackPromise = segment.track({
    userId,
    event: segment.Events.SUBSCRIPTION_ENDED,
    properties: { plan: billing_interval },
    timestamp
  })

  const logsnagPromise = logsnag.publish({
    event: logsnag.LogSnagEvent.SUBSCRIPTION_ENDED,
    channel: logsnag.LogSnagChannel.ACTIVITY,
    icon: "😔",
    tags: {
      [logsnag.LogSnagTags.USER_ID]: userId,
      [logsnag.LogSnagTags.PLAN]: billing_interval
    }
  });

  return Promise.all([trackPromise, logsnagPromise])
}