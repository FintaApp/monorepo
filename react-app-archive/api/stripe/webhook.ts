import Stripe from "stripe";

import { logsnag, functionWrapper, graphql, Sentry, stripeWebhookFunctions, types } from "../_lib";

enum WebhookState {
  Processed = 'processed',
  Failed = 'failed'
}

export default functionWrapper.public(async (req) => {
  // const isRequestValid = await validateRequest(req);
  // if ( !isRequestValid ) { return { status: HttpStatusCodes.UNAUTHORIZED, message: 'Invalid signature header' }}

  const transaction = Sentry.startTransaction({ op: "Webhook", name: "Stripe webhook" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  const { created, data, type: eventType, id: eventId } = req.body as Stripe.Event;

  try {
    const timestamp = new Date(created * 1000);
    // Check to see if event has been processed 
    const prevWebhookEvent = await graphql.GetStripeWebhookEvent({ webhook_event_id: eventId }).then(response => response.webhook_event);
    if ( prevWebhookEvent?.state === WebhookState.Processed ) return { status: types.StatusCodes.OK, message: "OK" }
    await graphql.InsertStripeWebhookEvent({ webhook_event: { id: eventId, state: WebhookState.Processed, event: eventType }})

    switch ( eventType ) {
      case 'customer.subscription.created': {
        const subscription = data.object as Stripe.Subscription;
        await stripeWebhookFunctions.handleCustomerSubscriptionCreated({ subscription, timestamp });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = data.object as Stripe.Subscription;
        await stripeWebhookFunctions.handleCustomerSubscriptionDeleted({ subscription, timestamp });
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = data.object as Stripe.Subscription;
        await stripeWebhookFunctions.handleCustomerSubscriptionUpdated({ subscription, previousAttributes: data.previous_attributes!, timestamp })
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = data.object as Stripe.Invoice;
        await stripeWebhookFunctions.handleInvoicePaymentSucceeded({ invoice, timestamp });
        break;
      }
      case 'payment_method.attached': {
        const paymentMethod = data.object as Stripe.PaymentMethod;
        await stripeWebhookFunctions.handlePaymentMethodAttached({ paymentMethod, timestamp });
        break;
      }
      case 'payment_method.detached': {
        const paymentMethod = data.object as Stripe.PaymentMethod;
        await stripeWebhookFunctions.handlePaymentMethodDetached({ paymentMethod, timestamp });
        break;
      }
      default:
        throw new Error(`Unhandled event type ${eventType}.`)
    }
    
    return { status: types.StatusCodes.OK, message: 'OK' }
  } catch(error) {
    await graphql.UpdateStripeWebhookEvent({ webhook_event_id: eventId, _set: { state: WebhookState.Failed } })
    await logsnag.logError({ error, operation: "Stripe Webhook", scope })
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  } finally { transaction.finish() }
})

// Helper Functions
// const validateRequest = async (req: Request): Promise<boolean> => {
//   const buf = await buffer(req);
//   const rawBody = buf.toString('utf8');

//   const signature = req.headers['stripe-signature'];
//   try {
//     stripe.client.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SIGNING_SECRET!)
//     return true
//   } catch {
//     return false
//   }
// }

// async function buffer(readable) {
//   const chunks = [];
//   for await (const chunk of readable) {
//     chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
//   }
//   return Buffer.concat(chunks);
// }