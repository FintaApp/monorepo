import {
  Heading,
  HStack,
  BoxProps,
  useColorModeValue as mode
} from "@chakra-ui/react";

export interface PageHeaderProps extends BoxProps {
  title: string;
}

export const PageHeader = ({ title, ...props }: PageHeaderProps) => (
  <HStack 
    justifyContent = "space-between" 
    alignItems = "center" 
    mb = "6" { ...props }
    bg = { mode('gray.light.1', 'gray.dark.2') }
    position = "sticky"
    top = "0"
    zIndex = {1}
  >
    <Heading variant = "h1" as = "h1">{ title }</Heading>
    { props.children }
  </HStack>
);