import { useState, useCallback } from "react";
import {
  Accordion,
  Box,
  Button,
  HStack,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { Integration } from "@prisma/client";

import { useDestination } from "../../context";

import { Step, StepContent, Steps, useSteps } from "~/components/Layout/VerticalSteps";
import { Header } from "./Header";
import { CopyTemplate } from "./CopyTemplate";
import { DestinationCredentials, DestinationAccounts, DestinationName, SyncStartDate, TableConfigs } from "../../Destination";
import { DividerWithText } from "~/components/Common/DividerWithText";


interface SetupDestinationProps {
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
  [Integration.Airtable]: "Select Airtable Base",
  [Integration.Coda]: "Connect Finta to Coda",
  [Integration.Google]: "Select Google Worksheet",
  [Integration.Notion]: "Select Notion Workspace"
}

export const SetupDestination = ({ onBack, onClose }: SetupDestinationProps) => {
  const { validateCredentials, integration, isValidatingCredentials, canValidateCredentials, tableConfigsValidation, createDestination, isCreatingDestination, getDefaultTableConfig, isGettingDefaultTableConfig } = useDestination();
  const { nextStep, prevStep, activeStep, setActiveStep } = useSteps({ initialStep: 0 });

  const handleCompletedCredentialsStep = async () => {
    if ( integration === Integration.Coda ) { onClose(); return; }
    const response = await validateCredentials();
    if ( response?.isValid ) { getDefaultTableConfig().then(nextStep)}
  }

  const onCreate = () => { createDestination().then(onClose)}

  return (
    <VStack width = "full" pt = "8">
      <Header integration = { integration } />

      <Box mt = "12" width = {{ base: 'full', lg: "4xl" }} mx = "auto">
        <Steps activeStep = { activeStep }>
          <Step title = "Copy Finta Template" setActiveStep = { setActiveStep }>
            <StepContent>
              <CopyTemplate integration = { integration } />
              <Navigation 
                onBack = { onBack }
                onNext = { nextStep } 
                isLoading = { false }
              />
            </StepContent>
          </Step>

          <Step title = { credentialsStepTitle[integration] } setActiveStep = { setActiveStep }>
            <StepContent>
              <DestinationCredentials />
              <Navigation 
                onNext = { handleCompletedCredentialsStep }
                nextText = { integration === Integration.Coda ? "Close" : "Next" }
                onBack = { prevStep }
                isLoading = { isValidatingCredentials || isGettingDefaultTableConfig }
                isDisabled = { !canValidateCredentials }
              /> 
            </StepContent>
          </Step>

          {
            integration !== Integration.Coda && (
            <Step title = "Select Accounts" setActiveStep = { setActiveStep }>
              <StepContent>
                <DestinationAccounts />
                <Navigation onBack = { prevStep } onNext = { nextStep } />
              </StepContent>
            </Step>
          )}

          { 
          integration !== Integration.Coda && (
            <Step title = "Destination Settings" setActiveStep = { setActiveStep }>
              <StepContent>
                <SimpleGrid columns = {{ base: 1, md: 2 }} spacing = "6">
                  <DestinationName />
                  <SyncStartDate />
                </SimpleGrid>

                <Accordion allowToggle defaultIndex = {[0, 1, 2]}>
                  <DividerWithText text = "Table Configurations" />
                  <TableConfigs />
                </Accordion>

                <Navigation
                  onBack = { prevStep }
                  isLoading = { isCreatingDestination }
                  onNext = { onCreate }
                  nextText = "Create Destination"
                  isDisabled = { !tableConfigsValidation?.isValid }
                />
              </StepContent>
            </Step>
          )}
        </Steps>
      </Box>
      </VStack>
  )
};