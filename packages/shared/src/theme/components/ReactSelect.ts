import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const ReactSelect = {
  baseStyle: (props: StyleFunctionProps) => ({
    container: {
      width: "full",
      rounded: "sm"
    },
    control: {
      minHeight: "unset",
      border: "1px",
      borderColor: mode("gray.light.7 !important", "gray.dark.7 !important")(props),
      boxShadow: "none",
      bg: mode('gray.light.0', 'gray.dark.4')(props),
      _hover: {
        shadow: mode("light.sm", "dark.sm")(props),
        borderColor: mode("gray.light.8", "gray.dark.8")(props),
        cursor: "pointer",
      },
      _active: {
        shadow: mode("light.sm", "dark.sm")(props)
      },
      _focus: {
        shadow: mode("light.sm", "dark.sm")(props),
        borderColor: mode("gray.light.8", "gray.dark.8")(props),
      },
      rounded: "sm"
    },
    input: {
      display: "inline-flex",
      px: "2",
      rounded: "md",
      verticalAlign: "top",
      height: "full",
      lineHeight: "1.2",
      justifyContent: "flex-start",
      outline: "2px solid transparent",
      outlineOffset: "2px",
      minHeight: "1.7rem",
      alignItems: "center",
      color: mode('gray.light.12', 'gray.dark.12')(props)
    },
    menu: {
      bg: mode('gray.light.0', 'gray.dark.4')(props),
      boxShadow: mode('light.md', 'dark.lg')(props),
      rounded: "sm",
      zIndex: 100
    },
    option: {
      borderLeft: "2px",
      bg: mode('gray.light.0', 'gray.dark.4')(props),
      borderColor: "transparent",
      _active: {
        bg: mode('primary.light.4', 'primary.dark.4')(props)
      },
      fontSize: "sm",
      color: mode('gray.light.12', 'gray.dark.12')(props)
    },
    placeholder: {
      opacity: "0.8"
    },
    focusedOption: {
      bg: mode('primary.light.4', 'primary.dark.4')(props),
      borderColor: mode('primary.light.5', 'primary.dark.5')(props),
      color: mode('gray.light.12', 'gray.dark.12')(props)
    },
    selectedOption: {
      bg: mode('primary.light.6', 'primary.dark.6')(props),
      color: mode('gray.light.12', 'gray.dark.12')(props)
    },
    singleValue: {
      px: "2",
      color: mode('gray.light.12', 'gray.dark.12')(props)
    },
    valueContainer: {
      px: "0",
      rounded: "sm"
    }
  })
};