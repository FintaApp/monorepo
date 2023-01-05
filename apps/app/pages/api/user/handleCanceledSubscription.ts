import { wrapper } from "~/lib/apiWrapper";
import { db } from "~/lib/db";
import { cancelSubscription, getCustomerSubscription } from "~/lib/stripe";
import { backendIdentify as identify, trackUserDeleted } from "~/lib/analytics";
import { logUserDeleted } from "~/lib/logsnag";
import { removeItem } from "~/lib/plaid";

export default wrapper(async ({ req, logger }) => {
  const { user_id: userId } = req.body;

  const user = await db.user.findFirstOrThrow({ where: { id: userId }});
    logger.info("Fetched user", { user });

    const subscription = await getCustomerSubscription({ customerId: user.stripeCustomerId });
    logger.info("Get subscription", { subscription })

    // Cancel subscription
    if ( subscription && !['canceled', 'incomplete_expired'].includes(subscription.status) ) {
      await cancelSubscription({ subscriptionId: subscription.id })
        .then(({ lastResponse, ...response }) => logger.info("Canceled subscription", { response }))
    }

    const traits = {
      unsubscribed: true,
      email: "",
      name: "Deleted User",
      deleted_at: new Date()
    }
    const identifyPromise = identify({
      userId,
      traits
    }).then(() => logger.info("Identified user with new traits", { traits }))

    const trackEventPromise = trackUserDeleted({ userId }).then(() => logger.info("Track user deleted event"))

    const logPromise = logUserDeleted({ userId })

    await db.plaidItem.findMany({ where: { userId }})
      .then(items => Promise.all(items.map(item => removeItem({ accessToken: item.accessToken }).catch(() => null))));

    await db.plaidItem.updateMany({ where: { userId }, data: { disabledAt: new Date() }})

    await db.destination.updateMany({ where: { userId }, data: { disabledAt: new Date() }})

    const updateUserPromise = db.user.update({ where: { id: userId }, data: { disabledAt: new Date(), name: null, email: null }})
      .then(response => {
        logger.info("Updated user", { user: response });
        return response
      })

    await Promise.all([
      identifyPromise, 
      logPromise,
      trackEventPromise,
      updateUserPromise
    ])

  return { status: 200, message: "OK" }
})