import moment from "moment-timezone";
import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const cancelSubscription = ({ subscriptionId }: { subscriptionId: string }) => client.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

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

export const updateCustomer = async ({ customerId, properties = {} }: { 
  customerId: string;
  properties: Stripe.CustomerUpdateParams 
}) => client.customers.update(customerId, properties);

// export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);
// export const getSubscriptions = (params: Stripe.SubscriptionListParams) => client.subscriptions.list(params);

// export const createCustomer = ({ email, name, userId }: { email: string; name: string; userId: string; }) =>
//   client.customers.create({
//     email,
//     name,
//     metadata: {
//       user_id: userId 
//     }
//   });

export const getCustomer = async ({ email, customerId }: { email?: string; customerId?: string }) => {
  if (!(email || customerId)) { throw new Error("Must provide email or customerId") }
  if ( customerId ) { return client.customers.retrieve(customerId) }
  if ( email ) { return client.customers.list({ email }).then(response => response.data[0]) }
}

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

//   const customerByEmail = await client.customers.list({ email }).then(response => response.data[0]);
//   if ( customerByEmail ) {
//     customer = await updateCustomer({ customerId: customerByEmail.id, properties: {
//       name,
//       metadata: { user_id: userId, is_deleted_user: 0 }
//     } })
//   } else {
//     customer = await createCustomer({ email, name, userId })
//   }

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

export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);
export const getSubscriptions = (params: Stripe.SubscriptionListParams) => client.subscriptions.list(params);

export const createCustomer = ({ email, name, userId }: { email: string; name: string; userId: string; }) =>
  client.customers.create({
    email,
    name,
    metadata: {
      user_id: userId 
    }
  });

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

  export const upsertCustomer = async ({ userId, email, name }: { userId: string; email: string; name: string }) => {
    let customer: Stripe.Customer;
  
    const customerByEmail = await client.customers.list({ email }).then(response => response.data[0]);
    if ( customerByEmail ) {
      customer = await updateCustomer({ customerId: customerByEmail.id, properties: {
        name,
        metadata: { user_id: userId, is_deleted_user: 0 }
      } })
    } else {
      customer = await createCustomer({ email, name, userId })
    }
  
    return customer; 
  }