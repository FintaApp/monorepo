import { Field, Integration, SyncError, Table } from '@prisma/client';
import { LogSnag, PublishOptions } from 'logsnag';
import { Logger, log } from "next-axiom";

const shouldMockLogsnag = ['development', 'preview'].includes(process.env.VERCEL_ENV || "");

const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

const logsnagPublish = (options: PublishOptions) => {
  if ( shouldMockLogsnag ) {
    return log.info("Mocking Logsnag publish", { options })
  }
  
  return logsnag.publish(options).then(() => log.info("Published to Logsnag", { options }))
}

export const logUnhandledEvent = (description: string) => logsnagPublish({
  channel: Channel.ERRORS,
  event: Event.UNHANDLED,
  icon: '😶',
  notify: true,
  description
});

export const logUserSignedUp = ({ name, email, userId }: { name?: string; email: string; userId: string; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.USER_SIGNED_UP,
    description: `${name || email} just signed up!`,
    icon: "👤",
    notify: true,
    tags: { [Tag.USER_ID]: userId }
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

export const  logDestinationCreated = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
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

export const  logDestinationDeleted = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
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

  

export const logNotionConnectionAdded = ({ userId }: { userId: string }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.NOTION_CONNECTION_ADDED,
    icon: '🗺',
    tags: { [Tag.USER_ID]: userId }
  })

export const logAirtableTokenAdded = ({ userId }: { userId: string }) =>
  logsnagPublish({
      channel: Channel.ACTIVITY,
      event: Event.AIRTABLE_TOKEN_ADDED,
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
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_DELETED = "Institution Deleted",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  NOTION_CONNECTION_ADDED = "Notion Connection Added",
  SYNC_COMPLETED = "Sync Completed",
  UNHANDLED = "Unhandled",
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