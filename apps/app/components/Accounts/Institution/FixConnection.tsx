import { useCallback, useState } from "react";
import {
  Button, 
} from "@chakra-ui/react";
import { UpdateIcon } from "@radix-ui/react-icons";

import { PlaidLink } from "../PlaidLink";
import { usePlaidItem } from "./context";
import { trpc, RouterOutput } from "~/lib/trpc";
import { useToast } from "~/lib/context/useToast";

export const FixConnection = () => {
  const { plaid: { getAllPlaidAccounts: { refetch: refetchAllPlaidAccounts} } } = trpc.useContext()
  const { plaidItem, refetch } = usePlaidItem();
  const { mutateAsync: createPlaidLinkToken, isLoading } = trpc.plaid.createLinkToken.useMutation();

  const renderToast = useToast();
  
  const [ linkToken, setLinkToken ] = useState(null as string | null);

  const onClick = () => {
    createPlaidLinkToken({ plaidItemId: plaidItem.id })
    .then(response => setLinkToken(response.token))
  }

  const onExitCallback = useCallback(() => { setLinkToken(null)}, []);

  const onSuccessCallback = useCallback(async (plaidItem: RouterOutput['plaid']['exchangePublicToken']) => {
    refetchAllPlaidAccounts();
    refetch();
    renderToast({
      status: 'success',
      title: 'Connection fixed',
      message: 'You should see new data for this institution shortly.'
    })
  }, [ renderToast, refetchAllPlaidAccounts ]);

  if ( !(['ITEM_LOGIN_REQUIRED'].includes(plaidItem.error || "") || plaidItem.consentExpiresAt) ) {
    return <></>
  }

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