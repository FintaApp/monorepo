import crypto from "crypto";
import { Node as Logtail } from "@logtail/js";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";
import { LogSnag, PublishOptions as LogSnagPublishOptions } from 'logsnag';

import { LogSnagChannel, LogSnagTag, LogSnagEvent } from './types';
import { DestinationError } from "~/types/shared/models";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { Logger as AxiomLogger } from "next-axiom";

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

const logsnagPublish = async ({ options, logger }: { options: PublishOptions; logger: AxiomLogger }): Promise<any>  => {
  if ( !shouldMockLogsnag ) { 
    return logger.info("Mocking Logsnag publish", { options });
  }
  return logsnag.publish(options).then(() => logger.info("Published to Logsnag", { options }))
}

export const logError = ({ error, logger, requestId }: { error: Error; logger: AxiomLogger; requestId: string }) => logsnagPublish({
  options: {
    channel: LogSnagChannel.ERRORS,
      description: `[View Logs](https://cloud.axiom.co/finta-dv39/stream/vercel?caseSensitive=0&ig=&q=%7B%22op%22%3A%22or%22%2C%22field%22%3A%22%22%2C%22children%22%3A%5B%7B%22op%22%3A%22or%22%2C%22field%22%3A%22%22%2C%22children%22%3A%5B%7B%22field%22%3A%22fields.requestId%22%2C%22op%22%3A%22contains%22%2C%22value%22%3A%22${requestId}%22%7D%2C%7B%22field%22%3A%22request.id%22%2C%22op%22%3A%22%3D%3D%22%2C%22value%22%3A%22${requestId}%22%7D%5D%7D%5D%7D`,
      icon: '❌',
      event: error.toString(),
      notify: true,
      parser: 'markdown'
  },
  logger
})

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

  async error(message: Error, context = {}) {
    if ( useConsole ) { console.log(message.stack); console.error(message); return }
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

  async logSyncCompleted({ error, trigger, userId, isSuccess, integration, destinationId, syncLogId, institutionsSynced, targetTable }: {
    userId: string;
    isSuccess: boolean;
    syncLogId: string;
    institutionsSynced: number;
    integration: Integrations_Enum;
    destinationId: string;
    trigger: string;
    error?: string;
    targetTable?: string;
  }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: isSuccess ? LogSnagEvent.SYNC_COMPLETED : LogSnagEvent.SYNC_FAILED,
      description: `Trigger: ${trigger} \n${ error ? `Error: ${error}` : `${institutionsSynced} institution(s) synced`}${ targetTable ? `\nTarget Table: ${targetTable}`: ""}`,
      icon: isSuccess ? '☑️' : '⏹',
      notify: false,
      tags: {
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.SYNC_LOG_ID]: syncLogId,
        [LogSnagTag.DESTINATION_ID]: destinationId,
        [LogSnagTag.INTEGRATION]: integration
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

  async logNotionConnectionAdded({ userId }: { userId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.NOTION_CONNECTION_ADDED,
      icon: '🗺',
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }

  async logAirtableTokenAdded({ userId }: { userId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.AIRTABLE_TOKEN_ADDED,
      icon: '🗺',
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }

  async logDestinationCreated({ userId, integration, destinationId }: { userId: string; integration: Integrations_Enum; destinationId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.DESTINATION_CREATED,
      icon: "🗺",
      tags: { 
        [LogSnagTag.INTEGRATION]: integration, 
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.DESTINATION_ID]: destinationId
      }
    })
  }

  async logDestinationDeleted({ userId, integration, destinationId }: { userId: string; integration: Integrations_Enum; destinationId: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.DESTINATION_DELETED,
      icon: "🗺",
      tags: { 
        [LogSnagTag.INTEGRATION]: integration, 
        [LogSnagTag.USER_ID]: userId,
        [LogSnagTag.DESTINATION_ID]: destinationId
      }
    })
  }
}