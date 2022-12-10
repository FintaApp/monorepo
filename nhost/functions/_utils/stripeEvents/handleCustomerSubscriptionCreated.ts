import Stripe from "stripe"
import moment from "moment-timezone";

import { AllUserFieldsFragment } from "../graphql/sdk"
import { Logger } from "../logger"
import * as analytics from "../segment";
import { getTrialEndsAt } from "../stripe";

export const handleCustomerSubscriptionCreated = async ({ data, customer, user, timestamp, logger }: { data: Stripe.Event.Data, customer: Stripe.Customer, timestamp: Date, logger: Logger, user: AllUserFieldsFragment }) => {
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

  if ( !['active', 'trialing'].includes(subscription.status) ) { return; };

  const plan = subscription.items.data[0].plan.interval;
  const remainingTrialDays = subscription.trial_end ? moment.unix(subscription.trial_end).diff(moment(), 'days') : undefined;

  analytics.trackSubscriptionStarted({ userId: user.id, plan, remainingTrialDays, timestamp }).then(() => logger.info("Subscription started event tracked"));
  await logger.logSubscriptionStarted({ userId: user.id, displayName: user.displayName, plan, remainingTrialDays })
}