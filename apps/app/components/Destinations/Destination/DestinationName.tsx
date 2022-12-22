import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { EditableInputWithButtons } from "~/components/Forms/EditableInputWithButtons";
import { useToast } from "~/utils/frontend/useToast";
import { useDestination } from "../context";

export const DestinationName = () => {
  const { isSetupMode, name, setName } = useDestination();
  const renderToast = useToast();

  // const onSubmit = (newValue: string) => {
  //   if ( newValue !== value ) {
  //     updateDestinationMutation({ variables: { destinationId, _set: { name: newValue }} })
  //     .then(() => {
  //       renderToast({ title: "Destination Updated", status: "success" });
  //       onSubmit && onSubmit(newValue);
  //     })
  //   }
  // }

  return (
    <FormControl>
      <FormLabel>Destination Name</FormLabel>
      { isSetupMode
        ? <Input
            value = { name }
            onChange = { e => setName(e.target.value) }
          />
        : <EditableInputWithButtons 
            defaultValue = { name } 
            onSubmit = { () => null } 
            isLoading = { false } 
          />
      }
      { isSetupMode && <FormHelperText>Enter a nickname for this destination.</FormHelperText>}
    </FormControl>
  )
}