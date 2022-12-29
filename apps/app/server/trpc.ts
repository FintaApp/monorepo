// Logger logic: https://www.imakewebsites.ca/posts/axiom-logging-nextjs-api-routes/
import superjson from 'superjson';
import { TRPCError, initTRPC } from "@trpc/server";
import { AxiomAPIRequest } from "next-axiom";
import { Context } from "./context";

const removeUnsafeBody = (body: Record<string, any>): Record<string, any> => {
  const unsafeProperties = ['password'];
  return Object.entries(body).reduce((prevValue, [key, value]) => {
    if ( typeof value === 'object' ) {
      return { ...prevValue, ...removeUnsafeBody(value) }
    }
    return { ...prevValue, [key]: unsafeProperties.includes(key) ? '**hidden**' : value }
  }, {} as Record<string, any>)
}

const t = initTRPC.context<Context>().create({ transformer: superjson })

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const { session } = ctx;

  if ( !session || !session.user ) { throw new TRPCError({ code: 'UNAUTHORIZED' })}
  return next({ ctx })
})

const withLog = t.middleware(async ({ next, ctx }) => {
  const { req } = ctx;

  ctx.logger.info(`${req.url || 'Unknown'} request started`, { body: removeUnsafeBody(req.body) })

  const results = await next({ ctx });

  ctx.logger.info(`${req.url || 'Unknown'} request finished`, { data: results.ok ? results.data : undefined });

  (ctx.req as AxiomAPIRequest).log = ctx.logger;
  return results;
})

export const router = t.router;
export const publicProcedure = t.procedure.use(withLog)
export const protectedProcedure = t.procedure.use(isAuthed).use(withLog)
export const stripeCustomerProcedure = t.procedure.use(isAuthed).use(withLog)