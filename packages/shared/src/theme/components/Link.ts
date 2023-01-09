import { defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

export const Link: any = defineStyleConfig({
  baseStyle: (props) => ({
    _focus: {
      boxShadow: "none"
    },
    fontWeight: "semibold",
    color: mode('primary.light.11', 'primary.dark.11')(props),
    _hover: {
      textDecoration: 'none'
    }
  }),
  variants: {
    navigation: props => ({
      fontWeight: 'semibold',
      color: mode('gray.light.11', 'gray.dark.11')(props),
      _activeLink: {
        color: mode('primary.light.11', 'primary.dark.11')(props),
      },
      _hover: {
        textDecoration: 'none',
        color: mode('gray.light.12', 'gray.dark.12')(props),
      }
    }),
    activeNavigation: props => ({
      fontWeight: 'semibold',
      color: mode('primary.light.12', 'primary.dark.12')(props),
      _hover: {
        textDecoration: 'none'
      }
    }),
    unstyled: {
      color: 'inherit',
      fontWeight: 'unset'
    }
  }
})