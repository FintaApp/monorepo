import { defineStyleConfig } from '@chakra-ui/react';

export const Textarea: any = defineStyleConfig({
  defaultProps: {
    variant: "styled"
  },
  variants: {
    styled: {
      border: 'none',
      resize: 'none',
      fontSize: 'sm'
    }
  }
})