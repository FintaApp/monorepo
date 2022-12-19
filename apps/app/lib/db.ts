import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

import { getCustomerByEmail, createCustomer } from "./stripe";
import { log } from "next-axiom";

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;


// Only use middleware when args need to be altered before db transaction and there's no where else they can be altered

prisma.$use(async (params, next) => {
  // Before creating new user
  if ( params.model === 'User' && params.action === 'create' && !params.args.data.stripeCustomerId ) { // QUESTION: Why is this being called more than once?
    const logger = log.with({ requestId: crypto.randomUUID() });
    logger.info("Create user middleware started", { data: params.args.data });

    const email = params.args.data.email;
    // Get Stripe Data
    const customer = await getCustomerByEmail({ email })
    .then(response => {
      logger.info("Fetched customer", { response })
      if ( response && !response.deleted ) { return response; };
      return createCustomer({ email })
        .then(response => {
          logger.info("Created customer", { response });
          return response;
        })
    })

    params.args.data.stripeCustomerId = customer.id;
    logger.info("Updated args", { data: params.args.data });

    return next(params);
  }

  return next(params)
})

export const db = prisma;