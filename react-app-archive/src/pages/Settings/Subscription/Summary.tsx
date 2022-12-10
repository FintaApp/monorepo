import {
  Text
} from "@chakra-ui/react";
import moment from "moment-timezone";
import { SubscriptionStatus } from "src/graphql";
import { StripeData } from "src/types";

export const Summary = ({ subscription, trialEndsAt }: { subscription?: StripeData['subscription'], trialEndsAt: string}) => {
  const trialEndsAtMoment = moment(trialEndsAt);
  const isTrialOver = trialEndsAtMoment.isBefore(moment());

  if ( !subscription || subscription.status === SubscriptionStatus.Trialing ) {
    if ( isTrialOver ) { return <Text>Your trial ended on {trialEndsAtMoment.format("LL")}</Text>};
    return <Text>Your trial will end on {trialEndsAtMoment.format("LL")}</Text>
  }


  if ( [SubscriptionStatus.Canceled, SubscriptionStatus.IncompleteExpired].includes(subscription.status) && subscription.endedAt ) {
    return <Text>Your subscription ended on { moment(subscription.endedAt).format("LL")}</Text>
  }

  if ( subscription.status === SubscriptionStatus.Incomplete) {
    return <Text>We were unable to process the payment for your subscription.</Text>
  }

  if ( subscription.status === SubscriptionStatus.PastDue) {
    return <Text>Your subscription is past due.</Text>
  }

  if ( subscription.status === SubscriptionStatus.Active ) {
    if ( subscription.cancelAtPeriodEnd ) {
      return <Text>Your subscription is currently active and will cancel on { moment(subscription.currentPeriodEnd).format("LL") }</Text>
    } else {
      return <Text>Your subscription is active and will renew on { moment(subscription.currentPeriodEnd).format("LL") }</Text>
    }
  }

  return null;
}

export {}