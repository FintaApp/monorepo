import Stripe from "stripe"
import moment from "moment-timezone";

import { AllBackendUserFieldsFragment } from "~/graphql/backend/sdk"
import * as analytics from "../analytics";
import { getTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionCreated = async ({ data, customer, user, timestamp }: { data: Stripe.Event.Data, customer: Stripe.Customer, timestamp: Date, user: AllBackendUserFieldsFragment }) => {
  const subscription = data.object as Stripe.Subscription;

  // Identify user with new subscription
  const traits = {
    ...analytics.formatSubscriptionForIdentify({ subscriptionFromStripe: subscription }),
    trial_ends_at: getTrialEndsAt({ 
      subscriptionTrialEndsAt: subscription.trial_end || undefined, 
      customer 
    })
  };
  analytics.identify({
    userId: user.id,
    traits,
    timestamp
  })

  if ( !['active', 'trialing'].includes(subscription.status) ) { return; };

  const plan = subscription.items.data[0]!.plan.interval;
  const remainingTrialDays = subscription.trial_end ? moment.unix(subscription.trial_end).diff(moment(), 'days') : undefined;

  analytics.trackSubscriptionStarted({ userId: user.id, plan, remainingTrialDays, timestamp })
  // await logger.logSubscriptionStarted({ userId: user.id, displayName: user.displayName, plan, remainingTrialDays })
}