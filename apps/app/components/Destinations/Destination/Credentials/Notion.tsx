import { Button, Stack } from "@chakra-ui/react";
import { Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { NotionConnection } from "~/components/Destinations/Destination/NotionConnection";
import { useDestination } from "../../context";

export const Notion = () => {
  const { destination, onCancelChanges, isValidatingCredentials, isSetupMode, isUpdatingCredentials, credentialsHasChanges, validateCredentials } = useDestination();

  return (
    <Stack direction = 'column' spacing = '2' mt = '2'>
      <NotionConnection />

      { credentialsHasChanges && !isSetupMode && (
        <Stack justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = '1' direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
          <Button leftIcon = {<Cross1Icon /> } onClick = { onCancelChanges }>Cancel</Button>
          <Button 
            variant = "primary" 
            isLoading = { isValidatingCredentials || isUpdatingCredentials }
            leftIcon = { <CheckIcon /> } 
            onClick = { validateCredentials }
          >Save</Button>
        </Stack>
      )}
    </Stack>
  )
}