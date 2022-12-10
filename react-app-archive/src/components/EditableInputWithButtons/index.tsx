import { useEffect, useState } from "react";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"

import { EditableControls } from "./EditableControls";

export interface EditableInputWithButtonsParams {
  defaultValue: string | undefined;
  isLoading?: boolean;
  onSubmit: (newValue: string) => void;
  visibleOnHover?: boolean;
}

export const EditableInputWithButtons = (params: EditableInputWithButtonsParams) => {
  const { defaultValue, isLoading = false, onSubmit = () => null, visibleOnHover = false } = params;
  const [ value, setValue ] = useState(defaultValue);
  
  useEffect(() => {
    setValue(defaultValue)
  }, [ defaultValue ]);

  const _onSubmit = (newValue: string) => {
    if ( newValue && !isLoading ) {
      onSubmit(newValue);
      setValue(newValue)
    } else {
      setValue(defaultValue);
    }
  }

  return (
    <Editable
      defaultValue = { defaultValue }
      onSubmit = { _onSubmit }
      value = { value }
      onChange = { setValue }
      onCancel = { () => setValue(defaultValue) }
      display = "flex"
      justifyContent = "space-between"
      height = "32px"
      variant = 'outline'
    >
      <EditablePreview width = "100%" height = "32px" mr = "2" />
      <EditableInput width = "100%" mr = "2" />
      <EditableControls visibleOnHover = { visibleOnHover } />
    </Editable>
  )
}