import { FormEvent, useState } from "react";
import {
  Button,
  FormControl,
  Stack,
  Flex,
  FormErrorMessage,
  Text
} from "@chakra-ui/react";
import { Pencil2Icon, Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { useDestination } from "../../context"
import { CopiableText } from "~/components/Common/CopiableText";
import { FormLabelWithTooltip, Input } from "~/components/Forms";

export const Google = () => {
  const { destination, validateCredentials, googleSpreadsheetId, setGoogleSpreadsheetId, isSetupMode, isUpdatingCredentials, credentialsValidation, onCancelChanges, isValidatingCredentials } = useDestination();
  const [ isEditMode, setIsEditMode ] = useState(isSetupMode);

  const onCancel = () => {
    onCancelChanges();
    setIsEditMode(false);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ( destination?.googleSheetsCredential?.spreadsheetId !== googleSpreadsheetId ) {
      validateCredentials().then(response => { if ( response.isValid ) { setIsEditMode(false) }})
    } else {
      setIsEditMode(false)
    }
  }


  return (
    <form onSubmit = { onSubmit }>
      <Stack direction = 'column' spacing = "2" mt = "2">
        { isSetupMode && (
          <>
            <Text>Invite the following email to the spreadsheet you want data from Finta to sync into. Make sure to give "Editor" access.</Text>
            <CopiableText text = "finta-app@finta-integration.iam.gserviceaccount.com" />
          </>
        )}

        <FormControl isInvalid = { credentialsValidation && !credentialsValidation.isValid }>
          <FormLabelWithTooltip tooltipText = 'Your spreadsheet ID can be found in its URL after the "/d"'>Spreadsheet ID</FormLabelWithTooltip>
          <Stack direction = {{ base: 'column', lg: 'row' }}>
            <Input 
              value = { googleSpreadsheetId || "" }
              onChange = { e => setGoogleSpreadsheetId(e.target.value) }
              variant = { isEditMode ? 'outline' : 'flushed' }
              onFocus = { () => !isEditMode && setIsEditMode(true) }
            />

            { isSetupMode
              ? null 
              : isEditMode 
                ? (
                  <Stack flex = { 0 } justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
                    <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel }>Cancel</Button>
                    <Button type = "submit" isDisabled = { googleSpreadsheetId?.length === 0 } isLoading = { isValidatingCredentials || isUpdatingCredentials } leftIcon = {<CheckIcon /> } variant = 'primary'>Save</Button>
                  </Stack>
                ) : (
                  <Flex flex = { 0 } justifyContent = {{ base: 'stretch', md: 'flex-end' }} width = "full">
                    <Button
                      size = "sm"
                      leftIcon = { <Pencil2Icon /> }
                      onClick = { () => setIsEditMode(true) }
                    >Edit
                    </Button>
                  </Flex>
                )}
          </Stack>
          <FormErrorMessage>{ credentialsValidation?.error?.message }</FormErrorMessage>
        </FormControl>

        
      </Stack>
    </form>
  )
}