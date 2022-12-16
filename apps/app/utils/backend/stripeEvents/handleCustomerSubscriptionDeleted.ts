import Stripe from "stripe"

import { AllBackendUserFieldsFragment } from "~/graphql/backend/sdk"
import * as analytics from "../analytics";
import { getTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionDeleted = async ({ data, customer, user, timestamp }: { data: Stripe.Event.Data, customer: Stripe.Customer, timestamp: Date, user: AllBackendUserFieldsFragment }) => {
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

  const plan = subscription.items.data[0].plan.interval;
  analytics.trackSubscriptionEnded({ userId: user.id, plan, timestamp })
  // await logger.logSubscriptionEnded({ userId: user.id, plan })
}