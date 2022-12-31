import { router } from "../trpc";

import { airtableRouter } from "./airtableRouter";
import { plaidRouter } from "./plaidRouter";
import { stripeRouter } from "./stripeRouter";
import { userRouter } from './userRouter';

export const appRouter = router({
  airtable: airtableRouter,
  plaid: plaidRouter,
  stripe: stripeRouter,
  users: userRouter
})

export type AppRouter = typeof appRouter;