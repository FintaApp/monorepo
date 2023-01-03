import Stripe from "stripe";
import moment from "moment-timezone";

import * as baremetrics from "../baremetrics";
import { formatSubscriptionForIdentify, backendIdentify as identify, trackSubscriptionStarted } from "../analytics";
import { calculateTrialEndsAt } from "../stripe";
import { logSubscriptionStarted, logsnagInsight, logUnhandledEvent } from "../logsnag";
import { db } from "../db";

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
  const remainingTrialDays = subscription.trial_end ? moment.unix(subscription.trial_end).diff(moment(), 'days') : 0;

  const trackPromise = trackSubscriptionStarted({ userId, plan, remainingTrialDays, timestamp });
  const logPromise = logSubscriptionStarted({ userId, plan, remainingTrialDays });

  const insightsPromise = Promise.all([
    baremetrics.metrics(),
    db.user.aggregate({ where: { disabledAt: null }, _count: true })
  ])
    .then(([{ subscriptions }, { _count: totalUsers }]) => {
      return Promise.all([
        logsnagInsight({ title: 'Monthly Subscribers', value: subscriptions.month, icon: 'user' }),
        logsnagInsight({ title: 'Yearly Subscribers', value: subscriptions.year, icon: 'user' }),
        logsnagInsight({ title: 'Trials', value: totalUsers - subscriptions.month - subscriptions.year, icon: 'hourglass'}),
        logsnagInsight({ title: 'Total Users', value: totalUsers, icon: 'user'})
      ])
    })
    .catch(err => logUnhandledEvent(err))

  await Promise.all([ trackPromise, logPromise, insightsPromise ])
} 