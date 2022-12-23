import { Box, HStack, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { IntegrationLogo } from "~/components/IntegrationLogo";
import { useDestination } from "../context"

export const Header = () => {
  const { integration, name } = useDestination();
  return (
    <HStack width = "full">
      <Box rounded = "full" p = "1" shadow = { mode('xs', 'dark.xs') }>
        <IntegrationLogo integration = { integration } h = {{ base: 6, md: 8 }} w = "auto" />
      </Box>
      <Text width = "full" fontWeight = "semibold">{ name }</Text>
    </HStack>
  )
}