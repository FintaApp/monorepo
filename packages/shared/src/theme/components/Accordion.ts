import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers,  } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys)

const baseStyle = definePartsStyle(({ colorMode }) => ({
  container: { border: 'none' },
  button: {
    _focus: { boxShadow: 'none' },
    _hover: { bg: colorMode === 'light' ? 'gray.light.1' : 'gray.dark.1' }
  }
}));

export const Accordion: any = defineMultiStyleConfig({ baseStyle })