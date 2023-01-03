import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

export const Checkbox: any = defineStyleConfig({
  baseStyle: (props) => ({
    control: {
      _checked: {
        bg: mode(`primary.light.9`, `primary.dark.9`)(props),
        borderColor: mode(`primary.light.9`, `primary.dark.9`)(props),
        color: mode("white", "gray.dark.2")(props),
  
        _hover: {
          bg: mode(`primary.light.10`, `primary.dark.10`)(props),
          borderColor: mode(`primary.light.10`, `primary.dark.10`)(props),
        }
      },
      _focusVisible: {
        boxShadow: "none",
      }
    }
  })
})