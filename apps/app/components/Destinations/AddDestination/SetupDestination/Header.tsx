import {
  Heading,
  HStack,
  Icon,
  VStack
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@radix-ui/react-icons";
import { Integration } from "@prisma/client";

import { Logo } from "~/components/Common/Logo";
import { IntegrationLogo } from "~/components/Common/IntegrationLogo";
import { integrationsMeta } from "~/lib/integrations/meta";

const imageProps = {
  width: "75px",
  height: "75px",
  shadow: "base",
  rounded: "md",
  p: 1
}

export const Header = ({ integration }: { integration: Integration}) => (
  <VStack>
    <HStack spacing = "4">
      <Logo variant = "symbol" { ...imageProps } />
      <Icon as = { TriangleUpIcon } transform = "rotate(90deg)" />
      <IntegrationLogo integration = { integration } { ...imageProps } />
    </HStack>

    <Heading size = "md" fontWeight = "normal">Connect to { integrationsMeta[integration].name }</Heading>
  </VStack>
)