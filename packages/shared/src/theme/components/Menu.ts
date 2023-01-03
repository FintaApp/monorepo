import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '../mode';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys)

export const Menu: any = defineMultiStyleConfig({
  baseStyle: (props) => ({
    list: {
      boxShadow: "sm",
      px: 2,
      bg: mode('white', 'gray.dark.3')(props),
      zIndex: 2
    },
    item: {
      rounded: "sm",
      py: 2,
      lineHeight: 1.6,
      _hover: {
        bg: mode('gray.light.4', 'gray.dark.4')(props)
      },
      _focus: {
        bg: mode('gray.light.4', 'gray.dark.4')(props)
      },
      _active: {
        bg: mode('gray.light.5', 'gray.dark.5')(props)
      }
    }
  })
});