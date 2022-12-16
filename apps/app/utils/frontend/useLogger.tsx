import { Browser as Logtail } from "@logtail/js";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { LogSnag, PublishOptions } from "logsnag";

import { nhost } from "~/utils/nhost";
import { useToast } from "./useToast";

type Context = Record<string, any>;

interface LoggerContextType {
  info: (message: string, context?: Context) => Promise<void>;
  error: (message: Error, context?: Context, showToast?: boolean) => Promise<void>;
}

const shouldMockLogtail = ['development'].includes(process.env.NEXT_PUBLIC_VERCEL_ENV || "");
const shouldMockLogSnag = ['preview', 'development'].includes(process.env.NEXT_PUBLIC_VERCEL_ENV || "");

const LoggerContext = createContext<LoggerContextType>({ 
  info: async (message, context) => console.log(message, context),
  error: async (message, context) => console.error(message, context)    
});

export const LoggerProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const logger = new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_SOURCE_TOKEN!);
  const logsnag = new LogSnag({ 
    token: process.env.NEXT_PUBLIC_LOGSNAG_TOKEN!,
    project: 'finta'
  });

  const renderToast = useToast();

  logger.use(async (log) => {
    const user = nhost.auth.getUser();
    return { 
      ...log, 
      user: user && { id: user.id },
      browser: typeof(navigator) !== 'undefined' && navigator.userAgent,
      resolution: typeof(window) !== 'undefined' && {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  });

  const info = async (message: string, context: Context = {}) => {
    if ( shouldMockLogtail ) { console.info(message, context); return; }
    await logger.info(message, context)
  }

  const _error = async (message: Error, context: Context = {}) => {
    if ( shouldMockLogtail ) { console.error(message, context); return; }
    await logger.info(message, context)
  }

  const logsnagPublish = async (options: PublishOptions): Promise<any> => {
    if ( shouldMockLogSnag ) { 
      return info("Mocking Logsnag publish", { options: options as any })
    }
    return logsnag.publish(options).then(async () => await info("Published to Logsnag", { options: options as any }))
  }

  const error = async (message: Error, context: Context = {}, showToast = false) => {
    showToast && renderToast({
      title: "Uh Oh",
      message: "We've ran into an error unfortunately. The team has already been notified, and you will receive an email when Finta is up and running again.",
      status: "error"
    });
    await _error(message, context).then(response => logsnagPublish({
      channel: 'errors',
      description: JSON.stringify(response, null, 2),
      event: message.toString(),
      icon: '❌',
      notify: true,
      tags: nhost.auth.getUser() ? { 'user-id': nhost.auth.getUser()!.id } : undefined,
      parser: 'markdown'
    }))
  }

  const memoedValue = useMemo(() => ({ info, error }) as LoggerContextType, [ info, error ]);

  return <LoggerContext.Provider value = { memoedValue }>{ children }</LoggerContext.Provider>
};

export const useLogger = () => useContext(LoggerContext)