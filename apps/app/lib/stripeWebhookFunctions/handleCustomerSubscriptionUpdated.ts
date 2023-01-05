import Stripe from "stripe";
import moment from "moment-timezone";

import * as baremetrics from "../baremetrics";
import { formatSubscriptionForIdentify, backendIdentify as identify, trackSubscriptionRenewed, trackSubscriptionCanceled, trackSubscriptionStarted } from "../analytics";
import { logSubscriptionRenewed, logSubscriptionCanceled, logsnagInsight, logUnhandledEvent, logSubscriptionStarted } from "../logsnag";
import { calculateTrialEndsAt } from "../stripe";
import { db } from "../db";

export const handleCustomerSubscriptionUpdated = async (
  { subscription, customer, userId, timestamp, previousAttributes } : 
  { subscription: Stripe.Subscription; customer: Stripe.Customer; userId: string; timestamp: Date; previousAttributes: Record<string, any> }
) => {
  const { cancel_at_period_end: previousCancelAtPeriodEnd, status: previousStatus } = previousAttributes as Record<string, any>;

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

  if ( previousCancelAtPeriodEnd === false && !!subscription.cancel_at_period_end ) {
    const remainingDays = moment.unix(subscription.current_period_end).diff(moment(), 'days');
    await Promise.all([
      trackSubscriptionCanceled({ userId, plan, timestamp, remainingDays }),
      logSubscriptionCanceled({ userId, plan })
    ])
  }

  if ( previousStatus === 'incomplete' && subscription.status === 'active' ) {
    await Promise.all([
      trackSubscriptionStarted({ userId, plan, remainingTrialDays: 0, timestamp }),
      logSubscriptionStarted({ userId, plan, remainingTrialDays: 0 })
    ])
  }

  await Promise.all([
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
}