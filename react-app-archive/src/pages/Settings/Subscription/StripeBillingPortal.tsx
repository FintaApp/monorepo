import { useState } from "react";
import { Button } from "@chakra-ui/react";

import { createBillingPortalSession } from "src/lib/functions";
import { useToast } from "src/lib/useToast";

export const StripeBillingPortal = () => {
  const [ isLoading, toggleIsLoading ] = useState(false);
  const renderToast = useToast();

  const loadPortal = () => {
    toggleIsLoading(true);
    const returnUrl = window.location.href;

    createBillingPortalSession({ returnUrl })
    .then(({ url }) => { window.location.assign(url)})
    .catch(() => {
      renderToast({
        status: 'error',
        title: "Uh Oh",
        message: "There was an error processing this request."
      })
    })
    .finally(() => toggleIsLoading(false))
  }

  return (
    <Button variant = "outline" size = "sm" isLoading = { isLoading } onClick = { loadPortal }>
      Manage Subscription
    </Button>
  )
}