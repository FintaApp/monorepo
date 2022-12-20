import { router } from "../trpc";
import { plaidRouter } from "./plaidRouter";

import { stripeRouter } from "./stripeRouter";
import { userRouter } from './userRouter';

export const appRouter = router({
  plaid: plaidRouter,
  stripe: stripeRouter,
  users: userRouter
})

export type AppRouter = typeof appRouter;