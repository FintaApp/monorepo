import { useEffect, useState } from "react";
import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useAuth } from "~/utils/frontend/useAuth";
import { useGetOAuthClientQuery } from "~/graphql/frontend";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { AddDestination, ClientError, HasInactiveSubscription } from "~/components/OAuthAuthorize";

const OauthAuthorize = () => {
  const router = useRouter();
  const { user } = useAuth();
  const hasActiveSubscription = !!user?.profile.stripeData.hasAppAccess;

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
      < HasInactiveSubscription isOpen = { !hasActiveSubscription } />
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
      showNavigation: true,
      isProtected: true
    }
  }
}

OauthAuthorize.analyticsPageName = AnalyticsPage.OAUTH_AUTHORIZE
export default OauthAuthorize;