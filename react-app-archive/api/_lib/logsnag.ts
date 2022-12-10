import { LogSnag, PublishOptions as LogSnagPublishOptions } from 'logsnag';
import { Sentry } from "./sentry";

interface InsightOptions {
  /**
   * Insight title
   * example: "User Count"
   */
  title: string;
  /**
   * Insight value
   * example: 100
   */
  value: string | boolean | number;
  /**
   * Event icon (emoji)
   * must be a single emoji
   * example: "👨"
   */
  icon?: string;
}

export enum LogSnagEvent {
  USER_SIGNED_UP = "User Signed Up",
  DESTINATION_CREATED = 'Destination Created',
  DESTINATION_DELETED = 'Destination Deleted',
  DESTINATION_ERROR_TRIGGERED = 'Destination Error Triggered',
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_DELETED = "Institution Deleted",
  INSTITUTION_ERROR_TRIGGERED = 'Institution Error Triggered',
  SUBSCRIPTION_STARTED = "Subscription Started",
  SUBSCRIPTION_CANCELED = "Subscription Canceled",
  SUBSCRIPTION_ENDED = "Subscription Ended",
  SUBSCRIPTION_UNCANCELED = "Subscription Uncanceled",
  SYNC_STARTED = 'Sync Started',
  SYNC_COMPLETED = "Sync Completed",
  SYNC_FAILED = "Sync Failed",
  REVENUE = 'Incoming Revenue!',
  UNHANDLED = "Unhandled"
}

export enum LogSnagChannel {
  ACTIVITY = 'activity',
  ERRORS = 'errors',
  SYNCS = 'syncs'
}

export enum LogSnagTags {
  USER_ID = 'user-id',
  INTEGRATION = 'integration',
  INSTITUTION = 'institution',
  DESTINATION_ID = 'destination-id',
  ITEM_ID = 'item-id',
  OPERATION = 'operation',
  WEBHOOK = 'webhook',
  IS_SUCCESS = 'is-success',
  PLAN = 'plan',
  REMAINING_TRIAL_DAYS = "remaining-trial-days",
  TRIGGER = 'trigger',
  SYNC_LOG_ID = 'sync-log-id',
  ERROR = 'error'
}

interface PublishOptions extends LogSnagPublishOptions {
  channel: LogSnagChannel;
  event: LogSnagEvent | string;
  tags?: Partial<Record<LogSnagTags, any>>
}

const shouldMock = ['development', 'preview'].includes(process.env.VERCEL_ENV || "")

const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

export const publish = async (options: PublishOptions ): Promise<boolean> => {
  if ( shouldMock ) { return true };
  return logsnag.publish(options);
}

export const insight = async (options: InsightOptions): Promise<boolean> => {
  if ( shouldMock ) { return true };
  return logsnag.insight(options);
}

export const logError = async ({ operation, error, scope, tags = {} }: { operation: string; error: Error | any | unknown, scope: Sentry.Scope ;tags?: Partial<Record<LogSnagTags, any>> }) => {
  const eventId = Sentry.captureException(error, scope);
  if ( shouldMock ) { console.error("Mocking logsnag", error); return true }

  return logsnag.publish({
    channel: LogSnagChannel.ERRORS,
    description: `[Sentry Link](https://sentry.io/organizations/finta-app/issues/?query=${eventId})`,
    icon: '❌',
    event: `Error: ${error.message}`,
    notify: true,
    tags: { [LogSnagTags.OPERATION]: operation, ...tags }
  })
}