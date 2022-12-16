import { useCallback, useState } from "react";
import { MenuItem } from "@chakra-ui/react";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

import { PlaidItemModel } from "~/types/frontend/models";
import { useToast } from "~/utils/frontend/useToast";
import { createPlaidLinkToken } from "~/utils/frontend/functions";
import { useLogger } from "~/utils/frontend/useLogger";
import { PlaidLink } from "../PlaidLink";

export const AddNewAccounts = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const renderToast = useToast();
  const logger = useLogger();

  const [ linkToken, setLinkToken ] = useState(null as string | null);

  const loadLinkToken = () => {
    renderToast({ status: 'info', title: 'Loading' });

    createPlaidLinkToken({ accessToken: plaidItem.accessToken, isAccountSelectionEnabled: true, products: [] })
    .then(response => {
      logger.info("Link token created", { response });
      const { link_token } = response;
      if ( !link_token ) { logger.error(new Error("No link token returned"), {}, true); return; }
      setLinkToken(link_token)
    })
    .catch(error => logger.error(error))
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