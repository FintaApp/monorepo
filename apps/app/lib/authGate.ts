import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getNhostSession } from "@nhost/nextjs";

export const authGate =
  (func: GetServerSideProps, shouldBeSignedIn: boolean) => async (context: GetServerSidePropsContext) => {
    const session = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context);

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
          destination: `/login?next=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    return await func(context);
  };