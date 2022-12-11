import {
  FormControl,
  FormLabel
} from "@chakra-ui/react";

import { EditableInputWithButtons } from "../../Forms/EditableInputWithButtons";
import { useToast } from "~/utils/frontend/useToast";
import { useUpdateUserMutation } from "~/graphql/frontend";
import { useAuth } from "~/utils/frontend/useAuth";

export const DisplayName = () => {
  const { user } = useAuth();
  const renderToast = useToast();

  const [ updateUserMutation, { loading } ] = useUpdateUserMutation();

  if ( !user ) { return <></> }

  const onSubmitChanges = ( newValue: string ) => {
    if ( newValue != user.displayName && newValue.length > 0 ) {
      updateUserMutation({
        variables: {
          id: user.id,
          _set: { displayName: newValue }
        }
      })
      .then(() => renderToast({ status: "success", title: "Name Updated"}))
    }
  }

  return (
    <FormControl>
      <FormLabel>
        <EditableInputWithButtons 
          defaultValue = { user.displayName } 
          onSubmit = { onSubmitChanges }
          isLoading = { loading }
        /> 
      </FormLabel>
    </FormControl>
  )
}