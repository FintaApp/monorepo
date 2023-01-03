import { useRef } from "react";

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
import { trpc } from "~/lib/trpc";
import { useUser } from "~/lib/context/useUser";
import { useRouter } from "next/router";

export const DeleteAccount = () => {
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();

  const { mutateAsync, isLoading } = trpc.users.disableUser.useMutation()

  const onDelete = () => {
    mutateAsync({ userId: user?.id! })
    .then(() => { nhost.auth.signOut().then(() => router.push('/login'))});
  }

  return (
    <>
      <Text variant = 'helper' mb = { 2 }>Warning, this action is irreversible.</Text>
      <Button 
        width = {{ base: 'full', md: 'xs' }}
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
              isLoading = { isLoading }
              onClick = { onDelete }
              variant = "danger"
            >Delete Account</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}