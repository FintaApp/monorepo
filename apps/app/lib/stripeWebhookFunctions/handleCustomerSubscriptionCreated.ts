import Stripe from "stripe";
import moment from "moment-timezone";

import { formatSubscriptionForIdentify, backendIdentify as identify, trackSubscriptionStarted } from "../analytics";
import { calculateTrialEndsAt } from "../stripe";
import { logSubscriptionStarted } from "../logsnag";

export const handleCustomerSubscriptionCreated = async (
  { subscription, customer, userId, timestamp } : 
  { subscription: Stripe.Subscription; customer: Stripe.Customer; userId: string; timestamp: Date  }
) => {
  const traits = {
    ...formatSubscriptionForIdentify({ subscription }),
    trial_ends_at: calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription.trial_end, customer })
  };

  await identify({ userId, traits, timestamp });

  if ( !['active', 'trialing'].includes(subscription.status) ) { return; };

  const plan = subscription.items.data[0]!.plan.interval;
  const remainingTrialDays = subscription.trial_end ? moment.unix(subscription.trial_end).diff(moment(), 'days') : undefined;

  const trackPromise = trackSubscriptionStarted({ userId, plan, remainingTrialDays, timestamp });
  const logPromise = logSubscriptionStarted({ userId, plan, remainingTrialDays });

  await Promise.all([ trackPromise, logPromise ])
} 