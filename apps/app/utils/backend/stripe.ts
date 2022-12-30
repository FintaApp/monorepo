import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

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