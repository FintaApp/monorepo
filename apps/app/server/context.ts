import { inferAsyncReturnType } from '@trpc/server';
import trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '~/lib/auth';

import { db } from "~/lib/db";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const session = await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
  
  return { ...ctx, session, db }
};

export type Context = inferAsyncReturnType<typeof createContext>;