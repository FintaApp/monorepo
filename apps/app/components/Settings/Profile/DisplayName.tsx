import {
  FormControl,
  FormLabel
} from "@chakra-ui/react";

import { EditableInputWithButtons } from "../../Forms/EditableInputWithButtons";

import { useToast } from "~/lib/context/useToast";
import { useUser } from "~/lib/context/useUser";
import { trpc } from "~/lib/trpc";

export const DisplayName = () => {
  const { user, refetchUser } = useUser();
  const renderToast = useToast();

  const { mutateAsync, isLoading } = trpc.users.updateUser.useMutation({ onSuccess: refetchUser });

  if ( !user ) { return <></> }

  const onSubmitChanges = ( newValue: string ) => {
    if ( newValue != user.name && newValue.length > 0 ) {
      mutateAsync({ name: newValue })
      .then(() => renderToast({ status: "success", title: "Name Updated"}))
    }
  }

  return (
    <FormControl>
      <FormLabel>
        <EditableInputWithButtons 
          defaultValue = { user.name || "" } 
          onSubmit = { onSubmitChanges }
          isLoading = { isLoading }
        /> 
      </FormLabel>
    </FormControl>
  )
}