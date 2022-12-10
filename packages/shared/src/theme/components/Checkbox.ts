import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Checkbox = {
  baseStyle: (props: StyleFunctionProps) => ({
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
}