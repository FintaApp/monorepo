import { useState, useEffect } from "react";
import { 
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure 
} from "@chakra-ui/react";

import { Integration } from "@prisma/client"

import { SelectIntegration } from "./SelectIntegration";
import { SetupDestination } from "./SetupDestination";
import { useUser } from "~/lib/context/useUser";
import { DestinationProvider } from "../context";

export const AddDestination = () => {
  const { hasAppAccess } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ selectedIntegration, setSelectedIntegration ] = useState(null as Integration | null);
  
  useEffect(() => { isOpen && setSelectedIntegration(null); }, [ isOpen ]);

  return (
    <>
      <Tooltip
        isDisabled = { hasAppAccess }
        label = "Please activate your subscription on the settings page to add a new destination"
      >
        <Button
          variant = "primary"
          onClick = { onOpen }
          isDisabled = { !hasAppAccess }
        >Add Destination</Button>
      </Tooltip>

      <Modal
        isOpen = { isOpen }
        onClose = { onClose }
        variant = { selectedIntegration ? 'fullscreen' : 'unset' }
        size = { selectedIntegration ? 'unset' : '2xl' }
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Destination</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            { selectedIntegration 
              ? <DestinationProvider integration = { selectedIntegration } isSetupMode = { true }>
                  <SetupDestination onClose = { onClose } onBack = { () => setSelectedIntegration(null) } />
                </DestinationProvider>
              : <SelectIntegration onSelectIntegration = { setSelectedIntegration } />
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}