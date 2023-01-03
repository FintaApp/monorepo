import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "./mode";

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode('gray.light.1', 'gray.dark.2')(props),
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    }
  })
};