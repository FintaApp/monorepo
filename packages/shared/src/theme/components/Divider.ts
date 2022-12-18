import { mode } from '@chakra-ui/theme-tools';
import { defineStyleConfig } from "@chakra-ui/react";

export const Divider = defineStyleConfig({
  baseStyle: {
    borderColor: 'tomato.dark.7',
    _dark: {
      borderColor: 'tomato.dark.7'
    }
  }
}) as any