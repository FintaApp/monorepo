import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useEffect } from 'react';
import { useDestination } from '~/components/Destinations/context'
import { trpc } from '~/lib/trpc';

export const SyncProgress = () => {
  const { currentActiveSyncId, setCurrentActiveSyncId } = useDestination();
  const { data: sync } = trpc.destinations.getSync.useQuery(
    currentActiveSyncId!, 
    { enabled: !!currentActiveSyncId, refetchInterval: 2000 }
  )
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => { if ( sync && !!sync.endedAt ) { setCurrentActiveSyncId(undefined)}}, [sync])
  
  return (
    <>
      <Text 
        display = { currentActiveSyncId ? "inline-flex" : "none"}
        // variant = "primary" 
        // onClick = { onOpen }
        fontSize = "sm"
      >Sync in progress</Text>

      <Modal size = "xl" isOpen = { isOpen } onClose = { onClose }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Destination Sync</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}