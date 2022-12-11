import { Card, CardBody, Button, ButtonGroup, HStack } from "@chakra-ui/react";
import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { EmptyState } from "~/components/EmptyState";
import { PageHeader } from "~/components/Layout/PageHeader";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { SyncLogsList } from "~/components/SyncLogsList";
import { useGetSyncLogsQuery } from "~/graphql/frontend";
import { SyncLogModel } from "~/types/frontend";

import { AnalyticsPage } from "~/utils/frontend/analytics";

const Logs = () => {
  const [ offset, setOffset ] = useState(0)
  const { data, refetch, loading: isLoading } = useGetSyncLogsQuery({ variables: { offset }});
  const totalCount = data?.count.aggregate?.count || 0;

  const pageSize = 10;
  const hasMore = ((offset + 1) * pageSize) <= totalCount;
  
  return (
    <>
      <PageHeader title = "Sync Logs">
        <Button onClick = { () => refetch() } variant = "primary">Refresh</Button>
      </PageHeader>

      { isLoading ? <LoadingSpinner /> : totalCount === 0 
        ? (
          <Card width = "full">
            <CardBody>
              <EmptyState
                title = "Waiting for the first sync..."
                callToAction = "Come back after the first destination sync to see the sync logs"
                icon = { "/icons/sync.svg" }
              />
            </CardBody>
          </Card>
        ) : (
          <>
            <SyncLogsList 
              syncLogs = { data?.sync_logs as SyncLogModel[] || [] }
            />

            <HStack mt = '8' justifyContent = 'center'>
              <ButtonGroup spacing = '2' size = 'sm' variant = 'primaryOutline'>
                <Button onClick = { () => setOffset(prev => prev - 1)} isDisabled = { offset === 0 }>Prev</Button>
                <Button onClick = { () => setOffset(prev => prev + 1)} isDisabled = { !hasMore }>Next</Button>
              </ButtonGroup>
            </HStack>
          </>
        )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context);

  if ( !nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: `/login?next=${context.resolvedUrl}`,
        permanent: false
      }
    }
  }
  
  return {
    props: {
      showNavigation: true
    }
  }
}

Logs.analyticsPageName = AnalyticsPage.LOGS
export default Logs;