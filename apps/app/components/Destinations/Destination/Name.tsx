import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { EditableInputWithButtons } from "~/components/Forms/EditableInputWithButtons";
import { useToast } from "~/utils/frontend/useToast";
import { useUpdateDestinationMutation } from "~/graphql/frontend";
import { DestinationModel } from "~/types/frontend/models";

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