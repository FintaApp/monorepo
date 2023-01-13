import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { nextAuthOptions } from "./auth";

export const authGate =
  (func: GetServerSideProps, shouldBeSignedIn: boolean) => async (ctx: GetServerSidePropsContext) => {
    console.log("Fetching session", new Date())
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions
    );
    console.log("Fetched session", new Date())
    if ( session && !shouldBeSignedIn ) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    if (!session && shouldBeSignedIn) {
      return {
        redirect: {
          destination: `/login?next=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };