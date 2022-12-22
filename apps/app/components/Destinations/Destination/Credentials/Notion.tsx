import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { NotionConnection } from "~/components/NotionConnection";
import { NotionAuthentication, DestinationErrorCode } from "~/types/shared/models";
import { validateDestinationAuthentication } from "~/utils/frontend/functions";
import { useToast } from "~/utils//frontend/useToast";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";

interface NotionProps {
  destinationId?: string; 
  authentication: NotionAuthentication;
  errorMessage?: string;
  onChange?: (newAuthentication: NotionAuthentication) => void;
}

export const Notion = ({ destinationId, authentication, errorMessage, onChange: onChangeProp }: NotionProps) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const [ newAuthentication, setNewAuthentication ] = useState(authentication);
  const [ error, setError ] = useState({ field: "", message: "" });
  const renderToast = useToast();
  const [ updateDestination, { loading: isUpdateLoading } ] = useUpdateDestinationMutation()

  const onSubmit = () => {
    setError({ field: "", message: "" });
    setIsCheckLoading(true);

    validateDestinationAuthentication({ integrationId: Integrations_Enum.Notion, authentication: newAuthentication })
    .then(({ isValid, errorCode }) => {
      if ( isValid ) {
        updateDestination({ variables: { destinationId, _set: { authentication: newAuthentication, notion_connection_id: newAuthentication.bot_id }}})
        .then(() => {
          renderToast({
            title: "Notion Workspace Updated",
            status: "success"
          })
        })
        return;
      }

      if ( errorCode === DestinationErrorCode.NOT_ALLOWED ) {
        setError({ field: 'access_token', message: 'This Notion connection is no longer valid. Please reconnect' })
      }
    })
    .catch(err => console.log(err))
    .finally(() => setIsCheckLoading(false))
  }

  const onCancel = () => setNewAuthentication(authentication);

  const onChange = (item: any) => {
    onChangeProp && onChangeProp({ bot_id: item.value, access_token: item.access_token })
    setNewAuthentication({ bot_id: item.value, access_token: item.access_token })
  }

  return (
    <Stack direction = 'column' spacing = '2' mt = '2'>
      <NotionConnection notionConnectionId = { newAuthentication.bot_id } onChange = { onChange } isInvalid = { !!error.message || !!errorMessage } errorMessage = { error.message || errorMessage} />

      { authentication.bot_id !== newAuthentication.bot_id && !!destinationId && (
        <Stack justifyContent = {{ base: 'stretch', md: 'flex-end' }} spacing = '1' direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
          <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel }>Cancel</Button>
          <Button 
            variant = "primary" 
            isLoading = { isCheckLoading || isUpdateLoading } 
            leftIcon = { <CheckIcon /> } 
            onClick = { onSubmit }
          >Save</Button>
        </Stack>
      )}
    </Stack>
  )
}