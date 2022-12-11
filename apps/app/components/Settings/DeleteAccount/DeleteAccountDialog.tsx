import { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { nhost } from "~/utils/nhost";

import { disableUser } from "~/utils/frontend/functions";

export const DeleteAccountDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isDeleting, toggleIsDeleting ] = useState(false);
  const cancelRef = useRef(null);

  const onDelete = () => {
    toggleIsDeleting(true);
    disableUser()
    .then(() => nhost.auth.signOut());
  }

  return (
    <>
      <Button 
        width = {{ base: "full", md: "unset" }} 
        size = "sm" 
        variant = "dangerOutline" 
        onClick = { onOpen }
      >Delete Account</Button>

      <AlertDialog
        isOpen = { isOpen }
        leastDestructiveRef = { cancelRef }
        onClose = { onClose }
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Confirm Delete</AlertDialogHeader>
          <AlertDialogBody>
            <Text>All of your data will be removed from Finta and any active subscription will be canceled. This action is irreversible.</Text> 
          </AlertDialogBody>
          <AlertDialogFooter display = 'flex' justifyContent = "space-between">
            <Button ref = { cancelRef } onClick = { onClose }>Cancel</Button>
            <Button
              isLoading = { isDeleting }
              onClick = { onDelete }
              variant = "danger"
            >Delete Account</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}