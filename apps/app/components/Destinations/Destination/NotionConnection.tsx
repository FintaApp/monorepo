import { PlusIcon } from "@radix-ui/react-icons";

import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react"
import { trpc } from "~/lib/trpc"
import { useDestination } from "../context";

import { SelectProps, Select } from "~/components/Forms/Select";

export const NotionConnection = (selectProps: SelectProps) => {
  const [ shouldPoll, setShouldPoll ] = useState(false);
  const [ totalConnections, setTotalConnections ] = useState(0)
  const { data: allUserNotionCredentials } = trpc.destinations.getNotionCredentials.useQuery(undefined, { refetchInterval: shouldPoll ? 2000 : false });
  const { credentialsValidation, notionBotId, setNotionBotId } = useDestination();
  const onClickPlusButton = () => {
    setShouldPoll(true);
    const data = {
      client_id: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID!,
      redirect_uri: `${window.location.origin}/auth/notion`,
      response_type: 'code',
      owner: 'user',
    };

    const urlParams = new URLSearchParams(data);
    window.open(
      `https://api.notion.com/v1/oauth/authorize?${urlParams.toString()}`, 
      'mywindow',
      "menubar=0,resizeable=1,width=500,height=750"
    )
  };

  useEffect(() => { 
    const newTotalConnections = allUserNotionCredentials?.length || 0;
    if ( shouldPoll && newTotalConnections > totalConnections ) { setShouldPoll(false) };
    setTotalConnections(newTotalConnections)
  }, [ allUserNotionCredentials, shouldPoll, totalConnections ]);

  const options = allUserNotionCredentials?.map(cred => ({ label: cred.workspaceName || "Notion Workspace", value: cred.botId })) || [];
  const value = options.find(option => option.value === notionBotId);

  return (
    <VStack spacing = '6'>
      <FormControl isInvalid = { credentialsValidation && !credentialsValidation.isValid }>
        <FormLabel>Workspace</FormLabel>
        <HStack>
          <Select value = { value } options = { options } onChange = { (item: any) => setNotionBotId(item.value) } { ...selectProps } />
          <Button onClick = { onClickPlusButton } variant = "icon"><PlusIcon /></Button>
        </HStack>
        <FormHelperText visibility = { value ? 'visible' : 'hidden'}>
          If you've added any new pages to your Notion workspace since you've first authorized Finta access 
          <Button textDecoration = 'underline' ml = '2' variant = 'link' onClick = { onClickPlusButton }>Reauthorize Finta</Button>
        </FormHelperText>
        <FormErrorMessage>{ credentialsValidation?.error?.message }</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}