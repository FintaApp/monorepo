import { Button, Stack } from "@chakra-ui/react";
import { Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { NotionConnection } from "~/components/Destinations/Destination/NotionConnection";
import { useDestination } from "../../context";
import { SyncError } from "@prisma/client";

export const Notion = () => {
  const { onCancelChanges, isValidatingCredentials, isSetupMode, credentialsHasChanges } = useDestination();

  return (
    <Stack direction = 'column' spacing = '2' mt = '2'>
      <NotionConnection />

      { credentialsHasChanges && !isSetupMode && (
        <Stack justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = '1' direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
          <Button leftIcon = {<Cross1Icon /> } onClick = { onCancelChanges }>Cancel</Button>
          <Button 
            variant = "primary" 
            isLoading = { isValidatingCredentials || false } // Is saving credentials 
            leftIcon = { <CheckIcon /> } 
            onClick = { () => null } // save credentials
          >Save</Button>
        </Stack>
      )}
    </Stack>
  )
}

const parseErrorCode = (error?: SyncError) => {
  if ( error === 'NotAllowed' ) { return 'This Notion connection is no longer valid. Please reconnect' };
  return ''
}