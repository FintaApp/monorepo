import Stripe from "stripe";
import moment from "moment-timezone";

import { AllBackendUserFieldsFragment } from "~/graphql/backend/sdk"
import * as analytics from "../analytics";
import { calculateTrialEndsAt } from "~/lib/stripe";

export const handleCustomerSubscriptionUpdated = async ({ data, customer, user, timestamp }: { data: Stripe.Event.Data; customer: Stripe.Customer; timestamp: Date, user: AllBackendUserFieldsFragment }) => {
  const subscription = data.object as Stripe.Subscription;
  const { cancel_at_period_end: previousCancelAtPeriodEnd } = data.previous_attributes as Record<string, any>;

  // Identify user with new subscription
  const traits = {
    ...analytics.formatSubscriptionForIdentify({ subscriptionFromStripe: subscription }),
    trial_ends_at: calculateTrialEndsAt({ 
      subscriptionTrialEndsAt: subscription.trial_end || undefined, 
      customer 
    })
  };
  analytics.identify({
    userId: user.id,
    traits,
    timestamp
  })

  const plan = subscription.items.data[0]!.plan.interval;
  if ( !!previousCancelAtPeriodEnd && !subscription.cancel_at_period_end ) {
    analytics.trackSubscriptionResumed({ userId: user.id, plan, timestamp })
    // await logger.logSubscriptionResumed({ userId: user.id, plan })
  }

  if ( !previousCancelAtPeriodEnd && !!subscription.cancel_at_period_end ) {
    const remainingDays = moment.unix(subscription.current_period_end).diff(moment(), 'days');
    analytics.trackSubscriptionCanceled({ userId: user.id, remainingDays, timestamp, plan })
    // await logger.logSubscriptionCanceled({ userId: user.id, plan, remainingDays });
  }
}