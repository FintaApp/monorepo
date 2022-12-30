import { useRouter } from "next/router";
import { useCallback } from "react";

import { LoadingSpinner } from "~/components/LoadingSpinner";
import { PlaidLink } from "~/components/Accounts/PlaidLink";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";
import { trpc } from "~/lib/trpc";

const PlaidOauth = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = trpc.plaid.getActiveLinkToken.useQuery(undefined, { enabled: !!user });
  const linkToken = data?.token;

  const onExitCallback = useCallback(() => router.push('/accounts'), []);
  const onSuccessCallback = useCallback(() => null, []);
  const receivedRedirectUri = typeof window === 'undefined' ? '' : window.location.href;

  if ( !user ) { return <LoadingSpinner /> }

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

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

PlaidOauth.analyticsPageName = AnalyticsPage.PLAID_OAUTH
export default PlaidOauth;