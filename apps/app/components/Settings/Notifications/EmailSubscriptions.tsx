import { Box, HStack, Switch, FormControl, FormHelperText, FormLabel, VStack } from "@chakra-ui/react";

import { Select } from "~/components/Forms/Select";
import { Frequencies_Enum } from "~/graphql/frontend";
import { useToast } from "~/utils/frontend/useToast";
import { useUpdateUserProfileMutation } from "~/graphql/frontend";

export const EmailSubscriptions = ({ userId, isSubscribedGeneral, isSubscribedSyncUpdates, syncUpdatesFrequency }: {
  userId: string;
  isSubscribedGeneral: boolean;
  isSubscribedSyncUpdates: boolean;
  syncUpdatesFrequency?: Frequencies_Enum | null
}) => {
  const [ updateUserProfile ] = useUpdateUserProfileMutation({ refetchQueries: ['GetUserProfile']});
  const renderToast = useToast();

  const syncFrequenciesOptions = [
    { label: 'Daily', value: Frequencies_Enum.Daily },
    { label: 'Weekly', value: Frequencies_Enum.Weekly },
    { label: 'Monthly', value: Frequencies_Enum.Monthly },
    { label: 'Quarterly', value: Frequencies_Enum.Quarterly },
    { label: 'Yearly', value: Frequencies_Enum.Yearly },
  ]
  const syncFrequencyValue = syncUpdatesFrequency ? syncFrequenciesOptions.find(option => option.value === syncUpdatesFrequency) : null;

  const onChangeSyncUpdateFrequency = (newFrequency: Frequencies_Enum) => {
    if ( newFrequency !== syncUpdatesFrequency ) {
      updateUserProfile({ variables: {
        userId,
        _set: { syncUpdatesFrequency: newFrequency }
      }})
      .then(() => {
        renderToast({
          status: "success",
          title: "Sync Update Frequency Updated"
        });
      })
    }
  }

  const onChangeSubscription = (subscription: 'is_subscribed_general' | 'is_subscribed_sync_updates', isEnabled: boolean ) => {
    updateUserProfile({ variables: {
      userId,
      _set: { [subscription]: isEnabled }
    }})
    .then(() => {
      renderToast({
        status: "success",
        title: "Email Preference Updated"
      });
    })
  }

  return (
    <VStack spacing = "4">
      <FormControl>
        <HStack alignItems = 'center'>
          <Switch 
            id = 'general' 
            isChecked = { isSubscribedGeneral } 
            onChange = {e => onChangeSubscription('is_subscribed_general', e.target.checked) }
          />
          <FormLabel ml = '2' htmlFor = 'general' mb = '0'>Subscribe to general Finta updates</FormLabel>
        </HStack>
        <FormHelperText>Quarterly updates about what's new with Finta</FormHelperText>
      </FormControl>
      <FormControl>
        <HStack alignItems = 'center'>
          <Switch 
            id = 'sync-updates' 
            isChecked = { isSubscribedSyncUpdates }
            onChange = {e => onChangeSubscription('is_subscribed_sync_updates', e.target.checked) }
          />
          <FormLabel ml = '2' htmlFor = 'sync-updates' mb = '0'>Subscribe to sync updates</FormLabel>
        </HStack>
        <FormHelperText>
          Periodic emails about the status of your bank connections, recent syncs, and any bank account connection issues
        </FormHelperText>

        <FormLabel mt = '1'>Sync Update Frequency</FormLabel>
          <Box maxW = {{ base: 'none', md: 'lg'}}>
            <Select 
              options = { syncFrequenciesOptions } 
              value = { syncFrequencyValue } 
              onChange = {(item: any) => onChangeSyncUpdateFrequency(item.value) } 
              placeholder = "Sync Update Frequency"
              isDisabled = { !isSubscribedSyncUpdates }
            />
          </Box>
      </FormControl>
    </VStack>
  )
}