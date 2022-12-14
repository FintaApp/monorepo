import { defineStyleConfig } from '@chakra-ui/react';

export const Heading: any = defineStyleConfig({
  baseStyle: () => ({
    fontWeight: 'normal'
  }),
  variants: {
    h1: {
      mb: 2,
      fontSize: '2.25rem'
    },
    h2: {
      fontSize: '1.5rem',
    },
    h3: {
      fontSize: '1.25rem'
    }
  }
})