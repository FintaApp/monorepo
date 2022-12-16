import {
  Button,
  ButtonGroup,
  Icon,
  Flex,
  Text,
  useEditableControls
} from "@chakra-ui/react";
import { Pencil2Icon, Cross1Icon, CheckIcon } from "@radix-ui/react-icons";

export interface EditableControlsParams {
  visibleOnHover: boolean;
}

export const EditableControls = (params: EditableControlsParams) => {
  const { visibleOnHover } = params;
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent = "center" size = "sm" spacing = "2">
      <Button
        size = "sm"
        variant = {{ base: 'icon', md: 'outline' }}
        { ...getCancelButtonProps() }
      >
        <Icon display = {{ md: 'none' }} as = { Cross1Icon } />
        <Text display = {{ base: 'none', md: 'inline-flex' }}>Cancel</Text>
      </Button>

      <Button
        size = "sm"
        variant = {{ base: 'primaryIcon', md: 'primary' }}
        { ...getSubmitButtonProps() }
      >
        <Icon display = {{ md: 'none' }} as = { CheckIcon } />
        <Text display = {{ base: 'none', md: 'inline-flex' }}>Save</Text>
      </Button>
    </ButtonGroup>
  ) : (
    <ButtonGroup 
      justifyContent = "center" 
      size = "sm" 
      spacing = "4"
      visibility = { visibleOnHover ? "hidden" : "visible" }
      width = "50px"
    >
      <Flex justifyContent="center">
        <Button
          size = "sm"
          variant = 'icon'

          { ...getEditButtonProps() }
        ><Pencil2Icon />
        </Button>
      </Flex>
    </ButtonGroup>
  );

}