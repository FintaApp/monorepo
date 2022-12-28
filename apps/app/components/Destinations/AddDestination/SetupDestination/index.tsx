import { useState, useCallback } from "react";
import {
  Accordion,
  Box,
  Button,
  HStack,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { Integrations_Enum, useInsertDestinationMutation } from "~/graphql/frontend";
import { IntegrationModel } from "~/types/frontend";
import { Step, StepContent, Steps, useSteps } from "~/components/Layout/VerticalSteps";
import { useLogger } from "~/utils/frontend/useLogger";
import { DestinationAuthentication as DestinationAuthenticationType, TableConfigs as TableConfigsType, NotionAuthentication } from "~/types/shared/models";
import { getDestinationDefaultConfig, validateDestinationAuthentication } from "~/utils/frontend/functions";
import { Header } from "./Header";
import { CopyTemplate } from "./CopyTemplate";
import { DestinationName, SyncStartDate, DestinationAccounts, DestinationAuthentication, TableConfigs } from "../../Destination"
import { isDestinationAuthenticationFrontendValid } from "~/utils/frontend/validate";
import { DividerWithText } from "~/components/DividerWithText";


interface SetupDestinationProps {
  integration: IntegrationModel;
  onBack: () => void;
  onClose: () => void;
}

interface NavigationProps {
  onBack: () => void;
  onNext: () => void;
  nextText?: string;
  isLoading?: boolean;
  isDisabled?: boolean
}

const Navigation = ({ onBack, onNext, nextText = "Next", isLoading = false, isDisabled = false }: NavigationProps) => (
  <HStack justifyContent = "space-between">
    <Button size = "sm" variant = "ghost" onClick = { onBack }>Back</Button>
    <Button isDisabled = { isDisabled } isLoading = { isLoading } size = "sm" variant = "primary" onClick = { onNext }>{ nextText }</Button>
  </HStack>
)

const credentialsStepTitle = {
  [Integrations_Enum.Airtable]: "Select Airtable Base",
  [Integrations_Enum.Coda]: "Connect Finta to Coda",
  [Integrations_Enum.Google]: "Select Google Worksheet",
  [Integrations_Enum.Notion]: "Select Notion Workspace"
}

export const SetupDestination = ({ integration, onBack, onClose }: SetupDestinationProps) => {
  const logger = useLogger();
  const { nextStep, prevStep, activeStep, setActiveStep } = useSteps({ initialStep: 0 });
  const [ createDestinationMutation, { loading: isCreatingDestination }] = useInsertDestinationMutation();

  const [ authentication, setAuthentication ] = useState<DestinationAuthenticationType>({} as DestinationAuthenticationType);
  const [ destinationName, setDestinationName ] = useState("My Budget");
  const [ syncStartDate, setSyncStartDate ] = useState(new Date());
  const [ connectedAccountIds, setConnectedAccountIds ] = useState(null as string[] | null);
  const [ tableConfigs, setTableConfigs ] = useState<TableConfigsType>({});
  const [ isTableConfigsValidated, setIsTableConfigsValidated ] = useState(false);

  const [ isLoading, setIsLoading ] = useState(false);
  const [ authError, setAuthError ] = useState("")

  const onSubmitAuthentication = () => {
    setIsLoading(true);
    setAuthError("");

    validateDestinationAuthentication({ integrationId: integration.id, authentication: authentication as DestinationAuthenticationType })
    .then(async response => {
      const { isValid, message } = response;
      if ( isValid ) {
        if ( integration.id !== Integrations_Enum.Coda ) {
          return getDestinationDefaultConfig({ integrationId: integration.id, authentication: authentication as DestinationAuthenticationType })
          .then( getTableConfigsResponse => {
            if ( getTableConfigsResponse.tableConfigs ) { 
              setTableConfigs(getTableConfigsResponse.tableConfigs) 
            } else {
              setTableConfigs(defaultTableConfigs)
            }
          })
          .catch()
          .finally(() => {
            setIsLoading(false);
            nextStep();
          })
        }

        setIsLoading(false)
        nextStep();
        return;
      }

      setAuthError(message || "")
    })
    .catch(error => logger.error(error, {}, true))
    .finally(() => setIsLoading(false))
  }

  const onChangeTableConfigs = useCallback((newTableConfigs: TableConfigsType) => {
    setTableConfigs(newTableConfigs)
    isTableConfigsValidated && setIsTableConfigsValidated(false)
  }, [ isTableConfigsValidated ]);

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
          notion_connection_id: integration.id === Integrations_Enum.Notion ? (authentication as NotionAuthentication).bot_id : undefined,
          account_connections: {
            data: connectedAccountIds?.map(accountId => ({ account_id: accountId })) || []
          }
        }
      }
    })
    .then(onClose)
  }

  return (
    <VStack width = "full" pt = "8">
      <Header integration = { integration } />

      <Box mt = "12" width = {{ base: 'full', lg: "4xl" }} mx = "auto">
        <Steps activeStep = { activeStep }>
          <Step title = "Copy Finta Template" setActiveStep = { setActiveStep }>
            <StepContent>
              <CopyTemplate integrationId = { integration.id } />
              <Navigation 
                onBack = { onBack }
                onNext = { nextStep } 
                isLoading = { false }
              />
            </StepContent>
          </Step>

          <Step title = { credentialsStepTitle[integration.id ] } setActiveStep = { setActiveStep }>
            <StepContent>
              <DestinationAuthentication 
                integrationId = { integration.id } 
                onChange = { setAuthentication }
                authentication = { authentication }
                errorMessage = { authError }
              />
              <Navigation 
                onNext = { integration.id === Integrations_Enum.Coda ? onClose : onSubmitAuthentication }
                nextText = { integration.id === Integrations_Enum.Coda ? "Close" : "Next" }
                onBack = { prevStep }
                isLoading = { isLoading && activeStep === 1 }
                isDisabled = { !isDestinationAuthenticationFrontendValid({ integrationId: integration.id, authentication }) }
              />
            </StepContent>
          </Step>

          {
            integration.id !== Integrations_Enum.Coda && (
            <Step title = "Select Accounts" setActiveStep = { setActiveStep }>
              <StepContent>
                <DestinationAccounts 
                  selectedAccountIds = { connectedAccountIds || [] } 
                  onChange = { setConnectedAccountIds } 
                />
                <Navigation onBack = { prevStep } onNext = { nextStep } />
              </StepContent>
            </Step>
          )}

          { integration.id !== Integrations_Enum.Coda && (
            <Step title = "Destination Settings" setActiveStep = { setActiveStep }>
              <StepContent>
                <SimpleGrid columns = {{ base: 1, md: 2 }} spacing = "6">
                  <DestinationName value = { destinationName } onChange = { setDestinationName } />
                  <SyncStartDate value = { syncStartDate } onChange = { setSyncStartDate } />
                </SimpleGrid>

                <Accordion allowToggle defaultIndex = {[0, 1, 2]}>
                  <DividerWithText text = "Table Configurations" />

                  <TableConfigs
                    tableConfigs = { tableConfigs }
                    onSave = { onSaveTableConfigs }
                    onChange = { onChangeTableConfigs }
                    authentication = { activeStep > 1 ? authentication : undefined}
                    integrationId = { integration.id }
                  />
                </Accordion>
                
                <Navigation
                  onBack = { prevStep }
                  isLoading = { isCreatingDestination }
                  onNext = { onSubmit }
                  nextText = "Create Destination"
                  isDisabled = { !isTableConfigsValidated }
                />
              </StepContent>
            </Step>
          )}
        </Steps>
      </Box>
    </VStack>
  )
}

//
const defaultTableConfigs = {
  institutions: { is_enabled: true, table_id: '', fields: [] },
  accounts: { is_enabled: true, table_id: '', fields: [] },
  transactions: { is_enabled: false, table_id: '', fields: [] },
  holdings: { is_enabled: false, table_id: '', fields: [] },
  investment_transactions: { is_enabled: false, table_id: '', fields: [] },
  securities: { is_enabled: false, table_id: '', fields: [] }
} as TableConfigsType;