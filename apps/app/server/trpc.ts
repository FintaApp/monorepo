import { unstable_getServerSession } from "next-auth";
import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { nextAuthOptions } from "~/lib/auth";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const { req, res } = ctx;
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  return next({ ctx: { ...ctx, session } })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
