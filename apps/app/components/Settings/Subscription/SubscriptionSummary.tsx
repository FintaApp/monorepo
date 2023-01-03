import moment from "moment-timezone";
import { Text } from "@chakra-ui/react";

import { useUser } from "~/lib/context/useUser";
import { RouterOutput } from "~/lib/trpc";

const getSummaryText = ({ subscription, trialEndsAt }: { subscription?: RouterOutput['stripe']['getSubscription']['subscription'] | null, trialEndsAt: Date }) => {
  const trialEndsAtMoment = moment(trialEndsAt)
  const isTrialOver = trialEndsAtMoment.isBefore(moment());

  if ( !subscription || subscription.status === 'trialing' ) {
    if ( isTrialOver ) { return `Your trial ended on ${trialEndsAtMoment.format("LL")}`}
    return `Your trial will end on ${trialEndsAtMoment.format("LL")}`
  }

  if ( [ 'canceled', 'incomplete_expired' ].includes(subscription.status) && subscription.endedAt ) {
    return `Your subscription ended on ${ moment(subscription.endedAt).format("LL")}`
  }

  if ( subscription.status === 'incomplete' ) {
    return "We were unable to process the payment for your subscription."
  }

  if ( subscription.status === 'past_due' ) {
    return "Your subscription is past due."
  }

  if ( subscription.status === 'active' ) {
    if ( subscription.cancelAtPeriodEnd ) {
      return `Your subscription is currently active and will cancel on ${ moment(subscription.currentPeriodEnd).format("LL") }`
    }
    return `Your subscription is active and will renew on ${ moment(subscription.currentPeriodEnd).format("LL") }`
  }

  return ""
}

export const SubscriptionSummary = () => {
  const { subscription, trialEndsAt } = useUser();

  if ( !trialEndsAt ) { return <></> }

  const summaryText = getSummaryText({ subscription, trialEndsAt });

  return <Text>{ summaryText }</Text>
}