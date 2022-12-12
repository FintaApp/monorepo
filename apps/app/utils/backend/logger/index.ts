import crypto from "crypto";
import { Node as Logtail } from "@logtail/js";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";
import { LogSnag, PublishOptions as LogSnagPublishOptions } from 'logsnag';

import { LogSnagChannel, LogSnagTag, LogSnagEvent } from './types';
import { DestinationError } from "~/types/shared/models";

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN!, { batchInterval: 1000 });

const getContextFromLog = (info: winston.Logform.TransformableInfo) =>
  Object.entries(info)
    .filter(([ key, value ]) => !['label', 'timestamp', 'environment', 'vercel', 'level', 'message'].includes(key))
    .reduce((context, [key, value] ) => ({ ...context, [key]: value }), {})

const useConsole = process.env.VERCEL_ENV === 'development';

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

export { logsnag, LogSnagChannel, LogSnagTag, LogSnagEvent }

export const logUnhandledEvent = (description: string) => logsnag.publish({
  channel: LogSnagChannel.ERRORS,
  event: LogSnagEvent.UNHANDLED,
  icon: '😶',
  notify: true,
  description
});

export class Logger {
  useConsole: boolean;
  logger: winston.Logger;

  constructor({ context = {} }: { context?: Record<string, any> }) {
    const defaultMeta = {
      environment: process.env.VERCEL_ENV || 'production',
      requestId: crypto.randomUUID(),
      ...context
    };

    this.logger = winston.createLogger({
      level: 'debug',
      format: useConsole ? winston.format.combine(
        winston.format.colorize({
          all: false
        }),
        winston.format.label({
          label: '[LOGGER]'
        }),
        winston.format.timestamp({
          format:"MM-DD-YYYY HH:mm:SS.SSS"
        }),
        winston.format.printf(
          info => `${info.label} ${info.level} ${info.timestamp} : ${info.message} \n Context: ${JSON.stringify(getContextFromLog(info), null, 2)}`
        )
      ) : undefined,
      transports: [ useConsole ? new winston.transports.Console() : new LogtailTransport(logtail)],
      defaultMeta
    });
    this.useConsole = useConsole
  }

  addContext(context: Record<string, any>) {
    this.logger.defaultMeta = { ...this.logger.defaultMeta, ...context }
  }

  async debug(message: string, context: Record<string, any> = {}): Promise<any> {
    return this.logger.debug(message, context)
  }

  async info(message: string, context: Record<string, any> = {}): Promise<any> {
    return this.logger.info(message, context)
  }

  async _error(message: any, context: Record<string, any> = {}): Promise<any> {
    return this.logger.error(message, context)
  }

  async flush() {
    return logtail.info("Logtail flushed", { ...this.logger.defaultMeta })
  }

  async logsnagPublish(options: PublishOptions): Promise<any> {
    if ( shouldMockLogsnag ) { 
      return this.info("Mocking Logsnag publish", { options })
    }
    return logsnag.publish(options).then(async () => await this.info("Published to Logsnag", { options }))
  }

  async error(message: any, context = {}) {
    const requestId = this.logger.defaultMeta.requestId;
    this._error(message, context);
    return this.logsnagPublish({
      channel: LogSnagChannel.ERRORS,
      description: `[View Logs](logtail.com/team/72746/tail?q=requestId%3a%22${requestId}`,
      icon: '❌',
      event: message.toString(),
      notify: true,
      tags: { [LogSnagTag.USER_ID]: this.logger.defaultMeta.user?.id },
      parser: 'markdown'
    });
  }

  async logUserSignedUp({ displayName, userId }: { displayName: string; userId: string; }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.USER_SIGNED_UP,
      description: `${displayName} just signed up!`,
      icon: "👤",
      notify: true,
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  };

  async logInstitutionCreated({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.INSTITUTION_CREATED,
      icon: "🏦",
      tags: {
        [LogSnagTag.INSTITUTION ]: institution, 
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.ITEM_ID]: itemId
      }
    })
  }

  async logInstitutionReconnected({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.INSTITUTION_RECONNECTED,
      icon: "🏦",
      tags: {
        [LogSnagTag.INSTITUTION ]: institution, 
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.ITEM_ID]: itemId
      }
    })
  }

  async logInstitutionDeleted({ institution, userId, itemId }: { institution: string; userId: string; itemId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.INSTITUTION_DELETED,
      icon: "🏦",
      tags: {
        [LogSnagTag.INSTITUTION ]: institution, 
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.ITEM_ID]: itemId
      }
    })
  };

  async logSyncCompleted({ userId, isSuccess, itemId, syncLogId, destinationsSynced, shouldNotify = false}: {
    userId: string;
    isSuccess: boolean;
    itemId: string;
    syncLogId: string;
    destinationsSynced: number;
    shouldNotify?: boolean
  }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: isSuccess ? LogSnagEvent.SYNC_COMPLETED : LogSnagEvent.SYNC_FAILED,
      description: `${destinationsSynced} destination(s) synced`,
      icon: isSuccess ? '☑️' : '⏹',
      notify: shouldNotify,
      tags: {
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.ITEM_ID]: itemId,
        [LogSnagTag.SYNC_LOG_ID]: syncLogId
      }
    })
  }

  async logInstitutionErrorTriggered({ userId, institution, itemId, error }: {
    userId: string;
    institution: string;
    itemId: string;
    error: string;
  }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.INSTITUTION_ERROR_TRIGGERED,
      description: `Error: ${error}`,
      icon: '🏦',
      tags: {
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.INSTITUTION]: institution,
        [LogSnagTag.ITEM_ID]: itemId
      }
    })
  }

  async logDestinationErrorTriggered({ userId, destinationId, error, syncLogId }: {
    userId: string;
    destinationId: string;
    error: DestinationError;
    syncLogId: string
  }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.SYNCS,
      event: LogSnagEvent.DESTINATION_ERROR_TRIGGERED,
      description: JSON.stringify(error),
      icon: '🗺',
      tags: {
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.DESTINATION_ID]: destinationId,
        [LogSnagTag.SYNC_LOG_ID]: syncLogId
      }
    })
  }

  async logUserDeleted({ userId }: { userId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.USER_DELETED,
      icon: '😭',
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }
}