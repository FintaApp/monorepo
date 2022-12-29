import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

export const Switch: any = defineStyleConfig({
  baseStyle: (props) => ({
    track: {
      _checked: {
        bg: mode(`primary.light.9`, `primary.dark.9`)(props),
      }
    }
  })
})