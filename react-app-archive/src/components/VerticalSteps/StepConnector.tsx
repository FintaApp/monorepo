import { Box, useColorModeValue as mode } from "@chakra-ui/react";

import { useStep } from "./useStep";

export const StepConnector = () => {
  const { isCompleted, isActive } = useStep();
  const accentColor = mode("primary.light.6", "primary.dark.6");

  return (
    <Box
      borderStartWidth = "1px"
      borderStartColor = { isCompleted ? accentColor : "inherit"}
      height = "6"
      mt = { isActive ? '0' : '2' }
      mb = "2"
      ms = "4"
      ps = "4"
    />
  )
}