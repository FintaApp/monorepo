import { z } from 'zod';
import { router } from "../trpc";

import { authRouter } from './authRouter';

export const appRouter = router({
  auth: authRouter
});

export type AppRouter = typeof appRouter;