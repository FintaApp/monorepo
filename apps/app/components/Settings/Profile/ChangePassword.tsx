import { Button, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { ChangePasswordForm } from "~/components/Forms/ChangePasswordForm";

export const ChangePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button 
        size = "sm" 
        variant = "outline" 
        onClick = { onOpen }
        width = {{ base: 'full', md: 'xs' }}
      >Change Password</Button>

      <Modal isOpen = { isOpen } onClose = { onClose }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ChangePasswordForm asModal = { true } onSuccess = { onClose } />
        </ModalContent>
      </Modal>
    </>
  )
}