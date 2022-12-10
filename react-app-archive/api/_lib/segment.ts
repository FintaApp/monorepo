import segment from "analytics-node";
import Stripe from "stripe";

const client = new segment(process.env.REACT_APP_SEGMENT_KEY!, { flushInterval: 2000 });

export const identify = ({ userId, traits = {}, timestamp }: {
  userId: string;
  traits?: SegmentUserTraits,
  timestamp?: Date
}) => 
  new Promise((resolve, reject) => {
    client.identify({
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

export const track = ({ userId, event, properties = {}, timestamp }: SegmentTrackProps) => 
  new Promise((resolve, reject) => {
    client.track({
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

  export interface SegmentUserTraits {
    has_coda_destination?: boolean;
    has_airtable_destination?: boolean;
    has_notion_destination?: boolean;
    has_google_sheets_destination?: boolean;
    destinations_count?: number;
    institutions_count?: number;
    name?: string;
    email?: string;
    created_at?: number | Date;
    billing_interval?: Stripe.Price.Recurring.Interval;
    subscription_status?: Stripe.Subscription.Status;
    trial_end?: number | null;
    cancel_at_period_end?: boolean;
    current_period_end?: number | Date;
    canceled_at?: number | null;
    has_payment_method?: boolean;
    lifetime_revenue?: number;
    timezone?: string;
  }
  
  export enum Events {
    DESTINATION_CREATED = "Destination Created",
    DESTINATION_DELETED = "Destination Deleted",
    DESTINATION_ERROR_TRIGGERED = "Destination Error Triggered",
    INSTITUTION_CREATED = "Institution Created",
    INSTITUTION_DELETED = "Institution Deleted",
    INSTITUTION_CONSENT_REVOKED = "Institution Consent Revoked",
    INSTITUTION_ERROR_TRIGGERED = "Institution Error Triggered",
    INSTITUTION_RECONNECTED = "Institution Reconnected",
    NOTION_CONNECTION_ADDED = "Notion Connection Added",
    SUPPORT_TICKET_CREATED = "Support Ticket Created",
    USER_SIGNED_UP = "User Signed Up",
    SUBSCRIPTION_INVOICE_PAID = "Subscription Invoice Paid",
    SYNC_COMPLETED = "Sync Completed",
    SUBSCRIPTION_STARTED = 'Subscription Started',
    SUBSCRIPTION_ENDED = "Subscription Ended",
    SUBSCRIPTION_CANCELED = "Subscription Canceled",
    SUBSCRIPTION_UNCANCELED = "Subscription Uncanceled",
    SUBSCRIPTION_UPGRADED = "Subscription Upgraded",
    SUBSCRIPTION_DOWNGRADED = "Subscription Downgraded",
    USER_UPDATED = "User Updated"
  }
  
  interface BaseSegmentTrackProps {
    userId: string;
    timestamp?: Date;
    event: Events;
    properties?: object;
  }
  
  interface DestinationCreatedTrackProps extends BaseSegmentTrackProps {
    event: Events.DESTINATION_CREATED;
    properties: {
      integration: string;
    }
  }
  
  interface DestinationDeletedTrackProps extends BaseSegmentTrackProps {
    event: Events.DESTINATION_DELETED;
    properties: {
      integration: string;
    }
  }
  
  interface InstitutionDeletedTrackProps extends BaseSegmentTrackProps {
    event: Events.INSTITUTION_DELETED;
    properties: {
      provider: 'plaid'
    }
  }
  
  interface InstitutionConsentRevokedTrackProps extends BaseSegmentTrackProps {
    event: Events.INSTITUTION_CONSENT_REVOKED;
    properties: {
      provider: 'plaid',
      institution: string;
    }
  }
  
  interface InstitutionErrorTriggeredTrackProps extends BaseSegmentTrackProps {
    event: Events.INSTITUTION_ERROR_TRIGGERED;
    properties: {
      provider: 'plaid';
      institution: string;
      error: string;
    }
  }
  
  interface DestinationErrorTriggered extends BaseSegmentTrackProps {
    event: Events.DESTINATION_ERROR_TRIGGERED,
    properties: {
      integration: string;
      error_code: string;
      table?: string;
      field?: string;
    }
  }
  
  
  export type SegmentTrackProps = BaseSegmentTrackProps | DestinationCreatedTrackProps | 
    DestinationDeletedTrackProps | InstitutionDeletedTrackProps | InstitutionConsentRevokedTrackProps |
    InstitutionErrorTriggeredTrackProps | DestinationErrorTriggered