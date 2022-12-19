// Logger logic: https://www.imakewebsites.ca/posts/axiom-logging-nextjs-api-routes/

import { TRPCError, initTRPC } from "@trpc/server";
import { AxiomAPIRequest } from "next-axiom";
import { Context } from "./context";

const t = initTRPC.context<Context>().create()

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const { session } = ctx;

  if ( !session || !session.user ) { throw new TRPCError({ code: 'UNAUTHORIZED' })}
  return next({ ctx })
})

const hasCustomerId = t.middleware(async ({ next, ctx }) => {
  const { session } = ctx;

  const customerId = session?.user.stripeCustomerId;
    if ( !customerId ) { 
      throw new TRPCError({ code: 'PRECONDITION_FAILED', message: "Missing Stripe Customer ID" })
    };

    return next({ ctx })
})

const withLog = t.middleware(async ({ next, ctx }) => {
  const { req } = ctx;

  ctx.logger.info(`${req.url || 'Unknown'} request started`, { body: req.body })

  const results = await next({ ctx });

  ctx.logger.info(`${req.url || 'Unknown'} request finished`, { data: results.ok ? results.data : undefined });

  (ctx.req as AxiomAPIRequest).log = ctx.logger;
  return results;
})

export const router = t.router;
export const publicProcedure = t.procedure.use(withLog)
export const protectedProcedure = t.procedure.use(isAuthed).use(withLog)
export const stripeCustomerProcedure = t.procedure.use(isAuthed).use(hasCustomerId).use(withLog)
