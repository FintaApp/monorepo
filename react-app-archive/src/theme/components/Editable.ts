import { StyleFunctionProps } from '@chakra-ui/react';

import { Input } from "./Input"

export const Editable = {
  parts: ["preview", "input"],
  defaultProps: {
    size: "sm"
  },
  baseStyle: (props: StyleFunctionProps) => {
    const outlineTheme = Input.variants.outline(props);
    const flushedTheme = Input.variants.flushed(props);

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
};