import { useCallback, useState } from "react";
import { HStack, Button, Stack } from "@chakra-ui/react";

import { NotionConnection } from "~/components/NotionConnection";
import { Step, StepContent } from "~/components/VerticalSteps";
import { DestinationErrorCode, NotionCredentials } from "~/types/shared/models";
import { checkDestinationCredentials } from "~/utils/frontend/functions";
import { Integrations_Enum } from "~/graphql/frontend";

interface NotionCredentialsProps {
  onSubmitAuthentication: (props: NotionCredentials) => void;
  onBack: () => void;
  setActiveStep: (step: number) => void
}

export const Notion = ({ onSubmitAuthentication, onBack, setActiveStep }: NotionCredentialsProps) => {
  const [ isCheckLoading, setIsCheckLoading ] = useState(false);
  const [ error, setError ] = useState({ field: "", message: "" });
  const [ notionConnection, setNotionConnection ] = useState<null | { label: string, value: string, access_token: string }>(null);

  const onSubmitCredentials = () => {
    setError({ field: "", message: "" });
    setIsCheckLoading(true);
    const credentials = { access_token: notionConnection!.access_token, bot_id: notionConnection!.value };
    checkDestinationCredentials({ integrationId: Integrations_Enum.Notion, credentials })
    .then(({ isValid, errorCode }) => {
      if ( isValid ) { onSubmitAuthentication(credentials) }
      if ( errorCode === DestinationErrorCode.NOT_ALLOWED ) {
        setError({ field: 'access_token', message: 'This Notion connection is no longer valid. Please reconnect'})
      }
    })
    .catch(err => console.log(err))
    .finally(() => setIsCheckLoading(false))
  };

  const onChange = useCallback((item: any) => setNotionConnection(item), []);

  return (
    <Step title = "Select Notion Workspace" setActiveStep = { setActiveStep }>
      <StepContent>
        <Stack shouldWrapChildren spacing = "4">
          <NotionConnection notionConnectionId = { notionConnection?.value || null }  onChange = { onChange } isInvalid = { !!error.message } errorMessage = { error.message } />

          <HStack justifyContent = "space-between">
            <Button size = "sm" variant = "ghost" onClick = { onBack }>Back</Button>
            <Button isLoading = { isCheckLoading } size = "sm" onClick = { onSubmitCredentials } variant = "primary" isDisabled = { !notionConnection }>Next</Button>
          </HStack>
        </Stack>
      </StepContent>
    </Step>
  )
}