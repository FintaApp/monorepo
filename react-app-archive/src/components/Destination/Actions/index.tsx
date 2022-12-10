import {
  HStack
} from "@chakra-ui/react";
import { Integrations_Enum } from "src/graphql";
import { DestinationModel } from "src/types";

import { DeleteDestination } from "./DeleteDestination";
import { DestinationLink } from "./DestinationLink";
import { RefreshDestination } from "./RefreshDestination";

export const DestinationActions = ({ destination }: { destination: DestinationModel }) => {
  return (
    <HStack justifyContent = "flex-end" width = "full">
      { destination.integration.id !== Integrations_Enum.Coda && <RefreshDestination destination = { destination } /> }
      <DestinationLink destination = { destination } />
      <DeleteDestination destination = { destination } />
    </HStack>
  )
}