import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { trpc } from "~/lib/trpc";

export const StripeBillingPortal = () => {
  const router = useRouter();

  const { mutateAsync, isLoading } = trpc.stripe.createBillingPortalSession.useMutation();

  const onClick = () => {
    const returnUrl = window.location.href;
    mutateAsync({ returnUrl })
      .then(({ url }) => router.push(url) )
  }

  return (
    <Button width = {{ base: 'full', md: 'xs' }} variant = "outline" size = "sm" isLoading = { isLoading } onClick = { onClick }>
      Manage Subscription
    </Button>
  )
}