import { 
  Accordion, 
  Card,
  CardBody,
  VStack 
} from "@chakra-ui/react";

import { EmptyState } from "~/components/EmptyState";

import { Destination } from "./Destination";
import { useGetDestinationsSubscription } from "~/graphql/frontend";
import { DestinationModel } from "~/types/frontend";

export const DestinationsList = () => {
  const { data, loading } = useGetDestinationsSubscription();
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
      <CardBody>
        <EmptyState 
          title = "No destinations"
          icon = { "/icons/sync.svg" }
          callToAction = "Click the button above to connect your first destination."
        />
      </CardBody>
    </Card>
  )
};