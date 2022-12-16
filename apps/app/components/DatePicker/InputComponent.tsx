import { Input, forwardRef } from "@chakra-ui/react";

export const InputComponent = forwardRef(({ ...props }, ref) => (
    <Input 
      ref = { ref }
      { ...props }
    />
));