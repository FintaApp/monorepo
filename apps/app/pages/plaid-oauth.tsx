import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { LoadingSpinner } from "~/components/LoadingSpinner";
import { PlaidLink } from "~/components/Accounts/PlaidLink";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useAuth } from "~/utils/frontend/useAuth";

const PlaidOauth = () => {
  const router = useRouter();
  const { user } = useAuth();

  const onExitCallback = useCallback(() => router.push('/accounts'), []);
  const onSuccessCallback = useCallback(() => null, []);
  const receivedRedirectUri = typeof window === 'undefined' ? '' : window.location.href;

  if ( !user ) { return <LoadingSpinner /> }
  
  const linkToken = user.metadata.activeLinkToken;

  return (
    <>
      <LoadingSpinner />
      { linkToken 
        ? <PlaidLink 
            linkToken = { linkToken } 
            onExitCallback = { onExitCallback }
            onSuccessCallback = { onSuccessCallback }
            receivedRedirectUri = { receivedRedirectUri }
          />
        : null
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context);

  if ( !nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: `/login?next=${context.resolvedUrl}`,
        permanent: false
      }
    }
  }
  
  return {
    props: {
      showNavigation: true
    }
  }
}

PlaidOauth.analyticsPageName = AnalyticsPage.PLAID_OAUTH
export default PlaidOauth;