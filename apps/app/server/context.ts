import crypto from "crypto";
import { AxiomAPIRequest } from "next-axiom/dist/withAxiom";
import { inferAsyncReturnType } from '@trpc/server';
import trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '~/lib/auth';

import { db } from "~/lib/db";
import { NextApiRequest } from "next";

const isAxiomAPIRequest = (
  req?: NextApiRequest | AxiomAPIRequest
): req is AxiomAPIRequest => {
  return Boolean((req as AxiomAPIRequest)?.log);
};

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {  
  if ( !isAxiomAPIRequest(ctx.req) ) {
    throw new Error("req is not the AxiomAPIRequest I expected")
  }

  const session = await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);

  const logger = ctx.req.log.with({ userId: session && session.user.id, requestId: crypto.randomUUID() });

  return { ...ctx, session, db, logger }
};

export type Context = inferAsyncReturnType<typeof createContext>;