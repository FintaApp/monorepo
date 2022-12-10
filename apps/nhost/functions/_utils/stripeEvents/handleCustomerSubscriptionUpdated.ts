import Stripe from "stripe";
import moment from "moment-timezone";

import { AllUserFieldsFragment } from "../graphql/sdk"
import { Logger } from "../logger"
import * as analytics from "../segment";
import { getTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionUpdated = async ({ data, customer, user, timestamp, logger }: { data: Stripe.Event.Data; customer: Stripe.Customer; timestamp: Date, logger: Logger, user: AllUserFieldsFragment }) => {
  const subscription = data.object as Stripe.Subscription;
  const { cancel_at_period_end: previousCancelAtPeriodEnd } = data.previous_attributes as Record<string, any>;

  // Identify user with new subscription
  const traits = {
    ...analytics.formatSubscriptionForIdentify({ subscriptionFromStripe: subscription }),
    trial_ends_at: getTrialEndsAt({ 
      subscriptionTrialEndsAt: subscription.trial_end, 
      customer 
    })
  };
  analytics.identify({
    userId: user.id,
    traits,
    timestamp
  }).then(() => logger.debug("User identified with traits", { traits }));

  const plan = subscription.items.data[0].plan.interval;
  if ( !!previousCancelAtPeriodEnd && !subscription.cancel_at_period_end ) {
    analytics.trackSubscriptionResumed({ userId: user.id, plan, timestamp }).then(() => logger.info("Subscription resumed event tracked"));
    await logger.logSubscriptionResumed({ userId: user.id, plan })
  }

  if ( !previousCancelAtPeriodEnd && !!subscription.cancel_at_period_end ) {
    const remainingDays = moment.unix(subscription.current_period_end).diff(moment(), 'days');
    analytics.trackSubscriptionCanceled({ userId: user.id, remainingDays, timestamp, plan }).then(() => logger.info("Subscription canceled event tracked"));
    await logger.logSubscriptionCanceled({ userId: user.id, plan, remainingDays });
  }
}