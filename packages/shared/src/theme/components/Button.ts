import { StyleFunctionProps, theme } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Button = {
  ...theme.components.Button,
  baseStyle: {
    _focus: {
      boxShadow: "none"
    },
    rounded: '4px'
  },
  defaultProps: {
    size: "sm"
  },
  variants: {
    primary: (props: StyleFunctionProps) => ({
      color: 'white',
      bg: mode('primary.light.9', 'primary.dark.9')(props),
      _hover: {
        bg: mode('primary.light.10', 'primary.dark.10')(props),
        _disabled: {
          bg: mode('primary.light.9', 'primary.dark.9')(props)
        }
      }
    }),
    primaryOutline: (props: StyleFunctionProps) => ({
      color: mode('primary.light.11', 'primary.dark.11')(props),
      border: '1px',
      bg: mode('primary.light.1', 'primary.dark.1')(props),
      borderColor: mode('primary.light.8', 'primary.dark.8')(props),
      _hover: {
        borderColor: mode('primary.light.9', 'primary.dark.9')(props),
        _disabled: {
          borderColor: mode('primary.light.8', 'primary.dark.8')(props),
        }
      }
    }),
    danger: (props: StyleFunctionProps) => ({
      color: 'white',
      bg: mode('tomato.light.9', 'tomato.dark.9')(props),
      _hover: {
        bg: mode('tomato.light.10', 'tomato.dark.10')(props),
        _disabled: {
          bg: mode('tomato.light.9', 'tomato.dark.9')(props)
        }
      }
    }),
    dangerOutline: (props: StyleFunctionProps) => ({
      color: mode('tomato.light.11', 'tomato.dark.11')(props),
      border: '1px',
      bg: mode('tomato.light.1', 'tomato.dark.1')(props),
      borderColor: mode('tomato.light.7', 'tomato.dark.7')(props),
      _hover: {
        borderColor: mode('tomato.light.8', 'tomato.dark.8')(props),
        _disabled: {
          borderColor: mode('tomato.light.7', 'tomato.dark.7')(props),
        }
      }
    }),
    icon: (props: StyleFunctionProps) => ({
      width: 10,
      height: 10,
      p: 1,
      fontSize: 'md',
      rounded: 'full',
      color: mode(`gray.light.12`, `gray.dark.12`)(props),
      _hover: {
        bg: mode(`gray.light.4`, `gray.dark.4`)(props),
      },
      _active: { bg: mode(`gray.light.5`, `gray.dark.5`)(props) },
    }),
    primaryIcon: (props: StyleFunctionProps) => ({
      width: 10,
      height: 10,
      p: 1,
      fontSize: 'md',
      rounded: 'full',
      bg: mode(`primary.light.3`, `primary.dark.3`)(props),
      color: mode(`gray.light.12`, `gray.dark.12`)(props),
      _hover: {
        bg: mode(`primary.light.4`, `primary.dark.4`)(props),
      },
      _active: { bg: mode(`primary.light.5`, `primary.dark.5`)(props) },
    })
  }
}