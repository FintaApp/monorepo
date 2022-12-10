import { useRef, useState } from "react";
import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  MenuItem,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { useApolloClient } from "@apollo/client";

import { disablePlaidItem } from "src/lib/functions";
import { PlaidItemModel } from "src/types";
import { Integrations_Enum } from "src/graphql";

export const RemovePlaidItem = ({ plaidItem }: { plaidItem: PlaidItemModel }) => {
  const apolloClient = useApolloClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const [ isDeleting, toggleIsDeleting ] = useState(false);

  const onDelete = () => {
    toggleIsDeleting(true);

    disablePlaidItem({ plaidItemId: plaidItem.id })
    .then(() => { apolloClient.refetchQueries({ include: 'all' }).then(onClose)})
  };
  
  const uniqueIntegrationIds = Array.from(new Set(plaidItem.accounts.map(account => account.destination_connections.map(da => da.destination.integration.id as Integrations_Enum)).reduce((all, curr) => all.concat(curr), [])));
  return (
    <>
      <MenuItem icon = { <TrashIcon /> } onClick = { onOpen }>Remove Connection</MenuItem>
      <AlertDialog
        isOpen = { isOpen }
        leastDestructiveRef = { cancelRef }
        onClose = { onClose }
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Remove Connection</AlertDialogHeader>
          <AlertDialogBody>
            <Text>We will no longer import new data from this institution.</Text> 
            <Divider my = "2" display = { uniqueIntegrationIds.length > 0 ? "block" : "none" } />
            <Text mb = "2" display = { uniqueIntegrationIds.includes(Integrations_Enum.Airtable) ? "block" : "none" }>None of your current data in your Airtable destination will be deleted.</Text>
            <Text display = { uniqueIntegrationIds.includes(Integrations_Enum.Coda) ? "block" : "none" }>The next time Coda triggers a sync, all of the data from this Institution and its associated accounts will be removed from your Coda Doc.</Text>
          </AlertDialogBody>
          <AlertDialogFooter display = 'flex' justifyContent = "space-between">
            <Button ref = { cancelRef } onClick = { onClose }>Cancel</Button>
            <Button
              isLoading = { isDeleting }
              onClick = { onDelete }
              variant = "danger"
            >Remove Connection</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}