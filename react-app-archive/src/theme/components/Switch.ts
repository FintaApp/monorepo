import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Switch = {
  baseStyle: (props: StyleFunctionProps) => ({
    track: {
      _checked: {
        bg: mode(`primary.light.9`, `primary.dark.9`)(props),
      }
    }
  })
}