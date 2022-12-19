import moment from "moment-timezone";
import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const getCustomerByEmail = ({ email }: { email: string }) =>
  client.customers.list({ email }).then(response => response.data[0])

export const createCustomer = ({ email }: { email: string }) =>
  client.customers.create({ email })

export const getCustomer = ({ customerId }: { customerId: string }) =>
  client.customers.retrieve(customerId)

  export const updateCustomer = async ({ customerId, properties = {} }: { 
    customerId: string;
    properties: Stripe.CustomerUpdateParams 
  }) => client.customers.update(customerId, properties);

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

export const getPrices = (params: Stripe.PriceListParams) => client.prices.list(params);
