import { router } from "../trpc";
import { airtableRouter } from "./airtableRouter";

import { destinationRouter } from "./destinationRouter";
import { notionRouter } from "./notionRouter";
import { plaidRouter } from "./plaidRouter";
import { stripeRouter } from "./stripeRouter";
import { userRouter } from './userRouter';

export const appRouter = router({
  airtable: airtableRouter,
  destinations: destinationRouter,
  notion: notionRouter,
  plaid: plaidRouter,
  stripe: stripeRouter,
  users: userRouter
})

export type AppRouter = typeof appRouter;