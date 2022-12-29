import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

export const Text: any = defineStyleConfig({
  variants: {
    helper: (props) => ({
      color: mode('gray.light.11', 'gray.dark.11')(props)
    }),
    error: (props) => ({
      color: mode('tomato.light.11', 'tomato.dark.11')(props)
    })
  }
})