import { Stack, Box, BoxProps } from "@chakra-ui/react";

import { useStep } from "./useStep";

export const StepContent = ({ children, ...props }: BoxProps) => {
  const { isLastStep } = useStep();

  return (
    <Box
      borderStartWidth = { isLastStep ? "1px" : "0" }
      ms = "4"
      mt = "2"
      ps = "8"
      pb = "3"
      fontSize = "sm"
      { ...props }
    >
      <Stack shouldWrapChildren spacing = "4">
        { children }
      </Stack>
    </Box>
  )
}