import { Box, HStack, Switch, FormControl, FormHelperText, FormLabel, VStack } from "@chakra-ui/react";
import { Frequency } from "@prisma/client";
import { useEffect, useState } from "react";

import { Select } from "~/components/Forms/Select";

import { useToast } from "~/lib/context/useToast";
import { useUser } from "~/lib/context/useUser";
import { trpc } from "~/lib/trpc";

export const EmailSubscriptions = () => {
  const { user, refetchUser } = useUser();
  const { mutateAsync } = trpc.users.updateUser.useMutation({ onSuccess: refetchUser });
  const renderToast = useToast();

  const [ preferences, setPreferences ] = useState({
    periodicUpdatesFrequency: user?.periodicUpdatesFrequency,
    isSubscribedGeneral: user?.isSubscribedGeneral,
    isSubscribedPeriodicUpdates: user?.isSubscribedPeriodicUpdates
  });

  useEffect(() => {
    setPreferences({
      periodicUpdatesFrequency: user?.periodicUpdatesFrequency,
      isSubscribedGeneral: user?.isSubscribedGeneral,
      isSubscribedPeriodicUpdates: user?.isSubscribedPeriodicUpdates
    })
  }, [ user ]);

  if ( !user ) { return <></> }

  const syncFrequenciesOptions = [
    { label: 'Daily', value: Frequency.Daily },
    { label: 'Weekly', value: Frequency.Weekly },
    { label: 'Monthly', value: Frequency.Monthly },
    { label: 'Quarterly', value: Frequency.Quarterly },
    { label: 'Yearly', value: Frequency.Yearly },
  ]
  const frequencyValue =  syncFrequenciesOptions.find(option => option.value === preferences.periodicUpdatesFrequency);

  const onChangeSyncUpdateFrequency = (newFrequency: Frequency) => {
    if ( newFrequency !== preferences.periodicUpdatesFrequency ) {
      setPreferences(prev => ({ ...prev, periodicUpdatesFrequency: newFrequency }))
      mutateAsync({ periodicUpdatesFrequency: newFrequency })
      .then(() => renderToast({ status: "success", title: "Sync Update Frequency Updated"}))
    }
  }

  const onChangeSubscription = (subscription: 'general' | 'periodicUpdates', isEnabled: boolean ) => {
    const field = subscription === 'general' ? 'isSubscribedGeneral' : 'isSubscribedPeriodicUpdates';
    setPreferences(prev => ({ ...prev, [field]: isEnabled }))
    mutateAsync({ [field]: isEnabled })
      .then(() => renderToast({ status: "success", title: "Email Preference Updated"}))
  }

  return (
    <VStack spacing = "4">
      <FormControl>
        <HStack alignItems = 'center'>
          <Switch 
            id = 'general' 
            isChecked = { preferences.isSubscribedGeneral } 
            onChange = {e => onChangeSubscription('general', e.target.checked) }
          />
          <FormLabel ml = '2' htmlFor = 'general' mb = '0'>Subscribe to general Finta updates</FormLabel>
        </HStack>
        <FormHelperText>Quarterly updates about what's new with Finta</FormHelperText>
      </FormControl>
      <FormControl>
        <HStack alignItems = 'center'>
          <Switch 
            id = 'sync-updates' 
            isChecked = { preferences.isSubscribedPeriodicUpdates }
            onChange = {e => onChangeSubscription('periodicUpdates', e.target.checked) }
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
              value = { frequencyValue } 
              onChange = {(item: any) => onChangeSyncUpdateFrequency(item.value) } 
              placeholder = "Sync Update Frequency"
              isDisabled = { !preferences.isSubscribedPeriodicUpdates }
            />
          </Box>
      </FormControl>
    </VStack>
  )
}