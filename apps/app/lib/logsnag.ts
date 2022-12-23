import { Integration } from '@prisma/client';
import { LogSnag, PublishOptions } from 'logsnag';
import { Logger, log } from "next-axiom";

const shouldMockLogsnag = ['development', 'preview'].includes(process.env.VERCEL_ENV || "");

const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

const logsnagPublish = ({ options, logger }: { options: PublishOptions, logger?: Logger }) => {
  const _logger = logger || log;

  if ( shouldMockLogsnag ) {
    return _logger.info("Mocking Logsnag publish", { options })
  }
  
  return logsnag.publish(options).then(() => _logger.info("Published to Logsnag", { options }))
}

export const logUserSignedUp = ({ name, email, userId }: { name?: string; email: string; userId: string; }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.USER_SIGNED_UP,
      description: `${name || email} just signed up!`,
      icon: "👤",
      notify: true,
      tags: { [Tag.USER_ID]: userId }
    }
  })

export const logInstitutionCreated = ({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.INSTITUTION_CREATED,
      icon: "🏦",
      tags: {
        [Tag.INSTITUTION ]: institution, 
        [Tag.USER_ID]: userId,
        [Tag.ITEM_ID]: itemId
      }
    }
  })

export const logInstitutionReconnected = ({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.INSTITUTION_RECONNECTED,
      icon: "🏦",
      tags: {
        [Tag.INSTITUTION ]: institution, 
        [Tag.USER_ID]: userId,
        [Tag.ITEM_ID]: itemId
      }
    }
  })

export const logInstitutionDeleted = ({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.INSTITUTION_DELETED,
      icon: "🏦",
      tags: {
        [Tag.INSTITUTION ]: institution, 
        [Tag.USER_ID]: userId,
        [Tag.ITEM_ID]: itemId
      }
    }
  })

export const  logDestinationCreated = ({ userId, integration, destinationId }: { userId: string; integration: Integration; destinationId: string }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.DESTINATION_CREATED,
      icon: "🗺",
      tags: { 
        [Tag.INTEGRATION]: integration, 
        [Tag.USER_ID]: userId,
        [Tag.DESTINATION_ID]: destinationId
      }
    }
  })

export const logNotionConnectionAdded = ({ userId }: { userId: string }) =>
    logsnagPublish({
      options: {
        channel: Channel.ACTIVITY,
        event: Event.NOTION_CONNECTION_ADDED,
        icon: '🗺',
        tags: { [Tag.USER_ID]: userId }
      }
    })

export const logAirtableTokenAdded = ({ userId }: { userId: string }) =>
  logsnagPublish({
    options: {
      channel: Channel.ACTIVITY,
      event: Event.AIRTABLE_TOKEN_ADDED,
      icon: '🗺',
      tags: { [Tag.USER_ID]: userId }
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
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_DELETED = "Institution Deleted",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  NOTION_CONNECTION_ADDED = "Notion Connection Added",
  USER_SIGNED_UP = "User Signed Up",
}

enum Tag {
  USER_ID = 'user-id',
  INSTITUTION = 'institution',
  ITEM_ID = 'item-id',
  SYNC_LOG_ID = 'sync-log-id',
  DESTINATION_ID = 'destination-id',
  INTEGRATION = 'integration'
}