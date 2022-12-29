import { Request, Response } from "express";
import Stripe from "stripe";

import * as stripeEventFunctions from "~/utils/backend/stripeEvents";
import { graphql } from "~/graphql/backend";
import * as analytics from "~/utils/backend/analytics";
import * as stripe from "~/lib/stripe";

enum WebhookState {
  Processed = 'processed',
  Failed = 'failed'
}

const eventFunctionMapping = {
  'customer.subscription.created': 'handleCustomerSubscriptionCreated',
  'customer.subscription.updated': 'handleCustomerSubscriptionUpdated',
  'customer.subscription.deleted': 'handleCustomerSubscriptionDeleted',
  'invoice.payment_succeeded': 'handleInvoicePaymentSucceeded'
} as Record<string, keyof typeof stripeEventFunctions>

export default async function handler(req: Request, res: Response) {
  // const logger = new Logger({});
  // logger.info("Stripe webhook function started", { body: req.body });

  const { created, data, type: eventType, id: eventId } = req.body as Stripe.Event;
  const timestamp = new Date(created * 1000);

  // Check to see if event has been processed 
  const prevWebhookEvent = await graphql.GetStripeWebhookEvent({ webhookEventId: eventId }).then(response => {
    // logger.info("Fetched previous webhook", { response });
    return response.webhookEvent;
  });

  if ( prevWebhookEvent?.state === WebhookState.Processed ) {
    // await logger.info("Duplicate event. Previous webhook event already processed. Function finished.");
    return res.status(200).send("OK")
  }

  const func = stripeEventFunctions[eventFunctionMapping[eventType as keyof typeof eventFunctionMapping]!];
  if ( !func ) {
    // await logger.error(new Error("Stripe webhook event not handled"), { eventType });
    return res.status(500).send("Internal Error")
  }

  // Get the affected user
  const customerId = (data.object as Stripe.Subscription | Stripe.Invoice).customer?.toString();
  if ( !customerId ) {
    // await logger.info("Event doesn't have an associated customerId");
    return res.status(200).send("OK")
  }

  const customer = await stripe.getCustomer({ customerId }) as Stripe.Customer;
  // logger.info("Fetched customer", { customer })

  const user = await graphql.GetUserByCustomerId({ customerId })
  .then(async response => {
    // logger.info("Fetched user by customerId", { response });
    if ( response.userProfiles[0]?.user ) { return response.userProfiles[0]?.user };

    // If not found, search stripe
    if ( customer.metadata.user_id ) {
      return graphql.GetUser({ userId: customer.metadata.user_id })
        .then(response => {
          // logger.info("Fetched user by customer metadata", { response });
          return response.user
        })
    }
  })

  if ( !user ) {
    // logger.error(new Error("Customer isn't associated with a user"), { customerId })
    return process.env.ENV === 'production' ? res.status(500).send("Internal Error") : res.status(200).send("OK")
  }

  await graphql.InsertStripeWebhookEvent({ webhookEvent: { id: eventId, state: WebhookState.Processed, event: eventType }})
  // .then(response => logger.info("Webook event inserted", { response }));

  await func({ data, timestamp, user, customer })
  .then(async () => {
    await analytics.flushAnalytics();
    // await logger.info("Stripe webhook event finished");
    return res.status(200).send("OK")
  })
  .catch(async error => {
    // logger.error(error);
    await graphql.UpdateStripeWebhookEvent({ webhookEventId: eventId, _set: { state: WebhookState.Failed } })
    await analytics.flushAnalytics();
    // await logger.info("Stripe webhook event finished");
    return res.status(500).send("Internal Error")
  })
}