import Stripe from "stripe";
import moment from "moment-timezone";
import { formatSubscriptionForIdentify, backendIdentify as identify, trackSubscriptionRenewed, trackSubscriptionCanceled } from "../analytics";
import { logSubscriptionRenewed, logSubscriptionCanceled } from "../logsnag";
import { calculateTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionUpdated = async (
  { subscription, customer, userId, timestamp, previousAttributes } : 
  { subscription: Stripe.Subscription; customer: Stripe.Customer; userId: string; timestamp: Date; previousAttributes: Record<string, any> }
) => {
  const { cancel_at_period_end: previousCancelAtPeriodEnd } = previousAttributes as Record<string, any>;

  const traits = {
    ...formatSubscriptionForIdentify({ subscription }),
    trial_ends_at: calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription.trial_end, customer })
  };

  await identify({ userId, traits, timestamp });

  const plan = subscription.items.data[0]!.plan.interval;

  if ( !!previousCancelAtPeriodEnd && !subscription.cancel_at_period_end ) {
    await Promise.all([
      trackSubscriptionRenewed({ userId, plan, timestamp }),
      logSubscriptionRenewed({ userId, plan })
    ])
  }

  if ( !previousCancelAtPeriodEnd && !!subscription.cancel_at_period_end ) {
    const remainingDays = moment.unix(subscription.current_period_end).diff(moment(), 'days');
    await Promise.all([
      trackSubscriptionCanceled({ userId, plan, timestamp, remainingDays }),
      logSubscriptionCanceled({ userId, plan })
    ])
  }
}