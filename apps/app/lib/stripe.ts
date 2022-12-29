import Stripe from "stripe";
import moment from "moment-timezone";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);

export const getCustomerByEmail = ({ email }: { email: string }) =>
  client.customers.list({ email }).then(response => response.data[0])

export const createCustomer = ({ email }: { email: string }) =>
  client.customers.create({ email })

export const getCustomer = async ({ email, customerId }: { email?: string; customerId?: string }) => {
  if (!(email || customerId)) { throw new Error("Must provide email or customerId") }
  if ( customerId ) { return client.customers.retrieve(customerId) }
  if ( email ) { return client.customers.list({ email }).then(response => response.data[0]) }
}

export const getCustomerSubscription = ({ customerId: customer }: { customerId: string; }) =>
  client.subscriptions.list({ customer, limit: 1, status: 'all' }).then(response => response.data[0])

export const calculateTrialEndsAt = ({ customer, subscriptionTrialEndsAt }: { customer: Stripe.Customer; subscriptionTrialEndsAt?: number | null }) => {
  if ( subscriptionTrialEndsAt ) {
    return typeof subscriptionTrialEndsAt === 'number' ? moment.unix(subscriptionTrialEndsAt).toDate() : subscriptionTrialEndsAt
  } else {
    return customer.metadata.trial_ends_at 
    ? moment.unix(parseInt(customer!.metadata.trial_ends_at)).toDate() 
    : moment.unix(customer!.created).add(14, 'days').toDate()
  }
}

export const updateCustomer = async ({ customerId, properties = {} }: { 
  customerId: string;
  properties: Stripe.CustomerUpdateParams 
}) => client.customers.update(customerId, properties);

export const upsertCustomer = async ({ userId, email, name }: { userId: string; email: string; name: string }) => {
  let customer: Stripe.Customer;

  const customerByEmail = await client.customers.list({ email }).then(response => response.data[0]);
  if ( customerByEmail ) {
    customer = await updateCustomer({ customerId: customerByEmail.id, properties: {
      name,
      metadata: { user_id: userId, is_deleted_user: 0 }
    } })
  } else {
    customer = await createCustomer({ email })
  }

  return customer; 
}