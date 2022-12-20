import { useCallback, useState } from "react";
import { MenuItem } from "@chakra-ui/react";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

import { PlaidLink } from "../PlaidLink";
import { usePlaidItem } from "./context";
import { RouterOutput, trpc } from "~/lib/trpc";
import { useToast } from "~/lib/context/useToast";

export const AddNewAccounts = () => {
  const { plaidItem, refetch } = usePlaidItem();
  const { mutateAsync: createPlaidLinkToken } = trpc.plaid.createLinkToken.useMutation();
  const renderToast = useToast();

  const [ linkToken, setLinkToken ] = useState(null as string | null);

  const loadLinkToken = () => {
    renderToast({ status: 'info', title: 'Loading' });

    createPlaidLinkToken({ plaidItemId: plaidItem.id, isAccountSelectionEnabled: true  })
    .then(response => setLinkToken(response.token))
  }

  const onExitCallback = useCallback(() => { setLinkToken(null);}, []);

  const onSuccessCallback = useCallback(async (plaidItem?: RouterOutput['plaid']['exchangePublicToken']) => {
    refetch();
    renderToast({
      status: 'success',
      title: "Accounts Fetched",
      message: "Any new accounts are now accessible in Finta"
    })
  }, [ renderToast ])

  return (
    <>
      <MenuItem
        icon = { <CardStackPlusIcon /> }
        onClick = { loadLinkToken }
      >Check for New Accounts</MenuItem>

      { linkToken && (
        <PlaidLink 
          linkToken = { linkToken }
          onExitCallback = { onExitCallback }
          onSuccessCallback = { onSuccessCallback }
        />
      )}
    </>
  )
}