import { Center, keyframes, useColorModeValue as mode } from "@chakra-ui/react";

import { Logo } from "../Logo";

const pulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.10)' },
  '100%': { transform: 'scale(1)' }
});


export const LoadingIndicator = () => (
  <Center aria-label = "Loading" height = "100vh" bg = { mode("gray.light.1", "gray.dark.2") } >
    <Logo 
      variant = 'symbol'
      transitionProperty = "-webkit-transform"
      bg = "transparent"
      alt = "Finta Logo" 
      animation = { `${pulse} 2s infinite linear`} 
      boxSize = "150px"
      filter = "drop-shadow(0px 4px 8px rgb(0 0 0 / 0.4))"
      />
  </Center>
)