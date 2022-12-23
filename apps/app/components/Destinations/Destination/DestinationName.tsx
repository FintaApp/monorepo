import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { EditableInputWithButtons } from "~/components/Forms/EditableInputWithButtons";
import { useDestination } from "../context";

export const DestinationName = () => {
  const { isSetupMode, name, updateName } = useDestination();

  return (
    <FormControl>
      <FormLabel>Destination Name</FormLabel>
      { isSetupMode
        ? <Input
            value = { name }
            onChange = { e => updateName(e.target.value, false) }
          />
        : <EditableInputWithButtons 
            defaultValue = { name } 
            onSubmit = { newValue => updateName(newValue, true) } 
            isLoading = { false } 
          />
      }
      { isSetupMode && <FormHelperText>Enter a nickname for this destination.</FormHelperText>}
    </FormControl>
  )
}