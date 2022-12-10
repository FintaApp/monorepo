import moment from "moment-timezone";
import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const updateCustomer = async ({ customerId, properties = {} }: { 
  customerId: string;
  properties: Stripe.CustomerUpdateParams 
}) => client.customers.update(customerId, properties);

export const createCustomer = ({ email, name, userId }: { email: string; name: string; userId: string; }) =>
  client.customers.create({
    email,
    name,
    metadata: {
      user_id: userId 
    }
  });

export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);
export const getSubscriptions = (params: Stripe.SubscriptionListParams) => client.subscriptions.list(params);
export const createCheckoutPortalSession = (params: Stripe.Checkout.SessionCreateParams) => client.checkout.sessions.create(params);
export const createBillingPortalSession = (params: Stripe.BillingPortal.SessionCreateParams) => client.billingPortal.sessions.create(params)

export const getCustomer = async ({ email, customerId }: { email?: string; customerId?: string }) => {
  if (!(email || customerId)) { throw new Error("Must provide email or customerId") }
  if ( customerId ) { return client.customers.retrieve(customerId) }
  if ( email ) { return client.customers.list({ email }).then(response => response.data[0]) }
};

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

export const getTrialEndsAt = ({ customer, subscriptionTrialEndsAt }: { customer: Stripe.Customer; subscriptionTrialEndsAt?: Date | number }) => {
  if ( subscriptionTrialEndsAt ) {
    return typeof subscriptionTrialEndsAt === 'number' ? moment.unix(subscriptionTrialEndsAt).toDate() : subscriptionTrialEndsAt
  } else {
    return customer.metadata.trial_ends_at 
    ? moment.unix(parseInt(customer!.metadata.trial_ends_at)).toDate() 
    : moment.unix(customer!.created).add(14, 'days').toDate()
  }
}

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