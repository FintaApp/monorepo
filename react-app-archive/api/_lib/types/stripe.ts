import Stripe from "stripe";

export type StripeEventTypes = 'customer.subscription.created' | 'customer.subscription.updated' | 'customer.subscription.deleted' |
  'invoice.payment_succeeded' | 'payment_method.attached' | 'payment_method.detached'

export type PaymentMethodDetachedPreviousAttributes = {
  customer: string;
}

export interface StripeCustomer extends Stripe.Customer {
  metadata: {
    user_id?: string;
  }
}