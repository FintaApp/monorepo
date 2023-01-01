import { 
  Button, 
  FormControl, 
  FormErrorMessage, 
  FormLabel, 
  HStack, 
  Stack, 
  Text, 
  VStack 
} from "@chakra-ui/react";
import { Cross1Icon, CheckIcon, SymbolIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { trpc } from "~/lib/trpc"
import { useDestination } from "../../context"
import { Select } from '~/components/Forms';

export const Airtable = () => {
  const { airtableBaseId, credentialsHasChanges, onCancelChanges, credentialsValidation, setAirtableBaseId, isSetupMode, validateCredentials, isValidatingCredentials, isUpdatingCredentials } = useDestination();

  const [ shouldPoll, setShouldPoll ] = useState(false);
  const { data: hasToken } = trpc.airtable.doesUserHaveToken.useQuery(undefined, { refetchInterval: shouldPoll ? 2000 : false })
  const { data: basesData, isLoading: isLoadingBases, refetch: refetchBases } = trpc.airtable.getBases.useQuery(undefined, { enabled: !!hasToken });
  const { mutateAsync: getAuthorizationUrlMutation, isLoading: isGettingAuthUrl } = trpc.airtable.getAuthorizationUrl.useMutation();

  const getAuthorizationUrl = () => { 
    setShouldPoll(true);
    getAuthorizationUrlMutation().then(({ url }) => window.open(url, '_blank'));
  } ;

  useEffect(() => { if ( shouldPoll && hasToken ) { setShouldPoll(false)}}, [ hasToken, shouldPoll ])

  const options = basesData?.bases.map(base => ({ label: base.name, value: base.id })) || [];
  const value = options.find(option => option.value === airtableBaseId);

  if ( !hasToken ) {
    return (
      <VStack>
        <Button isLoading = { isGettingAuthUrl } onClick = { getAuthorizationUrl } variant = "primaryOutline" size = "md" width = "full">Connect to Airtable</Button>
        <Text>Log in with Airtable so that Finta can sync data to your base. You can </Text>
      </VStack>
    )
  }

  return (
    <Stack direction = 'column' spacing = '2' mt = '2'>
      <FormControl isInvalid = { credentialsValidation && credentialsValidation.isValid }>
        <FormLabel>Base</FormLabel>
        <HStack spacing = "4">
          <Select 
            value = { value } 
            options = { options } 
            onChange = { (item: any) => setAirtableBaseId(item.value) } 
            isLoading = { isLoadingBases }
            noOptionsMessage = { () => basesData ? "No bases have been shared with Finta" : "Hit the refresh button to fetch your Airtable Bases"}
            placeholder = { basesData ? "Select Base" : "Hit the refresh button to fetch your Airtable Bases" }
          />
          <Button ml = "2" isLoading = { isLoadingBases } onClick = { () => refetchBases() } variant = "icon"><SymbolIcon /></Button>
          </HStack>
        <FormErrorMessage>{ credentialsValidation?.error?.message }</FormErrorMessage>
      </FormControl>

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