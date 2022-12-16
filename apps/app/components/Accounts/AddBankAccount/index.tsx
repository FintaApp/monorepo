import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Tooltip,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { useAuth } from "~/utils/frontend/useAuth";
import { Products } from "plaid";

import { PlaidLink } from "../PlaidLink";
import { useLogger } from "~/utils/frontend/useLogger";
import { PlaidItemModel } from "~/types/frontend/models";
import { createPlaidLinkToken } from "~/utils/frontend/functions";

import { OnSuccess } from "./OnSuccess";
import { SelectBankType } from "./SelectBankType";
import { LoadingPlaidItem } from "./LoadingPlaidItem";

export const AddBankAccount = () => {
  const { user } = useAuth();
  const hasAppAccess = user?.profile.stripeData.hasAppAccess;
  const logger = useLogger();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ newPlaidItem, setNewPlaidItem ] = useState(undefined as PlaidItemModel | undefined )
  const [ loadingProduct, setLoadingProduct ] = useState(undefined as Products | undefined);
  const [ mode, setMode ] = useState<"selectBankType" | "loadingPlaidItem" | "onSuccess">("selectBankType" );
  const [ linkToken, setLinkToken ] = useState(undefined as string | undefined);

  useEffect(() => {
    setLoadingProduct(undefined);
    setNewPlaidItem(undefined)
    setLinkToken(undefined);
    setMode("selectBankType");
  }, [ isOpen ]);

  const canAddAccount = !!hasAppAccess;

  const onSelectBankType = async (product: Products) => {
    setLoadingProduct(product);
    createPlaidLinkToken({ products: [ product ]})
    .then(response => {
      logger.info("Link token created", { response });
      const { link_token } = response;
      if ( !link_token ) { logger.error(new Error("No link token returned"), {}, true); return; }
      setLinkToken(link_token)
    })
    .finally(() => setLoadingProduct(null))
  }

  const onConnectCallback = useCallback(async () => { setMode("loadingPlaidItem")}, [])

  const onSuccessCallback = useCallback(async (plaidItem: PlaidItemModel ) => {
    setNewPlaidItem(plaidItem);
    setMode("onSuccess");
  }, []);

  const onExitCallback = useCallback(() => setLinkToken(null), []);

  return (
    <>
      <Tooltip 
        isDisabled = { canAddAccount } 
        label = "Please activate your subscription on the settings page to add a new bank account"
      >
        <Button
          variant = "primary"
          onClick = { onOpen }
          isDisabled = { !canAddAccount }
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
            { mode === 'selectBankType' ? ( <SelectBankType onClick = { onSelectBankType } loadingProduct = { loadingProduct } /> ) : null }
            { mode === "onSuccess" ? ( <OnSuccess plaidItem = { newPlaidItem } onFinish = { onClose } /> ) : null }
            { mode === "loadingPlaidItem" ? ( <LoadingPlaidItem /> ) : null }
          </ModalBody>
        </ModalContent>
      </Modal>

      { linkToken && (
        <PlaidLink
          linkToken = { linkToken }
          onSuccessCallback = { onSuccessCallback }
          onConnectCallback = { onConnectCallback }
          onExitCallback = { onExitCallback }
        />
      )}
    </>
  )
}