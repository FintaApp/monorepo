import {
  FormControl,
  FormLabel
} from "@chakra-ui/react";

import { EditableInputWithButtons } from "src/components/EditableInputWithButtons";
import { useToast } from "src/lib/useToast";
import { useUpdateUserMutation } from "src/graphql";
import { useAuth } from "src/lib/useAuth";

export const DisplayName = () => {
  const { user } = useAuth();
  const [ updateUserMutation, { loading } ] = useUpdateUserMutation();
  const renderToast = useToast();

  const onSubmitChanges = (newValue: string) => {
    if ( newValue !== user!.display_name ) {
      updateUserMutation({
        variables: {
          id: user!.id,
          _set: { displayName: newValue }
        }
      })
      .then(() => {
        renderToast({
          status: "success",
          title: "Name Updated"
        });
      })
    }
  }
  
  return (
    <FormControl>
      <FormLabel>Display Name</FormLabel>
      <EditableInputWithButtons defaultValue = { user!.display_name } onSubmit = { onSubmitChanges } isLoading = { loading } />
    </FormControl>
  )
}