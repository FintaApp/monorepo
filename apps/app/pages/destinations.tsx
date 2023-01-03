import { PageHeader } from "~/components/Layout/PageHeader";
import { Accordion, Fade, VStack } from "@chakra-ui/react";

import { AnalyticsPage } from "~/lib/analytics";
import { EmptyState } from "~/components/Common/EmptyState";
import { Destination, AddDestination } from "~/components/Destinations";
import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";
import { trpc } from "~/lib/trpc";
import { useMemo } from "react";

const Destinations = () => {
  const { isAuthenticated } = useUser();
  const { data, isLoading } = trpc.destinations.getAllDestinations.useQuery(undefined, { enabled: isAuthenticated });
  const destinationIds = useMemo(() => data?.map(d => d.id), [ data ]);

  return (
    <>
      <PageHeader title = "Destinations"><AddDestination /></PageHeader>
      <Fade in = { !isLoading }>
        {
          destinationIds?.length === 0
            ? <EmptyState
                title = "No destinations"
                icon = { "/icons/sync.svg" }
                callToAction = "Click the button above to connect your first destination."
              />
            : (
              <Accordion mb = "10" defaultIndex={ destinationIds?.map((_, idx) => idx) } allowMultiple width = "full">
                <VStack spacing = "6" mb = "10">
                  { destinationIds?.map(id => <Destination key = { id } id = { id } /> )}
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