import { useCallback, useState } from "react";
import { MenuItem } from "@chakra-ui/react";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

import { PlaidItemModel } from "~/types/frontend/models";
import { useToast } from "~/utils/frontend/useToast";
import { PlaidLink } from "../PlaidLink";
import { trpc } from "~/lib/trpc";

export const AddNewAccounts = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const renderToast = useToast();
  const { mutateAsync: createPlaidLinkToken } = trpc.plaid.createLinkToken.useMutation();
  const [ linkToken, setLinkToken ] = useState(null as string | null);

  const loadLinkToken = () => {
    renderToast({ status: 'info', title: 'Loading' });

    createPlaidLinkToken({ plaidItemId: plaidItem.id, isAccountSelectionEnabled: true  })
    .then(response => setLinkToken(response.token))
  }

  const onExitCallback = useCallback(() => { setLinkToken(null);}, []);

  const onSuccessCallback = useCallback(async (plaidItem?: PlaidItemModel | null) => {
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