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
import { useToast } from '~/lib/context/useToast';

export const SyncProgress = () => {
  const renderToast = useToast();
  const { currentActiveSyncId, setCurrentActiveSyncId } = useDestination();
  const { data: sync } = trpc.destinations.getSync.useQuery(
    currentActiveSyncId!, 
    { enabled: !!currentActiveSyncId, refetchInterval: 5000 }
  )
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => { if ( sync && !!sync.endedAt ) { 
    if ( !isOpen ) {
      if ( !!sync.error ) {
        renderToast({
          title: 'Refresh failed',
          status: 'error',
          message: "There was an error refreshing this destination. You can view more details on the sync logs page."
        })
      } else {
        renderToast({
          title: "Refresh Completed",
          status: "success"
        });
      }
    };
    setCurrentActiveSyncId(undefined)
   }}, [sync, isOpen])
  
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