import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { EditableInputWithButtons } from "src/components/EditableInputWithButtons";
import * as analytics from "src/lib/analytics";
import { useToast } from "src/lib/useToast";
import { useUpdateDestinationMutation } from "src/graphql";
import { DestinationModel } from "src/types";

type CreateDestinationNameProps = {
  value: string;
  onChange: (newValue: string) => void;
}

type UpdateDestinationNameProps = {
  destination: DestinationModel;
  onSubmit?: (newValue: string) => void;

}

const CreateDestinationName = ({ value, onChange }: CreateDestinationNameProps) => (
  <FormControl>
    <FormLabel>Destination Name</FormLabel>
    <Input
      value = { value }
      onChange = { e => onChange(e.target.value) }
    />
    <FormHelperText>Enter a nickname for this destination.</FormHelperText>
  </FormControl>
);

const UpdateDestinationName = ({ destination, onSubmit }: UpdateDestinationNameProps ) => {
  const renderToast = useToast();
  const [ updateDestinationMutation, { loading } ] = useUpdateDestinationMutation();

  const updateDestinationName = (newValue: string) => {
    if ( newValue !== destination.name ) {
      updateDestinationMutation({ variables: { destination_id: destination.id, _set: { name: newValue }} })
      .then(() => {
        renderToast({ title: "Destination Updated", status: "success" });
        analytics.track({ event: analytics.EventNames.DESTINATION_UPDATED, properties: { field: 'name' }});
        onSubmit && onSubmit(newValue);
      })
    }
  }

  return (
    <FormControl>
      <FormLabel>Destination Name</FormLabel>
      <EditableInputWithButtons 
        defaultValue = { destination.name } 
        onSubmit = { updateDestinationName } 
        isLoading = { loading } 
        />
    </FormControl>
  )
}

export const DestinationName = {
  Create: CreateDestinationName,
  Update: UpdateDestinationName
}