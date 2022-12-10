import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Badge = {
  baseStyle: {
    px: 2,
    py: 1
  },
  variants: {
    success: (props: StyleFunctionProps) => ({
      bg: mode('green.light.4', 'green.dark.4')(props),
      color: mode('green.light.11', 'green.dark.11')(props)
    }),
    error: (props: StyleFunctionProps) => ({
      bg: mode('tomato.light.4', 'tomato.dark.4')(props),
      color: mode('tomato.light.11', 'tomato.dark.11')(props)
    })
  }
}