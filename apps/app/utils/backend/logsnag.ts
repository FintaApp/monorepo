import { LogSnag, PublishOptions as LogSnagPublishOptions } from 'logsnag';
import { Logger } from "next-axiom";

interface PublishOptions extends LogSnagPublishOptions {
  channel: LogSnagChannel;
  event: LogSnagEvent | string;
  tags?: Partial<Record<LogSnagTag, any>>
}

const shouldMockLogsnag = ['development', 'preview'].includes(process.env.VERCEL_ENV || "");
const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

const logsnagPublish = async ({ options, logger }: { options: PublishOptions; logger: Logger }): Promise<any>  => {
  if ( shouldMockLogsnag ) { 
    return logger.info("Mocking Logsnag publish", { options });
  }
  return logsnag.publish(options).then(() => logger.info("Published to Logsnag", { options }))
}

export const logError = ({ error, logger, requestId }: { error: Error; logger: Logger; requestId: string }) => logsnagPublish({
  options: {
    channel: LogSnagChannel.ERRORS,
      description: `[View Logs](https://cloud.axiom.co/finta-dv39/stream/vercel?caseSensitive=0&ig=&q=%7B%22op%22%3A%22or%22%2C%22field%22%3A%22%22%2C%22children%22%3A%5B%7B%22op%22%3A%22or%22%2C%22field%22%3A%22%22%2C%22children%22%3A%5B%7B%22field%22%3A%22fields.requestId%22%2C%22op%22%3A%22contains%22%2C%22value%22%3A%22${requestId}%22%7D%2C%7B%22field%22%3A%22request.id%22%2C%22op%22%3A%22%3D%3D%22%2C%22value%22%3A%22${requestId}%22%7D%5D%7D%5D%7D)`,
      icon: '❌',
      event: error.toString(),
      notify: true,
      parser: 'markdown'
  },
  logger
})


enum LogSnagTag {
  USER_ID = 'user-id',
  INSTITUTION = 'institution',
  ITEM_ID = 'item-id',
  SYNC_LOG_ID = 'sync-log-id',
  DESTINATION_ID = 'destination-id',
  INTEGRATION = 'integration'
}

enum LogSnagChannel {
  ACTIVITY = 'activity',
  ERRORS = 'errors',
  SYNCS = 'syncs'
}

enum LogSnagEvent {
  AIRTABLE_TOKEN_ADDED = "Airtable Token Added",
  USER_SIGNED_UP = "User Signed Up",
  USER_DELETED = "User Deleted",
  DESTINATION_CREATED = "Destination Created",
  DESTINATION_DELETED = "Destination Deleted",
  NOTION_CONNECTION_ADDED = "Notion Connection Added",
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  INSTITUTION_DELETED = "Institution Deleted",
  UNHANDLED = "Unhandled",
  SYNC_COMPLETED = "Sync Completed",
  SYNC_FAILED = "Sync Failed",
  INSTITUTION_ERROR_TRIGGERED = 'Institution Error Triggered',
  DESTINATION_ERROR_TRIGGERED = "Destination Error Triggered"
}