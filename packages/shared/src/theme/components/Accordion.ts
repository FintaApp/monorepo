import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Accordion = {
  baseStyle: (props: StyleFunctionProps) => ({
    container: {
      border: "none"
    },
    button: {
      _focus: {
        boxShadow: "none"
      },
      _hover: {
        bg: mode('gray.light.10', 'gray.dark.1')
      },
    },
    item: {
      //border: "none"
      border: "1px"
    }
  }),
};