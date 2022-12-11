import { useCallback, useState } from "react";
import {
  Button, 
} from "@chakra-ui/react";
import { UpdateIcon } from "@radix-ui/react-icons";

import { PlaidLink } from "../PlaidLink";
import { createPlaidLinkToken } from "~/utils/frontend/functions";
import { useToast } from "~/utils/frontend/useToast";
import { PlaidItemModel } from "~/types/frontend/models";
import { useLogger } from "~/utils/frontend/useLogger";

export const FixConnection = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const renderToast = useToast();
  const logger = useLogger();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const [ linkToken, setLinkToken ] = useState(null as string | null);

  const onClick = () => {
    setIsLoading(true);
    createPlaidLinkToken({ products: [], accessToken: plaidItem.accessToken })
    .then(response => {
      logger.info("Plaid link token response", { response });
      setLinkToken(response.link_token)
    })
    .catch(error => logger.error(error, { plaidItemId: plaidItem.id }, true))
    .finally(() => setIsLoading(false))
  }

  const onExitCallback = useCallback(() => { setLinkToken(null)}, []);

  const onSuccessCallback = useCallback(async (plaidItem?: PlaidItemModel | null) => {
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