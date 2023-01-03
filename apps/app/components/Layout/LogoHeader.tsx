import { VStack } from "@chakra-ui/react";

import { Heading } from "../Common/Heading";
import { Logo, LogoProps } from "../Common/Logo";

interface LogoHeaderProps extends LogoProps {
  title: string;
}

export const LogoHeader = ({ title, variant, ...imageProps }: LogoHeaderProps) => (
  <VStack>
      <Logo
        variant = { variant || 'full' }
        mb = {{ base: '4', md: '6' }} 
        mx = "auto"
        height = '4rem'
        width = 'auto'
        { ...imageProps }
      />
    
    <Heading variant = 'h2'>{ title }</Heading>
  </VStack>
)