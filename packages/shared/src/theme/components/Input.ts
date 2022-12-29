import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, theme } from '@chakra-ui/react';

import { mode } from '../mode';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

export const Input: any = defineMultiStyleConfig({
  ...theme.components.Input,
  baseStyle: (props) => {
    const baseStyle = theme.components.Input.baseStyle;
    return {
      ...baseStyle,
      field: {
        ...baseStyle?.field,
        width: 'full'
      }
    }
  },
  defaultProps: {
    size: "sm"
  },
  variants: {
    outline: (props) => {
      const errorColor = mode('tomato.light.7', 'tomato.dark.7')(props);
      const outlineTheme = theme.components.Input.variants?.outline(props);

      return {
        ...outlineTheme,
        field: {
          ...outlineTheme?.field,
          bg: mode("white", "gray.dark.4")(props),
          borderColor: mode("gray.light.7", "gray.dark.7")(props),
          _hover: {
            shadow: mode("light.sm", "dark.sm")(props),
            borderColor: mode("gray.light.8", "gray.dark.8")(props)
          },
          _active: {
            shadow: mode("light.sm", "dark.sm")(props)
          },
          _focus: {
            shadow: mode("light.sm", "dark.sm")(props),
            borderColor: mode("gray.light.8", "gray.dark.8")(props),
            _invalid: {
              borderColor: errorColor,
              boxShadow: "var(--chakra-shadows-light-sm)",
            }
          },
          _invalid: {
            boxShadow: "var(--chakra-shadows-light-sm)",
            borderColor: errorColor
          }
        },
        addon: {
          borderColor: mode("gray.light.7", "gray.dark.7")(props),
          bg: mode("white", "gray.dark.4")(props)
        }
      }
    },
    flushed: (props) => {
      const errorColor = mode('tomato.light.7', 'tomato.dark.7')(props);
      const focusColor = mode('primary.light.7', 'primary.dark.7')(props);
      const flushedTheme = theme.components.Input.variants?.flushed(props);
      return {
        ...flushedTheme,
        field: {
          ...flushedTheme?.field,
          _invalid: {
            borderColor: errorColor
          },
          _focusVisible: {
            borderColor: focusColor,
            boxShadow: `0px 1px 0px 0px ${focusColor}`,
            _hover: {
              borderColor: focusColor,
            }
          },
          _hover: {
            borderColor: mode("gray.light.8", "gray.dark.8")(props)
          }
        }
      }
    }
  }
})