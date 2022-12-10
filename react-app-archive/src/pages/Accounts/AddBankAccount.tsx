import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tooltip,
  Stack
} from "@chakra-ui/react";
import { AiFillBank, AiOutlineLineChart } from 'react-icons/ai';
import * as Sentry from "@sentry/react";

import { LargeIconButton } from "src/components/LargeIconButton";
import { ConnectNewInstitutionToDestinations } from "src/components/ConnectNewInstitutionToDestinations";
import { PlaidLink } from "src/components/PlaidLink";
import { errorToastConfig } from "src/lib/commonToasts";
import { useToast } from "src/lib/useToast";
import { createPlaidLinkToken } from "src/lib/functions";
import { PlaidItemModel } from "src/types";
import { Products } from "plaid";
import { useAuth } from "src/lib/useAuth";

export const AddBankAccount = () => {
  const { user } = useAuth();
  const renderToast = useToast();
  const [ loadingProduct, setloadingProduct ] = useState(null as string | null);
  const [ newPlaidItem, setNewPlaidItem ] = useState(undefined as PlaidItemModel | undefined )
  const [ linkToken, setLinkToken ] = useState(null as string | null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setloadingProduct(null);
    setNewPlaidItem(undefined);
    setLinkToken(null);
  }, [ isOpen ]);

  const onClickIconButton = async ( product: Products ) => {
    setloadingProduct(product);
    createPlaidLinkToken({  products: [ product ] })
    .then(response => {
      Sentry.setContext("Link token response", response);

      const { link_token } = response;
      if ( !link_token ) { return null; }

      localStorage.setItem('link_token', link_token);
      setLinkToken(link_token);
    })
    .catch(() => renderToast(errorToastConfig))
    .finally(() => setloadingProduct(null))
  };

  const onSuccessCallback = useCallback(async (plaidItem?: PlaidItemModel | null) => {
    if ( !plaidItem ) { return; };
    setNewPlaidItem(plaidItem)
  }, []);

  const onExitCallback = useCallback(() => setLinkToken(null), []);

  const disableAddBankAccount = !user || !user.stripeData.hasAppAccess;

  return (
    <>
      <Tooltip shouldWrapChildren isDisabled = { !disableAddBankAccount } label = "Please reactivate your subscription on the settings page to add a new bank account">
        <Button
          variant = "primary"
          onClick = { onOpen }
          isDisabled = { disableAddBankAccount }
        >Add Account</Button>
      </Tooltip>

      <Modal 
        isOpen = { isOpen } 
        onClose = { onClose }
        trapFocus = { false }
        autoFocus = { false }
        closeOnOverlayClick = { false }
        size = 'lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Bank Account</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            { newPlaidItem ? (
              <ConnectNewInstitutionToDestinations 
                newPlaidItem = { newPlaidItem } 
                onFinish = { onClose }
              /> 
            ) : (
              <Stack direction = {{ base: 'column', md: 'row' }}>
                <LargeIconButton
                  label = "Bank Account"
                  Icon = { AiFillBank }
                  description =  "Import bank account balances and transactions"
                  onClick = { () => onClickIconButton('transactions' as Products) }
                  isLoading = { loadingProduct === "transactions" }
                />
                <LargeIconButton
                  label = "Investment Account"
                  Icon = { AiOutlineLineChart }
                  description =  "Import investment and crypto holdings and transactions"
                  onClick = { () => onClickIconButton('investments' as Products) }
                  isLoading = { loadingProduct === "investments" }
                />
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      { linkToken && (
        <PlaidLink 
          linkToken = { linkToken } 
          onSuccessCallback = { onSuccessCallback }
          onExitCallback = { onExitCallback }
        />
      )}
    </>
  )
}