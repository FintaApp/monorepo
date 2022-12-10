import * as Sentry from "@sentry/react";

import { UseToastProps } from "./useToast"

export const handleAppError = ({ renderToast, error }: {
  renderToast: (params: UseToastProps) => void;
  error: Error
}) => {
  if ( process.env.VERCEL_ENV === 'development' ) { console.error(error) }
  else { Sentry.captureException(error) }
  
  renderToast({
    title: "Uh Oh",
    message: "We've ran into an error unfortunately. The team has already been notified, and you will receive an email when Finta is up and running again.",
    status: "error"
  })
}