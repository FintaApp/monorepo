import { createContext } from "react";

export type StepContent = {
  isActive: boolean;
  isCompleted: boolean;
  isLastStep: boolean;
  step: number;
} | null;

export const StepContext = createContext<StepContent>(null);