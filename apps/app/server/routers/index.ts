import { router } from "../trpc";

import { stripeRouter } from "./stripeRouter";
import { userRouter } from './userRouter';

export const appRouter = router({
  stripe: stripeRouter,
  users: userRouter
})

export type AppRouter = typeof appRouter;