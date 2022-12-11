import { 
  Heading,
  HStack,
  VStack
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";

import { IntegrationLogo } from "../../IntegrationLogo";
import { Logo } from "~/components/Logo";
import { IntegrationModel } from "~/types/frontend/models";

const imageProps = {
  width: "75px",
  height: "75px",
  shadow: "base",
  rounded: "md",
  p: 1
}

export const Header = ({ integration }: { integration: IntegrationModel }) => (
  <VStack>
    <HStack spacing = "4">
      <Logo variant = "symbol" { ...imageProps } />
      <TriangleUpIcon transform = "rotate(90deg)" />
      <IntegrationLogo integration = { integration } { ...imageProps } />
    </HStack>
    <Heading size = "md" fontWeight = "normal">Connect to { integration.name }</Heading>
  </VStack>
)