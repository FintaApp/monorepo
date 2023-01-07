import { Field, Integration, SyncError, Table } from '@prisma/client';
import { LogSnag, PublishOptions } from 'logsnag';
import { log } from "next-axiom";

const shouldMockLogsnag = ['development', 'preview'].includes(process.env.VERCEL_ENV || "");

export const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

const icons = {
  chart: "📈",
  revenue: '💰',
  user: '👤',
  hourglass: '⏳',
  destination: '🗺',
  item: '🏦'
}

const logsnagPublish = (options: PublishOptions) => {
  if ( shouldMockLogsnag ) {
    return log.info("Mocking Logsnag publish", { options })
  }
  
  return logsnag.publish(options).then(() => log.info("Published to Logsnag", { options }))
};

export const logsnagInsight = async ({ title, value, icon }: { title: string; value: any, icon: keyof typeof icons }) => {
  if ( shouldMockLogsnag ) {
    return log.info("Mocking Logsnag insight", { title, value, icon: icons[icon] })
  }

  return logsnag.insight({ title, value, icon: icons[icon]})
}

export const logUnhandledEvent = (description: string) => logsnagPublish({
  channel: Channel.ERRORS,
  event: Event.UNHANDLED,
  icon: '😶',
  notify: true,
  description
});

export const logError = ({ error, logRequestId }: { error: Error; logRequestId: string; }) =>
  logsnagPublish({
    channel: Channel.ERRORS,
    icon: '❌',
    event: Event.ERROR,
    description: `Error: ${error.message}\n[View Logs](https://cloud.axiom.co/finta-dv39/stream/vercel?caseSensitive=0&ig=&q=%7B%22op%22%3A%22and%22%2C%22field%22%3A%22%22%2C%22children%22%3A%5B%7B%22field%22%3A%22fields.requestId%22%2C%22op%22%3A%22%3D%3D%22%2C%22value%22%3A%22${logRequestId}%22%7D%5D%7D)`,
    notify: true,
    parser: 'markdown'
  })

export const logUserSignedUp = ({ name, email, userId }: { name?: string; email: string; userId: string; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.USER_SIGNED_UP,
    description: `${name || email} just signed up!`,
    icon: "👤",
    notify: true,
    tags: { [Tag.USER_ID]: userId }
  })

export const logRevenue = ({ userName, revenue, userId, lifetimeRevenue }: { userName: string; revenue: number; userId: string; lifetimeRevenue: number; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.REVENUE,
    description: `${userName} paid $${revenue}. Lifetime revenue is now $${lifetimeRevenue}`,
    icon: "💰",
    notify: true,
    tags: {
      [Tag.USER_ID]: userId
    }
  });

export const logSubscriptionStarted = ({ plan, remainingTrialDays, userId }: { plan: string; remainingTrialDays: number; userId: string; }) =>
 logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.SUBSCRIPTION_STARTED,
    description: `Plan: ${plan}\nRemaining trial days: ${remainingTrialDays}`,
    icon: "🚀",
    tags: { [Tag.USER_ID]: userId}
  })

export const logSubscriptionEnded = ({ userId, plan }: { userId: string; plan: string; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.SUBSCRIPTION_ENDED,
    description: `Plan: ${plan}`,
    icon: "😔",
    tags: { [Tag.USER_ID]: userId}
  })

export const logSubscriptionCanceled = ({ userId, plan }: { userId: string; plan: string; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.SUBSCRIPTION_CANCELED,
    description: `Plan: ${plan}`,
    icon: "😕",
    tags: { [Tag.USER_ID]: userId}
  })

export const logSubscriptionRenewed = ({ userId, plan }: { userId: string; plan: string; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.SUBSCRIPTION_RENEWED,
    description: `Plan: ${plan}`,
    icon: "😅",
    tags: { [Tag.USER_ID]: userId}
  });

export const logAirtableTokenAdded = ({ userId }: { userId: string }) =>
  logsnagPublish({
      channel: Channel.ACTIVITY,
      event: Event.AIRTABLE_TOKEN_ADDED,
      icon: '🗺',
      tags: { [Tag.USER_ID]: userId }
  })

export const logNotionConnectionAdded = ({ userId }: { userId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.NOTION_CONNECTION_ADDED,
    icon: '🗺',
    tags: { [Tag.USER_ID]: userId }
  })

export const logDestinationErrorTriggered = ({ userId, destinationId, error, syncId }: {
  userId: string;
  destinationId: string;
  error: { code: SyncError, table?: Table, tableId?: string; tableName?: string; field?: Field; fieldId?: string; fieldName?: string; };
  syncId: string
}) => 
  logsnagPublish({
    channel: Channel.SYNCS,
    event: Event.DESTINATION_ERROR_TRIGGERED,
    description: JSON.stringify(error),
    icon: '🗺',
    tags: {
      [Tag.USER_ID]: userId,
      [Tag.DESTINATION_ID]: destinationId,
      [Tag.SYNC_ID]: syncId
    }
  })

export const logInstitutionErrorTriggered = ({ userId, institution, itemId, error }: {
  userId: string;
  institution: string;
  itemId: string;
  error: string;
}) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.INSTITUTION_ERROR_TRIGGERED,
    description: `Error: ${error}`,
      icon: '🏦',
      tags: {
        [Tag.USER_ID]: userId,
        [Tag.INSTITUTION]: institution,
        [Tag.ITEM_ID]: itemId
      }
  })

export const logInstitutionReconnected = ({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.INSTITUTION_RECONNECTED,
    icon: "🏦",
    tags: {
      [Tag.INSTITUTION ]: institution, 
      [Tag.USER_ID]: userId,
      [Tag.ITEM_ID]: itemId
    }
  })

export const logInstitutionCreated = ({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.INSTITUTION_CREATED,
    icon: "🏦",
    tags: {
      [Tag.INSTITUTION ]: institution, 
      [Tag.USER_ID]: userId,
      [Tag.ITEM_ID]: itemId
    }
  })

export const logInstitutionDeleted = ({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.INSTITUTION_DELETED,
    icon: "🏦",
    tags: {
      [Tag.INSTITUTION ]: institution, 
      [Tag.USER_ID]: userId,
      [Tag.ITEM_ID]: itemId
    }
  })

export const logSyncCompleted = ({ trigger, userId, integration, destinationId, syncId, institutionsSynced, targetTable }: {
  userId: string;
  syncId: string;
  institutionsSynced: number;
  integration: Integration;
  destinationId: string;
  trigger: string;
  targetTable?: string;
}) => 
  logsnagPublish({
    channel: Channel.SYNCS,
    event: Event.SYNC_COMPLETED,
    description: `Trigger: ${trigger} \n${institutionsSynced} institution(s) synced${ targetTable ? `\nTarget Table: ${targetTable}`: ""}`,
    icon: '☑️',
    notify: false,
    tags: {
      [Tag.USER_ID]: userId,
      [Tag.SYNC_ID]: syncId,
      [Tag.DESTINATION_ID]: destinationId,
      [Tag.INTEGRATION]: integration
    }
  })

export const logDestinationCreated = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.DESTINATION_CREATED,
    icon: "🗺",
    tags: { 
      [Tag.INTEGRATION]: integration, 
      [Tag.USER_ID]: userId,
      [Tag.DESTINATION_ID]: destinationId
    }
  })

export const logDestinationDeleted = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.DESTINATION_DELETED,
    icon: "🗺",
    tags: { 
      [Tag.INTEGRATION]: integration, 
      [Tag.USER_ID]: userId,
      [Tag.DESTINATION_ID]: destinationId
    }
  })

export const logUserDeleted = ({ userId }: { userId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.USER_DELETED,
    icon: '😭',
    notify: true,
    tags: { [Tag.USER_ID]: userId}
  })

// Types
enum Channel {
  ACTIVITY = 'activity',
  ERRORS = 'errors',
  SYNCS = 'syncs'
}

enum Event {
  AIRTABLE_TOKEN_ADDED = "Airtable Token Added",
  DESTINATION_CREATED = "Destination Created",
  DESTINATION_DELETED = "Destination Deleted",
  DESTINATION_ERROR_TRIGGERED = "Destination Error Triggered",
  ERROR = "Error",
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_DELETED = "Institution Deleted",
  INSTITUTION_ERROR_TRIGGERED = "Institution Error Triggered",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  NOTION_CONNECTION_ADDED = "Notion Connection Added",
  REVENUE = 'Incoming Revenue!',
  SUBSCRIPTION_STARTED = "Subscription Started",
  SUBSCRIPTION_CANCELED = "Subscription Canceled",
  SUBSCRIPTION_ENDED = "Subscription Ended",
  SUBSCRIPTION_RENEWED = "Subscription Renewed",
  SYNC_COMPLETED = "Sync Completed",
  UNHANDLED = "Unhandled",
  USER_DELETED = "User Deleted",
  USER_SIGNED_UP = "User Signed Up",
}

enum Tag {
  USER_ID = 'user-id',
  INSTITUTION = 'institution',
  ITEM_ID = 'item-id',
  SYNC_ID = 'sync-id',
  DESTINATION_ID = 'destination-id',
  INTEGRATION = 'integration'
}