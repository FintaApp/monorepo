import Stripe from "stripe";
import { formatSubscriptionForIdentify, backendIdentify as identify, trackSubscriptionEnded } from "../analytics";
import { logSubscriptionEnded } from "../logsnag";
import { calculateTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionDeleted = async (
  { subscription, customer, userId, timestamp } : 
  { subscription: Stripe.Subscription; customer: Stripe.Customer; userId: string; timestamp: Date  }
) => {
  const traits = {
    ...formatSubscriptionForIdentify({ subscription }),
    trial_ends_at: calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription.trial_end, customer })
  };

  const plan = subscription.items.data[0]!.plan.interval;
  await Promise.all([
    identify({ userId, traits, timestamp }),

    trackSubscriptionEnded({ userId, plan, timestamp }),

    logSubscriptionEnded({ userId, plan })
  ])
}