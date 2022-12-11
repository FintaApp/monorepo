import { FormEvent, useState } from "react";
import {
  Button,
  HStack,
  FormErrorMessage,
  Link,
  SimpleGrid,
  Stack,
  FormControl,
  FormHelperText,
  FormLabel
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { Input } from "~/components/Forms/Input";
import { checkDestinationCredentials } from "~/utils/frontend/functions";
import { Step, StepContent } from "~/components/VerticalSteps";
import { useToast } from "~/utils/frontend/useToast";
import { Integrations_Enum } from "~/graphql/frontend";
import { AirtableCredentials } from "~/types/shared/models";

interface AirtableCredentialsProps {
  onSubmitAuthentication: (props: AirtableCredentials) => void;
  onBack: () => void;
  setActiveStep: (step: number) => void
}

 export const Airtable = ({ onSubmitAuthentication, onBack, setActiveStep }: AirtableCredentialsProps) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const [ apiKey, setApiKey ] = useState("");
  const [ baseId, setBaseId ] = useState("");
  const [ error, setError ] = useState({ field: "", message: "" });
  const isValid = apiKey.length > 0 && baseId.length > 0;
  const renderToast = useToast();

  const onSubmitCredentials = (e: FormEvent) => {
    e.preventDefault();
    setError({ field: "", message: "" });
    setIsCheckLoading(true);

    checkDestinationCredentials({ integrationId: Integrations_Enum.Airtable, credentials: { api_key: apiKey, base_id: baseId }})
    .then(({ isValid, errorCredential }) => {
      if ( isValid ) {
        onSubmitAuthentication({
          base_id: baseId,
          api_key: apiKey
        });
        return;
      }

      if ( errorCredential === 'api_key' ) {
        setError({ field: 'api_key', message: 'The API key is incorrect'})
      } else if ( errorCredential === 'base_id' ) {
        setError({ field: 'base_id', message: 'Please enter a valid value'})
      }
    })
    .catch(() => {
      renderToast({
        status: 'error',
        title: "Uh Oh",
        message: "There was an error processing this request."
      })
    })
    .finally(() => setIsCheckLoading(false))
  }
  return (
    <Step title = "Add API Credentials" setActiveStep = { setActiveStep }>
      <StepContent>
        <form onSubmit = { onSubmitCredentials }>
          <Stack shouldWrapChildren spacing = "4">
            <SimpleGrid columns = {{ base: 1, md: 2 }} spacing = "4">
              <FormControl isInvalid = { error.field === 'api_key'}>
                <FormLabel>API Key</FormLabel>
                <Input value = { apiKey } autoFocus = { true } onChange = { e => setApiKey(e.target.value) } />
                <FormErrorMessage>{ error.message }</FormErrorMessage>
                <FormHelperText>You can find your Airtable API Key by logging into Airtable and then going to your <Link href = "https://airtable.com/account" isExternal>account page <ExternalLinkIcon mx="2px" /></Link>.</FormHelperText> 
              </FormControl>

              <FormControl isInvalid = { error.field === 'base_id'}>
                <FormLabel>Base ID</FormLabel>
                <Input value = { baseId } onChange = { e => setBaseId(e.target.value) } />
                <FormErrorMessage>{ error.message }</FormErrorMessage>
                <FormHelperText>On <Link href = "https://airtable.com/api" isExternal>this page <ExternalLinkIcon mx="2px" /></Link>, click on your newly created base. Its base ID can be found in the introduction on the page.</FormHelperText>
              </FormControl>
            </SimpleGrid>
            <HStack justifyContent = "space-between">
              <Button size = "sm" variant = "ghost" onClick = { onBack }>Back</Button>
              <Button isLoading = { isCheckLoading } type = "submit" size = "sm" onClick = { onSubmitCredentials } variant = "primary" isDisabled = { !isValid }>Next</Button>
            </HStack>
          </Stack>
        </form>
      </StepContent>
    </Step>
  )
}