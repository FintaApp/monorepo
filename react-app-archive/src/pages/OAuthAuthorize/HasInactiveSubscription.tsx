import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const HasInactiveSubscription = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();
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
            onClick = { () => navigate('/settings') }
            width = "full"
            variant = "primary"
          >Go to Settings</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}