import Stripe from "stripe"

import { AllUserFieldsFragment } from "../graphql/sdk"
import { Logger } from "../logger"
import * as analytics from "../segment";
import { getTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionDeleted = async ({ data, customer, user, timestamp, logger }: { data: Stripe.Event.Data, customer: Stripe.Customer, timestamp: Date, logger: Logger, user: AllUserFieldsFragment }) => {
  const subscription = data.object as Stripe.Subscription;

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
  analytics.trackSubscriptionEnded({ userId: user.id, plan, timestamp }).then(() => logger.info("Subscription ended event tracked"));
  await logger.logSubscriptionEnded({ userId: user.id, plan })
}