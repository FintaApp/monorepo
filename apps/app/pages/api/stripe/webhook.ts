import { StripeWebhookEventState } from "@prisma/client";
import Stripe from "stripe";

import { wrapper } from "~/lib/apiWrapper";
import { db } from "~/lib/db";
import { getCustomer, validateStripeWebhook } from "~/lib/stripe";
import * as functions from "~/lib/stripeWebhookFunctions";

export const config = {
  api: {
    bodyParser: false,
  },
}

export default wrapper(async function handler({ req, logger }) {
  const { isValid, event, error } = await validateStripeWebhook(req);
  logger.info("Validated webhook", { isValid, error })
  if ( !isValid || !event ) { return { status: 400, message: error }};

  const { created, data, type: eventType, id } = event;
  const timestamp = new Date(created * 1000);

  // Check to see if event has already been processed
  const prevWebhookEvent = await db.stripeWebhookEvent.findFirst({ where: { id }});
  if ( prevWebhookEvent?.state === StripeWebhookEventState.Processed ) {
    logger.info("Webhook previously processed", { eventId: id });
    return { status: 200, message: "OK" }
  };

  // Get the affected user
  const customerId = (data.object as Stripe.Subscription | Stripe.Invoice).customer?.toString();
  if ( !customerId ) {
    logger.info("Event doesn't have an associated customerId");
    return { status: 200, message: "OK" }
  }

  const [ user, customer ] = await Promise.all([
    db.user.findFirst({ 
      where: { stripeCustomerId: customerId, disabledAt: null },
      select: { id: true, name: true, email: true, disabledAt: true }
    }).then(response => {
      logger.info("Fetched user", { user: response });
      return response;
    }),

    getCustomer({ customerId }).then(response => {
      logger.info("Fetched customer", { response });
      return response as Stripe.Customer;
    })
  ])

  if ( !user ) {
    logger.warn("Customer isn't associated with a user", { customerId });
    return !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'
      ? { status: 500, message: "Internal Error"}
      : { status: 200, message: "OK"}
  }

  if ( !!user.disabledAt ) {
    logger.info("Event is for a disabled user");
    return { status: 200, message: "OK" }
  }

  await db.stripeWebhookEvent.create({ data: { id, event: eventType }})
    .then(response => logger.info("Webhook event inserted", { response }));
  
  
  try {
    switch (eventType) {
      case 'customer.subscription.created': {
        const subscription = data.object as Stripe.Subscription;
        await functions.handleCustomerSubscriptionCreated({ subscription, userId: user.id, customer, timestamp })
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = data.object as Stripe.Subscription;
        const previousAttributes = data.previous_attributes as Record<string, any>;
        await functions.handleCustomerSubscriptionUpdated({ subscription, userId: user.id, customer, timestamp, previousAttributes })
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object as Stripe.Subscription;
        await functions.handleCustomerSubscriptionDeleted({ subscription, customer, userId: user.id, timestamp })
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = data.object as Stripe.Invoice;
        await functions.handleInvoicePaymentSucceeded({ invoice, userId: user.id, userName: user.name || user.email!, timestamp, customerId })
        break;
      }

      default:
        throw new Error("Unhandled Stripe webhook event")
    };

    return { status: 200, message: "OK" }
  } catch (error) {
    logger.error(error);
    await db.stripeWebhookEvent.update({ where: { id }, data: { state: StripeWebhookEventState.Failed }})
      .then(response => logger.info("Set webhook state to failed", { response }));
    
    return { status: 500, message: "Internal Error"}
  }

});