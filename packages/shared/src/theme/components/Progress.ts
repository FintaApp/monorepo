import { progressAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '../mode';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(progressAnatomy.keys)

export const Progress: any = defineMultiStyleConfig({
  baseStyle: (props) => ({
      filledTrack: {
        bg: mode('primary.light.9', 'primary.dark.9')(props)
      },
      track: {
        bg: mode('gray.light.3', 'gray.dark.3')(props),
        shadow: mode("light.sm", "dark.sm")(props),
      }
    })
  })