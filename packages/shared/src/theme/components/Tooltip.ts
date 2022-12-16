import { StyleFunctionProps } from "@chakra-ui/react";
import { mode, cssVar } from '@chakra-ui/theme-tools'

const $bg = cssVar("tooltip-bg");

export const Tooltip = {
  baseStyle: (props: StyleFunctionProps) => ({
    boxShadow: "sm",
    [$bg.variable]: mode('gray.light.1', 'gray.dark.4')(props),
    bg: mode('gray.light.1', 'gray.dark.4')(props),
    color: mode('gray.light.12', 'gray.dark.12')(props),
    p: 1
  })
}