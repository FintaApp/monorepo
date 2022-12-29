import { defineStyleConfig } from '@chakra-ui/react'

export const Badge: any = defineStyleConfig({
  baseStyle: {
    px: 2,
    py: 1
  },
  variants: {
    success: ({ colorMode }) => ({
      bg: colorMode === 'light' ? 'green.light.4' : 'green.dark.4',
      color: colorMode === 'light' ? 'green.light.11' : 'green.dark.11'
    }),
    error: ({ colorMode }) => ({
      bg: colorMode === 'light' ? 'tomato.light.4' : 'tomato.dark.4',
      color: colorMode === 'light' ? 'tomato.light.11' : 'tomato.dark.11'
    })
  }
})