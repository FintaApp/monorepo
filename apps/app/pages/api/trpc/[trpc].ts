import * as trpcNext from '@trpc/server/adapters/next';
import { withAxiom } from 'next-axiom'

import { appRouter } from "~/server/routers";
import { createContext } from "~/server/context";

export default withAxiom(trpcNext.createNextApiHandler({
  router: appRouter,
  createContext
}));