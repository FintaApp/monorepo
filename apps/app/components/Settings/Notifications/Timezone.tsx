import {
  Box,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import moment from "moment-timezone";

import { Select } from "~/components/Forms/Select";
import { useToast } from "~/utils/frontend/useToast";
import { useUpdateUserProfileMutation } from "~/graphql/frontend";

export const Timezone = ({ userId, timezone }: { userId: string; timezone?: string | null }) => {
  const [ updateUserProfile ] = useUpdateUserProfileMutation({ refetchQueries: ['GetUserProfile']});
  const renderToast = useToast();

  const options = moment.tz.names().map(tz => ({ label: tz, value: tz }));
  const value = timezone ? { label: timezone, value: timezone } : null;

  const onChange = (newTimezone: string) => {
    if ( newTimezone !== timezone ) {
      updateUserProfile({
        variables: {
          userId,
          _set: { timezone: newTimezone }
        }
      })
      .then(() => {
        renderToast({
          status: "success",
          title: "Timezone Updated"
        });
      })
    }
  }

  return (
    <FormControl>
      <FormLabel>Timezone</FormLabel>
      <Box maxW = {{ base: 'none', md: 'lg'}}>
        <Select 
          options = { options } 
          value = { value } 
          onChange = {(item: any) => onChange(item.value) } 
          placeholder = "Select your prefered timezone"
        />
      </Box>
    </FormControl>
  )
}