import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

export const FormError: any = defineStyleConfig({
  baseStyle: (props) => ({
    text: {
      color: mode("tomato.light.11", "tomato.dark.11")(props)
    }
  })
})