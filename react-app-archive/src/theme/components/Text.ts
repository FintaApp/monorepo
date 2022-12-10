import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';


export const Text = {
  variants: {
    helper: (props: StyleFunctionProps) => ({
      color: mode('gray.light.11', 'gray.dark.11')(props)
    }),
    error: (props: StyleFunctionProps) => ({
      color: mode('tomato.light.11', 'tomato.dark.11')(props)
    })
  }
}