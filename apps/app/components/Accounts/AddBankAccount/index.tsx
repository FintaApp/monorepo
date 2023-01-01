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

import { PlaidLink } from "../PlaidLink";

import { SelectBankType } from "./SelectBankType";
import { LoadingPlaidItem } from "./LoadingPlaidItem";

import { useUser } from "~/lib/context/useUser";
import { RouterOutput, trpc } from "~/lib/trpc";
import { PlaidProduct } from "~/types";
import { OnSuccess } from "./OnSuccess";

export const AddBankAccount = () => {
  const { plaid: { 
    getAllPlaidAccounts: { refetch: refetchAllPlaidAccounts},
    getAllPlaidItems: { refetch: refetchAllPlaidItems }
  } } = trpc.useContext()
  const { hasAppAccess } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync } = trpc.plaid.createLinkToken.useMutation();
  const [ newPlaidItem, setNewPlaidItem ] = useState(undefined as RouterOutput['plaid']['exchangePublicToken'] | undefined )
  const [ loadingProduct, setLoadingProduct ] = useState(undefined as PlaidProduct | undefined);
  const [ mode, setMode ] = useState<"selectBankType" | "loadingPlaidItem" | "onSuccess">("selectBankType" );
  const [ linkToken, setLinkToken ] = useState(undefined as string | undefined);
  const [ institutionName, setInstitutionName ] = useState("");

  useEffect(() => {
    setLoadingProduct(undefined);
    setNewPlaidItem(undefined)
    setLinkToken(undefined);
    setMode("selectBankType");
  }, [ isOpen ]);

  const canAddAccount = !!hasAppAccess;

  const onSelectBankType = async (product: PlaidProduct) => {
    setLoadingProduct(product);
    mutateAsync({ product })
      .then(({ token }) => { setLinkToken(token)})
      .finally(() => setLoadingProduct(undefined))
  }

  const onConnectCallback = useCallback(async () => { setMode("loadingPlaidItem")}, [])

  const onSuccessCallback = useCallback(async ({ plaidItem, institutionName }: { plaidItem: RouterOutput['plaid']['exchangePublicToken']; institutionName: string }) => {
    refetchAllPlaidItems();
    refetchAllPlaidAccounts();
    setNewPlaidItem(plaidItem);
    setInstitutionName(institutionName)
    setMode("onSuccess");
  }, [ refetchAllPlaidItems, refetchAllPlaidAccounts ]);

  const onExitCallback = useCallback(() => setLinkToken(undefined), []);

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
            { mode === "onSuccess" && newPlaidItem ? ( <OnSuccess plaidItem = { newPlaidItem } onFinish = { onClose } institutionName = { institutionName } /> ) : null }
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