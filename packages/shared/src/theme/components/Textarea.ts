import { SystemStyleInterpolation } from "@chakra-ui/react";

const variants: Record<string, SystemStyleInterpolation> = {
  styled: {
    border: "none",
    resize: "none",
    fontSize: "sm"
  }
}

export const Textarea = {
  defaultProps: {
    variant: "styled"
  },
  variants
}