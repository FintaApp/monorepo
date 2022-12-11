import { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";

import { getDestinationDefaultConfig } from "~/utils/frontend/functions";
import { DividerWithText } from "~/components/DividerWithText";
import { DestinationName, TableConfigs } from "~/components/Destinations/Destination";
import * as Destination from "~/components/Destinations/Destination";
import * as AddDestination from "~/components/Destinations/AddDestinationComponents";
import { Step, StepContent, Steps, useSteps } from "~/components/VerticalSteps";
import { IntegrationModel } from "~/types/frontend";
import { DestinationCredentials, TableConfigs as TableConfigsType, NotionCredentials } from "~/types/shared/models";
import { Integrations_Enum, useInsertDestinationAccountsMutation, useInsertDestinationMutation } from "~/graphql/frontend";

interface AddDestinationModelProps {
  integration: IntegrationModel | null;
  onBack: () => void;
  onClose: () => void;
}

export const AddDestinationModal = ({ integration, onBack, onClose }: AddDestinationModelProps) => {
  const { nextStep, prevStep, activeStep, reset, setActiveStep } = useSteps({ initialStep: 0 });
  const isOpen = !!integration;

  const [ authentication, setAuthentication ] = useState<DestinationCredentials>({} as DestinationCredentials);
  const [ destinationName, setDestinationName ] = useState("My Budget");
  const [ syncStartDate, setSyncStartDate ] = useState(new Date());
  const [ connectedAccounts, setConnectedAccounts ] = useState(null as string[] | null);
  const [ tableConfigs, setTableConfigs ] = useState<TableConfigsType>(defaultTableConfigs);
  const [ isTableConfigsValidated, setIsTableConfigsValidated ] = useState(false);

  const [ createDestinationMutation, { loading: isCreatingDestination }] = useInsertDestinationMutation({ refetchQueries: 'all' });
  const [ createDestinationAccountsMutation, { loading: isCreatingDestinationAccounts } ] = useInsertDestinationAccountsMutation({ refetchQueries: 'all' })

  const onSubmitAuthentication = (value: DestinationCredentials ) => {
    setAuthentication(value);
    
    if ( integration && integration.id !== Integrations_Enum.Coda ) {
      getDestinationDefaultConfig({ integrationId: integration.id, credentials: value })
      .then(({ tableConfigs: responseTableConfigs }) => {
        if ( responseTableConfigs ) { setTableConfigs(responseTableConfigs) }
      })
    }
    nextStep();
  };

  useEffect(() => {
    if ( !isOpen ) {
      setAuthentication({} as DestinationCredentials);
      setDestinationName("My Budget");
      setSyncStartDate(new Date());
      reset();
      setConnectedAccounts(null);
    }
    // eslint-disable-next-line
  }, [ isOpen ]);

  const onChangeTableConfigs = useCallback((newTableConfigs: TableConfigsType) => { isTableConfigsValidated && setIsTableConfigsValidated(false)}, [ isTableConfigsValidated ]);

  if ( !integration ) {
    return <></>
  }

  const onSaveTableConfigs = (newTableConfigs: TableConfigsType) => {
    setTableConfigs(newTableConfigs);
    setIsTableConfigsValidated(true);
  };

  const onSubmit = async () => {
    createDestinationMutation({
      variables: {
        destination: {
          integration_id: integration.id,
          name: destinationName,
          sync_start_date: syncStartDate.toISOString().split('T')[0],
          authentication,
          is_ready: true,
          table_configs: tableConfigs,
          notion_connection_id: integration.id === Integrations_Enum.Notion ? (authentication as NotionCredentials).bot_id : undefined
        }
      }
    })
    .then(response => {
      const destination = response.data?.destination;
      if ( !destination ) { return; }
      createDestinationAccountsMutation({
        variables: {
          destination_accounts: connectedAccounts?.map(accountId => ({ account_id: accountId, destination_id: destination.id })) || [],
        }
      })
      .then(onClose)
    });
  }

  const CopyTemplateComponent = AddDestination.Templates[integration.id];
  const IntegrationAuthenticationStep = AddDestination.Credentials[integration.id];

  return (
    <Modal isOpen = { isOpen } onClose = { onClose } variant = "fullscreen">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom = 'none'></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button variant = "link" onClick = { onBack }>Back</Button>
          <AddDestination.Header integration = { integration } />
          <Box mt = "12" maxW = "4xl" mx = "auto">
            <Steps activeStep = { activeStep }>
              <Step title = "Copy Finta Template" setActiveStep = { setActiveStep }>
                <StepContent>
                  <Stack shouldWrapChildren spacing = "4">
                    { CopyTemplateComponent && <CopyTemplateComponent /> }
                    <HStack justifyContent = "space-between">
                      <Button size = "sm" variant = "ghost" visibility = "hidden">Back</Button>
                      <Button size = "sm" onClick = { nextStep } variant = "primary">Next</Button>
                    </HStack>
                  </Stack>
                </StepContent>
              </Step>

              { IntegrationAuthenticationStep && <IntegrationAuthenticationStep setActiveStep = { setActiveStep } onClose = { onClose } onSubmitAuthentication = { onSubmitAuthentication } onBack = { prevStep } />}

              { integration.id !== Integrations_Enum.Coda && (
                <Step title = "Select Accounts" setActiveStep = { setActiveStep }>
                  <StepContent>
                    <Stack shouldWrapChildren spacing = "4">
                      <Destination.DestinationAccounts 
                        selectedAccountIds = { connectedAccounts }
                        initiallySelectAll = { true }
                        onChange = { setConnectedAccounts }
                      />

                      <HStack justifyContent = "space-between">
                        <Button size = "sm" variant = "ghost" onClick = { prevStep }>Back</Button>
                        <Button size = "sm" onClick = { nextStep } variant = "primary">Next</Button>
                      </HStack>
                    </Stack>
                  </StepContent>
                </Step>
              )}

              { integration.id !== Integrations_Enum.Coda && (
                <Step title = "Destination Settings" setActiveStep = { setActiveStep }>
                    <StepContent>
                      <Stack shouldWrapChildren spacing = "4">
                        <SimpleGrid columns = {{ base: 1, md: 2 }} spacing = "6">
                          <DestinationName.Create value = { destinationName } onChange = { setDestinationName } />
                          <Destination.SyncStartDate value = { syncStartDate } onChange = { setSyncStartDate } />
                        </SimpleGrid>

                        <Accordion allowToggle defaultIndex = {[0, 1, 2]}>
                          <DividerWithText text = "Table Configurations" />
                          { integration.id === Integrations_Enum.Notion && (
                            <Text my = '4'>If you don't see the correct databases below, make sure that Finta has access to the pages containing the databases by clicking "Reauthorize Finta" within the "Select Notion Workspace" step above.</Text>
                          ) }
                          <TableConfigs 
                            tableConfigs = { tableConfigs }
                            onSave = { onSaveTableConfigs }
                            onChange = { onChangeTableConfigs }
                            credentials = { authentication }
                            integrationId = { integration.id }
                          />
                        </Accordion>

                        <HStack justifyContent = "space-between">
                          <Button size = "sm" variant = "ghost" onClick = { prevStep }>Back</Button>
                          <Button 
                            isLoading = { isCreatingDestination || isCreatingDestinationAccounts } 
                            isDisabled = { !isTableConfigsValidated }
                            size = "sm" onClick = { onSubmit } variant = "primary">Create Destination</Button>
                        </HStack>
                      </Stack>
                    </StepContent>
                  </Step>
              )}
            </Steps>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// Helpers
const defaultTableConfigs = {
  institutions: { is_enabled: true, table_id: '', fields: [] },
  accounts: { is_enabled: true, table_id: '', fields: [] },
  transactions: { is_enabled: false, table_id: '', fields: [] },
  holdings: { is_enabled: false, table_id: '', fields: [] },
  investment_transactions: { is_enabled: false, table_id: '', fields: [] },
  securities: { is_enabled: false, table_id: '', fields: [] }
} as TableConfigsType;