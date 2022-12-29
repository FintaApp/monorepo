import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

export const Link: any = defineStyleConfig({
  baseStyle: (props) => ({
      _focus: {
        boxShadow: "none"
      },
      fontWeight: "semibold",
      color: mode('primary.light.11', 'primary.dark.11')(props),
      _hover: {
        textDecoration: 'none'
      }
    })
  })