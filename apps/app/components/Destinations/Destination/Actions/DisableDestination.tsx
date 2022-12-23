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

import { useDestination } from "../../context";

export const DisableDestination = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const { disableDestination, isDisablingDestination } = useDestination();

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
              <Button variant = "danger" onClick = { disableDestination } isLoading = { isDisablingDestination }>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  )
}