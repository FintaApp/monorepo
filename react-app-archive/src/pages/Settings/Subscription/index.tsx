import {
  Stack
} from "@chakra-ui/react";

import { StripeBillingPortal } from "./StripeBillingPortal";
import { Summary } from "./Summary";
import { Card } from "src/components/Card";
import { HeadingGroup } from "src/components/HeadingGroup";
import { StartSubscription } from "src/components/StartSubscription";
import { SubscriptionStatus } from "src/graphql";
import { useAuth } from "src/lib/useAuth";

export const Subscription = () => {
  const { user } = useAuth()
  if ( !user ) { return <></> }
  const { subscription, trialEndsAt } = user.stripeData

  return (
    <Stack as = "section" spacing = "2">
      <HeadingGroup title = "Subscription" description = { subscription ? "Update your payment method, change your subscription, and view your past payments." : "Start your subscription"} />
      <Card>
        <Stack spacing = "4" direction = "column" alignItems = "flex-start">
          <Summary subscription = { subscription } trialEndsAt = { trialEndsAt } />
          { 
            subscription && [ SubscriptionStatus.Active, SubscriptionStatus.Trialing, SubscriptionStatus.PastDue, SubscriptionStatus.Incomplete].includes(subscription.status) 
            ? <StripeBillingPortal />
            : <StartSubscription />
          }
        </Stack>
      </Card>
    </Stack>
  )
};