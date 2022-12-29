import { avatarAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(avatarAnatomy.keys)

const baseStyle = definePartsStyle(({ colorMode }) => ({
  container: {
    bg: colorMode === 'light' ? 'primary.light.4' : 'primary.dark.4',
    color: colorMode === 'light' ? 'gray.light.12' : 'gray.dark.12'
  }
}))

export const Avatar: any = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    size: 'sm'
  }
});