import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers,  } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys)

const baseStyle = definePartsStyle(({ colorMode }) => ({
  container: { border: '1px' },
  button: {
    _focus: { boxShadow: 'none' },
    _hover: { bg: colorMode === 'light' ? 'gray.light.10' : 'gray.dark.1' }
  }
}));

export const Accordion: any = defineMultiStyleConfig({ baseStyle })