import {
  Heading,
  HStack,
  Icon,
  VStack
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@radix-ui/react-icons";

import { Logo } from "~/components/Logo";
import { IntegrationLogo } from "~/components/Common/IntegrationLogo";
import { IntegrationModel } from "~/types/frontend/models";

const imageProps = {
  width: "75px",
  height: "75px",
  shadow: "base",
  rounded: "md",
  p: 1
}

export const Header = ({ integration }: { integration: IntegrationModel}) => (
  <VStack>
    <HStack spacing = "4">
      <Logo variant = "symbol" { ...imageProps } />
      <Icon as = { TriangleUpIcon } transform = "rotate(90deg)" />
      <IntegrationLogo integration = { integration } { ...imageProps } />
    </HStack>

    <Heading size = "md" fontWeight = "normal">Connect to { integration.name }</Heading>
  </VStack>
)