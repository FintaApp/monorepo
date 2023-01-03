import Stripe from "stripe";
import * as baremetrics from "../baremetrics";
import { formatSubscriptionForIdentify, backendIdentify as identify, trackSubscriptionEnded } from "../analytics";
import { logSubscriptionEnded, logsnagInsight, logUnhandledEvent } from "../logsnag";
import { calculateTrialEndsAt } from "../stripe";
import { db } from "../db";

export const handleCustomerSubscriptionDeleted = async (
  { subscription, customer, userId, timestamp } : 
  { subscription: Stripe.Subscription; customer: Stripe.Customer; userId: string; timestamp: Date  }
) => {
  const traits = {
    ...formatSubscriptionForIdentify({ subscription }),
    trial_ends_at: calculateTrialEndsAt({ subscriptionTrialEndsAt: subscription.trial_end, customer })
  };

  const plan = subscription.items.data[0]!.plan.interval;

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

  await Promise.all([
    identify({ userId, traits, timestamp }),

    trackSubscriptionEnded({ userId, plan, timestamp }),

    logSubscriptionEnded({ userId, plan }),

    insightsPromise
  ])
}