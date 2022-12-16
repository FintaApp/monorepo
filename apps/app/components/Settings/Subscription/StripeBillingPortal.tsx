import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useLogger } from "~/utils/frontend/useLogger";
import { useRouter } from "next/router";

import { createBillingPortalSession } from "~/utils/frontend/functions";

export const StripeBillingPortal = () => {
  const logger = useLogger();
  const router = useRouter();

  const [ isLoading, toggleIsLoading ] = useState(false);

  const loadPortal = () => {
    toggleIsLoading(true);
    const returnUrl = window.location.href;

    createBillingPortalSession({ returnUrl })
    .then(({ url }) => router.push(url))
    .catch(error => logger.error(error, {}, true))
    .finally(() => toggleIsLoading(false))
  }

  return (
    <Button width = {{ base: 'full', md: 'xs' }} variant = "outline" size = "sm" isLoading = { isLoading } onClick = { loadPortal }>
      Manage Subscription
    </Button>
  )
}