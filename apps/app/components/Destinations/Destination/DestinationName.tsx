import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { EditableInputWithButtons } from "~/components/Forms/EditableInputWithButtons";
import { useToast } from "~/utils/frontend/useToast";
import { useUpdateDestinationMutation } from "~/graphql/frontend";

interface DestinationNameProps {
  destinationId?: string;
  value: string;
  onChange?: (newValue: string) => void;
}

export const DestinationName = ({ destinationId, value, onChange }: DestinationNameProps) => {
  const renderToast = useToast();
  const [ updateDestinationMutation, { loading } ] = useUpdateDestinationMutation();

  const onSubmit = (newValue: string) => {
    if ( newValue !== value ) {
      updateDestinationMutation({ variables: { destinationId, _set: { name: newValue }} })
      .then(() => {
        renderToast({ title: "Destination Updated", status: "success" });
        onSubmit && onSubmit(newValue);
      })
    }
  }
  return (
    <FormControl>
      <FormLabel>Destination Name</FormLabel>
      { destinationId
        ? <EditableInputWithButtons 
            defaultValue = { value } 
            onSubmit = { onSubmit } 
            isLoading = { loading } 
          />
        : <Input
            value = { value }
            onChange = { e => onChange && onChange(e.target.value) }
          />
      }
      { destinationId ? null : <FormHelperText>Enter a nickname for this destination.</FormHelperText>}
    </FormControl>
  )
}