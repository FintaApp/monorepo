import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';

import { useUpdateDestinationMutation, useDeleteDestinationAccountsMutation } from "~/graphql/frontend";

export const DeleteDestination = ({ destinationId }: { destinationId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const [ deleteDestinationAccounts, { loading: deleteLoading } ] = useDeleteDestinationAccountsMutation({ refetchQueries: 'all'});
  const [ updateDestination, { loading: updateLoading } ] = useUpdateDestinationMutation();

  const onDelete = () => {
    deleteDestinationAccounts({ variables: { where: { destination_id: { _eq: destinationId }}}})
    .then(() => updateDestination({ variables: { destinationId, _set: { disabled_at: new Date()}}}))
  };

  return (
    <>
      <IconButton 
        icon = { <DeleteIcon /> } 
        onClick = { onOpen } 
        size = "sm" 
        variant = "ghost" 
        aria-label = "Delete destination"
      />

      <AlertDialog isOpen = { isOpen } leastDestructiveRef = { cancelRef } onClose = { onClose }>
        <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>Delete Destination</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? We'll no longer import new data to this destination.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent = "space-between">
              <Button ref = { cancelRef } onClick = { onClose }>Cancel</Button>
              <Button variant = "danger" onClick = { onDelete } isLoading = { deleteLoading || updateLoading }>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  )
}