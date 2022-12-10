import { useState } from "react";
import { FormControl, FormErrorMessage, FormLabel, HStack, Button, Stack, Text, FormHelperText } from "@chakra-ui/react";

import { Input } from "src/components/Input";
import { CopiableText } from "src/components/CopiableText";
import { Step, StepContent } from "src/components/VerticalSteps";
import { checkDestinationCredentials } from "src/lib/functions";
import { Integrations_Enum } from "src/graphql";
import { DestinationErrorCode, GoogleSheetsCredentials } from "src/types";

interface GoogleCredentialsProps {
  onSubmitAuthentication: (props: GoogleSheetsCredentials) => void;
  onBack: () => void;
  setActiveStep: (step: number) => void
}

export const Google = ({ onSubmitAuthentication, onBack, setActiveStep }: GoogleCredentialsProps) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const [ error, setError ] = useState({ field: "", message: "" });
  const [ spreadsheetId, setSpreadsheetId ] = useState("");


  const onSubmit = () => {
    setError({ field: "", message: "" });
    if ( spreadsheetId === "1vvALZDLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY" ) {
      setError({ field: 'spreadsheet_id', message: "You cannot setup a destination with the template's spreadsheet ID" });
      return;
    }

    setIsCheckLoading(true);
    
    checkDestinationCredentials({ integrationId: Integrations_Enum.Google, credentials: { spreadsheetId }})
    .then(({ isValid, errorCode }) => {
      if ( isValid ) { onSubmitAuthentication({ spreadsheetId }); return; }
      if ( errorCode === DestinationErrorCode.DESTINATION_NOT_FOUND ) { setError({ field: 'spreadsheet_id', message: "A spreadsheet with this ID cannot be found"})};
      if ( errorCode === DestinationErrorCode.NOT_ALLOWED ) { setError({ field: 'client_email', message: 'Please share your spreadsheet with the email listed above' })}
      if ( errorCode === DestinationErrorCode.INVALID_ROLE ) { setError({ field: 'role', message: 'Please give the email above "Editor" access to your spreadsheet.' })}
    })
    .catch(err => console.log(err))
    .finally(() => setIsCheckLoading(false))
  };

  return (
    <Step title = "Select Google Worksheet" setActiveStep = { setActiveStep }>
      <StepContent>
        <Stack shouldWrapChildren spacing = "4">
          <Text>Invite the following email to the spreadsheet you want data from Finta to sync into. Make sure to give "Editor" access.</Text>
          <CopiableText text = "finta-app@finta-integration.iam.gserviceaccount.com" />

          <FormControl isInvalid = { !!error.message }>
            <FormLabel>Google Sheet ID</FormLabel>
            <Input value = { spreadsheetId } onChange = { e => setSpreadsheetId(e.target.value) } />
            <FormErrorMessage>{ error.message }</FormErrorMessage>
            <FormHelperText>Your spreadsheet ID can be found in its URL after the "/d". For example, if the URL is "https://docs.google.com/spreadsheets/d/<b>1vvALADLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY</b>/edit#gid=0" then the worksheet ID is: 1vvALADLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY.</FormHelperText>
          </FormControl>

          <HStack justifyContent = "space-between">
            <Button size = "sm" variant = "ghost" onClick = { onBack }>Back</Button>
            <Button isLoading = { isCheckLoading } size = "sm" onClick = { onSubmit } variant = "primary" isDisabled = { !spreadsheetId }>Next</Button>
          </HStack>
        </Stack>
      </StepContent>
    </Step>
  )
};