import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Link = {
  baseStyle: (props: StyleFunctionProps) => ({
      _focus: {
        boxShadow: "none"
      },
      fontWeight: "semibold",
      color: mode('primary.light.11', 'primary.dark.11')(props),
      _hover: {
        textDecoration: 'none'
      }
    })
  }