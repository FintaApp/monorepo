import Stripe from "stripe";

const client = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2022-11-15'});

export const getCustomerByEmail = ({ email }: { email: string }) =>
  client.customers.list({ email }).then(response => response.data[0])

export const createCustomer = ({ email }: { email: string }) =>
  client.customers.create({ email })