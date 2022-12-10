import Stripe from "stripe";
import moment from "moment-timezone";

import * as segment from "../segment";
import * as stripe from "../stripe";
import * as logsnag from "../logsnag";

export const handleCustomerSubscriptionUpdated = async ({ subscription, previousAttributes, timestamp }: { subscription: Stripe.Subscription, previousAttributes: Record<string, any>, timestamp: Date }) => {
  const { cancel_at_period_end, status, items } = subscription;
  const billing_interval = items.data[0].plan.interval;
  const customerId = subscription.customer.toString();

  const userId = await stripe.getCustomerUserId({ customerId });
  if ( !userId ) { return; }

  const paidInvoices = await stripe.getInvoices({ subscription: subscription.id, status: 'paid', limit: 100 }).then(response => response.data.filter(invoice => invoice.amount_paid > 0));

  const { status: previousStatus, cancel_at_period_end: previousCancelAtPeriodEnd } = previousAttributes;
  if ( !previousCancelAtPeriodEnd && cancel_at_period_end ) {
    await Promise.all([
      segment.track({
        userId,
        event: segment.Events.SUBSCRIPTION_CANCELED,
        properties: { plan: billing_interval },
        timestamp
      }),
      logsnag.publish({
        channel: logsnag.LogSnagChannel.ACTIVITY,
        event: logsnag.LogSnagEvent.SUBSCRIPTION_CANCELED,
        icon: "😕",
        tags: {
          [logsnag.LogSnagTags.USER_ID]: userId,
          [logsnag.LogSnagTags.PLAN]: billing_interval
        }
      })
    ])
  }

  if ( !!previousCancelAtPeriodEnd && !cancel_at_period_end) {
    await Promise.all([
      segment.track({
        userId,
        event: segment.Events.SUBSCRIPTION_UNCANCELED,
        properties: { plan: billing_interval },
        timestamp
      }),
      logsnag.publish({
        channel: logsnag.LogSnagChannel.ACTIVITY,
        event: logsnag.LogSnagEvent.SUBSCRIPTION_UNCANCELED,
        icon: "😅",
        tags: {
          [logsnag.LogSnagTags.USER_ID]: userId,
          [logsnag.LogSnagTags.PLAN]: billing_interval
        }
      })
    ])
  }

  if ( previousStatus === 'incomplete' && status === 'active' && paidInvoices.length === 1 ) {
    const remainingTrialDays = subscription.trial_end ? moment.unix(subscription.trial_end).diff(moment(), 'days') : undefined

    await Promise.all([
      segment.track({
        userId,
        event: segment.Events.SUBSCRIPTION_STARTED,
        properties: {
          plan: billing_interval,
          remaining_trial_days: remainingTrialDays
        },
        timestamp
      }),
      logsnag.publish({
        event: logsnag.LogSnagEvent.SUBSCRIPTION_STARTED,
        channel: logsnag.LogSnagChannel.ACTIVITY,
        icon: "🚀",
        tags: {
          [logsnag.LogSnagTags.USER_ID]: userId,
          [logsnag.LogSnagTags.PLAN]: billing_interval,
          [logsnag.LogSnagTags.REMAINING_TRIAL_DAYS]: remainingTrialDays
        }
      })
    ])
  }
}