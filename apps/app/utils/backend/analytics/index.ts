import segment from "analytics-node";
import Stripe from "stripe";
import moment from "moment-timezone";
import { Frequencies_Enum, Integrations_Enum, StripeSubscription } from "~/graphql/backend/sdk";
import { DestinationError } from "~/types/shared/models";

const analytics = new segment(process.env.SEGMENT_KEY!, { flushAt: 1 });

export const flushAnalytics = () => analytics.flush();

export const trackUserSignedUp = ({ userId, createdAt }: { userId: string; createdAt: string; }) => 
  track({
    userId,
    event: SegmentEvent.USER_SIGNED_UP,
    timestamp: new Date(createdAt)
  })

export const trackPlaidAccountUpdated = ({ userId, field }: { userId: string; field: string }) =>
  track({
    userId,
    event: SegmentEvent.PLAID_ACCOUNT_UPDATED,
    properties: { field }
  })

export const trackInstitutionCreated = ({ userId, institution, itemId }: { userId: string; institution: string; itemId: string }) => 
  track({
    userId,
    event: SegmentEvent.INSTITUTION_CREATED,
    properties: { institution, plaidItemId: itemId }
  })

export const trackInstitutionReconnected = ({ userId, itemId }: { userId: string; itemId: string }) => 
  track({
    userId,
    event: SegmentEvent.INSTITUTION_RECONNECTED,
    properties: { plaidItemId: itemId }
  })

export const trackInstitutionDeleted = ({ userId, itemId }: { userId: string; itemId: string }) => 
  track({
    userId,
    event: SegmentEvent.INSTITUTION_DELETED,
    properties: { plaidItemId: itemId }
  })

export const trackDestinationErrorTriggered = ({ userId, integration, destinationName, destinationId, trigger, error }: {
  userId: string;
  integration: Integrations_Enum;
  destinationName: string;
  destinationId: string;
  trigger: string;
  error: DestinationError
}) =>
  track({
    userId,
    event: SegmentEvent.DESTINATION_ERROR_TRIGGERED,
    properties: {
      integration,
      destinationName,
      destinationId,
      trigger,
      ...error
    }
  })

export const trackInstitutionErrorTriggered = ({ userId, institution, error, plaidItemId }: {
  userId: string;
  institution: string;
  error: string;
  plaidItemId: string;
}) =>
  track({
    userId,
    event: SegmentEvent.INSTITUTION_ERROR_TRIGGERED,
    properties: {
      institution,
      error,
      plaidItemId
    }
  })

export const trackInstitutionConsentRevoked = ({ userId, institution }: { userId: string; institution: string }) =>
  track({
    userId,
    event: SegmentEvent.INSTITUTION_CONSENT_REVOKED,
    properties: { institution }
  })

export const trackSupportTicketCreated = ({ userId }: { userId: string }) =>
  track({
    userId,
    event: SegmentEvent.SUPPORT_TICKET_CREATED
  })

export const trackUserUpdated = ({ userId, field }: { userId: string; field: 'display_name'}) =>
  track({
    userId,
    event: SegmentEvent.USER_UPDATED,
    properties: { field }
  })

export const trackUserProfileUpdated = ({ userId, field, oldValue, newValue }: { 
  userId: string, field: 'timezone' | 'is_subscribed_general' | 'is_subscribed_sync_updates' | 'sync_updates_frequency', oldValue: any; newValue: any 
}) =>
  track({
    userId,
    event: SegmentEvent.USER_PROFILE_UPDATED,
    properties: {
      field,
      old_value: oldValue,
      new_value: newValue
    }
  })

export const trackUserDeleted = ({ userId }: { userId: string }) =>
  track({
    userId,
    event: SegmentEvent.USER_DELETED
  })

export const trackNotionConnectionAdded = ({ userId }: { userId: string }) =>
  track({ userId, event: SegmentEvent.NOTION_CONNECTION_ADDED })

export const trackAirtableTokenAdded = ({ userId }: { userId: string }) =>
  track({ userId, event: SegmentEvent.AIRTABLE_TOKEN_ADDED })

export const trackDestinationCreated = ({ userId, integration, destinationId }: { userId: string; integration: Integrations_Enum; destinationId: string }) =>
  track({ userId, event: SegmentEvent.DESTINATION_CREATED, properties: { integration, destinationId }})

export const trackDestinationUpdated = ({ userId, integration, destinationId, field }: { userId: string; integration: Integrations_Enum; destinationId: string; field: 'name' | 'table_configs' }) =>
  track({ userId, event: SegmentEvent.DESTINATION_UPDATED, properties: { integration, destinationId, field }})

export const trackDestinationDeleted = ({ userId, integration, destinationId }: { userId: string; integration: Integrations_Enum; destinationId: string }) =>
  track({ userId, event: SegmentEvent.DESTINATION_DELETED, properties: { integration, destinationId }})

export const trackSyncCompleted = ({ userId, trigger, isSuccess, integration, institutionsSynced, error, destinationId, endedAt }: {
  userId: string;
  trigger: string;
  isSuccess: boolean;
  integration: Integrations_Enum;
  institutionsSynced: number;
  error?: string;
  destinationId: string;
  endedAt: string;
}) =>
  track({
    userId,
    event: SegmentEvent.SYNC_COMPLETED,
    properties: {
      trigger,
      is_success: isSuccess,
      integration,
      institutions_synced: institutionsSynced,
      error,
      destinationId
    },
    timestamp: new Date(endedAt)
  })

// Types
export enum SegmentEvent {
  AIRTABLE_TOKEN_ADDED = "Airtable Token Added",
  USER_SIGNED_UP = "User Signed Up",
  USER_DELETED = "User Deleted",
  NOTION_CONNECTION_ADDED = "Notion Connection Added",
  PLAID_ACCOUNT_UPDATED = "Plaid Account Updated",
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  INSTITUTION_DELETED = "Institution Deleted",
  INSTITUTION_CONSENT_REVOKED = "Institution Consent Revoked",
  INSTITUTION_ERROR_TRIGGERED = "Institution Error Triggered",
  DESTINATION_CREATED = "Destination Created",
  DESTINATION_UPDATED = "Destination Updated",
  DESTINATION_DELETED = "Destination Deleted",
  DESTINATION_ERROR_TRIGGERED = "Destination Error Triggered",
  SUPPORT_TICKET_CREATED = "Support Ticket Created",
  SYNC_COMPLETED = "Sync Completed",
  USER_UPDATED = "User Updated",
  USER_PROFILE_UPDATED = "User Profile Updated",
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
  deleted_at?: Date;
}

export const formatSubscriptionForIdentify = ({ subscriptionFromSchema, subscriptionFromStripe }: {subscriptionFromSchema?: StripeSubscription; subscriptionFromStripe?: Stripe.Subscription }) => {
  if ( subscriptionFromSchema ) { 
    return {
      billing_interval: subscriptionFromSchema.interval,
      subscription_status: subscriptionFromSchema.status,
      canceled_at: subscriptionFromSchema.canceledAt ? new Date(subscriptionFromSchema.canceledAt) : undefined,
      current_period_ends_at: new Date(subscriptionFromSchema.currentPeriodEnd),
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

// Helper Functions
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

  export const trackSubscriptionCanceled = ({ userId, plan, remainingDays, timestamp }: { userId: string; plan: string; remainingDays: number; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_CANCELED,
    properties: { plan, remaining_days: remainingDays },
    timestamp
  })

  export const trackSubscriptionResumed = ({ userId, plan, timestamp }: { userId: string; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_RESUMED,
    properties: { plan },
    timestamp
  })

  export const trackSubscriptionInvoicePaid = ({ userId, revenue, plan, timestamp }: { userId: string; revenue: number; plan: string; timestamp: Date }) =>
  track({
    userId,
    event: SegmentEvent.SUBSCRIPTION_INVOICE_PAID,
    properties: { revenue, plan },
    timestamp
  })