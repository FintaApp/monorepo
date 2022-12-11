import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

import { NotionConnection } from "~/components/NotionConnection";
import {NotionCredentials, DestinationErrorCode } from "~/types/shared/models";
import { DestinationModel } from "~/types/frontend";
import { checkDestinationCredentials } from "~/utils/frontend/functions";
import { useToast } from "~/utils//frontend/useToast";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";

export const Notion = ({ destination }: { destination: DestinationModel }) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const credentials = destination.authentication as NotionCredentials;
  const [ newCredentials, setNewCredentials ] = useState(credentials);
  const [ error, setError ] = useState({ field: "", message: "" });
  const renderToast = useToast();
  const [ updateDestination, { loading: isUpdateLoading } ] = useUpdateDestinationMutation()

  const onSubmit = () => {
    setError({ field: "", message: "" });
    setIsCheckLoading(true);

    checkDestinationCredentials({ integrationId: Integrations_Enum.Notion, credentials: newCredentials })
    .then(({ isValid, errorCode }) => {
      if ( isValid ) {
        updateDestination({
          variables: {
            destination_id: destination.id,
            _set: { authentication: newCredentials, notion_connection_id: newCredentials.bot_id }
          }
        })
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

  const onCancel = () => setNewCredentials(credentials);

  const onChange = (item: any) => setNewCredentials({ bot_id: item.value, access_token: item.access_token })

  return (
    <Stack direction = 'column' spacing = '2' mt = '2'>
      <NotionConnection notionConnectionId = { newCredentials.bot_id } onChange = { onChange } isInvalid = { !!error.message } errorMessage = { error.message } />

      { credentials.bot_id !== newCredentials.bot_id && (
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