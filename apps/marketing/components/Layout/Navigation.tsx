import { Button, HStack, useBreakpointValue } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Logo } from "../Logo";

export const Navigation = () => {
  const logoVariant = useBreakpointValue({ base: 'symbol' as 'symbol', md: 'full' as 'full'})
  const router = useRouter()
  const currentPage = router.pathname;

  return (
    <HStack 
      justifyContent = 'space-between'
      width = "full"
      py = { 4 }
      px = { 2 }
    >
      <HStack>
        <Logo 
          onClick = { () => router.push('/') } 
          variant = { logoVariant }
          width = {{ base: 8, md: '10rem'}}
          height = {{ base: 8, md: 'auto' }}
        />
      </HStack>
      <HStack>
        <Button 
          as = { NextLink }
          href = "https://app.finta.io/login"
        >Log In</Button>
        <Button 
          as = { NextLink }
          href = "https://app.finta.io/signup"
          variant = "primary"
        >Sign Up</Button>
      </HStack>
    </HStack>
  )
}