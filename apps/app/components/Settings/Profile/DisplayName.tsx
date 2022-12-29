import {
  FormControl,
  FormLabel
} from "@chakra-ui/react";

import { EditableInputWithButtons } from "../../Forms/EditableInputWithButtons";
import { useToast } from "~/utils/frontend/useToast";
import { useUpdateUserMutation } from "~/graphql/frontend";
import { useUser } from "~/lib/context/useUser";

export const DisplayName = () => {
  const { user } = useUser();
  const renderToast = useToast();

  const [ updateUserMutation, { loading } ] = useUpdateUserMutation();

  if ( !user ) { return <></> }

  const onSubmitChanges = ( newValue: string ) => {
    if ( newValue != user.name && newValue.length > 0 ) {
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
          defaultValue = { user.name } 
          onSubmit = { onSubmitChanges }
          isLoading = { loading }
        /> 
      </FormLabel>
    </FormControl>
  )
}