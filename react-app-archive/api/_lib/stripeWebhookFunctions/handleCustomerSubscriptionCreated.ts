import Stripe from "stripe";
import moment from "moment-timezone";

import * as segment from "../segment";
import * as stripe from "../stripe";
import * as logsnag from "../logsnag";

export const handleCustomerSubscriptionCreated = async ({ subscription, timestamp }: { subscription: Stripe.Subscription, timestamp: Date }) => {
  const { items, status } = subscription;
  const userId = await stripe.getCustomerUserId({ customerId: subscription.customer.toString() });
  if ( !userId ) { return; }

  const billing_interval = items.data[0].plan.interval;

  if ( !['active', 'trialing'].includes(status) ) { return; }
  const remainingTrialDays = subscription.trial_end ? moment.unix(subscription.trial_end).diff(moment(), 'days') : undefined

  const trackPromise = segment.track({
    userId,
    event: segment.Events.SUBSCRIPTION_STARTED,
    properties: {
      plan: billing_interval,
      remaining_trial_days: remainingTrialDays
    }
  });

  const logsnagPromise = logsnag.publish({
    event: logsnag.LogSnagEvent.SUBSCRIPTION_STARTED,
    channel: logsnag.LogSnagChannel.ACTIVITY,
    icon: "🚀",
    tags: {
      [logsnag.LogSnagTags.USER_ID]: userId,
      [logsnag.LogSnagTags.PLAN]: billing_interval,
      [logsnag.LogSnagTags.REMAINING_TRIAL_DAYS]: remainingTrialDays
    }
  });

  return Promise.all([trackPromise, logsnagPromise])
}