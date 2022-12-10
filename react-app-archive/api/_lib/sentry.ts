import * as Sentry from '@sentry/node';
import * as Tracing from "@sentry/tracing";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true })
  ],
  tracesSampleRate: 1.0
});

export { Sentry, Tracing }