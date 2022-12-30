import { useCallback, useState } from "react";
import {
  Button, 
} from "@chakra-ui/react";
import { UpdateIcon } from "@radix-ui/react-icons";

import { PlaidLink } from "../PlaidLink";
import { useToast } from "~/utils/frontend/useToast";
import { PlaidItemModel } from "~/types/frontend/models";
import { useLogger } from "~/utils/frontend/useLogger";
import { trpc } from "~/lib/trpc";

export const FixConnection = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const renderToast = useToast();
  const logger = useLogger();
  const { mutateAsync: createPlaidLinkToken, isLoading } = trpc.plaid.createLinkToken.useMutation();
  
  const [ linkToken, setLinkToken ] = useState(null as string | null);

  const onClick = () => {
    createPlaidLinkToken({ plaidItemId: plaidItem.id })
    .then(response => setLinkToken(response.token))
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