import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from 'superjson';

import type { AppRouter } from "~/server/routers";

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>;

const getBaseUrl = () => {
  if ( typeof window !== 'undefined' ) { return ''; }
  if ( process.env.NEXT_PUBLIC_URL ) {
    return process.env.NEXT_PUBLIC_URL ;
  };

  if ( process.env.VERCEL_URL ) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  return `http://localhost:${process.env.PORT ?? 3000}`; 
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            cacheTime: Infinity,
            staleTime: Infinity
          }
        }
      },
      transformer: superjson
    }
  },
  ssr: true
})