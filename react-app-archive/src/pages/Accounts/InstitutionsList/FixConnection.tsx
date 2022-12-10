import { useCallback, useState } from "react";
import {
  Button, 
} from "@chakra-ui/react";
import { UpdateIcon } from "@radix-ui/react-icons";
import * as Sentry from "@sentry/react";

import { PlaidLink } from "src/components/PlaidLink";
import { createPlaidLinkToken } from "src/lib/functions";
import { useToast, UseToastProps } from "src/lib/useToast";
import { PlaidItemModel } from "src/types";

const errorToastConfig = {
  title: "Uh Oh",
  message: "We've ran into an error unfortunately. The team has already been notified, and you will receive an email when Finta is up and running again.",
  status: "error"
} as UseToastProps;

export const FixConnection = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ linkToken, setLinkToken ] = useState(null as string | null);
  const renderToast = useToast();

  const onClick = async () => {
    setIsLoading(true);
    createPlaidLinkToken({ products: [], accessToken: plaidItem.accessToken })
    .then(response => {
      Sentry.setContext("Link token response", response);
      const { link_token } = response;
      if ( !link_token ) { return null; }

      localStorage.setItem('link_token', link_token);
      setLinkToken(link_token);
    })
    .catch(() => renderToast(errorToastConfig))
    .finally(() => setIsLoading(false))
  };

  const onExitCallback = useCallback(() => { setLinkToken(null)}, []);

  const onSuccessCallback = useCallback(async (plaidItem?: PlaidItemModel | null) => {
    if ( !plaidItem ) { return };
    renderToast({
      status: 'success',
      title: 'Connection fixed',
      message: 'You should see new data for this institution shortly.'
    })
  }, [ renderToast ]);

  return (
    <>
      <Button
        size = "xs" 
        leftIcon = { <UpdateIcon /> } 
        variant = "dangerOutline"
        onClick = { onClick }
        isLoading = { isLoading }
      >
        Reconnect
      </Button> 

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