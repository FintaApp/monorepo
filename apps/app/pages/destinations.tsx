import { PageHeader } from "~/components/Layout/PageHeader";
import { Accordion, Fade, VStack } from "@chakra-ui/react";

import { useGetDestinationsSubscription } from "~/graphql/frontend";
import { DestinationModel } from "~/types/frontend";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { EmptyState } from "~/components/Common/EmptyState";
import { Destination, AddDestination } from "~/components/Destinations";
import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";

const Destinations = () => {
  const { isAuthenticated } = useUser();
  const { data } = useGetDestinationsSubscription({ skip: !isAuthenticated });
  const destinations = data?.destinations as DestinationModel[] || [];

  return (
    <>
      <PageHeader title = "Destinations"><AddDestination /></PageHeader>

      <Fade in = { isAuthenticated && !!destinations }>
        { destinations?.length === 0 
          ? <EmptyState 
              title = "No destinations"
              icon = { "/icons/sync.svg" }
              callToAction = "Click the button above to connect your first destination."
            />
          : (
              <Accordion mb = "10" defaultIndex={ destinations?.map((_, idx) => idx) } allowMultiple width = "full">
                <VStack spacing = "6" mb = "10">
                  { destinations?.map(destination => <Destination key = { destination.id } destination = { destination } />)}
                </VStack>
              </Accordion>
            )
        }
      </Fade>
    </>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

Destinations.analyticsPageName = AnalyticsPage.DESTINATIONS
export default Destinations;