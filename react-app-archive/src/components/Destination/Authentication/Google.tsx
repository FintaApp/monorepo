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

import * as analytics from "src/lib/analytics";
import { useToast } from "src/lib/useToast";
import { checkDestinationCredentials } from "src/lib/functions";
import { GoogleSheetsCredentials, DestinationModel, DestinationErrorCode } from "src/types";
import { Integrations_Enum, useUpdateDestinationMutation } from "src/graphql";
import { FormLabelWithTooltip } from "src/components/FormLabelWithTooltip";

export const Google = ({ destination }: { destination: DestinationModel }) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const { spreadsheetId } = destination.authentication as GoogleSheetsCredentials;
  const [ newSpreadsheetId, setNewSpreadsheetId ] = useState(spreadsheetId);
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ error, setError ] = useState({ field: "", message: "" });
  const renderToast = useToast();
  const [ updateDestination, { loading: isUpdateLoading } ] = useUpdateDestinationMutation()

  const onSubmit = (e: FormEvent ) => {
    e.preventDefault();
    setError({ field: "", message: "" });
    if ( newSpreadsheetId === spreadsheetId ) { setIsEditMode(false); return; }

    setIsCheckLoading(true);

    checkDestinationCredentials({ integrationId: Integrations_Enum.Google, credentials: { spreadsheetId: newSpreadsheetId }})
    .then(({ isValid, errorCode }) => {
      if ( isValid ) {
        setIsEditMode(false);
        updateDestination({
          variables: {
            destination_id: destination.id,
            _set: { authentication: { spreadsheetId: newSpreadsheetId }}
          }
        })
        .then(() => {
          analytics.track({ event: analytics.EventNames.DESTINATION_UPDATED, properties: { field: 'credentials', integration: Integrations_Enum.Google }});
          renderToast({
            title: "Google Spreadsheet Updated",
            status: "success"
          })
        })
        return;
      } else {
        if ( errorCode === DestinationErrorCode.DESTINATION_NOT_FOUND ) { setError({ field: 'spreadsheet_id', message: "A spreadsheet with this ID cannot be found"})};
        if ( errorCode === DestinationErrorCode.NOT_ALLOWED ) { setError({ field: 'client_email', message: 'Please share your spreadsheet with the email listed above' })}
        if ( errorCode === DestinationErrorCode.INVALID_ROLE ) { setError({ field: 'role', message: 'Please give the email above "Editor" access to your spreadsheet.' })}
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

    setNewSpreadsheetId(spreadsheetId);
  }

  return (
    <form onSubmit = { onSubmit }>
      <Stack direction = 'column' spacing = "2" mt = "2">
        <FormControl isInvalid = { !!error.message }>
          <FormLabelWithTooltip tooltipText = 'Your spreadsheet ID can be found in its URL after the "/d"'>Spreadsheet ID</FormLabelWithTooltip>
          <Input 
            value = { newSpreadsheetId }
            onChange = { e => setNewSpreadsheetId(e.target.value) }
            variant = { isEditMode ? 'outline' : 'flushed' }
            onFocus = { () => !isEditMode && setIsEditMode(true) }
          />
          <FormErrorMessage>{ error.message }</FormErrorMessage>
        </FormControl>

        { isEditMode ? (
          <Stack justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
            <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel }>Cancel</Button>
            <Button type = "submit" isDisabled = { newSpreadsheetId.length === 0 } isLoading = { isCheckLoading || isUpdateLoading } leftIcon = {<CheckIcon /> } variant = 'primary'>Save</Button>
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