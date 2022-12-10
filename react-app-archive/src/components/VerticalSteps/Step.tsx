import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Circle,
  Collapse,
  Heading,
  HStack,
  Icon,
  useColorModeValue as mode
} from "@chakra-ui/react";

import { useStep } from "./useStep";

export interface StepProps extends BoxProps {
  title: string;
  children: any;
  setActiveStep: (step: number) => void
}

export const Step = ({ title, children, setActiveStep, ...props }: StepProps) => {
  const { isActive, isCompleted, step } = useStep();
  const activeTextColor = mode("gray.light.12", "gray.dark.12");
  const mutedTextColor = mode("gray.light.11", "gray.dark.11");

  const activeComponentColor = mode("primary.light.9", "primary.dark.9")

  return (
    <Box { ...props }>
      <HStack spacing = "4">
        <Circle
          size = "8"
          fontWeight = "bold"
          color = { isActive ? activeTextColor : isCompleted ? activeComponentColor : mutedTextColor }
          bg = { isActive ? activeComponentColor : 'inherit' }
          borderColor = { isCompleted ? activeComponentColor : 'inherit' }
          borderWidth = { isActive ? '0px' : '1px' }
        >
          { isCompleted ? <Icon as = { CheckIcon } /> : step }
        </Circle>
        <Heading
          fontSize = "lg"
          fontWeight = "semibold"
          color = { isActive || isCompleted ? activeTextColor : mutedTextColor }
          cursor = { isCompleted ? 'pointer' : 'default' }
          _hover = {{
            color: isCompleted ? activeComponentColor : (isActive ? activeTextColor : mutedTextColor)
          }}
          onClick = { isCompleted ? () => setActiveStep(step-1) : undefined }
        >{ title }</Heading>
      </HStack>
      <Collapse in = { isActive }>{ children }</Collapse>
    </Box>
  )
}