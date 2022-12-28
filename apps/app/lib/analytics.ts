import { AnalyticsBrowser } from '@segment/analytics-next';
import { Frequency, User } from '@prisma/client'
import { Analytics } from "@segment/analytics-node";
import Stripe from "stripe";
import moment from "moment-timezone";

const analytics = new Analytics({ writeKey: process.env.SEGMENT_KEY || "writeKey", maxEventsInBatch: 1 });
const browserAnalytics = AnalyticsBrowser.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY || "writeKey" });

export const flush = analytics.closeAndFlush

export const trackUserSignedIn = ({ userId, provider }: { userId: string; provider?: string }) => 
  track({
    userId,
    event: Event.USER_SIGNED_IN,
    properties: { provider }
  })

export const trackUserSignedUp = ({ userId, provider }: { userId: string; provider?: string }) =>
  track({
    userId,
    event: Event.USER_SIGNED_UP,
    properties: { provider }
  })

export const trackUserUpdated = ({ userId, field }: { userId: string; field: string; }) =>
  track({
    userId,
    event: Event.USER_UPDATED,
    properties: { field }
  })

export const backendIdentify = ({ userId, traits }: { userId: string; traits: UserTraits }) =>
  new Promise((resolve, reject) => {
    analytics.identify({
      userId,
      traits
    }, () => resolve(true))
  })

export const frontendIdentify = ({ userId }: { userId: string }) => {
  if ( typeof global === 'undefined' ) { return; };
  browserAnalytics.identify(userId);
}

// Types
enum Event {
  AIRTABLE_TOKEN_ADDED = "Airtable Token Added",
  DESTINATION_ACCOUNTS_UPDATED = "Destination Accounts Updated",
  DESTINATION_CREATED = "Destination Created",
  DESTINATION_UPDATED = "Destination Updated",
  DESTINATION_DELETED = "Destination Deleted",
  DESTINATION_ERROR_TRIGGERED = "Destination Error Triggered",
  INSTITUTION_ACCOUNT_UPDATED = "Plaid Account Updated",
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_DELETED = "Institution Deleted",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  INSTITUTION_ACCOUNTS_UPDATED = "Institution Accounts Updated",
  NOTION_CONNECTION_ADDED = "Notion Connection Added",
  PLAID_LINK_INITIATED = "Plaid Link Initiated",
  USER_SIGNED_IN = "User Signed In",
  USER_SIGNED_UP = "User Signed Up",
  USER_UPDATED = "User Updated",
}

export enum AnalyticsPage {
  ACCOUNTS = 'Accounts',
  LOG_IN = 'Log In',
  SIGN_UP = 'Sign Up'
}

type UserTraits = {
  name?: string;
  email?: string;
  created_at?: Date;
  billing_interval?: Stripe.Plan.Interval;
  subscription_status?: Stripe.Subscription.Status;
  trial_ends_at?: Date | null;
  will_cancel_at_period_end?: boolean;
  current_period_ends_at?: Date;
  canceled_at?: Date | null;
  timezone?: string;
  unsubscribed?: boolean;
  is_subscribed_periodic_updates?: boolean;
  periodic_updates_frequency?: Frequency
  lifetime_revenue?: number;
  deleted_at?: Date;
  institutions_count?: number;
}

// Helpers
export const formatSubscriptionForIdentify = ({ subscription }: { subscription: Stripe.Subscription }) => ({
  billing_interval: subscription.items.data[0]?.plan.interval,
  subscription_status: subscription.status,
  canceled_at: subscription.canceled_at ? moment.unix(subscription.canceled_at).toDate() : undefined,
  current_period_ends_at: moment.unix(subscription.current_period_end).toDate(),
  will_cancel_at_period_end: subscription.cancel_at_period_end
})

export const formatUserForIdentify = ({ user }: { user: User }) => ({
  name: user.name || undefined,
  email: user.email || undefined,
  created_at: new Date(user.createdAt),
  timezone: user.timezone,
  unsubscribed: !user.isSubsribedGeneral,
  is_subscribed_periodic_updates: user.isSubscribedPeriodicUpdates,
  periodic_updates_frequency: user.periodicUpdatesFrequency
})

const track = ({ userId, event, properties = {}, timestamp }: { userId: string; event: Event, properties?: Record<string, any>; timestamp?: Date }) => 
  new Promise(( resolve, reject ) => {
    analytics.track({
      userId,
      event,
      properties,
      timestamp
    }, () => resolve(true))
  })