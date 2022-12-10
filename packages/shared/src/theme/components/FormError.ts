import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const FormError = {
  baseStyle: (props: StyleFunctionProps) => ({
    text: {
      color: mode("tomato.light.11", "tomato.dark.11")(props)
    }
  })
}