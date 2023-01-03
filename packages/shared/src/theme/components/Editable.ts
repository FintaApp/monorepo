import { editableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(editableAnatomy.keys)

import { Input } from "./Input"

export const Editable: any = defineMultiStyleConfig({
  defaultProps: {
    size: "sm"
  },
  baseStyle: (props) => {
    const outlineTheme = Input.variants!.outline(props);
    const flushedTheme = Input.variants!.flushed(props);

    return ({
      input: {
        ...outlineTheme.field,
        px: 3
      },
      preview: {
        ...flushedTheme?.field,
        px: 3
      }
    })
  }
});