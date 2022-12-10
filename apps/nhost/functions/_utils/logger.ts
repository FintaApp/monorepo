import crypto from "crypto";
import { Logtail } from "@logtail/node";
import winston from "winston";
import { LogSnag, PublishOptions as LogSnagPublishOptions } from 'logsnag';

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN!, { batchInterval: 1000 });

const getContextFromLog = (info: winston.Logform.TransformableInfo) =>
  Object.entries(info)
    .filter(([ key, value ]) => !['label', 'timestamp', 'environment', 'vercel', 'level', 'message'].includes(key))
    .reduce((context, [key, value] ) => ({ ...context, [key]: value }), {})
const getLogtailDescription = (sessionId: string) => `[View Logs](https://logtail.com/team/72746/tail?q=sessionid%3D${sessionId})`

const env = process.env.ENV;
const useConsole = env === 'development';
const shouldMockLogsnag = ['development', 'staging'].includes(env || "");

export enum LogSnagEvent {
  SUBSCRIPTION_STARTED = "Subscription Started",
  SUBSCRIPTION_ENDED = "Subscription Ended",
  SUBSCRIPTION_RESUMED = "Subscription Resumed",
  SUBSCRIPTION_CANCELED = "Subscription Canceled",
  REVENUE = "Incoming Revenue!"
}

export enum LogSnagChannel {
  ACTIVITY = 'activity',
  ERRORS = 'errors'
}

export enum LogSnagTag {
  USER_ID = 'user-id'
}

interface PublishOptions extends LogSnagPublishOptions {
  channel: LogSnagChannel;
  event: LogSnagEvent;
  tags?: Partial<Record<LogSnagTag, any>>
}

const logsnag = new LogSnag({ 
  token: process.env.LOGSNAG_TOKEN!,
  project: 'finta'
});

export class Logger {
  context: { environment: string; sessionId: string; [key: string]: any };
  useConsole: boolean;
  logtailLogger: Logtail;
  winstonLogger: winston.Logger;

  constructor({ context = {} }: { context?: Record<string, any> }) {
    // this.logger = winston.createLogger({
    //   level: 'debug',
    //   format: useConsole ? winston.format.combine(
    //     winston.format.colorize({
    //       all: false
    //     }),
    //     winston.format.label({
    //       label: '[LOGGER]'
    //     }),
    //     winston.format.timestamp({
    //       format:"MM-DD-YYYY HH:mm:ss.SSS"
    //     }),
    //     winston.format.printf(
    //       info => `${info.label} ${info.level} ${info.timestamp} : ${info.message} \n Context: ${JSON.stringify(getContextFromLog(info), null, 2)}`
    //     )
    //   ) : undefined,
    //   transports: [ useConsole ? new winston.transports.Console() : new LogtailTransport(logtail)],
    //   defaultMeta: {
    //     environment: process.env.VERCEL_ENV || 'production',
    //     vercel: { request_id: requestId },
    //     ...context
    //   }
    // });

    const defaultMeta = {
      environment: process.env.ENV || 'production',
      sessionId: crypto.randomUUID(),
      ...context
    }

    this.winstonLogger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({
          all: false
        }),
        winston.format.label({
          label: '[LOGGER]'
        }),
        winston.format.timestamp({
          format:"MM-DD-YYYY HH:mm:ss.SSS"
        }),
        winston.format.printf(
          info => `${info.label} ${info.level} ${info.timestamp} : ${info.message} \n Context: ${JSON.stringify(getContextFromLog(info), null, 2)}`
        )
      ),
      transports: [ new winston.transports.Console() ],
      defaultMeta
    });
    this.logtailLogger = logtail;
    this.useConsole = useConsole
    
    this.context = defaultMeta
  }

  addContext(context: Record<string, any>) {
    const newContext = { ...this.context, ...context };
    this.context = newContext;
    this.winstonLogger.defaultMeta = newContext
  }

  async debug(message: string, context: Record<string, any> = {}) {
    return this.useConsole
      ? this.winstonLogger.debug(message, context)
      : this.logtailLogger.debug(message, { ...this.context, ...context })
  }

  async info(message: string, context: Record<string, any> = {}) {
    return this.useConsole
      ? this.winstonLogger.info(message, context)
      : this.logtailLogger.info(message, { ...this.context, ...context })
  }

  async _error(message: any, context: Record<string, any> = {}) {
    return this.useConsole
      ? this.winstonLogger.error(message, context)
      : this.logtailLogger.error(message, { ...this.context, ...context })
  }

  async logsnagPublish(options: PublishOptions) {
    if ( shouldMockLogsnag ) { 
      return this.info("Mocking Logsnag publish", { options })
    }
    return logsnag.publish(options).then(async () => await this.info("Published to Logsnag", { options }))
  }

  async error(message: any, context = {}) {
    this._error(message, context);
    return this.logsnagPublish({
      channel: LogSnagChannel.ERRORS,
      description: getLogtailDescription(this.context.sessionId),
      icon: '❌',
      event: message.toString(),
      notify: true,
      tags: { [LogSnagTag.USER_ID]: this.context.userId },
      parser: 'markdown'
    });
  }

  async logSubscriptionStarted({ userId, displayName, plan, remainingTrialDays }: { userId: string; displayName: string; plan: string; remainingTrialDays?: number }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.SUBSCRIPTION_STARTED,
      description: `${displayName} just started the ${plan}ly plan. ${remainingTrialDays ? `\nRemaining trial days: ${remainingTrialDays}` : ''}`,
      icon: "🚀",
      notify: true,
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }

  async logSubscriptionEnded({ userId, plan }: { userId: string; plan: string; }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.SUBSCRIPTION_ENDED,
      description: `${plan}ly plan ended`,
      icon: "😔",
      notify: false,
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }

  async logSubscriptionResumed({ userId, plan }: { userId: string; plan: string }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.SUBSCRIPTION_RESUMED,
      description: `${plan}ly plan resumed`,
      icon: "😅",
      notify: true,
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }

  async logSubscriptionCanceled({ userId, plan, remainingDays }: { userId: string; plan: string; remainingDays: number }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.SUBSCRIPTION_CANCELED,
      description: `${plan}ly plan canceled with ${remainingDays} day(s) remaining.`,
      icon: '😕',
      notify: false,
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }

  async logRevenue({ userId, displayName, revenue, lifetimeRevenue }: { userId: string; displayName: string; revenue: number; lifetimeRevenue: number }) {
    return this.logsnagPublish({
      channel: LogSnagChannel.ACTIVITY,
      event: LogSnagEvent.REVENUE,
      description: `${displayName} plaid $${revenue}. Total lifetime revenue is $${lifetimeRevenue}`,
      icon: "💰",
      notify: true,
      tags: { [LogSnagTag.USER_ID]: userId }
    })
  }
}