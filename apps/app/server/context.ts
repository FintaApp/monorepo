import { getNhostSession } from "@nhost/nextjs";
import crypto from "crypto";
import { AxiomAPIRequest } from "next-axiom/dist/withAxiom";
import { inferAsyncReturnType } from '@trpc/server';
import trpcNext from "@trpc/server/adapters/next";

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

  const nhostContext = { ...context, query: context.req.query, resolvedUrl: context.req.url || "" };
  const session = await getNhostSession(process.env.NHOST_BACKEND_URL || "", nhostContext);
  const user = session?.user
    ? { id: session.user.id }
    : undefined;

  const logger = context.req.log.with({ userId: user?.id, requestId: crypto.randomUUID() });

  return { ...context, user, db, logger }
};

export type Context = inferAsyncReturnType<typeof createContext>;