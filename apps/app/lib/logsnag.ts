import { LogSnag, PublishOptions } from 'logsnag';
import { log } from "next-axiom";

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

export const logUserSignedUp = ({ name, email, userId }: { name?: string; email: string; userId: string; }) =>
  logsnagPublish({
    channel: Channel.ACTIVITY,
    event: Event.USER_SIGNED_UP,
    description: `${name || email} just signed up!`,
    icon: "👤",
    notify: true,
    tags: { [Tag.USER_ID]: userId }
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