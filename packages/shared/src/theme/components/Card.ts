import { StyleFunctionProps, theme } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

const baseTheme = theme.components.Card;

export const Card = {
  ...baseTheme,
  baseStyle: (props: StyleFunctionProps) => ({
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
}