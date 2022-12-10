import { 
  Accordion, 
  VStack 
} from "@chakra-ui/react";

import { Card } from "src/components/Card";
import { EmptyState } from "src/components/EmptyState";
import syncIcon from "src/images/icons/sync.svg";

import { Destination } from "./Destination";
import { useGetDestinationsQuery } from "src/graphql";
import { DestinationModel } from "src/types";

export const DestinationsList = () => {
  const { data, loading } = useGetDestinationsQuery();
  const destinations = data?.destinations.filter(destination => !destination.disabled_at) as DestinationModel[] || [];

  if ( loading ) { return <></> };
  return destinations.length > 0 ? (
    <Accordion mb = "10" defaultIndex={ destinations.map((_, idx) => idx) } allowMultiple width = "full">
      <VStack spacing = "4">
        { [...destinations]
          .filter(destination => !destination.disabled_at)
          .sort((d1, d2) => d1.created_at > d2.created_at ? 1 : -1)
          .map(destination => <Destination key = { destination.id } destination = { destination } /> )}
      </VStack>
    </Accordion>
  ) : (
    <Card width = "full">
      <EmptyState 
        title = "No destinations"
        icon = { syncIcon }
        callToAction = "Click the button above to connect your first destination."
      />
    </Card>
  )
};