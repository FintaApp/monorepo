import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { LoadingSpinner } from "src/components/LoadingSpinner";
import { Page } from "src/components/Page";
import { PlaidLink } from "src/components/PlaidLink";
import { AppRoutes } from "src/routes";

export const PlaidOauth = () => {
  const navigate = useNavigate();
  const linkToken = localStorage.getItem('link_token');

  const onFinish = useCallback(() => navigate(AppRoutes.ACCOUNTS), [ navigate ]);

  const onSuccessCallback = useCallback(() => null, [])
  
  return (
    <Page>
      <LoadingSpinner />

      { linkToken ? (
        <PlaidLink 
          linkToken = { linkToken } 
          onExitCallback = { onFinish } 
          onSuccessCallback = { onSuccessCallback }
          receivedRedirectUri = { window.location.href }
        /> 
      ) : null }
    </Page>
  );
}