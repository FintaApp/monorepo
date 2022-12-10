import segment from "analytics-node";
import Stripe from "stripe";
import moment from "moment-timezone";

import { Frequencies_Enum, StripeSubscription } from "./graphql/sdk";

const analytics = new segment(process.env.SEGMENT_KEY! || "HEY", { flushInterval: 1000 });

export const flushAnalytics = () => analytics.flush();

export const trackSubscriptionStarted = ({ userId, plan, remainingTrialDays, timestamp }: { userId: string; plan: string; timestamp: Date; remainingTrialDays?: number }) => 
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_STARTED,
    properties: { plan, remaining_trial_days: remainingTrialDays },
    timestamp
  })

export const trackSubscriptionEnded = ({ userId, plan, timestamp }: { userId: string; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_ENDED,
    properties: { plan },
    timestamp
  })

export const trackSubscriptionResumed = ({ userId, plan, timestamp }: { userId: string; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_RESUMED,
    properties: { plan },
    timestamp
  })

export const trackSubscriptionCanceled = ({ userId, plan, remainingDays, timestamp }: { userId: string; plan: string; remainingDays: number; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_CANCELED,
    properties: { plan, remaining_days: remainingDays },
    timestamp
  })

export const trackSubscriptionInvoicePaid = ({ userId, revenue, plan, timestamp }: { userId: string; revenue: number; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_INVOICE_PAID,
    properties: { revenue, plan },
    timestamp
  })


// export const trackUserLoggedIn = ({ userId, provider }: { userId: string; provider: AuthProvider }) =>
//   track({
//     userId,
//     event: SegmentEvent.USER_LOGGED_IN,
//     properties: { provider }
//   })

// export const trackUserUpdated = ({ userId, field }: { userId: string; field: string }) =>
//   track({
//     userId,
//     event: SegmentEvent.USER_UPDATED,
//     properties: { field }
//   })

// export const trackPasswordChanged = ({ userId }: { userId }) =>
//   track({
//     userId,
//     event: SegmentEvent.PASSWORD_CHANGED,
//   })

// export const formatSubscriptionForIdentify = (subscription: Stripe.Subscription) => ({
//   billing_interval: subscription.items.data[0].plan.interval,
//   subscription_status: subscription.status,
//   canceled_at: subscription.canceled_at,
//   current_period_end: subscription.current_period_end,
//   cancel_at_period_end: subscription.cancel_at_period_end
// })

export const formatSubscriptionForIdentify = ({ subscriptionFromSchema, subscriptionFromStripe }: {subscriptionFromSchema?: StripeSubscription; subscriptionFromStripe?: Stripe.Subscription }) => {
  if ( subscriptionFromSchema ) { 
    return {
      billing_interval: subscriptionFromSchema.interval,
      subscription_status: subscriptionFromSchema.status,
      canceled_at: subscriptionFromSchema.canceledAt,
      current_period_ends_at: subscriptionFromSchema.currentPeriodEnd,
      cancel_at_period_end: subscriptionFromSchema.cancelAtPeriodEnd
    }
  }

  if ( subscriptionFromStripe ) {
    return {
      billing_interval: subscriptionFromStripe.items.data[0].plan.interval,
      subscription_status: subscriptionFromStripe.status,
      canceled_at: subscriptionFromStripe.canceled_at ? moment.unix(subscriptionFromStripe.canceled_at).toDate() : undefined,
      current_period_ends_at: moment.unix(subscriptionFromStripe.current_period_end).toDate(),
      cancel_at_period_end: subscriptionFromStripe.cancel_at_period_end
    }
  }

  return {}
}

// // Types
export enum SegmentEvent {
  SUBSCRIPTION_STARTED = "Subscription Started",
  SUBSCRIPTION_ENDED = "Subscription Ended",
  SUBSCRIPTION_RESUMED = "Subscription Resumed",
  SUBSCRIPTION_CANCELED = "Subscription Canceled",
  SUBSCRIPTION_INVOICE_PAID = "Subscription Invoice Paid"
}

interface SegmentTrackProps {
  userId: string;
  timestamp?: Date;
  event: SegmentEvent;
  properties?: object;
}

export interface SegmentUserTraits {
  name?: string;
  email?: string;
  created_at?: number | Date;
  billing_interval?: Stripe.Plan.Interval;
  subscription_status?: Stripe.Subscription.Status;
  trial_ends_at?: Date | null;
  cancel_at_period_end?: boolean;
  current_period_ends_at?: Date | Date;
  canceled_at?: Date | null;
  timezone?: string;
  unsubscribed?: boolean;
  is_subscribed_sync_updates?: boolean;
  sync_updates_frequency?: Frequencies_Enum;
  lifetime_revenue?: number;
}

// // Helper Functions
const track = ({ userId, event, properties = {}, timestamp }: SegmentTrackProps) => 
  new Promise((resolve, reject) => {
    analytics.track({
      userId,
      event,
      properties,
      timestamp
    }, (err) => {
      if ( err ) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })

export const identify = ({ userId, traits = {}, timestamp }: {
  userId: string;
  traits?: SegmentUserTraits,
  timestamp?: Date
}) => 
  new Promise((resolve, reject) => {
    analytics.identify({
      userId,
      traits,
      timestamp
    }, ( err ) => {
      if ( err ) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })