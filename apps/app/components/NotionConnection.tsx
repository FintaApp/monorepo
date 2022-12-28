import { useEffect } from "react";
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, VStack, FormHelperText } from "@chakra-ui/react";
import { PlusIcon } from "@radix-ui/react-icons";

import { nhost } from "~/utils/nhost";
import { SelectProps, Select } from "~/components/Forms/Select";
import { useGetNotionConnectionsQuery } from "~/graphql/frontend";

interface NotionConnectionProps extends SelectProps {
  isInvalid?: boolean;
  errorMessage?: string;
  notionConnectionId: string | null;
}

export const NotionConnection = ({ notionConnectionId, isInvalid, errorMessage, onChange, ...selectProps }: NotionConnectionProps) => {
  const { data, previousData, startPolling, stopPolling } = useGetNotionConnectionsQuery();

  const onClickPlusButton = () => {
    startPolling(1000)
    const refreshToken = nhost.auth.getSession()?.refreshToken!;
    const data = {
      client_id: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID!,
      redirect_uri: `${window.location.origin}/auth/notion`,
      response_type: 'code',
      owner: 'user',
      state: refreshToken
    };
    const urlParams = new URLSearchParams(data);

    window.open(
      `https://api.notion.com/v1/oauth/authorize?${urlParams.toString()}`, 
      'mywindow',
      "menubar=0,resizeable=1,width=500,height=750"
    )
  };

  useEffect(() => {
    if ( !previousData ) { return; }
    const notionConnections = data?.notion_connections || [];
    const previousNotionConnections = previousData.notion_connections;
    if ( notionConnections.length > previousNotionConnections.length ) {
      stopPolling();
      if ( notionConnections.length === 1) {
        onChange && onChange({ value: notionConnections[0]?.bot_id, label: notionConnections[0]?.workspace_name || 'Notion Workspace', access_token: notionConnections[0]?.access_token }, null as any)
      }
    }
  }, [ previousData, data, onChange, stopPolling ]);

  const options = (data?.notion_connections || []).map(connection => ({ label: connection.workspace_name || "Notion Workspace", value: connection.bot_id, access_token: connection.access_token }))
  const value = options.find(option => option.value === notionConnectionId);

  return (
    <VStack spacing = '6'>
      <FormControl isInvalid = { isInvalid }>
        <FormLabel>Workspace</FormLabel>
        <HStack>
          <Select value = { value } options = { options } onChange = { onChange } { ...selectProps } />
          <Button onClick = { onClickPlusButton } variant = "icon"><PlusIcon /></Button>
        </HStack>
        <FormHelperText visibility = { value ? 'visible' : 'hidden'}>
          If you've added any new pages to your Notion workspace since you've first authorized Finta access 
          <Button textDecoration = 'underline' ml = '2' variant = 'link' onClick = { onClickPlusButton }>Reauthorize Finta</Button>
        </FormHelperText>
        <FormErrorMessage>{ errorMessage }</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}