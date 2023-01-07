import { buffer } from "micro";
import { AxiomAPIRequest } from 'next-axiom';
import Stripe from "stripe";
import moment from "moment-timezone";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);

export const getCustomerByEmail = ({ email }: { email: string }) =>
  client.customers.list({ email }).then(response => response.data[0])

export const createCustomer = ({ email }: { email: string }) =>
  client.customers.create({ email })

export const getCustomer = async ({ customerId }: { customerId: string }) => 
  client.customers.retrieve(customerId).then(customer => customer as Stripe.Customer)

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

export const calculateHasAppAccess = ({ subscription, trialEndsAt }: { subscription?: Stripe.Subscription; trialEndsAt: Date}) =>
  subscription 
    ? [ "active", "incomplete", "past_due", "trialing"].includes(subscription.status)
    : moment(trialEndsAt).isSameOrAfter(moment());

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

export const validateStripeWebhook = async (req: AxiomAPIRequest) => {
  const sig = req.headers['stripe-signature'];
  const reqBuffer = await buffer(req);
  let event: Stripe.Event;
  if ( !sig ) { return { isValid: false, event: null, error: "No stripe signature"} }
  try {
    event = client.webhooks.constructEvent(reqBuffer, sig, process.env.STRIPE_WEBHOOK_SIGNING_SECRET!);
    return { isValid: true, event, error: null }
  } catch (err) {
    console.log(err);
    return { isValid: false, event: null, error: err.message }
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
    return data.reduce((total, invoice) => total + (invoice.amount_due / 100.0), 0)
  })