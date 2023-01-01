import { 
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  VStack,
  HStack, 
  Accordion
} from "@chakra-ui/react";

import { DestinationAccounts } from "./Accounts";
import * as Actions from "./Actions";
import { CreatedAt } from "./CreatedAt";
import { DestinationCredentials } from "./Credentials";
import { DestinationName } from "./DestinationName";
import { Header } from "./Header";
import { SyncStartDate } from "./SyncStartDate";
import { TableConfigs } from "./TableConfigs";
import { DestinationProvider } from "../context";

export { DestinationAccounts, DestinationCredentials, DestinationName, SyncStartDate, TableConfigs }

export const Destination = ({ id }: { id: string }) => {
  return (
    <Card size = 'md' width = "full">
      <DestinationProvider id = { id } isSetupMode = { false }>
        <CardHeader>
          <HStack justifyContent = "space-between">
            <Header />  

            <HStack justifyContent = "flex-end" width = "full">
              <Actions.Sync />
              <Actions.Link />
              <Actions.Disable />
            </HStack>
          </HStack>
        </CardHeader>

        <CardBody>
          <CreatedAt />
          <Accordion allowToggle>
            <VStack mt = "4" spacing = "4">
              <SimpleGrid width = "full" columns = {{ base: 1, md: 2 }} spacing = "2">
                <DestinationName />
                <SyncStartDate />
              </SimpleGrid>

              <DestinationAccounts />
              <DestinationCredentials />
              <TableConfigs />
            </VStack>
          </Accordion>
        </CardBody>
      </DestinationProvider>
    </Card>
  )
}