import { FormEvent, useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Stack,
  Flex,
  FormErrorMessage,
  Text
} from "@chakra-ui/react";
import { Pencil2Icon, Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { useToast } from "~/utils//frontend/useToast";
import { validateDestinationAuthentication } from "~/utils/frontend/functions";
import { GoogleSheetsAuthentication, DestinationErrorCode } from "~/types/shared/models";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";
import { FormLabelWithTooltip } from "~/components/Forms/FormLabelWithTooltip";
import { CopiableText } from "~/components/CopiableText";

export const Google = ({ destinationId, authentication, onChange: onChangeProp, errorMessage }: { errorMessage?: string; destinationId?: string; authentication: GoogleSheetsAuthentication; onChange?: (newAuthentication: GoogleSheetsAuthentication) => void }) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const { spreadsheetId } = authentication;
  const [ newSpreadsheetId, setNewSpreadsheetId ] = useState(spreadsheetId);
  const [ isEditMode, setIsEditMode ] = useState(!destinationId);
  const [ error, setError ] = useState({ field: "", message: "" });
  const renderToast = useToast();
  const [ updateDestination, { loading: isUpdateLoading } ] = useUpdateDestinationMutation()

  const onSubmit = (e: FormEvent ) => {
    e.preventDefault();
    setError({ field: "", message: "" });
    if ( newSpreadsheetId === spreadsheetId ) { setIsEditMode(false); return; }

    setIsCheckLoading(true);

    validateDestinationAuthentication({ integrationId: Integrations_Enum.Google, authentication: { spreadsheetId: newSpreadsheetId }})
    .then(({ isValid, errorCode }) => {
      if ( isValid ) {
        setIsEditMode(false);
        updateDestination({ variables: { destinationId, _set: { authentication: { spreadsheetId: newSpreadsheetId }}}})
        .then(() => {
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

  const onChange = (newValue: string ) => {
    onChangeProp && onChangeProp({ spreadsheetId: newValue });
    setNewSpreadsheetId(newValue)
  }

  return (
    <form onSubmit = { onSubmit }>
      <Stack direction = 'column' spacing = "2" mt = "2">
        { !destinationId && (
          <>
            <Text>Invite the following email to the spreadsheet you want data from Finta to sync into. Make sure to give "Editor" access.</Text>
            <CopiableText text = "finta-app@finta-integration.iam.gserviceaccount.com" />
          </>
        )}

        <FormControl isInvalid = { !!error.message || !!errorMessage }>
          <FormLabelWithTooltip tooltipText = 'Your spreadsheet ID can be found in its URL after the "/d"'>Spreadsheet ID</FormLabelWithTooltip>
          <Input 
            value = { newSpreadsheetId }
            onChange = { e => onChange(e.target.value) }
            variant = { isEditMode ? 'outline' : 'flushed' }
            onFocus = { () => !isEditMode && setIsEditMode(true) }
          />
          <FormErrorMessage>{ error.message || errorMessage }</FormErrorMessage>
        </FormControl>

        { destinationId 
          ? isEditMode 
            ? (
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
            )
        : null }
      </Stack>
    </form>
  )
}