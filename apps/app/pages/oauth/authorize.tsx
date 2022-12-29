import { useRouter } from "next/router";

import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useGetOAuthClientQuery } from "~/graphql/frontend";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { AddDestination, ClientError, HasInactiveSubscription } from "~/components/OAuthAuthorize";
import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";

const OauthAuthorize = () => {
  const router = useRouter();
  const { user, hasAppAccess } = useUser();

  const { client_id: clientId, state } = router.query;

  const { data: oauthClientData, loading } = useGetOAuthClientQuery({ 
    variables: { client_id: clientId }, 
    skip: !clientId || !user }
  )
  const oauthClient = oauthClientData?.oauth_client;

  return (
    <>
      { loading ? <LoadingSpinner /> : (
        oauthClient ? <AddDestination oauthClient = { oauthClient } state = { state } /> : <ClientError />
      )}
      < HasInactiveSubscription isOpen = { !hasAppAccess } />
    </>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

OauthAuthorize.analyticsPageName = AnalyticsPage.OAUTH_AUTHORIZE
export default OauthAuthorize;