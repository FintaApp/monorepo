import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const getSubscriptions = (params: Stripe.SubscriptionListParams) => client.subscriptions.list(params);