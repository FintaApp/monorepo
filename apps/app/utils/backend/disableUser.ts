import { cancelSubscription } from "./stripe";
import { graphql } from "~/graphql/backend";
import { disablePlaidItem } from "./disablePlaidItem";
import { SubscriptionStatus } from "~/graphql/backend/sdk";

export const disableUser = async (userId: string) => {
  const user = await graphql.GetUser({ userId }).then(response => response.user!)
  const userSubscription = user.profile.stripeData.subscription;
  if ( userSubscription && ![SubscriptionStatus.Canceled, SubscriptionStatus.IncompleteExpired].includes(userSubscription.status) ) {
    await cancelSubscription({ subscriptionId: userSubscription.id })
  }

  const { plaidItems } = await graphql.GetPlaidItems({ where: { user_id: { _eq: userId }}});

  const destinations = await graphql.GetDestinations({ where: { user_id: { _eq: userId }}})
  .then(response => response.destinations);

  await Promise.all(plaidItems.map(item => disablePlaidItem(item).catch(() => null)))

  await Promise.all(destinations.map(destination => {
    graphql.UpdateDestination({ destinationId: destination.id, _set: { disabled_at: new Date() }})
    .then(() => {
      graphql.DeleteDestinationAccounts({ where: { destination_id: { _eq: destination.id }}})
    })
  }))

  await graphql.UpdateUser({
    userId,
    _set: {
      email: null,
      displayName: "",
      disabled: true
    },
    _append: {
      metadata: { 'disabled_at': new Date() }
    }
  })
}