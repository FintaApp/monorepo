import { useState } from "react";

export const useSteps = ({ initialStep }: { initialStep: number }) => {
  const [ activeStep, setActiveStep ] = useState(initialStep);

  const nextStep = () => setActiveStep(prev => prev + 1);
  const prevStep = () => setActiveStep(prev => prev - 1);
  const reset = () => setActiveStep(0)

  return {
    nextStep,
    prevStep,
    activeStep,
    reset,
    setActiveStep
  }
}