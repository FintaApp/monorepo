import { FormEvent, useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Stack,
  Flex,
  FormErrorMessage
} from "@chakra-ui/react";
import { Pencil2Icon, Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { useToast } from "~/utils/frontend/useToast";
import { checkDestinationCredentials } from "~/utils/frontend/functions";
import { DestinationModel } from "~/types/frontend";
import { AirtableCredentials } from "~/types/shared/models";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";
import { FormLabelWithTooltip } from "~/components/FormLabelWithTooltip";

export const AirtableAuthentication = ({ destination }: { destination: DestinationModel }) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const { api_key, base_id } = destination.authentication as AirtableCredentials;
  const [ newAPIKey, setNewAPIKey ] = useState(api_key || "");
  const [ newBaseID, setNewBaseID ] = useState(base_id || "");
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ error, setError ] = useState({ field: "", message: "" });
  const renderToast = useToast();
  const [ updateDestination, { loading: isUpdateLoading } ] = useUpdateDestinationMutation()

  const onSubmit = (e: FormEvent ) => {
    e.preventDefault();
    setError({ field: "", message: "" });
    if ( newAPIKey === api_key && newBaseID === base_id ) { setIsEditMode(false); return; }

    setIsCheckLoading(true);

    checkDestinationCredentials({ integrationId: Integrations_Enum.Airtable, credentials: { api_key: newAPIKey!, base_id: newBaseID! }})
    .then(({ isValid, errorCredential }) => {
      if ( isValid ) {
        setIsEditMode(false);
        updateDestination({
          variables: {
            destination_id: destination.id,
            _set: { authentication: { api_key: newAPIKey, base_id: newBaseID }}
          }
        })
        .then(() => {
          renderToast({
            title: "Airtable Credential Updated",
            status: "success"
          })
        })
        return;
      } else {
        if ( errorCredential === 'api_key' ) {
          setError({ field: 'api_key', message: 'The API key is incorrect'})
        } else if ( errorCredential === 'base_id' ) {
          setError({ field: 'base_id', message: 'Please enter a valid value'})
        }
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

  const onCancel = () => {
    setError({ field: "", message: "" });
    setIsEditMode(false);

    setNewAPIKey(api_key || "");
    setNewBaseID(base_id || "");
  }

  return (
    <form onSubmit = { onSubmit }>
      <Stack direction = 'column' spacing = "2" mt = "2">
        <Stack spacing = "2" direction = {{ base: 'column', md: 'row' }} width = "full">
          <FormControl isInvalid = { error.field === 'api_key' }>
            <FormLabelWithTooltip tooltipText = "You can find your Airtable API Key by logging into Airtable and then going to your account page">API Key</FormLabelWithTooltip>
            <Input 
              value = { newAPIKey }
              onChange = { e => setNewAPIKey(e.target.value) }
              variant = { isEditMode ? 'outline' : 'flushed' }
              onFocus = { () => !isEditMode && setIsEditMode(true) }
            />
            <FormErrorMessage>{ error.message }</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid = { error.field === 'base_id' }>
            <FormLabelWithTooltip tooltipText = "On 'https://airtable.com/api', click on your base. Its base ID can be found in the introduction on the page.">Base ID</FormLabelWithTooltip>
            <Input 
              value = { newBaseID }
              onChange = { e => setNewBaseID(e.target.value) }
              variant = { isEditMode ? 'outline' : 'flushed' }
              onFocus = { () => !isEditMode && setIsEditMode(true) }
            />
            <FormErrorMessage>{ error.message }</FormErrorMessage>
          </FormControl>
        </Stack>
        { isEditMode ? (
          <Stack justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
            <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel }>Cancel</Button>
            <Button type = "submit" isDisabled = { newAPIKey.length === 0 || newBaseID.length === 0 } isLoading = { isCheckLoading || isUpdateLoading } leftIcon = {<CheckIcon /> } variant = 'primary'>Save</Button>
          </Stack>
        ) : (
          <Flex justifyContent = {{ base: 'stretch', md: 'flex-end' }} width = "full">
            <Button
              size = "sm"
              leftIcon = { <Pencil2Icon /> }
              onClick = { () => setIsEditMode(true) }
            >Edit
            </Button>
          </Flex>
        )}
      </Stack>
    </form>
  )
}