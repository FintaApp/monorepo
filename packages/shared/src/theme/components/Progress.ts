import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Progress = {
  baseStyle: (props: StyleFunctionProps) => ({
      filledTrack: {
        bg: mode('primary.light.9', 'primary.dark.9')(props)
      },
      track: {
        bg: mode('gray.light.3', 'gray.dark.3')(props),
        shadow: mode("light.sm", "dark.sm")(props),
      }
    })
  }