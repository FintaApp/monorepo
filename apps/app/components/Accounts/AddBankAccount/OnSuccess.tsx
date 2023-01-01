import { useState } from "react";
import { 
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  HStack,
  Stack,
  Text
} from "@chakra-ui/react";
import { RouterOutput, trpc } from "~/lib/trpc";

interface OnSuccessProps {
  plaidItem: RouterOutput['plaid']['exchangePublicToken'];
  onFinish: () => void;
  institutionName: string;
}

const NoDestinationsView = ({ onFinish }: { onFinish: OnSuccessProps['onFinish']}) => (
  <Box my = "8">
    <Text fontSize = "2xl" textAlign = "center">Your bank account has been successfully connected.</Text>
    <Button mt = "4" width = "full" onClick = { onFinish } variant = "primary">View my accounts</Button>
  </Box>
)

export const OnSuccess = ({ plaidItem, onFinish, institutionName }: OnSuccessProps) => {
  const { data: destinations } = trpc.destinations.getAllDestinations.useQuery(undefined, { enabled: !!plaidItem });
  const { mutateAsync: connectDestinations, isLoading: isConnectingDestinations } = trpc.plaid.connectDestinationsToPlaidAccounts.useMutation();
  const [ selectedDestinations, setSelectedDestinations ] = useState<string[]>([]);
  if ( !destinations ) { return <></> };

  const accounts = plaidItem?.accounts || [];

  const onSubmit = () => {
    if ( !plaidItem ) { return; }
    connectDestinations({ plaidItemId: plaidItem.id, destinationIds: selectedDestinations})
      .then(() => {
        onFinish();
      })
  }

  if ( destinations.length === 0 || accounts.length === 0 ) {
    return <NoDestinationsView onFinish = { onFinish } />
  } else if ( destinations.length === 1 ) {
    return (
      <Box>
        <Text textAlign = "center">Would you like to connect your { institutionName } account{accounts.length > 1 ? "s" : ""} to your {destinations[0].name} Destination?</Text>
          <HStack mt = "4" justifyContent = "space-between">
            <Button onClick = { onFinish }>No</Button>
            <Button variant = "primary" onClick = { onSubmit } isLoading = { isConnectingDestinations }>Yes</Button>
          </HStack>
      </Box>
    )
  } else {
    return (
      <Box>
        <Text textAlign = "center" mb = "2">Which destinations would you like to connect your { institutionName } account{accounts.length > 1 ? "s" : ""} to?</Text>
        <CheckboxGroup colorScheme = 'primary' defaultValue={ selectedDestinations } onChange = { (destinationIds: string[]) => setSelectedDestinations(destinationIds) }>
          <Stack spacing = "2" direction = "column">
            { destinations.map(destination => <Checkbox value = { destination.id } key = { destination.id }>{ destination.name }</Checkbox>) }
          </Stack>
        </CheckboxGroup>
        <HStack mt = "4" justifyContent = "space-between">
          <Button onClick = { onFinish }>Cancel</Button>
          <Button 
            variant = "primary" 
            onClick = { onSubmit } 
            isLoading = { isConnectingDestinations }
            isDisabled = { (selectedDestinations || []).length === 0}
          >Connect</Button>
        </HStack>
      </Box>
    )
  }
}