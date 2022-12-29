import { cssVar, defineStyleConfig } from '@chakra-ui/react';
import { mode } from '../mode';

const $bg = cssVar("tooltip-bg");

export const Tooltip: any = defineStyleConfig({
  baseStyle: (props) => ({
    boxShadow: "sm",
    [$bg.variable]: mode('gray.light.1', 'gray.dark.4')(props),
    bg: mode('gray.light.1', 'gray.dark.4')(props),
    color: mode('gray.light.12', 'gray.dark.12')(props),
    p: 1
  })
})