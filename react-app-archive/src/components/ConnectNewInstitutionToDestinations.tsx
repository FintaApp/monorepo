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

import { PlaidItemModel } from "src/types";
import { useGetDestinationsQuery, useInsertDestinationAccountsMutation } from "src/graphql";

export const ConnectNewInstitutionToDestinations = ({ newPlaidItem, onFinish }: { newPlaidItem: PlaidItemModel; onFinish: () => void; }) => {
  const [ selectedDestinations, setSelectedDestinations ] = useState([] as string[]);
  const { data } = useGetDestinationsQuery();
  const [ createDestinationAccountsMutation, { loading: isCreatingDestinationAccounts } ] = useInsertDestinationAccountsMutation({ refetchQueries: 'all' });

  const destinations = data?.destinations;
  if ( !destinations ) { return <></> };

  const { accounts, institution } = newPlaidItem;

  const onSubmit = () => {
    if ( !newPlaidItem ) { return; }
    const destination_accounts = (selectedDestinations || [])
      .map(destinationId => accounts.map(account => ({
        destination_id: destinationId,
        account_id: account.id
      })))
      .reduce((all, curr) => all.concat(curr), []);
    
    createDestinationAccountsMutation({ variables: { destination_accounts }}).then(onFinish)
  }

  
  if ( destinations.length === 0 || accounts.length === 0 ) {
    return (
      <Box my = "8">
        <Text fontSize = "2xl" textAlign = "center">Your bank account has been successfully connected.</Text>
        <Button mt = "4" width = "full" onClick = { onFinish } variant = "primary">View my accounts</Button>
      </Box>
    )
  } else if ( destinations.length === 0 ) {
    return (
      <Box>
        <Text textAlign = "center">Would you like to connect your { institution.name } account{accounts.length > 1 ? "s" : ""} to your {destinations[0].name} Destination?</Text>
          <HStack mt = "4" justifyContent = "space-between">
            <Button onClick = { onFinish }>No</Button>
            <Button variant = "primary" onClick = { onSubmit } isLoading = { isCreatingDestinationAccounts }>Yes</Button>
          </HStack>
      </Box>
    )
  } else {
    return (
      <Box>
        <Text textAlign = "center" mb = "2">Which destinations would you like to connect your { institution.name } account{accounts.length > 1 ? "s" : ""} to?</Text>
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
            isLoading = { isCreatingDestinationAccounts }
            isDisabled = { (selectedDestinations || []).length === 0}
          >Connect</Button>
        </HStack>
      </Box>
    )
  }
}