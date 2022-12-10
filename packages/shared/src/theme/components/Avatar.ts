import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools'

export const Avatar = {
  defaultProps: {
    size: "sm"
  },
  baseStyle: (props: StyleFunctionProps) => ({
    container: {
      bg: mode('primary.light.4', 'primary.dark.4')(props),
      color: mode('gray.light.12', 'gray.dark.12')(props)
    }
  })
}