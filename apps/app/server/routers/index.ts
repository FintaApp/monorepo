import { router } from "../trpc";

import { destinationRouter } from "./destinationRouter";
import { plaidRouter } from "./plaidRouter";
import { stripeRouter } from "./stripeRouter";
import { userRouter } from './userRouter';

export const appRouter = router({
  destinations: destinationRouter,
  plaid: plaidRouter,
  stripe: stripeRouter,
  users: userRouter
})

export type AppRouter = typeof appRouter;