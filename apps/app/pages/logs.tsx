import { useState } from "react";
import { authGate } from "~/lib/authGate";

import { AnalyticsPage } from "~/lib//analytics";
import { PageHeader } from "~/components/Layout/PageHeader";
import { Accordion, Button, ButtonGroup, Fade, HStack, VStack } from "@chakra-ui/react";
import { trpc } from "~/lib/trpc";
import { useUser } from "~/lib/context/useUser";
import { EmptyState } from "~/components/Common/EmptyState";
import { Sync } from "~/components/Syncs";

const Logs = () => {
  const { isAuthenticated } = useUser();
  const [ offset, setOffset ] = useState(0);
  const pageSize = 10;
  const { data, isLoading, refetch, isRefetching } = trpc.syncs.getSyncs.useQuery({ take: pageSize, skip: offset }, { enabled: isAuthenticated })

  const totalSyncs = data?.totalSyncs;
  const syncs = data?.syncs;
  const hasMore = ((offset + 1) * pageSize) <= (totalSyncs || 0)
  return (
    <>
      <PageHeader title = "Syncs">
        <Button isLoading = { isRefetching } onClick = { () => refetch() } variant = "primary">Refresh</Button>
      </PageHeader>

      <Fade in = { !isLoading }>
        {
          syncs?.length === 0
            ? <EmptyState
                title = "Waiting for the first sync..."
                callToAction = "Come back after the first destination sync to see the sync logs"
                icon = { "/icons/sync.svg" }
              />
            : (
              <>
                <Accordion allowToggle>
                  <VStack spacing = "4">
                    { syncs?.map(sync => <Sync sync = { sync } key = { sync.id } /> )}
                  </VStack>
                </Accordion>

                <HStack mt = '8' justifyContent = 'center'>
                  <ButtonGroup spacing = '2' size = 'sm' variant = 'primaryOutline'>
                    <Button onClick = { () => setOffset(prev => prev - 1)} isDisabled = { offset === 0 }>Prev</Button>
                    <Button onClick = { () => setOffset(prev => prev + 1)} isDisabled = { !hasMore }>Next</Button>
                  </ButtonGroup>
                </HStack>
              </>
            )
        }
      </Fade>
    </>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

Logs.analyticsPageName = AnalyticsPage.LOGS
export default Logs;