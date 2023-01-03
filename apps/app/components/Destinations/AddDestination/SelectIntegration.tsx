import {
  SimpleGrid,
  Text,
  VStack
} from "@chakra-ui/react";
import { Integration } from "@prisma/client";

import { LargeIconButton } from "~/components/Common/LargeIconButton";
import { IntegrationLogo } from "~/components/Common/IntegrationLogo";
import { integrationsMeta } from "~/lib/integrations/meta";

export const SelectIntegration = ({ onSelectIntegration }: { onSelectIntegration: (integration: Integration) => void; }) => {
  const integrations = Object.values(Integration).sort((i1, i2) => i1 > i2 ? 1 : -1)

  return (
    <VStack spacing = "4">
      <Text>Send your financial data to any of these integrations.</Text>
      <SimpleGrid spacing = "2" columns = {{ base: 1, sm: 2 }}>
        { integrations.map(integration => (
          <LargeIconButton
            key = { integration }
            label = { integrationsMeta[integration].name }
            Icon = { () => <IntegrationLogo width = {{ base: '40px', sm: '50px' }} height = "auto" integration = { integration } /> }
            onClick = { () => onSelectIntegration(integration) }
            description = ""
            size = "sm"
          />
        ))}
      </SimpleGrid>
    </VStack>
  )
}