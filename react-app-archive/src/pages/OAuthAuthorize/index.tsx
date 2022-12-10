import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AddConnection } from "./AddDestination";
import { ClientError } from "./ClientError";
import { HasInactiveSubscription } from "./HasInactiveSubscription";
import * as analytics from "src/lib/analytics";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { Page } from "src/components/Page";
import { OauthClientModel } from "src/types";
import { useGetOAuthClientQuery } from "src/graphql";
import { useAuth } from "src/lib/useAuth";

export const OAuthAuthorize = () => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const hasActiveSubscription = !!user?.stripeData.hasAppAccess;

  const [ isLoadingClient, toggleIsLoadingClient ] = useState(true);
  const [ clientId, setClientId ] = useState(null as string | null);
  const [ oauthClient, setOauthClient ] = useState(null as OauthClientModel | null);
  const [ state, setState ] = useState(null as any | null);
  const [ searchParams ] = useSearchParams();

  const { data: oauthClientData, error: oauthClientError } = useGetOAuthClientQuery({ 
    variables: { client_id: clientId }, 
    skip: !clientId }
  )

  useEffect(() => {
    const { client_id, state: state_ } = Object.fromEntries(searchParams);
    if ( !client_id || oauthClientError ) {
      toggleIsLoadingClient(false);
    }
    setClientId(client_id);
    setState(state_)
  }, [ searchParams, oauthClientError ]);

  useEffect(() => {
    if ( oauthClientData && isLoadingClient ) {
      const oauthClient = oauthClientData.oauth_client as OauthClientModel || null;
      if ( oauthClient ) {
        setOauthClient(oauthClient);
      }

      analytics.page({ name: analytics.PageNames.INTEGRATION_OAUTH_CONNECTION, properties: { integration: oauthClient?.integration.id || undefined }})
      toggleIsLoadingClient(false);
    }
  }, [ oauthClientData, isLoadingClient ]);

  return (
    <Page>
      { isLoadingClient || isAuthLoading ? <LoadingSpinner /> : 
        oauthClient ? <AddConnection oauthClient = { oauthClient } state = { state } /> : <ClientError />
      }

      <HasInactiveSubscription isOpen = { hasActiveSubscription === false } />
    </Page>
  )
}