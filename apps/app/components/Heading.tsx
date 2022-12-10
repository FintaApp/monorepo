import { Heading as ChakraHeading, HeadingProps as ChakraHeadingProps } from "@chakra-ui/react";

interface HeadingProps extends ChakraHeadingProps{
  variant: 'h1' | 'h2' | 'h3'
}

export const Heading = ({ variant, ...headingProps}: HeadingProps) => <ChakraHeading variant = { variant } as = { variant } { ...headingProps } />