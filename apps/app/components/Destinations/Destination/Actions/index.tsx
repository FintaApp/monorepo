import {
  HStack
} from "@chakra-ui/react";
import { Integrations_Enum } from "~/graphql/frontend";
import { DestinationModel } from "~/types/frontend";

import { DeleteDestination } from "./DeleteDestination";
import { DestinationLink } from "./DestinationLink";
import { RefreshDestination } from "./RefreshDestination";

export const DestinationActions = ({ destination }: { destination: DestinationModel }) => {
  return (
    <HStack justifyContent = "flex-end" width = "full">
      { destination.integration.id !== Integrations_Enum.Coda && <RefreshDestination destinationId = { destination.id } syncStartDate = { destination.sync_start_date } /> }
      <DestinationLink authentication = { destination.authentication } integrationId = { destination.integration_id} />
      <DeleteDestination destinationId = { destination.id } />
    </HStack>
  )
}