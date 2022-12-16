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

import { useAuth } from "~/utils/frontend/useAuth";
import { useLogger } from "~/utils/frontend/useLogger";

import { SelectIntegration } from "./SelectIntegration";
import { SetupDestination } from "./SetupDestination";
import { IntegrationModel } from "~/types/frontend/models";

export const AddDestination = () => {
  const { user } = useAuth();
  const logger = useLogger();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ selectedIntegration, setSelectedIntegration ] = useState(null as IntegrationModel | null);
  
  useEffect(() => { isOpen && setSelectedIntegration(null); }, [ isOpen ]);

  const canAddDestination = user?.profile.stripeData.hasAppAccess

  return (
    <>
      <Tooltip
        isDisabled = { canAddDestination }
        label = "Please activate your subscription on the settings page to add a new destination"
      >
        <Button
          variant = "primary"
          onClick = { onOpen }
          isDisabled = { !canAddDestination }
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
              ? <SetupDestination onClose = { onClose } integration = { selectedIntegration } onBack = { () => setSelectedIntegration(null) } /> 
              : <SelectIntegration onSelectIntegration = { setSelectedIntegration } />
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}