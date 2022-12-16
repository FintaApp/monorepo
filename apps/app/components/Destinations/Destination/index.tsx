import { 
  Box,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text, VStack,HStack, Accordion, useColorModeValue as mode
} from "@chakra-ui/react";
import moment from "moment-timezone";

import { AccordionItem } from "~/components/AccordionItem"
import { IntegrationLogo } from "~/components/IntegrationLogo";
import { DividerWithText } from "~/components/DividerWithText";
import { DestinationModel } from "~/types/frontend";
import { Integrations_Enum } from "~/graphql/frontend";

import { DestinationAccounts } from "./Accounts";
import { DestinationActions } from "./Actions";
import { DestinationAuthentication } from "./Authentication";
import { DestinationName } from "./DestinationName";
import { SyncStartDate } from "./SyncStartDate";
import { TableConfigs } from "./TableConfigs";

export { DestinationAccounts,DestinationActions, DestinationAuthentication, DestinationName, SyncStartDate, TableConfigs }

export const Destination = ({ destination }: { destination: DestinationModel }) => {
  const totalAccounts = destination.account_connections.length;

  return (
    <Card size = 'md' width = "full">
      <CardHeader>
        <HStack justifyContent = "space-between">
          <HStack width = "full">
            <Box rounded = "full" p = "1" shadow = { mode('xs', 'dark.xs') }>
            <IntegrationLogo 
              integration = { destination.integration } 
              h = {{ base: 6, md: 8 }} 
              w = "auto" 
            />
            </Box>
            <Text width = "full" fontWeight = "semibold">{ destination.name }</Text>
          </HStack>

          <DestinationActions destination = { destination } />
        </HStack>
      </CardHeader>
      <CardBody>
        <Text width = "full" fontSize = "sm" variant = "helper">Created { moment(destination.created_at).format("LL") }</Text> 
        <Accordion allowToggle>
        <VStack mt = "4" spacing = "4">
          <SimpleGrid width = "full" columns = {{ base: 1, md: 2 }} spacing = "2">
            <DestinationName destinationId = { destination.id } value = { destination.name } />
            <SyncStartDate destinationId = { destination.id } value = { new Date(destination.sync_start_date) } integrationId = { destination.integration_id } />
          </SimpleGrid>

          <AccordionItem
            buttonLabel = { `${totalAccounts} account${totalAccounts === 1 ? "" : "s"} syncing` }
            buttonChildren = { <></> }
          >
            <DestinationAccounts destinationId = { destination.id } selectedAccountIds = { destination.account_connections.map(ac => ac.account.id) } />
          </AccordionItem>

        </VStack>

        {/* Accounts List */}

          { destination.integration.id !== Integrations_Enum.Coda && (
            <AccordionItem
              buttonLabel = "Credentials"
              buttonChildren = {<></>}
            >
              <DestinationAuthentication destinationId = { destination.id } authentication = { destination.authentication } integrationId = { destination.integration_id } />
            </AccordionItem>
          )}

        <DividerWithText text = "Table Configurations" />
          <TableConfigs 
            destinationId = { destination.id }
            tableConfigs = { destination.table_configs }
            authentication = { destination.authentication }
            integrationId = { destination.integration_id }
          />
        </Accordion>
      </CardBody>
    </Card>
  )
}