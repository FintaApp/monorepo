import { useEffect } from "react";
import { useBoolean, useBreakpointValue } from "@chakra-ui/react";

export const useMobileMenuState = () => {
  const [ isMenuOpen, actions ] = useBoolean();
  const isMobileBreakpoint = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    if ( !isMobileBreakpoint ) {
      actions.off();
    }
  }, [ isMobileBreakpoint, actions ]);

  return {
    isMenuOpen,
    ...actions
  }
}