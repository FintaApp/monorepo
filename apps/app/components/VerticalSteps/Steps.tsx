import { Children, useMemo } from "react";

import { StepContext } from "./StepContext";

import { StepConnector } from "./StepConnector";

export interface StepsProps {
  activeStep: number;
  children: any;
}

export const Steps = ({ activeStep, children }: StepsProps) => {
  const steps = useMemo(() => 
    Children.toArray(children).map((step, i, arr) => (
      <StepContext.Provider
        key = { i }
        value = {{
          isActive: activeStep === i,
          isCompleted: activeStep > i,
          isLastStep: arr.length !== i + 1,
          step: i + 1
        }}
      >
        { step }
        { arr.length !== i + 1 && <StepConnector /> }
      </StepContext.Provider>
    )),
    [ activeStep, children ]);

    return <>{ steps }</>
}