import { 
  Box,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text, VStack,HStack, Accordion, useColorModeValue as mode
} from "@chakra-ui/react";
import moment from "moment-timezone";

import { 
  DestinationName,
  SyncStartDate,
  DestinationAuthentication,
  DestinationAccounts,
  DestinationActions,
  TableConfigs
} from "~/components/Destinations/Destination";
import { AccordionItem } from "~/components/AccordionItem"
import { IntegrationLogo } from "~/components/IntegrationLogo";
import { DividerWithText } from "~/components/DividerWithText";
import { DestinationModel } from "~/types/frontend";
import { Integrations_Enum } from "~/graphql/frontend";

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
            <DestinationName.Update destination = { destination } />
            <SyncStartDate destination = { destination } />
          </SimpleGrid>

          <AccordionItem
            buttonLabel = { `${totalAccounts} account${totalAccounts === 1 ? "" : "s"} syncing` }
            buttonChildren = { <></> }
          >
            <DestinationAccounts destination = { destination } />
          </AccordionItem>

        </VStack>

        {/* Accounts List */}

          { destination.integration.id !== Integrations_Enum.Coda && (
            <AccordionItem
              buttonLabel = "Credentials"
              buttonChildren = {<></>}
            >
              <DestinationAuthentication destination = { destination } />
            </AccordionItem>
          )}

        <DividerWithText text = "Table Configurations" />
          <TableConfigs 
            destination = { destination }
            tableConfigs = { destination.table_configs }
            credentials = { destination.authentication }
            integrationId = { destination.integration_id }
          />
        </Accordion>
      </CardBody>
    </Card>
  )
}