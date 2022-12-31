import { AnalyticsBrowser } from '@segment/analytics-next';
import { Frequency, User } from '@prisma/client'
import AnalyticsNode from "analytics-node";
import Stripe from "stripe";
import moment from "moment-timezone";

const key = process.env.SEGMENT_KEY || process.env.NEXT_PUBLIC_SEGMENT_KEY || "";

const analytics = new AnalyticsNode(key, { flushAt: 1 });
const browserAnalytics = AnalyticsBrowser.load({ writeKey: key });

// Proper Case for event names
// snake_case for properties

export const flush = analytics.flush;

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

export const trackUserUpdated = ({ userId, field, oldValue, newValue }: { userId: string; field: string; oldValue: any; newValue: any }) =>
  track({
    userId,
    event: Event.USER_UPDATED,
    properties: { field, old_value: oldValue, new_value: newValue }
  })

export const trackUserDeleted = ({ userId }: { userId: string }) =>
  track({
    userId,
    event: Event.USER_DELETED
  })

export const trackPasswordChanged = ({ userId }: { userId: string }) =>
  track({
    userId,
    event: Event.PASSWORD_CHANGED
  })

export const trackStripePortalViewed = ({ userId, mode }: { userId: string; mode: 'checkout' | 'billing'}) =>
  track({
    userId,
    event: Event.STRIPE_PORTAL_VIEWED,
    properties: { mode }
  })

export const trackPlaidLinkInitiated = ({ userId, mode }: { userId: string; mode: 'create' | 'reconnect' | 'addAccounts' }) =>
  track({
    userId,
    event: Event.PLAID_LINK_INITIATED,
    properties: { mode }
  })

export const trackSubscriptionInvoicePaid = ({ userId, revenue, plan, timestamp }: { userId: string; revenue: number; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: Event.SUBSCRIPTION_INVOICE_PAID,
    properties: { revenue, plan },
    timestamp
  })

export const trackSubscriptionStarted = ({ userId, plan, remainingTrialDays, timestamp }: { userId: string; plan: string; timestamp: Date; remainingTrialDays?: number }) => 
  track({
    userId,
    event: Event.SUBSCRIPTION_STARTED,
    properties: { plan, remaining_trial_days: remainingTrialDays },
    timestamp
  })

export const trackSubscriptionEnded = ({ userId, plan, timestamp }: { userId: string; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: Event.SUBSCRIPTION_ENDED,
    properties: { plan },
    timestamp
  })

export const trackSubscriptionCanceled = ({ userId, plan, remainingDays, timestamp }: { userId: string; plan: string; remainingDays: number; timestamp: Date }) =>
  track({
    userId,
    event: Event.SUBSCRIPTION_CANCELED,
    properties: { plan, remaining_days: remainingDays },
    timestamp
  })

export const trackSubscriptionRenewed = ({ userId, plan, timestamp }: { userId: string; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: Event.SUBSCRIPTION_RENEWED,
    properties: { plan },
    timestamp
  });

export const trackAirtableTokenAdded = ({ userId }: { userId: string }) =>
  track({ userId, event: Event.AIRTABLE_TOKEN_ADDED });

export const trackSupportTicketCreated = ({ userId }: { userId: string }) =>
  track({
    userId,
    event: Event.SUPPORT_TICKET_CREATED
  })

export const backendIdentify = ({ userId, traits, timestamp }: { userId: string; traits: UserTraits; timestamp?: Date }) =>
  new Promise((resolve, reject) => {
    analytics.identify({
      userId,
      traits,
      timestamp
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
  PASSWORD_CHANGED = "Password Changed",
  PLAID_LINK_INITIATED = "Plaid Link Initiated",
  USER_SIGNED_IN = "User Signed In",
  USER_SIGNED_UP = "User Signed Up",
  USER_UPDATED = "User Updated",
  USER_DELETED = "User Deleted",
  STRIPE_PORTAL_VIEWED = "Stripe Portal Viewed",
  SUBSCRIPTION_STARTED = "Subscription Started",
  SUBSCRIPTION_ENDED = "Subscription Ended",
  SUBSCRIPTION_RENEWED = "Subscription Renewed",
  SUBSCRIPTION_CANCELED = "Subscription Canceled",
  SUBSCRIPTION_INVOICE_PAID = "Subscription Invoice Paid",
  SUPPORT_TICKET_CREATED = "Support Ticket Created",
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
  unsubscribed: !user.isSubscribedGeneral,
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