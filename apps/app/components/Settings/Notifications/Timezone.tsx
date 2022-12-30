import {
  Box,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";

import { Select } from "~/components/Forms/Select";

import { useToast } from "~/lib/context/useToast";
import { useUser } from "~/lib/context/useUser";
import { trpc } from "~/lib/trpc";

export const Timezone = () => {
  const { user, refetchUser } = useUser();
  const renderToast = useToast();
  const { mutateAsync } = trpc.users.updateUser.useMutation({ onSuccess: refetchUser });

  const [ timezone, setTimezone ] = useState(user?.timezone)

  useEffect(() => { setTimezone(user?.timezone)}, [ user ]);

  const options = moment.tz.names().map(tz => ({ label: tz, value: tz }));
  const value = timezone ? { label: timezone, value: timezone } : null;

  const onChange = (newTimezone: string) => {
    if ( newTimezone !== timezone ) {
      setTimezone(newTimezone)
      mutateAsync({ timezone: newTimezone })
      .then(() => renderToast({ status: "success", title: "Timezone Updated"}))
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