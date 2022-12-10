import { Button, ButtonGroup, HStack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';

import * as analytics from "src/lib/analytics";
import { Card } from "src/components/Card";
import { EmptyState } from "src/components/EmptyState";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { Page, PageHeader } from "src/components/Page";
import syncIcon from "src/images/icons/sync.svg";

import { SyncLogsList } from "./SyncLogsList";
import { useGetSyncLogsQuery } from "src/graphql";
import { SyncLogModel } from "src/types";

export const SyncLogs = () => {
  const [ offset, setOffset ] = useState(0)
  const { data, refetch, loading: isLoading } = useGetSyncLogsQuery({ variables: { offset }});
  const totalCount = data?.count.aggregate?.count || 0;

  useEffect(() => {
    analytics.page({ name: analytics.PageNames.SYNC_LOGS });
  }, []);

  const pageSize = 10;
  const hasMore = ((offset + 1) * pageSize) <= totalCount;
  
  return (
    <Page>
      <PageHeader title = "Sync Logs">
        <Button onClick = { () => refetch() } variant = "primary">Refresh</Button>
      </PageHeader>
      { isLoading ? <LoadingSpinner /> : totalCount === 0 
        ? (
          <Card width = "full">
            <EmptyState
              title = "Waiting for the first sync..."
              callToAction = "Come back after the first destination sync to see the sync logs"
              icon = { syncIcon }
            />
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
    </Page>
  )
}