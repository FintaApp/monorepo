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

export async function createContext(context: trpcNext.CreateNextContextOptions) {  
  if ( !isAxiomAPIRequest(context.req) ) {
    throw new Error("req is not the AxiomAPIRequest I expected")
  }

  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions);

  const logger = context.req.log.with({ userId: session?.user?.id, requestId: crypto.randomUUID() });

  return { ...context, user: session?.user, db, logger }
};

export type Context = inferAsyncReturnType<typeof createContext>;