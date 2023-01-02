import { AnalyticsBrowser } from '@segment/analytics-next';
import { Field, Frequency, Integration, SyncError, Table, User } from '@prisma/client'
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

export const trackDestinationErrorTriggered = ({ userId, integration, destinationName, destinationId, trigger, error }: {
  userId: string;
  integration: Integration;
  destinationName: string;
  destinationId: string;
  trigger: string;
  error: { code: SyncError, table?: Table, tableId?: string; tableName?: string; field?: Field; fieldId?: string; fieldName?: string; };
}) =>
  track({
    userId,
    event: Event.DESTINATION_ERROR_TRIGGERED,
    properties: {
      integration,
      destination_name: destinationName,
      destination_id: destinationId,
      trigger,
      code: error.code,
      table: error.table,
      table_id: error.tableId,
      table_name: error.tableName,
      field: error.field,
      field_id: error.fieldId,
      field_name: error.fieldName
    }
  })

export const trackSyncCompleted = ({ userId, trigger, integration, institutionsSynced, error, destinationId }: {
  userId: string;
  trigger: string;
  integration: Integration;
  institutionsSynced: number;
  error?: string;
  destinationId: string;
}) =>
  track({
    userId,
    event: Event.SYNC_COMPLETED,
    properties: {
      trigger,
      integration,
      institutions_synced: institutionsSynced,
      error,
      destination_id: destinationId
    }
  })

export const trackPlaidAccountUpdated = ({ userId, field }: { userId: string; field: 'name' }) =>
  track({
    userId,
    event: Event.INSTITUTION_ACCOUNT_UPDATED,
    properties: { field }
  })

export const trackInstitutionCreated = ({ userId, institution, itemId }: { userId: string; institution: string; itemId: string }) => 
  track({
    userId,
    event: Event.INSTITUTION_CREATED,
    properties: { institution, item_id: itemId }
  })

export const trackInstitutionReconnected = ({ userId, itemId }: { userId: string; itemId: string }) => 
  track({
    userId,
    event: Event.INSTITUTION_RECONNECTED,
    properties: { item_id: itemId }
  })

export const trackInstitutionDeleted = ({ userId, itemId }: { userId: string; itemId: string }) => 
  track({
    userId,
    event: Event.INSTITUTION_DELETED,
    properties: { item_id: itemId }
  })

export const trackInstitutionErrorTriggered = ({ userId, institution, error, itemId }: { userId: string; institution: string; error: string; itemId: string; }) =>
  track({
    userId,
    event: Event.INSTITUTION_ERROR_TRIGGERED,
    properties: { item_id: itemId, institution, error }
  })

export const trackInstitutionConsentRevoked = ({ userId, institution, itemId }: { userId: string; institution: string; itemId: string; }) =>
  track({
    userId,
    event: Event.INSTITUTION_CONSENT_REVOKED,
    properties: { item_id: itemId, institution }
  })

export const trackNotionConnectionAdded = ({ userId }: { userId: string }) =>
  track({ userId, event: Event.NOTION_CONNECTION_ADDED })

export const trackDestinationCreated = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
  track({ userId, event: Event.DESTINATION_CREATED, properties: { integration, destination_id: destinationId }})

export const trackDestinationUpdated = ({ userId, integration, destinationId, field }: { userId: string; integration: Integration; destinationId: string; field: 'name' | 'table_configs' | 'credentials' | 'sync_start_date' }) =>
  track({ userId, event: Event.DESTINATION_UPDATED, properties: { integration, destination_id: destinationId, field }})

export const trackDestinationDeleted = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
  track({ userId, event: Event.DESTINATION_DELETED, properties: { integration, destination_id: destinationId }})

export const trackInstitutionAccountsUpdated = ({ userId, itemId, accountsCreated, accountsDeleted }: { userId: string; itemId: string; accountsCreated: number; accountsDeleted: number }) =>
  track({
    userId,
    event: Event.INSTITUTION_ACCOUNTS_UPDATED,
    properties: { item_id: itemId, accounts_created: accountsCreated, accounts_deleted: accountsDeleted }
  })

export const trackDestinationAccountsUpdated = ({ userId, action, count, destinationId }: { userId: string; action: 'add' | 'remove'; count: number; destinationId: string; }) =>
  track({ userId, event: Event.DESTINATION_ACCOUNTS_UPDATED, properties: { action, count, destination_id: destinationId }});

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
  INSTITUTION_CONSENT_REVOKED = "Institution Consent Revoked",
  INSTITUTION_ERROR_TRIGGERED = "Institution Error Triggered",
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
  SYNC_COMPLETED = "Sync Completed"
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