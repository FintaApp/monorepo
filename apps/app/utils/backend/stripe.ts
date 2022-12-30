import moment from "moment-timezone";
import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const createBillingPortalSession = ({ customerId, returnUrl }: { customerId: string, returnUrl: string }) =>
  client.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  }).then(response => ({ id: response.id, url: response.url }));

export const createCheckoutPortalSession = ({ customerId, priceId, successUrl, cancelUrl, trialEnd, trialPeriodDays }: { 
    customerId: string, priceId: string, successUrl: string, cancelUrl: string, trialEnd?: number, trialPeriodDays?: number
  }) =>
    client.checkout.sessions.create({
      customer: customerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      subscription_data: trialEnd || trialPeriodDays ? {
        trial_end: trialEnd,
        trial_period_days: trialPeriodDays
      } : undefined
    }).then(response => ({ id: response.id, url: response.url }))

// export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);
// export const getSubscriptions = (params: Stripe.SubscriptionListParams) => client.subscriptions.list(params);

export const getTrialEndsAt = ({ customer, subscriptionTrialEndsAt }: { customer: Stripe.Customer; subscriptionTrialEndsAt?: Date | number }) => {
  if ( subscriptionTrialEndsAt ) {
    return typeof subscriptionTrialEndsAt === 'number' ? moment.unix(subscriptionTrialEndsAt).toDate() : subscriptionTrialEndsAt
  } else {
    return customer.metadata.trial_ends_at 
    ? moment.unix(parseInt(customer!.metadata.trial_ends_at)).toDate() 
    : moment.unix(customer!.created).add(14, 'days').toDate()
  }
}

// export const upsertCustomer = async ({ userId, email, name }: { userId: string; email: string; name: string }) => {
//   let customer: Stripe.Customer;

//   // Update Customer in DB
//   await graphql.UpdateUser({
//     user_id: userId,
//     _append: {
//       metadata: {
//         stripe_customer_id: customer.id
//       }
//     }
//   })
//   return customer; 
// }

// export const getCustomerUserId = async ({ customerId }: { customerId: string }) => {
//   const customer = await getCustomer({ customerId }).then(response => response as Stripe.Customer);
//   const userId = customer.metadata.user_id;

//   if (!userId) { throw new Error(`Customer ${customerId} does not have a user ID`)}
//   return userId
// }

// export const getInvoices = (props: Stripe.InvoiceListParams) =>
//   client.invoices.list(props)

export const getSubscriptions = (params: Stripe.SubscriptionListParams) => client.subscriptions.list(params);

export const getSubscription = ({ subscriptionId }: { subscriptionId: string }) => client.subscriptions.retrieve(subscriptionId);
export const getLifetimeRevenue = ({ customerId }: { customerId: string }) =>
  client.invoices.list({
    customer: customerId,
    status: 'paid'
  })
  .then(response => {
    const { data } = response;
    return data.reduce((total, invoice) => total + (invoice.amount_due / 100), 0)
  })