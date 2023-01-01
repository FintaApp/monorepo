import {
  SimpleGrid,
  Text,
  VStack
} from "@chakra-ui/react";
import { useGetIntegrationsQuery } from "~/graphql/frontend";

import { LargeIconButton } from "~/components/LargeIconButton";
import { IntegrationModel } from "~/types/frontend/models";
import { IntegrationLogo } from "~/components/Common/IntegrationLogo";

export const SelectIntegration = ({ onSelectIntegration }: { onSelectIntegration: (integration: IntegrationModel) => void; }) => {
  const { data } = useGetIntegrationsQuery();
  const integrations = data?.integrations as IntegrationModel[] || [];

  return (
    <VStack spacing = "4">
      <Text>Send your financial data to any of these integrations.</Text>
      <SimpleGrid spacing = "2" columns = {{ base: 1, sm: 2 }}>
        { integrations.map(integration => (
          <LargeIconButton
            key = { integration.id }
            label = { integration.name }
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