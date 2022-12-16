import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const HasInactiveSubscription = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  return (
    <Modal isOpen = { isOpen } onClose = { () => null }>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reactive your Finta Subscription</ModalHeader>

        <ModalBody>
          You need an active subscription to connect a new destination.
        </ModalBody>

        <ModalFooter>
          <Button 
            onClick = { () => router.push('/settings') }
            width = "full"
            variant = "primary"
          >Go to Settings</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}