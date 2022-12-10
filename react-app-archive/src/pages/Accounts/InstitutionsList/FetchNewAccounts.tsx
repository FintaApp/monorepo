import { useCallback, useState } from "react";
import { MenuItem } from "@chakra-ui/react";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import * as Sentry from "@sentry/react";

import { PlaidLink } from "src/components/PlaidLink";
import { createPlaidLinkToken } from "src/lib/functions";
import { useToast } from "src/lib/useToast";

import { PlaidItemModel } from "src/types";
import { handleAppError } from "src/lib/handleAppError";

export const FetchNewAccounts = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const [ linkToken, setLinkToken ] = useState(null as string | null);
  const renderToast = useToast();

  const isMenuItemVisible = !plaidItem.error;

  const onExitCallback = useCallback(() => { setLinkToken(null);}, []);

  const onSuccessCallback = useCallback(async (plaidItem?: PlaidItemModel | null) => {
    renderToast({
      status: 'success',
      title: "Accounts Fetched",
      message: "Any new accounts are now accessible in Finta"
    })
  }, [ renderToast ])

  const onLoadLinkToken = () => {
    renderToast({
      status: 'info',
      title: "Loading"
    });

    createPlaidLinkToken({ accessToken: plaidItem.accessToken, products: [], isAccountSelectionEnabled: true })
    .then(response => {
      Sentry.setContext("Link token response", response);
      const { link_token } = response;
      if ( !link_token ) { return null; }

      localStorage.setItem('link_token', link_token);
      setLinkToken(link_token);
    })
    .catch(error => handleAppError({ renderToast, error }))
  }

  return (
    <>
      <MenuItem
        display = { isMenuItemVisible ? "flex" : "none" }
        icon = { <CardStackPlusIcon /> }
        onClick = { onLoadLinkToken }
      >Check for New Accounts</MenuItem>

      { linkToken ? (
        <PlaidLink 
          linkToken = { linkToken } 
          onExitCallback = { onExitCallback }
          onSuccessCallback = { onSuccessCallback }
        />
      ) : null }
    </>
  )
}