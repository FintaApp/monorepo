import {
  Button,
  HStack,
  Stack,
  Text
} from "@chakra-ui/react";

import { Step, StepContent } from "~/components/VerticalSteps";

export interface CodaSetupProps {
  onBack: () => void;
  onClose?: () => void;
  setActiveStep: (step: number) => void
}

 export const CodaSetup = ({ onClose, onBack, setActiveStep }: CodaSetupProps) => (
  <Step title = "Connect Finta to Coda" setActiveStep = { setActiveStep }>
    <StepContent>
        <Stack shouldWrapChildren spacing = "4">
          <Text textAlign = "center">Follow the steps in the budget template to connect your Finta account to Coda.</Text>
          <HStack justifyContent = "space-between">
            <Button size = "sm" variant = "ghost" onClick = { onBack }>Back</Button>
            <Button size = "sm" onClick = { onClose } variant = "primary">Close</Button>
          </HStack>
        </Stack>
    </StepContent>
  </Step>
)