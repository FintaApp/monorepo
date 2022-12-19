import { log } from "next-axiom"
import Stripe from "stripe";
import { db } from "./db";

export const setupUser = async ({ userId }: { userId: string }) => {
  const logger = log.with({ user: { id: userId }});
  logger.info("setupUser function started");

  const user = await db.user.findUnique({ where: { id: userId }});
  if ( !user ) { throw new Error("User not found") };

  let customer: Stripe.Customer;
  let subscription: Stripe.Subscription | null;



  // Set up Stripe 

  logger.info("setupUser funciton finished")
}