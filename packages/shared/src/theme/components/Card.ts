import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, theme } from '@chakra-ui/react';
import { mode } from '../mode';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseTheme = theme.components.Card;

export const Card: any = defineMultiStyleConfig({
  ...baseTheme,
  baseStyle: (props) => ({
    ...baseTheme.baseStyle,
    container: {
      ...baseTheme.baseStyle?.container,
      backgroundColor: mode('white', 'gray.dark.4')(props)
    },
    header: {
      ...baseTheme.baseStyle?.header,
      borderBottom: '1px',
      borderColor: mode("gray.light.6", "transparent")(props)
    }
  })
})